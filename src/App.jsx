import { createContext, useContext, useState } from "react";
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
import OrderTicket from "./pages/OrderTicket";

const AppContext = createContext();

function App() {
  const [appState, setAppState] = useState({
    loading: false,
  });
  return (
    <>
      <AppContext.Provider value={{ appState, setAppState }}>
        {!appState.loading && (
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/loading" element={<LoadingNavigate />} />
              <Route path="/home-club" element={<ClubHomePage />} />
              <Route path="/about-club" element={<ClubInfo />} />
              <Route path="/order-ticket" element={<OrderTicket />} />
            </Routes>
          </Router>
        )}

        <LoadingNavigate />
      </AppContext.Provider>
    </>
  );
}

export default App;
export const useAppContext = () => {
  return useContext(AppContext);
};
