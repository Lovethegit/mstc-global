import { AlertOctagon, RefreshCw } from "lucide-react";
import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * React class-based ErrorBoundary.
 * Catches runtime errors in the component tree and shows a styled
 * MSTC recovery card instead of a blank crash screen.
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[MSTC ErrorBoundary]", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  // Alias for external callers
  retry = this.handleRetry;

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="min-h-[300px] flex items-center justify-center p-8"
          data-ocid="error_boundary.error_state"
        >
          <div className="max-w-md w-full rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-2xl">
            {/* Icon */}
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
              <AlertOctagon size={26} className="text-destructive" />
            </div>

            {/* Title */}
            <h2 className="font-serif font-bold text-xl text-foreground mb-2">
              Something went wrong
            </h2>

            {/* Message */}
            <p className="font-sans text-sm text-muted-foreground mb-1">
              An unexpected error occurred in this section.
            </p>
            {this.state.errorMessage && (
              <p className="font-mono text-xs text-muted-foreground/60 mt-2 px-3 py-2 bg-muted/40 rounded-lg break-words">
                {this.state.errorMessage}
              </p>
            )}

            {/* Retry button */}
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary/10 border border-primary/40 text-primary font-sans font-medium text-sm hover:bg-primary/20 hover:border-primary/60 transition-all duration-200"
              data-ocid="error_boundary.retry_button"
            >
              <RefreshCw size={14} />
              Try Again
            </button>

            {/* MSTC branding */}
            <p className="mt-4 text-[10px] font-sans text-muted-foreground/40 uppercase tracking-widest">
              MSTC GLOBAL
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
