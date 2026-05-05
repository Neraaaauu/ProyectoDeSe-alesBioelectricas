# BioSigLab — Base de Datos (MySQL + phpMyAdmin + PHP)

## Estructura de archivos

```
biosiglab_db/
├── sql/
│   ├── 01_schema.sql       ← Crear tablas, índices y vistas
│   └── 02_seed_data.sql    ← Datos de prueba (10 pacientes + ECG + encuestas)
├── config/
│   └── db.php              ← Configuración de conexión PDO
└── php/
    ├── pacientes.php        ← API CRUD de pacientes + estadísticas
    ├── archivos.php         ← API subida / descarga de ECG XML
    └── encuestas.php        ← API encuestas + autenticación admin
```

---

## Instalación paso a paso (XAMPP)

### 1. Instalar XAMPP
Descarga desde https://www.apachefriends.org e instala normalmente.
Inicia los módulos **Apache** y **MySQL** desde el panel.

### 2. Importar la base de datos en phpMyAdmin

1. Abre http://localhost/phpmyadmin
2. Haz clic en **"Nueva"** (panel izquierdo)
3. Escribe `biosiglab` como nombre y selecciona `utf8mb4_unicode_ci`
4. Haz clic en **"Crear"**
5. Ve a la pestaña **"Importar"**
6. Haz clic en **"Elegir archivo"** y selecciona `01_schema.sql`
7. Haz clic en **"Continuar"** — se crearán las 5 tablas y 2 vistas
8. Repite el paso de importar con `02_seed_data.sql` para cargar los datos de prueba

### 3. Copiar los archivos PHP

Copia la carpeta `biosiglab_db/` dentro de la carpeta raíz de XAMPP:

```
Windows:  C:\xampp\htdocs\biosiglab_db\
Mac/Linux: /opt/lampp/htdocs/biosiglab_db/
```

### 4. Verificar la conexión

Abre en el navegador:
```
http://localhost/biosiglab_db/php/pacientes.php?action=listar
```

Deberías ver los 10 pacientes en formato JSON.

---

## Tablas de la base de datos

| Tabla             | Descripción                                          |
|-------------------|------------------------------------------------------|
| `administradores` | Usuarios con acceso al panel admin                   |
| `pacientes`       | Datos demográficos de cada paciente ECG              |
| `archivos_xml`    | Archivos ECG almacenados como LONGTEXT               |
| `encuestas`       | Visitantes registrados en el portal                  |
| `sesiones_usuario`| Control de sesiones PHP de visitantes                |

### Vistas

| Vista                 | Descripción                                        |
|-----------------------|----------------------------------------------------|
| `v_pacientes_resumen` | Pacientes con conteo de ECGs asociados             |
| `v_estadisticas`      | Totales globales para el dashboard del admin       |

---

## API — Endpoints disponibles

### pacientes.php

| Método | Parámetro              | Descripción                          |
|--------|------------------------|--------------------------------------|
| GET    | `?action=listar`       | Todos los pacientes (con filtros)    |
| GET    | `?action=listar&ciudad=Tijuana&sexo=F&sangre=O%2B&edad=18-25` | Con filtros |
| GET    | `?action=obtener&id=3` | Un paciente + sus archivos XML       |
| POST   | `?action=crear`        | Crear paciente nuevo                 |
| POST   | `?action=editar`       | Editar paciente existente            |
| POST   | `?action=eliminar`     | Eliminar paciente (y sus ECG)        |
| GET    | `?action=estadisticas` | Dashboard stats + distribuciones     |

### archivos.php

| Método | Parámetro                              | Descripción               |
|--------|----------------------------------------|---------------------------|
| GET    | `?action=listar&id_paciente=3`         | Archivos de un paciente   |
| GET    | `?action=descargar&id=1`               | Descarga el XML           |
| GET    | `?action=contenido&id=1`               | XML + datos del paciente  |
| POST   | `?action=subir`                        | Subir XML (form o raw)    |
| POST   | `?action=eliminar`                     | Eliminar archivo          |

### encuestas.php

| Método | Parámetro                   | Descripción                         |
|--------|-----------------------------|-------------------------------------|
| POST   | `?action=registrar`         | Registro de visitante               |
| GET    | `?action=listar`            | Ver todas las encuestas (admin)     |
| POST   | `?action=aprobar`           | Aprobar o rechazar encuesta         |
| POST   | `?action=login_admin`       | Login del administrador             |
| POST   | `?action=logout_admin`      | Cerrar sesión                       |
| GET    | `?action=check_sesion`      | Estado de sesión del visitante      |

---

## Credenciales por defecto

| Rol         | Usuario | Contraseña  |
|-------------|---------|-------------|
| Admin       | admin   | Admin1234!  |

> ⚠️ Cambia la contraseña en producción usando:
> ```php
> echo password_hash('TuNuevaContraseña', PASSWORD_BCRYPT);
> ```
> Y actualiza el valor en phpMyAdmin → tabla `administradores`.

---

## Conectar con el frontend (JavaScript)

Reemplaza las llamadas a `localStorage` en `script.js` por `fetch()` a la API:

```javascript
// ANTES (localStorage)
const usuarios = JSON.parse(localStorage.getItem('bioelectricas_usuarios') || '[]');

// DESPUÉS (MySQL via PHP)
const res      = await fetch('http://localhost/biosiglab_db/php/encuestas.php?action=listar');
const { data } = await res.json();
```

```javascript
// Subir un archivo XML
const form = new FormData();
form.append('id_paciente', 3);
form.append('autor', 'Dr. García');
form.append('archivo', fileInput.files[0]);

const res = await fetch('http://localhost/biosiglab_db/php/archivos.php?action=subir', {
    method: 'POST',
    body: form,
});
const result = await res.json();
console.log(result); // { ok: true, id_archivo: 4, nombre: "ecg.xml" }
```
