import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Post from "../Components/Post";
import '../CSS/MainPage.css';


function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(url, options);
}

const UserPostsPage = () => {
    const [posts, setPosts] = useState([]);
    const {id} = useParams();



    useEffect(() => {
        authFetch(`/cvrcak/user/${id}/posts`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setPosts(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [id]);

    return (
        <div className="d-flex" id="wrapper">
            <Sidebar/>
            <div id="page-content-wrapper">
                <Header/>
                {posts.map((post, index) => (
                    <Post key={index} data={post}/>
                ))}
            </div>
        </div>
    );
};

export default UserPostsPage;