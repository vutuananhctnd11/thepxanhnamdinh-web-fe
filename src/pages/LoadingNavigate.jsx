import React, { useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../App";

const LoadingPage = () => {
  const { appState, setAppState } = useAppContext();
  if (!appState.loading) return <></>;
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]">
      <motion.div
        animate={{
          scale: [1, 1.05, 8],
          rotate: [0, 0, 360],
          boxShadow: ["0 0 0px #fff", "0 0 40px #38bdf8", "0 0 0px #fff"],
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-40 h-40 rounded-full flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-xl"
      >
        <img src="/logo.png" alt="Logo" className="w-20 h-20" />
      </motion.div>
    </div>
  );
};

export default LoadingPage;
