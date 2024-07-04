import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import Login from './Pages/LoginPage';
import Register from './Pages/RegisterPage';
import Profile from './Pages/ProfilePage';
import FollowingList from './Pages/FollowingListPage';
import FollowersList from "./Pages/FollowersListPage";
import UserPostsPage from "./Pages/UserPostsPage";
import MessagesPage from "./Pages/MessagesPage";
import ProfilePage from "./Pages/ProfilePage";
import DiscussionsPage from "./Pages/DiscussionsPage";
import TimelinesPage from "./Pages/TimelinesPage";

const App = () => {
    return (
        <Router basename="/cvrcak">
            <div>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/user/:id" element={<ProfilePage/>} />
                    <Route path="/user/:id/following/:page" element={<FollowingList/>}/>
                    <Route path="/messages" element={<MessagesPage/>}/>
                    <Route path="/user/:id/followers/:page" element={<FollowersList/>}/>
                    <Route path="/discussions" element={< DiscussionsPage/>}/>
                    <Route path="/user/:id/posts" element={< UserPostsPage/>}/>
                    <Route path="/timeline/:id" element={<TimelinesPage/>}/>
                    <Route path="*" element={<h1>Not Found</h1>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;