import React from 'react';
import {Link} from 'react-router-dom';
import "./SearchResults.scss";

export const SearchResults = ({ results }) => {

  const { users = [], blogs = [] } = results;

  if (users.length === 0 && blogs.length === 0) {
    return null;
  }

  const combinedResults = [
    ...users.map(user => ({ type: 'user', content: user.name })),
    ...blogs.map(blog => ({ type: 'blog', content: blog.title }))
  ];

  return (
    <div className='results-list'>
<div className="users-section">
        {/* <h3>Users</h3> */}
        {/* {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="user-item">
              <div className="user-name">{user.name}</div>
              <div className="user-profession">{user.profession}</div>
            </div>
          ))
        ) : (
          <div>No users found.</div>
        )} */}
      </div>


      {/* <h2 className="head">Search Results: Blogs</h2> */}
      <div className="recent-blogss">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <img 
                src={blog.image} 
                alt={blog.title}
              />
              <Link to={`/blogs/${blog.id}`}>
                <h3>{blog.title}</h3>
              </Link>
              <p className="description">{blog.description.slice(0, 50)}...
                <Link to={`/blogs/${blog.id}`} className="read-more-link">read more</Link>
              </p>
              <p className="author">By: {blog.authorName || "Unknown Author"}</p>
            </div>
          ))
        ) : (
          <div className='no-results'>
            No results found. 😕
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
