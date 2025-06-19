import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { getInteractor } from './ChatInteractor';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const chatInteractor = getInteractor();

  useEffect(() => {
    setMessages([
      { sender: 'ai', text: '你好！我是您的AI助手，有什么可以帮助您的吗？' }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await chatInteractor.getAIResponse(newMessages);
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: '抱歉，我遇到了一些麻烦，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>AI 小助手</h2>
        <p>Yat-Potato</p>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble ai">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          发送
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
