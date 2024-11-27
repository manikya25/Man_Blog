import React, { useContext, useState } from "react";
import axios from "axios";
import "./SignUp.scss";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../App";

function SignUp() {
  const [currentFormPage, setCurrentFormPage] = useState(1);
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  // Define Yup validation schemas for each form page
  const validationSchemaPage1 = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    profession: yup.string().required("Profession is required"),
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
  });

  const validationSchemaPage2 = yup.object({
    website: yup.string().url("Enter a valid URL"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Confirm your password"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      profession: "",
      phone: "",
      website: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema:
      currentFormPage === 1 ? validationSchemaPage1 : validationSchemaPage2,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/users",
          values
        );
        if (response.status === 201) {
          const newUserId = response.data.id;
          handleLogin(newUserId);
          alert("Signup Successful!");
          navigate("/");
        } else {
          alert("Failed to sign up, please try again.");
        }
      } catch (error) {
        console.log("Error signing up:", error);
        alert("An error occurred during signup.");
      }
    },
  });

  const handleNext = () => {
    if (currentFormPage === 1) {
      if (
        formik.validateForm().then((errors) => Object.keys(errors).length === 0)
      ) {
        setCurrentFormPage(2);
      }
    }
  };

  const handleBack = () => setCurrentFormPage(1);

  return (
    <div className="signup-background">
      <div className="signup-page">
        <h2>
          <strong>Welcome!</strong>
        </h2>
        <p className="create">Create your account:</p>

        {currentFormPage === 1 ? (
          <form onSubmit={formik.handleSubmit} className="signup-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="Enter your name"
                className="signup-input"
              />
              {formik.touched.name && formik.errors.name ? (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {formik.errors.name}
                </p>
              ) : null}

              <label>Email</label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email ? (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {formik.errors.email}
                </p>
              ) : null}

              <label>Profession</label>
              <input
                type="text"
                name="profession"
                onChange={formik.handleChange}
                value={formik.values.profession}
                placeholder="Enter your profession"
              />
              {formik.touched.profession && formik.errors.profession ? (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {formik.errors.profession}
                </p>
              ) : null}

              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                placeholder="Enter your phone number"
                maxLength={10}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {formik.errors.phone}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="signup-btn"
              disabled={!formik.isValid || !formik.dirty}
            >
              Next
            </button>
          </form>
        ) : (
          <form onSubmit={formik.handleSubmit} className="signup-form">
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.website}
                placeholder="Enter your website"
              />
              {formik.touched.website && formik.errors.website ? (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {formik.errors.website}
                </p>
              ) : null}

              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="Enter your password"
              />
              {formik.touched.password &&
              formik.errors.password &&
              formik.dirty ? (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {formik.errors.password}
                </p>
              ) : null}

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                placeholder="Confirm your password"
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword &&
              formik.dirty ? (
                <p style={{ color: "red", fontSize: "0.9rem" }}>
                  {formik.errors.confirmPassword}
                </p>
              ) : null}
            </div>
            <div className="button-c">
            <button
              type="submit"
              className="signup-btn"
              disabled={!formik.isValid || !formik.dirty}
            >
              Sign Up
            </button>
            <button type="button" className="signup-btn" onClick={handleBack}>
              Back
            </button>
            </div>
          
          </form>
        )}
      </div>
    </div>
  );
}

export default SignUp;
