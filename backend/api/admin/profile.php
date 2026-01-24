<?php
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../middleware/auth.php';

// Only accept GET and PUT requests
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET' && $method !== 'PUT') {
    sendResponse(false, 'Method not allowed', null, 405);
}

// Require admin authentication
requireAdminAuth();
$adminId = getAuthenticatedUserId();

// Get database connection
$conn = getDBConnection();

if ($method === 'GET') {
    // Get current admin info
    $stmt = $conn->prepare("SELECT admin_id, username, full_name, created_at FROM administrators WHERE admin_id = ?");
    $stmt->bind_param("i", $adminId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Admin not found', null, 404);
    }

    $admin = $result->fetch_assoc();
    $stmt->close();
    $conn->close();

    sendResponse(true, 'Admin info retrieved', $admin);
} elseif ($method === 'PUT') {
    // Update admin info
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    $required = ['full_name'];
    $missing = validateRequired($input, $required);

    if (!empty($missing)) {
        $conn->close();
        sendResponse(false, 'Missing required fields: ' . implode(', ', $missing), null, 400);
    }

    // Check if password change is requested
    if (!empty($input['new_password'])) {
        if (empty($input['current_password'])) {
            $conn->close();
            sendResponse(false, 'Current password is required to change password', null, 400);
        }

        // Verify current password
        $stmt = $conn->prepare("SELECT password FROM administrators WHERE admin_id = ?");
        $stmt->bind_param("i", $adminId);
        $stmt->execute();
        $result = $stmt->get_result();
        $admin = $result->fetch_assoc();

        if (!password_verify($input['current_password'], $admin['password'])) {
            $stmt->close();
            $conn->close();
            sendResponse(false, 'Incorrect current password', null, 401);
        }
        $stmt->close();

        // Hash new password
        $newPasswordHash = password_hash($input['new_password'], PASSWORD_BCRYPT);

        // Update both name and password
        $stmt = $conn->prepare("UPDATE administrators SET full_name = ?, password = ? WHERE admin_id = ?");
        $stmt->bind_param("ssi", $input['full_name'], $newPasswordHash, $adminId);
    } else {
        // Update only name
        $stmt = $conn->prepare("UPDATE administrators SET full_name = ? WHERE admin_id = ?");
        $stmt->bind_param("si", $input['full_name'], $adminId);
    }

    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        sendResponse(true, 'Profile updated successfully');
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Failed to update profile: ' . $error, null, 500);
    }
}
?>