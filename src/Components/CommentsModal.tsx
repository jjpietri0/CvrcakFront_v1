import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/CvrcakLogo.png';
import likeIcon from '../Images/likeIcon.png';
import commentIcon from '../Images/commentIcon.png';

interface CommentsModalProps {
    data: any;
    username: string;
    modalImage: string;
    likesCount: number;
    commentsCount: number;
    comments: any[];
    handleDelete: () => void;
    handleImageClick: (imageUrl: string) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ data, username, modalImage, likesCount, commentsCount, comments, handleDelete, handleImageClick }) => {
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
                                            <li><a className="dropdown-item" href="#">Edit</a></li>
                                            <li><a className="dropdown-item" href="#"
                                                   onClick={handleDelete}>Delete</a>
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
                                             data-bs-target={`#imageModal-${data.postId}`}                                             onClick={() => handleImageClick(data.image)}/>
                                    </div>
                                }
                            </div>
                            <div className="modal fade" id={`imageModal-${data.postId}`}                                 aria-labelledby="imageModalLabel"
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
                                    <Link to={`/user/${comment.userId}`} className="text-decoration-none text-reset fw-bold">{comment.username}</Link>
                                    <p className="card-text">{comment.content}</p>
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