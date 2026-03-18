const CREDENCIALES = {
    usuario: "admin",
    clave: "1234"
};

const STORAGE_KEYS = {
    usuarios: "bioelectricas_usuarios",
    archivos: "bioelectricas_archivos_xml",
    sesionUsuario: "bioelectricas_usuario_actual"
};

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
}

function cerrarSesion() {
    document.getElementById("usuario").value = "";
    document.getElementById("clave").value = "";
    document.getElementById("loginMensaje").textContent = "";
    limpiarFiltros();
    mostrarVista("homeView");
}

function registrarUsuario(event) {
    event.preventDefault();

    const registro = {
        id: `usr-${Date.now()}`,
        nombre: document.getElementById("visitorNombre").value.trim(),
        correo: document.getElementById("visitorCorreo").value.trim(),
        edad: document.getElementById("visitorEdad").value.trim(),
        universidad: document.getElementById("visitorUniversidad").value.trim(),
        motivo: document.getElementById("visitorMotivo").value.trim(),
        fecha: obtenerFechaActual()
    };

    const usuarios = obtenerUsuarios();
    usuarios.unshift(registro);
    guardarUsuarios(usuarios);
    localStorage.setItem(STORAGE_KEYS.sesionUsuario, JSON.stringify(registro));

    document.getElementById("surveyMensaje").textContent = "Registro completado. Acceso habilitado al repositorio XML.";
    document.querySelector(".survey-form").reset();

    actualizarPanelUsuario();
    renderizarRegistrosAdmin();
    mostrarVista("userView");
}

function restaurarSesionUsuario() {
    const sesion = localStorage.getItem(STORAGE_KEYS.sesionUsuario);

    if (!sesion) {
        actualizarPanelUsuario();
        return;
    }

    actualizarPanelUsuario();
}

function actualizarPanelUsuario() {
    const usuarioActual = obtenerSesionUsuario();
    const bienvenida = document.getElementById("userWelcome");

    if (bienvenida) {
        bienvenida.textContent = usuarioActual
            ? `${usuarioActual.nombre}, ya puedes revisar los XML disponibles y compartir nuevos archivos.`
            : "Completa la encuesta para habilitar tu acceso al repositorio.";
    }

    const archivos = obtenerArchivos();
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

    const archivos = obtenerArchivos();
    contenedor.innerHTML = "";

    archivos.forEach((archivo) => {
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
    });
}

function renderizarRegistrosAdmin() {
    const contenedor = document.getElementById("userRegistry");
    const contador = document.getElementById("userRegistryCount");

    if (!contenedor || !contador) {
        return;
    }

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
        guardarArchivos(XML_BASE);
    }
}

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
    document.getElementById("filtroCiudad").value = "todos";
    document.getElementById("filtroEdad").value = "todos";
    document.getElementById("filtroSexo").value = "todos";
    document.getElementById("filtroSangre").value = "todos";

    document.querySelectorAll(".persona").forEach((persona) => {
        persona.classList.remove("oculto");
    });

    actualizarResumen();
}

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
