<<<<<<< HEAD
=======
const CREDENCIALES = {
    usuario: "admin",
    clave: "1234"
};

>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
const STORAGE_KEYS = {
    usuarios: "bioelectricas_usuarios",
    archivos: "bioelectricas_archivos_xml",
    sesionUsuario: "bioelectricas_usuario_actual"
};

<<<<<<< HEAD
const NAV_KEYS = {
    adminSesion: "bioelectricas_admin_sesion",
    retornoOndas: "bioelectricas_retorno_ondas",
    adminLastActivity: "bioelectricas_admin_last_activity",
    adminTimeoutNotice: "bioelectricas_admin_timeout_notice"
};

const ADMIN_IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const ADMIN_IDLE_CHECK_MS = 30000;
const ADMIN_IDLE_EVENTS = ["click", "keydown", "mousemove", "scroll", "touchstart"];
let adminIdleInterval = null;

const ADMIN_OFFLINE_USER = "admin";
const ADMIN_OFFLINE_PASS = "admin123";

=======
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
const XML_BASE = [
    {
        id: "xml-demo-1",
        nombre: "electrocardiograma-demo.xml",
        autor: "Sistema",
        fecha: "2026-03-13 09:00",
        contenido: `<?xml version="1.0" encoding="UTF-8"?>
<senal>
  <paciente>Demo 1</paciente>
  <tipo>ECG</tipo>
  <frecuencia>250Hz</frecuencia>
</senal>`
    },
    {
        id: "xml-demo-2",
        nombre: "electromiografia-demo.xml",
        autor: "Sistema",
        fecha: "2026-03-13 09:30",
        contenido: `<?xml version="1.0" encoding="UTF-8"?>
<senal>
  <paciente>Demo 2</paciente>
  <tipo>EMG</tipo>
  <frecuencia>1000Hz</frecuencia>
</senal>`
    }
];

document.addEventListener("DOMContentLoaded", () => {
    inicializarArchivos();
    renderizarArchivosUsuario();
    renderizarRegistrosAdmin();
    renderizarArchivosAdmin();
    actualizarResumen();
    restaurarSesionUsuario();
<<<<<<< HEAD
    restaurarVistaAdminSiCorresponde();
    mostrarAvisoCierrePorInactividad();
    iniciarAutoLogoutAdmin();
=======
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
});

function mostrarVista(viewId) {
    const vistas = ["homeView", "surveyView", "userView", "loginView", "adminView"];

    vistas.forEach((id) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.classList.toggle("oculto", id !== viewId);
        }
    });

    if (viewId === "adminView") {
        renderizarRegistrosAdmin();
        renderizarArchivosAdmin();
        actualizarResumen();
    }

    if (viewId === "userView") {
        renderizarArchivosUsuario();
        actualizarPanelUsuario();
    }
}

<<<<<<< HEAD
async function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const clave   = document.getElementById("clave").value.trim();
    const mensaje = document.getElementById("loginMensaje");

    // Primero intentar login via PHP/MySQL
    try {
        const form = new FormData();
        form.append("usuario", usuario);
        form.append("clave", clave);
        const res  = await fetch("../biosiglab_db/php/encuestas.php?action=login_admin", {
            method: "POST", body: form
        });
        const json = await res.json();
        if (json.ok) {
            mensaje.textContent = "";
            sessionStorage.setItem(NAV_KEYS.adminSesion, "activa");
            sessionStorage.removeItem(NAV_KEYS.adminTimeoutNotice);
            sessionStorage.setItem(NAV_KEYS.adminLastActivity, String(Date.now()));
            // Guardar admin_id para sincronización biométrica
            localStorage.setItem("biosiglab_admin_id", json.admin_id ?? "");
            // Cargar credenciales biométricas desde BD si no están en localStorage
            await FaceAuth.loadFromDb(usuario);
            await Biometrics.loadFromDb(usuario);
            mostrarVista("adminView");
            return;
        }
    } catch(e) {
        if (usuario === ADMIN_OFFLINE_USER && clave === ADMIN_OFFLINE_PASS) {
            mensaje.textContent = "";
            sessionStorage.setItem(NAV_KEYS.adminSesion, "activa");
            sessionStorage.removeItem(NAV_KEYS.adminTimeoutNotice);
            sessionStorage.setItem(NAV_KEYS.adminLastActivity, String(Date.now()));
            mostrarVista("adminView");
            if (typeof mostrarToast === "function") {
                mostrarToast("Modo ligero activo: panel administrativo local.", "info");
            }
            return;
        }
    }

    mensaje.textContent = "Usuario o contraseña incorrectos.";
=======
function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();
    const mensaje = document.getElementById("loginMensaje");

    if (usuario === CREDENCIALES.usuario && clave === CREDENCIALES.clave) {
        mensaje.textContent = "";
        mostrarVista("adminView");
        return;
    }

    mensaje.textContent = "Usuario o contrasena incorrectos.";
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
}

function cerrarSesion() {
    document.getElementById("usuario").value = "";
    document.getElementById("clave").value = "";
    document.getElementById("loginMensaje").textContent = "";
<<<<<<< HEAD
    sessionStorage.removeItem(NAV_KEYS.adminSesion);
    sessionStorage.removeItem(NAV_KEYS.retornoOndas);
    sessionStorage.removeItem(NAV_KEYS.adminLastActivity);
    sessionStorage.removeItem(NAV_KEYS.adminTimeoutNotice);
    localStorage.removeItem('ondas_referrer');
=======
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
    limpiarFiltros();
    mostrarVista("homeView");
}

<<<<<<< HEAD
function adminSesionActiva() {
    return sessionStorage.getItem(NAV_KEYS.adminSesion) === "activa";
}

function marcarActividadAdmin() {
    if (!adminSesionActiva()) return;
    sessionStorage.setItem(NAV_KEYS.adminLastActivity, String(Date.now()));
}

function ejecutarCierrePorInactividad() {
    sessionStorage.setItem(NAV_KEYS.adminTimeoutNotice, "1");
    sessionStorage.removeItem(NAV_KEYS.adminSesion);
    sessionStorage.removeItem(NAV_KEYS.retornoOndas);
    sessionStorage.removeItem(NAV_KEYS.adminLastActivity);
    localStorage.removeItem('ondas_referrer');

    const usuario = document.getElementById("usuario");
    const clave = document.getElementById("clave");
    const mensaje = document.getElementById("loginMensaje");
    if (usuario) usuario.value = "";
    if (clave) clave.value = "";

    if (typeof limpiarFiltros === "function") limpiarFiltros();
    if (typeof mostrarVista === "function" && document.getElementById("loginView")) {
        mostrarVista("loginView");
        if (mensaje) mensaje.textContent = "Tu sesión se cerró automáticamente por inactividad.";
        return;
    }

    window.location.href = "adminlogin.html?timeout=1";
}

function verificarInactividadAdmin() {
    if (!adminSesionActiva()) return;

    const ultimaActividad = Number(sessionStorage.getItem(NAV_KEYS.adminLastActivity) || 0);
    if (!ultimaActividad) {
        marcarActividadAdmin();
        return;
    }

    if (Date.now() - ultimaActividad >= ADMIN_IDLE_TIMEOUT_MS) {
        ejecutarCierrePorInactividad();
    }
}

function iniciarAutoLogoutAdmin() {
    if (window.__adminIdleSetup) return;
    window.__adminIdleSetup = true;

    ADMIN_IDLE_EVENTS.forEach((evt) => {
        window.addEventListener(evt, marcarActividadAdmin, { passive: true });
    });

    adminIdleInterval = window.setInterval(verificarInactividadAdmin, ADMIN_IDLE_CHECK_MS);
    verificarInactividadAdmin();
}

function mostrarAvisoCierrePorInactividad() {
    const params = new URLSearchParams(window.location.search);
    const hayAviso = sessionStorage.getItem(NAV_KEYS.adminTimeoutNotice) === "1" || params.get("timeout") === "1";
    if (!hayAviso) return;

    sessionStorage.removeItem(NAV_KEYS.adminTimeoutNotice);
    const mensaje = document.getElementById("loginMensaje");
    if (document.getElementById("loginView") && typeof mostrarVista === "function") {
        mostrarVista("loginView");
    }
    if (mensaje) {
        mensaje.textContent = "Tu sesión se cerró automáticamente por inactividad.";
    }
}

function restaurarVistaAdminSiCorresponde() {
    const adminView = document.getElementById("adminView");
    if (!adminView) return;

    const retornoAdmin = sessionStorage.getItem(NAV_KEYS.retornoOndas) === "admin";
    const adminActivo = sessionStorage.getItem(NAV_KEYS.adminSesion) === "activa";

    if (retornoAdmin && adminActivo) {
        sessionStorage.removeItem(NAV_KEYS.retornoOndas);
        marcarActividadAdmin();
        mostrarVista("adminView");
    }
}

=======
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
function registrarUsuario(event) {
    event.preventDefault();

    const registro = {
        id: `usr-${Date.now()}`,
        nombre: document.getElementById("visitorNombre").value.trim(),
        correo: document.getElementById("visitorCorreo").value.trim(),
        edad: document.getElementById("visitorEdad").value.trim(),
<<<<<<< HEAD
        esUABC     : document.getElementById('checkUABC')?.checked || false,
=======
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
        universidad: document.getElementById("visitorUniversidad").value.trim(),
        motivo: document.getElementById("visitorMotivo").value.trim(),
        fecha: obtenerFechaActual()
    };

    const usuarios = obtenerUsuarios();
    usuarios.unshift(registro);
    guardarUsuarios(usuarios);
<<<<<<< HEAD

    localStorage.setItem(STORAGE_KEYS.sesionUsuario, JSON.stringify(registro));

    const mensaje = document.getElementById("surveyMensaje");
    if (mensaje) {
        mensaje.textContent = "Registro completado. Cargando repositorio...";
    }

    actualizarPanelUsuario(); 
    renderizarArchivosUsuario(); 
=======
    localStorage.setItem(STORAGE_KEYS.sesionUsuario, JSON.stringify(registro));

    document.getElementById("surveyMensaje").textContent = "Registro completado. Acceso habilitado al repositorio XML.";
    document.querySelector(".survey-form").reset();

    actualizarPanelUsuario();
    renderizarRegistrosAdmin();
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
    mostrarVista("userView");
}

function restaurarSesionUsuario() {
    const sesion = localStorage.getItem(STORAGE_KEYS.sesionUsuario);
<<<<<<< HEAD
=======

>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
    if (!sesion) {
        actualizarPanelUsuario();
        return;
    }
<<<<<<< HEAD
=======

>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
    actualizarPanelUsuario();
}

function actualizarPanelUsuario() {
    const usuarioActual = obtenerSesionUsuario();
    const bienvenida = document.getElementById("userWelcome");

    if (bienvenida) {
        bienvenida.textContent = usuarioActual
<<<<<<< HEAD
            ? `${usuarioActual.nombre}, ya puedes revisar los XML disponibles.`
=======
            ? `${usuarioActual.nombre}, ya puedes revisar los XML disponibles y compartir nuevos archivos.`
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
            : "Completa la encuesta para habilitar tu acceso al repositorio.";
    }

    const archivos = obtenerArchivos();
<<<<<<< HEAD
    const ultimoRegistro = usuarioActual ? usuarioActual.nombre.split(" ")[0] : "-";

    const elXmlDisp = document.getElementById("xmlDisponibles");
    const elUltimo = document.getElementById("ultimoRegistro");

    if (elXmlDisp) elXmlDisp.textContent = archivos.length;
    if (elUltimo) elUltimo.textContent = ultimoRegistro;
}

function renderizarArchivosUsuario() {
    const contenedor = document.getElementById("xmlListTable");
    if (!contenedor) return;
=======
    const archivosUsuarios = archivos.filter((archivo) => archivo.autor !== "Sistema");
    const ultimoRegistro = usuarioActual ? usuarioActual.nombre.split(" ")[0] : "-";

    document.getElementById("xmlDisponibles").textContent = archivos.length;
    document.getElementById("xmlUsuarios").textContent = archivosUsuarios.length;
    document.getElementById("ultimoRegistro").textContent = ultimoRegistro;
}

function subirArchivoUsuario(event) {
    event.preventDefault();

    const input = document.getElementById("xmlFileInput");
    const archivo = input.files[0];
    const mensaje = document.getElementById("uploadMensaje");
    const usuarioActual = obtenerSesionUsuario();

    if (!usuarioActual) {
        mensaje.textContent = "Primero completa la encuesta para poder subir archivos.";
        return;
    }

    if (!archivo) {
        mensaje.textContent = "Selecciona un archivo XML.";
        return;
    }

    if (!archivo.name.toLowerCase().endsWith(".xml")) {
        mensaje.textContent = "Solo se permiten archivos con extension .xml.";
        return;
    }

    const lector = new FileReader();
    lector.onload = () => {
        const archivos = obtenerArchivos();
        archivos.unshift({
            id: `xml-${Date.now()}`,
            nombre: archivo.name,
            autor: usuarioActual.nombre,
            correo: usuarioActual.correo,
            fecha: obtenerFechaActual(),
            contenido: lector.result
        });

        guardarArchivos(archivos);
        input.value = "";
        mensaje.textContent = "Archivo XML cargado correctamente.";
        renderizarArchivosUsuario();
        renderizarArchivosAdmin();
        actualizarPanelUsuario();
    };

    lector.readAsText(archivo);
}

function renderizarArchivosUsuario() {
    const contenedor = document.getElementById("xmlList");
    if (!contenedor) {
        return;
    }
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c

    const archivos = obtenerArchivos();
    contenedor.innerHTML = "";

    archivos.forEach((archivo) => {
<<<<<<< HEAD
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td style="padding: 12px;">${escaparHtml(archivo.paciente_id_xml || archivo.nombre)}</td>
            <td style="padding: 12px;">${escaparHtml(archivo.edad_xml || "N/A")}</td>
            <td style="padding: 12px;">${escaparHtml(archivo.genero_xml || "N/A")}</td>
            <td style="padding: 12px;">${escaparHtml(archivo.fecha)}</td>
            <td style="padding: 12px; text-align: center;">
                <button class="primary-button" onclick="verOndasReal('${archivo.id}')">Ver Señales</button>
                <button class="ghost-button" title="Descarga XML y CSV" onclick="descargarArchivo('${archivo.id}')">&#11015; XML + CSV</button>
            </td>
        `;
        contenedor.appendChild(fila);
=======
        const card = document.createElement("article");
        card.className = "file-card";
        card.innerHTML = `
            <p class="file-tag">XML</p>
            <h4>${escaparHtml(archivo.nombre)}</h4>
            <p>Autor: ${escaparHtml(archivo.autor)}</p>
            <p>Fecha: ${escaparHtml(archivo.fecha)}</p>
            <div class="file-actions">
                <button class="ghost-button" type="button" onclick="descargarArchivo('${archivo.id}')">Descargar</button>
                <button class="ghost-button" type="button" onclick="verContenidoXml('${archivo.id}')">Ver contenido</button>
            </div>
            <pre id="preview-${archivo.id}" class="xml-preview oculto"></pre>
        `;
        contenedor.appendChild(card);
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
    });
}

function renderizarRegistrosAdmin() {
    const contenedor = document.getElementById("userRegistry");
    const contador = document.getElementById("userRegistryCount");

<<<<<<< HEAD
    if (!contenedor || !contador) return;
=======
    if (!contenedor || !contador) {
        return;
    }
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c

    const usuarios = obtenerUsuarios();
    contenedor.innerHTML = "";
    contador.textContent = `${usuarios.length} registros`;

    if (usuarios.length === 0) {
        contenedor.innerHTML = '<p class="empty-state">Aun no hay encuestas registradas.</p>';
        return;
    }

    usuarios.forEach((usuario) => {
        const card = document.createElement("article");
        card.className = "registry-card";
        card.innerHTML = `
            <h4>${escaparHtml(usuario.nombre)}</h4>
            <p>Correo: ${escaparHtml(usuario.correo)}</p>
            <p>Edad: ${escaparHtml(usuario.edad)}</p>
            <p>Universidad: ${escaparHtml(usuario.universidad)}</p>
            <p>Fecha: ${escaparHtml(usuario.fecha)}</p>
            <p class="registry-reason">Motivo: ${escaparHtml(usuario.motivo)}</p>
        `;
        contenedor.appendChild(card);
    });
}

<<<<<<< HEAD
/* ── Estado del filtro de XMLs ── */
let _xmlFiltroActivo = '';

function filtrarTablaXML() {
    _xmlFiltroActivo = (document.getElementById('filtroXML')?.value || '').toLowerCase().trim();
    renderizarArchivosAdmin();
}

function renderizarArchivosAdmin() {
    const contenedor = document.getElementById('tablaAdminRegistros');
    if (!contenedor) return;

    const todos     = obtenerArchivos();
    const q         = _xmlFiltroActivo;
    const hayFiltro = q.length > 0;

    // Filtrar si hay búsqueda activa
    let lista = hayFiltro
        ? todos.filter(a =>
            (a.paciente_id_xml || '').toLowerCase().includes(q) ||
            (a.edad_xml        || '').toLowerCase().includes(q) ||
            (a.genero_xml      || '').toLowerCase().includes(q) ||
            (a.equipo_xml      || '').toLowerCase().includes(q) ||
            (a.fecha           || '').toLowerCase().includes(q) ||
            (a.observaciones   || '').toLowerCase().includes(q)
          )
        : todos.slice(0, 5);   // sin búsqueda → solo los 5 más recientes

    // Aviso de límite
    const aviso = document.getElementById('avisoLimiteXML');
    if (aviso) {
        if (hayFiltro) {
            aviso.textContent = `${lista.length} resultado${lista.length !== 1 ? 's' : ''} para "${q}".`;
            aviso.style.display = lista.length > 0 ? 'block' : 'block';
        } else {
            aviso.textContent = todos.length > 5
                ? `Mostrando los 5 registros más recientes de ${todos.length}. Usa el buscador para ver todos.`
                : `${todos.length} registro${todos.length !== 1 ? 's' : ''} en total.`;
        }
    }

    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:#999;">
            ${hayFiltro ? 'No hay registros que coincidan con la búsqueda.' : 'No hay XML procesados.'}</td></tr>`;
        return;
    }

    lista.forEach((archivo) => {
        const obs = archivo.observaciones
            ? escaparHtml(archivo.observaciones)
            : '<em style="color:#bbb;">—</em>';
        const fila = document.createElement('tr');
        fila.style.borderBottom = '1px solid #eee';
        fila.innerHTML = `
            <td style="padding:12px 15px;">${escaparHtml(archivo.paciente_id_xml || 'N/A')}</td>
            <td style="padding:12px 15px;">${escaparHtml(archivo.edad_xml || 'N/A')}</td>
            <td style="padding:12px 15px;">${escaparHtml(archivo.genero_xml || 'N/A')}</td>
            <td style="padding:12px 15px;">${escaparHtml(archivo.fecha)}</td>
            <td style="padding:12px 15px;">${escaparHtml(archivo.equipo_xml || 'N/A')}</td>
            <td style="padding:12px 15px;max-width:180px;font-size:.88rem;color:#555;">${obs}</td>
            <td style="padding:12px 15px;white-space:nowrap;">
                <button onclick="verOndasReal('${archivo.id}')" style="margin-right:4px;">Ver</button>
                <button style="color:#1a73e8;margin-right:4px;" title="Descargar XML y CSV" onclick="descargarArchivo('${archivo.id}')">&#11015; XML+CSV</button>
                <button style="color:#d97706;margin-right:4px;" title="Editar metadatos" onclick="abrirEditorXML('${archivo.id}')">✏ Editar</button>
                <button style="color:red;" onclick="eliminarArchivoLocal('${archivo.id}')">Eliminar</button>
            </td>
        `;
        contenedor.appendChild(fila);
    });
}

/* ═══════════════════════════════════════════════════════════════
   AUTO-RELLENO DE FORMULARIO DESDE XML
   Se dispara cuando el admin selecciona un archivo XML.
   Lee los metadatos del XML y los vuelca en los campos del form.
   Al registrar, escribe los valores editados de vuelta al XML.
   ═══════════════════════════════════════════════════════════════ */

// Guardamos el contenido XML actual para poder modificarlo antes de guardar
let _xmlContenidoActual = null;

function iniciarAutoRelleno() {
    const input = document.getElementById('fileInputAdmin');
    if (!input) return;

    input.addEventListener('change', function () {
        const archivo = this.files[0];
        if (!archivo) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            _xmlContenidoActual = e.target.result;
            const extraido = extraerMetadatosXML(_xmlContenidoActual);
            rellenarFormularioDesdeXML(extraido);
        };
        reader.readAsText(archivo);
    });
}

/**
 * Parsea el XML y extrae los campos conocidos del formato FDA/HL7 ECG.
 * Devuelve un objeto con los valores encontrados (o null si no encontrado).
 */
function extraerMetadatosXML(xmlTexto) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlTexto, 'text/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) return {};

    const get = (selector, attr) => {
        const el = doc.querySelector(selector);
        if (!el) return null;
        return attr ? el.getAttribute(attr) : el.textContent.trim() || null;
    };

    // Fecha: buscar effectiveTime > low con value tipo "20231015120000"
    let fechaISO = null;
    const fechaRaw = get('effectiveTime > low', 'value') || get('effectiveTime', 'value');
    if (fechaRaw && fechaRaw.length >= 12) {
        // Formato YYYYMMDDHHMMSS → datetime-local YYYY-MM-DDTHH:MM
        fechaISO = `${fechaRaw.slice(0,4)}-${fechaRaw.slice(4,6)}-${fechaRaw.slice(6,8)}T${fechaRaw.slice(8,10)}:${fechaRaw.slice(10,12)}`;
    } else if (fechaRaw && fechaRaw.length >= 8) {
        fechaISO = `${fechaRaw.slice(0,4)}-${fechaRaw.slice(4,6)}-${fechaRaw.slice(6,8)}T00:00`;
    }

    // Género: administrativeGenderCode con atributo code="M"/"F"
    const sexoCode = get('administrativeGenderCode', 'code');

    // Equipo: primero manufacturerModelName, si no softwareName
    const equipo = get('manufacturerModelName') || get('softwareName') || get('Device > manufacturerModelName');

    return {
        pacienteId : get('PatientID') || get('id[root]') || null,
        edad       : get('Age') || get('age') || null,
        genero     : sexoCode || null,
        fechaISO,
        equipo,
    };
}

/**
 * Vuelca los valores extraídos en los inputs del formulario y
 * muestra los badges "del XML" en los campos auto-rellenados.
 */
function rellenarFormularioDesdeXML(datos) {
    let camposRellenados = 0;

    function setField(inputId, tagId, valor) {
        const input = document.getElementById(inputId);
        const tag   = document.getElementById(tagId);
        if (!input || valor === null || valor === undefined || valor === '') return;

        input.value = valor;
        input.classList.add('xml-auto-fill');
        if (tag) tag.style.display = 'inline-block';
        camposRellenados++;

        // Al editar manualmente, quitar el estilo auto-fill
        input.addEventListener('input', function onEdit() {
            input.classList.remove('xml-auto-fill');
            if (tag) tag.style.display = 'none';
            input.removeEventListener('input', onEdit);
        }, { once: true });
    }

    // Limpiar estado previo
    ['campoIdPaciente','campoEdad','campoGenero','campoFecha','campoEquipo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('xml-auto-fill'); }
    });
    ['tagIdPaciente','tagEdad','tagGenero','tagFecha','tagEquipo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    setField('campoIdPaciente', 'tagIdPaciente', datos.pacienteId);
    setField('campoEdad',       'tagEdad',       datos.edad);
    setField('campoFecha',      'tagFecha',      datos.fechaISO);
    setField('campoEquipo',     'tagEquipo',     datos.equipo);

    // Género requiere mapear al valor del select
    if (datos.genero) {
        const map = { M: 'M', F: 'F', 'UN': 'N/A', 'UNK': 'N/A' };
        const val = map[datos.genero.toUpperCase()] || datos.genero;
        setField('campoGenero', 'tagGenero', val);
    }

    // Mostrar / ocultar banner
    const banner = document.getElementById('xmlParseBanner');
    const msg    = document.getElementById('xmlParseBannerMsg');
    if (banner) {
        if (camposRellenados > 0) {
            msg.textContent = `✔ ${camposRellenados} campo${camposRellenados > 1 ? 's' : ''} detectado${camposRellenados > 1 ? 's' : ''} y auto-rellenado${camposRellenados > 1 ? 's' : ''} desde el XML. Puedes editarlos antes de registrar.`;
            banner.style.display = 'flex';
        } else {
            msg.textContent = '⚠ No se detectaron metadatos en este XML. Rellena los campos manualmente.';
            banner.style.backgroundColor = '#fff8e1';
            banner.style.borderColor = '#f0c040';
            banner.style.color = '#7a5a00';
            banner.style.display = 'flex';
        }
    }
}

/**
 * Escribe los valores editados en el formulario de vuelta al XML
 * antes de almacenarlo, para que la visualización los refleje.
 */
function aplicarEdicionesAlXML(xmlTexto, campos) {
    const parser = new DOMParser();
    const serial = new XMLSerializer();
    const doc = parser.parseFromString(xmlTexto, 'text/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) return xmlTexto;

    const setOrCreate = (selector, tagName, valor, attr) => {
        if (!valor) return;
        let el = doc.querySelector(selector);
        if (!el && tagName) {
            el = doc.createElement(tagName);
            const root = doc.documentElement;
            root.insertBefore(el, root.firstChild);
        }
        if (!el) return;
        if (attr) {
            el.setAttribute(attr, valor);
        } else {
            el.textContent = valor;
        }
    };

    if (campos.pacienteId) setOrCreate('PatientID', 'PatientID', campos.pacienteId);
    if (campos.edad)       setOrCreate('Age',       'Age',       campos.edad);
    if (campos.equipo)     setOrCreate('manufacturerModelName', 'manufacturerModelName', campos.equipo);
    if (campos.genero)     setOrCreate('administrativeGenderCode', null, campos.genero, 'code');

    // Fecha: escribir en effectiveTime > low
    if (campos.fechaISO) {
        const partes = campos.fechaISO.replace('T', '').replace(/-/g,'').replace(':','');
        const hl7Fecha = partes.replace(/[^0-9]/g, '').slice(0,12); // YYYYMMDDHHMMSS
        const low = doc.querySelector('effectiveTime > low');
        if (low) low.setAttribute('value', hl7Fecha);
    }

    return serial.serializeToString(doc);
}

// Iniciar auto-relleno cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', iniciarAutoRelleno);


function subirYProcesar() {
    const input   = document.getElementById('fileInputAdmin');
    const idPx    = document.getElementById('campoIdPaciente');
    const edad    = document.getElementById('campoEdad');
    const genero  = document.getElementById('campoGenero');
    const fecha   = document.getElementById('campoFecha');
    const equipo  = document.getElementById('campoEquipo');
    const obs     = document.getElementById('campoObservaciones');
    const aviso   = document.getElementById('avisoFormSubida');

    // Resetear estilos de error
    [idPx, edad, genero, fecha, equipo, obs].forEach(el => {
        if (el) el.style.borderColor = '#ddd';
    });

    // Solo validar que haya archivo seleccionado
    if (!input || input.files.length === 0) {
        if (aviso) {
            aviso.textContent = '⚠ Selecciona un archivo XML antes de registrar.';
            aviso.style.display = 'block';
        }
        return;
    }

    if (aviso) aviso.style.display = 'none';

    // Formatear fecha a legible
    const fechaObj     = new Date(fecha.value);
    const fechaFormato = fechaObj.toLocaleString('es-MX', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });

    const archivo = input.files[0];
    const reader  = new FileReader();

    reader.onload = function(e) {
        const contenido = e.target.result;

        // Verificar XML válido
        const parser     = new DOMParser();
        const xmlDoc     = parser.parseFromString(contenido, 'text/xml');
        const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
        if (parseError) {
            if (aviso) { aviso.textContent = '⚠ El archivo seleccionado no es un XML válido.'; aviso.style.display = 'block'; }
            return;
        }

        // Aplicar los campos editados de vuelta al XML antes de almacenar
        const xmlFinal = aplicarEdicionesAlXML(contenido, {
            pacienteId : idPx.value.trim(),
            edad       : edad.value.trim(),
            genero     : genero.value,
            equipo     : equipo.value.trim(),
            fechaISO   : fecha.value,
        });

        const nuevoRegistro = {
            id              : `xml-${Date.now()}`,
            nombre          : archivo.name,
            autor           : 'Administrador',
            fecha           : fechaFormato,
            contenido       : xmlFinal,          // XML con ediciones aplicadas
            paciente_id_xml : idPx.value.trim(),
            edad_xml        : edad.value.trim(),
            genero_xml      : genero.value,
            equipo_xml      : equipo.value.trim(),
            observaciones   : obs.value.trim()
        };

        const archivosLocales = obtenerArchivos();
        archivosLocales.unshift(nuevoRegistro);
        guardarArchivos(archivosLocales);
        renderizarArchivosAdmin();
        actualizarResumen();

        // Limpiar formulario
        input.value = '';
        [idPx, edad, equipo, obs].forEach(el => { if (el) el.value = ''; });
        if (genero) genero.value = '';
        if (fecha)  fecha.value  = '';
        _xmlContenidoActual = null;
        // Ocultar banner y badges de auto-relleno
        const banner = document.getElementById('xmlParseBanner');
        if (banner) { banner.style.display = 'none'; banner.style.backgroundColor=''; banner.style.borderColor=''; banner.style.color=''; }
        ['campoIdPaciente','campoEdad','campoGenero','campoFecha','campoEquipo'].forEach(id => { const el=document.getElementById(id); if(el) el.classList.remove('xml-auto-fill'); });
        ['tagIdPaciente','tagEdad','tagGenero','tagFecha','tagEquipo'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display='none'; });

        // Confirmación en pantalla
        const msj = document.getElementById('mensajeResultado');
        if (msj) {
            msj.textContent = `✓ "${archivo.name}" registrado correctamente.`;
            msj.style.color = '#27ae60';
            setTimeout(() => {
                msj.textContent = `${obtenerArchivos().length} registros`;
                msj.style.color = '';
            }, 3500);
        }
    };

    reader.readAsText(archivo);
}

/* ══════════════════════════════════════════════════════════════
   EDITOR INLINE DE METADATOS XML
   Abre un modal con los campos del registro para editarlos y
   los escribe de vuelta al XML almacenado.
   ══════════════════════════════════════════════════════════════ */

function abrirEditorXML(id) {
    const archivos = obtenerArchivos();
    const reg = archivos.find(a => a.id === id);
    if (!reg) return;

    // Crear modal dinámico
    const overlay = document.createElement('div');
    overlay.id = 'editorXMLOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;';

    const genOpts = ['', 'M', 'F', 'N/A'].map(v =>
        `<option value="${v}" ${reg.genero_xml === v ? 'selected' : ''}>${v || '— Seleccionar —'}</option>`
    ).join('');

    overlay.innerHTML = `
        <div style="background:#fff;border-radius:16px;padding:28px;max-width:520px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:'Outfit',sans-serif;max-height:90vh;overflow-y:auto;">
            <h3 style="margin:0 0 4px;font-size:1.15rem;color:#1a2f3a;">✏ Editar metadatos del registro</h3>
            <p style="margin:0 0 20px;font-size:.85rem;color:#777;">Archivo: <strong>${escaparHtml(reg.nombre)}</strong></p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:12px;">
                <label style="display:flex;flex-direction:column;gap:4px;font-size:.88rem;font-weight:600;color:#444;">
                    ID Paciente
                    <input id="edit_idPx" type="text" value="${escaparHtml(reg.paciente_id_xml || '')}"
                        style="padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;font-family:inherit;font-size:.95rem;">
                </label>
                <label style="display:flex;flex-direction:column;gap:4px;font-size:.88rem;font-weight:600;color:#444;">
                    Edad
                    <input id="edit_edad" type="number" min="0" max="120" value="${escaparHtml(reg.edad_xml || '')}"
                        style="padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;font-family:inherit;font-size:.95rem;">
                </label>
                <label style="display:flex;flex-direction:column;gap:4px;font-size:.88rem;font-weight:600;color:#444;">
                    Género
                    <select id="edit_genero" style="padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;font-family:inherit;font-size:.95rem;background:#fff;">
                        ${genOpts}
                    </select>
                </label>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:12px;">
                <label style="display:flex;flex-direction:column;gap:4px;font-size:.88rem;font-weight:600;color:#444;">
                    Fecha del estudio
                    <input id="edit_fecha" type="datetime-local" value="${reg.fecha_iso || ''}"
                        style="padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;font-family:inherit;font-size:.95rem;">
                </label>
                <label style="display:flex;flex-direction:column;gap:4px;font-size:.88rem;font-weight:600;color:#444;">
                    Equipo / Dispositivo
                    <input id="edit_equipo" type="text" value="${escaparHtml(reg.equipo_xml || '')}"
                        style="padding:9px 12px;border:1.5px solid #ddd;border-radius:8px;font-family:inherit;font-size:.95rem;">
                </label>
            </div>
            <label style="display:flex;flex-direction:column;gap:4px;font-size:.88rem;font-weight:600;color:#444;margin-bottom:20px;">
                Observaciones clínicas
                <textarea id="edit_obs" rows="3"
                    style="padding:10px 12px;border:1.5px solid #ddd;border-radius:8px;font-family:inherit;font-size:.95rem;resize:vertical;">${escaparHtml(reg.observaciones || '')}</textarea>
            </label>
            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button onclick="document.getElementById('editorXMLOverlay').remove()"
                    style="padding:10px 22px;border:1.5px solid #ddd;border-radius:8px;background:#fff;font-family:inherit;font-size:.95rem;cursor:pointer;">
                    Cancelar
                </button>
                <button onclick="guardarEdicionXML('${id}')"
                    style="padding:10px 22px;border:none;border-radius:8px;background:#2c3e50;color:#fff;font-family:inherit;font-size:.95rem;font-weight:600;cursor:pointer;">
                    Guardar cambios
                </button>
            </div>
        </div>`;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function guardarEdicionXML(id) {
    const archivos = obtenerArchivos();
    const idx = archivos.findIndex(a => a.id === id);
    if (idx === -1) return;

    const reg = archivos[idx];

    const idPx   = document.getElementById('edit_idPx')?.value.trim()  || '';
    const edad   = document.getElementById('edit_edad')?.value.trim()   || '';
    const genero = document.getElementById('edit_genero')?.value        || '';
    const fecha  = document.getElementById('edit_fecha')?.value         || '';
    const equipo = document.getElementById('edit_equipo')?.value.trim() || '';
    const obs    = document.getElementById('edit_obs')?.value.trim()    || '';

    // Actualizar metadatos del registro
    reg.paciente_id_xml = idPx;
    reg.edad_xml        = edad;
    reg.genero_xml      = genero;
    reg.equipo_xml      = equipo;
    reg.observaciones   = obs;
    reg.fecha_iso       = fecha;

    // Formatear fecha legible
    if (fecha) {
        const d = new Date(fecha);
        reg.fecha = d.toLocaleString('es-MX', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    }

    // Aplicar cambios de vuelta al contenido XML almacenado
    if (reg.contenido) {
        reg.contenido = aplicarEdicionesAlXML(reg.contenido, { pacienteId: idPx, edad, genero, equipo, fechaISO: fecha });
    }

    archivos[idx] = reg;
    guardarArchivos(archivos);
    document.getElementById('editorXMLOverlay')?.remove();
    renderizarArchivosAdmin();
    actualizarResumen();

    const msj = document.getElementById('mensajeResultado');
    if (msj) {
        msj.textContent = '✓ Registro actualizado.';
        msj.style.color = '#27ae60';
        setTimeout(() => { msj.textContent = `${archivos.length} registros`; msj.style.color = ''; }, 3000);
    }
}


function verOndasReal(idArchivo) {
    const archivos = obtenerArchivos();
    const encontrado = archivos.find(a => a.id === idArchivo);
    if (encontrado) {
        localStorage.setItem('xml_visualizar_actual', encontrado.contenido);

        const adminViewVisible = document.getElementById("adminView")
            && !document.getElementById("adminView").classList.contains("oculto");

        if (adminViewVisible) {
            sessionStorage.setItem(NAV_KEYS.retornoOndas, "admin");
            localStorage.setItem('ondas_referrer', 'adminlogin.html');
        } else {
            sessionStorage.removeItem(NAV_KEYS.retornoOndas);
            localStorage.setItem('ondas_referrer', window.location.href);
        }

        window.location.href = "Ondas.html";
    }
}

function eliminarArchivoLocal(id) {
    let archivos = obtenerArchivos();
    archivos = archivos.filter(a => a.id !== id);
    guardarArchivos(archivos);
    renderizarArchivosAdmin();
    actualizarResumen();
}

/* ─────────────────────────────────────────────────────────────
   TOAST – notificaciones flotantes
   ───────────────────────────────────────────────────────────── */
function mostrarToast(mensaje, tipo = 'exito') {
    // Crear contenedor si no existe
    let contenedor = document.getElementById('toast-contenedor');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'toast-contenedor';
        contenedor.style.cssText = `
            position: fixed; bottom: 28px; right: 28px;
            display: flex; flex-direction: column; gap: 10px;
            z-index: 9999; pointer-events: none;
        `;
        document.body.appendChild(contenedor);
    }

    const colores = {
        exito  : { bg: '#1e7e34', icon: '✅' },
        error  : { bg: '#b02a37', icon: '❌' },
        info   : { bg: '#0c5460', icon: 'ℹ️'  },
        carga  : { bg: '#495057', icon: '⏳' },
    };
    const { bg, icon } = colores[tipo] || colores.info;

    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${bg}; color: #fff;
        padding: 14px 20px; border-radius: 10px;
        font-family: Outfit, sans-serif; font-size: 0.92rem;
        box-shadow: 0 4px 16px rgba(0,0,0,.35);
        display: flex; align-items: center; gap: 10px;
        max-width: 340px; opacity: 0;
        transition: opacity .3s ease;
        pointer-events: auto;
    `;
    toast.innerHTML = `<span style="font-size:1.1rem">${icon}</span><span>${mensaje}</span>`;
    contenedor.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => { toast.style.opacity = '1'; });

    // Fade out y eliminar
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 350);
    }, tipo === 'carga' ? 60000 : 4000); // toast de carga dura hasta que se cierre manualmente

    return toast; // devolver referencia para poder quitarlo antes (ej: al terminar carga)
}

/* ─────────────────────────────────────────────────────────────
   DESCARGA XML + XLSX
   ───────────────────────────────────────────────────────────── */
function descargarArchivo(idArchivo) {
    const archivo = obtenerArchivos().find((item) => item.id === idArchivo);
    if (!archivo) {
        mostrarToast('No se encontró el archivo.', 'error');
        return;
    }

    // --- Descarga 1: XML original ---
    try {
        const blobXml = new Blob([archivo.contenido], { type: 'application/xml' });
        const urlXml  = URL.createObjectURL(blobXml);
        const enlaceXml = document.createElement('a');
        enlaceXml.href = urlXml;
        enlaceXml.download = archivo.nombre;
        enlaceXml.click();
        URL.revokeObjectURL(urlXml);
    } catch (e) {
        mostrarToast('Error al descargar el archivo XML.', 'error');
        console.error(e);
        return;
    }

    // --- Descarga 2: XLSX con señales ECG ---
    const toastCarga = mostrarToast('Generando archivo Excel…', 'carga');

    setTimeout(() => {
        try {
            const wb = convertirXmlAXlsx(archivo.contenido, archivo.nombre);
            if (!wb) throw new Error('No se pudieron extraer señales del XML.');

            const nombreBase = archivo.nombre.replace(/\.xml$/i, '');
            XLSX.writeFile(wb, nombreBase + '_ecg.xlsx');

            toastCarga.remove();
            mostrarToast('¡Excel descargado correctamente!', 'exito');
        } catch (e) {
            toastCarga.remove();
            mostrarToast('Error al generar el Excel: ' + e.message, 'error');
            console.error(e);
        }
    }, 100);
}

/**
 * Parsea un XML ECG en formato HL7 aECG (Mindray/GE) y construye
 * un Workbook de SheetJS con dos hojas:
 *   1. "Metadatos"  – información del paciente y parámetros de adquisición
 *   2. "Señales ECG" – tiempo_s + una columna por derivación (µV)
 */
/**
 * Parsea un XML ECG HL7 aECG y genera un Workbook SheetJS profesional con:
 *   Hoja 1 "Metadatos"   – portada con info del paciente y parámetros
 *   Hoja 2 "Señales ECG" – tabla con tiempo_s y las 12 derivaciones (µV)
 *   Hoja 3 "Tiras Ritmo" – segmentos cortos de ritmo (segundo sequenceSet)
 *
 * FIX: solo toma las 12 derivaciones del primer sequenceSet (ECG completo).
 * El segundo sequenceSet (tiras de ritmo, 600 muestras) va en hoja 3.
 */
function convertirXmlAXlsx(xmlTexto, nombreArchivo) {

    /* ── Parsear XML ─────────────────────────────────────────── */
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlTexto, 'text/xml');
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) return null;

    /* ── Metadatos del paciente ──────────────────────────────── */
    const pacienteId  = xmlDoc.querySelector('PatientID')?.textContent?.trim()                     || 'N/A';
    const edad        = xmlDoc.querySelector('Age')?.textContent?.trim()                           || 'N/A';
    const sexoCode    = xmlDoc.querySelector('administrativeGenderCode')?.getAttribute('code')     || 'N/A';
    const sexo        = sexoCode === 'M' ? 'Masculino' : sexoCode === 'F' ? 'Femenino' : sexoCode;
    const modelo      = xmlDoc.querySelector('manufacturerModelName')?.textContent?.trim()        || 'N/A';
    const serial      = xmlDoc.querySelector('SerialNumber')?.textContent?.trim()                 || 'N/A';
    const software    = xmlDoc.querySelector('softwareName')?.textContent?.trim()                 || 'N/A';
    const fechaRaw    = xmlDoc.querySelector('effectiveTime > low')?.getAttribute('value')        || '';
    const fechaEstudio = fechaRaw.length >= 8
        ? `${fechaRaw.slice(0,4)}-${fechaRaw.slice(4,6)}-${fechaRaw.slice(6,8)}`
        : 'N/A';

    /* ── Derivaciones estándar 12 leads ─────────────────────── */
    const NOMBRES = ['DI','DII','DIII','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];

    /* Leer UN sequenceSet específico → [{nombre,digits,origin,scale}] */
    function leerSequenceSet(ssEl) {
        const deriv = [];
        for (const comp of ssEl.children) {
            const val = comp.querySelector('value');
            if (!val) continue;
            const tipo = val.getAttribute('xsi:type') || val.getAttribute('type') || '';
            if (tipo !== 'SLIST_PQ') continue;
            const digEl = val.querySelector('digits');
            if (!digEl) continue;
            deriv.push({
                nombre : NOMBRES[deriv.length] || `Canal_${deriv.length + 1}`,
                digits : digEl.textContent.trim().split(/\s+/).map(Number),
                origin : parseFloat(val.querySelector('origin')?.getAttribute('value') || '0'),
                scale  : parseFloat(val.querySelector('scale')?.getAttribute('value')  || '1'),
            });
        }
        return deriv;
    }

    const ssList = xmlDoc.getElementsByTagName('sequenceSet');
    if (ssList.length === 0) return null;

    // Primer sequenceSet = ECG completo (10 s, 10 000 muestras @ 1 kHz)
    const derivPrincipales = leerSequenceSet(ssList[0]);
    if (derivPrincipales.length === 0) return null;

    // Segundo sequenceSet (opcional) = tiras de ritmo
    const derivRitmo = ssList.length > 1 ? leerSequenceSet(ssList[1]) : [];

    /* ── Frecuencia de muestreo ──────────────────────────────── */
    let incremento = 0.001;
    const firstVal = ssList[0].querySelector('value');
    if (firstVal) {
        const tipo = firstVal.getAttribute('xsi:type') || firstVal.getAttribute('type') || '';
        if (tipo === 'GLIST_TS') {
            const inc = firstVal.querySelector('increment');
            if (inc) incremento = parseFloat(inc.getAttribute('value') || '0.001');
        }
    }
    const frecuencia = Math.round(1 / incremento);
    const nMuestras  = Math.max(...derivPrincipales.map(d => d.digits.length));
    const duracion   = parseFloat((nMuestras * incremento).toFixed(3));

    /* ── Colores corporativos BioSigLab ─────────────────────── */
    const COLOR = {
        azulOscuro  : '1A3A5C',   // header principal
        azulMedio   : '2E6DA4',   // sub-header
        azulClaro   : 'D6E4F0',   // fila par
        verde       : '1A7A4A',   // acento positivo
        grisClaro   : 'F5F7FA',   // fondo cuerpo
        grisTexto   : '555555',
        blanco      : 'FFFFFF',
        amarillo    : 'FFF3CD',   // advertencia / nota
    };

    /* ── Helpers de estilo ───────────────────────────────────── */
    const cell = (v, s = {}) => ({ v, t: typeof v === 'number' ? 'n' : 's', s });

    const estilo = {
        titulo: {
            font  : { name: 'Calibri', bold: true, sz: 16, color: { rgb: COLOR.blanco } },
            fill  : { fgColor: { rgb: COLOR.azulOscuro }, patternType: 'solid' },
            alignment: { horizontal: 'left', vertical: 'center' },
        },
        subtitulo: {
            font  : { name: 'Calibri', bold: true, sz: 11, color: { rgb: COLOR.blanco } },
            fill  : { fgColor: { rgb: COLOR.azulMedio }, patternType: 'solid' },
            alignment: { horizontal: 'left', vertical: 'center' },
        },
        encabezado: {
            font  : { name: 'Calibri', bold: true, sz: 10, color: { rgb: COLOR.blanco } },
            fill  : { fgColor: { rgb: COLOR.azulOscuro }, patternType: 'solid' },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: { bottom: { style: 'thin', color: { rgb: COLOR.azulMedio } } },
        },
        campo: {
            font  : { name: 'Calibri', bold: true, sz: 10, color: { rgb: COLOR.azulOscuro } },
            fill  : { fgColor: { rgb: COLOR.grisClaro }, patternType: 'solid' },
            alignment: { horizontal: 'left', vertical: 'center' },
        },
        valor: {
            font  : { name: 'Calibri', sz: 10, color: { rgb: COLOR.grisTexto } },
            fill  : { fgColor: { rgb: COLOR.blanco }, patternType: 'solid' },
            alignment: { horizontal: 'left', vertical: 'center' },
        },
        valorNum: {
            font  : { name: 'Calibri', sz: 10, color: { rgb: COLOR.grisTexto } },
            fill  : { fgColor: { rgb: COLOR.blanco }, patternType: 'solid' },
            alignment: { horizontal: 'right', vertical: 'center' },
            numFmt: '#,##0',
        },
        nota: {
            font  : { name: 'Calibri', italic: true, sz: 9, color: { rgb: COLOR.grisTexto } },
            fill  : { fgColor: { rgb: COLOR.amarillo }, patternType: 'solid' },
            alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
        },
        datoCelda: (par) => ({
            font : { name: 'Calibri', sz: 9 },
            fill : { fgColor: { rgb: par ? COLOR.azulClaro : COLOR.blanco }, patternType: 'solid' },
            alignment: { horizontal: 'right', vertical: 'center' },
            numFmt: '0.00',
        }),
        tiempoCelda: (par) => ({
            font : { name: 'Calibri', sz: 9, color: { rgb: COLOR.azulOscuro } },
            fill : { fgColor: { rgb: par ? COLOR.azulClaro : COLOR.blanco }, patternType: 'solid' },
            alignment: { horizontal: 'right', vertical: 'center' },
            numFmt: '0.0000',
        }),
    };

    /* ════════════════════════════════════════════════════════════
       WORKBOOK
    ════════════════════════════════════════════════════════════ */
    const wb = XLSX.utils.book_new();
    wb.Props = {
        Title   : 'BioSigLab – Señales ECG',
        Subject : 'Electrocardiograma',
        Author  : 'BioSigLab UABC',
    };

    /* ─────────────────────────────────────────────────────────
       HOJA 1 – METADATOS
    ───────────────────────────────────────────────────────── */
    {
        const ws = {};
        const ref = (r, c) => XLSX.utils.encode_cell({ r, c });
        let row = 0;

        // Fila 0: Título
        ws[ref(row,0)] = { v: '🫀 BioSigLab — Señales Bioeléctricas ECG', t:'s', s: estilo.titulo };
        ws[ref(row,1)] = { v: '', t:'s', s: estilo.titulo };
        row++;

        // Fila 1: Universidad
        ws[ref(row,0)] = { v: 'Universidad Autónoma de Baja California (UABC)', t:'s', s: estilo.subtitulo };
        ws[ref(row,1)] = { v: '', t:'s', s: estilo.subtitulo };
        row++;

        // Fila 2: vacía
        ws[ref(row,0)] = { v: '', t:'s' };
        row++;

        // Sección Datos del Paciente
        ws[ref(row,0)] = { v: 'DATOS DEL PACIENTE', t:'s', s: estilo.subtitulo };
        ws[ref(row,1)] = { v: '', t:'s', s: estilo.subtitulo };
        row++;

        const filasMeta = [
            ['Paciente ID',        pacienteId,   false],
            ['Edad',               edad,          false],
            ['Sexo',               sexo,          false],
            ['Fecha de estudio',   fechaEstudio,  false],
        ];
        for (const [campo, valor] of filasMeta) {
            ws[ref(row,0)] = { v: campo, t:'s', s: estilo.campo };
            ws[ref(row,1)] = { v: valor, t:'s', s: estilo.valor };
            row++;
        }

        row++; // espacio

        // Sección Equipo
        ws[ref(row,0)] = { v: 'EQUIPO DE ADQUISICIÓN', t:'s', s: estilo.subtitulo };
        ws[ref(row,1)] = { v: '', t:'s', s: estilo.subtitulo };
        row++;

        const filasEquipo = [
            ['Modelo',              modelo],
            ['Número de serie',     serial],
            ['Versión de software', software],
            ['Archivo fuente',      nombreArchivo],
        ];
        for (const [campo, valor] of filasEquipo) {
            ws[ref(row,0)] = { v: campo, t:'s', s: estilo.campo };
            ws[ref(row,1)] = { v: valor, t:'s', s: estilo.valor };
            row++;
        }

        row++; // espacio

        // Sección Parámetros de señal
        ws[ref(row,0)] = { v: 'PARÁMETROS DE SEÑAL', t:'s', s: estilo.subtitulo };
        ws[ref(row,1)] = { v: '', t:'s', s: estilo.subtitulo };
        row++;

        const filasParam = [
            ['Frecuencia de muestreo', frecuencia + ' Hz'],
            ['Número de muestras',     nMuestras.toLocaleString('es-MX')],
            ['Duración',               duracion + ' s'],
            ['Unidad de amplitud',     'µV (microvoltios)'],
            ['Derivaciones registradas', NOMBRES.join(', ')],
            ['Hojas en este archivo',  'Metadatos · Señales ECG · Tiras Ritmo'],
        ];
        for (const [campo, valor] of filasParam) {
            ws[ref(row,0)] = { v: campo, t:'s', s: estilo.campo };
            ws[ref(row,1)] = { v: valor, t:'s', s: estilo.valor };
            row++;
        }

        row++; // espacio

        // Nota de uso
        ws[ref(row,0)] = { v: '⚠ Nota: Los valores de amplitud están en microvoltios (µV). La hoja "Señales ECG" contiene el registro completo de 10 s. La hoja "Tiras Ritmo" contiene segmentos cortos de 0.6 s por derivación.', t:'s', s: estilo.nota };
        ws[ref(row,1)] = { v: '', t:'s', s: estilo.nota };
        row++;

        ws['!ref'] = XLSX.utils.encode_range({ s:{r:0,c:0}, e:{r:row,c:1} });
        ws['!cols'] = [{ wch: 30 }, { wch: 55 }];
        ws['!rows'] = [{ hpt: 28 }, { hpt: 20 }];
        ws['!merges'] = [
            { s:{r:0,c:0}, e:{r:0,c:1} },   // título
            { s:{r:1,c:0}, e:{r:1,c:1} },   // subtitulo UABC
            { s:{r:row-1,c:0}, e:{r:row-1,c:1} },  // nota
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Metadatos');
    }

    /* ─────────────────────────────────────────────────────────
       HOJA 2 – SEÑALES ECG  (10 000 filas + encabezado)
    ───────────────────────────────────────────────────────── */
    function construirHojaSenal(derivaciones, incr, hojaNombre) {
        const ws = {};
        const nDeriv = derivaciones.length;
        const nRows  = Math.max(...derivaciones.map(d => d.digits.length));

        // Fila 0: encabezados
        const encabezados = ['tiempo_s', ...derivaciones.map(d => `${d.nombre}\n(µV)`)];
        for (let c = 0; c < encabezados.length; c++) {
            ws[XLSX.utils.encode_cell({r:0, c})] = { v: encabezados[c], t:'s', s: estilo.encabezado };
        }

        // Filas de datos
        for (let i = 0; i < nRows; i++) {
            const par = i % 2 === 0;
            const r   = i + 1;

            // Columna tiempo
            ws[XLSX.utils.encode_cell({r, c:0})] = {
                v: parseFloat((i * incr).toFixed(4)), t:'n', s: estilo.tiempoCelda(par)
            };

            // Columnas derivaciones
            for (let c = 0; c < nDeriv; c++) {
                const d = derivaciones[c];
                const v = i < d.digits.length
                    ? parseFloat((d.origin + d.digits[i] * d.scale).toFixed(2))
                    : '';
                ws[XLSX.utils.encode_cell({r, c: c+1})] = {
                    v, t: typeof v === 'number' ? 'n' : 's', s: estilo.datoCelda(par)
                };
            }
        }

        ws['!ref']    = XLSX.utils.encode_range({ s:{r:0,c:0}, e:{r:nRows, c:nDeriv} });
        ws['!cols']   = [{ wch: 9 }, ...derivaciones.map(() => ({ wch: 9 }))];
        ws['!rows']   = [{ hpt: 30 }]; // solo la fila de encabezado más alta
        ws['!freeze'] = { xSplit: 1, ySplit: 1 }; // congelar columna tiempo + fila encabezado

        return ws;
    }

    XLSX.utils.book_append_sheet(
        wb,
        construirHojaSenal(derivPrincipales, incremento, 'Señales ECG'),
        'Señales ECG'
    );

    /* ─────────────────────────────────────────────────────────
       HOJA 3 – TIRAS DE RITMO (si existen)
    ───────────────────────────────────────────────────────── */
    if (derivRitmo.length > 0) {
        XLSX.utils.book_append_sheet(
            wb,
            construirHojaSenal(derivRitmo, incremento, 'Tiras Ritmo'),
            'Tiras Ritmo'
        );
    }

    return wb;
}


function inicializarArchivos() {
    if (!localStorage.getItem(STORAGE_KEYS.archivos)) {
=======
function renderizarArchivosAdmin() {
    const contenedor = document.getElementById("adminXmlList");
    const contador = document.getElementById("adminXmlCount");

    if (!contenedor || !contador) {
        return;
    }

    const archivos = obtenerArchivos();
    contenedor.innerHTML = "";
    contador.textContent = `${archivos.length} archivos`;

    archivos.forEach((archivo) => {
        const card = document.createElement("article");
        card.className = "file-card";
        card.innerHTML = `
            <p class="file-tag">XML</p>
            <h4>${escaparHtml(archivo.nombre)}</h4>
            <p>Autor: ${escaparHtml(archivo.autor)}</p>
            <p>${archivo.correo ? `Correo: ${escaparHtml(archivo.correo)}` : "Archivo base del sistema"}</p>
            <p>Fecha: ${escaparHtml(archivo.fecha)}</p>
            <div class="file-actions">
                <button class="ghost-button" type="button" onclick="descargarArchivo('${archivo.id}')">Descargar</button>
                <button class="ghost-button" type="button" onclick="verContenidoXmlAdmin('${archivo.id}')">Ver contenido</button>
            </div>
            <pre id="admin-preview-${archivo.id}" class="xml-preview oculto"></pre>
        `;
        contenedor.appendChild(card);
    });
}

function descargarArchivo(idArchivo) {
    const archivo = obtenerArchivos().find((item) => item.id === idArchivo);

    if (!archivo) {
        return;
    }

    const blob = new Blob([archivo.contenido], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = archivo.nombre;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
}

function verContenidoXml(idArchivo) {
    alternarVistaPrevia(idArchivo, "preview-");
}

function verContenidoXmlAdmin(idArchivo) {
    alternarVistaPrevia(idArchivo, "admin-preview-");
}

function alternarVistaPrevia(idArchivo, prefijo) {
    const archivo = obtenerArchivos().find((item) => item.id === idArchivo);
    const preview = document.getElementById(`${prefijo}${idArchivo}`);

    if (!archivo || !preview) {
        return;
    }

    const estaOculto = preview.classList.contains("oculto");
    preview.textContent = archivo.contenido;
    preview.classList.toggle("oculto", !estaOculto);
}

function inicializarArchivos() {
    const archivosGuardados = localStorage.getItem(STORAGE_KEYS.archivos);
    if (!archivosGuardados) {
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
        guardarArchivos(XML_BASE);
    }
}

<<<<<<< HEAD
function obtenerUsuarios() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.usuarios) || "[]"); }
function guardarUsuarios(usuarios) { localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios)); }
function obtenerArchivos() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.archivos) || "[]"); }
function guardarArchivos(archivos) { localStorage.setItem(STORAGE_KEYS.archivos, JSON.stringify(archivos)); }
function obtenerSesionUsuario() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.sesionUsuario) || "null"); }

function obtenerFechaActual() {
    return new Date().toLocaleString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function escaparHtml(valor) {
    return String(valor).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function filtrarArchivosUsuario() {
    const busqueda = document.getElementById("buscarGeneral").value.toLowerCase();
    const genero = document.getElementById("filtroGenero").value;
    const edadRango = document.getElementById("filtroEdadXml").value;
    const filas = document.querySelectorAll("#xmlListTable tr");

    filas.forEach(fila => {
        const idNombre = fila.cells[0].textContent.toLowerCase();
        const fEdad = fila.cells[1].textContent;
        const fGenero = fila.cells[2].textContent;

        let coincide = idNombre.includes(busqueda);
        if (genero !== "todos" && fGenero !== genero) coincide = false;
        
        // Lógica de rango de edad
        const edadNum = parseInt(fEdad.replace(/\D/g,'')) || 0;
        if (edadRango === "joven" && edadNum > 30) coincide = false;
        if (edadRango === "adulto" && (edadNum <= 30 || edadNum > 60)) coincide = false;
        if (edadRango === "geriatrico" && edadNum <= 60) coincide = false;

        fila.style.display = coincide ? "" : "none";
    });
}

function actualizarResumen() {
    const total = document.getElementById("totalPersonas");
    if (total) total.textContent = obtenerArchivos().length;
=======
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.usuarios) || "[]");
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
}

function obtenerArchivos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.archivos) || "[]");
}

function guardarArchivos(archivos) {
    localStorage.setItem(STORAGE_KEYS.archivos, JSON.stringify(archivos));
}

function obtenerSesionUsuario() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.sesionUsuario) || "null");
}

function obtenerFechaActual() {
    const fecha = new Date();
    return fecha.toLocaleString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function escaparHtml(valor) {
    return String(valor).replace(/[&<>"']/g, (caracter) => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entidades[caracter];
    });
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
}

function filtrar() {
    const ciudad = document.getElementById("filtroCiudad").value;
    const edad = document.getElementById("filtroEdad").value;
    const sexo = document.getElementById("filtroSexo").value;
    const sangre = document.getElementById("filtroSangre").value;
    const personas = document.querySelectorAll(".persona");

    personas.forEach((persona) => {
        const pCiudad = persona.dataset.ciudad;
        const pEdad = Number(persona.dataset.edad);
        const pSexo = persona.dataset.sexo;
        const pSangre = persona.dataset.sangre;

        let mostrar = true;

        if (ciudad !== "todos" && ciudad !== pCiudad) {
            mostrar = false;
        }

        if (sexo !== "todos" && sexo !== pSexo) {
            mostrar = false;
        }

        if (sangre !== "todos" && sangre !== pSangre) {
            mostrar = false;
        }

        if (edad !== "todos") {
            if (edad === "18-25" && (pEdad < 18 || pEdad > 25)) {
                mostrar = false;
            }
            if (edad === "26-35" && (pEdad < 26 || pEdad > 35)) {
                mostrar = false;
            }
            if (edad === "36-50" && (pEdad < 36 || pEdad > 50)) {
                mostrar = false;
            }
        }

        persona.classList.toggle("oculto", !mostrar);
    });

    actualizarResumen();
}

function limpiarFiltros() {
<<<<<<< HEAD
    const elCiudad = document.getElementById("filtroCiudad");
    const elEdad = document.getElementById("filtroEdad");
    const elSexo = document.getElementById("filtroSexo");
    const elSangre = document.getElementById("filtroSangre");

    if (elCiudad) elCiudad.value = "todos";
    if (elEdad) elEdad.value = "todos";
    if (elSexo) elSexo.value = "todos";
    if (elSangre) elSangre.value = "todos";
=======
    document.getElementById("filtroCiudad").value = "todos";
    document.getElementById("filtroEdad").value = "todos";
    document.getElementById("filtroSexo").value = "todos";
    document.getElementById("filtroSangre").value = "todos";
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c

    document.querySelectorAll(".persona").forEach((persona) => {
        persona.classList.remove("oculto");
    });

    actualizarResumen();
}
<<<<<<< HEAD
=======

function actualizarResumen() {
    const personas = Array.from(document.querySelectorAll(".persona"));
    const visibles = personas.filter((persona) => !persona.classList.contains("oculto"));
    const ciudades = new Set(personas.map((persona) => persona.dataset.ciudad));
    const tipos = new Set(personas.map((persona) => persona.dataset.sangre));

    const totalPersonas = document.getElementById("totalPersonas");
    if (!totalPersonas) {
        return;
    }

    document.getElementById("totalPersonas").textContent = personas.length;
    document.getElementById("totalCiudades").textContent = ciudades.size;
    document.getElementById("totalTipos").textContent = tipos.size;
    document.getElementById("personasVisibles").textContent = visibles.length;

    const mensaje = document.getElementById("mensajeResultado");
    if (!mensaje) {
        return;
    }

    if (visibles.length === personas.length) {
        mensaje.textContent = "Mostrando todos los registros.";
        return;
    }

    if (visibles.length === 0) {
        mensaje.textContent = "No se encontraron resultados con esos filtros.";
        return;
    }

    mensaje.textContent = `Se encontraron ${visibles.length} registros.`;
}
>>>>>>> ee135220a529e621e0b8e21654f0e3e2f8f8ba9c
