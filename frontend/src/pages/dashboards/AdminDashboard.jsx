import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAnalytics } from "../../hooks/useAnalytics";
import { listDonations } from "../../api/donations";
import NotificationsBell from "../../components/NotificationsBell";
import { StatCard, StatCardSkeleton } from "../../components/ui/StatCard";
import { SkeletonCard } from "../../components/ui/SkeletonCard";
import { ChartCard, DualAreaChart } from "../../components/charts/TrendChart";
import { DonutChart } from "../../components/charts/DonutChart";
import {
  Heart, LogOut, Users, Activity, ShieldAlert,
  Check, X, Utensils, Leaf, Building2, UserCheck,
  TrendingUp, Zap, Package, Clock,
} from "lucide-react";

const STATUS_ACTIVITY_CONFIG = {
  pending:   { label: "Listed",    color: "bg-status-pending/10 text-yellow-700" },
  claimed:   { label: "Claimed",   color: "bg-secondary/10 text-secondary" },
  assigned:  { label: "Assigned",  color: "bg-secondary/10 text-secondary" },
  picked_up: { label: "Picked up", color: "bg-status-transit/10 text-status-transit" },
  in_transit:{ label: "In transit",color: "bg-status-transit/10 text-status-transit" },
  delivered: { label: "Delivered", color: "bg-status-success/10 text-status-success" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500" },
};

function PlatformHealthBar({ label, value, max, color = "bg-primary" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
        <span>{label}</span>
        <span className="text-ink font-semibold">{value.toLocaleString()} <span className="text-gray-400 font-normal">/ {max.toLocaleString()}</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const { data: analytics, loading: analyticsLoading } = useAnalytics();

const [pendingList, setPendingList] = useState([]);

useEffect(() => {
  fetch("http://127.0.0.1:8000/admin/pending-users")
    .then((res) => res.json())
    .then((data) => {
      console.log("Pending users:", data);

      if (!Array.isArray(data)) return;

      const formattedData = data.map((user) => ({
        id: user.id,
        name: user.name,
        type: user.role.toUpperCase(),
        submittedAt: new Date().toISOString(),
      }));

      setPendingList(formattedData);
    })
    .catch((error) => {
      console.error("Error fetching pending users:", error);
    });
}, []);
  const handleLogout = () => { logout(); navigate("/"); };

  const mealsRescued = analytics?.total_meals_rescued ?? 0;
  const foodSavedKg = analytics?.total_food_saved_kg ?? 0;
  const activeNgos = analytics?.active_ngos ?? 0;
  const activeVolunteers = analytics?.active_volunteers ?? 0;
  const totalDonors = analytics?.total_donors ?? 0;
  const totalDonations = analytics?.total_donations ?? 0;
  const deliveredDonations = analytics?.delivered_donations ?? 0;
  const successRate = analytics?.success_rate ?? 0;
  const recentActivities = analytics?.recent_activities ?? [];
  const statusDistribution = analytics?.status_distribution ?? [];
  const monthlyTrend = analytics?.monthly_trend ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      {/* Dark admin nav */}
      <nav className="flex items-center justify-between px-6 py-4 bg-ink shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary text-primary" />
            <span>SharePlate</span>
            <span className="text-gray-500 font-normal text-sm hidden sm:block">/ Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <NotificationsBell />
          <span className="font-medium text-gray-300 text-sm hidden sm:block">{user?.full_name || "Admin"}</span>
          <button onClick={handleLogout} aria-label="Log out" className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* Page header */}
        <div className="animate-fadeIn">
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink">Platform Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time impact metrics and operational health.</p>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          {analyticsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                label="Meals Rescued"
                value={mealsRescued}
                icon={Utensils}
                iconBg="bg-primary/10"
                iconColor="text-primary"
                trend={`${successRate}% success rate`}
              />
              <StatCard
                label="Food Saved"
                value={foodSavedKg.toFixed(0)}
                suffix="kg"
                icon={Leaf}
                iconBg="bg-green-50"
                iconColor="text-green-600"
              />
              <StatCard
                label="Active NGOs"
                value={activeNgos}
                icon={Building2}
                iconBg="bg-secondary/10"
                iconColor="text-secondary"
              />
              <StatCard
                label="Active Volunteers"
                value={activeVolunteers}
                icon={UserCheck}
                iconBg="bg-status-transit/10"
                iconColor="text-status-transit"
              />
            </>
          )}
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up">
          {analyticsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Total Donors" value={totalDonors} icon={Users} />
              <StatCard label="Total Donations" value={totalDonations} icon={Package} />
              <StatCard label="Delivered" value={deliveredDonations} icon={TrendingUp} iconBg="bg-status-success/10" iconColor="text-status-success" />
            </>
          )}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
          <ChartCard title="Monthly Donations" subtitle="New listings and deliveries over the last 6 months">
            {analyticsLoading ? (
              <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
            ) : (
              <DualAreaChart
                data={monthlyTrend}
                series={[
                  { key: "donations", label: "Listed", color: "#2E7D32" },
                  { key: "delivered", label: "Delivered", color: "#22C55E" },
                ]}
                height={180}
              />
            )}
          </ChartCard>

          <ChartCard title="Donation Status" subtitle="Distribution across all platform donations">
            {analyticsLoading ? (
              <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
            ) : (
              <DonutChart data={statusDistribution} height={220} />
            )}
          </ChartCard>
        </div>

        {/* Three-column grid */}
        <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">

          {/* Platform Health */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-50 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-secondary" />
              <h2 className="font-bold text-ink">Platform Health</h2>
            </div>
            {analyticsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5 animate-pulse">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-50 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <PlatformHealthBar label="Delivery Rate" value={deliveredDonations} max={totalDonations} color="bg-primary" />
                <PlatformHealthBar label="Volunteer Capacity" value={activeVolunteers} max={Math.max(activeVolunteers + 20, 50)} color="bg-status-transit" />
                <PlatformHealthBar label="NGO Network" value={activeNgos} max={Math.max(activeNgos + 10, 30)} color="bg-secondary" />
                <PlatformHealthBar label="Donor Retention" value={totalDonors} max={Math.max(totalDonors + 50, 200)} color="bg-green-400" />
              </div>
            )}

            <div className="pt-2 border-t border-gray-50 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
                <span className="text-xs text-gray-500 font-medium">All systems operational</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              <h2 className="font-bold text-ink">Recent Activity</h2>
            </div>
            <div className="p-4 space-y-1 max-h-[300px] overflow-y-auto">
              {analyticsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-gray-100 mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-2 bg-gray-50 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : recentActivities.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No activity yet.</p>
              ) : (
                recentActivities.map((item, i) => {
                  const cfg = STATUS_ACTIVITY_CONFIG[item.status] ?? STATUS_ACTIVITY_CONFIG.pending;
                  return (
                    <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.text}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(item.time).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-status-pending" />
                <h2 className="font-bold text-ink">Pending Approvals</h2>
              </div>
              {pendingList.length > 0 && (
                <span className="bg-status-pending/20 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                  {pendingList.length}
                </span>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              {pendingList.length === 0 ? (
                <div className="p-6 text-center">
                  <Check className="w-8 h-8 text-status-success mx-auto mb-2" />
                  <p className="text-sm text-gray-500">All caught up!</p>
                </div>
              ) : (
                pendingList.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-ink text-sm">{item.name}</h4>
                        <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded">{item.type}</span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
  onClick={() => {
    fetch(`http://127.0.0.1:8000/admin/approve/${item.id}`, {
      method: "PUT",
    })
      .then(() => {
        setPendingList((p) =>
          p.filter((a) => a.id !== item.id)
        );
      })
      .catch((err) => console.error(err));
  }}
  aria-label={`Approve ${item.name}`}
  className="w-8 h-8 rounded-lg bg-status-success/10 hover:bg-status-success/20 text-status-success flex items-center justify-center transition-colors"
>
  <Check className="w-4 h-4" />
</button>
                      
                      <button
                        onClick={() => setPendingList((p) => p.filter((a) => a.id !== item.id))}
                        aria-label={`Reject ${item.name}`}
                        className="w-8 h-8 rounded-lg bg-status-error/10 hover:bg-status-error/20 text-status-error flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
