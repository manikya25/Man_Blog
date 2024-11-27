import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../App";
import {  Form, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "./profile.scss";
import Defaultpic from "../../assets/user-profile.jpg";
import { useNavigate } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { current } from "@reduxjs/toolkit";
import Offcanvas from "react-bootstrap/Offcanvas";
import EditProfile from "../Editprofile/EditProfile";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from '@mui/material/Button';

function Profile() {
  const { userId } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});
  const [loading, isLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const Navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    // Fetch user details based on userId
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${userId}`
        );
        setUserData(response.data);
        setEditedUserData(response.data);
        isLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserBlogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/blogs?userId=${userId}`
        );
        setUserBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    if (userId) {
      fetchUserData();
      fetchUserBlogs();
    }
  }, [userId]);

  const handleCreatePost = () => {
    Navigate("/dashboard");
  };

  const handleEditPost = (blog) => {
    Navigate("/dashboard", { state: { blog } });
  };

  const handleDeletePost = async (blogId) => {
    try {
      await axios.delete(`http://localhost:5000/blogs/${blogId}`);
      setUserBlogs(userBlogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.error("Error deleting the blog:", error);
    }
  };

  const totalPages = Math.ceil(userBlogs.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedBlogs = userBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-details">
          <div className="profile-header">
            <img src={Defaultpic} alt="Profile" className="profile-pic" />
            <h2>{userData.name}</h2>
            <FontAwesomeIcon
              icon={faPencilAlt}
              // onClick={handleEditProfile}
              onClick={handleShow}
              className="edit-icon"
              style={{
                cursor: "pointer",
                marginLeft: "100px",
                fontSize: "1.8em",
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "grey",
              }}
              title="Edit Profile"
            />

            {/* Offcanvas Component */}
            <Offcanvas
              show={show}
              onHide={handleClose}
              placement="end"
              className="canvas"
              style={{ width: "400px" }}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>✍</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <EditProfile />
              </Offcanvas.Body>
            </Offcanvas>

            <p>
              <strong>Email :- </strong> {userData.email}
            </p>
            <p>
              <strong>Profession :- </strong> {userData.profession}
            </p>
          </div>
        </div>
       
        <div className="create-post">
      <Button  onClick={handleCreatePost} className='post'>Create a Post</Button>
     </div>
      </div>
      {/* <div className="user-blogs"> */}
   
    <div className="your-blogs">
    <h1>Your Blogs:</h1>
     </div>

             {/* <FontAwesomeIcon
          icon={faPlus}
          onClick={handleCreatePost}
          className="create-post-icon"
          title="Create Post"
        /> */}

      {paginatedBlogs.map((blog) => (
        <div key={blog.id} className="blog-card">
          <h4>{blog.title}</h4>
          {/* {blog.image && <img src={blog.image} alt={blog.title} className="blog-image" />} */}
          <div className="blog-right">
            <Button
              variant="outlined"
              color="#BAFF39"
              startIcon={<EditIcon />}
              sx={{
                backgroundColor: "white", // Grey background
                color: "grey",        // Text and icon color
                borderColor: "#BAFF39",     // Grey border
                transition: "transform 0.3s ease",
                marginRight: "10px",
                borderRadius: "8px",
                "&:hover":{
                  transform:"scale(1.1)",    // Change background color on hover
                  borderColor: "#89CFF0",
                  color: "white",
                  backgroundColor: "#007FFF"
                }
              }}
              onClick={() => handleEditPost(blog)}
            >
              Edit
            </Button>
            {/* <Button
              variant="outlined"
              // color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeletePost(blog.id)}
            >
              Delete
            </Button> */}
            <Button variant="outlined" startIcon={<DeleteIcon />} 
            sx={{
              backgroundColor: "white", // Grey background
              color: "grey",        // Text and icon color
              borderColor: "#BAFF39",     // Grey border
              borderRadius:"4px",
              borderRadius: "8px",
              transition: "transform 0.3s ease",
              "&:hover":{
                transform:"scale(1.1)",    // Change background color on hover
                borderColor: "#F40009",
                color: "white",
                backgroundColor: "#F40009"
              }
            }}
             onClick={() => handleDeletePost(blog.id)}>
  Delete
</Button>
            {/* <p>{blog.description}</p> */}
            {/* <Button>edit</Button> */}
          </div>
        </div>
      ))}

      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="page-button"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="page-button"
        >
          Next
        </button>
      </div>
    </div>
    // </div>
  );
}

export default Profile;
