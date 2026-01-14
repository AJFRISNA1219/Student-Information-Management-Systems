<?php
// Password Hash Generator for SIMS
// This script generates bcrypt hashes for passwords

echo "SIMS Password Hash Generator\n";
echo "============================\n\n";

// Admin password
$admin_password = 'admin123';
$admin_hash = password_hash($admin_password, PASSWORD_BCRYPT);

echo "Admin Password: admin123\n";
echo "Hash: $admin_hash\n\n";

// Student password
$student_password = 'student123';
$student_hash = password_hash($student_password, PASSWORD_BCRYPT);

echo "Student Password: student123\n";
echo "Hash: $student_hash\n\n";

// Verification
echo "Verification:\n";
echo "Admin password verified: " . (password_verify($admin_password, $admin_hash) ? 'YES' : 'NO') . "\n";
echo "Student password verified: " . (password_verify($student_password, $student_hash) ? 'YES' : 'NO') . "\n";
?>