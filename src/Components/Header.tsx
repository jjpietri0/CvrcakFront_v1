import React, {ChangeEvent, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import defaultProfileImage from '../Images/profilePicTemplate.png';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface User {
    username: string;
}

interface Post {
    title: string;
}

const Header = () => {
    const [profileImage, setProfileImage] = useState('');
    const [activeTab, setActiveTab] = useState('Following');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userResults, setUserResults] = useState<User[]>([]);
    const [postResults, setPostResults] = useState<Post[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const handleProfileLinkClick = (event: React.MouseEvent) => {
        event.preventDefault();
        navigate(`/user/${localStorage.getItem('userID')}`);
    };
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('loggedInUsername');
        setIsLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem('loggedInUsername');

        if (!token || !username) {
            navigate('/login');
        } else {
            axios.get(`/cvrcak/user/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.data.image && response.data.image.trim() !== '') {
                        setProfileImage(response.data.image);
                    } else {
                        setProfileImage(defaultProfileImage);
                    }
                    setIsLoggedIn(true);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [navigate]);

    const handleProfileClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) {
            setUserResults([]);
            setPostResults([]);
            setShowDropdown(false);
            return;
        }
        const userResults = await axios.get(`/cvrcak/user/${searchQuery}`);
        const postResults = await axios.get(`/cvrcak/post/title/${searchQuery}`);
        if (!userResults.data && postResults.data.length === 0) {
            setUserResults([]);
            setPostResults([]);
            setShowDropdown(false);
        } else {
            if (userResults.data) {
                setUserResults([userResults.data]);
            } else {
                setUserResults([]);
            }
            setPostResults(postResults.data);
            setShowDropdown(true);
        }
    };

    const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
            setShowDropdown(true);
        }
    };
    const closeDropdown = () => {
        setShowDropdown(false);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between me-2">
                <div className="d-flex justify-content-center offset-md-2 col-6 col-md-6 position-relative">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"
                           style={{width: '85%'}} onChange={handleSearchInput} onKeyPress={handleKeyPress}/>
                    {showDropdown && (
                        <div className="dropdown show position-absolute start-0">
                            <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                                {userResults.length > 0 && <h6 className="dropdown-header">Users</h6>}
                                {userResults.map((user, index) => (
                                    <a key={index} className="dropdown-item" href="#"
                                       onClick={closeDropdown}>{user.username}</a>
                                ))}
                                {postResults.length > 0 && <h6 className="dropdown-header">Posts</h6>}
                                {postResults.map((post, index) => (
                                    <a key={index} className="dropdown-item" href="#"
                                       onClick={closeDropdown}>{post.title}</a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="d-flex justify-content-end mr-2">
                    <div className="dropdown">
                        <img src={profileImage} alt="Profile" className="dropdown-toggle rounded-circle"
                             id="dropdownMenuButton"
                             data-bs-toggle="dropdown" aria-expanded="false" onClick={handleProfileClick}
                             style={{width: '60px', height: '60px'}}/>
                        {isLoggedIn && (
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <a className="dropdown-header pe-1">Logged in as:</a>
                                    <a className="dropdown-item fw-bold h5">{localStorage.getItem('loggedInUsername')}</a>
                                </li>
                                <div className="dropdown-divider"/>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={handleProfileLinkClick}> My Profile</a>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={handleSignOut}>Sign Out</button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
            {location.pathname === '/' && (
                <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
                    <div className="navbar-nav mt-3 justify-content-center">
                        <li className={`nav-item col-12 ${activeTab === 'Following' ? 'active' : ''}`}>
                            <a className="nav-link" href="#" onClick={() => setActiveTab('Following')}>Following</a>
                        </li>
                        <li className={`nav-item col-12 ${activeTab === 'Recommended' ? 'active' : ''}`}>
                            <a className="nav-link" href="#" onClick={() => setActiveTab('Recommended')}>Recommended</a>
                        </li>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Header;