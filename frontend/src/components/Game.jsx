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
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', position: 'relative' }}>

            {/* Header */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', marginTop: '20px' }}>
                <span style={{ fontSize: '1.5rem', color: 'var(--text-grey)' }}>⚙</span>
                <h3 style={{ color: 'var(--text-white)' }}>Tic-Tac-Toe: Uplink</h3>
                <span style={{ fontSize: '1.5rem', opacity: 0 }}>⚙</span>
            </div>

            {/* Turn Indicator */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <span style={{ color: myTurn ? 'var(--primary-cyan)' : 'var(--text-grey)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {myTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
                </span>
            </div>

            {/* Board */}
            <div className="board-grid">
                {board.map((cell, index) => (
                    <button
                        key={index}
                        className={`board-cell ${cell ? cell.toLowerCase() : ''}`}
                        onClick={() => onMove(index)}
                        disabled={!myTurn || cell !== null || winner}
                    >
                        {cell}
                    </button>
                ))}
            </div>

            {/* Players */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '40px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#30363d', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary-purple)' }}>X</div>
                    <span style={{ fontSize: '0.9rem' }}>{getPlayerName('X')}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#30363d', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary-cyan)' }}>O</div>
                    <span style={{ fontSize: '0.9rem' }}>{getPlayerName('O')}</span>
                </div>
            </div>

            {/* Winner Overlay */}
            {winner && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(13, 17, 23, 0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '40px' }}>
                        <span style={{ color: winner === 'X' ? 'var(--primary-purple)' : 'var(--primary-cyan)', textShadow: `0 0 20px ${winner === 'X' ? '#bd00ff' : '#00f0ff'}` }}>
                            {winner === 'draw' ? "DRAW" : winner}
                        </span>
                        <span style={{ color: 'white' }}> is the Winner!</span>
                    </h1>

                    <button className="btn-secondary" onClick={() => window.location.reload()} style={{ marginBottom: '15px' }}>
                        Main Menu
                    </button>

                    <button className="btn-primary" onClick={onReset} style={{ background: 'var(--primary-cyan)', color: 'black' }}>
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game;
