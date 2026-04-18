<?php

declare(strict_types=1);

session_start();

header('Content-Type: application/json; charset=utf-8');

$admin = $_SESSION['admin_auth'] ?? null;

echo json_encode([
    'authenticated' => $admin !== null,
    'admin' => $admin,
]);
