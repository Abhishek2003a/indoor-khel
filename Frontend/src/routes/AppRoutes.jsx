import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landingPage";
import Entry from "../pages/tictactoe/Entry";
import Home from "../pages/TicTacToe/Home";
import Game from "../pages/tictactoe/Game";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tictactoe" element={<Entry />} />
        <Route path="/tictactoe/Home" element={<Home />} />
        <Route path="/tictactoe/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;