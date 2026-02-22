import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={styles.toggleBtn}
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;
