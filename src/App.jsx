import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewsDetail from "./components/News/NewsDetail";
import ClubInfo from "./pages/ClubInfo";
import ScrollToTop from "./parts/ScrollToTop";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />

          <Route path="/home" element={<HomePage />} />
          <Route path="/news/detail" element={<NewsDetail />} />
          <Route path="/about-us" element={<ClubInfo />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;
