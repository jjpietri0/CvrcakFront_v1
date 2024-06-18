import React, { } from 'react';
import logo from '../Images/CvrcakLogo.png';
import  likeIcon from '../Images/likeIcon.png';
import  commentIcon from '../Images/commentIcon.png';
import '../CSS/Post.css';
import {Modal} from "bootstrap";

class Post extends React.Component<{ data: any }, {
    username: string,
    modalImage: string,
    modalId: string,
    likesCount: number,
    commentsCount: number,
    comments: any[]
}> {
    constructor(props: { data: any }) {
        super(props);
        this.state = {
            username: '',
            modalImage: '',
            modalId: `imageModal-${props.data.postId}`,
            likesCount: 0,
            commentsCount: 0,
            comments: []
        };
    }

    handleImageClick = (imageUrl: string) => this.setState({modalImage: imageUrl});

    componentDidMount() {
        const { data } = this.props;
        fetch(`cvrcak/user/id/${data.userId}`)
            .then(response => response.json())
            .then(data => this.setState({ username: data.username }))
            .catch(error => console.error('Error:', error));

        fetch(`/cvrcak/post/likesCount/${data.postId}`)
            .then(response => response.json())
            .then(data => this.setState({likesCount: data}))
            .catch(error => console.error('Error:', error));
        fetch(`/cvrcak/post/commentsCount/${data.postId}`)
            .then(response => response.json())
            .then(data => this.setState({commentsCount: data}))
            .catch(error => console.error('Error:', error));
        // Fetch comments
        fetch(`/cvrcak/post/comments/${data.postId}`)
            .then(response => response.json())
            .then(comments => {
                return Promise.all(comments.map((comment: any) =>
                    fetch(`cvrcak/user/id/${comment.userId}`)
                        .then(response => response.json())
                        .then(user => ({...comment, username: user.username}))
                ));
            })
            .then(commentsWithUsernames => this.setState({comments: commentsWithUsernames}))
            .catch(error => console.error('Error:', error));

    }

    handleCommentClick = () => {
        const modalElement = document.getElementById(`commentsModal-${this.props.data.postId}`);
        if (modalElement) {
            const modalInstance = new Modal(modalElement);
            modalInstance.show();
        }
    };
    handleDelete = () => {
        fetch(`/cvrcak/post/delete/${this.props.data.postId}`, {
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
        let {data} = this.props;
        if (data.deleteDate != null) {
            return null;
        }
        return (
            <div className="container w-50">
                <div className="card my-3">
                    <div className="card-header d-flex justify-content-between">
                        <div>
                            <img src={logo} alt="User profile" className="rounded-circle me-2"
                                 style={{width: "30px", height: "30px"}}/>
                            <span>{this.state.username}</span>
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
                                    <li><a className="dropdown-item" href="#">Report</a></li>
                                    <li><a className="dropdown-item" href="#">Block</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={this.handleDelete}>Delete</a>
                                    </li>
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
                    <div className="modal fade" id={`commentsModal-${data.postId}`} aria-labelledby="commentsModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="card">
                                        <div className="card-header d-flex justify-content-between">
                                            <div>
                                                <img src={logo} alt="User profile" className="rounded-circle me-2"
                                                     style={{width: "30px", height: "30px"}}/>
                                                <span>{this.state.username}</span>
                                                <h6 className="mt-3">{data.title}</h6>

                                            </div>
                                            <div className="d-flex align-items-center">
                                                {data.updateDate &&
                                                    <span>Edited: {new Date(data.updateDate).toLocaleDateString()}</span>}
                                                <div className="dropdown me-2">
                                                    <button className="btn btn-secondary dropdown-toggle no-arrow"
                                                            type="button"
                                                            id="dropdownMenuButton" data-bs-toggle="dropdown"
                                                            aria-expanded="false">
                                                        . . .
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-end"
                                                        aria-labelledby="dropdownMenuButton">
                                                        <li><a className="dropdown-item" href="#">Report</a></li>
                                                        <li><a className="dropdown-item" href="#">Block</a></li>
                                                        <li><a className="dropdown-item" href="#"
                                                               onClick={this.handleDelete}>Delete</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">{data.content}</p>
                                            {data.image &&
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <img src={data.image} alt="Post" className="card-img-bottom"
                                                         data-bs-toggle="modal"
                                                         data-bs-target={`#${this.state.modalId}`}
                                                         onClick={() => this.handleImageClick(data.image)}/>
                                                </div>
                                            }
                                        </div>
                                        <div className="modal fade" id={this.state.modalId}
                                             aria-labelledby="imageModalLabel"
                                             aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                                <div className="modal-content">
                                                    <div className="modal-body">
                                                        <img src={this.state.modalImage} alt="Post"
                                                             className="img-fluid"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer d-flex justify-content-between">
                                            <small className="text-muted">Posted
                                                on {new Date(data.postingDate).toLocaleDateString()}</small>
                                            <div>
                                                <button className="btn btn-link"><img src={likeIcon} alt="Like"
                                                                                      className="me-2 icon"/>
                                                </button>
                                                <span>{this.state.likesCount}</span>
                                                <button className="btn btn-link"><img
                                                    src={commentIcon} alt="Comment" className="icon"/>
                                                </button>
                                                <span>{this.state.commentsCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.comments.map((comment, index) => (
                                        <div key={index}>
                                            <div className="card-body p-1 border m-1">
                                                <strong>{comment.username}</strong>
                                                <p className="card-text">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Post;