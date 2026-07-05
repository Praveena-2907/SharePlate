import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createDonation, listDonations } from "../../api/donations";
import { extractErrorMessage } from "../../api/client";
import NotificationsBell from "../../components/NotificationsBell";
import { Heart, LogOut, Plus, Clock, MapPin, Package, Loader2 } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-status-pending/10 text-status-pending",
  claimed: "bg-secondary/10 text-secondary",
  assigned: "bg-secondary/10 text-secondary",
  picked_up: "bg-status-transit/10 text-status-transit",
  in_transit: "bg-status-transit/10 text-status-transit",
  delivered: "bg-status-success/10 text-status-success",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function DonorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNewForm, setShowNewForm] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ food_type: "", quantity: "", unit: "servings", pickup_address: "" });

  const fetchDonations = () => {
    setLoading(true);
    setError("");
    listDonations()
      .then(setDonations)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

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
      });
      setDonations((prev) => [created, ...prev]);
      setForm({ food_type: "", quantity: "", unit: "servings", pickup_address: "" });
      setShowNewForm(false);
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary" />
            SharePlate
          </Link>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">Donor Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <span className="font-medium text-ink px-2">{user?.full_name || "Donor"}</span>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">My Donations</h1>
            <p className="text-gray-500">Manage your surplus food listings and track pickups.</p>
          </div>
          <button onClick={() => setShowNewForm(true)} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-soft flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Donation
          </button>
        </div>

        {showNewForm && (
          <div className="bg-white p-6 rounded-2xl shadow-soft mb-8 border border-primary/20">
            <h2 className="text-xl font-bold mb-4">List New Surplus</h2>
            {formError && (
              <div className="mb-4 bg-status-error/10 text-status-error text-sm font-medium px-4 py-3 rounded-xl">
                {formError}
              </div>
            )}
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Item(s)</label>
                <input required type="text" value={form.food_type} onChange={handleChange("food_type")} placeholder="e.g. Mixed Sandwiches" className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input required type="number" min="0.1" step="0.1" value={form.quantity} onChange={handleChange("quantity")} placeholder="e.g. 20" className="w-full p-3 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input required type="text" value={form.unit} onChange={handleChange("unit")} placeholder="e.g. kg, servings" className="w-full p-3 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                <input required type="text" value={form.pickup_address} onChange={handleChange("pickup_address")} placeholder="e.g. 123 Main St" className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit" disabled={submitting} className="bg-primary text-white px-6 py-2 rounded-xl font-medium disabled:opacity-60 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Publish Listing
                </button>
                <button type="button" onClick={() => setShowNewForm(false)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading donations...
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-gray-50">
            <p className="text-status-error font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {donations.map((donation) => (
              <div key={donation.id} className="bg-white p-6 rounded-2xl shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-50 hover:shadow-soft-lg transition-shadow">
                <div className="flex gap-4 items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${STATUS_STYLES[donation.status] || STATUS_STYLES.pending}`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-ink flex items-center gap-2">
                      {donation.food_type}
                      <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold ${STATUS_STYLES[donation.status] || STATUS_STYLES.pending}`}>
                        {donation.status.replace("_", " ")}
                      </span>
                    </h3>
                    <div className="text-gray-500 text-sm mt-1 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1"><Package className="w-4 h-4"/> {donation.quantity} {donation.unit}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {donation.pickup_address}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(donation.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-mono">#{donation.id}</p>
                </div>
              </div>
            ))}
            {donations.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-50">
                <p className="text-gray-500">You haven't listed any donations yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
