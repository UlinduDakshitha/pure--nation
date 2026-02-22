import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import Button from '../common/Button';
import styles from './Navbar.module.css';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Sponsors', path: '/sponsors' },
        { name: 'Profile', path: '/profile' },
    ];

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link to="/" className={styles.logo}>
                    <Leaf className={styles.logoIcon} />
                    <span className={styles.logoText}>Pure<span className={styles.highlight}>Nation</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                <div className={styles.navActions}>
                    <div className={styles.desktopActions}>
                        <ThemeToggle />
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm">Get Started</Button>
                        </Link>
                    </div>

                    <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className={styles.mobileMenu}>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    <div className={styles.mobileActions}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <ThemeToggle />
                        </div>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" fullWidth>Log In</Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                            <Button variant="primary" fullWidth>Get Started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
