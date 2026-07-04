import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { donations, ngos } from "../../data/mockData";
import { Heart, LogOut, CheckCircle, PackageSearch, MapPin, Clock } from "lucide-react";

export default function NgoDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const availableDonations = donations.filter(d => d.status === "pending");
  const myClaims = donations.filter(d => d.status === "in_transit" || d.status === "delivered");

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary" />
            SharePlate
          </Link>
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">NGO Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-ink">{user?.name || "Hope Foundation"}</span>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Food Rescue Portal</h1>
          <p className="text-gray-500">Find nearby surplus food and claim it for your community.</p>
        </div>

        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab("available")}
            className={`pb-3 font-medium text-lg border-b-2 transition-colors ${activeTab === "available" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-ink"}`}
          >
            Available Donations
          </button>
          <button 
            onClick={() => setActiveTab("claims")}
            className={`pb-3 font-medium text-lg border-b-2 transition-colors ${activeTab === "claims" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-ink"}`}
          >
            My Claims
          </button>
        </div>

        <div className="grid gap-4">
          {(activeTab === "available" ? availableDonations : myClaims).map(donation => (
            <div key={donation.id} className="bg-white p-6 rounded-2xl shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-50 hover:shadow-soft-lg transition-shadow">
              <div className="flex gap-4 items-start flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTab === "available" ? 'bg-secondary/10 text-secondary' : 'bg-status-transit/10 text-status-transit'
                }`}>
                  <PackageSearch className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-ink mb-1">{donation.item}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1 font-medium text-ink"><MapPin className="w-4 h-4"/> {donation.donor}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {donation.pickupWindow}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{donation.quantity}</span>
                  </div>
                </div>
              </div>
              {activeTab === "available" ? (
                <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full md:w-auto text-center shrink-0">
                  Claim Donation
                </button>
              ) : (
                <div className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide text-center w-full md:w-auto shrink-0 ${
                  donation.status === 'delivered' ? 'bg-status-success/10 text-status-success' : 'bg-status-transit/10 text-status-transit'
                }`}>
                  {donation.status.replace('_', ' ')}
                </div>
              )}
            </div>
          ))}
          {activeTab === "available" && availableDonations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-50">
              <p className="text-gray-500">No available donations nearby right now.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
