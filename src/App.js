import React, { useState, createContext, useContext, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Navbar/header";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/home";
import About from "./pages/About/about";
import SignUp from "./pages/profile/Signup/SignUp";
import Dashboard from "./pages/Writeablog/Dashboard";
import { BlogDetail } from "./components/BlogData/BlogDetail";
import "./styles/App.scss";
import Profile from "./pages/profile/profile";
import EditProfile from "./pages/Editprofile/EditProfile";
// import BlogView from "./components/comments/BlogView";
import SearchBar from "./components/search/SearchBar";
import LoginPage from "./pages/Login/LoginPage";
// import Footer from "./components/Footer";
import Preview from "./components/preview/Preview";

const AuthContext = createContext();

function App() {
  // const { userId } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userId, setUserId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const handleLogin = (id, name) => {
    setIsLoggedIn(true);
    setUserId(id);
    localStorage.setItem("isAuthenticated", "true");
    navigate("/");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  // useEffect(() => {
  //   // Adding the Google Translate script
  //   const script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  //   document.body.appendChild(script);

  //   // Define the initialization function for Google Translate
  //   window.googleTranslateElementInit = function() {
  //     new window.google.translate.TranslateElement(
  //       { pageLanguage: 'en' },
  //       'google_translate_element'
  //     );
  //   };

  //   // Cleanup function to remove the script
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userId,
        setUserId,
        handleLogin,
        blogs,
        setBlogs,
      }}
    >
      <Header onLogoutClick={handleLogout} />
      {/* <div id="google_translate_element" style={{ margin: '10px 0' }}></div> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/blog" element={<Blog />} /> */}
        <Route path="/SearchBar" element={<SearchBar />} />
        {/* <Route path="/blogs/:id" element={<BlogView />} /> */}
        <Route path="/Preview" element={<Preview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/SignUp" element={<SignUp />} />
      

<Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </AuthContext.Provider>
    // <Footer/>
  );
}

export { AuthContext };
export default App;
