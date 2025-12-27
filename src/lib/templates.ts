import { Widget } from '@/types';
import { generateId } from './utils';

export interface DashboardTemplate {
  name: string;
  description: string;
  widgets: Omit<Widget, 'id'>[];
}

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    name: 'Crypto Market Starter',
    description: 'Track Bitcoin, Ethereum, and top coins prices.',
    widgets: [
      {
        type: 'card',
        title: 'Bitcoin USD',
        apiEndpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        refreshInterval: 30,
        dataConfig: { pathToData: 'bitcoin.usd', valueFormat: 'currency' },
        layout: { w: 1, h: 1 }
      },
      {
        type: 'card',
        title: 'Ethereum USD',
        apiEndpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
        refreshInterval: 30,
        dataConfig: { pathToData: 'ethereum.usd', valueFormat: 'currency' },
        layout: { w: 1, h: 1 }
      },
      {
        type: 'table',
        title: 'Top Crypto Assets',
        apiEndpoint: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false',
        refreshInterval: 60,
        dataConfig: { 
            pathToData: '',
            fields: [
                { key: 'image', label: 'Icon' },
                { key: 'name', label: 'Name' },
                { key: 'current_price', label: 'Price' },
                { key: 'market_cap', label: 'Market Cap' },
                { key: 'price_change_percentage_24h', label: '24h %' }
            ],
            valueFormat: 'number'
        },
        layout: { w: 4, h: 1 }
      }
    ]
  },
  {
    name: 'Blue Chip Demo (IBM)',
    description: 'Demonstration of stock tracking using AlphaVantage (Demo Key).',
    widgets: [
      {
        type: 'card',
        title: 'IBM Corp',
        apiEndpoint: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo',
        refreshInterval: 60,
        dataConfig: { pathToData: 'Global Quote.05. price', valueFormat: 'currency' },
        layout: { w: 1, h: 1 }
      },
      {
        type: 'card',
        title: 'Bitcoin (Comparison)',
        apiEndpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        refreshInterval: 30,
        dataConfig: { pathToData: 'bitcoin.usd', valueFormat: 'currency' },
        layout: { w: 1, h: 1 }
      },
      {
        type: 'chart',
        title: 'Bitcoin Trend',
        apiEndpoint: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days={RANGE}', 
        refreshInterval: 300,
        dataConfig: { 
            pathToData: 'prices', 
            labelField: '0', 
            valueField: '1',
            ranges: [
                { label: '24H', value: '1' },
                { label: '7D', value: '7' },
                { label: '30D', value: '30' }
            ],
            valueFormat: 'currency'
        },
        layout: { w: 2, h: 1 }
      }
    ]
  },
  {
    name: 'Live Bitcoin Feed (WebSocket)',
    description: 'Real-time BTC price directly from Binance WebSocket stream.',
    widgets: [
      {
        type: 'card',
        title: 'BTC/USDT Live',
        apiEndpoint: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
        refreshInterval: 60,
        dataConfig: { pathToData: 'price', valueFormat: 'currency' }, 
        wsConfig: {
            url: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
            transform: { valuePath: 'p' }
        },
        layout: { w: 2, h: 1 }
      }
    ]
  }
];

export const getTemplateWidgets = (templateName: string): Widget[] => {
    const template = DASHBOARD_TEMPLATES.find(t => t.name === templateName);
    if (!template) return [];
    
    return template.widgets.map(w => ({
        ...w,
        id: generateId()
    }));
};
