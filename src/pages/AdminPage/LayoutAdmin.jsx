/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "@/components/Admin/Header";
import SideBar from "@/components/Admin/SideBar";
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
  return (
    <div className=" bg-black/80">
      <div className="flex h-screen overflow-hidden">
        <Header />
        <SideBar />
        <main className="flex-1 overflow-y-auto mt-13">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
