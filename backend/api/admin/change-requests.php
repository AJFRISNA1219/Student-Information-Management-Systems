<?php
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../middleware/auth.php';

requireAdminAuth();

$conn = getDBConnection();

// Handle GET request - retrieve all change requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $status = isset($_GET['status']) ? $_GET['status'] : 'pending';

    $sql = "SELECT cr.*, 
            s.registration_number, s.first_name, s.last_name, s.email,
            a.username as processed_by_username
            FROM change_requests cr
            JOIN students s ON cr.student_id = s.student_id
            LEFT JOIN administrators a ON cr.processed_by = a.admin_id
            WHERE cr.status = ?
            ORDER BY cr.requested_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();

    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }

    $stmt->close();
    $conn->close();
    sendResponse(true, 'Change requests retrieved successfully', $requests, 200);
}

// Handle PUT request - approve or reject change request
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $input = json_decode(file_get_contents('php://input'), true);

    $required = ['request_id', 'status'];
    $missing = validateRequired($input, $required);

    if (!empty($missing)) {
        $conn->close();
        sendResponse(false, 'Missing required fields: ' . implode(', ', $missing), null, 400);
    }

    if (!in_array($input['status'], ['approved', 'rejected'])) {
        $conn->close();
        sendResponse(false, 'Invalid status. Must be "approved" or "rejected"', null, 400);
    }

    $requestId = intval($input['request_id']);
    $adminId = getAuthenticatedUserId();

    // Get request details
    $stmt = $conn->prepare("SELECT * FROM change_requests WHERE request_id = ?");
    $stmt->bind_param("i", $requestId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Change request not found', null, 404);
    }

    $request = $result->fetch_assoc();
    $stmt->close();

    // If approved, update student record
    if ($input['status'] === 'approved') {
        $fieldName = $request['field_name'];
        $newValue = $request['new_value'];
        $studentId = $request['student_id'];

        $stmt = $conn->prepare("UPDATE students SET $fieldName = ? WHERE student_id = ?");
        $stmt->bind_param("si", $newValue, $studentId);

        if (!$stmt->execute()) {
            $error = $stmt->error;
            $stmt->close();
            $conn->close();
            sendResponse(false, 'Failed to update student record: ' . $error, null, 500);
        }
        $stmt->close();
    }

    // Update change request status
    $stmt = $conn->prepare(
        "UPDATE change_requests 
         SET status = ?, processed_by = ?, processed_at = NOW() 
         WHERE request_id = ?"
    );

    $stmt->bind_param("sii", $input['status'], $adminId, $requestId);

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(true, 'Change request ' . $input['status'] . ' successfully', null, 200);
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Failed to process request: ' . $error, null, 500);
    }
} else {
    $conn->close();
    sendResponse(false, 'Method not allowed', null, 405);
}
?>