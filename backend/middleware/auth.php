<?php
// Authentication middleware

function requireAuth($role = null)
{
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
        sendResponse(false, 'Authentication required', null, 401);
    }

    if ($role && $_SESSION['role'] !== $role) {
        sendResponse(false, 'Unauthorized access', null, 403);
    }

    return true;
}

function requireStudentAuth()
{
    return requireAuth('student');
}

function requireAdminAuth()
{
    return requireAuth('admin');
}

function getAuthenticatedUserId()
{
    if (!isset($_SESSION['user_id'])) {
        return null;
    }
    return $_SESSION['user_id'];
}

function getAuthenticatedRole()
{
    if (!isset($_SESSION['role'])) {
        return null;
    }
    return $_SESSION['role'];
}
?>