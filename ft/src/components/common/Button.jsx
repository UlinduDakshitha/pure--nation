import React from "react";
import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  ...props
}) => {
  const buttonStyle = {
    ...(fullWidth && { width: "100%" }),
    ...props.style,
  };

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      style={buttonStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
