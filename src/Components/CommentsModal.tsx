import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../Images/CvrcakLogo.png';
import likeIcon from '../Images/likeIcon.png';
import commentIcon from '../Images/commentIcon.png';

interface CommentsModalProps {
    data: any,
    username: string,
    modalImage: string,
    likesCount: number,
    commentsCount: number,
    comments: any[],
    handleDelete: () => void,
    handleImageClick: (imageUrl: string) => void,
}

interface CommentRequest {
    commentId: number;
    userId: number;
    postId: number;
    content: string;
}

const authFetch = (url: string, options: any) => {
    const token = localStorage.getItem('jwtToken');
    options.headers = {
        'Authorization': `Bearer ${token}`,
    };
    return fetch(url, options);
};

const editComment = (comment: CommentRequest) => {
    return authFetch('/cvrcak/comment/update', {
        method: 'PUT',
        body: JSON.stringify(comment)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => console.error('Error:', error));
};

const deleteComment = (commentId: number) => {
    return authFetch(`/cvrcak/comment/delete/${commentId}`, {
        method: 'PUT'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(data => {
            if (data.success) {
                console.log(`Comment ${data.data} deleted successfully.`);
            } else {
                console.error('Error:', data.result);
            }
        })
        .catch(error => console.error('Error:', error));
};

const CommentsModal: React.FC<CommentsModalProps> = ({
                                                         data,
                                                         username,
                                                         modalImage,
                                                         likesCount,
                                                         commentsCount,
                                                         comments,
                                                         handleDelete,
                                                         handleImageClick,
                                                     }) => {
    const currentUserId = localStorage.getItem('userID');

    return (
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
                                    <span>{username}</span>
                                    <h6 className="mt-3">{data.title}</h6>

                                </div>
                                <div className="d-flex align-items-center">
                                    {data.updateDate &&
                                        <span>Edited: {new Date(data.updateDate).toLocaleDateString()}</span>}
                                </div>
                            </div>
                            <div className="card-body">
                                <p className="card-text">{data.content}</p>
                                {data.image &&
                                    <div className="d-flex justify-content-center align-items-center">
                                        <img src={data.image} alt="Post" className="card-img-bottom"
                                             data-bs-toggle="modal"
                                             data-bs-target={`#imageModal-${data.postId}`}
                                             onClick={() => handleImageClick(data.image)}/>
                                    </div>
                                }
                            </div>
                            <div className="modal fade" id={`imageModal-${data.postId}`}
                                 aria-labelledby="imageModalLabel"
                                 aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <img src={modalImage} alt="Post"
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
                                    <span>{likesCount}</span>
                                    <button className="btn btn-link"><img
                                        src={commentIcon} alt="Comment" className="icon"/>
                                    </button>
                                    <span>{commentsCount}</span>
                                </div>
                            </div>
                        </div>
                        {comments.map((comment, index) => (
                            <div key={index}>
                                <div className="card-body p-1 border m-1">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <Link to={`/user/${comment.userId}`}
                                                  className="text-decoration-none text-reset fw-bold">{comment.username}</Link>
                                            <p className="card-text">{comment.content}</p>
                                            <small className="text-muted">Commented
                                                on {new Date(comment.commentingDate).toLocaleDateString()}</small>
                                            {comment.updateDate && <small className="text-muted">, Edited
                                                on {new Date(comment.updateDate).toLocaleDateString()}</small>}
                                        </div>
                                        {Number(comment.userId) === Number(currentUserId) && (
                                            <div className="dropdown m-2">
                                                <button className="btn btn-secondary dropdown-toggle no-arrow"
                                                        type="button"
                                                        id="dropdownMenuButton" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                    . . .
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end"
                                                    aria-labelledby="dropdownMenuButton">
                                                    <li><a className="dropdown-item"
                                                           onClick={() => editComment(comment)}>Edit</a></li>
                                                    <li><a className="dropdown-item btn-danger"
                                                           onClick={() => deleteComment(comment.commentId)}>Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentsModal;