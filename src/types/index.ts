export type WidgetType = 'card' | 'table' | 'chart';
export type ValueFormat = 'number' | 'currency' | 'percentage' | 'text';


export interface APIConfig {
  endpoint: string;
  refreshInterval: number; // seconds
}

export interface WidgetLayout {
  w: number;
  h: number;
}

export interface WidgetDataConfig {
  pathToData: string; // "bitcoin.usd" or "0.price"
  labelField?: string; // For charts/tables (e.g., "date")
  valueField?: string; // For charts (e.g., "price")
  fields?: { key: string; label: string }[]; // For tables
  limit?: number; // For tables, max rows
  ranges?: { label: string; value: string }[]; // For chart intervals (e.g. [{label: '1D', value: '1'}])
  chartType?: 'area' | 'line' | 'candle'; // Desired chart style
  valueFormat?: ValueFormat; // Formatting for values
}

// ---------------------------------------------------------------------------
// WebSocket configuration used by live‑stream widgets (e.g., Binance ticker)
// ---------------------------------------------------------------------------
export interface WsConfig {
  /** WebSocket endpoint URL */
  url: string;
  /** Optional transformation applied to incoming messages */
  transform?: {
    /** Path (dot‑notation) to the value you want to extract from the message */
    valuePath: string;
  };
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  apiEndpoint: string;
  refreshInterval: number; // seconds
  dataConfig: WidgetDataConfig;
  layout?: WidgetLayout;
  /** Optional WebSocket configuration for live‑stream widgets */
  wsConfig?: WsConfig;
}

export interface DashboardState {
  widgets: Widget[];
  isEditMode: boolean;
  theme: 'light' | 'dark';
  editingWidget: Widget | null;
  addWidget: (widget: Omit<Widget, 'id'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  reorderWidgets: (newOrder: Widget[]) => void;
  toggleEditMode: () => void;
  toggleTheme: () => void;
  setEditingWidget: (widget: Widget | null) => void;
  setWidgets: (widgets: Widget[]) => void;
}
