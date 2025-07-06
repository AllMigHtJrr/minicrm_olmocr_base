import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Leads',
      value: stats.total,
      icon: 'Users',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'New Leads',
      value: stats.new,
      icon: 'UserPlus',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Contacted',
      value: stats.contacted,
      icon: 'Phone',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: 'TrendingUp',
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-card border border-border p-6 hover:shadow-floating transition-smooth"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <Icon name={card.icon} size={24} className={card.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;