import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef();

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input) return;

    setMessages([...messages, { type: 'user', message: input, timestamp: new Date() }]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: input })
      });

      const data = await response.json();
    
      if (response.ok) {
        setMessages([...messages, { type: 'user', message: input, timestamp: new Date() }, { type: 'bot', message: data.response, timestamp: new Date() }]);
      } else {
        setMessages([...messages, { type: 'bot', message: 'Unable to connect to the server', timestamp: new Date() }]);
      }

    } catch (error) {
      setMessages([...messages, { type: 'bot', message: 'Encountered an error', timestamp: new Date() }]);
    }

    setIsSending(false);
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.message}
              <div className="timestamp">{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
          ))}
          {isSending && <div className="message bot">Sending...</div>}
          <div ref={bottomRef} />
        </div>
        <form className="input-container" onSubmit={handleSubmit}>
          <input
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
          />
          <button className="send-button" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default App;