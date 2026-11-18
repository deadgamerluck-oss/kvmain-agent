import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary-50',
  subtitle
}) => {
  return (
    <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {(change || subtitle) && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              {change && (
                <span className={cn('font-semibold', isPositive ? 'text-emerald-600' : 'text-rose-600')}>
                  {change}
                </span>
              )}
              {subtitle && <span className="text-slate-500">{subtitle}</span>}
            </div>
          )}
        </div>
        <div className={cn('p-3.5 rounded-xl flex items-center justify-center', iconBg, iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
};
