import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-status-error/5 border border-status-error/20 rounded-2xl animate-fadeIn">
      <div className="w-12 h-12 bg-status-error/10 rounded-full flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-status-error" />
      </div>
      <p className="text-sm font-semibold text-status-error mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-ink transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
      )}
    </div>
  );
}

export function InlineError({ message, onRetry }) {
  return (
    <div className="flex items-center gap-3 bg-status-error/10 border border-status-error/20 text-status-error text-sm font-medium px-4 py-3 rounded-xl">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="shrink-0 hover:underline">
          Retry
        </button>
      )}
    </div>
  );
}
