import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.brand}>
                    <Link to="/" className={styles.logo}>
                        <Leaf className={styles.logoIcon} />
                        <span className={styles.logoText}>Pure<span className={styles.highlight}>Nation</span></span>
                    </Link>
                    <p className={styles.tagline}>
                        Building a cleaner, greener Sri Lanka together.
                    </p>
                </div>

                <div className={styles.links}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/projects">Find Projects</Link></li>
                        <li><Link to="/leaderboard">Leaderboard</Link></li>
                        <li><Link to="/sponsors">Sponsors</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                <div className={styles.contact}>
                    <h4>Contact</h4>
                    <p>Department of Software Engineering</p>
                    <p>Sabaragamuwa University of Sri Lanka</p>
                    <a href="mailto:contact@purenation.lk" className={styles.email}>
                        <Mail size={16} /> contact@purenation.lk
                    </a>
                </div>

                <div className={styles.social}>
                    <h4>Follow Us</h4>
                    <div className={styles.socialIcons}>
                        <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Pure Nation - Group 08. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
