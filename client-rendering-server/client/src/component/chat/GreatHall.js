import React, {useState, useEffect, useRef} from "react";
import EventBus, {registerHandler} from "../../module/eventbus";
import AvatarOther from "../avatar/AvatarOther";

const GreatHall = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loggedInUser] = useState(sessionStorage.getItem("username"));
    const messagesEndRef = useRef(null);
    let prevSender = null;

    useEffect(() => {
        registerHandler("EB.chat.great-hall.propagate", (err, message) => {
            const newMessage = message.body;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        scrollToBottom();
    }, [messages]); // Trigger effect when messages change

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            // Send a message to the server using EventBus
            EventBus.send("EB.chat.great-hall.send", { text: newMessage, sender: loggedInUser });

            // Clear the input field
            setNewMessage("");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    };

    return (
        <div className="border rounded-4 shadow-sm p-2">
            <div className="p-2" style={{ overflowY: "auto", height: "400px" }}>
                {messages.map((message, index) => {
                    const isNewSpeakerSaying = message.sender !== prevSender;
                    prevSender = message.sender;

                    return (
                        <div key={index} className={`d-flex align-items-center my-2 ${message.sender === loggedInUser ? "flex-row-reverse ms-auto" : "flex-row"}`}>
                            {isNewSpeakerSaying && <AvatarOther username={message.sender} />}
                            <div
                                className={`text-start fw-light badge bg-danger-subtle text-danger-emphasis rounded-pill ${message.sender === loggedInUser ? "" : ""}`}
                                style={{
                                    wordWrap: "break-word",
                                    maxWidth: "80%",
                                    width: `${message.text.length * 5 + 50}px`,
                                    padding: "5px",
                                }}
                            >
                                {message.sender === loggedInUser ? "you: " : ``}
                                {message.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="d-flex py-2">
                <input
                    type="text"
                    className="form-control flex-grow-1"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <i className="bi bi-send align-self-center m-2" onClick={handleSendMessage}></i>
            </div>
        </div>
    );
};

export default GreatHall;
