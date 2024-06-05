import React, { } from 'react';
import logo from '../Images/CvrcakLogo.png';
import  likeIcon from '../Images/likeIcon.png';
import  commentIcon from '../Images/commentIcon.png';
import '../CSS/Post.css';

class Post extends React.Component<{ data: any }> {
    state = {
        username: '',
    };
    componentDidMount() {
        const { data } = this.props;
        fetch(`cvrcak/user/id/${data.userId}`)
            .then(response => response.json())
            .then(data => this.setState({ username: data.username }))
            .catch(error => console.error('Error:', error));
    }

    handleDelete = () => {
        fetch(`/cvrcak/post/${this.props.data.postId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    console.log('Post deleted');
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
        return (
            <div className="container w-50">
                <div className="card my-3">
                    <div className="card-header d-flex justify-content-between">
                        <div>
                            <img src={logo} alt="User profile" className="rounded-circle me-2"
                                 style={{width: "30px", height: "30px"}}/>
                            <span>{this.state.username}</span>
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
                                    <li><a className="dropdown-item" href="#" onClick={this.handleDelete}>Delete</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {data.image ?
                            <div className="d-flex justify-content-center">
                                <img src={data.image} alt="Post" className="img-fluid"/>
                            </div>
                            :
                            <div className="d-flex justify-content-start">
                                <p>{data.content}</p>
                            </div>
                        }
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                        <small className="text-muted">Posted
                            on {new Date(data.postingDate).toLocaleDateString()}</small>
                        <div>
                            <button className="btn btn-link"><img src={likeIcon} alt="Like" className="me-2 icon"/>
                            </button>
                            {/*<span>{data.likes.length}</span>*/}
                            <button className="btn btn-link"><img src={commentIcon} alt="Comment" className="icon"/></button>
                            {/*<span>{data.comments.length}</span>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Post;