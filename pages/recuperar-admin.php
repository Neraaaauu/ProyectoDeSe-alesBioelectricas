<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/db_loader.php';

$mensaje = '';
$tipoMensaje = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim((string) ($_POST['usuario'] ?? ''));
    $correo = trim((string) ($_POST['correo'] ?? ''));
    $nuevaClave = (string) ($_POST['nueva_clave'] ?? '');
    $confirmacion = (string) ($_POST['confirmacion'] ?? '');

    if ($usuario === '' || $correo === '' || $nuevaClave === '' || $confirmacion === '') {
        $mensaje = 'Completa todos los campos para recuperar la contrasena.';
        $tipoMensaje = 'error';
    } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $mensaje = 'Ingresa un correo valido.';
        $tipoMensaje = 'error';
    } elseif ($nuevaClave !== $confirmacion) {
        $mensaje = 'Las contrasenas no coinciden.';
        $tipoMensaje = 'error';
    } elseif (strlen($nuevaClave) < 6) {
        $mensaje = 'La nueva contrasena debe tener al menos 6 caracteres.';
        $tipoMensaje = 'error';
    } else {
        $stmt = getDB()->prepare('SELECT id FROM admins WHERE usuario = :usuario AND correo = :correo LIMIT 1');
        $stmt->execute([
            'usuario' => $usuario,
            'correo' => $correo,
        ]);
        $admin = $stmt->fetch();

        if (!$admin) {
            $mensaje = 'No encontramos un administrador con ese usuario y correo.';
            $tipoMensaje = 'error';
        } else {
            $update = getDB()->prepare('UPDATE admins SET password_hash = :password_hash WHERE id = :id');
            $update->execute([
                'password_hash' => password_hash($nuevaClave, PASSWORD_DEFAULT),
                'id' => $admin['id'],
            ]);

            $mensaje = 'Contrasena actualizada correctamente. Ya puedes volver al login.';
            $tipoMensaje = 'success';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BioSigLab - Recuperar Contraseña</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <main class="app-shell">
        <section class="login-view">
            <div class="login-panel admin-login-panel">
                <div class="login-copy">
                    <p class="eyebrow">Recuperacion segura</p>
                    <h1>Restablece tu acceso de administrador</h1>
                    <p>Confirma tu usuario y correo registrados. Despues podras definir una nueva contrasena para entrar al panel.</p>
                </div>

                <form class="login-form" method="post" action="recuperar-admin.php">
                    <label class="field">
                        <span>Usuario</span>
                        <input name="usuario" type="text" placeholder="Ingresa tu usuario" required>
                    </label>

                    <label class="field">
                        <span>Correo</span>
                        <input name="correo" type="email" placeholder="admin@biosiglab.com" required>
                    </label>

                    <label class="field">
                        <span>Nueva contraseña</span>
                        <input name="nueva_clave" type="password" placeholder="Minimo 6 caracteres" required>
                    </label>

                    <label class="field">
                        <span>Confirmar contraseña</span>
                        <input name="confirmacion" type="password" placeholder="Repite la nueva contrasena" required>
                    </label>

                    <button class="primary-button" type="submit">Actualizar contraseña</button>
                    <div class="login-actions">
                        <button class="ghost-button" type="button" onclick="window.location.href='adminlogin.html'">Volver al login</button>
                        <button class="ghost-button" type="button" onclick="window.location.href='../index.html'">Regresar al inicio</button>
                    </div>
                    <p class="form-message <?= $tipoMensaje === 'success' ? 'success-message' : '' ?>"><?= htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8') ?></p>
                </form>
            </div>
        </section>
    </main>
</body>
</html>
