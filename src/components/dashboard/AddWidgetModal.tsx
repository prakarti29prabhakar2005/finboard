'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WidgetType, WidgetDataConfig } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchWidgetData } from '@/lib/api';
import { Loader2, AlertCircle, LayoutGrid, Table as TableIcon, LineChart, Search, Eye, Plus, X } from 'lucide-react';
import { flattenObject, FlattenedField } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddWidgetModal({ isOpen, onClose }: AddWidgetModalProps) {
  const { addWidget, updateWidget, editingWidget, setEditingWidget } = useDashboardStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [flattenedFields, setFlattenedFields] = useState<FlattenedField[]>([]);

  // Form State
  const [name, setName] = useState('Bitcoin');
  const [url, setUrl] = useState('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  const [interval, setInterval] = useState(30);
  const [type, setType] = useState<WidgetType>('card');
  
  // Advanced Selection State
  const [fieldSearch, setFieldSearch] = useState('');
  const [showArraysOnly, setShowArraysOnly] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>(''); // For single value widgets (Card/Chart primary)
  const [selectedTableFields, setSelectedTableFields] = useState<string[]>([]); // For table columns


  // Auto-fetch data on open if editing (optional UX improvement)
  // We'll stick to manual "Test" for now to avoid accidental API spam, unless user wants it.
  
  const handleTestConnection = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWidgetData(url);
      setFetchedData(data);
      setFlattenedFields(flattenObject(data));
      
      // Auto-select logic only if NOT editing or if empty
      if (!editingWidget && !selectedPath) setSelectedPath('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Determine config based on type
    const config: WidgetDataConfig = {
        pathToData: selectedPath,
        fields: type === 'table' ? selectedTableFields.map(f => ({ key: f, label: f.split('.').pop() || f })) : undefined,
        limit: (editingWidget?.dataConfig?.limit) || undefined // Persist limit if exists
    };

    if (editingWidget) {
        updateWidget(editingWidget.id, {
            title: name,
            type,
            apiEndpoint: url,
            refreshInterval: interval,
            dataConfig: config,
            // Don't overwrite layout unless necessary? Let's keep existing layout.
        });
    } else {
        addWidget({
            title: name,
            type,
            apiEndpoint: url,
            refreshInterval: interval,
            dataConfig: config,
            layout: { 
                w: type === 'table' ? 4 : 1, 
                h: 1 
            } 
        });
    }
    
    handleClose();
  };

  const handleClose = () => {
      setEditingWidget(null);
      onClose();
  };

  const filteredFields = useMemo(() => {
     return flattenedFields.filter(f => {
        const matchesSearch = f.path.toLowerCase().includes(fieldSearch.toLowerCase());
        const matchesType = showArraysOnly ? f.type === 'array' : true;
        return matchesSearch && matchesType;
     });
  }, [flattenedFields, fieldSearch, showArraysOnly]);

  const toggleTableField = (path: string) => {
      if (selectedTableFields.includes(path)) {
          setSelectedTableFields(prev => prev.filter(p => p !== path));
      } else {
          setSelectedTableFields(prev => [...prev, path]);
      }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editingWidget ? "Edit Widget" : "Add New Widget"} className="w-[95%] sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col">
      <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar flex-1">
        
        {/* Top Section: Name */}
        <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Widget Name</label>
            <Input 
                placeholder="e.g., Bitcoin Price Tracker" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-gray-900/50 border-gray-800 focus:border-emerald-500/50"
            />
        </div>

        {/* API URL Section */}
        <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">API URL</label>
            <div className="flex gap-2">
                <Input 
                    placeholder="https://api.example.com/data" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    className="bg-gray-900/50 border-gray-800 font-mono text-xs text-emerald-400"
                />
                <Button onClick={handleTestConnection} disabled={loading || !url} className="min-w-[80px]">
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <><Eye className="w-4 h-4 mr-2"/> Test</>}
                </Button>
            </div>
            
            {fetchedData && !error && (
                <div className="mt-2 bg-emerald-950/30 border border-emerald-900/50 rounded-md p-2 flex items-center gap-2 text-emerald-400 text-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    API connection successful! {Object.keys(fetchedData).length} top-level fields found.
                </div>
            )}
             {error && (
                <div className="mt-2 bg-red-950/30 border border-red-900/50 rounded-md p-2 flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle size={12}/> {error}
                </div>
            )}
        </div>

        {/* Refresh Interval */}
        <div>
             <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Refresh Interval (seconds)</label>
             <Input 
                type="number" 
                min={5} 
                value={interval} 
                onChange={(e) => setInterval(Number(e.target.value))}
                className="bg-gray-900/50 border-gray-800" 
            />
        </div>

        {/* If editing, show hint to re-test to see fields */}
        {editingWidget && !fetchedData && (
            <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded text-blue-400 text-xs">
                To change data fields, click <b>Test</b> above to re-fetch the API schema.
            </div>
        )}

        {(fetchedData || editingWidget) && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="h-px bg-gray-800 w-full" />
                
                {/* Display Mode */}
                <div>
                     <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Select Fields to Display</label>
                     <p className="text-gray-500 text-xs mb-2">Display Mode</p>
                     <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-800 w-fit">
                        {[
                            { id: 'card', icon: LayoutGrid, label: 'Card' },
                            { id: 'table', icon: TableIcon, label: 'Table' },
                            { id: 'chart', icon: LineChart, label: 'Chart' }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setType(mode.id as WidgetType)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    type === mode.id 
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                )}
                            >
                                <mode.icon size={14} /> {mode.label}
                            </button>
                        ))}
                     </div>
                </div>

                {fetchedData && (
                <>
                    {/* Field Search */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500">Search Fields</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input 
                                placeholder="Search for fields..." 
                                value={fieldSearch}
                                onChange={(e) => setFieldSearch(e.target.value)}
                                className="pl-9 bg-gray-900/50 border-gray-800"
                            />
                        </div>
                    </div>

                    {/* Arrays Only Checkbox */}
                     <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer w-fit">
                        <input 
                            type="checkbox" 
                            checked={showArraysOnly} 
                            onChange={(e) => setShowArraysOnly(e.target.checked)}
                            className="rounded border-gray-700 bg-gray-900 text-emerald-600 focus:ring-emerald-500/50"
                        />
                        Show arrays only (for table view)
                    </label>

                    {/* Available Fields List */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Fields</label>
                            <div className="bg-gray-950/30 border border-gray-800 rounded-lg max-h-[200px] overflow-y-auto custom-scrollbar">
                                {filteredFields.map((field) => {
                                    const isSelected = type === 'table' ? selectedTableFields.includes(field.path) : selectedPath === field.path;
                                    return (
                                        <div 
                                            key={field.path} 
                                            onClick={() => type === 'table' ? toggleTableField(field.path) : setSelectedPath(field.path)}
                                            className={cn(
                                                "flex items-center justify-between p-3 border-b border-gray-800/50 last:border-0 cursor-pointer transition-colors group",
                                                isSelected ? "bg-emerald-900/10" : "hover:bg-gray-900/50"
                                            )}
                                        >
                                            <div className="flex flex-col overflow-hidden">
                                                <span className={cn("text-xs font-mono truncate", isSelected ? "text-emerald-400" : "text-gray-300")}>
                                                    {field.path}
                                                </span>
                                                <span className="text-[10px] text-gray-600 truncate">
                                                    {field.type} | <span className="text-gray-500">{String(field.value).slice(0, 50)}</span>
                                                </span>
                                            </div>
                                            <div className={cn(
                                                "h-6 w-6 rounded flex items-center justify-center transition-colors",
                                                isSelected ? "bg-emerald-600 text-white" : "text-gray-600 bg-gray-900 group-hover:text-emerald-400"
                                            )}>
                                                {isSelected ? <X size={12}/> : <Plus size={12}/>}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredFields.length === 0 && (
                                    <div className="p-4 text-center text-xs text-gray-500">No fields match your search</div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
                )}

                {/* Selected Fields Preview */}
                <div>
                     <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Selected Fields (Preview)</label>
                     <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-2 min-h-[40px] flex flex-wrap gap-2">
                        {type === 'table' ? (
                             selectedTableFields.length > 0 ? (
                                selectedTableFields.map(f => (
                                    <span key={f} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-xs">
                                        {f} <X className="cursor-pointer hover:text-white" size={10} onClick={() => toggleTableField(f)}/>
                                    </span>
                                ))
                             ) : <span className="text-xs text-gray-600 italic px-2">No fields selected</span>
                        ) : (
                            selectedPath ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-xs w-full justify-between">
                                     {selectedPath} <X className="cursor-pointer hover:text-white" size={12} onClick={() => setSelectedPath('')}/>
                                </span>
                            ) : <span className="text-xs text-gray-600 italic px-2">No field selected</span>
                        )}
                     </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <Button variant="ghost" onClick={handleClose} className="text-gray-400 hover:text-white">Cancel</Button>
                    <Button onClick={handleSave} disabled={(!selectedPath && selectedTableFields.length === 0)} className="bg-emerald-600 hover:bg-emerald-700 min-w-[100px]">
                        {editingWidget ? "Save Changes" : "Add Widget"}
                    </Button>
                </div>

            </div>
        )}
      </div>
    </Modal>
  );
}
