<?php
require_once '../cors.php';

// Destroy session and logout
session_start();
session_destroy();

sendResponse(true, 'Logged out successfully', null, 200);
?>