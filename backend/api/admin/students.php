<?php
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../middleware/auth.php';

requireAdminAuth();

$conn = getDBConnection();

// Handle GET request - retrieve all students
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Check if requesting single student by ID
    if (isset($_GET['id'])) {
        $studentId = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT * FROM students WHERE student_id = ?");
        $stmt->bind_param("i", $studentId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $stmt->close();
            $conn->close();
            sendResponse(false, 'Student not found', null, 404);
        }

        $student = $result->fetch_assoc();
        unset($student['password']);

        if ($student['subjects']) {
            $student['subjects'] = json_decode($student['subjects']);
        }

        $stmt->close();
        $conn->close();
        sendResponse(true, 'Student retrieved successfully', $student, 200);
    }

    // Get all students
    $result = $conn->query("SELECT * FROM students ORDER BY created_at DESC");
    $students = [];

    while ($row = $result->fetch_assoc()) {
        unset($row['password']);
        if ($row['subjects']) {
            $row['subjects'] = json_decode($row['subjects']);
        }
        $students[] = $row;
    }

    $conn->close();
    sendResponse(true, 'Students retrieved successfully', $students, 200);
}

// Handle POST request - create new student
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);

    $required = [
        'registration_number',
        'email',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'password'
    ];

    $missing = validateRequired($input, $required);
    if (!empty($missing)) {
        $conn->close();
        sendResponse(false, 'Missing required fields: ' . implode(', ', $missing), null, 400);
    }

    // Hash password
    $hashedPassword = password_hash($input['password'], PASSWORD_BCRYPT);

    $stmt = $conn->prepare(
        "INSERT INTO students (registration_number, email, first_name, last_name, birth_date, gender, phone_number, year, course, password, marks, gpa, subjects) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $phoneNumber = $input['phone_number'] ?? null;
    $year = $input['year'] ?? null;
    $course = $input['course'] ?? null;
    $marks = $input['marks'] ?? 0.00;
    $gpa = $input['gpa'] ?? 0.00;
    $subjects = isset($input['subjects']) ? json_encode($input['subjects']) : null;

    $stmt->bind_param(
        "sssssssisddds",
        $input['registration_number'],
        $input['email'],
        $input['first_name'],
        $input['last_name'],
        $input['birth_date'],
        $input['gender'],
        $phoneNumber,
        $year,
        $course,
        $hashedPassword,
        $marks,
        $gpa,
        $subjects
    );

    if ($stmt->execute()) {
        $studentId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        sendResponse(true, 'Student created successfully', ['student_id' => $studentId], 201);
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Failed to create student: ' . $error, null, 500);
    }
}

// Handle PUT request - update student
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['student_id'])) {
        $conn->close();
        sendResponse(false, 'Student ID is required', null, 400);
    }

    $studentId = intval($input['student_id']);
    $updateFields = [];
    $params = [];
    $types = "";

    // Build dynamic update query
    $allowedFields = [
        'registration_number' => 's',
        'email' => 's',
        'first_name' => 's',
        'last_name' => 's',
        'birth_date' => 's',
        'gender' => 's',
        'phone_number' => 's',
        'year' => 'i',
        'course' => 's',
        'marks' => 'd',
        'gpa' => 'd',
        'profile_photo' => 's'
    ];

    foreach ($allowedFields as $field => $type) {
        if (isset($input[$field])) {
            $updateFields[] = "$field = ?";
            $params[] = $input[$field];
            $types .= $type;
        }
    }

    // Handle subjects separately (JSON encode)
    if (isset($input['subjects'])) {
        $updateFields[] = "subjects = ?";
        $params[] = json_encode($input['subjects']);
        $types .= 's';
    }

    // Handle password if provided
    if (isset($input['password']) && !empty($input['password'])) {
        $updateFields[] = "password = ?";
        $params[] = password_hash($input['password'], PASSWORD_BCRYPT);
        $types .= 's';
    }

    if (empty($updateFields)) {
        $conn->close();
        sendResponse(false, 'No fields to update', null, 400);
    }

    $params[] = $studentId;
    $types .= 'i';

    $sql = "UPDATE students SET " . implode(', ', $updateFields) . " WHERE student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(true, 'Student updated successfully', null, 200);
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Failed to update student: ' . $error, null, 500);
    }
}

// Handle DELETE request - delete student
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['student_id'])) {
        $conn->close();
        sendResponse(false, 'Student ID is required', null, 400);
    }

    $studentId = intval($input['student_id']);

    $stmt = $conn->prepare("DELETE FROM students WHERE student_id = ?");
    $stmt->bind_param("i", $studentId);

    if ($stmt->execute()) {
        $affected = $stmt->affected_rows;
        $stmt->close();
        $conn->close();

        if ($affected > 0) {
            sendResponse(true, 'Student deleted successfully', null, 200);
        } else {
            sendResponse(false, 'Student not found', null, 404);
        }
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Failed to delete student: ' . $error, null, 500);
    }
} else {
    $conn->close();
    sendResponse(false, 'Method not allowed', null, 405);
}
?>