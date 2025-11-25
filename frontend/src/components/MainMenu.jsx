import React from 'react';

const MainMenu = ({ onHost, onJoin, onLeaderboard }) => {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', marginTop: '20px' }}>
                <div className="icon-circle" style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--primary-cyan)' }}>
                    <span>▦</span>
                </div>
                <h2 style={{ fontSize: '1.2rem' }}>Tic-Tac-Toe: Uplink</h2>
                <div className="icon-circle" style={{ cursor: 'pointer' }}>
                    <span>⚙</span>
                </div>
            </div>

            {/* Menu Buttons */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <button className="btn-menu host" onClick={onHost}>
                    <div className="icon-circle" style={{ background: 'rgba(0, 240, 255, 0.2)', color: 'var(--primary-cyan)', width: '30px', height: '30px', fontSize: '1rem' }}>+</div>
                    Host Game
                </button>

                <button className="btn-menu join" onClick={onJoin}>
                    <div className="icon-circle" style={{ background: 'rgba(0, 255, 65, 0.2)', color: 'var(--primary-green)', width: '30px', height: '30px', fontSize: '1rem' }}>🔗</div>
                    Join Uplink
                </button>

                <button className="btn-menu rank" onClick={onLeaderboard}>
                    <div className="icon-circle" style={{ background: 'rgba(189, 0, 255, 0.2)', color: 'var(--primary-purple)', width: '30px', height: '30px', fontSize: '1rem' }}>🏆</div>
                    Top Hackers
                </button>
            </div>
        </div>
    );
};

export default MainMenu;
