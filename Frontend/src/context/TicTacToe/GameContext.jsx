import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [winnerSymbol,setWinnerSymbol]=useState(null);
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winnerName, setWinnerName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [playAgain, setPlayAgain] = useState(false);
  const [searching,setSearching]=useState(false);

  return (
    <GameContext.Provider
      value={{
        username,
        setUsername,
        roomId,
        setRoomId,
        playerSymbol,
        setPlayerSymbol,
        board,
        setBoard,
        turn,
        setTurn,
        messages,
        setMessages,
        playAgain,
        setPlayAgain,
        winner,
        setWinner,
        winnerName,
        setWinnerName,
        searching,
        setSearching,
        winnerSymbol,
        setWinnerSymbol
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
