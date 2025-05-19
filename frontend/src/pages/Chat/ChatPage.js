import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import apiRequest from '../../config/apiRequest';
import { AuthContext } from "../../context/AuthContext";


const socket = io("http://localhost:5000");
const ChatPage = () => {
    const { currentUser } = useContext(AuthContext);
    const sender = currentUser._id;
    const { receiver } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        socket.emit("joinRoom", { sender, receiver });

        const fetchMessages = async () => {
            try {
                const res = await apiRequest.get(`/api/chat/${receiver}`, {
                    withCredentials: true
                });
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch chat messages:", error);
            }
        };

        fetchMessages();

        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [sender, receiver]);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (text.trim()) {
            socket.emit("sendMessage", { sender, receiver, text });
            setText("");
        }
    };


    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Chat between {sender} and {receiver}</h2>
            <div style={styles.chatBox}>
                {messages.map((msg, idx) => {
                    const date = new Date(msg.date);
                    const formatted = date.toLocaleString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    });

                    return (
                        <div
                            key={idx}
                            style={{
                                ...styles.message,
                                alignSelf: msg.from._id === sender ? "flex-end" : "flex-start",
                                backgroundColor: msg.from._id === sender ? "#DCF8C6" : "#FFF",
                            }}
                        >
                            <div style={styles.name}>{msg.from.name || msg.from}</div>
                            <div>{msg.text}</div>
                            <div style={styles.timestamp}>{formatted}</div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>


            <div style={styles.inputBox}>
                <input
                    style={styles.input}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                />
                <button style={styles.button} onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        textAlign: "center",
        marginBottom: "20px",
    },
    chatBox: {
        display: "flex",
        flexDirection: "column",
        height: "400px",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        backgroundColor: "#F5F5F5",
        borderRadius: "10px",
    },
    message: {
        maxWidth: "70%",
        padding: "10px",
        margin: "5px 0",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    name: {
        fontSize: "0.8em",
        fontWeight: "bold",
        marginBottom: "4px",
        color: "#555",
    },
    inputBox: {
        display: "flex",
        marginTop: "10px",
    },
    input: {
        flex: 1,
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px 0 0 5px",
        border: "1px solid #ccc",
        outline: "none",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "0 5px 5px 0",
        backgroundColor: "#007BFF",
        color: "#fff",
        cursor: "pointer",
    },
    timestamp: {
        fontSize: "0.75em",
        color: "#999",
        marginTop: "4px",
        textAlign: "right",
    }
};

export default ChatPage;
