import React from "react";
import LayoutSocial from "../components/LayoutSocial";
import NavBarLeft from "../components/HomePage/NavBarLeft";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavBarRight from "@/components/HomePage/NavBarRight";

const HomePage = () => {
  return (
    <LayoutSocial>
      <div className="w-full h-screen flex text-white bg-black/90 relative">
        <ScrollArea className="w-[25%] h-[calc(100vh-52px)] left-0 top-13">
          <NavBarLeft />
        </ScrollArea>
        <div className="w-[50%] h-[calc(100vh-52px)] mt-13">def</div>
        <ScrollArea className="w-[25%] h-[calc(100vh-52px)] fixed right-0 top-13 ">
          <NavBarRight />
        </ScrollArea>
      </div>
    </LayoutSocial>
  );
};

export default HomePage;
