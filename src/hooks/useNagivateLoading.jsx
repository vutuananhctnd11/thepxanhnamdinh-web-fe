import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useNagivateLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  return (pathNavigate) => {
    navigate("/loading", {
      state: { path: pathNavigate, oldPath: location.pathname },
    });
  };
}
