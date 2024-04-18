import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom'; // Import useHistory
import '../App.css';

function ChatScreen() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const { name } = useParams(); // Assuming the user is the therapist

  // Fetch chat data from the API
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat_history?user=${name}`);
        setChat(response.data[0]?.chat || []); // Access chat array from response.data[0]
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    };
    fetchChat();
  }, [name]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    // Prepare the message object
    const newMessage = {
      sender: 'Therapist',
      user: name,
      message: message,
      date: new Date().toISOString(),
    };

    // Update the chat state
    setChat(prevChat => [...prevChat, newMessage]);

    // Reset the message input
    setMessage('');

    // Save the message to the backend (assuming you have a route for saving messages)
    try {
      await axios.post(`http://localhost:5000/api/chat_history?user=${name}`, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-screen">
      <div className="chat-box">
        {chat.map((message, index) => (
          <div key={index} className={`message ${message.sender === 'Therapist' ? 'sent' : 'received'}`}>
            <p>{message.message}</p>
            <span className="time">{new Date(message.date).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatScreen;
