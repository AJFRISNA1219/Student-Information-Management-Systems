<?php
// Enable CORS for React frontend (allow dynamic origin during development)
// Allow all localhost dev origins for convenience during local development.
// In production, restrict this to the actual frontend domain.
if (isset($_SERVER['HTTP_ORIGIN']) && (strpos($_SERVER['HTTP_ORIGIN'], 'localhost') !== false || strpos($_SERVER['HTTP_ORIGIN'], '127.0.0.1') !== false)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session for authentication
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>