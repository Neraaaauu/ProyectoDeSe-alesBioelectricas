function filtrar() {
    // Obtenemos los valores de los selectores
    const ciudad = document.getElementById("filtroCiudad").value;
    const edad = document.getElementById("filtroEdad").value;
    const sexo = document.getElementById("filtroSexo").value;
    const sangre = document.getElementById("filtroSangre").value;

    // Seleccionamos todos los elementos con la clase persona
    const personas = document.querySelectorAll(".persona");

    personas.forEach(p => {
        // Obtenemos los datos desde los data-attributes
        const pCiudad = p.dataset.ciudad;
        const pEdad = parseInt(p.dataset.edad);
        const pSexo = p.dataset.sexo;
        const pSangre = p.dataset.sangre;

        let mostrar = true;

        // Validación de Ciudad
        if (ciudad !== "todos" && ciudad !== pCiudad) {
            mostrar = false;
        }

        // Validación de Sexo
        if (sexo !== "todos" && sexo !== pSexo) {
            mostrar = false;
        }

        // Validación de Sangre
        if (sangre !== "todos" && sangre !== pSangre) {
            mostrar = false;
        }

        // Validación de Rango de Edad
        if (edad !== "todos") {
            if (edad === "18-25" && (pEdad < 18 || pEdad > 25)) mostrar = false;
            if (edad === "26-35" && (pEdad < 26 || pEdad > 35)) mostrar = false;
            if (edad === "36-50" && (pEdad < 36 || pEdad > 50)) mostrar = false;
        }

        // Aplicamos o removemos la clase 'oculto' según el resultado
        p.classList.toggle("oculto", !mostrar);
    });
}
