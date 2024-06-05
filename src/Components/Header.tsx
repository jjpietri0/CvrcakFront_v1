import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profilePic from '../Images/profilePicTemplate.png';

const Header = () => {
    const [activeTab, setActiveTab] = useState('Following');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = () => {
        setIsLoggedIn(false);
    };

    const handleProfileClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between">
                <div className="d-flex justify-content-center offset-md-2 col-6 col-md-6">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"
                           style={{width: '100%'}}/>
                </div>
                <div className="d-flex justify-content-end mr-2">
                    <div className="dropdown">
                        <img src={profilePic} alt="Profile" className="dropdown-toggle" id="dropdownMenuButton"
                             data-bs-toggle="dropdown" aria-expanded="false" onClick={handleProfileClick}/>
                        {isLoggedIn && (
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <button className="dropdown-item" onClick={handleSignOut}>Sign Out</button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
                <div className="navbar-nav mt-3 justify-content-center col-12">
                    <li className={`nav-item col-6 col-md-3 ${activeTab === 'Following' ? 'active' : ''}`}>
                        <a className="nav-link" href="#" onClick={() => setActiveTab('Following')}>Following</a>
                    </li>
                    <li className={`nav-item col-6 col-md-3 ${activeTab === 'Recommended' ? 'active' : ''}`}>
                        <a className="nav-link" href="#" onClick={() => setActiveTab('Recommended')}>Recommended</a>
                    </li>
                </div>
            </nav>
        </div>
    );
};

export default Header;