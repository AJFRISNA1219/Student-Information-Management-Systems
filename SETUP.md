# SIMS - Quick Setup Guide

## Step 1: Database Setup

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL**

## Step 2: Import Database

1. **Open browser and go to**: `http://localhost/phpmyadmin`
2. **Import the database**:
   - Click "Import" tab at the top
   - Click "Choose File"
   - Navigate to and select: `database/schema.sql`
   - Click "Go" at the bottom
3. **Wait for success message**: "Import has been successfully finished"
4. **Verify**: You should see `sims_db` in the left sidebar with 3 tables

**Note**: The `schema.sql` file contains everything - all tables, default admin account, and sample student data with correct password hashes!

## Step 3: Start Backend

The backend is already configured! Just ensure Apache is running in XAMPP.

**Test Backend**: Open `http://localhost/SIMS%20Project/backend/api/student/login.php`
- You should see a JSON response (even if it's an error about POST method)

## Step 3: Start Frontend

1. **Open Terminal/PowerShell** in the frontend directory:
   ```
   cd "c:\xampp\htdocs\SIMS Project\frontend"
   ```

2. **Install Dependencies** (only needed once):
   ```
   npm install
   ```

3. **Start Development Server**:
   ```
   npm run dev
   ```

4. **Access Application**:
   - The application will automatically open at: `http://localhost:5173`
   - If not, manually open this URL in your browser

## Step 4: Login and Test

### Test as Student
1. Click "Student Portal" → "Login"
2. Use these credentials:
   - **Registration Number**: `STU2024001`
   - **Password**: `student123`
3. Explore the student dashboard

### Test as Admin
1. Click "Administrator Portal" → "Admin Login"
2. Use these credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Explore admin features:
   - View all students
   - Process change requests
   - Add/Edit/Delete students

## Troubleshooting

### Port Already in Use
If you see "Port 5173 is already in use":
- Close any other Vite/React apps running
- Or change the port in `vite.config.js`

### CORS Error
- Ensure Apache is running
- Clear browser cache
- Check that frontend is running on port 5173

### Database Connection Error
- Verify MySQL is running in XAMPP
- Check database name is `sims_db`
- Verify the database was imported successfully

### Can't Access Backend
- Ensure the project is in `C:\xampp\htdocs\SIMS Project`
- Restart Apache in XAMPP
- Check for any PHP errors in XAMPP logs

## Quick Commands Reference

```bash
# Navigate to frontend
cd "c:\xampp\htdocs\SIMS Project\frontend"

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Default Credentials Summary

**Admin Account**:
- Username: `admin`
- Password: `admin123`

**Sample Student Account**:
- Registration Number: `STU2024001`
- Password: `student123`

**Another Sample Student**:
- Registration Number: `STU2024002`
- Password: `student123`

## Next Steps

1. ✅ Complete database setup
2. ✅ Start Apache and MySQL
3. ✅ Start frontend dev server
4. ✅ Login and test features
5. 📝 Create your own student account via registration
6. 🎯 Test change request workflow
7. 🔒 Change admin password for security

Enjoy using SIMS! 🚀
