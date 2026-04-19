import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="max-w-md w-full bg-white border-2 border-red-100 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-4">
            This section encountered an unexpected error. Your other tabs and data are unaffected.
          </p>
          {this.state.error?.message && (
            <p className="text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-500 mb-5 text-left break-all">
              {this.state.error.message}
            </p>
          )}
          <button
            type="button"
            onClick={this.reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors cursor-pointer border-none"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
