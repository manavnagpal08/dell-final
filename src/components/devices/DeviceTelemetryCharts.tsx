'use client';

import { TelemetryRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { CHART_COLORS } from '@/constants';

interface DeviceTelemetryChartsProps {
  data: TelemetryRecord[];
}

export function DeviceTelemetryCharts({ data }: DeviceTelemetryChartsProps) {
  // Sort data by time
  const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const chartData = sortedData.map(d => ({
    ...d,
    time: format(new Date(d.timestamp), 'HH:mm')
  }));

  const renderChart = (title: string, dataKey: keyof TelemetryRecord, color: string, unit: string) => (
    <Card className="shadow-sm">
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(value: any) => [`${value} ${unit}`, title]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line type="monotone" dataKey={dataKey as string} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {renderChart('Temperature', 'temperature', CHART_COLORS.CRITICAL, '°C')}
      {renderChart('Fan Speed', 'fan_rpm', CHART_COLORS.PRIMARY, 'RPM')}
      {renderChart('Voltage', 'voltage', CHART_COLORS.WARNING, 'V')}
      {renderChart('Power Usage', 'power_usage', CHART_COLORS.INFO, 'W')}
    </div>
  );
}
