import React, { } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/CvrcakLogo.png';
import  likeIcon from '../Images/likeIcon.png';
import  commentIcon from '../Images/commentIcon.png';
import '../CSS/Post.css';
import {Modal} from "bootstrap";
import CommentsModal from "./CommentsModal";
import Comment from './CommentForm';
import EditPostModal from "./EditPostModal";


function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(url, options);
}


class DiscussionComponent extends React.Component<{ data: any }, {
    username: string,
    userImage: string,
    modalImage: string,
    modalId: string,
    likesCount: number,
    commentsCount: number,
    comments: any[],
    isLoadingComments: boolean,
    remainingTime: number,
    hasLiked: boolean
    isEditModalVisible: boolean

}> {
    timerId: NodeJS.Timeout | null = null;

    constructor(props: { data: any }) {
        super(props);
        let remainingTime = Infinity;
        if (props.data.disappearTime) {
            const [year, month, day, hour, minute] = props.data.disappearTime;
            const disappearDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
            const now = new Date();
            remainingTime = Math.max(Math.floor((disappearDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), 0);
        }
        this.state = {
            username: '',
            userImage: '',
            modalImage: '',
            modalId: `imageModal-${props.data.postId}`,
            likesCount: 0,
            commentsCount: 0,
            comments: [],
            isLoadingComments: false,
            remainingTime: remainingTime,
            hasLiked: false,
            isEditModalVisible: false
        };
    }

    handleImageClick = (imageUrl: string) => this.setState({modalImage: imageUrl});

    componentDidMount() {
        const { data } = this.props;
        authFetch(`/cvrcak/user/id/${data.userId}`)
            .then(response => response.json())
            .then(data => this.setState({ username: data.username, userImage: data.image }))
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
                    authFetch(`/cvrcak/user/id/${comment.userId}`)
                        .then(response => response.json())
                        .then(user => ({...comment, username: user.username}))
                ));
            })
            .then(commentsWithUsernames => {
                const sortedComments = commentsWithUsernames.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                this.setState({comments: sortedComments, isLoadingComments: false});
            })
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
    handleLike = () => {
        const userId = localStorage.getItem('userID');
        const { data } = this.props;

        const body = {
            likeId: 0,
            userId: Number(userId),
            postId: data.postId
        };

        authFetch('/cvrcak/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Post liked');
                    this.setState({ hasLiked: true });
                    return authFetch(`/cvrcak/post/likesCount/${data.postId}`);
                } else {
                    console.error('Error:', response.statusText);
                    throw new Error(response.statusText);
                }
            })
            .then(response => response.json())
            .then(data => this.setState({likesCount: data}))
            .catch(error => {
                console.error('Error:', error);
            });
    };
    handleUnlike = () => {
        const userId = localStorage.getItem('userID');
        const { data } = this.props;

        const body = {
            likeId: 0,
            userId: Number(userId),
            postId: data.postId
        };

        authFetch('/cvrcak/unlike', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Post unliked');
                    this.setState({ hasLiked: false });
                    return authFetch(`/cvrcak/post/likesCount/${data.postId}`);
                } else {
                    console.error('Error:', response.statusText);
                    throw new Error(response.statusText);
                }
            })
            .then(response => response.json())
            .then(data => this.setState({likesCount: data}))
            .catch(error => {
                console.error('Error:', error);
            });
    };
    toggleEditModal = () => {
        this.setState(prevState => ({ isEditModalVisible: !prevState.isEditModalVisible }));
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
                        <div className="alert alert-danger mb-0" role="alert">Discussion below will disappear in {this.state.remainingTime} days</div>
                    )}
                    <div className="card-header d-flex justify-content-between">
                        <div>
                            <img src={this.state.userImage || logo} alt="User profile" className="rounded-circle me-2"
                                 style={{width: "30px", height: "30px"}}/>
                            <Link to={`/user/${data.userId}`}
                                  className="text-decoration-none text-reset fw-bold">{this.state.username}</Link>
                            <h6 className="mt-3">{data.title}</h6>

                        </div>
                        <div className="d-flex align-items-center">
                            {data.updateDate && <span>Edited: {new Date(data.updateDate).toLocaleDateString()}</span>}
                            <div className="dropdown me-2">
                                <button className="btn btn-secondary dropdown-toggle no-arrow" type="button"
                                        id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    . . .
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton" >
                                    {Number(data.userId) === Number(currentUserId) ? (
                                        <>
                                            <li><a className="dropdown-item" href="#" onClick={this.toggleEditModal}>Edit</a>
                                            </li>
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
                                <EditPostModal show={this.state.isEditModalVisible} handleClose={this.toggleEditModal} post={data} />
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
                        <small className="text-muted">Discussion started
                            on {new Date(data.postingDate).toLocaleDateString()}</small>
                        <div>
                            <button className="btn btn-link"
                                    onClick={this.state.hasLiked ? this.handleUnlike : this.handleLike}>
                                <img src={likeIcon} alt="Like/Unlike"
                                     className={`me-2 icon ${this.state.hasLiked ? 'text-primary' : 'text-secondary'}`}/>
                            </button>
                            <span>{this.state.likesCount}</span>
                            <button className="btn btn-link" onClick={this.handleCommentClick}><img src={commentIcon}
                                                                                                    alt="Comment"
                                                                                                    className="icon"/>
                            </button>
                            <span>{this.state.commentsCount}</span>
                        </div>
                    </div>
                    <Comment postId={data.postId} />
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

export default DiscussionComponent;