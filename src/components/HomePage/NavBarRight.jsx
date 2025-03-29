import { LucideSearch } from "lucide-react";
import React from "react";
import ItemNav from "../ItemNav/ItemNav";
import { Avatar, AvatarImage } from "../ui/avatar";

const NavBarRight = () => {
  return (
    <div className="m-3">
      <div className="h-8 relative">
        <LucideSearch className="absolute left-2 h-8 justify-center scale-85" />
        <input
          type="text"
          placeholder="Tìm kiếm trên TXND FanZone"
          className="w-full h-full bg-white/20 rounded-2xl pl-10 pr-4 outline-none placeholder-white/30"
        />
      </div>
      <div className="mt-3 space-y-2">
        <p className="text-gray-300">Kết quả gần đây</p>
        <div className="h-[100px] w-full">
          <img src="/banner1.jpg" className="h-[100px]" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <p className="text-gray-300">Trận đấu sắp tới</p>
        <div className="h-[100px] w-full">
          <img src="/banner2.jpg" className="h-[100px]" />
        </div>
      </div>
      <hr className="mt-5 mb-3 mx-2" />
      <div>
        <p className="text-gray-300 my-1">Người liên hệ</p>
        <div>
          {Array.from({ length: 8 }).map((_, index) => (
            <ItemNav
              icon={
                <Avatar>
                  <AvatarImage src="/bg2.jpg" className={"object-cover"} />
                </Avatar>
              }
              name={"Nguyễn Văn Toàn"}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 text-[12px] text-gray-400 flex justify-center">
        <p>TXND FanZone - Copyright © 2025 by TuanAnhDev</p>
      </div>
    </div>
  );
};

export default NavBarRight;
