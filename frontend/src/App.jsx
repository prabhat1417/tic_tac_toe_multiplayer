import React, { useState, useEffect, useRef } from 'react';
import { client, getSession } from './nakama';
import Game from './components/Game';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myTurn, setMyTurn] = useState(false);
  const [playerMark, setPlayerMark] = useState(null); // 'X' or 'O'
  const [winner, setWinner] = useState(null);
  const [statusMsg, setStatusMsg] = useState("Initializing...");

  // Use refs for values needed in callbacks to avoid stale closures
  const matchIdRef = useRef(null);
  const playerMarkRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        setStatusMsg("Connecting to Nakama...");
        const s = await getSession();
        setSession(s);

        const socket = client.createSocket(false, false);
        await socket.connect(s, true);
        setSocket(socket);
        setStatusMsg("Connected. Ready to play.");

        socket.onmatchdata = (matchState) => {
          const content = JSON.parse(new TextDecoder().decode(matchState.data));
          console.log("Match Data:", content);

          if (content.type === "update") {
            setBoard(content.board);
            setWinner(content.winner);

            // Determine if it's my turn
            // We need to know OUR mark. The backend sends 'players' map.
            // We can find ourselves in it.
            if (content.players && content.players[s.user_id]) {
              const myPlayer = content.players[s.user_id];
              setPlayerMark(myPlayer.mark);
              playerMarkRef.current = myPlayer.mark;
              setMyTurn(content.turn === myPlayer.mark);
            } else {
              // If players not sent every time, we rely on state. 
              // But backend sends it on Join, so we should have it.
              // For simple updates, we might just get board/turn.
              // We use the ref to get the current playerMark
              if (playerMarkRef.current) {
                setMyTurn(content.turn === playerMarkRef.current);
              }
            }
          }
        };

        console.log("Connected to Nakama");
      } catch (err) {
        console.error("Error connecting:", err);
        setStatusMsg("Error connecting to server.");
      }
    };
    init();
  }, []);

  const findMatch = async () => {
    if (!socket) return;
    setStatusMsg("Creating match...");
    try {
      // 1. Create match via RPC
      const rpcRes = await client.rpc(session, "create_match", {});
      const payload = rpcRes.payload;
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const mId = data.matchId;

      // 2. Join the match
      setStatusMsg("Joining match...");
      const match = await socket.joinMatch(mId);
      setMatchId(match.match_id);
      matchIdRef.current = match.match_id;
      setStatusMsg("Match joined! Waiting for opponent...");

      console.log("Joined match:", match);
    } catch (err) {
      console.error("Error finding match:", err);
      setStatusMsg("Failed to create/join match.");
    }
  };

  const handleMove = (index) => {
    if (!socket || !matchId) return;

    // Send move to backend
    const data = { position: index };
    // OpCode 1 = Move
    socket.sendMatchState(matchId, 1, JSON.stringify(data));
  };

  if (!session) return <div>{statusMsg}</div>;

  return (
    <div className="App">
      <h1>Nakama Tic-Tac-Toe</h1>
      {!matchId ? (
        <div className="menu">
          <p>{statusMsg}</p>
          <button onClick={findMatch} className="start-btn">Create Match</button>
          <p className="hint">To test multiplayer, open this page in a second tab/window and join the same match ID (Logic for joining existing match needs to be added or just copy-paste ID).</p>
          {/* Simple Join by ID input for testing */}
          <JoinById socket={socket} setMatchId={setMatchId} setStatusMsg={setStatusMsg} />
        </div>
      ) : (
        <Game
          board={board}
          onMove={handleMove}
          myTurn={myTurn}
          playerMark={playerMark}
          winner={winner}
        />
      )}
    </div>
  );
}

// Helper component to join by ID
function JoinById({ socket, setMatchId, setStatusMsg }) {
  const [id, setId] = useState("");
  const join = async () => {
    if (!id) return;
    try {
      setStatusMsg("Joining specific match...");
      const match = await socket.joinMatch(id);
      setMatchId(match.match_id);
      setStatusMsg("Joined!");
    } catch (e) {
      console.error(e);
      setStatusMsg("Failed to join: " + e.message);
    }
  };
  return (
    <div style={{ marginTop: 20 }}>
      <input
        placeholder="Or Enter Match ID"
        value={id}
        onChange={e => setId(e.target.value)}
        style={{ padding: 10, marginRight: 10 }}
      />
      <button onClick={join} style={{ padding: 10 }}>Join</button>
    </div>
  );
}

export default App;
