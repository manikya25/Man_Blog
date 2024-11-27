import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../App";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./DashBoard.scss";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal"; // Import Modal
import ReactHtmlParser from "react-html-parser";

function SuccessModal({ show, onHide, title, body }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{body}</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} color="white">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export const Dashboard = () => {
  const location = useLocation();
  const { userId, blogs, setBlogs } = useContext(AuthContext);
  const [title, setTitle] = useState(location.state?.title || "");
  const [description, setDescription] = useState(
    location.state?.description || ""
  );
  const [content, setContent] = useState(location.state?.content || "");
  const [image, setImage] = useState(location.state?.image || null);
  const [isEditing, setIsEditing] = useState(!!location.state); // Track editing mode
  const [editBlogId, setEditBlogId] = useState(null);

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: "",
    bodu: "",
  });
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.blog) {
      const { title, description, content, image, id } = location.state.blog;
      setTitle(title);
      setDescription(description);
      setContent(content);
      setImage(image);
      setIsEditing(true); // Set editing mode to true
      setEditBlogId(id);
    }
  }, [location.state]);

  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    // ["clean"]
  ];

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blogs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBlogs(data); // Set the fetched blogs to the context state
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, [setBlogs]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result); // This will set the Base64 string
    };

    if (file) {
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const blogData = {
      title,
      content,
      description,
      image,
      userId,
      createdAt: isEditing ? undefined : new Date().toISOString(),
    };

    //send the new bog to json server

    try {
      if (isEditing) {
        const response = await fetch(
          `http://localhost:5000/blogs/${editBlogId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(blogData),
          }
        );
        if (!response.ok) throw new Error("Failed to update blog");

        const updatedBlog = await response.json();
        console.log(updatedBlog);
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog.id === editBlogId ? updatedBlog : blog))
        );

        setModalMessage({
          title: "Blog Updated Successfully!",
          body: "Yay! You have successfully updated your blog.",
        });

        console.log("Modal should show:", modalShow);
        console.log("Modal Message After Set:", modalMessage);

        setIsEditing(false);
        setEditBlogId(null);
        setTitle("");
        setDescription("");
        setContent("");
        setImage(null);
        setModalShow(true);

        // navigate("/profile");
      } else {
        const response = await fetch("http://localhost:5000/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        });
        if (!response.ok) throw new Error("Failed to create blog");

        const createdBlog = await response.json();
        console.log(createdBlog);
        setBlogs((prevBlogs) => [...prevBlogs, createdBlog]);

        setModalMessage({
          title: "Blog Created Successfully!",
          body: "Yay! You have successfully added a new blog.",
        });

        console.log("Modal should show:", modalShow);
        console.log("Modal Message After Set:", modalMessage);

        setIsEditing(false);
        setEditBlogId(null);
        setTitle("");
        setDescription("");
        setContent("");
        setImage(null);
        // navigate("/profile");
        setModalShow(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePreview = () => {
    navigate("/Preview", { state: { title, image, description, content } });
  };

  const handleCloseModal = () => {
    setModalShow(false); // Close the modal and redirect to the profile page
    navigate("/profile");
  };

  return (
    // <div className="dashboard-container">
    <div className="form-card">
      {/* <h2>{isEditing ? "Edit Blog Post" : "Create Blog Post"}</h2> */}
      <Form onSubmit={handleSubmit} className="form">
        <div className="form-card">
          <Button
            variant="primary"
            onClick={handleAddImageClick}
            className="form-button"
          >
            Add a Cover Image
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
            accept="image/*"
          />
          <Form.Group controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add your title here.."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="textarea1"
            />
          </Form.Group>

          <Form.Group controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter blog description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              // className="textarea"
            />
          </Form.Group>
          <Form.Group controlId="formBasicContent">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{ toolbar: toolbarOptions }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "blockquote",
                "code-block",
                "link",
                "image",
                "video",
              ]}
              placeholder="Write your blog content here..."
              className="quill-icons"
            />
          </Form.Group>
        </div>

        <div className="button-container">
          <Button variant="primary" type="submit" className="form-button">
            {isEditing ? "Update Blog" : "Create Blog"}
          </Button>
          <Button
            variant="primary"
            type="button"
            className="form-button"
            onClick={handlePreview}
          >
            Preview
          </Button>
        </div>
        <SuccessModal
          show={modalShow}
          onHide={handleCloseModal}
          title={modalMessage.title}
          body={modalMessage.body}
        />
      </Form>
      {/* <p>
        make sure when you are done editing then you must publish your blogs
        from DashBoard
      </p> */}
    </div>
    // </div>
  );
};

export default Dashboard;
