'use client';

const LOG_KEY = 'auth-debug-logs';
const MAX_LOGS = 100;

interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn';
  message: string;
  data?: unknown;
}

export const persistentLogger = {
  log: (message: string, data?: unknown) => {
    addLog('log', message, data);
    console.log(`[DEBUG] ${message}`, data);
  },
  
  error: (message: string, data?: unknown) => {
    addLog('error', message, data);
    console.error(`[ERROR] ${message}`, data);
  },
  
  warn: (message: string, data?: unknown) => {
    addLog('warn', message, data);
    console.warn(`[WARN] ${message}`, data);
  },
  
  getLogs: (): LogEntry[] => {
    try {
      if (!globalThis.window) return [];
      const logsJson = localStorage.getItem(LOG_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch {
      return [];
    }
  },
  
  clearLogs: () => {
    try {
      if (!globalThis.window) return;
      localStorage.removeItem(LOG_KEY);
    } catch {
      // noop
    }
  },
  
  printLogs: () => {
    const logs = persistentLogger.getLogs();
    console.log('%c=== PERSISTENT LOGS ===', 'color: blue; font-weight: bold; font-size: 14px');
    for (const log of logs) {
      const style = log.level === 'error' ? 'color: red' : log.level === 'warn' ? 'color: orange' : 'color: green';
      console.log(`%c[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`, style, log.data);
    }
    console.log('%c=== END LOGS ===', 'color: blue; font-weight: bold; font-size: 14px');
  },
};

function addLog(level: 'log' | 'error' | 'warn', message: string, data?: unknown) {
  try {
    if (!globalThis.window) return;
    
    const logs = persistentLogger.getLogs();
    let dataStr: string | undefined;
    
    if (data !== undefined && data !== null) {
      try {
        if (typeof data === 'string') {
          dataStr = data;
        } else if (typeof data === 'object') {
          dataStr = JSON.stringify(data);
        } else {
          dataStr = String(data);
        }
      } catch {
        dataStr = '[Unable to stringify data]';
      }
    }
    
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      data: dataStr,
    };
    
    logs.push(newLog);
    
    // Keep only last MAX_LOGS entries
    if (logs.length > MAX_LOGS) {
      logs.splice(0, logs.length - MAX_LOGS);
    }
    
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  } catch {
    // noop - localStorage might not be available
  }
}
