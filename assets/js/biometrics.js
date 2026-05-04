// ============================================================
//  BioSigLab — WebAuthn (Huella dactilar / Windows Hello)
//  Guarda credencial en MySQL + localStorage como caché
// ============================================================

const Biometrics = (() => {

    const LS_KEY    = "biosiglab_webauthn_credential";
    const LS_ADMIN  = "biosiglab_admin_id";
    const API       = "http://localhost/biosiglab_db/php/biometria.php";

    // ── Utilidades base64url ──────────────────────────────────
    function toB64(buffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)))
            .replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");
    }
    function fromB64(b64) {
        b64 = b64.replace(/-/g,"+").replace(/_/g,"/");
        const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - b64.length % 4);
        return Uint8Array.from(atob(b64+pad), c => c.charCodeAt(0)).buffer;
    }
    function rnd(n=32) { const a=new Uint8Array(n); crypto.getRandomValues(a); return a; }

    // ── Soporte ───────────────────────────────────────────────
    async function isSupported() {
        return !!(window.PublicKeyCredential &&
            navigator.credentials &&
            typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function" &&
            await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
    }

    // ── ¿Hay credencial? (primero localStorage, luego BD) ─────
    function hasCredential() { return !!localStorage.getItem(LS_KEY); }

    // ── Guardar en MySQL ──────────────────────────────────────
    async function syncToDb(credId, credPk) {
        const adminId = localStorage.getItem(LS_ADMIN);
        if (!adminId) return; // sin sesión activa, solo localStorage
        try {
            await fetch(`${API}?action=guardar_huella`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ admin_id: parseInt(adminId), cred_id: credId, cred_pk: credPk })
            });
        } catch (e) { console.warn("BioSigLab: no se pudo sincronizar huella con BD", e); }
    }

    // ── Cargar desde MySQL si no hay localStorage ─────────────
    async function loadFromDb(usuario) {
        try {
            const res  = await fetch(`${API}?action=obtener_por_usuario&usuario=${encodeURIComponent(usuario)}`);
            const json = await res.json();
            if (json.ok && json.data.webauthn_cred_id) {
                const stored = { id: json.data.webauthn_cred_id, type: "public-key" };
                localStorage.setItem(LS_KEY, JSON.stringify(stored));
                localStorage.setItem(LS_ADMIN, json.data.id_admin);
                return stored;
            }
        } catch (e) { console.warn("BioSigLab: no se pudo cargar huella desde BD", e); }
        return null;
    }

    // ── REGISTRAR ─────────────────────────────────────────────
    async function register() {
        const challenge = rnd(32);
        const options = {
            challenge,
            rp:   { name: "BioSigLab - UABC", id: location.hostname || "localhost" },
            user: { id: rnd(16), name: "admin@biosiglab", displayName: "Administrador BioSigLab" },
            pubKeyCredParams: [
                { type: "public-key", alg: -7   },  // ES256
                { type: "public-key", alg: -257 }   // RS256
            ],
            authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required",
                residentKey: "preferred"
            },
            timeout: 60000,
            attestation: "none"
        };

        const cred   = await navigator.credentials.create({ publicKey: options });
        const credId = toB64(cred.rawId);

        // Guardar local
        const stored = { id: credId, type: cred.type, registeredAt: new Date().toISOString() };
        localStorage.setItem(LS_KEY, JSON.stringify(stored));

        // Sincronizar con MySQL
        await syncToDb(credId, null);
        return stored;
    }

    // ── AUTENTICAR ────────────────────────────────────────────
    async function authenticate() {
        const stored = JSON.parse(localStorage.getItem(LS_KEY));
        if (!stored) throw new Error("No hay credencial registrada.");

        const assertion = await navigator.credentials.get({
            publicKey: {
                challenge: rnd(32),
                rpId: location.hostname || "localhost",
                allowCredentials: [{ type: "public-key", id: fromB64(stored.id), transports: ["internal"] }],
                userVerification: "required",
                timeout: 60000
            }
        });
        return !!assertion;
    }

    // ── ELIMINAR ──────────────────────────────────────────────
    async function clearCredential() {
        localStorage.removeItem(LS_KEY);
        // Eliminar en BD también
        const adminId = localStorage.getItem(LS_ADMIN);
        if (adminId) {
            try {
                await fetch(`${API}?action=eliminar_huella`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ admin_id: parseInt(adminId) })
                });
            } catch(e) {}
        }
    }

    return { isSupported, hasCredential, register, authenticate, clearCredential, loadFromDb };
})();
