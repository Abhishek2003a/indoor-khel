import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./TicTacToe/Home";
import Landing from "./landingPage";
import Board1pUi from "./TicTacToe/Board1pUi";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Board1pUi" element={<Board1pUi />} />
      </Routes>
    </Router>
  );
}
