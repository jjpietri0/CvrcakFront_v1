import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage'; // Import the MainPage component
import Login from './Pages/LoginPage';
import Register from './Pages/RegisterPage';
import Profile from './Pages/ProfilePage';
import FollowingList from './Pages/FollowingListPage';
import FollowersList from "./Pages/FollowersListPage";
import UserPostsPage from "./Pages/UserPostsPage";

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/cvrcak" element={<MainPage/>}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/user/:id/following/:page" element={<FollowingList/>}/>
                    <Route path="/user/:id/followers/:page" element={<FollowersList/>}/>
                    <Route path="/user/:id/posts" element={< UserPostsPage/>}/>
                    <Route path="*" element={<h1>Not Found</h1>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;