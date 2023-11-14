import React, { useState } from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';
import EmojiPicker from 'emoji-picker-react';

export default function ChatInput({ handleSendMsg, currentUser }) {
    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiPickeringShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiPickerMouseLeave = () => {
        setShowEmojiPicker(false);
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };

    const handleSubmitForm = (event) => {
        event.preventDefault();
        sendChat(event);
    };

    return (
        <form onSubmit={handleSubmitForm} className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
            <img
                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                alt="avatar 3"
                style={{ width: "40px", height: "100%" }}
            />

            <input
                type="text"
                className="form-control form-control-lg"
                id="exampleFormControlInput2"
                placeholder="Type message"
                onChange={(e) => setMsg(e.target.value)}
                value={msg}
            />
            <div className="ms-1 text-muted">
                <MDBIcon fas icon="paperclip" />
            </div>
            <div className="ms-3 text-muted">
                <MDBIcon fas icon="smile" onClick={handleEmojiPickeringShow} />
                {showEmojiPicker && <EmojiPicker onEmojiClick={(emojiObject) => setMsg((prevMsg) => prevMsg + emojiObject.emoji)} onMouseLeave={handleEmojiPickerMouseLeave} />}
            </div>
            <div className="ms-3">
                <i className="send-icon" onClick={handleSubmitForm}>
                    <MDBIcon fas icon="paper-plane" />
                </i>
            </div>
        </form>
    );
}
