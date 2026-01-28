import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client'; // Import Socket type
import './App.css';

// Define the type for our socket
interface ClientToServerEvents {
  'chat message': (message: string) => void;
}

interface ServerToClientEvents {
  'chat message': (message: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000'); // Connect to your backend server

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      socket.emit('chat message', messageInput); // Emit message to the server
      setMessageInput('');
    }
  };

  return (
    <div className="App">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">{msg}</div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
