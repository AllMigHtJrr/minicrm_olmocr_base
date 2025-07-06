import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LeadTable = ({ leads, onUpdateStatus, onDeleteLead, onInteract }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = React.useMemo(() => {
    if (!sortConfig.key) return leads;

    return [...leads].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [leads, sortConfig]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (status === 'New') {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    }
    return `${baseClasses} bg-green-100 text-green-800`;
  };

  const getSourceBadge = (source) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    if (source === 'Manual') {
      return `${baseClasses} bg-gray-100 text-gray-700`;
    }
    return `${baseClasses} bg-purple-100 text-purple-700`;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={16} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              {[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'status', label: 'Status' },
                { key: 'source', label: 'Source' }
              ].map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-medium text-text-secondary cursor-pointer hover:bg-gray-50 transition-micro"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-sm font-medium text-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-surface transition-micro">
                <td className="px-6 py-4 text-sm font-medium text-text-primary">
                  {lead.name}
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {lead.email}
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {lead.phone}
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(lead.status)}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={getSourceBadge(lead.source)}>
                    {lead.source}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      iconName="MessageCircle"
                      onClick={() => onInteract(lead)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Chat
                    </Button>
                    <Button
                      variant="ghost"
                      iconName="Edit"
                      onClick={() => onUpdateStatus(lead.id, lead.status === 'New' ? 'Contacted' : 'New')}
                      className="text-green-600 hover:text-green-700"
                    >
                      Update
                    </Button>
                    <Button
                      variant="ghost"
                      iconName="Trash2"
                      onClick={() => onDeleteLead(lead.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {sortedLeads.map((lead) => (
          <div key={lead.id} className="bg-white border border-border rounded-lg p-4 shadow-card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-text-primary">{lead.name}</h3>
                <p className="text-sm text-text-secondary">{lead.email}</p>
                <p className="text-sm text-text-secondary">{lead.phone}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <span className={getStatusBadge(lead.status)}>
                  {lead.status}
                </span>
                <span className={getSourceBadge(lead.source)}>
                  {lead.source}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                iconName="MessageCircle"
                onClick={() => onInteract(lead)}
                className="text-blue-600"
              >
                Chat
              </Button>
              <Button
                variant="ghost"
                iconName="Edit"
                onClick={() => onUpdateStatus(lead.id, lead.status === 'New' ? 'Contacted' : 'New')}
                className="text-green-600"
              >
                Update
              </Button>
              <Button
                variant="ghost"
                iconName="Trash2"
                onClick={() => onDeleteLead(lead.id)}
                className="text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No leads found</h3>
          <p className="text-text-secondary">Get started by creating your first lead.</p>
        </div>
      )}
    </div>
  );
};

export default LeadTable;