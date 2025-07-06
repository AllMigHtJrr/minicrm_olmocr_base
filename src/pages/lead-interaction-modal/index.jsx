import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import { Toast } from '../../components/ui/Toast';
import ChatHeader from './components/ChatHeader';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import ErrorBoundary from '../../components/ErrorBoundary';

const LeadInteractionModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract lead data from location state or URL params
  const leadData = location.state?.lead || null;
  const leadId = location.state?.leadId || new URLSearchParams(location.search).get('leadId');
  
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [lead, setLead] = useState(leadData);

  // Mock lead data if not provided
  const mockLeads = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      status: "New",
      source: "Manual"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      phone: "+1 (555) 987-6543",
      status: "Contacted",
      source: "Document"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@business.com",
      phone: "+1 (555) 456-7890",
      status: "Qualified",
      source: "Manual"
    }
  ];

  // Load lead data if not provided
  useEffect(() => {
    if (!lead && leadId) {
      const foundLead = mockLeads.find(l => l.id.toString() === leadId.toString());
      if (foundLead) {
        setLead(foundLead);
      } else {
        setToast({
          message: "Lead not found. Redirecting to dashboard...",
          type: "error"
        });
        setTimeout(() => navigate('/lead-dashboard'), 2000);
      }
    } else if (!lead && !leadId) {
      // Default to first lead for demo purposes
      setLead(mockLeads[0]);
    }
  }, [lead, leadId, navigate]);

  // Initialize conversation with AI greeting
  useEffect(() => {
    if (lead && messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome-' + Date.now(),
        content: `Hello! I'm here to help you with ${lead.name}. I can provide insights about this lead, suggest next steps, or help you plan your outreach strategy. What would you like to know?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [lead, messages.length]);

  const handleSendMessage = useCallback(async (messageContent) => {
    if (!messageContent.trim() || !lead) return;

    const userMessage = {
      id: 'user-' + Date.now(),
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API call to LLM service
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Mock AI responses based on message content
      let aiResponse = "";
      const lowerMessage = messageContent.toLowerCase();
      
      if (lowerMessage.includes('status') || lowerMessage.includes('update')) {
        aiResponse = `Based on ${lead.name}'s current status (${lead.status}), I recommend the following next steps:\n\n• If New: Send a personalized welcome email\n• If Contacted: Schedule a follow-up call within 2-3 days\n• If Qualified: Prepare a customized proposal\n\nWould you like me to help draft any of these communications?`;
      } else if (lowerMessage.includes('email') || lowerMessage.includes('contact')) {
        aiResponse = `For ${lead.name} (${lead.email}), here's a suggested email approach:\n\nSubject: "Following up on your interest"\n\nPersonalize the message based on their source (${lead.source}) and current status. Keep it concise and include a clear call-to-action. Would you like me to draft a specific email template?`;
      } else if (lowerMessage.includes('call') || lowerMessage.includes('phone')) {
        aiResponse = `For calling ${lead.name} at ${lead.phone}:\n\n• Best times: Tuesday-Thursday, 10-11 AM or 2-4 PM\n• Prepare 3-4 qualifying questions\n• Have their information ready: ${lead.source} source, ${lead.status} status\n• Keep initial call under 15 minutes\n\nWould you like me to suggest specific talking points?`;
      } else if (lowerMessage.includes('qualify') || lowerMessage.includes('questions')) {
        aiResponse = `Here are key qualifying questions for ${lead.name}:\n\n1. What's your current biggest challenge in [relevant area]?\n2. What's your timeline for making a decision?\n3. Who else is involved in the decision-making process?\n4. What's your budget range for this solution?\n5. What would success look like for you?\n\nThese will help determine if they're a good fit and ready to move forward.`;
      } else {
        aiResponse = `I understand you're asking about ${lead.name}. Based on their profile:\n\n• Contact: ${lead.email}, ${lead.phone}\n• Status: ${lead.status}\n• Source: ${lead.source}\n\nI can help with email templates, call scripts, qualification strategies, or next steps. What specific aspect would you like to focus on?`;
      }

      const aiMessage = {
        id: 'ai-' + Date.now(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setToast({
        message: "Failed to send message. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, [lead]);

  const handleCloseModal = () => {
    navigate('/lead-dashboard');
  };

  const handleToastClose = () => {
    setToast(null);
  };

  if (!lead) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading lead information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={true}
        onClose={handleCloseModal}
        size="lg"
        showCloseButton={false}
        closeOnBackdrop={false}
        closeOnEscape={true}
      >
        <div className="flex flex-col h-[80vh] max-h-[600px] -m-6">
          <ErrorBoundary>
            <ChatHeader lead={lead} onClose={handleCloseModal} />
            
            <ChatArea messages={messages} isLoading={isLoading} />
            
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isLoading}
            />
          </ErrorBoundary>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
    </>
  );
};

export default LeadInteractionModal;