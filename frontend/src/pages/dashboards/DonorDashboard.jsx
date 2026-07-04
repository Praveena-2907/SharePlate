import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { donations } from "../../data/mockData";
import { Heart, LogOut, Plus, Clock, MapPin, Package, CheckCircle } from "lucide-react";

export default function DonorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNewForm, setShowNewForm] = useState(false);
  const [localDonations, setLocalDonations] = useState(donations.filter(d => d.donor.includes("Leaf") || d.donor.includes("Cafe") || d.donor.includes("Bakery"))); // Mock specific to user

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setShowNewForm(false);
    // Simple UI state update
    setLocalDonations([
      {
        id: `D-${1000 + Math.floor(Math.random()*1000)}`,
        item: "New Donation Batch",
        quantity: "Multiple units",
        status: "pending",
        pickupWindow: "Today",
        createdAt: new Date().toISOString()
      },
      ...localDonations
    ]);
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
        <div className="flex items-center gap-4">
          <span className="font-medium text-ink">{user?.name || "Demo Donor"}</span>
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
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Item(s)</label>
                <input required type="text" placeholder="e.g. Mixed Sandwiches" className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity/Servings</label>
                <input required type="text" placeholder="e.g. 20 servings" className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Window</label>
                <input required type="text" placeholder="e.g. Today 2:00 PM - 4:00 PM" className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl font-medium">Publish Listing</button>
                <button type="button" onClick={() => setShowNewForm(false)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {localDonations.map(donation => (
            <div key={donation.id} className="bg-white p-6 rounded-2xl shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-50 hover:shadow-soft-lg transition-shadow">
              <div className="flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  donation.status === 'delivered' ? 'bg-status-success/10 text-status-success' :
                  donation.status === 'in_transit' ? 'bg-status-transit/10 text-status-transit' :
                  'bg-status-pending/10 text-status-pending'
                }`}>
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-ink flex items-center gap-2">
                    {donation.item}
                    <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                      donation.status === 'delivered' ? 'bg-status-success/10 text-status-success' :
                      donation.status === 'in_transit' ? 'bg-status-transit/10 text-status-transit' :
                      'bg-status-pending/10 text-status-pending'
                    }`}>
                      {donation.status.replace('_', ' ')}
                    </span>
                  </h3>
                  <div className="text-gray-500 text-sm mt-1 flex flex-wrap gap-4">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {donation.quantity}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {donation.pickupWindow}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-mono">{donation.id}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
