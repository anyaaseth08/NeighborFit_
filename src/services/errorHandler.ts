interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  context?: any;
}

class ErrorHandler {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  logError(error: Error, context?: any): void {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      context
    };

    this.logs.unshift(errorLog);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    console.error('Error logged:', errorLog);
  }

  logWarning(message: string, context?: any): void {
    const warningLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context
    };

    this.logs.unshift(warningLog);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    console.warn('Warning logged:', warningLog);
  }

  logInfo(message: string, context?: any): void {
    const infoLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context
    };

    this.logs.unshift(infoLog);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    console.info('Info logged:', infoLog);
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  // Global error handler setup
  setupGlobalErrorHandling(): void {
    window.addEventListener('error', (event) => {
      this.logError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        reason: event.reason
      });
    });
  }

  // API error wrapper
  async handleApiCall<T>(
    apiCall: () => Promise<T>,
    context: string
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const data = await apiCall();
      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logError(new Error(`API Error in ${context}: ${errorMessage}`), { context });
      return { data: null, error: errorMessage };
    }
  }
}

export const errorHandler = new ErrorHandler();

// Initialize global error handling
errorHandler.setupGlobalErrorHandling();