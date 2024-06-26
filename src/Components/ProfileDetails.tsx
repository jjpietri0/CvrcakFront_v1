import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import DefaultImage from '../Images/profilePicTemplate.png';
import '../CSS/ProfileDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import {Link} from "react-router-dom";

function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(url, options);
}


interface UserData {
    id: number;
    image: string | null;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string | null;
    birthday: string;
}

const ProfileDetails = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        authFetch(`/cvrcak/user/id/${id}`)
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error:', error));
    }, [id]);

    const handleSave = () => {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
        const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const gender = (document.getElementById('gender') as HTMLInputElement).value;
        const birthday = (document.getElementById('birthday') as HTMLInputElement).value;
        const image = (document.getElementById('image') as HTMLInputElement).value;
        const data: any = {
            userId: userData?.id,
            image: userData?.image
        };


        if (username) data.username = username;
        if (firstName) data.firstName = firstName;
        if (lastName) data.lastName = lastName;
        if (email) data.email = email;
        if (gender) data.gender = gender;
        if (birthday) data.birthday = birthday;
        if (image) data.image = image;

        authFetch('/cvrcak/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                console.log(data);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Update failed');
                }
            })
            .then(data => {
                setUserData(data);
                const modal = new bootstrap.Modal(document.getElementById('editProfileModal') as Element);
                modal.hide();
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                setErrorMessage('Error: ' + error.message);
            })
            .finally(() => {
                const modal = new bootstrap.Modal(document.getElementById('editProfileModal') as Element);
                modal.hide();
            });
    };
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card profile-details text-center">
                {userData &&
                    <img src={userData.image || DefaultImage} className="card-img-top mx-auto m-3" alt="User"/>}
                <div className="card-body">
                    <hr/>
                    <div className="mb-3">
                        <div className="btn-group p-3 gap-3" role="group">
                            <Link to={`/user/${id}/posts`} className="btn btn-secondary">View Posts</Link>
                            <Link to={`/user/${id}/following/1`} className="btn btn-secondary">Following List</Link>
                            <Link to={`/user/${id}/followers/1`} className="btn btn-secondary">Followers List</Link>
                        </div>
                    </div>
                    <hr/>
                    <div className="text-center">
                        {userData && <p className="card-title"><span className="fw-bold">Username:</span> <span
                            className="border p-1">{userData.username}</span></p>}
                        {userData && <p className="card-text"><span className="fw-bold">First Name:</span> <span
                            className="border p-1">{userData.firstName}</span></p>}
                        {userData && <p className="card-text"><span className="fw-bold">Last Name:</span> <span
                            className="border p-1">{userData.lastName}</span></p>}
                        {userData && <p className="card-text"><span className="fw-bold">Email:</span> <span
                            className="border p-1">{userData.email}</span></p>}
                        {userData && <p className="card-text"><span className="fw-bold">Gender:</span> <span
                            className="border p-1">{userData.gender || 'Not specified'}</span></p>}
                        {userData && <p className="card-text"><span className="fw-bold">Birthday:</span> <span
                            className="border p-1">{userData.birthday}</span></p>}
                    </div>
                    <hr/>
                    <button type="button" className="btn btn-primary m-2" data-bs-toggle="modal"
                            data-bs-target="#editProfileModal">Edit Profile
                    </button>
                    <button className="btn btn-danger">Delete Account</button>
                </div>
            </div>
            <div className="modal fade" id="editProfileModal" aria-labelledby="editProfileModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editProfileModalLabel">Edit Profile</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="editProfileForm">
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" readOnly className="form-control" id="username" required
                                           defaultValue={userData?.username || ''}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input type="text" className="form-control" id="firstName" required
                                           defaultValue={userData?.firstName || ''}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" id="lastName" required
                                           defaultValue={userData?.lastName || ''}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" required
                                           defaultValue={userData?.email || ''}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select className="form-control" id="gender" required
                                            defaultValue={userData?.gender || ''}>
                                        <option value="">Select gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Image URL</label>
                                    <input type="url" className="form-control" id="image"
                                           defaultValue={userData?.image || ''}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="birthday" className="form-label">Birthday</label>
                                    <input type="date" className="form-control" id="birthday" required
                                           defaultValue={userData?.birthday || ''}/>
                                </div>
                            </form>
                            {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;