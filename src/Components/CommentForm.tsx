import React, { Component } from 'react';

function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    return fetch(url, options);
}

class Comment extends Component<{ postId: number }, { content: string }> {
    constructor(props: { postId: number }) {
        super(props);
        this.state = {
            content: ''
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            content: event.target.value
        });
    };

    handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const userId = localStorage.getItem('userID');
        const { postId } = this.props;
        const { content } = this.state;

        const body = {
            commentId: 0,
            userId: Number(userId),
            postId: postId,
            content: content
        };

        authFetch('/cvrcak/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Comment posted');
                    this.setState({ content: '' });
                } else {
                    console.error('Error:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="m-2 mb-0">
                    <label htmlFor="comment" className="form-label fw-bold">Comment</label>
                    <textarea className="form-control" id="comment" value={this.state.content} onChange={this.handleInputChange} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary m-3">Post Comment</button>
            </form>
        );
    }
}

export default Comment;