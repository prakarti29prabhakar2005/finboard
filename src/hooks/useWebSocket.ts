import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
  enabled?: boolean;
  onMessage?: (data: any) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

type ConnectionStatus = 'CONNECTING' | 'OPEN' | 'CLOSED' | 'ERROR';

export function useWebSocket(url: string | undefined, options: UseWebSocketOptions = {}) {
  const { enabled = true, onMessage, reconnectInterval = 5000, reconnectAttempts = 5 } = options;
  
  const [status, setStatus] = useState<ConnectionStatus>('CLOSED');
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = useCallback(() => {
    if (!url || !enabled) return;

    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      setStatus('CONNECTING');
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('OPEN');
        reconnectCountRef.current = 0;
        console.log(`WebSocket connected: ${url}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          if (onMessage) onMessage(data);
        } catch (e) {
          // Handle non-JSON messages if needed, or just warn
          console.warn('Failed to parse WebSocket message:', event.data);
          setLastMessage(event.data);
          if (onMessage) onMessage(event.data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('ERROR');
      };

      ws.onclose = () => {
        setStatus('CLOSED');
        wsRef.current = null;
        
        // Attempt reconnection
        if (enabled && reconnectCountRef.current < reconnectAttempts) {
          const timeout = Math.min(1000 * (2 ** reconnectCountRef.current), 30000); // Exponential backoff max 30s
          console.log(`WebSocket closed. Reconnecting in ${timeout}ms...`);
          
          reconnectTimerRef.current = setTimeout(() => {
            reconnectCountRef.current++;
            connect();
          }, timeout);
        }
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setStatus('ERROR');
    }
  }, [url, enabled, onMessage, reconnectAttempts]);

  useEffect(() => {
    if (enabled && url) {
      connect();
    }

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect, enabled, url]);

  return {
    status,
    lastMessage,
    isConnected: status === 'OPEN'
  };
}
