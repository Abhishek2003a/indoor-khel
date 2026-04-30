import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/TicTacToe/GameContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
