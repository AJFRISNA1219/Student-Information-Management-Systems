<?php
require_once '../cors.php';
require_once '../config.php';
require_once '../middleware/auth.php';

// Only accept POST requests for file upload
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

// Require authentication (student or admin)
requireAuth();

// Check if file was uploaded
if (!isset($_FILES['file'])) {
    sendResponse(false, 'No file uploaded', null, 400);
}

$file = $_FILES['file'];

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    sendResponse(false, 'File upload error: ' . $file['error'], null, 400);
}

// Validate file type (images only)
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
$fileType = mime_content_type($file['tmp_name']);

if (!in_array($fileType, $allowedTypes)) {
    sendResponse(false, 'Invalid file type. Only JPG, PNG, and GIF are allowed', null, 400);
}

// Validate file size (max 5MB)
$maxSize = 5 * 1024 * 1024; // 5MB in bytes
if ($file['size'] > $maxSize) {
    sendResponse(false, 'File size exceeds 5MB limit', null, 400);
}

// Create uploads directory if it doesn't exist
$uploadDir = __DIR__ . '/../uploads/profiles/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('profile_' . time() . '_') . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    // Return relative path for database storage
    $relativePath = 'uploads/profiles/' . $filename;
    sendResponse(true, 'File uploaded successfully', ['path' => $relativePath], 200);
} else {
    sendResponse(false, 'Failed to save file', null, 500);
}
?>