import React, { useState, useEffect } from 'react';
import { getAvailableCourses, joinCourse } from '../api';
import { toast } from 'react-toastify';

const AvailableCourses = ({ user }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await getAvailableCourses();
            setCourses(data);
            setError(null);
        } catch (err) {
            setError('Failed to load courses');
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinCourse = async (courseId) => {
        try {
            await joinCourse(courseId, user.token);
            toast.success('Successfully joined the course!');
            // Refresh the courses list
            loadCourses();
        } catch (err) {
            toast.error('Failed to join course');
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Available Courses</h2>
            <div className="row">
                {courses.map(course => (
                    <div key={course.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            {course.mediaUrl && (
                                <img 
                                    src={course.mediaUrl} 
                                    className="card-img-top" 
                                    alt={course.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{course.title}</h5>
                                <p className="card-text">{course.description}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleJoinCourse(course.id)}
                                >
                                    Join Course
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableCourses; 