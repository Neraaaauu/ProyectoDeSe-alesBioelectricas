const CREDENCIALES = {
    usuario: "admin",
    clave: "1234"
};

function iniciarSesion(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();
    const mensaje = document.getElementById("loginMensaje");

    if (usuario === CREDENCIALES.usuario && clave === CREDENCIALES.clave) {
        document.getElementById("loginView").classList.add("oculto");
        document.getElementById("adminView").classList.remove("oculto");
        mensaje.textContent = "";
        actualizarResumen();
        return;
    }

    mensaje.textContent = "Usuario o contrasena incorrectos.";
}

function cerrarSesion() {
    document.getElementById("adminView").classList.add("oculto");
    document.getElementById("loginView").classList.remove("oculto");
    document.getElementById("usuario").value = "";
    document.getElementById("clave").value = "";
    document.getElementById("loginMensaje").textContent = "";
    limpiarFiltros();
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
