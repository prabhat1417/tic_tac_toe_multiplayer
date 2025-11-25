import React, { useState, useEffect, useRef } from 'react';
import { client, getSession, restoreSession } from './nakama';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import './App.css';

function App() {
  const [screen, setScreen] = useState('login'); // login, menu, lobby-host, lobby-join, game, leaderboard
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState('');

  const [matchId, setMatchId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState({});
  const [myTurn, setMyTurn] = useState(false);
  const [playerMark, setPlayerMark] = useState(null);
  const [winner, setWinner] = useState(null);

  const matchIdRef = useRef(null);
  const playerMarkRef = useRef(null);

  // Session Restore
  useEffect(() => {
    const initSession = async () => {
      const s = await restoreSession();
      if (s) {
        console.log("Session restored:", s.username);
        setSession(s);
        setUsername(s.username);
        connectSocket(s);
        setScreen('menu');
      }
    };
    initSession();
  }, []);

  // Helper to connect socket
  const connectSocket = async (s) => {
    try {
      const socket = client.createSocket(false, false);
      await socket.connect(s, true);
      setSocket(socket);

      socket.onmatchdata = (matchState) => {
        const content = JSON.parse(new TextDecoder().decode(matchState.data));

        if (content.type === "update") {
          setBoard(content.board);
          setWinner(content.winner);
          if (content.players) setPlayers(content.players);

          if (content.players && content.players[s.user_id]) {
            const myPlayer = content.players[s.user_id];
            setPlayerMark(myPlayer.mark);
            playerMarkRef.current = myPlayer.mark;
            setMyTurn(content.turn === myPlayer.mark);
          } else {
            if (playerMarkRef.current) {
              setMyTurn(content.turn === playerMarkRef.current);
            }
          }
        }
      };

      socket.onmatchpresence = (presence) => {
        console.log("Presence update:", presence);
        // If we are hosting and someone joins, switch to game
        // We need to check current screen state, but inside callback 'screen' might be stale.
        // However, we can check if we have a matchId and are waiting.
        // For simplicity, let's rely on the match update or just this.
        if (presence.joins && presence.joins.length > 0) {
          // Ideally we'd check if we are in lobby-host mode.
          // But switching to game is generally safe if we are in a match.
          // Let's just trigger a re-render or let the update handle it.
          // Actually, the previous logic used screen state which is tricky in closure.
          // We'll leave it for now as the update loop handles game start usually.
        }
      };

    } catch (e) {
      console.error("Socket connection failed:", e);
    }
  };

  // Login Handler
  const handleLogin = async (user) => {
    try {
      const s = await getSession(user);
      setSession(s);
      setUsername(s.username || user); // Use returned username in case it was adjusted

      await connectSocket(s);
      setScreen('menu');
    } catch (err) {
      console.error("Login failed:", err);
      // Check if error is "Username taken"
      if (err.message && err.message.includes("already in use")) {
        alert("Username '" + user + "' is already taken. Please choose another.");
      } else {
        alert("Login failed: " + (err.message || "Unknown error"));
      }
    }
  };

  // Matchmaking / Hosting
  const handleHost = async () => {
    if (!socket) return;
    try {
      const rpcRes = await client.rpc(session, "create_match", {});
      const payload = rpcRes.payload;
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

      const mId = data.matchId;
      const mCode = data.code; // Get the short code

      const match = await socket.joinMatch(mId);
      setMatchId(mCode); // Store the CODE for display, not the UUID
      matchIdRef.current = match.match_id; // Keep UUID for logic if needed, or just rely on socket

      // Reset Game State
      setBoard(Array(9).fill(null));
      setWinner(null);
      setPlayerMark(null);
      playerMarkRef.current = null;

      setScreen('game');

      socket.onmatchpresence = (presence) => {
        if (presence.joins && presence.joins.length > 0) {
          // setScreen('game');
        }
      };

    } catch (err) {
      console.error("Host failed:", err);
    }
  };

  const handleJoinMatch = async (code) => {
    if (!socket) return;
    try {
      // Resolve code to ID
      const rpcRes = await client.rpc(session, "get_match_id", { code: code });
      const payload = rpcRes.payload;
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

      if (!data.matchId) throw new Error("Invalid code");

      const match = await socket.joinMatch(data.matchId);
      setMatchId(code); // Display the code they joined with
      matchIdRef.current = match.match_id;

      // Reset Game State
      setBoard(Array(9).fill(null));
      setWinner(null);
      setPlayerMark(null);
      playerMarkRef.current = null;

      setScreen('game');
    } catch (err) {
      console.error("Join failed:", err);
      alert("Could not join match: " + (err.message || "Unknown error"));
    }
  };

  const handleMove = (index) => {
    if (!socket || !matchId) return;
    const data = { position: index };
    socket.sendMatchState(matchId, 1, JSON.stringify(data));
  };

  const handleReset = () => {
    // Leave match and go back to menu
    if (socket && matchId) {
      socket.leaveMatch(matchId);
    }
    setMatchId(null);
    setScreen('menu');
  };

  // Render
  return (
    <div className="App">
      {screen === 'login' && <Login onLogin={handleLogin} />}

      {screen === 'menu' && (
        <MainMenu
          onHost={handleHost}
          onJoin={() => setScreen('lobby-join')}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}

      {screen === 'lobby-host' && (
        <Lobby
          mode="host"
          matchId={matchId}
          onCancel={() => setScreen('menu')}
        />
      )}

      {screen === 'lobby-join' && (
        <Lobby
          mode="join"
          onJoinMatch={handleJoinMatch}
          onCancel={() => setScreen('menu')}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard
          session={session}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'game' && (
        <Game
          matchId={matchId}
          board={board}
          players={players}
          myId={session?.user_id}
          onMove={handleMove}
          myTurn={myTurn}
          playerMark={playerMark}
          winner={winner}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
