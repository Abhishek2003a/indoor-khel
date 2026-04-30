import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";
import { useGame } from "../../context/TicTacToe/GameContext";
import { useAuth } from "../../context/AuthContext";
import useSocket from "../../hooks/useSocket";

const DURATION_OPTIONS = [
  { label: "1 min", value: 60 },
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
];

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    username,
    setRoomId, setPlayerSymbol, setBoard, setWinner, setTurn,
    setOpponentName, setOpponentSymbol, setMessages,
    setTimeLeft, setDuration, setRoomCode,
    searching, setSearching,
  } = useGame();

  const [selectedType, setSelectedType] = useState("public");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [roomError, setRoomError] = useState("");
  const [lobbyRoom, setLobbyRoom] = useState(null);
  const [copied, setCopied] = useState(false);

  // ── Socket listeners ────────────────────────────────────────────────────────

  useSocket("room_created", (data) => {
    setLobbyRoom(data);
    setSearching(true);
    if (data.type === "private") setRoomCode(data.code);
  });

  useSocket("room_error", ({ message }) => setRoomError(message));
  useSocket("join_error", ({ message }) => setJoinError(message));
  useSocket("match_error", ({ message }) => { setRoomError(message); setSearching(false); });
  useSocket("waiting", () => setSearching(true));

  useSocket("match_found", (data) => {
    setRoomId(data.roomId);
    setMessages(data.messages);
    setBoard(data.board);
    setDuration(data.duration ?? 0);
    setTimeLeft(data.duration ?? null);

    const me = data.players.find((p) => p.socketId === socket.id);
    setPlayerSymbol(me.symbol);
    setTurn(me.turn);

    const other = data.players.find((p) => p.socketId !== socket.id);
    setOpponentName(other?.username || "Opponent");
    setOpponentSymbol(other?.symbol || null);
    setWinner(null);
    setSearching(false);
    setLobbyRoom(null);
    navigate("/TicTacToe/Game");
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleFindPublicMatch = () => {
    setRoomError("");
    socket.emit("find_match", { username });
  };

  const handleCreatePrivateRoom = () => {
    setRoomError("");
    socket.emit("create_room", { duration: selectedDuration, username });
  };

  const handleJoinRoom = () => {
    setJoinError("");
    if (!joinCode.trim()) return setJoinError("Enter a room code");
    socket.emit("join_room", { code: joinCode.trim(), username });
  };

  const handleGuestStart = () => socket.emit("find_match", { username });

  const handleCancelLobby = () => {
    if (lobbyRoom) {
      socket.emit("leave_room", { roomId: lobbyRoom.roomId });
      setLobbyRoom(null);
      setRoomCode(null);
    } else {
      socket.emit("cancel_match");
    }
    setSearching(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobbyRoom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Lobby (waiting for opponent) ─────────────────────────────────────────────

  if (searching || lobbyRoom) {
    const isPrivate = lobbyRoom?.type === "private";
    const durationLabel = lobbyRoom
      ? DURATION_OPTIONS.find((d) => d.value === lobbyRoom.duration)?.label
      : "2 min";

    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Status */}
          <div className="text-center mb-8">
            <div className="relative inline-flex mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/40 animate-pulse-glow">
                ⏳
              </div>
            </div>
            <h2 className="font-display text-3xl tracking-tight mb-2">Waiting for opponent…</h2>
            <p className="text-white/50">
              {isPrivate ? "Share the code with your friend" : "Finding a public match for you"}
            </p>
          </div>

          {/* Room code panel */}
          {isPrivate && lobbyRoom?.code && (
            <div className="glass rounded-3xl p-6 mb-5 glow-soft">
              <p className="text-white/40 text-xs uppercase tracking-widest text-center mb-3 font-semibold">Room Code</p>
              <p className="font-mono text-5xl font-bold tracking-[0.3em] text-center text-gradient mb-5">
                {lobbyRoom.code}
              </p>
              <button
                onClick={handleCopyCode}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/[0.06] hover:bg-white/[0.10] border border-white/10"
                }`}
              >
                {copied ? "✓ Copied to clipboard" : "Copy code"}
              </button>
            </div>
          )}

          {/* Match info */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="px-3 py-1.5 rounded-full glass text-xs text-white/60 font-medium">
              ⏱ {durationLabel} match
            </div>
            <div className="px-3 py-1.5 rounded-full glass text-xs text-white/60 font-medium">
              {isPrivate ? "🔒 Private" : "🌐 Public"}
            </div>
          </div>

          <button
            onClick={handleCancelLobby}
            className="w-full py-3 rounded-2xl bg-white/[0.04] hover:bg-rose-500/10 hover:border-rose-500/30 border border-white/10 text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Main room selection UI ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center text-2xl mb-4 shadow-lg shadow-indigo-500/30">
            ⚡
          </div>
          <h1 className="font-display text-4xl tracking-tight mb-2">Tic Tac Toe</h1>
          <p className="text-white/50">
            Welcome, <span className="text-white font-semibold">{username || "Player"}</span>
          </p>
        </div>

        {isLoggedIn ? (
          <div className="space-y-5">
            {/* Create / Find Match */}
            <div className="glass rounded-3xl p-6 glow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl tracking-tight">Start a match</h2>
              </div>

              {/* Type toggle */}
              <div className="flex gap-2 p-1 mb-5 bg-white/[0.04] rounded-2xl border border-white/[0.06]">
                {[
                  { v: "public", label: "🌐 Public", desc: "Match anyone" },
                  { v: "private", label: "🔒 Private", desc: "Invite a friend" },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => setSelectedType(opt.v)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${
                      selectedType === opt.v
                        ? "bg-white/[0.08] text-white shadow-sm"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {selectedType === "public" ? (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-lg">⏱</div>
                    <div>
                      <div className="text-sm font-medium">2-minute matches</div>
                      <div className="text-white/40 text-xs">Open to all players · guest & members</div>
                    </div>
                  </div>
                  {roomError && <ErrorBanner msg={roomError} />}
                  <button
                    onClick={handleFindPublicMatch}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 font-semibold transition shadow-lg shadow-indigo-500/30"
                  >
                    Find Match
                  </button>
                </>
              ) : (
                <>
                  <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">Time control</p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {DURATION_OPTIONS.map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => setSelectedDuration(value)}
                        className={`py-3 rounded-xl text-sm font-semibold transition border ${
                          selectedDuration === value
                            ? "bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-white border-indigo-400/40"
                            : "bg-white/[0.03] text-white/60 border-white/[0.06] hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {roomError && <ErrorBanner msg={roomError} />}
                  <button
                    onClick={handleCreatePrivateRoom}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 font-semibold transition shadow-lg shadow-indigo-500/30"
                  >
                    Create Private Room
                  </button>
                </>
              )}
            </div>

            {/* Join Room */}
            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-xl tracking-tight mb-1">Join a private room</h2>
              <p className="text-white/40 text-sm mb-5">Enter the 6-character code from your friend.</p>
              <input
                value={joinCode}
                onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(""); }}
                placeholder="ABC123"
                maxLength={6}
                className="w-full px-4 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 font-mono tracking-[0.4em] text-center text-2xl font-bold focus:outline-none focus:border-indigo-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20 transition mb-4 uppercase"
              />
              {joinError && <ErrorBanner msg={joinError} />}
              <button
                onClick={handleJoinRoom}
                className="w-full py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 font-semibold transition"
              >
                Join Room
              </button>
            </div>
          </div>
        ) : (
          <div className="glass rounded-3xl p-8 text-center glow-soft">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="font-display text-2xl mb-2">Ready to play?</h2>
            <p className="text-white/50 text-sm mb-6">Quick public match — no account needed.</p>
            {roomError && <ErrorBanner msg={roomError} />}
            <button
              onClick={handleGuestStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-lg transition shadow-lg shadow-emerald-500/30"
            >
              Start Playing
            </button>
            <p className="text-white/30 text-xs mt-4">Guest mode · 2-minute public matches only</p>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full text-center text-white/40 hover:text-white/70 text-sm transition"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
};

const ErrorBanner = ({ msg }) => (
  <div className="mb-4 px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
    {msg}
  </div>
);

export default Home;
