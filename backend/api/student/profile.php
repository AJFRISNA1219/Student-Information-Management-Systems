<?php
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../middleware/auth.php';

// Handle GET request - retrieve student profile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    requireStudentAuth();

    $studentId = getAuthenticatedUserId();
    $conn = getDBConnection();

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

    // Parse subjects JSON if exists
    if ($student['subjects']) {
        $student['subjects'] = json_decode($student['subjects']);
    }

    $stmt->close();
    $conn->close();
    sendResponse(true, 'Profile retrieved successfully', $student, 200);
}

// Handle PUT request - update profile photo only
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    requireStudentAuth();

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['profile_photo'])) {
        sendResponse(false, 'Profile photo path is required', null, 400);
    }

    $studentId = getAuthenticatedUserId();
    $conn = getDBConnection();

    $stmt = $conn->prepare("UPDATE students SET profile_photo = ? WHERE student_id = ?");
    $stmt->bind_param("si", $input['profile_photo'], $studentId);

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(true, 'Profile photo updated successfully', null, 200);
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Update failed: ' . $error, null, 500);
    }
} else {
    sendResponse(false, 'Method not allowed', null, 405);
}
?>