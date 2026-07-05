export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl shadow-soft border border-gray-50 animate-fadeIn">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-300" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-xs mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-soft"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
