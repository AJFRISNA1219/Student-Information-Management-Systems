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
$required = [
    'registration_number',
    'email',
    'first_name',
    'last_name',
    'birth_date',
    'gender',
    'phone_number',
    'year',
    'course',
    'password',
    'confirm_password'
];

$missing = validateRequired($input, $required);
if (!empty($missing)) {
    sendResponse(false, 'Missing required fields: ' . implode(', ', $missing), null, 400);
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Invalid email format', null, 400);
}

// Validate password match
if ($input['password'] !== $input['confirm_password']) {
    sendResponse(false, 'Passwords do not match', null, 400);
}

// Validate password strength (minimum 6 characters)
if (strlen($input['password']) < 6) {
    sendResponse(false, 'Password must be at least 6 characters long', null, 400);
}

// Get database connection
$conn = getDBConnection();

// Check if registration number already exists
$stmt = $conn->prepare("SELECT student_id FROM students WHERE registration_number = ?");
$stmt->bind_param("s", $input['registration_number']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $stmt->close();
    $conn->close();
    sendResponse(false, 'Registration number already exists', null, 409);
}
$stmt->close();

// Check if email already exists
$stmt = $conn->prepare("SELECT student_id FROM students WHERE email = ?");
$stmt->bind_param("s", $input['email']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $stmt->close();
    $conn->close();
    sendResponse(false, 'Email already exists', null, 409);
}
$stmt->close();

// Hash password
$hashedPassword = password_hash($input['password'], PASSWORD_BCRYPT);

// Insert new student
$stmt = $conn->prepare(
    "INSERT INTO students (registration_number, email, first_name, last_name, birth_date, gender, phone_number, year, course, password) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssssssiis",
    $input['registration_number'],
    $input['email'],
    $input['first_name'],
    $input['last_name'],
    $input['birth_date'],
    $input['gender'],
    $input['phone_number'],
    $input['year'],
    $input['course'],
    $hashedPassword
);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    sendResponse(true, 'Registration successful', ['registration_number' => $input['registration_number']], 201);
} else {
    $error = $stmt->error;
    $stmt->close();
    $conn->close();
    sendResponse(false, 'Registration failed: ' . $error, null, 500);
}
?>