import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Post from "../Components/Post";
import '../CSS/MainPage.css';
import {Modal} from "bootstrap";

const MainPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/cvrcak/post/all')
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

        const data = {
            userId: 21, //privremeno dok ne implementiramo login
            title,
            content,
            image,
            isPublic,
            isPermanent,
            isDeleted,
            disappearTime
        };

        fetch('cvrcak/post/newPost', {
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
                <Header />

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
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form id="newPostForm">
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input type="text" className="form-control" id="title" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="content" className="form-label">Content</label>
                                        <textarea className="form-control" id="content" required></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Image URL</label>
                                        <input type="url" className="form-control" id="image" required />
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
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                {posts.map((post, index) => (
                    <Post key={index} data={post} />
                ))}
            </div>
        </div>
    );
};

export default MainPage;