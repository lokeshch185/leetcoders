import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LeaderboardPage from './pages/LeaderBoardPage';
import UserPage from './pages/UserPage';
import ChallengesPage from './pages/ChallengesPage';
import DailyChallengePage from './pages/DailyChallengePage';
import UserNavbar from './components/UserNavbar';
import Navbar from './components/Navbar';
import GoalPage from './pages/GoalPage';
import { initGA, logPageView } from './utils/Analytics';
import StriverSheet from './pages/StriverSheet';
import UserProfilePage from './pages/ProfilePage';
import FriendsChat from './pages/ChatPage';

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <Router>
      <RouteTracker />
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const userNavbar = ['/leaderboard', '/userPage', '/challenges', '/dcc', '/goals', '/sheets', '/chat'].includes(location.pathname) || location.pathname.startsWith('/userProfile');
  const publicNavbar = ['/'].includes(location.pathname);

  return (
    <div className="app-container">
      {userNavbar && <UserNavbar />}
      {publicNavbar && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/goals" element={<GoalPage />} />
        <Route path="/dcc" element={<DailyChallengePage />} />
        <Route path="/sheets" element={<StriverSheet />} />
        <Route path="/userProfile/:username" element={<UserProfilePage/>} />
        <Route path="/chat" element={<FriendsChat />} />
      </Routes>
    </div>
  );
}

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

export default App;
