import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function AdminStudents() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/admin/students.php');
            if (response.success) {
                setStudents(response.data);
            }
        } catch (err) {
            setMessage('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout.php');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            sessionStorage.clear();
            navigate('/');
        }
    };

    const handleEdit = (student) => {
        setSelectedStudent({ ...student });
        setShowEditModal(true);
    };

    const handleDelete = async (studentId) => {
        if (!confirm('Are you sure you want to delete this student?')) {
            return;
        }

        try {
            const response = await api.delete('/admin/students.php', {
                data: { student_id: studentId }
            });
            if (response.success) {
                setMessage('Student deleted successfully');
                fetchStudents();
            }
        } catch (err) {
            setMessage(err.message || 'Failed to delete student');
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put('/admin/students.php', selectedStudent);
            if (response.success) {
                setMessage('Student updated successfully');
                setShowEditModal(false);
                fetchStudents();
            }
        } catch (err) {
            setMessage(err.message || 'Failed to update student');
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/admin/students.php', selectedStudent);
            if (response.success) {
                setMessage('Student added successfully');
                setShowAddModal(false);
                setSelectedStudent(null);
                fetchStudents();
            }
        } catch (err) {
            setMessage(err.message || 'Failed to add student');
        }
    };

    const openAddModal = () => {
        setSelectedStudent({
            registration_number: '',
            email: '',
            first_name: '',
            last_name: '',
            birth_date: '',
            gender: '',
            phone_number: '',
            year: '',
            course: '',
            password: '',
            marks: 0,
            gpa: 0
        });
        setShowAddModal(true);
    };

    const filteredStudents = students.filter(student =>
        student.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-header">
                <div className="container">
                    <div className="nav">
                        <div className="nav-brand">SIMS - Student Management</div>
                        <div className="nav-links">
                            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/admin/change-requests" className="nav-link">Change Requests</Link>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="container">
                    {message && <div className="alert alert-info">{message}</div>}

                    <div className="card">
                        <div className="card-header">
                            <div className="flex-between">
                                <h2 className="card-title">All Students</h2>
                                <button onClick={openAddModal} className="btn btn-primary">
                                    Add New Student
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search by registration number, name, email, or course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {loading ? (
                            <div className="spinner"></div>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Reg. No.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Course</th>
                                            <th>Year</th>
                                            <th>GPA</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">
                                                    No students found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStudents.map(student => (
                                                <tr key={student.student_id}>
                                                    <td>{student.registration_number}</td>
                                                    <td>{student.first_name} {student.last_name}</td>
                                                    <td>{student.email}</td>
                                                    <td>{student.course}</td>
                                                    <td>{student.year}</td>
                                                    <td>{student.gpa}</td>
                                                    <td>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleEdit(student)}
                                                                className="btn btn-secondary btn-sm"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(student.student_id)}
                                                                className="btn btn-danger btn-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Student Modal */}
            {showEditModal && selectedStudent && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 className="card-title">Edit Student</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateStudent}>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Registration Number</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedStudent.registration_number}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, registration_number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={selectedStudent.email}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedStudent.first_name}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, first_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedStudent.last_name}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, last_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={selectedStudent.phone_number || ''}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, phone_number: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Course</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedStudent.course || ''}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, course: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Year</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={selectedStudent.year || ''}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, year: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select
                                        className="form-select"
                                        value={selectedStudent.gender}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, gender: e.target.value })}
                                        required
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Marks</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={selectedStudent.marks || 0}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, marks: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={selectedStudent.gpa || 0}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, gpa: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-1 mt-2">
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Update Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {showAddModal && selectedStudent && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 className="card-title">Add New Student</h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleAddStudent}>
                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Registration Number</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedStudent.registration_number}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, registration_number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={selectedStudent.email}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedStudent.first_name}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, first_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedStudent.last_name}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, last_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Birth Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={selectedStudent.birth_date}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, birth_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select
                                        className="form-select"
                                        value={selectedStudent.gender}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, gender: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={selectedStudent.phone_number}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, phone_number: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Course</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={selectedStudent.course}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, course: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Year</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={selectedStudent.year}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, year: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={selectedStudent.password}
                                        onChange={(e) => setSelectedStudent({ ...selectedStudent, password: e.target.value })}
                                        required
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-1 mt-2">
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Add Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminStudents;
