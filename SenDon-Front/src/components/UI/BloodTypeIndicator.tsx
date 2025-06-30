import React from 'react';
import { GroupeSanguin } from '../../types';

interface BloodTypeIndicatorProps {
  type: GroupeSanguin;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const bloodTypeColors: Record<GroupeSanguin, string> = {
  'A+': 'bg-red-100 text-red-800 border-red-200',
  'A-': 'bg-red-50 text-red-700 border-red-100',
  'B+': 'bg-blue-100 text-blue-800 border-blue-200',
  'B-': 'bg-blue-50 text-blue-700 border-blue-100',
  'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
  'AB-': 'bg-purple-50 text-purple-700 border-purple-100',
  'O+': 'bg-green-100 text-green-800 border-green-200',
  'O-': 'bg-amber-100 text-amber-800 border-amber-200',
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export default function BloodTypeIndicator({ 
  type, 
  count, 
  size = 'md', 
  showCount = false 
}: BloodTypeIndicatorProps) {
  return (
    <div className={`
      inline-flex items-center space-x-2 rounded-full border font-medium
      ${bloodTypeColors[type]} ${sizes[size]}
    `}>
      <span className="font-bold">{type}</span>
      {showCount && count !== undefined && (
        <span className="bg-white bg-opacity-50 px-2 py-0.5 rounded-full text-xs">
          {count}
        </span>
      )}
    </div>
  );
}