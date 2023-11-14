import React, { useState, useEffect } from "react";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Logout from '../components/Logout';
import {
    MDBIcon,
    MDBTypography,
    MDBInputGroup,
} from "mdb-react-ui-kit";
import { Socket } from "socket.io-client";

export default function App({ contacts, currentUser, changeChat, socket }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    useEffect(() => {
        if (currentUser) {
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatarImage);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };
    return (
        <div className="p-3">
            <div className="mb-2 d-flex justify-content-between">
                <div className="d-flex flex-row">
                    <div>
                        <img
                            src={`data:image/svg+xml;base64,${currentUserImage}`}
                            alt="avatar"
                            className="d-flex align-self-center me-3"
                            width="60"
                        />
                        <span className={`badge ${currentUser.isOnline ? 'bg-success' : 'bg-danger'} badge-dot`}></span>
                    </div>
                    <div className="pt-1">
                        <div className="pt-1">
                            <p className="fw-bold mb-0">{currentUserName}</p>
                            <p className="small text-muted">Hello, Are you there?</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-lg-center">
                    <Logout socket={socket} />
                </div>
            </div>
            <MDBInputGroup className="rounded mb-3 border border-primary">
                <input
                    className="form-control rounded"
                    placeholder="Search"
                    type="search"
                />
                <span
                    className="input-group-text border-0"
                    id="search-addon"
                >
                    <MDBIcon fas icon="search" />
                </span>
            </MDBInputGroup>

            <PerfectScrollbar
                suppressScrollX
                style={{ position: "relative", height: "435px" }}
            >
                <MDBTypography listUnStyled className="mb-0">
                    {contacts.map((contact, index) => {
                        return (
                            <div
                                key={contact._id}
                                className={`contact ${index === currentSelected ? "bg-secondary shadow-1-strong" : ""}`}
                                onClick={() => changeCurrentChat(index, contact)}
                            >
                                <li className="p-2 border-bottom">
                                    <div className="d-flex justify-content-between" >
                                        <div className="d-flex flex-row">
                                            <div>
                                                <img
                                                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                                    alt="avatar"
                                                    className="d-flex align-self-center me-3"
                                                    width="60"
                                                />
                                                <span className={`badge ${contact.isOnline ? 'bg-success' : 'bg-danger'} badge-dot`}></span>
                                            </div>
                                            <div className="pt-1">
                                                <p className="fw-bold mb-0">{contact.username}</p>
                                                <p className="small text-muted">
                                                    Hello, Are you there?
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <p className="small text-muted mb-1">Just now</p>
                                            <span className="badge bg-danger rounded-pill float-end">
                                                3
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        );
                    })}

                </MDBTypography>
            </PerfectScrollbar>
        </div>
    )
}