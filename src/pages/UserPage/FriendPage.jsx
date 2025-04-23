import React from "react";
import LayoutSocial from "../../components/LayoutSocial";
import FriendRequestSent from "@/components/Friend/FriendRequestSent";
import FriendRequestReceived from "@/components/Friend/FriendRequestReceived";

const FriendPage = () => {
  return (
    <LayoutSocial>
      <div className="bg-black/90 pt-13 h-full ">
        <FriendRequestSent />
        <hr className="text-2xl border-white/40 mx-10 my-5"></hr>
        <FriendRequestReceived />
        {/* <hr className="text-2xl border-white/40 mx-10 my-5"></hr> */}
      </div>
    </LayoutSocial>
  );
};

export default FriendPage;
