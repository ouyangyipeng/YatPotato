import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // 导入代码高亮样式
import './Chat.css';
import { getInteractor } from './ChatInteractor';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const chatInteractor = getInteractor();

  useEffect(() => {
    setMessages([
      { sender: 'ai', text: '你好！我是Yat-Potato的AI助手，有什么可以帮助您的吗？' }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSend = async () => {
    if ((input.trim() === '' && !selectedImage) || isLoading) return;

    const newMessage = { 
      sender: 'user', 
      text: input,
      image: selectedImage 
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const aiResponse = await chatInteractor.getAIResponse(newMessages, selectedImage);
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: '抱歉，我遇到了一些麻烦，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async () => {
    try {
      const imagePath = await chatInteractor.openImageDialog();
      if (imagePath) {
        setSelectedImage(imagePath);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
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
      </div>      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div className="message-content">
              {msg.image && msg.sender === 'user' && (
                <div className="message-image">
                  <img src={`file://${msg.image}`} alt="用户发送的图片" />
                </div>
              )}              {msg.sender === 'ai' ? (
                <div className="markdown-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      // 自定义组件渲染
                      code: ({node, inline, className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <pre className={className} {...props}>
                            <code>{children}</code>
                          </pre>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
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
      
      {selectedImage && (
        <div className="image-preview-container">
          <div className="image-preview">
            <img src={`file://${selectedImage}`} alt="预览图片" />
            <button className="remove-image-btn" onClick={removeSelectedImage}>×</button>
          </div>
        </div>
      )}
      
      <div className="chat-input-area">
        <button className="attach-btn" onClick={handleImageSelect} disabled={isLoading}>
          📎
        </button>
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
