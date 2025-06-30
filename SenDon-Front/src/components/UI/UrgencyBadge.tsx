import React from 'react';
import { AlertTriangle, Clock, Zap } from 'lucide-react';
import { NiveauUrgence } from '../../types';

interface UrgencyBadgeProps {
  niveau: NiveauUrgence;
  size?: 'sm' | 'md' | 'lg';
}

const urgencyConfig = {
  normal: {
    icon: Clock,
    label: 'Normal',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  urgent: {
    icon: AlertTriangle,
    label: 'Urgent',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  critique: {
    icon: Zap,
    label: 'Critique',
    className: 'bg-red-100 text-red-800 border-red-200 animate-pulse',
  },
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export default function UrgencyBadge({ niveau, size = 'md' }: UrgencyBadgeProps) {
  const config = urgencyConfig[niveau];
  const Icon = config.icon;

  return (
    <div className={`
      inline-flex items-center space-x-1 rounded-full border font-medium
      ${config.className} ${sizes[size]}
    `}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </div>
  );
}