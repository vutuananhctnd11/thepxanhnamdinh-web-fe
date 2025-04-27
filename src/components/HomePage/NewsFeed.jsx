import React from "react";
import PostInfo from "../Post/PostInfo";

const NewsFeed = ({ listPost }) => {
  return (
    <>
      {/* Thông tin bài viết */}
      {listPost.map((post) => (
        <PostInfo post={post} />
      ))}
    </>
  );
};

export default NewsFeed;
