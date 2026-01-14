<?php
require_once '../../cors.php';
require_once '../../config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['username', 'password'];
$missing = validateRequired($input, $required);

if (!empty($missing)) {
    sendResponse(false, 'Missing required fields: ' . implode(', ', $missing), null, 400);
}

// Get database connection
$conn = getDBConnection();

// Find admin by username
$stmt = $conn->prepare("SELECT * FROM administrators WHERE username = ?");
$stmt->bind_param("s", $input['username']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    sendResponse(false, 'Invalid username or password', null, 401);
}

$admin = $result->fetch_assoc();
$stmt->close();

// Verify password
if (!password_verify($input['password'], $admin['password'])) {
    $conn->close();
    sendResponse(false, 'Invalid username or password', null, 401);
}

// Create session
$_SESSION['user_id'] = $admin['admin_id'];
$_SESSION['role'] = 'admin';
$_SESSION['username'] = $admin['username'];

// Remove password from response
unset($admin['password']);

$conn->close();
sendResponse(true, 'Login successful', [
    'admin' => $admin,
    'session_id' => session_id()
], 200);
?>