/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./parts/ScrollToTop";
import LoadingNavigate from "./pages/LoadingNavigate";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPassword from "./pages/ForgotPassword";
import LayoutAdmin from "./pages/AdminPage/LayoutAdmin";
import OrderTicket from "./pages/UserPage/OrderTicket";
import ClubInfo from "./pages/UserPage/ClubInfo";
import HomePage from "./pages/UserPage/HomePage";
import ClubHomePage from "./pages/UserPage/ClubHomePage";
import Dashboard from "./pages/AdminPage/Dashboard";
import ListPlayer from "./pages/AdminPage/ListPlayer";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import PaymentStatus from "./pages/UserPage/PaymentStatus";
import FriendPage from "./pages/UserPage/FriendPage";
import PersonalPage from "./pages/UserPage/PersonalPage";
import ListGroupPage from "./pages/UserPage/ListGroupPage";
import GroupDetailPage from "./pages/UserPage/GroupDetailPage";
import CreateGroupForm from "./components/Group/CreateGroupModal";

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
              <Route path="/" element={<Navigate to="/home-club" />} />
              <Route path="/social/home" element={<HomePage />} />
              <Route path="/loading" element={<LoadingNavigate />} />
              <Route path="/home-club" element={<ClubHomePage />} />
              <Route path="/about-club" element={<ClubInfo />} />
              <Route path="/order-ticket" element={<OrderTicket />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin" element={<LayoutAdmin />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="list-player" element={<ListPlayer />} />
              </Route>
              <Route path="/access-denied" element={<AccessDeniedPage />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route path="/social/friends" element={<FriendPage />} />
              <Route
                path="/social/personal-page/:userId"
                element={<PersonalPage />}
              />
              <Route path="/social/groups/list" element={<ListGroupPage />} />
              <Route
                path="/social/groups/detail/:groupId"
                element={<GroupDetailPage />}
              />
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
