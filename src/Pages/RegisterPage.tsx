import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/CvrcakLogo.png';
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

        const genderValue = gender === 'Male' ? 'M' : 'F';

        const response = await fetch('/cvrcak/auth/register', {
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
                gender: genderValue, // Use the converted gender value
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
        <div className="d-flex justify-content-center align-items-center vh-100">
            <form className="p-5 border rounded shadow" onSubmit={handleSubmit}>
                <div className="text-center">
                    <img src={logo} alt="Cvrcak Logo" className="mb-4"
                         style={{width: '100px', height: '100px', objectFit: 'contain'}}/>
                    <h1>Register</h1>
                </div>
                <div className="form-group mb-3 text-center">
                    <label htmlFor="username" className="fw-bold">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="row">
                    <div className="form-group mb-3 col-md-6">
                        <label htmlFor="firstName" className="fw-bold">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group mb-3 col-md-6">
                        <label htmlFor="lastName" className="fw-bold">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                </div>

                <div className="form-group mb-3 text-center">
                    <label htmlFor="email" className="fw-bold">Email</label>
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
                    <label htmlFor="country" className="fw-bold">Country</label>
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
                    <label htmlFor="password" className="fw-bold">Password</label>
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
                    <label htmlFor="gender" className="fw-bold">Gender: </label>
                    <div className="btn-group" role="group" aria-label="Gender">
                        <input type="radio" className="btn-check" name="gender" id="male" autoComplete="off"
                               checked={gender === 'Male'}
                               onChange={() => setGender('Male')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="male">Male</label>

                        <input type="radio" className="btn-check" name="gender" id="female" autoComplete="off"
                               checked={gender === 'Female'}
                               onChange={() => setGender('Female')}
                        />
                        <label className="btn btn-outline-primary" htmlFor="female">Female</label>
                    </div>
                </div>
                <div className="form-group mb-3 text-center">
                    <label htmlFor="birthday" className="bold-label">Birthday</label>
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
                    <label htmlFor="image" className="bold-label">Image URL</label>
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
                <div className="d-grid mt-3">
                    <button onClick={() => navigate('/login')} className="btn btn-link">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Register;