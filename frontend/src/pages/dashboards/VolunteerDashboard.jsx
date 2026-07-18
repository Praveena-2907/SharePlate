import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listDonations, markDelivered, markPickup, markTransit } from "../../api/donations";
import { getMyVolunteerAvailability, updateMyVolunteerAvailability } from "../../api/volunteers";
import { extractErrorMessage } from "../../api/client";
import { useAnalytics } from "../../hooks/useAnalytics";
import NotificationsBell from "../../components/NotificationsBell";
import { StatCard, StatCardSkeleton } from "../../components/ui/StatCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { InlineError } from "../../components/ui/ErrorState";
import { SkeletonList } from "../../components/ui/SkeletonCard";
import { StatusBadge } from "../../components/ui/Badge";
import { ChartCard, SimpleBarChart } from "../../components/charts/TrendChart";
import { RouteMap } from "../../components/maps/RouteMap";
import {
  Heart, LogOut, CheckCircle2, Loader2, Navigation,
  Bike, Utensils, Activity, ChevronDown, ChevronUp, Power,
} from "lucide-react";

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityBusy, setAvailabilityBusy] = useState(false);

  const fetchDonations = () => {
    setLoading(true);
    setError("");
    listDonations()
      .then(setDonations)
      .catch((e) => setError(extractErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  const fetchAvailability = () => {
    setAvailabilityLoading(true);
    getMyVolunteerAvailability()
      .then((profile) => setIsAvailable(profile.is_available))
      .catch((e) => setActionError(extractErrorMessage(e)))
      .finally(() => setAvailabilityLoading(false));
  };

  useEffect(() => {
    fetchDonations();
    fetchAvailability();
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const activeDeliveries = donations.filter((d) =>
    ["assigned", "picked_up", "in_transit"].includes(d.status)
  );
  const completedDeliveries = donations.filter((d) => d.status === "delivered");

  const runAction = async (id, action) => {
    setActionError("");
    setBusyId(id);
    try {
      const updated = await action(id);
      setDonations((p) => p.map((d) => (d.id === id ? updated : d)));
    } catch (e) {
      setActionError(extractErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const toggleAvailability = async () => {
    setActionError("");
    setAvailabilityBusy(true);
    try {
      const updated = await updateMyVolunteerAvailability(!isAvailable);
      setIsAvailable(updated.is_available);
    } catch (e) {
      setActionError(extractErrorMessage(e));
    } finally {
      setAvailabilityBusy(false);
    }
  };

  const ACTION_CONFIG = {
    assigned:   { label: "Mark Picked Up",  action: markPickup,    color: "bg-primary hover:bg-primary-hover" },
    picked_up:  { label: "Mark In Transit", action: markTransit,   color: "bg-status-transit hover:bg-status-transit/90" },
    in_transit: { label: "Mark Delivered",  action: markDelivered, color: "bg-status-success hover:bg-status-success/90" },
  };

  const completedCount = analytics?.deliveries_completed ?? 0;
  const mealsDelivered = analytics?.meals_delivered ?? 0;
  const activeCount = analytics?.active_deliveries ?? activeDeliveries.length;

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary" />
            <span className="hidden sm:block">SharePlate</span>
          </Link>
          <span className="bg-status-transit/10 text-status-transit px-3 py-1 rounded-full text-xs font-semibold">Volunteer</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <span className="hidden sm:block font-medium text-ink text-sm px-2">{user?.full_name}</span>
          <button onClick={handleLogout} aria-label="Log out" className="text-gray-400 hover:text-status-error transition-colors p-2 rounded-lg hover:bg-gray-50">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="animate-fadeIn flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink">My Deliveries</h1>
            <p className="text-gray-400 text-sm mt-1">Manage active routes and track your impact.</p>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={availabilityLoading || availabilityBusy}
            className={`w-full md:w-auto px-5 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-soft disabled:opacity-60 ${
              isAvailable
                ? "bg-status-success text-white hover:bg-status-success/90"
                : "bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {availabilityBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
            {availabilityLoading ? "Checking availability" : isAvailable ? "Available: Yes" : "Available: No"}
          </button>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          {analyticsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Deliveries Completed" value={completedCount} icon={CheckCircle2} iconBg="bg-status-success/10" iconColor="text-status-success" />
              <StatCard label="Meals Delivered" value={mealsDelivered} icon={Utensils} iconBg="bg-secondary/10" iconColor="text-secondary" />
              <StatCard label="Active Now" value={activeCount} icon={Activity} iconBg="bg-status-transit/10" iconColor="text-status-transit" />
            </>
          )}
        </div>

        {/* Chart */}
        {analytics?.monthly_trend && (
          <ChartCard title="Monthly Deliveries" subtitle="Your completed deliveries over the last 6 months" className="animate-fadeIn">
            <SimpleBarChart
              data={analytics.monthly_trend}
              dataKey="deliveries"
              label="Deliveries"
              color="#3B82F6"
              height={160}
            />
          </ChartCard>
        )}

        {error && <InlineError message={error} onRetry={fetchDonations} />}
        {actionError && <InlineError message={actionError} />}

        {/* Active deliveries */}
        <div>
          <h2 className="text-lg font-bold text-ink mb-4">
            Active Routes
            {activeDeliveries.length > 0 && (
              <span className="ml-2 bg-status-transit/10 text-status-transit text-xs font-bold px-2 py-0.5 rounded-full">
                {activeDeliveries.length}
              </span>
            )}
          </h2>

          {loading ? (
            <SkeletonList count={2} />
          ) : activeDeliveries.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="All deliveries complete"
              description="You've completed all assigned deliveries. New assignments will appear here."
            />
          ) : (
            <div className="space-y-4">
              {activeDeliveries.map((delivery) => {
                const cfg = ACTION_CONFIG[delivery.status];
                const isExpanded = expandedId === delivery.id;
                return (
                  <article key={delivery.id} className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden animate-fadeIn hover:shadow-soft-lg transition-shadow">
                    {/* Card header */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-11 h-11 rounded-xl bg-status-transit/10 flex items-center justify-center shrink-0">
                          <Bike className="w-5 h-5 text-status-transit" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-ink text-sm">{delivery.food_type}</h3>
                            <StatusBadge status={delivery.status} />
                          </div>
                          <p className="text-xs text-gray-400">{delivery.quantity} {delivery.unit} • #{delivery.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        {cfg && (
                          <button
                            onClick={() => runAction(delivery.id, cfg.action)}
                            disabled={busyId === delivery.id}
                            className={`${cfg.color} disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-soft`}
                          >
                            {busyId === delivery.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <><CheckCircle2 className="w-4 h-4" />{cfg.label}</>}
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : delivery.id)}
                          aria-label={isExpanded ? "Collapse route" : "Show route"}
                          className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable route map */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-50 pt-4 animate-fadeIn">
                        <RouteMap donation={delivery} />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed deliveries (collapsed summary) */}
        {!loading && completedDeliveries.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-status-success" />
              Completed
              <span className="text-sm text-gray-400 font-normal">({completedDeliveries.length})</span>
            </h2>
            <div className="space-y-2">
              {completedDeliveries.slice(0, 5).map((d) => (
                <div key={d.id} className="bg-white rounded-xl border border-gray-50 px-4 py-3 flex items-center gap-3 text-sm animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  <span className="font-medium text-ink flex-1">{d.food_type}</span>
                  <span className="text-gray-400">{d.quantity} {d.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
