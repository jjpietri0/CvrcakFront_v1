import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwtToken');
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    return fetch(url, options);
}

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    password: string | null;
    email: string;
    country: string | null;
    gender: string | null;
    birthday: string;
    image: string | null;
    registerDate: string;
    isDeleted: string | null;
    followers: string | null;
    following: string | null;
    posts: string | null;
    conversations: string | null;
    activityId: string | null;
    isFollowing: boolean;
}

interface LikedPost {
    title: string;
    userId: number;
    likedByUserId: number;
    username: string;
    creatorUsername: string;
}
const TimelineComponent = () => {
    const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
        authFetch(`/cvrcak/user/${id}/following/1`)
            .then(response => response.json())
            .then(data => {
                const updatedData: User[] = [];
                data.forEach((user: User) => {
                    updatedData.push({ ...user, isFollowing: true });
                });
                fetchLikedPosts(updatedData.map(user => user.userId));
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    const fetchLikedPosts = async (userIds: number[]) => {
        const postsPromises = userIds.map(async (userId) => {
            const url = `/cvrcak/user/${userId}/likedPosts`;
            try {
                const response = await authFetch(url);
                const posts = await response.json();
                return await Promise.all(posts.map(async (post: { title: string; userId: number }) => {
                    const likerResponse = await authFetch(`/cvrcak/user/id/${userId}`);
                    const likerData = await likerResponse.json();
                    const creatorResponse = await authFetch(`/cvrcak/user/id/${post.userId}`);
                    const creatorData = await creatorResponse.json();
                    return {
                        title: post.title,
                        userId: post.userId,
                        likedByUserId: userId,
                        username: likerData.username,
                        creatorUsername: creatorData.username
                    };
                }));
            } catch (error) {
                console.error('Error fetching liked posts:', error);
                return [];
            }
        });

        const postsResults = await Promise.all(postsPromises);
        const flattenedPosts = postsResults.flat().reverse();
        setLikedPosts(flattenedPosts);
    };

    return (
        <div>
            <h1>Timeline</h1>
            {likedPosts.map((post, index) => (
                <div key={index} className="card mb-2" style={{
                    border: "1px solid #ccc",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                    backgroundColor: "#f9f9f9",
                    minHeight: "5rem",
                    overflow: "auto"
                }}>
                    <div className="card-body" style={{padding: "10px", height: "5rem"}}>
                        <p>User <strong>{post.username}</strong> has liked a post "<em>{post.title}</em>" created
                            by <strong>{post.creatorUsername}</strong>!</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimelineComponent;