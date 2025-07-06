import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LeadDashboard from "pages/lead-dashboard";
import Login from "pages/login";
import LeadInteractionModal from "pages/lead-interaction-modal";
import WorkflowBuilder from "pages/workflow-builder";
import CreateLead from "pages/create-lead";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lead-dashboard" element={<LeadDashboard />} />
        <Route path="/admin-dashboard" element={<LeadDashboard />} />
        <Route path="/sales-dashboard" element={<LeadDashboard />} />
        <Route path="/manager-dashboard" element={<LeadDashboard />} />
        <Route path="/lead-interaction-modal" element={<LeadInteractionModal />} />
        <Route path="/workflow-builder" element={<WorkflowBuilder />} />
        <Route path="/create-lead" element={<CreateLead />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;