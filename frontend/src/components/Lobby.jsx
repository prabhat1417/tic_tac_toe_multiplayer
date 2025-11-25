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
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: '40px', marginTop: '20px' }}>
                    <span onClick={onCancel} style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-grey)' }}>✕</span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>YOUR GAME CODE</h2>

                    {/* Code Display - Simulating the boxes style with a single container for UUID */}
                    <div style={{
                        background: 'rgba(47, 128, 237, 0.1)',
                        border: '1px solid var(--primary-blue)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '20px',
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                        color: 'var(--primary-blue)'
                    }}>
                        {matchId || "Loading..."}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--primary-purple)' }}>
                        <span style={{ width: '8px', height: '8px', background: 'var(--primary-purple)', borderRadius: '50%' }}></span>
                        <span>Scanning for players...</span>
                    </div>
                    <p style={{ color: 'var(--text-grey)', marginTop: '10px', fontSize: '0.9rem' }}>Share this code with a friend to start.</p>
                </div>

                {/* Player List */}
                <div style={{ marginBottom: 'auto' }}>
                    <div className="rank-item">
                        <div className="icon-circle" style={{ background: '#30363d', marginRight: '15px' }}>👤</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>You</div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 'bold' }}>HOST</span>
                    </div>

                    <div className="rank-item" style={{ opacity: 0.5 }}>
                        <div className="icon-circle" style={{ background: '#30363d', marginRight: '15px' }}>?</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>Waiting...</div>
                        </div>
                    </div>
                </div>

                <button className="btn-primary" onClick={copyCode} style={{ background: 'var(--primary-blue)' }}>
                    Share Code
                </button>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '40px', marginTop: '20px' }}>
                <span onClick={onCancel} style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-grey)' }}>✕</span>
            </div>

            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>JOIN GAME</h2>

            <form onSubmit={handleJoin} style={{ width: '100%' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Game Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    style={{ marginBottom: '20px', textAlign: 'center', letterSpacing: '1px' }}
                />

                <button type="submit" className="btn-primary">
                    Connect
                </button>
            </form>
        </div>
    );
};

export default Lobby;
