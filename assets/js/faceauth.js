// ============================================================
//  BioSigLab — Reconocimiento Facial + Anti-Spoofing + MySQL
//  Liveness v2: detección por movimiento de cabeza (nariz)
//  Reemplaza EAR (parpadeo) que fallaba con iluminación variable
// ============================================================

const FaceAuth = (() => {

    const LS_KEY        = "biosiglab_face_descriptor";
    const LS_ADMIN      = "biosiglab_admin_id";
    const API           = "http://localhost/biosiglab_db/php/biometria.php";
    const MODELS_URL    = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
    const CAPTURE_COUNT = 12;
    const MATCH_THRESH  = 0.40;

    // ── Parámetros de liveness por movimiento ────────────────
    // El usuario debe mover la cabeza LEFT → CENTER o RIGHT → CENTER
    // Se mide la posición X normalizada de la nariz (landmark 30)
    // relativa al ancho del bounding box de la cara.
    // Esto es invariante a distancia y a iluminación.
    const MOVE_FRAME_MS  = 80;    // ~12 fps
    const MOVES_REQUIRED = 2;     // 2 movimientos completos (salir del centro y regresar)
    const MOVE_THRESHOLD = 0.12;  // desplazamiento mínimo normalizado para contar un giro
    const MAX_FRAMES     = 300;   // ~24 segundos máximo

    let modelsLoaded = false;
    let videoStream  = null;

    // ── Modelos ───────────────────────────────────────────────
    async function loadModels() {
        if (modelsLoaded) return;
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL);
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL);
        modelsLoaded = true;
    }

    // ── Cámara ────────────────────────────────────────────────
    async function startCamera(el) {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240, facingMode: "user" }
        });
        el.srcObject = videoStream;
        await new Promise(r => el.onloadedmetadata = r);
        await el.play();
    }
    function stopCamera() {
        if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; }
    }

    // ── Detección ─────────────────────────────────────────────
    async function detectFace(el) {
        const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
        return await faceapi.detectSingleFace(el, opts).withFaceLandmarks(true).withFaceDescriptor();
    }

    // Solo landmarks (más rápido, sin descriptor) para liveness
    async function detectFaceFast(el) {
        const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.4 });
        return await faceapi.detectSingleFace(el, opts).withFaceLandmarks(true);
    }

    // ── Posición nasal normalizada ────────────────────────────
    // Devuelve la posición X de la nariz (landmark 30) normalizada
    // entre 0 (borde izquierdo de la cara) y 1 (borde derecho).
    // Usar el bounding box hace el valor robusto a zoom y distancia.
    function getNoseX(detection) {
        const box  = detection.detection.box;
        const nose = detection.landmarks.positions[30]; // punta de la nariz
        return (nose.x - box.x) / box.width;            // 0 = izquierda, 1 = derecha
    }

    // ── Storage local ─────────────────────────────────────────
    function hasDescriptor() { return !!localStorage.getItem(LS_KEY); }
    function saveLocal(d)    { localStorage.setItem(LS_KEY, JSON.stringify(Array.from(d))); }
    function loadLocal()     { const r = localStorage.getItem(LS_KEY); return r ? new Float32Array(JSON.parse(r)) : null; }
    function clearLocal()    { localStorage.removeItem(LS_KEY); }

    // ── Sincronizar con MySQL ─────────────────────────────────
    async function syncToDb(descriptor) {
        const adminId = localStorage.getItem(LS_ADMIN);
        if (!adminId) return;
        try {
            await fetch(`${API}?action=guardar_rostro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ admin_id: parseInt(adminId), descriptor: Array.from(descriptor) })
            });
        } catch (e) { console.warn("No se pudo guardar en BD:", e); }
    }

    async function loadFromDb(usuario) {
        try {
            const res  = await fetch(`${API}?action=obtener_por_usuario&usuario=${encodeURIComponent(usuario)}`);
            const json = await res.json();
            if (json.ok && json.data.face_descriptor && json.data.face_descriptor.length === 128) {
                const desc = new Float32Array(json.data.face_descriptor);
                saveLocal(desc);
                localStorage.setItem(LS_ADMIN, json.data.id_admin);
                return desc;
            }
        } catch (e) { console.warn("No se pudo cargar desde BD:", e); }
        return null;
    }

    async function clearFromDb() {
        const adminId = localStorage.getItem(LS_ADMIN);
        if (!adminId) return;
        try {
            await fetch(`${API}?action=eliminar_rostro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ admin_id: parseInt(adminId) })
            });
        } catch(e) {}
    }

    // ── ENTRENAR ──────────────────────────────────────────────
    async function train(videoEl, onProgress) {
        await loadModels();
        const descs = [];
        while (descs.length < CAPTURE_COUNT) {
            const det = await detectFace(videoEl);
            if (det) { descs.push(det.descriptor); onProgress(descs.length, CAPTURE_COUNT); }
            await sleep(180);
        }
        const avg = new Float32Array(128);
        for (const d of descs) d.forEach((v, i) => avg[i] += v);
        avg.forEach((v, i) => avg[i] = v / descs.length);
        saveLocal(avg);
        await syncToDb(avg);
        return avg;
    }

    // ── LIVENESS: movimiento de cabeza ────────────────────────
    //
    // Máquina de estados:
    //   "center"  → nariz cerca del centro calibrado
    //   "left"    → nariz se desplazó a la izquierda (delta < -MOVE_THRESHOLD)
    //   "right"   → nariz se desplazó a la derecha  (delta >  MOVE_THRESHOLD)
    //
    // Ciclo completo: center → left/right → center = 1 movimiento
    // Se necesitan MOVES_REQUIRED ciclos para aprobar liveness.
    //
    async function livenessCheck(videoEl, onStatus) {
        if (onStatus) onStatus("Calibrando… mira directo a la cámara", "loading");

        // Fase 1: calibrar posición central (promedio de 12 frames)
        const centerSamples = [];
        let attempts = 0;
        while (centerSamples.length < 12 && attempts < 35) {
            const det = await detectFaceFast(videoEl);
            attempts++;
            if (det) centerSamples.push(getNoseX(det));
            await sleep(MOVE_FRAME_MS);
        }

        if (centerSamples.length < 5) {
            return false; // no se pudo detectar cara
        }

        const centerX = centerSamples.reduce((a, b) => a + b, 0) / centerSamples.length;
        console.log(`BioSigLab liveness: centro calibrado noseX=${centerX.toFixed(3)}`);

        // Fase 2: detectar movimientos
        if (onStatus) onStatus(`↔ Mueve la cabeza de lado a lado (${MOVES_REQUIRED} veces)`, "loading");

        let moves  = 0;
        let frames = 0;
        let state  = "center"; // "center" | "left" | "right"

        while (moves < MOVES_REQUIRED && frames < MAX_FRAMES) {
            const det = await detectFaceFast(videoEl);
            frames++;

            if (!det) { await sleep(MOVE_FRAME_MS); continue; }

            const delta = getNoseX(det) - centerX; // + = derecha, - = izquierda

            if (state === "center") {
                if (delta < -MOVE_THRESHOLD) {
                    state = "left";
                } else if (delta > MOVE_THRESHOLD) {
                    state = "right";
                }

            } else if (state === "left") {
                // Esperar regreso al centro (zona de histéresis al 50% del umbral)
                if (delta > -(MOVE_THRESHOLD * 0.5)) {
                    moves++;
                    state = "center";
                    _notifyMove(moves, onStatus);
                }

            } else if (state === "right") {
                if (delta < MOVE_THRESHOLD * 0.5) {
                    moves++;
                    state = "center";
                    _notifyMove(moves, onStatus);
                }
            }

            await sleep(MOVE_FRAME_MS);
        }

        return moves >= MOVES_REQUIRED;
    }

    function _notifyMove(moves, onStatus) {
        if (!onStatus) return;
        const rem = MOVES_REQUIRED - moves;
        if (rem > 0)
            onStatus(`✓ Movimiento ${moves}/${MOVES_REQUIRED} — sigue moviendo`, "loading");
        else
            onStatus("✓ Liveness confirmado", "loading");
    }

    // ── VERIFICAR ─────────────────────────────────────────────
    async function verify(videoEl, onProgress, onStatus) {
        await loadModels();
        const saved = loadLocal();
        if (!saved) throw new Error("No hay rostro registrado.");

        // Paso 1 — liveness por movimiento de cabeza
        const alive = await livenessCheck(videoEl, onStatus);
        if (!alive) return { ok: false, reason: "liveness" };

        // Paso 2 — reconocimiento facial
        if (onStatus) onStatus("Analizando tu rostro…", "loading");
        const matcher = new faceapi.FaceMatcher(
            [new faceapi.LabeledFaceDescriptors("admin", [saved])], MATCH_THRESH
        );
        let attempts = 0;
        while (attempts < 18) {
            const det = await detectFace(videoEl);
            attempts++;
            if (onProgress) onProgress(attempts, 18);
            if (det && matcher.findBestMatch(det.descriptor).label === "admin")
                return { ok: true };
            await sleep(250);
        }
        return { ok: false, reason: "no_match" };
    }

    async function clearDescriptor() { clearLocal(); await clearFromDb(); }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    return {
        loadModels, startCamera, stopCamera,
        hasDescriptor, train, verify,
        clearDescriptor, loadFromDb
    };
})();
