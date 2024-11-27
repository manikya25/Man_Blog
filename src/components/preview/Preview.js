import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import Button from "react-bootstrap/Button";

export const Preview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, description, content, image } = location.state || {};

  const handleBack = () => {
    navigate("/dashboard", { state: { title, description, content, image } });
  };
  return (
    <div className="blog-detail">
      <h2>
        <strong>{title}</strong>
      </h2>
      {image && (
        <img
          src={image}
          alt="Blog cover"
          style={{ width: "80%", maxWidth: "600px", height: "auto" }}
        />
      )}
      <p className="desc">{description}</p>
      <div>{ReactHtmlParser(content)}</div>
      <Button className="form-button" onClick={handleBack}>
        Keep Editing
      </Button>
    </div>
  );
};
export default Preview;
