import React, { useEffect, useState } from 'react';
import { client } from '../nakama';

const Leaderboard = ({ session, onBack }) => {
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('monthly');

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

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-grey)' }}>✕</span>
                <h2 style={{ fontSize: '1.2rem' }}>Rankings</h2>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-grey)' }}>🔍</span>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #30363d' }}>
                <div className={`leaderboard-tab ${activeTab === 'weekly' ? 'active' : ''}`} onClick={() => setActiveTab('weekly')}>Weekly</div>
                <div className={`leaderboard-tab ${activeTab === 'monthly' ? 'active' : ''}`} onClick={() => setActiveTab('monthly')}>Monthly</div>
                <div className={`leaderboard-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All-Time</div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {records.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-grey)' }}>No records yet...</div>
                ) : (
                    records.map((record, index) => {
                        const wins = record.score || 0;
                        const rank = index + 1;
                        let badge = null;
                        if (rank === 1) badge = '🥇';
                        if (rank === 2) badge = '🥈';
                        if (rank === 3) badge = '🥉';

                        return (
                            <div key={record.owner_id} className="rank-item" style={{ border: rank === 1 ? '1px solid var(--primary-blue)' : 'none' }}>
                                <span style={{ width: '30px', fontWeight: 'bold', color: rank <= 3 ? 'var(--primary-cyan)' : 'var(--text-grey)' }}>{rank}</span>

                                <div className="icon-circle" style={{ background: '#30363d', marginRight: '15px', width: '40px', height: '40px', fontSize: '1rem' }}>
                                    {record.username ? record.username[0].toUpperCase() : '?'}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>{record.username || "Unknown"}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-grey)' }}>Wins: {wins}</div>
                                </div>

                                {badge && <span className="rank-badge">{badge}</span>}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Current User (Placeholder for now as we don't fetch self rank separately yet) */}
            <div style={{
                marginTop: 'auto',
                padding: '15px',
                background: 'rgba(189, 0, 255, 0.1)',
                border: '1px solid var(--primary-purple)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="icon-circle" style={{ background: 'var(--primary-purple)', color: 'white', marginRight: '15px', width: '40px', height: '40px', fontSize: '1rem' }}>
                    Y
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>You</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-grey)' }}>Wins: ?</div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
