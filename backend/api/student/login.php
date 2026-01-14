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
$required = ['registration_number', 'password'];
$missing = validateRequired($input, $required);

if (!empty($missing)) {
    sendResponse(false, 'Missing required fields: ' . implode(', ', $missing), null, 400);
}

// Get database connection
$conn = getDBConnection();

// Find student by registration number
$stmt = $conn->prepare("SELECT * FROM students WHERE registration_number = ?");
$stmt->bind_param("s", $input['registration_number']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    sendResponse(false, 'Invalid registration number or password', null, 401);
}

$student = $result->fetch_assoc();
$stmt->close();

// Verify password
if (!password_verify($input['password'], $student['password'])) {
    $conn->close();
    sendResponse(false, 'Invalid registration number or password', null, 401);
}

// Create session
$_SESSION['user_id'] = $student['student_id'];
$_SESSION['role'] = 'student';
$_SESSION['registration_number'] = $student['registration_number'];

// Remove password from response
unset($student['password']);

$conn->close();
sendResponse(true, 'Login successful', [
    'student' => $student,
    'session_id' => session_id()
], 200);
?>