import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import DefaultImage from '../Images/profilePicTemplate.png';
import {Link, useParams} from "react-router-dom";

function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(url, options);
}

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    password: string | null;
    email: string;
    country: string | null;
    gender: string | null;
    birthday: string;
    image: string | null;
    registerDate: string;
    isDeleted: string | null;
    followers: string | null;
    following: string | null;
    posts: string | null;
    conversations: string | null;
    activityId: string | null;
    isFollowing: boolean;
}

const FollowersList = () => {
    const [followersList, setFollowingList] = useState<User[]>([]);
    const [unfollowStatus] = useState<string | null>(null);
    const {id} = useParams();

    useEffect(() => {
        authFetch(`/cvrcak/user/${id}/followers/1`)
            .then(response => response.json())
            .then(data => {
                const updatedData = data.map((user: User) => {
                    return {...user, isFollowing: true};
                });
                setFollowingList(updatedData);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    return (
        <div className="d-flex" id="wrapper">
            <Sidebar/>
            <div id="page-content-wrapper">
                <Header/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 align-items-center">
                            <h1 className="text-center">Followers List</h1>
                            {unfollowStatus && <p>{unfollowStatus}</p>}
                            {followersList.map((user) => (
                                <div key={user.userId}
                                     className="following-user d-flex align-items-center justify-content-between border rounded m-3">
                                    <div className="d-flex align-items-center m-2">
                                        <img style={{width: '70px', height: '70px'}} src={user.image || DefaultImage} alt="User" className="me-3 rounded-circle"/>
                                        <div>
                                            <p className="mb-0 h5 fw-bolder">
                                                <Link className="text-decoration-none text-reset fw-bold"
                                                      to={`/user/${user.userId}`}>{user.username}</Link>
                                            </p>
                                            <p className="mb-0"><span className="fw-bold">Date
                                                followed:</span> {user.registerDate}</p>
                                        </div>
                                    </div>
                                    <div className="dropdown">
                                        <button className="btn btn-secondary dropdown-toggle m-2" type="button"
                                                id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                            ...
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <li><a className="dropdown-item" href="#">Block</a></li>
                                            <li><a className="dropdown-item" href="#">Report</a></li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FollowersList;