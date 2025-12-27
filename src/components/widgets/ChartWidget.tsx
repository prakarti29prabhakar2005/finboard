'use client';

import { useMemo } from 'react';
import { Widget } from '@/types';
import { Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
interface ChartWidgetProps {
  widget: Widget;
  data: any;
  isLoading: boolean;
  error: any;
  dataUpdatedAt?: number;
}

export function ChartWidget({ widget, data, isLoading, error, dataUpdatedAt }: ChartWidgetProps) {
  // Transform data if it's in Coingecko format (prices: [[timestamp, price], ...])
  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Handle Coingecko market_chart format
    if (data.prices && Array.isArray(data.prices)) {
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        value: price
      }));
    }
    
    // Handle generic array
    if (Array.isArray(data)) {
        // If it's an array of arrays (e.g. [[ts, price], [ts, price]])
        if (Array.isArray(data[0])) {
             return data.map((item: any) => {
                 // Try to guess timestamp and value
                 const ts = item[0]; 
                 const val = item[1];
                 // If item[0] looks like a timestamp (big number), use it
                 if (typeof ts === 'number' && ts > 1000000000) {
                     return { date: new Date(ts).toLocaleDateString(), value: val };
                 }
                 return { x: ts, value: val };
             });
        }
        return data; 
    }
    
    return [];
  }, [data]);
  
  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;
  if (error) return <div className="text-red-500 text-sm">Error loading data</div>;
  if (chartData.length === 0) return <div className="text-gray-500 p-4">No chart data</div>;

  const xKey = widget.dataConfig.labelField || (chartData[0] && 'date') || Object.keys(chartData[0] || {})[0];
  const yKey = widget.dataConfig.valueField || (chartData[0] && 'value') || Object.keys(chartData[0] || {})[1];

  // Determine which chart component to use based on the widget's chartType
  const chartType = widget.dataConfig.chartType || 'area';

  const ChartComponent = (() => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey={xKey} hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1f2937", color: "#f3f4f6" }}
              itemStyle={{ color: "#10b981" }}
            />
            <Line type="monotone" dataKey={yKey} stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
          </LineChart>
        );
      case 'candle':
        // Placeholder: using AreaChart for now; a real candlestick chart would need high/low/open/close data
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey={xKey} hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1f2937", color: "#f3f4f6" }}
              itemStyle={{ color: "#10b981" }}
            />
            <Area type="monotone" dataKey={yKey} stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        );
      default:
        // default to area chart
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey={xKey} hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1f2937", color: "#f3f4f6" }}
              itemStyle={{ color: "#10b981" }}
            />
            <Area type="monotone" dataKey={yKey} stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        );
    }
  })();

  return (
    <div className="h-full w-full p-2 flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {ChartComponent}
        </ResponsiveContainer>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-800 text-[10px] text-gray-600 text-center font-mono">
        Last updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'}
      </div>
    </div>
  );
}
