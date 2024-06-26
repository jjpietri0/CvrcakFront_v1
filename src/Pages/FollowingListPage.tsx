import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import DefaultImage from '../Images/profilePicTemplate.png';

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

const FollowingList = () => {
    const [followingList, setFollowingList] = useState<User[]>([]);
    const {id} = useParams();
    const [unfollowStatus] = useState<string | null>(null);


    useEffect(() => {
        console.log(id);
        authFetch(`/cvrcak/user/${id}/following/1`)
            .then(response => response.json())
            .then(data => {
                const updatedData = data.map((user: User) => ({...user, isFollowing: true}));
                setFollowingList(updatedData);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    const followUser = (userId: number, followerId: number) => {
        authFetch(`/cvrcak/user/${userId}/follow/${followerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    setFollowingList(prevList => prevList.map(user => user.userId === followerId ? {
                        ...user,
                        isFollowing: true
                    } : user));
                } else {
                    throw new Error('Follow failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const unfollowUser = (userId: number, followerId: number) => {
        authFetch(`/cvrcak/user/${userId}/unfollow/${followerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    setFollowingList(prevList => prevList.map(user => user.userId === followerId ? {
                        ...user,
                        isFollowing: false
                    } : user));
                } else {
                    throw new Error('Unfollow failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="d-flex" id="wrapper">
            <Sidebar/>
            <div id="page-content-wrapper">
                <Header/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 align-items-center">
                            <h1 className="text-center">Following List</h1>
                            {unfollowStatus && <p>{unfollowStatus}</p>}
                            {followingList.map((user) => (
                                <div key={user.userId}
                                     className="following-user d-flex align-items-center justify-content-between border rounded m-3">
                                    <div className="d-flex align-items-center m-2">
                                        <img src={user.image || DefaultImage} alt="User" className="me-3 rounded-circle"
                                             style={{ width: '70px', height: '70px'}}/>
                                        <div>
                                            <p className="mb-0 h5 fw-bolder">{user.username}</p>
                                            <p className="mb-0"><span
                                                className="fw-bold">Following since:</span> {user.registerDate}</p>
                                        </div>
                                    </div>
                                    <div className="dropdown">
                                        <button className="btn btn-danger me-3"
                                                //ovo promijjeniti kad login bude gotov
                                                onClick={() => user.isFollowing ? unfollowUser(19, user.userId) : followUser(19, user.userId)}>
                                            {user.isFollowing ? 'Unfollow' : 'Follow'}
                                        </button>
                                        <button className="btn btn-secondary dropdown-toggle" type="button"
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

export default FollowingList;