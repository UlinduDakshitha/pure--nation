import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authStyles from "./Auth.module.css";
import registerStyles from "./Register.module.css";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    district: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.city) newErrors.city = "City is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        district: formData.district,
        city: formData.city,
      });

      console.log("Registration successful:", response);
      alert("Registration successful!");
      navigate("/profile");
    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({
        form: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={authStyles.authContainer}>
      <div className={authStyles.authCard}>
        <div className="text-center">
          <h1>Create Account</h1>
          <p className="text-secondary">Join the Pure Nation community</p>
        </div>

        {errors.form && (
          <div className={registerStyles.errorMessage}>{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} className={authStyles.authForm}>
          <div className={registerStyles.formGroup}>
            <Input
              label="First Name"
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
          </div>

          <div
            className={
              registerStyles.formGroup + " " + registerStyles.fullWidth
            }
          >
            <Input
              label="Email Address"
              type="email"
              id="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <div className={registerStyles.formGroup}>
            <Input
              label="District"
              id="district"
              placeholder="Your District"
              value={formData.district}
              onChange={handleChange}
              error={errors.district}
            />
            <Input
              label="City"
              id="city"
              placeholder="Your City"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />
          </div>

          <div
            className={
              registerStyles.formGroup + " " + registerStyles.fullWidth
            }
          >
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <div
            className={
              registerStyles.formGroup + " " + registerStyles.fullWidth
            }
          >
            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <div className={authStyles.authFooter}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={authStyles.link}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
