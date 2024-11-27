import React from "react";
import "./about.scss";
import AboutDetails from "./AboutDetails";


function about() {
  return (
    <div className="about">
      <div className="about-page">
          <h1 className="heading"><strong>Hi, I am Manikya, welcome to my blog page </strong></h1>
          <p className="intro-paragraph">
         <AboutDetails/>
          </p>
          <p className="intro-paragraph"> Get in touch - <a href="mailto:anvekarmanikya3@gmail.com">anvekarmanikya3@gmail.com</a></p>
      </div>
    </div>
  );
}

export default about;
