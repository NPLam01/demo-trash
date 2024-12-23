import React, { useState, useEffect, useRef } from 'react';
import './login.css';
import { authService } from '../../services/authService';

const Login = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [userEmail, setUserEmail] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUserEmail(user.email);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (activeTab === 'login') {
                const response = await authService.login(formData.email, formData.password);
                if (response.status === 'ERR') {
                    setError(response.message);
                    return;
                }
                setUserEmail(formData.email);
                onClose();
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Mật khẩu không khớp!');
                    return;
                }
                if (!formData.name || !formData.phone) {
                    setError('Vui lòng điền đầy đủ thông tin!');
                    return;
                }
                const response = await authService.register(
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.phone
                );
                if (response.status === 'ERR') {
                    setError(response.message);
                    return;
                }
                setActiveTab('login');
                setError('Đăng ký thành công! Vui lòng đăng nhập.');
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi!');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setUserEmail(null);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="login-overlay">
            <div className="login-container">
                <div className={`login-header ${showDropdown ? 'expanded' : ''}`}>
                    <div className="login-tabs">
                        {userEmail ? (
                            <div className="user-info" ref={dropdownRef}>
                                <div className="user-avatar" onClick={toggleDropdown}>
                                    {userEmail.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-email" onClick={toggleDropdown}>{userEmail}</span>
                                {showDropdown && (
                                    <div className="user-dropdown">
                                        <button className="info-btn">Thông tin</button>
                                        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('login')}
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('register')}
                                >
                                    Đăng ký
                                </button>
                            </>
                        )}
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {!userEmail && (
                    <>
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                {activeTab === 'register' && (
                                    <>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Họ và tên"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Số điện thoại"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </>
                                )}
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Mật khẩu"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {activeTab === 'register' && (
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Xác nhận mật khẩu"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
