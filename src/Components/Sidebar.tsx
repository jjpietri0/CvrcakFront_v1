import React from 'react';
import logo from '../Images/CvrcakLogo.png';
import {useLocation, useNavigate} from 'react-router-dom';
import '../CSS/Components.css';

const Sidebar = () => {
    const location = useLocation();
    const history = useNavigate();

    const navigateToProfile = () => {
        const userId = localStorage.getItem('userID');
        if (userId) {
            history(`/user/${userId}`);
        }
    };

    return (
        <div className={`sidebar d-flex flex-column flex-shrink-0 p-3 bg-light : ''}`}>
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-light " style={{width: "280px"}}>
                <div>
                    <a href="/cvrcak"
                       className="d-flex mb-3 mb-md-0 me-md-auto link-dark text-decoration-none logo-container"
                       id="logoImgLink">
                        <span className="fs-4"><img src={logo} alt="Logo"/></span>
                    </a>
                </div>

                <hr/>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li>
                        <a href="/cvrcak"
                           className={`nav-link link-dark ${location.pathname === '/' ? 'active' : ''}`}>Home page</a>
                    </li>
                    <li>
                        <a onClick={() => history(`/timeline/${localStorage.getItem('userID')}`)}
                           className={`nav-link link-dark ${location.pathname.includes(`/timeline`) ? 'active' : ''}`}
                           style={{cursor: 'pointer'}}>
                            Timelines
                        </a>
                    </li>
                    {/*<li>*/}
                    {/*    <a href="/cvrcak/activities"*/}
                    {/*       className={`nav-link link-dark ${location.pathname === '/activities' ? 'active' : ''}`}>Activities</a>*/}
                    {/*</li>*/}
                    <li>
                        <a href="/cvrcak/messages"
                           className={`nav-link link-dark ${location.pathname === '/messages' ? 'active' : ''}`}>Messages</a>
                    </li>
                    <li>
                        <a href="/cvrcak/discussions"
                           className={`nav-link link-dark ${location.pathname === '/discussions' ? 'active' : ''}`}>Discussions</a>
                    </li>
                    <li>
                        <a onClick={navigateToProfile}
                           className={`nav-link link-dark ${location.pathname.startsWith('/user') ? 'active' : ''}`}
                           style={{cursor: 'pointer'}}>My Profile</a>
                    </li>
                </ul>
                <hr/>
            </div>
        </div>
    );
};

export default Sidebar;