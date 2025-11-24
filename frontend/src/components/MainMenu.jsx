import React from 'react';

const MainMenu = ({ onHost, onJoin, onLeaderboard }) => {
    return (
        <div className="main-menu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            <h1 className="text-neon-green" style={{ marginBottom: '40px', textShadow: '0 0 20px #00ff41' }}>
                TIC-TAC-TRON
            </h1>

            <button className="btn-cyber" onClick={onHost}>
                <span style={{ marginRight: '10px' }}>📡</span> Host Game
            </button>

            <button className="btn-cyber" onClick={onJoin}>
                <span style={{ marginRight: '10px' }}>🕸</span> Join Uplink
            </button>

            <button className="btn-cyber" onClick={onLeaderboard}>
                <span style={{ marginRight: '10px' }}>📊</span> Top Hackers
            </button>

            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <span style={{ fontSize: '1.5rem', color: 'var(--neon-green)', cursor: 'pointer' }}>⚙</span>
            </div>
        </div>
    );
};

export default MainMenu;
