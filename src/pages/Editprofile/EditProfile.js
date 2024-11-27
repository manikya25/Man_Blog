import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./EditProfile.scss";

function EditProfile() {
  const { userId } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Fetch current user data if needed or use it directly
  // Use an effect to load initial data, if not passed directly

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${userId}`
        );
        const user = response.data;

        setName(user.name);
        setEmail(user.email);
        setProfession(user.profession || "");
        setPassword(user.password || "");
        setConfirmPassword(user.confirmPassword || "");
      } catch (error) {
        console.error("error fetching details", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("passowrds do not match");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/users/${userId}`, {
        name,
        email,
        profession,
        password,
        confirmPassword,
      });
      navigate("/profile"); // Navigate back to the profile page after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="edit-profile">
      <h2>
        <strong>Edit Profile</strong>
      </h2>
      <Form onSubmit={handleSave}>
        <Form.Group controlId="formName">
          <Form.Label className="name">Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="inp"
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label className="name">Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="inp"
          />
        </Form.Group>

        <Form.Group controlId="formProfession">
          <Form.Label className="name">Profession</Form.Label>
          <Form.Control
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="inp"
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label className="name">Password</Form.Label>
          <Form.Control
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="inp"
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label className="name">Confirm Password</Form.Label>
          <Form.Control
            type="text"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="inp"
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="save-btn"
          style={{ padding: "15px" }}
        >
          Save Changes
        </Button>
      </Form>
    </div>
  );
}

export default EditProfile;
