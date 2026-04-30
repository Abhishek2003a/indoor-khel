import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/TicTacToe/GameContext";
import AuthModal from "../components/AuthModal";
import logo from "../assets/TictacToe/logo.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { setUsername } = useGame();
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("login");

  const openModal = (tab) => {
    setModalTab(tab);
    setShowModal(true);
  };

  const handleAuthSuccess = (type) => {
    if (type === "login") setShowModal(false);
  };

  const handleGameClick = () => {
    if (isLoggedIn) {
      setUsername(user.username);
      navigate("/tictactoe/Home");
    } else {
      navigate("/tictactoe/auth-gate");
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Top Nav */}
      <header className="w-full px-6 sm:px-10 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-display text-xl shadow-lg shadow-indigo-500/30">
            🎮
          </div>
          <span className="font-display text-xl tracking-tight">Indoor Khel</span>
        </div>

        <div className="flex gap-3 items-center">
          {isLoggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center font-bold text-xs">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="font-medium">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="px-5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal("login")}
                className="px-5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-medium transition"
              >
                Login
              </button>
              <button
                onClick={() => openModal("signup")}
                className="px-5 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-sm font-semibold transition shadow-lg shadow-indigo-500/30"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-white/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live multiplayer · Real-time
          </div>
          <h1 className="font-display text-5xl sm:text-7xl mb-5 tracking-tight">
            Play together, <br />
            <span className="text-gradient">anywhere</span>.
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            A premium home for classic indoor games. Match with friends or strangers in seconds — no install required.
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
          {/* Tic Tac Toe — active */}
          <button
            onClick={handleGameClick}
            className="group relative overflow-hidden rounded-3xl glass p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 flex items-center justify-center mb-5 overflow-hidden">
                <img src={logo} alt="Tic Tac Toe" className="w-2/3 h-2/3 object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display text-2xl tracking-tight">Tic Tac Toe</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">Live</span>
              </div>
              <p className="text-white/50 text-sm">Classic 3×3 strategy. 2 minutes per public match.</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-indigo-300 group-hover:text-indigo-200 transition-colors">
                Play now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Coming Soon cards */}
          {[
            { title: "Carrom", desc: "Pocket the strikers in this classic table game.", emoji: "🎯" },
            { title: "Ludo", desc: "Roll the dice and race your tokens home.", emoji: "🎲" },
          ].map((g) => (
            <div key={g.title} className="relative overflow-hidden rounded-3xl glass p-6 opacity-60 cursor-not-allowed">
              <div className="aspect-square w-full rounded-2xl bg-white/[0.03] flex items-center justify-center text-6xl mb-5">
                {g.emoji}
              </div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display text-2xl tracking-tight">{g.title}</h2>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider">Soon</span>
              </div>
              <p className="text-white/40 text-sm">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-white/30 text-xs">
        Built with care · Real-time multiplayer powered by sockets
      </footer>

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
