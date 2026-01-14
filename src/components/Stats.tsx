import React from 'react';
import { TrendingUp, Package, Clock, CheckCircle2 } from 'lucide-react';

interface Stat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ComponentType<any>;
}

interface StatsProps {
  stats: Stat[];
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-[#8b4513]/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#8b4513]" />
              </div>
              {stat.change && (
                <span className={`text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export const defaultStats: Stat[] = [
  { label: 'Total Processed', value: '1,247', change: '+12%', trend: 'up', icon: Package },
  { label: 'Approved Today', value: '42', change: '+8%', trend: 'up', icon: CheckCircle2 },
  { label: 'Avg Time', value: '2.3s', change: '-15%', trend: 'up', icon: Clock },
  { label: 'Accuracy', value: '94%', change: '+3%', trend: 'up', icon: TrendingUp },
];
