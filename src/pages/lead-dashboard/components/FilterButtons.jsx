import React from 'react';
import Button from '../../../components/ui/Button';

const FilterButtons = ({ activeFilter, onFilterChange, leadCounts }) => {
  const filters = [
    { key: 'all', label: 'All Leads', count: leadCounts.total },
    { key: 'new', label: 'New', count: leadCounts.new },
    { key: 'contacted', label: 'Contacted', count: leadCounts.contacted }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? 'primary' : 'outline'}
          onClick={() => onFilterChange(filter.key)}
          className="flex items-center space-x-2"
        >
          <span>{filter.label}</span>
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${activeFilter === filter.key 
              ? 'bg-white/20 text-white' :'bg-gray-100 text-gray-600'
            }
          `}>
            {filter.count}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons;