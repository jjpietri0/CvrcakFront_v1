import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/CvrcakLogo.png';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('/cvrcak/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('loggedInUsername', username);
            console.log('Login successful');
            navigate('/');
        } else {
            console.log('Login failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <form className="p-5 border rounded shadow" onSubmit={handleSubmit}>
                <div className="text-center">
                    <img src={logo} alt="Cvrcak Logo" className="mb-4" style={{width: '100px', height: '100px', objectFit: 'contain'}} />
                    <h1>Login</h1>
                </div>
                <div className="form-group">
                    <label htmlFor="text">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
                <Link to="/register" className="d-block text-center mt-3">Register</Link>
            </form>
        </div>
    );
};

export default Login;