import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./TicTacToe/Home";
import Landing from "./landingPage";
import BoardUI from "./TicTacToe/BoardUI";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/BoardUI" element={<BoardUI />} />
      </Routes>
    </Router>
  );
}
