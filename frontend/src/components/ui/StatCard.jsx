import { TrendingUp } from "lucide-react";

export function StatCard({ label, value, icon: Icon, iconBg = "bg-primary/10", iconColor = "text-primary", trend, suffix = "", className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-gray-50 p-6 flex flex-col gap-3 hover:shadow-soft-lg transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-extrabold text-ink tabular-nums leading-none">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {suffix && <span className="text-sm font-medium text-gray-400 mb-0.5">{suffix}</span>}
      </div>
      {trend != null && (
        <div className="flex items-center gap-1 text-status-success text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          {trend}
        </div>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-50 p-6 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-100 rounded w-20" />
        <div className="w-9 h-9 rounded-xl bg-gray-100" />
      </div>
      <div className="h-8 bg-gray-100 rounded w-24" />
      <div className="h-3 bg-gray-50 rounded w-16" />
    </div>
  );
}
