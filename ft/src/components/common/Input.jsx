import React from 'react';
import styles from './Input.module.css';

const Input = ({
    label,
    type = 'text',
    id,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.inputGroup} ${className}`}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <input
                type={type}
                id={id}
                className={`${styles.input} ${error ? styles.errorInput : ''}`}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default Input;
