import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import styles from "./Auth.module.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
        console.log("Login successful:", response);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({
        form:
          err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className="text-center">
          <h1>Welcome Back</h1>
          <p className="text-secondary">Sign in to continue your journey</p>
        </div>

        {errors.form && (
          <div
            className="text-center"
            style={{
              color: "var(--error)",
              marginBottom: "1rem",
              padding: "0.5rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderRadius: "var(--radius-md)",
            }}
          >
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div className="text-right" style={{ marginBottom: "1rem" }}>
            <Link to="/forgot-password" className={styles.link}>
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
