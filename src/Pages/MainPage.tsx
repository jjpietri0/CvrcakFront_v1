import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Post from "../Components/Post";
import '../CSS/MainPage.css';
import {Modal} from "bootstrap";


function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(url, options);
}

const MainPage = () => {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const userID = useRef('');
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        setIsLoading(true);

        authFetch(`/cvrcak/user/${loggedInUsername}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                userID.current = data.userId;
                localStorage.setItem('userID', userID.current);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        const fetchPosts = async () => {
            const response = await authFetch('/cvrcak/post/all');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            data = data.filter((post: any) => post.deleteDate === null);

            if (activeTab === 'Following') {
                const followingResponse = await authFetch(`/cvrcak/user/${userID.current}/following/1`);
                const followingUsers = await followingResponse.json();
                data = data.filter((post: any) => followingUsers.includes(post.userId));
            }

            data.sort((a: any, b: any) => {
                return new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime();
            });
            const slicedPosts = data.slice(0, 5);
            setPosts(slicedPosts);
        };

        fetchPosts().catch(error => {
            console.error('Error:', error);
        }).finally(() => {
            setIsLoading(false);
        });

    }, [loggedInUsername, activeTab]);

    //on scroll load next posts that are not already loaded
    window.onscroll = function(ev: any) {
        if (!isLoading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) { // Modify this line
            setIsLoading(true);
            authFetch('/cvrcak/post/all')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    data = data.filter((post: any) => post.deleteDate === null);
                    data.sort((a: any, b: any) => {
                        return new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime();
                    });
                    data = data.slice(posts.length, posts.length + 5);
                    setPosts(posts.concat(data));
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const handleDisappearTimeCheck = () => {
        const disappearTimeCheck = (document.getElementById('disappearTimeCheck') as HTMLInputElement).checked;
        const disappearTimeDiv = document.getElementById('disappearTimeDiv')!;
        if (disappearTimeCheck) {
            disappearTimeDiv.style.display = 'block';
        } else {
            disappearTimeDiv.style.display = 'none';
        }
    };

    const handleSubmit = () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const content = (document.getElementById('content') as HTMLInputElement).value;
        const image = (document.getElementById('image') as HTMLInputElement).value;
        const isPublic = (document.getElementById('isPublic') as HTMLInputElement).checked;
        const isPermanent = (document.getElementById('isPermanent') as HTMLInputElement).checked;
        const isDeleted = false;
        const disappearTimeCheck = (document.getElementById('disappearTimeCheck') as HTMLInputElement).checked;
        let disappearTime = "";
        if (disappearTimeCheck) {
            disappearTime = (document.getElementById('disappearTime') as HTMLInputElement).value;
        }

        // Check if both content and image are empty
        if (!content && !image) {
            alert('Post must have either content or an image');
            return;
        }

        //ovo je data za osobu koja submita post, privremeno dok ne implementiramo login
        const data = {
            userId: userID.current,
            title,
            content,
            image,
            isPublic,
            isPermanent,
            isDeleted,
            disappearTime
        };

        authFetch('cvrcak/post/newPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Success:', response);
                    const modalElement = document.getElementById('newPostModal');
                    if (modalElement) {
                        const modalInstance = Modal.getInstance(modalElement);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                    }
                    window.location.reload();
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="d-flex" id="wrapper">
            <Sidebar />
            <div id="page-content-wrapper">
                <Header/>

                <button type="button" className="btn btn-primary rounded-circle new-post-button" data-bs-toggle="modal"
                        data-bs-target="#newPostModal">
                    +
                </button>
                <div className="modal fade m-4" id="newPostModal" aria-labelledby="newPostModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="newPostModalLabel">New Post</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form id="newPostForm">
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input type="text" className="form-control" id="title" required/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="content" className="form-label">Content</label>
                                        <textarea className="form-control" id="content" required></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Image URL</label>
                                        <input type="url" className="form-control" id="image" required/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="isPublic">Public</label>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="isPublic"/>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="isPermanent">Permanent</label>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="isPermanent"/>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="disappearTimeCheck">Set Disappear
                                            Time</label>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="disappearTimeCheck"
                                                   onChange={handleDisappearTimeCheck}/>
                                        </div>
                                    </div>
                                    <div id="disappearTimeDiv" style={{display: 'none'}}>
                                        <label htmlFor="disappearTime" className="form-label">Disappear Time</label>
                                        <input type="datetime-local" className="form-control" id="disappearTime"/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Post</button>
                            </div>
                        </div>
                    </div>
                </div>
                {posts.map((post, index) => (
                    <Post key={index} data={post}/>
                ))}
                <button className="btn btn-secondary back-to-top rounded-circle"
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-arrow-up" viewBox="0 0 16 16">
                        <path fillRule="evenodd"
                              d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MainPage;