import React, { useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import "./BlogEngagement.scss";

export const BlogEngagement = ({blogId}) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(()=>{
    const savedLikes = localStorage.getItem(`likes_${blogId}`);
    const savedDislikes = localStorage.getItem(`dislikes_${blogId}`);

    if (savedLikes) setLikes(parseInt(savedLikes));
    if (savedDislikes) setDislikes(parseInt(savedDislikes));

  },[blogId]);

  const handleLike = () => {
    console.log("like hit");
    setLikes((prevLikes) => {
      const newLikes = prevLikes + 1;
      localStorage.setItem(`likes_${blogId}`, newLikes);
      return newLikes
    });
  };

  const handleDislikes = () => {
    console.log("dislike hit");
    setDislikes((prevDislikes) => {
      const newDislikes = prevDislikes + 1;
      localStorage.setItem(`dislikes_${blogId}`, newDislikes);
      return newDislikes;
    });
  }

  return (
    <div className="blog-engagement">
      <button className="like-icon" onClick={handleLike}>
        {/* <FaThumbsUp/> {likes} {likes !== 1 && "s"} */}
        <FaThumbsUp /> {likes} 
      </button>
      <button className="share-icon" onClick={handleDislikes}>
        <FaThumbsDown /> {dislikes} 
      </button>
    </div>
  );
};

export default BlogEngagement;
