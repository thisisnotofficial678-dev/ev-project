import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: LucideIcon;
  color: 'cyan' | 'purple' | 'pink' | 'yellow';
}

const colorClasses = {
  cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
  purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
  pink: 'bg-gradient-to-r from-pink-500 to-pink-600',
  yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
};

const borderClasses = {
  cyan: 'border-cyan-500/20',
  purple: 'border-purple-500/20',
  pink: 'border-pink-500/20',
  yellow: 'border-yellow-500/20',
};

const titleClasses = {
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  pink: 'text-pink-400',
  yellow: 'text-yellow-400',
};

const changeClasses = {
  positive: 'text-cyan-400',
  negative: 'text-red-400',
};

export function OverviewCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color 
}: OverviewCardProps) {
  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg p-6 border ${borderClasses[color]} hover:shadow-xl transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${titleClasses[color]}`}>{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${changeType ? changeClasses[changeType] : 'text-gray-400'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}