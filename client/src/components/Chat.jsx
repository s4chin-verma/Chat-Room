import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import 'react-perfect-scrollbar/dist/css/styles.css';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ChatInput from './ChatInput';

export default function App({ currentUser, currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState([]);
    const scrollRef = useRef(null);

    function formatDate(dateString) {
        const options = {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        const date = new Date(dateString);

        return date.toLocaleString(undefined, options).replace(/(am|pm)/i, match => match.toUpperCase());
    }

    const handleSendMsg = async (msg) => {
        const messageData = {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
            createdAt: new Date().toISOString(),
        };
        await axios.post(sendMessageRoute, messageData);

        socket.current.emit('send-msg', messageData);

        const msgs = [...messages];
        msgs.push({ fromSelf: true, ...messageData });
        setMessages(msgs);
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (currentChat) {
                    const response = await axios.post(getAllMessagesRoute, {
                        from: currentUser._id,
                        to: currentChat._id,
                    });

                    setMessages(response.data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (currentChat) {
            fetchMessages();
        }
    }, [currentChat, currentUser._id]);


    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', (data) => {
                setArrivalMessage({ fromSelf: false, message: data.message, createdAt: data.createdAt });
            });
        } else console.log('The message does not receive');
    }, [socket]);


    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);


    return (
        <>
            <div>
                <div className="d-flex flex-row mb-2">
                    <div>
                        <img
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width="60"
                        />

                        <span className={`badge ${currentChat.isOnline ? 'bg-success' : 'bg-danger'} badge-dot`}></span>
                    </div>
                    <div className="pt-1">
                        <p className="fw-bold mb-0">{currentChat.username}</p>
                        <p className="small text-muted">Hello, Are you there?</p>
                    </div>
                </div>
            </div>

            <PerfectScrollbar
                suppressScrollX
                style={{ position: "relative", height: "435px" }}
                className="pt-3 pe-3"
            >
                {messages.map((message) => {
                    return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div className={`message ${message.fromSelf ? "d-flex flex-row justify-content-start"
                                : "d-flex flex-row justify-content-end"}`}>
                                <img
                                    src={message.fromSelf ? `data:image/svg+xml;base64,${currentUser.avatarImage}`
                                        : `data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                    alt="avatar 1"
                                    style={{ width: "45px", height: "100%" }}
                                />
                                <div>
                                    <p key={message.uuid}
                                        className={`small p-2 ms-3 mb-1 rounded-3 ${message.fromSelf ? 'bg-primary text-white' : 'bg-secondary text-dark'}`}
                                    >
                                        {message.message}
                                    </p>
                                    <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                                        {formatDate(message.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </PerfectScrollbar>
            <ChatInput handleSendMsg={handleSendMsg} currentUser={currentUser} />
        </>
    );
}

