import React, {useState} from 'react';
import logo from '../Images/CvrcakLogo.png';
import '../CSS/Components.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sidebar d-flex flex-column flex-shrink-0 p-3 bg-light ${isCollapsed ? 'collapsed' : ''}`}>
            {/*<button onClick={handleToggle}>-</button>*/}
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{width: "280px"}}>
                <a href="/"
                   className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none logo-container" id="logoImgLink">
                    <span className="fs-4"><img src={logo} alt="Logo"/></span>
                </a>
                <hr/>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <a href="/" className="nav-link active" aria-current="page">Home page</a>
                    </li>
                    <li>
                        <a href="/notifications" className="nav-link link-dark">Notifications</a>
                    </li>
                    <li>
                        <a href="/activities" className="nav-link link-dark">Activities</a>
                    </li>
                    <li>
                        <a href="/discussions" className="nav-link link-dark">Discussions</a>
                    </li>
                    <li>
                        <a href="/profile" className="nav-link link-dark">Profile</a>
                    </li>
                    <li>
                        <a href="/settings" className="nav-link link-dark">Settings</a>
                    </li>
                </ul>
                <hr/>
            </div>
        </div>
    );
};

export default Sidebar;