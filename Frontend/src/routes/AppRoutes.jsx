import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landingPage";
import Entry from "../pages/TicTacToe/Entry";
import Home from "../pages/TicTacToe/Home";
import Game from "../pages/TicTacToe/Game";
import AuthGate from "../pages/TicTacToe/AuthGate";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tictactoe" element={<Entry />} />
        <Route path="/tictactoe/auth-gate" element={<AuthGate />} />
        <Route path="/tictactoe/Home" element={<Home />} />
        <Route path="/TicTacToe/Game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;