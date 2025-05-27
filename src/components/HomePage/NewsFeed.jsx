import React from "react";
import PostInfo from "../Post/PostInfo";
import PostNoInteraction from "../Post/PostNoInteraction";

const NewsFeed = ({ listPost, isReaction }) => {
  return (
    <>
      {/* Thông tin bài viết */}
      {isReaction && listPost.map((post) => <PostInfo postInput={post} />)}
      {!isReaction && listPost.map((post) => <PostNoInteraction post={post} />)}
    </>
  );
};

export default NewsFeed;
