import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchInput.scss";

export const SearchInput = ({ setResults }) => {
  const [input, setInput] = useState("");
  const debounceFetchData = useCallback(
    debounce((value) => {
      fetchData(value);
    }, 300),
    []
  );

  const fetchData = async (value) => {
    if (!value.trim()) return;

    try {
      const [usersResponse, blogsResponse] = await Promise.all([
        fetch("http://localhost:5000/users"),
        fetch("http://localhost:5000/blogs"),
      ]);

      if (!usersResponse.ok || !blogsResponse.ok) {
        throw new Error("Failed to fetch data from one or both endpoints");
      }

      const users = await usersResponse.json();
      const blogs = await blogsResponse.json();

      // Filter results based on the search input
      const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );

      const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(value.toLowerCase())
      );

      // Set combined results
      setResults({ users: filteredUsers, blogs: filteredBlogs });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (value) => {
    setInput(value);

    if (!value.trim()) {
      // Clear results if input is empty
      setResults({ users: [], blogs: [] });
      return;
    }

    debounceFetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="type to search.."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        // className="search"
        style={{
          width: "100%",
          border: "none",
          padding: "20px",
          outline: "none",
        }}
      />
    </div>
  );
};

function debounce(func, delay) {
  let debounceTimeout;
  return function (...args) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func(...args), delay);
  };
}

export default SearchInput;
