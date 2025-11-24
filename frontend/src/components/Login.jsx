import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username);
        }
    };

    return (
        <div className="login-screen" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center'
        }}>
            <h1 className="text-neon-pink" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                NEON-TAC-TOE
            </h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <label className="text-neon-green" style={{ marginBottom: '10px', alignSelf: 'center', letterSpacing: '2px' }}>
                    CODENAME
                </label>
                <input
                    type="text"
                    className="input-cyber"
                    placeholder="Enter your codename"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <button type="submit" className="btn-cyber">
                    ENTER THE MATRIX
                </button>
            </form>

            <div style={{ marginTop: '50px', color: '#666' }}>
                <span style={{ margin: '0 10px' }}>⚙</span>
                <span style={{ margin: '0 10px' }}>ℹ</span>
                <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>v1.0.0</p>
            </div>
        </div>
    );
};

export default Login;
