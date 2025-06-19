import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // 导入代码高亮样式
import './Chat.css';
import { getInteractor } from './ChatInteractor';
import * as GeneralInteractor from '../../../interactor/GeneralInteractor.js';

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

  // Function to process AI responses, including function calls
  const processAIResponse = async (aiResponseText, messageHistory) => {
    try {
      const responseJson = JSON.parse(aiResponseText);
      const { call, returnValueRequired, message, messageRequired } = responseJson;

      let functionCallResults = [];
      let hasFunctionCalls = call && call.length > 0;

      if (hasFunctionCalls) {
        for (const func of call) {
          try {
            const result = await GeneralInteractor.invoke(func.function, ...(func.args || []));
            functionCallResults.push({ function: func.function, status: 'success', result });
          } catch (error) {
            console.error(`Error invoking function ${func.function}:`, error);
            functionCallResults.push({ function: func.function, status: 'error', error: error.message });
          }
        }
      }

      if (returnValueRequired && hasFunctionCalls) {
        // If the AI needs the function results back, send them
        const resultMessage = {
          sender: 'user', // Sent as 'user' for context
          text: `Function call results:\n${JSON.stringify(functionCallResults, null, 2)}`,
          isSystem: true // This message is for AI context, not for display
        };

        // The original AI message and the results are added to history for the next turn
        const historyForNextTurn = [
          ...messageHistory,
          { sender: 'ai', text: aiResponseText, isSystem: true },
          resultMessage
        ];

        const nextAiResponse = await chatInteractor.getAIResponse(historyForNextTurn);
        await processAIResponse(nextAiResponse, historyForNextTurn); // Recursively process the next response
      } else if (messageRequired && message) {
        // If no return value is needed, but a message should be shown
        setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: message }]);
      }

    } catch (error) {
      // If the response is not a valid JSON or another error occurs, display the raw text
      console.error("Error parsing or processing AI response:", error);
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponseText }]);
    }
  };

  const handleSend = async () => {
    if ((input.trim() === '' && !selectedImage) || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: input,
      image: selectedImage
    };

    const currentMessageHistory = [...messages, userMessage];
    setMessages(currentMessageHistory);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const aiResponse = await chatInteractor.getAIResponse(currentMessageHistory, selectedImage);
      await processAIResponse(aiResponse, currentMessageHistory);
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
      </div>
      <div className="chat-messages">
        {messages.filter(msg => !msg.isSystem).map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div className="message-content">
              {msg.image && msg.sender === 'user' && (
                <div className="message-image">
                  <img src={`file://${msg.image}`} alt="用户发送的图片" />
                </div>
              )}
              {msg.sender === 'ai' ? (
                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
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
