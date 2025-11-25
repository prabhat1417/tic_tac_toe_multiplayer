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
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Tic Tac Toe</h1>
            <p style={{ color: 'var(--text-grey)', marginBottom: '40px' }}>Choose your Codename</p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Codename"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />

                <button type="submit" className="btn-primary">
                    Enter
                </button>
            </form>

            <div className="divider">Or</div>

            <button className="btn-secondary" style={{ marginBottom: '15px' }} onClick={() => alert("Social login coming soon!")}>
                <span style={{ fontSize: '1.2rem' }}>G</span> Sign in with Google
            </button>

            <button className="btn-secondary" onClick={() => alert("Social login coming soon!")}>
                <span style={{ fontSize: '1.2rem' }}></span> Sign in with Apple
            </button>
        </div>
    );
};

export default Login;
