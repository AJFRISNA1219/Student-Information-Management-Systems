-- ============================================================================
-- Student Information Management System (SIMS) - Complete Database Setup
-- ============================================================================
-- 
-- This file contains EVERYTHING needed to set up the SIMS database:
--   1. Database creation with proper character encoding
--   2. All table schemas (administrators, students, change_requests)
--   3. Default admin account with correct password hash
--   4. Sample student accounts for testing
--   5. Sample change request for testing approval workflow
--
-- USAGE INSTRUCTIONS:
-- 1. Open phpMyAdmin: http://localhost/phpmyadmin
-- 2. Click "Import" tab
-- 3. Choose this file (schema.sql)
-- 4. Click "Go"
-- 5. Done! Database is ready to use.
--
-- DEFAULT CREDENTIALS:
--   Admin:   username = admin    | password = sims_admin_2026!
--   Student: reg_num = STU2024001 | password = student123
--   Student: reg_num = STU2024002 | password = student123
--
-- NOTE: This will DROP the existing sims_db database if it exists!
-- ============================================================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS sims_db;
CREATE DATABASE sims_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sims_db;

-- Table: administrators
CREATE TABLE administrators (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB;

-- Table: students
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    phone_number VARCHAR(20),
    year INT,
    course VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    profile_photo VARCHAR(255) DEFAULT NULL,
    marks DECIMAL(5,2) DEFAULT 0.00,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    subjects TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_registration (registration_number),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Table: change_requests
CREATE TABLE change_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL DEFAULT NULL,
    processed_by INT NULL DEFAULT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES administrators(admin_id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_student (student_id)
) ENGINE=InnoDB;

-- Insert default administrator account
-- Password: sims_admin_2026!
-- Hash generated using: password_hash('sims_admin_2026!', PASSWORD_BCRYPT)
INSERT INTO administrators (username, password, full_name) VALUES 
('admin', '$2y$10$0YHPkgEj1bHoBwzdNS4DUOO2Qe1Ydv9E8/XhNEB0r6A6w5Ce/P4KK', 'System Administrator');

-- Insert sample student data for testing
-- Password for all students: student123
-- Hash generated using: password_hash('student123', PASSWORD_BCRYPT)
INSERT INTO students (
    registration_number, email, first_name, last_name, birth_date, 
    gender, phone_number, year, course, password, marks, gpa, subjects
) VALUES 
(
    'STU2024001', 
    'john.doe@example.com', 
    'John', 
    'Doe', 
    '2002-05-15', 
    'Male', 
    '+1234567890', 
    2, 
    'Computer Science', 
    '$2y$10$VvZvJGYcAZCgCIa.1cqy7OdGe7HtpYiSuZ5mFPGPOuXG8lxqQJ8ha',
    85.50, 
    3.42, 
    '["Mathematics", "Programming", "Database Systems", "Web Development"]'
),
(
    'STU2024002', 
    'jane.smith@example.com', 
    'Jane', 
    'Smith', 
    '2003-08-22', 
    'Female', 
    '+1234567891', 
    1, 
    'Business Administration', 
    '$2y$10$VvZvJGYcAZCgCIa.1cqy7OdGe7HtpYiSuZ5mFPGPOuXG8lxqQJ8ha',
    90.25, 
    3.61, 
    '["Accounting", "Marketing", "Management", "Economics"]'
);

-- Insert sample change request for testing
INSERT INTO change_requests (student_id, field_name, old_value, new_value, message, status) VALUES 
(1, 'phone_number', '+1234567890', '+1987654321', 'I need to update my contact number as I have changed my phone.', 'pending');
