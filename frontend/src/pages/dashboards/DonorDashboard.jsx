import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createDonation, listDonations } from "../../api/donations";
import { extractErrorMessage } from "../../api/client";
import { useAnalytics } from "../../hooks/useAnalytics";
import NotificationsBell from "../../components/NotificationsBell";
import { StatCard, StatCardSkeleton } from "../../components/ui/StatCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { InlineError } from "../../components/ui/ErrorState";
import { SkeletonList } from "../../components/ui/SkeletonCard";
import { StatusBadge } from "../../components/ui/Badge";
import { ChartCard, SingleAreaChart } from "../../components/charts/TrendChart";
import { LocationPicker } from "../../components/maps/LocationPicker";
import {
  Heart, LogOut, Plus, Clock, MapPin, Package, Loader2,
  Utensils, Leaf, TrendingUp, X,
} from "lucide-react";

export default function DonorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: analytics, loading: analyticsLoading } = useAnalytics();

  const [showForm, setShowForm] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    food_type: "", quantity: "", unit: "servings",
    pickup_address: "", description: "",
  });

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
  const setField = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const created = await createDonation({
        food_type: form.food_type,
        quantity: Number(form.quantity),
        unit: form.unit,
        pickup_address: form.pickup_address,
        description: form.description || undefined,
      });
      setDonations((p) => [created, ...p]);
      setForm({ food_type: "", quantity: "", unit: "servings", pickup_address: "", description: "" });
      setShowForm(false);
    } catch (e) {
      setFormError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const totalDonations = analytics?.total_donations ?? 0;
  const deliveredDonations = analytics?.delivered_donations ?? 0;
  const mealsDonated = analytics?.meals_donated ?? 0;
  const wasteReduced = analytics?.food_waste_reduced_kg ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary" />
            <span className="hidden sm:block">SharePlate</span>
          </Link>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            Donor
          </span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <span className="hidden sm:block font-medium text-ink text-sm px-2">{user?.full_name}</span>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="text-gray-400 hover:text-status-error transition-colors p-2 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink">My Donations</h1>
            <p className="text-gray-400 text-sm mt-1">Track your impact and manage food listings.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-soft hover:shadow-soft-lg active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> New Donation
          </button>
        </div>

        {/* Analytics row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          {analyticsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Total Listed" value={totalDonations} icon={Package} />
              <StatCard label="Delivered" value={deliveredDonations} icon={TrendingUp} iconBg="bg-status-success/10" iconColor="text-status-success" />
              <StatCard label="Meals Donated" value={mealsDonated} icon={Utensils} iconBg="bg-secondary/10" iconColor="text-secondary" />
              <StatCard label="Waste Reduced" value={wasteReduced.toFixed(1)} suffix="kg" icon={Leaf} iconBg="bg-green-50" iconColor="text-green-600" />
            </>
          )}
        </div>

        {/* Trend chart */}
        {analytics?.monthly_trend && analytics.monthly_trend.length > 0 && (
          <ChartCard title="Monthly Donations" subtitle="Your listings over the last 6 months" className="animate-fadeIn">
            <SingleAreaChart
              data={analytics.monthly_trend}
              dataKey="donations"
              label="Donations"
              color="#2E7D32"
              height={160}
            />
          </ChartCard>
        )}

        {/* New donation slide-in panel */}
        {showForm && (
          <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="New donation">
            <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-ink">List a Donation</h2>
                <button onClick={() => setShowForm(false)} aria-label="Close" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-ink transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && <InlineError message={formError} className="mb-4" />}

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Food Type</label>
                  <input
                    type="text" required value={form.food_type} onChange={setField("food_type")}
                    placeholder="e.g. Cooked Rice, Bakery Goods"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
                    <input
                      type="number" required min="1" value={form.quantity} onChange={setField("quantity")}
                      placeholder="40"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
                    <select
                      value={form.unit} onChange={setField("unit")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
                    >
                      {["servings", "kg", "units", "litres", "boxes", "trays"].map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pickup Address</label>
                  <LocationPicker
                    value={form.pickup_address}
                    onChange={(v) => setForm((p) => ({ ...p, pickup_address: v }))}
                    placeholder="Enter full pickup address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.description} onChange={setField("description")}
                    placeholder="Any notes about packaging, allergies, or pickup instructions..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button" onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-ink py-3 rounded-xl font-semibold transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={submitting}
                    className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm shadow-soft"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Submit</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Donations list */}
        <div className="space-y-3 animate-fadeIn">
          <h2 className="text-lg font-bold text-ink">Your Listings</h2>

          {error && <InlineError message={error} onRetry={fetchDonations} />}

          {loading ? (
            <SkeletonList count={3} />
          ) : donations.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No donations yet"
              description="List your first surplus food item — it takes less than a minute."
              action={{ label: "New Donation", onClick: () => setShowForm(true) }}
            />
          ) : (
            donations.map((d) => (
              <article
                key={d.id}
                className="bg-white p-5 rounded-2xl shadow-soft border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-soft-lg transition-all animate-fadeIn"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-ink text-sm">{d.food_type}</h3>
                      <StatusBadge status={d.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {d.quantity} {d.unit}</span>
                      <span className="flex items-center gap-1 min-w-0"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate max-w-[200px]">{d.pickup_address}</span></span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                    {d.description && <p className="text-xs text-gray-400 mt-1 italic">{d.description}</p>}
                  </div>
                </div>
                <span className="text-xs text-gray-300 font-mono shrink-0">#{d.id}</span>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
