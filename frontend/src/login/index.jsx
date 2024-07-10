// Login.jsx
import React, { useState } from 'react';
import { Login } from '../../wailsjs/go/main/App';
import "./index.css"

const LoginComponent = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        const creds = {username, password};
        try {
            const response = await Login(creds)
            if (response) {
                onLogin();
            } else {
                setError('Invalid username or password');
            }
        } catch {
            console.error("failed to login", error)
        }
    };

    return (
        <div className="login-container">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default LoginComponent;
