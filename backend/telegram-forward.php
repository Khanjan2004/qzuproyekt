<?php

declare(strict_types=1);

$target = $_GET['target'] ?? '';

if ($target === '' || !preg_match('/^https:\/\/t\.me\//', $target)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Invalid Telegram target URL.';
    exit;
}

$storageDir = __DIR__ . '/data';
if (!is_dir($storageDir)) {
    mkdir($storageDir, 0775, true);
}

$log = [
    'event' => 'telegram_redirect',
    'target' => $target,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
    'timestamp' => gmdate('c'),
];

file_put_contents(
    $storageDir . '/telegram.log',
    json_encode($log, JSON_UNESCAPED_SLASHES) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

header('Location: ' . $target, true, 302);
exit;
