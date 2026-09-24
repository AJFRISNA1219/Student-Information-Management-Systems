<?php
require_once __DIR__ . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($_SERVER['REQUEST_URI'], '/api/') === false) {
    header('Location: http://localhost:5173', true, 302);
    exit();
}

http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'API endpoint not found. Use the frontend at http://localhost:5173 or call a valid /api route.'
]);
