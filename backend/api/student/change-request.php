<?php
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../middleware/auth.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

requireStudentAuth();

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['field_name', 'new_value', 'message'];
$missing = validateRequired($input, $required);

if (!empty($missing)) {
    sendResponse(false, 'Missing required fields: ' . implode(', ', $missing), null, 400);
}

$studentId = getAuthenticatedUserId();
$conn = getDBConnection();

// Get current value from student record
$allowedFields = ['first_name', 'last_name', 'phone_number', 'email', 'course', 'year', 'birth_date'];

if (!in_array($input['field_name'], $allowedFields)) {
    $conn->close();
    sendResponse(false, 'Invalid field name', null, 400);
}

// Get old value
$stmt = $conn->prepare("SELECT {$input['field_name']} as old_value FROM students WHERE student_id = ?");
$stmt->bind_param("i", $studentId);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$oldValue = $row['old_value'] ?? '';
$stmt->close();

// Insert change request
$stmt = $conn->prepare(
    "INSERT INTO change_requests (student_id, field_name, old_value, new_value, message) 
     VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "issss",
    $studentId,
    $input['field_name'],
    $oldValue,
    $input['new_value'],
    $input['message']
);

if ($stmt->execute()) {
    $requestId = $stmt->insert_id;
    $stmt->close();
    $conn->close();
    sendResponse(true, 'Change request submitted successfully', ['request_id' => $requestId], 201);
} else {
    $error = $stmt->error;
    $stmt->close();
    $conn->close();
    sendResponse(false, 'Failed to submit request: ' . $error, null, 500);
}
?>