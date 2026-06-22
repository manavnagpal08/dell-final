'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean } | string;
  description?: string;
  accentColor?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'teal';
  valueClassName?: string;
  onClick?: () => void;
}

export function MetricCard({
  title, value, icon, trend, description,
  accentColor = 'blue', valueClassName, onClick,
}: MetricCardProps) {
  const accentBorder = {
    blue:  'border-l-blue-500',
    green: 'border-l-emerald-500',
    red:   'border-l-red-500',
    amber: 'border-l-amber-500',
    purple: 'border-l-purple-500',
    teal:  'border-l-teal-500',
  }[accentColor];

  const iconColor = {
    blue:  'text-blue-600 bg-blue-50',
    green: 'text-emerald-600 bg-emerald-50',
    red:   'text-red-600 bg-red-50',
    amber: 'text-amber-600 bg-amber-50',
    purple: 'text-purple-600 bg-purple-50',
    teal:  'text-teal-600 bg-teal-50',
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-slate-200 border-l-[6px] rounded-2xl p-5 flex items-center gap-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 relative overflow-hidden group', 
        accentBorder, 
        onClick && 'cursor-pointer hover:-translate-y-1'
      )}
    >
      <div className={cn('p-4 rounded-full shrink-0 shadow-inner', iconColor)}>
        {icon}
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-slate-700 tracking-tight">{title}</h3>
        <p className={cn('text-3xl font-black tracking-tight text-slate-900 mt-1', valueClassName)}>
          {value}
        </p>
        
        {typeof trend === 'object' ? (
          <div className={cn('flex items-center gap-1 text-xs font-semibold mt-1', trend.isPositive ? 'text-emerald-500' : 'text-red-500')}>
            {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(trend.value)}% vs last week</span>
          </div>
        ) : typeof trend === 'string' ? (
          <p className="text-xs text-slate-500 mt-1 font-medium">{trend}</p>
        ) : null}
        
        {description && <p className="text-[11px] text-slate-500 mt-1 font-medium">{description}</p>}
      </div>
    </div>
  );
}
