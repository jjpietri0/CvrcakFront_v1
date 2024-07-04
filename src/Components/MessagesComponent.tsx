import React, {useState, useEffect, ChangeEvent} from 'react';
import axios from "axios";

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    sendDate: Date;
}
interface Conversation {
    id: number;
    participants: number[];
    receiverID: number;
    messages: Message[];
    username?: string;
    profileImage?: string;
}
interface User {
    userId: number;
    username: string;
}

const authFetch = (url: string, options: any) => {
    const token = localStorage.getItem('jwtToken');
    options.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    return fetch(url, options);
};

const MessagesComponent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const currentUserID = parseInt(localStorage.getItem('userID') || '0');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [userResults, setUserResults] = useState<User[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const receiverID = conversations.length > 0 ? conversations[0].receiverID : 0;


    const fetchMessages = (receiverID: number) => {
        console.log('Fetching messages for receiverID:', receiverID);
        authFetch(`/cvrcak/user/conversation/${currentUserID}/${receiverID}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages(data.messages);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const sendMessage = () => {
        if (!newMessage.trim()) {
            console.error('Message content is empty');
            return;
        }

        if (!currentConversation) {
            console.error('No conversation selected');
            return;
        }

        const message = {
            messageId: 0,
            senderId: currentUserID,
            receiverId: currentConversation.receiverID,
            messageContent: newMessage.trim(),
        };

        authFetch('/cvrcak/message/new', {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send message');
                }
                return response.text();
            })
            .then(text => {
                const data = text ? JSON.parse(text) : {};
                console.log('Message sent successfully:', data);
                setNewMessage('');
                fetchMessages(currentConversation.receiverID);
            })
            .catch(error => console.error('Error:', error));
    };
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await authFetch(`/cvrcak/user/${currentUserID}/conversations`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const conversationsData: Conversation[] = await response.json();
                const updatedConversations = await Promise.all(conversationsData.map(async (conversation) => {
                    const receiverID = conversation.participants.find((participant: number) => participant !== currentUserID);
                    if (typeof receiverID === 'undefined') {
                        throw new Error('Receiver ID is undefined');
                    }
                    const userDetailsResponse = await authFetch(`/cvrcak/user/id/${receiverID}`, {
                        method: 'GET',
                    });
                    if (!userDetailsResponse.ok) {
                        throw new Error('User details fetch was not ok');
                    }
                    const userDetails: { username: string; profileImage: string } = await userDetailsResponse.json();
                    return { ...conversation, receiverID, username: userDetails.username, profileImage: userDetails.profileImage };
                }));
                setConversations(updatedConversations);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchConversations();
    }, [currentUserID]);

    const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
            setShowDropdown(true);
        }
    };
    const handleSearch = async () => {
        if (!searchQuery) {
            setUserResults([]);
            setShowDropdown(false);
            return;
        }
        const token = localStorage.getItem('jwtToken');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const userResults = await axios.get(`/cvrcak/user/${searchQuery}`, config);
        const postResults = await axios.get(`/cvrcak/post/title/${searchQuery}`, config);
        if (!userResults.data && postResults.data.length === 0) {
            setUserResults([]);
            setShowDropdown(false);
        } else {
            if (userResults.data) {
                setUserResults([userResults.data]);
            } else {
                setUserResults([]);
            }
            setShowDropdown(true);
        }
    };
    const closeDropdown = () => {
        setShowDropdown(false);
    };
    const handleUserClick = async (selectedUser: User) => {
        let conversation = conversations.find(c => c.participants.includes(selectedUser.userId));
        console.log('Conversation:', conversation);
        console.log('Selected user:', selectedUser);

        if (!conversation) {
            console.log(selectedUser.userId);
            const newConversation = {
                id: Date.now(),
                participants: [currentUserID, selectedUser.userId],
                receiverID: selectedUser.userId,
                messages: [],
                username: selectedUser.username,
            };
            console.log(receiverID);
            setConversations(prevConversations => [...prevConversations, newConversation]);
            conversation = newConversation;
        }

        setCurrentConversation(conversation);
        fetchMessages(conversation.receiverID);
    };

    const renderMessages = () => {
        return messages.map((message) => (
            <div key={message.id} className="row my-2">
                <div className={`col ${message.senderId === currentUserID ? 'text-end' : 'text-start'}`}>
                    <div style={{ minWidth: '15rem', maxWidth:'40rem' }} className={`d-inline-block px-2 pb-1 ${message.senderId === currentUserID ? 'bg-primary text-white' : 'bg-light'} rounded-2`}>
                        <small className="text-muted d-block">
                            {new Date(message.sendDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </small>
                        <h6 className="fw-bold">
                            {message.senderId === currentUserID ? localStorage.getItem('loggedInUsername') : currentConversation?.username}
                        </h6>
                        <p className="mb-0">{message.content}</p>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        <h6>Create a new conversation </h6>
                        <div>
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"
                                   style={{width: '85%'}} onChange={handleSearchInput} onKeyPress={handleKeyPress}/>
                            {showDropdown && (
                                <div className="dropdown show position-absolute">
                                    <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                                        {userResults.length > 0 && <h6 className="dropdown-header">Users</h6>}
                                        {userResults.map((user, index) => (
                                            <a key={index} className="dropdown-item" href="#"
                                               onClick={() => {
                                                   closeDropdown();
                                                   handleUserClick(user);
                                               }}>
                                                {user.username}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <h3 className="alert alert-light mt-1">Conversations</h3>
                        {conversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    setCurrentConversation(conversation);
                                    const clickedReceiverID = conversation.receiverID;
                                    console.log('Clicked receiverID:', clickedReceiverID);
                                    fetchMessages(clickedReceiverID);
                                }}
                            >
                                <p className="fw-bold text-center">{conversation.username || 'Loading...'}</p>
                            </button>
                        ))}
                    </div>
                </div>
                {currentConversation && (
                    <div className="col-md-9">
                        <div className="card" style={{maxHeight: '600px', overflowY: 'scroll'}}>
                            <div className="card-body">
                                <div className="messages">{renderMessages()}</div>
                                <div className="input-group mt-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Type your message"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesComponent;