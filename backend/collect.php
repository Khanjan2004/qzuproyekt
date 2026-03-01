<?php

declare(strict_types=1);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

$storageDir = __DIR__ . '/data';
if (!is_dir($storageDir)) {
    mkdir($storageDir, 0775, true);
}

$sessionId = bin2hex(random_bytes(8));
$entry = [
    'sessionId' => $sessionId,
    'receivedAt' => gmdate('c'),
    'payload' => $payload,
];

$filePath = $storageDir . '/events.log';
file_put_contents($filePath, json_encode($entry, JSON_UNESCAPED_SLASHES) . PHP_EOL, FILE_APPEND | LOCK_EX);

echo json_encode([
    'ok' => true,
    'sessionId' => $sessionId,
]);
