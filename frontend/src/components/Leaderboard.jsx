import React, { useEffect, useState } from 'react';
import { client } from '../nakama';

const Leaderboard = ({ session, onBack }) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!session) return;
            try {
                const result = await client.listLeaderboardRecords(session, 'tictactoe_wins', null, 10);
                setRecords(result.records || []);
            } catch (e) {
                console.error("Error fetching leaderboard:", e);
            }
        };
        fetchLeaderboard();
    }, [session]);

    const calculateWinRate = (wins, played) => {
        if (!played || played === 0) return "0%";
        return Math.round((wins / played) * 100) + "%";
    };

    return (
        <div className="leaderboard-screen" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '20px' }}>✕</span>
                <h2 className="text-neon-pink" style={{ margin: 0, flex: 1, textAlign: 'center', letterSpacing: '2px' }}>RANKINGS</h2>
                <span style={{ width: '40px' }}></span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid var(--neon-pink)', paddingBottom: '10px', marginBottom: '20px' }}>
                <span className="text-neon-pink" style={{ fontWeight: 'bold' }}>Global</span>
            </div>

            <div className="records-list">
                <div style={{ display: 'flex', color: '#888', marginBottom: '10px', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    <span style={{ width: '30px' }}>#</span>
                    <span style={{ flex: 1 }}>PLAYER</span>
                    <span style={{ width: '40px', textAlign: 'center' }}>P</span>
                    <span style={{ width: '40px', textAlign: 'center' }}>W</span>
                    <span style={{ width: '40px', textAlign: 'center' }}>L</span>
                    <span style={{ width: '40px', textAlign: 'center' }}>D</span>
                    <span style={{ width: '50px', textAlign: 'right' }}>WIN%</span>
                </div>

                {records.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>No records yet...</div>
                ) : (
                    records.map((record, index) => {
                        // New Logic:
                        // Score = Wins
                        // Subscore = Draws
                        // NumScore = Played

                        const wins = record.score || 0;
                        const draws = record.subscore || 0;
                        const played = record.num_score || 0;

                        // Losses = Played - Wins - Draws
                        // Ensure non-negative (just in case of sync issues, though unlikely)
                        const losses = Math.max(0, played - wins - draws);

                        return (
                            <div key={record.owner_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', fontSize: '0.9rem', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                                <span className="text-neon-pink" style={{ width: '30px', fontWeight: 'bold' }}>{record.rank}</span>
                                <span className="text-neon-green" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '10px' }}>{record.username || "Unknown"}</span>
                                <span style={{ width: '40px', textAlign: 'center' }}>{played}</span>
                                <span style={{ width: '40px', textAlign: 'center', color: 'var(--neon-green)' }}>{wins}</span>
                                <span style={{ width: '40px', textAlign: 'center', color: 'var(--neon-pink)' }}>{losses}</span>
                                <span style={{ width: '40px', textAlign: 'center', color: '#aaa' }}>{draws}</span>
                                <span style={{ width: '50px', textAlign: 'right' }}>{calculateWinRate(wins, played)}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
