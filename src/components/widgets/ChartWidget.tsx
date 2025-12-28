'use client';

import { useMemo } from 'react';
import { Widget } from '@/types';
import { Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { formatValue } from '@/lib/utils';

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
      return data.prices.map((item: [number, number]) => {
        const [timestamp, price] = item;
        return {
          date: new Date(timestamp).toLocaleDateString(),
          value: price,
          ...item // spread array to get '0', '1', etc.
        };
      });
    }
    
    // Handle generic array
    if (Array.isArray(data)) {
        if (data.length === 0) return [];
        
        // If it's an array of arrays (e.g. [[ts, price], ...])
        if (Array.isArray(data[0])) {
             return data.map((item: any) => {
                 const ts = item[0]; 
                 const val = item[1];
                 const isTimestamp = typeof ts === 'number' && ts > 1000000000;
                 
                 return { 
                    date: isTimestamp ? new Date(ts).toLocaleDateString() : String(ts), 
                    value: val,
                    ...item
                 };
             });
        }
        
        // If it's an array of objects, just pass through
        return data; 
    }
    
    return [];
  }, [data]);
  
  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;
  if (error) return <div className="text-red-500 text-sm">Error loading data</div>;
  if (chartData.length === 0) return <div className="text-gray-500 p-4">No chart data</div>;

  const xKey = (chartData[0] && 'date' in chartData[0]) ? 'date' : (widget.dataConfig.labelField || Object.keys(chartData[0] || {})[0]);
  const yKey = widget.dataConfig.valueField || (chartData[0] && 'value' in chartData[0] ? 'value' : Object.keys(chartData[0] || {})[1]);

  // Determine which chart component to use based on the widget's chartType
  const chartType = widget.dataConfig.chartType || 'area';

  const commonTooltipProps = {
    contentStyle: { backgroundColor: "#0f172a", borderColor: "#1f2937", color: "#f3f4f6", borderRadius: "8px", fontSize: "12px" },
    itemStyle: { color: "#10b981", padding: "0" },
    labelStyle: { marginBottom: "4px", fontWeight: "bold", color: "#94a3b8" },
    formatter: (val: any) => [formatValue(val, widget.dataConfig.valueFormat), 'Value']
  };

  const ChartComponent = (() => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey={xKey} hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip {...commonTooltipProps} />
            <Line type="monotone" dataKey={yKey} stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#10b981" }} />
          </LineChart>
        );
      case 'candle':
        // Placeholder: using AreaChart for now
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
            <Tooltip {...commonTooltipProps} />
            <Area type="monotone" dataKey={yKey} stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
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
            <Tooltip {...commonTooltipProps} />
            <Area type="monotone" dataKey={yKey} stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
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
      <div className="mt-1 pt-1 border-t border-gray-800/50 flex justify-between items-center px-1 text-[9px] text-gray-600 font-mono">
        <span>{chartData[0]?.[xKey]} - {chartData[chartData.length - 1]?.[xKey]}</span>
        <span>Updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}</span>
      </div>
    </div>
  );
}
