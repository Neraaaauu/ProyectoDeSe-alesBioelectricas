<?php

declare(strict_types=1);

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once dirname(__DIR__, 2) . '/config/db_loader.php';

try {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $usuario = trim((string) ($input['usuario'] ?? ''));
    $clave = (string) ($input['clave'] ?? '');

    if ($usuario === '' || $clave === '') {
        http_response_code(422);
        echo json_encode([
            'ok' => false,
            'message' => 'Ingresa tu usuario y contrasena.',
        ]);
        exit;
    }

    $stmt = getDB()->prepare('SELECT id, usuario, correo, password_hash FROM admins WHERE usuario = :usuario LIMIT 1');
    $stmt->execute(['usuario' => $usuario]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($clave, $admin['password_hash'])) {
        http_response_code(401);
        echo json_encode([
            'ok' => false,
            'message' => 'Usuario o contrasena incorrectos.',
        ]);
        exit;
    }

    session_regenerate_id(true);
    $_SESSION['admin_auth'] = [
        'id' => (int) $admin['id'],
        'usuario' => $admin['usuario'],
        'correo' => $admin['correo'],
    ];

    echo json_encode([
        'ok' => true,
        'message' => 'Sesion iniciada correctamente.',
        'admin' => $_SESSION['admin_auth'],
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'No se pudo iniciar sesion.',
    ]);
}
