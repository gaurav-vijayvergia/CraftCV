import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
public state: State = {
    hasError: false,
    error: null,
};

public static getDerivedStateFromError(error: Error): State {
return { hasError: true, error };
}

public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
console.error('Uncaught error:', error, errorInfo);
}

public render() {
if (this.state.hasError) {
return (
    <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-center">
    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
    <h2 className="text-lg font-semibold text-gray-900 mb-2">
    Something went wrong
    </h2>
    <p className="text-sm text-gray-600 mb-4">
    {this.state.error?.message || 'An unexpected error occurred'}
    </p>
    <button
    onClick={() => this.setState({ hasError: false, error: null })}
className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
          Try again
              </button>
                </div>
                  </div>
);
}

return this.props.children;
}
}

export default ErrorBoundary;