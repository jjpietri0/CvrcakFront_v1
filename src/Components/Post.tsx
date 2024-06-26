import React, { } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/CvrcakLogo.png';
import  likeIcon from '../Images/likeIcon.png';
import  commentIcon from '../Images/commentIcon.png';
import '../CSS/Post.css';
import {Modal} from "bootstrap";
import CommentsModal from "./CommentsModal";


function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(url, options);
}


class Post extends React.Component<{ data: any }, {
    username: string,
    modalImage: string,
    modalId: string,
    likesCount: number,
    commentsCount: number,
    comments: any[]
    isLoadingComments: boolean
    remainingTime: number

}> {
    timerId: NodeJS.Timeout | null = null;

    constructor(props: { data: any }) {
        super(props);
        let remainingTime = Infinity;
        if (props.data.disappearTime) {
            const disappearDate = new Date(props.data.disappearTime);
            const now = new Date();
            remainingTime = Math.max(Math.floor((disappearDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), 0);
        }
        this.state = {
            username: '',
            modalImage: '',
            modalId: `imageModal-${props.data.postId}`,
            likesCount: 0,
            commentsCount: 0,
            comments: [],
            isLoadingComments: false,
            remainingTime: remainingTime
        };
    }

    handleImageClick = (imageUrl: string) => this.setState({modalImage: imageUrl});

    componentDidMount() {
        const { data } = this.props;
        console.log(data.userId);
        authFetch(`cvrcak/user/id/${data.userId}`)
            .then(response => response.json())
            .then(data => this.setState({ username: data.username }))
            .catch(error => console.error('Error:', error));

        authFetch(`/cvrcak/post/likesCount/${data.postId}`)
            .then(response => response.json())
            .then(data => this.setState({likesCount: data}))
            .catch(error => console.error('Error:', error));
        authFetch(`/cvrcak/post/commentsCount/${data.postId}`)
            .then(response => response.json())
            .then(data => this.setState({commentsCount: data}))
            .catch(error => console.error('Error:', error));

        this.timerId = setInterval(() => {
            this.setState((prevState) => ({
                remainingTime: Math.max(prevState.remainingTime - 1, 0)
            }));
        }, 1000 * 60 * 60 * 24);
    }

    componentWillUnmount() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }
    handleCommentClick = () => {
        const { data } = this.props;
        this.setState({ isLoadingComments: true });
        authFetch(`/cvrcak/post/comments/${data.postId}`)
            .then(response => response.json())
            .then(comments => {
                return Promise.all(comments.map((comment: any) =>
                    authFetch(`cvrcak/user/id/${comment.userId}`)
                        .then(response => response.json())
                        .then(user => ({...comment, username: user.username}))
                ));
            })
            .then(commentsWithUsernames => this.setState({comments: commentsWithUsernames, isLoadingComments: false}))
            .catch(error => {
                console.error('Error:', error);
                this.setState({ isLoadingComments: false });
            });

        const modalElement = document.getElementById(`commentsModal-${this.props.data.postId}`);
        if (modalElement) {
            const modalInstance = new Modal(modalElement);
            modalInstance.show();
        }
    };
    handleDelete = () => {
        authFetch(`/cvrcak/post/delete/${this.props.data.postId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    console.log('Post deleted');
                    window.location.reload();
                } else {
                    console.error('Error:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    render() {
        const currentUserId = localStorage.getItem('userID');
        let {data} = this.props;
        if (data.deleteDate != null || this.state.remainingTime <= 0) {
            return null;
        }
        return (
            <div className="container w-50">
                <div className="card mt-3">
                    {data.disappearTime && this.state.remainingTime !== Infinity && (
                        <div className="alert alert-danger mb-0" role="alert">Post below will disappear in {this.state.remainingTime} days</div>
                    )}
                    <div className="card-header d-flex justify-content-between">
                        <div>
                            <img src={logo} alt="User profile" className="rounded-circle me-2"
                                 style={{width: "30px", height: "30px"}}/>
                            <Link to={`/user/${data.userId}`} className="text-decoration-none text-reset fw-bold">{this.state.username}</Link>
                            <h6 className="mt-3">{data.title}</h6>

                        </div>
                        <div className="d-flex align-items-center">
                            {data.updateDate && <span>Edited: {new Date(data.updateDate).toLocaleDateString()}</span>}
                            <div className="dropdown me-2">
                                <button className="btn btn-secondary dropdown-toggle no-arrow" type="button"
                                        id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    . . .
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                    {data.userId === currentUserId ? (
                                        <>
                                            <li><a className="dropdown-item" href="#">Edit</a></li>
                                            <li><a className="dropdown-item btn-danger" href="#"
                                                   onClick={this.handleDelete}>Delete</a></li>
                                        </>
                                    ) : (
                                        <>
                                            <li><a className="dropdown-item" href="#">Report</a></li>
                                            <li><a className="dropdown-item" href="#">Block</a></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <p className="card-text">{data.content}</p>
                        {data.image &&
                            <div className="d-flex justify-content-center align-items-center">
                                <img src={data.image} alt="Post" className="card-img-bottom" data-bs-toggle="modal"
                                     data-bs-target={`#${this.state.modalId}`}
                                     onClick={() => this.handleImageClick(data.image)}/>
                            </div>
                        }
                    </div>
                    <div className="modal fade" id={this.state.modalId} aria-labelledby="imageModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <img src={this.state.modalImage} alt="Post" className="img-fluid"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                        <small className="text-muted">Posted
                            on {new Date(data.postingDate).toLocaleDateString()}</small>
                        <div>
                            <button className="btn btn-link"><img src={likeIcon} alt="Like" className="me-2 icon"/>
                            </button>
                            <span>{this.state.likesCount}</span>
                            <button className="btn btn-link" onClick={this.handleCommentClick}><img src={commentIcon}
                                                                                                    alt="Comment"
                                                                                                    className="icon"/>
                            </button>
                            <span>{this.state.commentsCount}</span>
                        </div>
                    </div>
                    <CommentsModal
                        data={data}
                        username={this.state.username}
                        modalImage={this.state.modalImage}
                        likesCount={this.state.likesCount}
                        commentsCount={this.state.commentsCount}
                        comments={this.state.comments}
                        handleDelete={this.handleDelete}
                        handleImageClick={this.handleImageClick}
                    />
                </div>
            </div>
        );
    }
}

export default Post;