import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { assignVolunteer, claimDonation, listDonations } from "../../api/donations";
import { extractErrorMessage } from "../../api/client";
import { useAnalytics } from "../../hooks/useAnalytics";
import NotificationsBell from "../../components/NotificationsBell";
import { StatCard, StatCardSkeleton } from "../../components/ui/StatCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { InlineError } from "../../components/ui/ErrorState";
import { SkeletonList } from "../../components/ui/SkeletonCard";
import { StatusBadge } from "../../components/ui/Badge";
import { ChartCard, DualAreaChart } from "../../components/charts/TrendChart";
import { DonationMap } from "../../components/maps/DonationMap";
import {
  Heart, LogOut, PackageSearch, MapPin, Clock, Loader2,
  Truck, Users, CheckCircle2, Map,
} from "lucide-react";

const TABS = [
  { id: "available", label: "Available", icon: PackageSearch },
  { id: "claims", label: "My Claims", icon: CheckCircle2 },
  { id: "map", label: "Map View", icon: Map },
];

export default function NgoDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();

  const [activeTab, setActiveTab] = useState("available");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [volunteerInputs, setVolunteerInputs] = useState({});
  const [selectedMapId, setSelectedMapId] = useState(null);

  const fetchDonations = () => {
    setLoading(true);
    setError("");
    listDonations()
      .then(setDonations)
      .catch((e) => setError(extractErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const availableDonations = donations.filter((d) => d.status === "pending");
  const myClaims = donations.filter((d) => d.status !== "pending");

  const handleClaim = async (id) => {
    setActionError("");
    setBusyId(id);
    try {
      const updated = await claimDonation(id);
      setDonations((p) => p.map((d) => (d.id === id ? updated : d)));
    } catch (e) {
      setActionError(extractErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleAssign = async (id) => {
    const vid = Number(volunteerInputs[id]);
    if (!vid) { setActionError("Please enter a valid volunteer ID."); return; }
    setActionError("");
    setBusyId(id);
    try {
      const updated = await assignVolunteer(id, vid);
      setDonations((p) => p.map((d) => (d.id === id ? updated : d)));
      setVolunteerInputs((p) => { const n = { ...p }; delete n[id]; return n; });
    } catch (e) {
      setActionError(extractErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const claimedCount = analytics?.donations_claimed ?? 0;
  const deliveredCount = analytics?.donations_delivered ?? 0;
  const volunteersCount = analytics?.volunteers_managed ?? 0;

  const DonationCard = ({ donation, tab }) => (
    <article className="bg-white p-5 rounded-2xl shadow-soft border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-soft-lg transition-all animate-fadeIn">
      <div className="flex gap-4 items-start flex-1 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
          <PackageSearch className="w-5 h-5 text-secondary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-ink text-sm">{donation.food_type}</h3>
            <StatusBadge status={donation.status} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            <span>{donation.quantity} {donation.unit}</span>
            <span className="flex items-center gap-1 min-w-0"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate max-w-[200px]">{donation.pickup_address}</span></span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(donation.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        {tab === "available" ? (
          <button
            onClick={() => handleClaim(donation.id)}
            disabled={busyId === donation.id}
            className="bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-soft"
          >
            {busyId === donation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim"}
          </button>
        ) : donation.status === "claimed" ? (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Volunteer ID"
              value={volunteerInputs[donation.id] || ""}
              onChange={(e) => setVolunteerInputs((p) => ({ ...p, [donation.id]: e.target.value }))}
              className="w-28 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              aria-label="Volunteer ID"
            />
            <button
              onClick={() => handleAssign(donation.id)}
              disabled={busyId === donation.id}
              className="bg-primary hover:bg-primary-hover disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-soft"
            >
              {busyId === donation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Truck className="w-4 h-4" />Assign</>}
            </button>
          </div>
        ) : (
          <StatusBadge status={donation.status} />
        )}
      </div>
    </article>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary" />
            <span className="hidden sm:block">SharePlate</span>
          </Link>
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold">NGO</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <span className="hidden sm:block font-medium text-ink text-sm px-2">{user?.full_name}</span>
          <button onClick={handleLogout} aria-label="Log out" className="text-gray-400 hover:text-status-error transition-colors p-2 rounded-lg hover:bg-gray-50">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full space-y-6">
        <div className="animate-fadeIn">
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink">Food Rescue Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Claim surplus food and coordinate deliveries.</p>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          {analyticsLoading ? (
            Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Donations Claimed" value={claimedCount} icon={PackageSearch} iconBg="bg-secondary/10" iconColor="text-secondary" />
              <StatCard label="Delivered" value={deliveredCount} icon={CheckCircle2} iconBg="bg-status-success/10" iconColor="text-status-success" />
              <StatCard label="Volunteers Managed" value={volunteersCount} icon={Users} iconBg="bg-status-transit/10" iconColor="text-status-transit" />
            </>
          )}
        </div>

        {/* Chart */}
        {analytics?.monthly_trend && (
          <ChartCard title="Monthly Activity" subtitle="Claims and deliveries over the last 6 months" className="animate-fadeIn">
            <DualAreaChart
              data={analytics.monthly_trend}
              series={[
                { key: "claimed", label: "Claimed", color: "#F59E0B" },
                { key: "delivered", label: "Delivered", color: "#22C55E" },
              ]}
              height={160}
            />
          </ChartCard>
        )}

        {/* Tabs */}
        <div>
          <div className="flex border-b border-gray-200 gap-1 mb-5" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-ink"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
                {t.id === "available" && availableDonations.length > 0 && (
                  <span className="bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {availableDonations.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {actionError && <InlineError message={actionError} className="mb-4" />}
          {error && <InlineError message={error} onRetry={fetchDonations} className="mb-4" />}

          {loading ? (
            <SkeletonList count={3} />
          ) : activeTab === "map" ? (
            <DonationMap
              donations={availableDonations}
              selectedId={selectedMapId}
              onSelect={setSelectedMapId}
            />
          ) : (
            <div className="space-y-3">
              {(activeTab === "available" ? availableDonations : myClaims).map((d) => (
                <DonationCard key={d.id} donation={d} tab={activeTab} />
              ))}
              {activeTab === "available" && availableDonations.length === 0 && (
                <EmptyState icon={PackageSearch} title="No available donations" description="Check back soon — new donations appear here as donors list them." />
              )}
              {activeTab === "claims" && myClaims.length === 0 && (
                <EmptyState icon={CheckCircle2} title="No claims yet" description="Claim available donations from the Available tab to see them here." />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
