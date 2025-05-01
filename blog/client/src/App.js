import React from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";
import CommentList from "./CommentList";

const App = () => {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
      <CommentList />

    </div>
  );
};
export default App;
