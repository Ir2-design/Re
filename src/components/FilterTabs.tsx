import React from 'react';
import { Shield, Building, Calendar, Wrench, MessageSquare } from 'lucide-react';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const categories = [
  { id: 'all', label: 'Semua', icon: MessageSquare },
  { id: 'security', label: 'Keamanan', icon: Shield },
  { id: 'facility', label: 'Fasilitas', icon: Building },
  { id: 'event', label: 'Acara', icon: Calendar },
  { id: 'maintenance', label: 'Pemeliharaan', icon: Wrench }
];

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeFilter === category.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;