import React from 'react';

const Game = ({ board, players, myId, onMove, myTurn, playerMark, winner, onReset }) => {
    // Helper to get player name by mark
    const getPlayerName = (mark) => {
        if (!players) return "Unknown";
        const p = Object.values(players).find(p => p.mark === mark);
        if (!p) return "Waiting...";
        return p.userId === myId ? `${p.username} (You)` : p.username;
    };

    return (
        <div className="game-screen" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', color: 'var(--neon-green)' }}>⚙</span>
                <h2 className="text-neon-pink" style={{ margin: 0, letterSpacing: '2px' }}>CYBER TAC TOE</h2>
                <span className="text-neon-green" style={{ fontSize: '1.2rem', border: '1px solid var(--neon-green)', padding: '2px 8px', borderRadius: '4px' }}>00:21</span>
            </div>

            <h1 className="text-neon-pink" style={{
                fontSize: '2rem',
                marginBottom: '30px',
                textShadow: '0 0 10px var(--neon-pink)',
                visibility: winner ? 'hidden' : 'visible'
            }}>
                {myTurn ? `YOUR TURN` : "OPPONENT'S TURN"}
            </h1>

            {winner && (
                <h1 className="text-neon-green" style={{ fontSize: '2rem', marginBottom: '30px', textShadow: '0 0 10px var(--neon-green)' }}>
                    {winner === 'draw' ? "SYSTEM DRAW" : `WINNER: ${winner}`}
                </h1>
            )}

            <div className="board" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 100px)',
                gridTemplateRows: 'repeat(3, 100px)',
                gap: '10px',
                marginBottom: '40px'
            }}>
                {board.map((cell, index) => (
                    <button
                        key={index}
                        className={`square ${cell ? 'taken' : ''}`}
                        onClick={() => onMove(index)}
                        disabled={!myTurn || cell !== null || winner}
                        style={{
                            width: '100px', height: '100px',
                            background: 'transparent',
                            border: '2px solid var(--neon-green)',
                            borderRadius: '4px',
                            fontSize: '4rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 5px var(--neon-green), inset 0 0 5px var(--neon-green)',
                            cursor: myTurn && !cell && !winner ? 'pointer' : 'default',
                            color: cell === 'O' ? 'var(--neon-green)' : 'var(--neon-pink)',
                            textShadow: cell === 'O' ? '0 0 10px var(--neon-green)' : '0 0 10px var(--neon-pink)',
                        }}
                    >
                        {cell}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '350px', marginBottom: '30px' }}>
                <div style={{
                    border: '2px solid var(--neon-pink)',
                    borderRadius: '8px',
                    padding: '10px',
                    width: '45%',
                    textAlign: 'center',
                    boxShadow: '0 0 10px var(--neon-pink)'
                }}>
                    <p className="text-neon-pink" style={{ margin: '0 0 5px 0', fontSize: '0.8rem' }}>PLAYER X</p>
                    <p style={{ margin: 0, fontSize: '1.2rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getPlayerName('X')}
                    </p>
                </div>

                <div style={{
                    border: '2px solid var(--neon-green)',
                    borderRadius: '8px',
                    padding: '10px',
                    width: '45%',
                    textAlign: 'center',
                    boxShadow: '0 0 10px var(--neon-green)'
                }}>
                    <p className="text-neon-green" style={{ margin: '0 0 5px 0', fontSize: '0.8rem' }}>PLAYER O</p>
                    <p style={{ margin: 0, fontSize: '1.2rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getPlayerName('O')}
                    </p>
                </div>
            </div>

            <button className="btn-cyber" onClick={onReset} style={{ width: '100%', maxWidth: '350px' }}>
                ↻ Reset Game
            </button>
        </div>
    );
};

export default Game;
