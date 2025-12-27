import { useState, useMemo } from 'react';
import { Widget } from '@/types';
import { Loader2, ArrowUpDown, Search, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDashboardStore } from '@/store/useDashboardStore';

interface WidgetProps {
  widget: Widget;
  data: any;
  isLoading: boolean;
  error: any;
  dataUpdatedAt: number;
}

export function TableWidget({ widget, data, isLoading, error, dataUpdatedAt }: WidgetProps) {
  const updateWidget = useDashboardStore(state => state.updateWidget);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const items = useMemo(() => {
     if (!Array.isArray(data)) return [];
     let result = [...data];

     // Filter
     if (searchTerm) {
         const lowerTerm = searchTerm.toLowerCase();
         result = result.filter(item => 
             Object.values(item).some(val => 
                 String(val).toLowerCase().includes(lowerTerm)
             )
         );
     }

     // Sort
     if (sortConfig) {
         result.sort((a, b) => {
             const aVal = a[sortConfig.key];
             const bVal = b[sortConfig.key];

             if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
             if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
             return 0;
         });
     }

     return result;
  }, [data, searchTerm, sortConfig]);

  const handleSort = (key: string) => {
      setSortConfig(current => {
          if (current?.key === key) {
              return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
          }
          return { key, direction: 'asc' };
      });
  };

  const handleLimitChange = (val: string) => {
      const limit = parseInt(val);
      if (!isNaN(limit) && limit > 0) {
          updateWidget(widget.id, { 
              dataConfig: { ...widget.dataConfig, limit } 
          });
      }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;
  if (error) return <div className="text-red-500 text-sm">Error loading data</div>;

  if (items.length === 0) return <div className="text-gray-500 p-4">No data available</div>;

  // Auto-discover headers if fields not provided
  const headers = widget.dataConfig.fields?.length 
    ? widget.dataConfig.fields 
    : Object.keys(items[0] || (Array.isArray(data) ? data[0] : {}) || {}).map(k => ({ key: k, label: k }));

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50">
        
        {/* Table Controls */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="relative w-full sm:flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-3 w-3" />
                <Input 
                    placeholder="Search table..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-8 w-full bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
            </div>
            
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                 <div className="flex items-center gap-1 bg-white dark:bg-gray-800/50 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] text-gray-500 uppercase">Show</span>
                    <input 
                        className="w-8 bg-transparent text-xs text-center text-gray-900 dark:text-white focus:outline-none"
                        value={widget.dataConfig.limit || 10}
                        onChange={(e) => handleLimitChange(e.target.value)}
                        type="number"
                        min="1"
                        max="100"
                    />
                 </div>
                 <div className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    {items.length} items
                 </div>
            </div>
        </div>

        <div className="flex-1 overflow-auto w-full custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400 sticky top-0 z-10 shadow-sm">
              <tr>
                {headers.slice(0, 6).map((h) => (
                  <th 
                    key={h.key} 
                    className="px-4 py-3 font-medium bg-gray-100/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors group select-none"
                    onClick={() => handleSort(h.key)}
                  >
                    <div className="flex items-center gap-1">
                        {h.label}
                        <ArrowUpDown size={10} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortConfig?.key === h.key ? 'opacity-100 text-emerald-500' : ''}`} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800/50">
              {items.slice(0, widget.dataConfig.limit || 10).map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors">
                  {headers.slice(0, 6).map((h) => (
                    <td key={h.key} className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {(() => {
                            const val = item[h.key];
                            if (typeof val === 'string' && (val.startsWith('http') && (val.includes('.png') || val.includes('.jpg') || val.includes('.jpeg')))) {
                                return <img src={val} alt={h.label} className="h-6 w-6 rounded-full" />;
                            }
                            return typeof val === 'object' ? '...' : val;
                        })()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-gray-800 text-[10px] text-gray-400 dark:text-gray-600 text-center font-mono bg-gray-50 dark:bg-transparent">
            Last updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'}
        </div>
    </div>
  );
}
