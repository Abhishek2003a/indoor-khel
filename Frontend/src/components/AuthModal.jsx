import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ initialTab = "login", onClose, onSuccess }) {
  const [tab, setTab] = useState(initialTab);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  useEffect(() => {
    setTab(initialTab);
    setError("");
    setUsername("");
    setPassword("");
  }, [initialTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      if (tab === "login") {
        await login({ username, password });
        onSuccess?.("login", username);
      } else {
        await signup({ username, password });
        setTab("login");
        setPassword("");
        setError("Account created! Please log in.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = error.startsWith("Account created");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="glass-strong rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md p-8 relative animate-fade-in-up">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-7">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-indigo-500/30">
            {tab === "login" ? "👋" : "✨"}
          </div>
          <h2 className="font-display text-3xl tracking-tight mb-1">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-white/50 text-sm">
            {tab === "login" ? "Log in to play with friends." : "Sign up to save your progress."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_handle"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-indigo-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20 transition"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-indigo-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20 transition"
              autoComplete={tab === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <div
              className={`text-sm px-3 py-2.5 rounded-xl border ${
                isSuccess
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-500/30"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Please wait
              </span>
            ) : tab === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
