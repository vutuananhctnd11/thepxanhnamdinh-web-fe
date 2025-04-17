import React from "react";
import LayoutSocial from "../../components/LayoutSocial";
import NavBarLeft from "../../components/HomePage/NavBarLeft";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavBarRight from "@/components/HomePage/NavBarRight";
import NewsFeed from "../../components/HomePage/NewsFeed";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Image, Smile, VideoIcon } from "lucide-react";

const HomePage = () => {
  return (
    <LayoutSocial>
      <div className="w-full h-screen flex text-white bg-black/90 relative">
        <ScrollArea className="w-[25%] h-[calc(100vh-52px)] left-0 top-13">
          <NavBarLeft />
        </ScrollArea>
        <ScrollArea className={"w-[50%] h-[calc(100vh-52px)] top-13"}>
          <div className="flex flex-col items-center">
            {/* tạo bài viết mới */}
            <div className="h-[110px] w-[80%] bg-white/10 mt-5 mb-2 rounded-lg">
              <div className="space-x-3 flex h-[40%] px-4 my-2 justify-center items-center">
                <Avatar className={"scale-120"}>
                  <AvatarImage src="hlv.png" className={"object-cover"} />
                </Avatar>
                <div className="h-10 w-full relative">
                  <input
                    type="text"
                    placeholder="Bạn đang nghĩ gì?"
                    className="w-full h-full bg-white/10 rounded-2xl pl-4 pr-4 outline-none placeholder-white/30"
                  />
                </div>
              </div>
              <hr className="mx-5 my-2 border-white/20 " />
              <div className="w-full flex justify-center items-center ">
                <div className="w-[30%] flex space-x-3 hover:bg-white/10 py-1 px-3 rounded-lg">
                  <VideoIcon className="text-red-600" />
                  <div>Video trực tiếp</div>
                </div>
                <div className="w-[30%] flex space-x-3 hover:bg-white/10 py-1 px-3 rounded-lg">
                  <Image className="text-green-500" />
                  <div>Ảnh và video </div>
                </div>
                <div className="w-[35%] flex space-x-3 hover:bg-white/10 py-1 px-3 rounded-lg">
                  <Smile className="text-yellow-400" />
                  <div>Cảm xúc/hoạt động</div>
                </div>
              </div>
            </div>

            {/* Bài viết */}
            <NewsFeed />
            <NewsFeed />
          </div>
        </ScrollArea>
        <ScrollArea className="w-[25%] h-[calc(100vh-52px)] fixed right-0 top-13 ">
          <NavBarRight />
        </ScrollArea>
      </div>
    </LayoutSocial>
  );
};

export default HomePage;
