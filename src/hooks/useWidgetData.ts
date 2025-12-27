import { useQuery } from '@tanstack/react-query';
import { Widget } from '@/types';
import { fetchWidgetData } from '@/lib/api';
import { getNestedValue } from '@/lib/utils';

export function useWidgetData(widget: Widget, overrideUrl?: string) {
  const finalUrl = overrideUrl || widget.apiEndpoint;
  
  return useQuery({
    queryKey: ['widget', widget.id, finalUrl], // Include URL in key to trigger re-fetch on change
    queryFn: async () => {
      const data = await fetchWidgetData(finalUrl);
      
      // Basic data mapping logic
      const config = widget.dataConfig;
      
      // Navigate to the root of the data we care about
      const rootData = getNestedValue(data, config.pathToData);

      // If we need to map specific fields (for tables)
      if (widget.type === 'table' && Array.isArray(rootData)) {
         return rootData.map((item: any) => {
            const row: any = {};
            // If fields are defined, pick them
            if (config.fields && config.fields.length > 0) {
                config.fields.forEach(field => {
                    row[field.key] = getNestedValue(item, field.key);
                });
                return row;
            }
            return item;
         }).slice(0, 10); // Limit to 10 for now
      }

      // For cards/charts, we might want specific values
      if (widget.type === 'card' || widget.type === 'chart') {
         // This is highly dependent on API structure, but for now return root or specific field
         return rootData ?? null; // Ensure we don't return undefined
      }
      
      return rootData ?? null;
    },
    refetchInterval: widget.refreshInterval * 1000,
  });
}
