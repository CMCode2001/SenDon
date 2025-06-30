import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const colorClasses = {
  primary: 'bg-primary-50 text-primary-600 border-primary-100',
  secondary: 'bg-secondary-50 text-secondary-600 border-secondary-100',
  accent: 'bg-accent-50 text-accent-600 border-accent-100',
  success: 'bg-green-50 text-green-600 border-green-100',
  warning: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  error: 'bg-red-50 text-red-600 border-red-100',
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'primary' 
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        <div className={`
          p-3 rounded-xl border
          ${colorClasses[color]}
        `}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}