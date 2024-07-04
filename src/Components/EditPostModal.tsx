import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface PostData {
    postId: number;
    title: string;
    content: string;
    image: string;
}

interface EditPostModalProps {
    post: PostData,
    show?: boolean,
    handleClose?: () => void
}
const EditPostModal: React.FC<EditPostModalProps> = ({ post, show, handleClose }) => {
    const [editedPost, setEditedPost] = useState<PostData>(post);
    const [showModal, setShowModal] = useState<boolean>(false);
    const userId = parseInt(localStorage.getItem('userID') || '');

    useEffect(() => {
        setShowModal(!!show);
    }, [show]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditedPost(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(`Updated ${name}: ${value}`);
    };

    const editPost = async (editedPostData: PostData) => {
        console.log('Sending update request with payload:', editedPostData);

        try {
            const response = await fetch('/cvrcak/post/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: editedPostData.postId,
                    userId: userId,
                    title: editedPostData.title,
                    content: editedPostData.content,
                    image: editedPostData.image,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update the post, status: ${response.status}`);
            }
            if (handleClose) handleClose();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        editPost(editedPost).catch(error => {
            console.error('Error updating post:', error);
        });
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" value={editedPost.title} onChange={handleInputChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" rows={3} name="content" value={editedPost.content} onChange={handleInputChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="text" name="image" value={editedPost.image} onChange={handleInputChange}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditPostModal;