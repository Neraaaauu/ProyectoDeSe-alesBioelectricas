<?php

$configPaths = [
    __DIR__ . '/db.local.php',
    '/Applications/XAMPP/xamppfiles/htdocs/biosiglab_db/config/db.php',
];

foreach ($configPaths as $configPath) {
    if (file_exists($configPath)) {
        require_once $configPath;
        break;
    }
}

if (!function_exists('getDB')) {
    http_response_code(500);
    die(json_encode([
        'error' => 'No se encontro la configuracion de base de datos. Revisa config/db.local.php o la ruta de XAMPP.',
    ]));
}
