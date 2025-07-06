import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import LeadTable from './components/LeadTable';
import FilterButtons from './components/FilterButtons';
import ChatModal from './components/ChatModal';
import StatsCards from './components/StatsCards';
import Icon from '../../components/AppIcon';
import apiService from '../../services/api';

const LeadDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  // Load leads from API
  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const leadsData = await apiService.getLeads();
      setLeads(leadsData);
      setFilteredLeads(leadsData);
    } catch (error) {
      console.error('Failed to load leads:', error);
      showToast('Failed to load leads. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication and get user role
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    
    setUserRole(role || 'sales');
    
    // Load leads from API
    loadLeads();
  }, [navigate]);

  useEffect(() => {
    filterLeads();
  }, [leads, activeFilter]);

  const filterLeads = () => {
    let filtered = leads;
    
    switch (activeFilter) {
      case 'new':
        filtered = leads.filter(lead => lead.status === 'New');
        break;
      case 'contacted':
        filtered = leads.filter(lead => lead.status === 'Contacted');
        break;
      default:
        filtered = leads;
    }
    
    setFilteredLeads(filtered);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      await apiService.updateLeadStatus(leadId, newStatus);
      
      // Update local state
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      
      showToast(`Lead status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Failed to update lead status:', error);
      showToast('Failed to update lead status', 'error');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      await apiService.deleteLead(leadId);
      
      // Update local state
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
      showToast('Lead deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete lead:', error);
      showToast('Failed to delete lead', 'error');
    }
  };

  const handleInteract = (lead) => {
    setSelectedLead(lead);
    setIsChatModalOpen(true);
  };

  const handleLLMInteraction = async (prompt) => {
    if (!selectedLead) return;

    try {
      const response = await apiService.interactWithLead(selectedLead.id, prompt);
      return response;
    } catch (error) {
      console.error('LLM interaction failed:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const getLeadCounts = () => {
    return {
      total: leads.length,
      new: leads.filter(lead => lead.status === 'New').length,
      contacted: leads.filter(lead => lead.status === 'Contacted').length
    };
  };

  const getStats = () => {
    const counts = getLeadCounts();
    const conversionRate = counts.total > 0 ? Math.round((counts.contacted / counts.total) * 100) : 0;
    
    return {
      ...counts,
      conversionRate
    };
  };

  const getDashboardTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Dashboard';
      case 'manager':
        return 'Manager Dashboard';
      case 'sales':
      default:
        return 'Sales Dashboard';
    }
  };

  const getDashboardDescription = () => {
    switch (userRole) {
      case 'admin':
        return 'Manage leads, workflows, and system configuration';
      case 'manager':
        return 'Monitor team performance and lead pipeline';
      case 'sales':
      default:
        return 'Track and manage your leads effectively';
    }
  };

  // Refresh leads when returning to dashboard
  useEffect(() => {
    const handleFocus = () => {
      loadLeads();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header with Role-based Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-text-primary">{getDashboardTitle()}</h1>
                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {userRole?.toUpperCase() || 'USER'}
                </span>
              </div>
              <p className="text-text-secondary">
                {getDashboardDescription()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link to="/create-lead">
                <Button variant="primary" iconName="Plus" iconPosition="left">
                  Create Lead
                </Button>
              </Link>
              {userRole === 'admin' && (
                <Link to="/workflow-builder">
                  <Button variant="secondary" iconName="Workflow" iconPosition="left">
                    Workflows
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={getStats()} />

          {/* Filter Buttons */}
          <FilterButtons
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            leadCounts={getLeadCounts()}
          />

          {/* Lead Table */}
          <LeadTable
            leads={filteredLeads}
            onUpdateStatus={handleUpdateStatus}
            onDeleteLead={handleDeleteLead}
            onInteract={handleInteract}
          />

          {/* Floating Action Button for Mobile */}
          <div className="fixed bottom-6 right-6 md:hidden">
            <Link to="/create-lead">
              <Button
                variant="primary"
                shape="circle"
                size="lg"
                iconName="Plus"
                className="shadow-lg"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Modal for LLM Interaction */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSendMessage={handleLLMInteraction}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default LeadDashboard;