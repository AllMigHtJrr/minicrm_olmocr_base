import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || isSending) return;
    
    const messageToSend = message.trim();
    setMessage('');
    setIsSending(true);
    
    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || isSending}
            className="resize-none"
            maxLength={1000}
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim() || disabled || isSending}
          loading={isSending}
          iconName="Send"
          iconSize={16}
          className="flex-shrink-0"
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </form>
      
      <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{message.length}/1000</span>
      </div>
    </div>
  );
};

export default ChatInput;