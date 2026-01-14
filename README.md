# Student Information Management System (SIMS)

A comprehensive web-based Student Information Management System built with React.js, PHP, and MySQL. This system provides a centralized, secure, and efficient digital solution for managing student records with role-based access control for students and administrators.

## Features

### Student Features
- **Registration & Login**: Secure account creation and authentication using registration number
- **Profile Management**: View personal information, academic records (marks, GPA, subjects)
- **Profile Photo Upload**: Upload and update profile pictures
- **Change Requests**: Submit modification requests to administrators with explanations

### Administrator Features
- **Dashboard**: Overview of total students and pending change requests
- **Student Management**: Full CRUD operations (Create, Read, Update, Delete) on student records
- **Change Request Processing**: Review and approve/reject student modification requests
- **Secure Authentication**: Protected admin portal with session management

## Technology Stack

- **Frontend**: React.js with Vite
- **Backend**: PHP RESTful API
- **Database**: MySQL
- **Styling**: Custom CSS with modern dark theme design
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Prerequisites

- XAMPP (or similar LAMP/WAMP stack)
- Node.js and npm
- Modern web browser

## Installation & Setup

### 1. Database Setup

1. Start Apache and MySQL in XAMPP Control Panel
2. Open phpMyAdmin at `http://localhost/phpmyadmin`
3. Import the database schema:
   ```
   Run the SQL file: database/schema.sql
   ```
   This will create the `sims_db` database with all necessary tables and sample data.

### 2. Backend Setup

The backend is already configured and located in the `backend` folder. Ensure XAMPP's Apache server is running.

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**Sample Student Credentials:**
- Registration Number: `STU2024001`
- Password: `student123`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd "c:\xampp\htdocs\SIMS Project\frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The application will open automatically at `http://localhost:5173`

## Project Structure

```
SIMS Project/
├── database/
│   └── schema.sql              # Database schema and sample data
├── backend/
│   ├── config.php              # Database configuration
│   ├── cors.php                # CORS headers
│   ├── middleware/
│   │   └── auth.php            # Authentication middleware
│   └── api/
│       ├── student/
│       │   ├── register.php    # Student registration
│       │   ├── login.php       # Student authentication
│       │   ├── profile.php     # Profile management
│       │   └── change-request.php # Change requests
│       ├── admin/
│       │   ├── login.php       # Admin authentication
│       │   ├── students.php    # Student CRUD operations
│       │   └── change-requests.php # Request processing
│       ├── upload.php          # File upload handler
│       └── logout.php          # Session logout
└── frontend/
    ├── src/
    │   ├── components/         # React components
    │   ├── utils/              # Utility functions
    │   ├── App.jsx             # Main app component
    │   ├── main.jsx            # Entry point
    │   └── index.css           # Global styles
    ├── index.html              # HTML template
    ├── package.json            # Dependencies
    └── vite.config.js          # Vite configuration
```

## Usage Guide

### For Students

1. **Register**: Navigate to Student Portal → Register and fill in all required information
2. **Login**: Use your registration number and password to access your dashboard
3. **View Profile**: See all your personal and academic information
4. **Update Photo**: Click "Change Photo" to upload a profile picture
5. **Request Changes**: Click "Request Change" to submit modification requests to admin
6. **Logout**: Use the logout button to end your session

### For Administrators

1. **Login**: Navigate to Administrator Portal and login with admin credentials
2. **Dashboard**: View statistics and navigate to management sections
3. **Manage Students**: 
   - View all students in a searchable table
   - Add new students
   - Edit existing student records
   - Delete student accounts
4. **Process Requests**:
   - Review pending change requests from students
   - Approve requests to update student records
   - Reject requests if necessary
5. **Logout**: Use the logout button to end your session

## API Endpoints

### Student Endpoints
- `POST /api/student/register.php` - Register new student
- `POST /api/student/login.php` - Student authentication
- `GET /api/student/profile.php` - Get student profile
- `PUT /api/student/profile.php` - Update profile photo
- `POST /api/student/change-request.php` - Submit change request

### Admin Endpoints
- `POST /api/admin/login.php` - Admin authentication
- `GET /api/admin/students.php` - Get all students
- `POST /api/admin/students.php` - Create student
- `PUT /api/admin/students.php` - Update student
- `DELETE /api/admin/students.php` - Delete student
- `GET /api/admin/change-requests.php` - Get change requests
- `PUT /api/admin/change-requests.php` - Process change request

### General Endpoints
- `POST /api/upload.php` - Upload profile photo
- `POST /api/logout.php` - Logout user

## Security Features

- Password hashing using bcrypt
- Session-based authentication
- Role-based access control (RBAC)
- SQL injection prevention with prepared statements
- CORS configuration for secure API access
- Protected routes requiring authentication
- File upload validation (type and size)

## Design Features

- Modern dark theme with gradient accents
- Responsive layout for all devices
- Smooth animations and transitions
- Card-based UI components
- Modal dialogs for forms
- Professional color palette
- Google Fonts (Inter) for typography
- Glassmorphism effects

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running in XAMPP
- Verify database credentials in `backend/config.php`
- Check if `sims_db` database exists

### CORS Error
- Ensure the frontend URL matches the CORS configuration in `backend/cors.php`
- Clear browser cache and cookies

### Login Not Working
- Verify session support is enabled in PHP
- Check browser console for errors
- Ensure cookies are enabled

### File Upload Error
- Check permissions on `backend/uploads/profiles/` directory
- Verify file size is under 5MB
- Ensure file type is JPG, PNG, or GIF

## Future Enhancements

- Email notifications for change request status
- Student attendance tracking
- Grade report generation
- Export data to PDF/Excel
- Password reset functionality
- Multi-factor authentication
- Advanced search and filters
- Bulk student import/export

## License

This project is developed for educational purposes.

## Support

For issues and questions, please refer to the documentation or contact the system administrator.
