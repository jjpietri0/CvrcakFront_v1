import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import ProfileDetails from '../Components/ProfileDetails';

const Profile = () => {
    return (
        <div className="d-flex" id="wrapper">
            <Sidebar/>
            <div id="page-content-wrapper">
                <Header/>
                <ProfileDetails/>
            </div>
        </div>
    );
};

export default Profile;