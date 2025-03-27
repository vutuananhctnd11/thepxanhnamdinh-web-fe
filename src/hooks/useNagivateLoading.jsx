import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../App";

export default function useNagivateLoading() {
  const { appState, setAppState } = useAppContext();
  const navigate = useNavigate();
  return (pathNavigate) => {
    setAppState((prev) => ({
      ...prev,
      loading: true,
    }));
    setTimeout(() => {
      navigate(pathNavigate);
      setAppState((prev) => ({
        ...prev,
        loading: false,
      }));
    }, 1000);
  };
}
