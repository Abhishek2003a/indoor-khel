import { useGame } from "../../context/TicTacToe/GameContext";
import { socket } from "../../services/socket";

const Board = () => {
  const { board, turn, roomId } = useGame();

  const handleClick = (index) => {
    if (!turn) return;
    console.log("Clicked cell index:", index);
    socket.emit("make_move", { roomId, index });
  };

  return (
    <div className="grid grid-cols-3 gap-3 bg-gray-800 p-4 rounded-xl shadow-lg">
      {board.map((cell, i) => (
        <div
          key={i}
          onClick={() => handleClick(i)}
          // className="w-24 h-24 bg-gray-700 flex items-center justify-center text-3xl font-bold cursor-pointer hover:bg-gray-600 transition"
          className={
            cell === "" && turn
              ? "w-24 h-24 bg-gray-700 flex items-center justify-center text-3xl font-bold cursor-pointer hover:bg-gray-600 transition rounded-md"
              : "w-24 h-24 bg-gray-700 flex items-center justify-center text-3xl font-bold cursor-not-allowed hover:bg-gray-700 transition rounded-md"
          }
        >
          {cell}
        </div>
      ))}
    </div>
  );
};

export default Board;
