import React from "react";
import Layout from "../components/Layout";
import NavBar from "../components/HomePage/NavBar";
import LoadingNavigate from "./LoadingNavigate";

const HomePage = () => {
  return (
    <Layout>
      <div className="w-full h-[700px] flex text-white bg-black/90">
        <div className="w-[25%]">
          <NavBar />
        </div>
        <div className="w-[50%] bg-red-400">def</div>
        <div className="w-[25%]">ghj</div>
      </div>
    </Layout>
  );
};

export default HomePage;
