import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/TicTacToe/GameContext";
import AuthModal from "../../components/AuthModal";

export default function AuthGate() {
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("login");
  const { setUsername } = useGame();
  const navigate = useNavigate();

  const openLogin = () => { setModalTab("login"); setShowModal(true); };
  const openSignup = () => { setModalTab("signup"); setShowModal(true); };

  const handleAuthSuccess = (type, loggedInUsername) => {
    if (type === "login") {
      setShowModal(false);
      setUsername(loggedInUsername || "");
      navigate("/tictactoe/Home");
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center text-3xl mb-5 shadow-lg shadow-indigo-500/30">
            ⚡
          </div>
          <h1 className="font-display text-4xl tracking-tight mb-2">Tic Tac Toe</h1>
          <p className="text-white/50 text-base">How would you like to play?</p>
        </div>

        <div className="glass rounded-3xl p-6 space-y-3 glow-soft">
          <button
            onClick={() => navigate("/tictactoe")}
            className="w-full p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition text-left flex items-center gap-4 group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center text-xl">🎯</div>
            <div className="flex-1">
              <div className="font-semibold">Play as Guest</div>
              <div className="text-white/40 text-xs">Quick public match — no account</div>
            </div>
            <Arrow />
          </button>

          <button
            onClick={openLogin}
            className="w-full p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition text-left flex items-center gap-4 group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center text-xl">👋</div>
            <div className="flex-1">
              <div className="font-semibold">Login</div>
              <div className="text-white/40 text-xs">Continue where you left off</div>
            </div>
            <Arrow />
          </button>

          <button
            onClick={openSignup}
            className="w-full p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 transition text-left flex items-center gap-4 shadow-lg shadow-indigo-500/30 group"
          >
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-xl">✨</div>
            <div className="flex-1">
              <div className="font-semibold">Sign Up</div>
              <div className="text-white/70 text-xs">Save your stats & play with friends</div>
            </div>
            <Arrow />
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full text-center text-white/40 hover:text-white/70 text-sm transition"
        >
          ← Back to home
        </button>
      </div>

      {showModal && (
        <AuthModal
          initialTab={modalTab}
          onClose={() => setShowModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
