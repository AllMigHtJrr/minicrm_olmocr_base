const API_BASE_URL = 'http://localhost:8001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Lead Management
  async getLeads() {
    return this.request('/leads');
  }

  async createLeadManual(leadData) {
    return this.request('/leads/manual', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async createLeadFromDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/leads/document`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }

  async updateLeadStatus(leadId, status) {
    return this.request(`/leads/${leadId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteLead(leadId) {
    return this.request(`/leads/${leadId}`, {
      method: 'DELETE',
    });
  }

  // LLM Interaction
  async interactWithLead(leadId, prompt) {
    return this.request('/interact', {
      method: 'POST',
      body: JSON.stringify({ id: leadId, prompt }),
    });
  }

  // Workflow Management
  async executeWorkflow(workflowData) {
    return this.request('/workflow', {
      method: 'POST',
      body: JSON.stringify(workflowData),
    });
  }

  async getWorkflows() {
    return this.request('/workflows');
  }

  async deleteWorkflow(workflowId) {
    return this.request(`/workflows/${workflowId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 