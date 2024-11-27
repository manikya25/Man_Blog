import React, { useState, useContext } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserId } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        setIsLoggedIn(true);
        localStorage.setItem("authenticated", true);
        setUserId(user.id);
        navigate("/"); // Redirect to home page after login
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="back">
    <div className="login-back">
      <div>
        <Container className="login-page">
          <h2>
            <strong>Hello! Let's get you logged in !</strong>
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="pass">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className="pass">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <button type="submit" className="login-button">
              Login !
            </button>
          </Form>
        </Container>
      </div>
    </div>
    </div>

  );
};

export default LoginPage;
