import React, {useState, useEffect} from "react";
import axios from "axios";

export default ({ postID}) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await axios.get(`http://localhost:3001/posts/${postID}/comments`);
    setComments(res.data);
  };

  useEffect(() => {
    console.log("Fetching comments for postID:", postID);

    fetchComments();
  }, []);

  const renderedComments = comments.map((comment) => {
    return (
      <li key={comment.id}>
        {comment.content}
      </li>
    );
  });

  return (
    <div>
      <ul>{renderedComments}</ul>
    </div>
  );
}