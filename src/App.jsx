import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NewsDetail from "./components/News/NewsDetail";
import ClubInfo from "./pages/ClubInfo";
import ClubHomePage from "./pages/ClubHomePage";
import HomePage from "./pages/HomePage";
import ScrollToTop from "./parts/ScrollToTop";
import LoadingNavigate from "./pages/LoadingNavigate";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/loading" element={<LoadingNavigate />} />
          <Route path="/home-club" element={<ClubHomePage />} />
          <Route path="/about-club" element={<ClubInfo />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;
