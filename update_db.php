<?php
require_once 'backend/config.php';

$conn = getDBConnection();
$newPassword = 'sims_admin_2026!';
$newHash = password_hash($newPassword, PASSWORD_BCRYPT);

$stmt = $conn->prepare("UPDATE administrators SET password = ? WHERE username = 'admin'");
$stmt->bind_param("s", $newHash);

if ($stmt->execute()) {
    echo "SUCCESS: Admin password updated to: " . $newPassword . "\n";
    echo "Hash: " . $newHash . "\n";
} else {
    echo "ERROR: Failed to update password: " . $conn->error . "\n";
}

$stmt->close();
$conn->close();
?>