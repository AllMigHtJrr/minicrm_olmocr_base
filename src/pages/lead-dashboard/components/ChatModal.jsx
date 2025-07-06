import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ChatModal = ({ isOpen, onClose, lead, onSendMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && lead) {
      // Initialize with a welcome message
      setMessages([
        {
          id: 1,
          type: 'system',
          content: `Chat session started for ${lead.name}. How can I assist you with this lead?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, lead]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !onSendMessage) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the real LLM API
      const response = await onSendMessage(currentMessage);
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.reply,
        timestamp: new Date(),
        leadContext: response.lead_context
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('LLM interaction failed:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        type: 'error',
        content: error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStyles = (type) => {
    switch (type) {
      case 'user':
        return 'bg-primary text-white ml-auto max-w-xs';
      case 'ai':
        return 'bg-gray-100 text-text-primary mr-auto max-w-xs';
      case 'system':
        return 'bg-yellow-50 text-yellow-800 mx-auto max-w-md text-center';
      case 'error':
        return 'bg-red-50 text-red-800 mx-auto max-w-md text-center';
      default:
        return 'bg-gray-100 text-text-primary mr-auto max-w-xs';
    }
  };

  const getSuggestedPrompts = () => {
    return [
      "What are the details for this lead?",
      "What's the next action for this lead?",
      "How should I follow up?",
      "What's the current status?",
      "Tell me about the lead source"
    ];
  };

  const handleSuggestedPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Assistant - ${lead.name}`}
      size="lg"
    >
      <div className="flex flex-col h-96">
        {/* Lead Info Header */}
        <div className="bg-surface p-4 rounded-lg mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={20} color="white" />
            </div>
            <div>
              <h3 className="font-medium text-text-primary">{lead.name}</h3>
              <p className="text-sm text-text-secondary">{lead.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {lead.status}
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {lead.source}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-text-secondary mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {getSuggestedPrompts().map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className={`p-3 rounded-lg ${getMessageStyles(message.type)}`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 text-text-secondary">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} />
              </div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Ask about this lead..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            variant="primary"
            iconName="Send"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;