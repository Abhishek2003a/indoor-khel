import {GameProvider}  from "./context/TicTacToe/GameContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  );
}

export default App;
