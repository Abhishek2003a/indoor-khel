import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Tic Tac Toe</h1>
      <Link to="/BoardUI">
        <button className="px-6 py-3 bg-blue-500 rounded-2xl shadow-lg hover:bg-blue-600">
          Start Game
        </button>
      </Link>
    </div>
  );
}
