import React, { useState } from 'react';

const Lobby = ({ mode, matchId, onJoinMatch, onCancel }) => {
    const [roomCode, setRoomCode] = useState('');

    const handleJoin = (e) => {
        e.preventDefault();
        if (roomCode.trim()) {
            onJoinMatch(roomCode);
        }
    };

    const copyCode = () => {
        if (matchId) {
            navigator.clipboard.writeText(matchId);
            alert("Code copied!");
        }
    };

    if (mode === 'host') {
        return (
            <div className="lobby-screen" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <span onClick={onCancel} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>✕</span>
                    <h2 style={{ margin: 0 }}>HOSTING GAME</h2>
                    <span style={{ width: '24px' }}></span>
                </div>

                <p style={{ color: '#888', letterSpacing: '2px', marginBottom: '10px' }}>ROOM CODE</p>
                <h1 className="text-neon-green" style={{ fontSize: '2rem', margin: '0 0 30px 0', letterSpacing: '2px', wordBreak: 'break-all', maxWidth: '90%' }}>
                    {matchId || "WAITING..."}
                </h1>

                <button className="btn-cyber green" onClick={copyCode} style={{ marginBottom: '40px', padding: '10px 20px', fontSize: '1rem' }}>
                    📋 Copy Code
                </button>

                <div style={{
                    border: '1px solid var(--neon-pink)',
                    padding: '15px',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center',
                    boxShadow: '0 0 10px var(--neon-pink)',
                    marginBottom: '40px'
                }}>
                    <p className="text-neon-pink" style={{ margin: 0, letterSpacing: '1px' }}>SCANNING FOR PLAYERS...</p>
                </div>

                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{
                            width: '50px', height: '50px',
                            borderRadius: '50%',
                            border: '2px solid var(--neon-green)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 10px var(--neon-green)',
                            marginRight: '15px'
                        }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--neon-green)' }}></div>
                        </div>
                        <span style={{ fontSize: '1.2rem' }}>Player 1 (You)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                        <div style={{
                            width: '50px', height: '50px',
                            borderRadius: '50%',
                            border: '2px solid #555',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginRight: '15px'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>?</span>
                        </div>
                        <span style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>Waiting for opponent...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lobby-screen" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <span onClick={onCancel} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>✕</span>
                <h2 style={{ margin: 0 }}>JOIN UPLINK</h2>
                <span style={{ width: '24px' }}></span>
            </div>

            <form onSubmit={handleJoin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                    type="text"
                    className="input-cyber"
                    placeholder="ENTER ROOM CODE"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '2px' }}
                />

                <button type="submit" className="btn-cyber">
                    CONNECT
                </button>
            </form>
        </div>
    );
};

export default Lobby;
