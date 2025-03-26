import {
  LucideSearch,
  SearchCheckIcon,
  SearchCodeIcon,
  SearchIcon,
} from "lucide-react";
import React from "react";

const NavBarRight = () => {
  return (
    <div>
      <div className="h-8 m-3 ">
        <LucideSearch className="absolute left-5 h-8 justify-center" />
        <input
          type="text"
          placeholder="Tìm kiếm trên TXND FanZone"
          className="w-full h-full bg-white/20 rounded-2xl pl-10 pr-4 outline-none placeholder-white/30"
        />
      </div>
    </div>
  );
};

export default NavBarRight;
