import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState('');
    const [image, setImage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('http://localhost:8080/cvrcak/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 0,
                username,
                firstName,
                lastName,
                password,
                email,
                country,
                gender,
                birthday,
                image
            })
        });
        if (response.ok) {
            navigate('/login');
        } else {
            console.error('Error:', response.statusText);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center m-4">
                <div className="col-md-6">
                    <div className="card">
                        <h1 className="text-center mb-4">Register</h1>
                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="gender">Gender</label>
                                <input
                                    type="text"
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="birthday">Birthday</label>
                                <input
                                    type="date"
                                    id="birthday"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 text-center">
                                <label htmlFor="image">Image URL</label>
                                <input
                                    type="text"
                                    id="image"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>
                        </form>
                        <div className="d-grid mt-3">
                            <button onClick={() => navigate('/login')} className="btn btn-link">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;