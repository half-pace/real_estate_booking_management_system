import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="logo">
                        <span className="logo-icon">◆</span>
                        <span className="logo-text">Lux Estate</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className={isActive('/') ? 'active' : ''}>
                            Home
                        </Link>
                        <Link to="/properties" className={isActive('/properties') ? 'active' : ''}>
                            Properties
                        </Link>

                        {user ? (
                            <>
                                <Link to="/bookings" className={isActive('/bookings') ? 'active' : ''}>
                                    My Bookings
                                </Link>
                                {(user.role === 'agent' || user.role === 'admin') && (
                                    <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                                        Dashboard
                                    </Link>
                                )}
                                <div className="user-menu">
                                    <span className="user-name">{user.name}</span>
                                    <button className="btn btn-secondary btn-small" onClick={logout}>
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-link">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-small">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;