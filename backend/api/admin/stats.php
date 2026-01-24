<?php
require_once '../../cors.php';
require_once '../../config.php';
require_once '../../middleware/auth.php';

requireAdminAuth();

$conn = getDBConnection();

// Get total students
$studentResult = $conn->query("SELECT COUNT(*) as total FROM students");
$studentData = $studentResult->fetch_assoc();
$totalStudents = $studentData['total'];

// Get pending change requests
$requestResult = $conn->query("SELECT COUNT(*) as total FROM change_requests WHERE status = 'pending'");
$requestData = $requestResult->fetch_assoc();
$pendingRequests = $requestData['total'];

// Get total courses (unique courses in students table)
$courseResult = $conn->query("SELECT COUNT(DISTINCT course) as total FROM students WHERE course IS NOT NULL AND course != ''");
$courseData = $courseResult->fetch_assoc();
$totalCourses = $courseData['total'];

// Get recent registrations (last 5)
$recentResult = $conn->query("SELECT first_name, last_name, registration_number, created_at FROM students ORDER BY created_at DESC LIMIT 5");
$recentStudents = [];
while ($row = $recentResult->fetch_assoc()) {
    $recentStudents[] = $row;
}

$conn->close();

sendResponse(true, 'Dashboard stats retrieved', [
    'totalStudents' => (int) $totalStudents,
    'pendingRequests' => (int) $pendingRequests,
    'totalCourses' => (int) $totalCourses,
    'recentStudents' => $recentStudents,
    'systemStatus' => 'Optimal',
    'uptime' => '99.9%'
], 200);
?>