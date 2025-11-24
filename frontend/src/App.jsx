import React, { useState, useEffect, useRef } from 'react';
import { client, getSession } from './nakama';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import './App.css'; // We might remove this if index.css covers it, but keeping for safety

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

  // Login Handler
  const handleLogin = async (user) => {
    try {
      const s = await getSession(user);
      setSession(s);
      setUsername(user);

      // Connect Socket
      const socket = client.createSocket(false, false);
      await socket.connect(s, true);
      setSocket(socket);

      // Setup Listeners
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

      setScreen('menu');
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check console.");
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

      const match = await socket.joinMatch(mId);
      setMatchId(match.match_id);
      matchIdRef.current = match.match_id;

      // Reset Game State
      setBoard(Array(9).fill(null));
      setWinner(null);
      setPlayerMark(null);
      playerMarkRef.current = null;

      setScreen('lobby-host');

      // In a real app, we'd wait for a player join event here to switch to 'game'
      // But our backend sends an update immediately on join.
      // Let's listen for presence join? Or just wait for the first update with 2 players.
      // For now, we can just switch to game screen when we get a match update that implies game start?
      // Or just stay in lobby until opponent joins.
      // Let's add a presence listener.

    } catch (err) {
      console.error("Host failed:", err);
    }
  };

  const handleJoinMatch = async (code) => {
    if (!socket) return;
    try {
      const match = await socket.joinMatch(code);
      setMatchId(match.match_id);
      matchIdRef.current = match.match_id;

      // Reset Game State
      setBoard(Array(9).fill(null));
      setWinner(null);
      setPlayerMark(null);
      playerMarkRef.current = null;

      setScreen('game');
    } catch (err) {
      console.error("Join failed:", err);
      alert("Could not join match: " + err.message);
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

  // Effect to auto-switch from lobby to game when player joins
  // We can detect this if we receive a match state update that shows 2 players
  // Or use match presence.
  useEffect(() => {
    if (socket) {
      socket.onmatchpresence = (presence) => {
        console.log("Presence update:", presence);
        // If we are hosting and someone joins, switch to game
        if (screen === 'lobby-host' && presence.joins && presence.joins.length > 0) {
          setScreen('game');
        }
      };
    }
  }, [socket, screen]);


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
