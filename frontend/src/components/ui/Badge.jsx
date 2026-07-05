const STATUS_CONFIG = {
  pending:   { label: "Pending",    classes: "bg-status-pending/10 text-yellow-800" },
  claimed:   { label: "Claimed",    classes: "bg-secondary/10 text-secondary" },
  assigned:  { label: "Assigned",   classes: "bg-secondary/10 text-secondary" },
  picked_up: { label: "Picked Up",  classes: "bg-status-transit/10 text-status-transit" },
  in_transit:{ label: "In Transit", classes: "bg-status-transit/10 text-status-transit" },
  delivered: { label: "Delivered",  classes: "bg-status-success/10 text-status-success" },
  cancelled: { label: "Cancelled",  classes: "bg-gray-100 text-gray-500" },
};

export function StatusBadge({ status, className = "" }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${cfg.classes} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

export function RoleBadge({ role }) {
  const map = {
    donor:     "bg-primary/10 text-primary",
    ngo:       "bg-secondary/10 text-secondary",
    volunteer: "bg-status-transit/10 text-status-transit",
    admin:     "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${map[role] ?? map.admin}`}>
      {role} Dashboard
    </span>
  );
}
