import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Post from "../Components/Post";
import '../CSS/MainPage.css';

const UserPostsPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/cvrcak/user/18/posts')
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
    }, []);

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