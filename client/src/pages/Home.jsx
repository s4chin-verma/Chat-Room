import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { io } from "socket.io-client";
import Contact from '../components/Contact';
import Chat from '../components/Chat';

import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody
} from "mdb-react-ui-kit";

export default function Home() {
    const socket = useRef(io(host));
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({ _id: null, isOnline: false });
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);


    const fetchData = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("chat-token"));
            if (!token) {
                navigate("/login");
            } else {
                const user = JSON.parse(localStorage.getItem("chat-user"));
                setCurrentUser(user);
                socket.current = io(host);
                socket.current.emit("add-user", user._id);

                const response = await axios.get(allUsersRoute, {
                    headers: {
                        'Authorization': token,
                    },
                });

                setContacts(response.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    socket.current.on("user-offline", (userId) => {
        if (currentUser._id === userId) {
            setCurrentUser((prevUser) => ({ ...prevUser, isOnline: false }));
        }
    });
    socket.current.on("user-online", (userId) => {
        if (currentUser._id === userId) {
            setCurrentUser((prevUser) => ({ ...prevUser, isOnline: true }));
        }
    });

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <MDBContainer fluid className="py-5" style={{ backgroundColor: "#CDC4F9", height: "100vh" }}>
            <MDBRow >
                <MDBCol md="12">
                    <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
                        <MDBCardBody>
                            <MDBRow>
                                <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                                    <Contact
                                        contacts={contacts}
                                        currentUser={currentUser}
                                        changeChat={handleChatChange}
                                        socket={socket}
                                    />
                                </MDBCol>
                                <MDBCol md="6" lg="7" xl="8">
                                    {currentChat === undefined ? (
                                        <div className="d-flex flex-row justify-content-center align-items-center">
                                            <h1 className="">Please Select a User to start a chat</h1>
                                        </div>

                                    ) : (
                                        <Chat currentChat={currentChat}
                                            currentUser={currentUser}
                                            socket={socket} />
                                    )}

                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}
