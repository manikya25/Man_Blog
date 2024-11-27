import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "./home.scss";
import backgroundSign from "../../assets/background_sign.jpg";
import DailyDribble from '../../assets/Daily Dribble.jpg'
import BlogEngagement from "../../components/BlogEngagement";
import HomeDetails from "./HomeDetails";
import CircularProgress from '@mui/material/CircularProgress';
// import GoogleTranslate from 'react-google-translate';

const Home = () => {
  const { blogs, setBlogs } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCards, setShowCards] = useState(false); // State to control when cards become visible

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogResponse = await fetch("http://localhost:5000/blogs");
        const userResponse = await fetch("http://localhost:5000/users");

        if (!blogResponse.ok || !userResponse.ok) {
          throw new Error("failed to fetch data");
        }

        const blogsData = await blogResponse.json();
        const userData = await userResponse.json();

        //map author names to blogs
        const blogAuthors = blogsData.map((blog) => ({
          ...blog,
          authorName: userData.find((user) => user.id === blog.userId)?.name,
        }));

        setBlogs(blogAuthors);
        setUsers(userData);
      } catch (error) {
        console.error("Failed to fetch data : ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setBlogs]);

  return (
    <div className="home-container">
      <div className="home-backdrop">
        
        <img
        src={DailyDribble}
        // style={{
        //   width: "100%",
        //   height: "50vh",
        //   objectFit: "cover"
        // }}
        />
        </div>
      <div classname="news-section">
        <h1 className="news-heading">
          <strong>Football News</strong>
        </h1>
        {/* <hr className="hr" /> */}
        <p className="para">
         <HomeDetails/>
        </p>
        {/* <hr className="hr" /> */}
        {/* <Blogs /> */}
        {/* <GoogleTranslate />  */}
      </div>

      {/* <div className="recent-blogs-container"> */}
      <h1 className="news-heading2">
        <strong>Featured Blogs</strong>
      </h1>
      {/* <hr className="hr" /> */}
      {loading ? (
        // <p>Loading blogs...</p>
        // <div className="spinner-container">
        <>
          {/* <Spinner animation="border" variant="danger">
            <span className="visually-hidden">Loading...</span>
          </Spinner> */}
<div className="center-load">
<CircularProgress />
</div>

        </>
      ) : (
        <div className={`recent-blogs ${showCards ? "visible" : ""}`}>
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <img
                src={blog.image}
                alt={blog.title}
                // style={{ width: "200px" }}
              />
              <Link to={`/blogs/${blog.id}`} style={{ textDecoration: "none" }}>
                <h3>{blog.title}</h3>
              </Link>
              <p className="description">
                {blog.description.slice(0, 50)}...
                <Link to={`/blogs/${blog.id}`} className="read-more-link">
                  read more
                </Link>
              </p>
              <p className="author">
                By: {blog.authorName || "Unknown Author"}
              </p>
              <BlogEngagement blogId={blog.id} />
            </div>
          ))}
        </div>
      )}
      <hr className="hr" />
    </div>

    // </div>
  );
};

export default Home;
