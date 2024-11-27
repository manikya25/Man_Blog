import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import ReactHtmlParser from "react-html-parser";
import "./BlogDetail.scss";

import BlogView from "../comments/BlogView";

export const BlogDetail = () => {
  const { id } = useParams();
  const { userId, blogs, setBlogs, name } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const [authorName, setAuthorName] = useState("Unknown Author");
  const [authorEmail, setAuthorEmail] = useState("N/A");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // console.log("Blog ID:", id);
    // console.log(name);

    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blogs/${id}`);
        if (!response.ok) {
          throw new Error("network response was not ok");
        }
        const data = await response.json();
        setBlog(data);

        const authorResponse = await fetch(
          `http://localhost:5000/users/${data.userId}`
        );
        if (!authorResponse.ok) {
          throw new Error("failed to fetch author details");
        }
        const authorData = await authorResponse.json();
        console.log(authorData.name);
        setAuthorName(authorData.name || "unknown author");
        setAuthorEmail(authorData.email || "N/A");
      } catch (error) {
        console.error("Failed to fetch blog: ", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/blogs/${id}/comments`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments: ", error);
      }
    };

    fetchBlog();
    fetchComments();
  }, [id]);

  const formattedDate = blog
    ? blog.createdAt
      ? new Date(blog.createdAt).toLocaleString()
      : "Unknown Date"
    : "Loading...";

  if (!blog) {
    return <div>Loading...</div>;
  }
  return (
    <div className="blog-detail">
      <h2>{blog.title}</h2>
      <img
        src={blog.image}
        alt={blog.title}
        style={{ width: "100%", maxWidth: "800px", height: "auto" }}
      />
      <div className="author-details">
        <p className="created-at">Published on: {formattedDate}</p>
        <p>By: {authorName}</p>
        <div className="email-details">
          <p>{authorEmail}</p>
        </div>
      </div>

      <hr className="author-divider" />

      {/* TODO author details */}

      <p>{blog.description}</p>
      <div className="quill-editor-content">
        {ReactHtmlParser(blog.content)}
      </div>
      <hr className="author-divider" />
      <BlogView className="comment" isLoggedIn={!!userId} userId={userId} />
      <hr className="author-divider" />
    </div>
  );
};
