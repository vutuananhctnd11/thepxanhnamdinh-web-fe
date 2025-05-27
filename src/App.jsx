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
import SearchResultPage from "./pages/UserPage/SearchResultPage";
import ChatPage from "./pages/UserPage/ChatPage";
import CreatePlayer from "./components/Admin/PlayerManagement/CreatePlayer";
import UpdatePlayer from "./components/Admin/PlayerManagement/UpdatePlayer";
import ListCoach from "./pages/AdminPage/ListCoach";
import CreateCoach from "./components/Admin/CoachManagement/CreateCoach";
import UpdateCoach from "./components/Admin/CoachManagement/UpdateCoach";
import ListUser from "./pages/AdminPage/ListUser";
import CreateUser from "./components/Admin/UserManagement/CreateUser";
import ListMatch from "./pages/AdminPage/ListMatch";
import ListMatchResult from "./pages/AdminPage/ListMatchResult";
import CreateMatch from "./components/Admin/MatchManagement/CreateMatch";
import ListClub from "./pages/AdminPage/ListClub";
import CreateOtherClub from "./components/Admin/OtherClubManagement/CreateOtherClub";
import UpdateMatch from "./components/Admin/MatchManagement/UpdateMatch";
import UpdateOtherClub from "./components/Admin/OtherClubManagement/UpdateOtherClub";
import RequestUpdateMatch from "./pages/AdminPage/RequestUpdateMatch";
import ListReport from "./pages/AdminPage/ListReport";
import ListFanGroup from "./pages/AdminPage/ListFanGroup";
import CreateGroupRequest from "./components/Admin/FanGroupManagement/CreateGroupRequest";
import ListHomeMatch from "./pages/AdminPage/ListHomeMatch";
import StartSellingTicket from "./components/Admin/MatchManagement/OpenSellTicket";

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
                {/* player */}
                <Route path="players" element={<ListPlayer />} />
                <Route path="players/create" element={<CreatePlayer />} />
                <Route
                  path="players/update/:playerId"
                  element={<UpdatePlayer />}
                />
                {/* coaches */}
                <Route path="coaches" element={<ListCoach />} />
                <Route path="coaches/create" element={<CreateCoach />} />
                <Route
                  path="coaches/update/:coachId"
                  element={<UpdateCoach />}
                />
                {/* users */}
                <Route path="users" element={<ListUser />} />
                <Route path="users/create" element={<CreateUser />} />
                {/* matches */}
                <Route path="matches" element={<ListMatch />} />
                <Route path="matches/result" element={<ListMatchResult />} />
                <Route path="matches/create" element={<CreateMatch />} />
                <Route
                  path="matches/update/:matchId"
                  element={<UpdateMatch />}
                />

                <Route
                  path="matches/request-update"
                  element={<RequestUpdateMatch />}
                />
                {/* clubs */}
                <Route path="other-clubs" element={<ListClub />} />
                <Route
                  path="other-clubs/create"
                  element={<CreateOtherClub />}
                />
                <Route
                  path="other-clubs/update/:clubId"
                  element={<UpdateOtherClub />}
                />
                {/* reports */}
                <Route path="reports" element={<ListReport />} />
                <Route path="fan-groups" element={<ListFanGroup />} />
                <Route
                  path="fan-groups/create-request"
                  element={<CreateGroupRequest />}
                />
                <Route path="matches/home" element={<ListHomeMatch />} />
                <Route
                  path="matches/:matchId/start-selling-ticket"
                  element={<StartSellingTicket />}
                />
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
              <Route path="/social/search" element={<SearchResultPage />} />
              <Route
                path="/social/chat/:conversationId"
                element={<ChatPage />}
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
