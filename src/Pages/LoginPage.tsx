import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/CvrcakLogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <form className="p-5 border rounded shadow" onSubmit={handleSubmit}>
                <div className="text-center">
                    <img src={logo} alt="Cvrcak Logo" className="mb-4" style={{width: '100px', height: '100px', objectFit: 'contain'}} />
                    <h1>Login</h1>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email/Username</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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