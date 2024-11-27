import React, { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import "./header.scss";
import { FaSearch, FaUserCircle } from "react-icons/fa";

function Header({ onLogoutClick }) {
  const { isLoggedIn } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    setIsAuthenticated(authenticated);
  }, []);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <Navbar
        expand="lg"
        className={`background ${menuOpen ? "menu-open" : ""}`}
      >
        <Container className="justify-content-between">
          <Navbar.Brand as={Link} to="/" className="brand">
            Daily Dribble ⚽
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={handleToggleMenu}
            className="custom-toggle"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>{" "}
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              <NavDropdown title="Teams" className="custom-dropdown">
                <NavDropdown.Item
                  href="https://www.liverpoolfc.com/"
                  target="_blank"
                >
                  Liverpool
                </NavDropdown.Item>
                <NavDropdown.Item href="https://www.realmadrid.com/en-US">
                  Real Madrid
                </NavDropdown.Item>
                <NavDropdown.Item href="https://www.fcbarcelona.com/en/">
                  Barcelona
                </NavDropdown.Item>
                <NavDropdown.Item href="https://www.chelseafc.com/en">
                  Chelsea
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav className="ms-auto">
              <Link to="/SearchBar" className="search">
                <FaSearch size={30} />
              </Link>
              {!isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/SignUp">
                    Sign Up
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/profile" title="Profile">
                    <FaUserCircle size={24} />
                  </Nav.Link>
                  <Nav.Link onClick={onLogoutClick}>Logout</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
