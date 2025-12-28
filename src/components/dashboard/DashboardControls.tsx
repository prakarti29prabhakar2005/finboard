'use client';

import { useState, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { DASHBOARD_TEMPLATES, getTemplateWidgets } from '@/lib/templates';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Download, Upload, Layout, FileJson, AlertCircle } from 'lucide-react';

interface DashboardControlsProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DashboardControls({ isOpen, onClose }: DashboardControlsProps) {
    const { widgets, setWidgets } = useDashboardStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importError, setImportError] = useState<string | null>(null);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(widgets, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `finboard_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (Array.isArray(json)) {
                    // Basic validation could be improved
                    setWidgets(json);
                    setImportError(null);
                    onClose();
                } else {
                    setImportError("Invalid file format. Expected a JSON array of widgets.");
                }
            } catch (err) {
                setImportError("Failed to parse JSON file.");
            }
        };
        reader.readAsText(file);
        // Reset input so same file can be selected again
        event.target.value = '';
    };

    const handleLoadTemplate = (templateName: string) => {
        if (confirm("This will replace your current dashboard. Are you sure?")) {
            const newWidgets = getTemplateWidgets(templateName);
            setWidgets(newWidgets);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dashboard Settings" className="max-w-md">
            <div className="space-y-6">
                
                {/* Templates Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Templates</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {DASHBOARD_TEMPLATES.map(template => (
                            <button
                                key={template.name}
                                onClick={() => handleLoadTemplate(template.name)}
                                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group"
                            >
                                <div className="mt-1 p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-600 dark:text-emerald-400">
                                    <Layout size={16} />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {template.name}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        {template.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-800" />

                {/* Import/Export Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Data Management</h3>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleExport} className="flex-1 gap-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                            <Download size={16} /> Export JSON
                        </Button>
                        <Button variant="outline" onClick={handleImportClick} className="flex-1 gap-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                            <Upload size={16} /> Import JSON
                        </Button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept=".json" 
                            className="hidden" 
                        />
                    </div>
                    {importError && (
                        <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={12} /> {importError}
                        </div>
                    )}
                    <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 text-center">
                        Save your layout to a file or restore from a backup.
                    </p>
                </div>

            </div>
        </Modal>
    );
}
