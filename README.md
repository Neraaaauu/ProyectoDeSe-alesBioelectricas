# BioSigLab - Plataforma de Señales Bioeléctricas 🫀💻

Proyecto desarrollado por estudiantes de Ingeniería de la **Universidad Autónoma de Baja California (UABC)**. Esta plataforma web funciona como un repositorio y panel administrativo para la recolección, estructuración y visualización interactiva de señales bioeléctricas (Electrocardiogramas - ECG) almacenadas en formato XML.

## 📌 Descripción del Proyecto

El sistema está diseñado para facilitar el acceso y la gestión de bases de datos clínicos a estudiantes, investigadores y profesionales de la salud. Cuenta con una separación de roles clara:
- **Visitantes/Usuarios:** Pueden llenar una encuesta de motivos de acceso, consultar archivos XML disponibles y aportar nuevos registros a la base de datos.
- **Administradores:** Tienen un entorno seguro para gestionar la base de registros, filtrar pacientes, revisar encuestas de visitantes y validar los archivos XML subidos.

## ✨ Funcionalidades Principales

### 🛡️ Panel de Administrador (`adminlogin.html`)
- Acceso mediante credenciales seguras.
- **Dashboard Estadístico:** Vista general del total de personas, ciudades, tipos de sangre y archivos registrados.
- **Motor de Búsqueda Avanzado:** Filtros dinámicos por Ciudad, Edad, Sexo y Tipo de Sangre.
- **Gestión Clínica:** Tarjetas de pacientes con acceso directo a su electrocardiograma interactivo.
- **Revisión de Aportes:** Control sobre las encuestas enviadas y los archivos XML aportados por los usuarios.

### 👥 Portal de Usuarios (`usuario.html`)
- Formulario de registro (encuesta) para justificar el acceso al repositorio clínico.
- Interfaz para la carga (upload) de nuevos archivos XML al servidor.
- Visualización de la galería de archivos disponibles para consulta.

### 📈 Visualizador ECG Avanzado (`Ondas.html`)
- Gráficas interactivas renderizadas a partir de los datos del paciente.
- Soporte para visualizar múltiples derivaciones (V1-V6, DI, DII, DIII, aVR, aVL, aVF).
- Herramientas de **Zoom y Pan** integradas para analizar la señal a detalle.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 semántico, CSS3 (Diseño responsivo, Grid/Flexbox, UI moderna estilo Glassmorphism) y Vanilla JavaScript.
- **Librerías:** - `Chart.js` & `chartjs-plugin-zoom`: Para la renderización y manipulación interactiva de las ondas del electrocardiograma.
- **Arquitectura:** Diseño basado en componentes UI modulares y vistas dinámicas.

## 📂 Estructura del Proyecto

```text
/
├── index.html                # Landing page principal
├── equipo.html               # Perfiles del equipo de desarrollo
├── pages/
│   ├── adminlogin.html       # Portal exclusivo y dashboard de administrador
│   ├── usuario.html          # Portal para visitantes y carga de XML
│   ├── Ondas.html            # Visualizador de electrocardiogramas
│   └── demostracionsenales.html # Animación de monitor ECG en tiempo real
├── assets/
│   ├── css/
│   │   ├── style.css         # Estilos globales de la aplicación
│   │   ├── style-landing.css # Estilos específicos para Inicio y Equipo
│   │   └── Ondastyle.css     # Estilos del visualizador de gráficas
│   └── js/
│       ├── script.js         # Lógica principal, filtros y manejo de vistas
│       └── Onda.js           # Lógica de renderizado Chart.js para el ECG
└── README.md
