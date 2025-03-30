import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Image } from "antd";
import {
  CommandIcon,
  ExternalLink,
  MessageCircleIcon,
  ThumbsUp,
} from "lucide-react";

const listNews = [
  {
    fullName: "Vũ Tuấn Anh",
    avatar: "bg2.jpg",
    title: "Trận hôm nay thắng rồi nhé",
    image: "banner2.jpg",
  },
];

const NewsFeed = () => {
  return (
    <div className="w-[80%] h-[523px] text-[14px] bg-white/10 rounded-lg my-3">
      {/* Thông tin bài viết */}
      {listNews.map((news, index) => (
        <div className="w-full" key={index}>
          <div className="flex items-center px-4 pt-4 pb-2">
            <Avatar className={"scale-120"}>
              <AvatarImage src={news.avatar} className={"object-cover"} />
            </Avatar>
            <div className="ml-3">
              <div className="font-semibold">{news.fullName}</div>
              <div className="text-white/50 text-[13px]">58 phút</div>
            </div>
          </div>
          <div className="px-4 pb-3">{news.title}</div>
          <Image src={news.image} className="w-full h-[400px] object-cover" />
          {/* Lượt tương tác */}
          <div className="flex items-center">
            <div className="h-5 w-5 mx-3 rounded-2xl bg-blue-500 flex justify-center items-center hover:scale-105 transition">
              <i class="fa-solid fa-thumbs-up scale-85" />
            </div>
            <div className="text-[13px] hover:underline">1M</div>
          </div>
          <hr className="border-white/30 mx-3 mt-2 mb-1" />

          {/* Thanh tương tác */}
          <div className="flex justify-center text-white/70">
            <div className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg">
              <ThumbsUp className="scale-90 mr-2" />
              <div>Thích</div>
            </div>
            <div className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg">
              <MessageCircleIcon className="scale-90 mr-2" />
              <div>Bình luận</div>
            </div>
            <div className="w-[30%] py-1 flex justify-center items-center hover:bg-white/10 rounded-lg">
              <ExternalLink className="scale-90 mr-2" />
              <div>Chia sẻ</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
