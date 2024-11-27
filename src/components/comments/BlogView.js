import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FloatingLabel, Form, Button } from "react-bootstrap";
import "./BlogView.scss";

const BlogView = ({
  title,
  description,
  content,
  image,
  isLoggedIn,
  userId,
}) => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [name, setName] = useState("");
  const isUserLoggedIn = isLoggedIn;

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blogs/${id}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data = await response.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (isUserLoggedIn && userId) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:5000/users/${userId}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();
          setName(data.name);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUser();
    }
  }, [isUserLoggedIn, userId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        userName: name,
        blogId: id,
      };

      console.log(newComment);

      // Fetch the current comments
      const response = await fetch(`http://localhost:5000/blogs/${id}`);
      const blogData = await response.json();

      // Add the new comment to the existing comments array
      const updatedComments = [...(blogData.comments || []), newComment];

      // Update the blog's comments array with the new comment
      await fetch(`http://localhost:5000/blogs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comments: updatedComments }),
      });

      setComments((prevComments) => [...prevComments, newComment]);
      setCommentText("");
    }
  };

  return (
    <div className="blog-view">
      <ul className="comment-list">
        <h2>
          <strong>Comments:</strong>
        </h2>
        {comments &&
          comments.map((comment, index) => (
            <li key={index} className="comment-item">
              <strong>{comment.userName || "Anonymous"}:</strong> {comment.text}
            </li>
          ))}
      </ul>

      {isLoggedIn ? (
        <>
          <FloatingLabel controlId="floatingTextarea2">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{
                height: "150px",
                fontSize: "20px",
                padding: "12px",
                width: "100%",
                marginTop: "30px",
              }}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </FloatingLabel>

          <Button
            onClick={handleAddComment}
            style={{
              marginTop: "10px",
              background: "rgb(253, 84, 23)",
              border: "none",
              color: "white",
            }}
          >
            Add Comment
          </Button>
        </>
      ) : (
        <p>Please log in to post a comment.</p>
      )}
    </div>
  );
};

export default BlogView;
