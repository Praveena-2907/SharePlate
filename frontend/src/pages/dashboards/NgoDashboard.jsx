import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { assignVolunteer, claimDonation, listDonations } from "../../api/donations";
import { extractErrorMessage } from "../../api/client";
import NotificationsBell from "../../components/NotificationsBell";
import { Heart, LogOut, PackageSearch, MapPin, Clock, Loader2, Truck } from "lucide-react";

export default function NgoDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [volunteerInputs, setVolunteerInputs] = useState({});

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

  const availableDonations = donations.filter((d) => d.status === "pending");
  const myClaims = donations.filter((d) => d.status !== "pending");

  const handleClaim = async (id) => {
    setActionError("");
    setBusyId(id);
    try {
      const updated = await claimDonation(id);
      setDonations((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleAssign = async (id) => {
    const volunteerId = Number(volunteerInputs[id]);
    if (!volunteerId) {
      setActionError("Enter a valid volunteer ID to assign.");
      return;
    }
    setActionError("");
    setBusyId(id);
    try {
      const updated = await assignVolunteer(id, volunteerId);
      setDonations((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusyId(null);
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
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">NGO Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <span className="font-medium text-ink px-2">{user?.full_name || "NGO"}</span>
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

        {actionError && (
          <div className="mb-6 bg-status-error/10 text-status-error text-sm font-medium px-4 py-3 rounded-xl">
            {actionError}
          </div>
        )}

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
            {(activeTab === "available" ? availableDonations : myClaims).map((donation) => (
              <div key={donation.id} className="bg-white p-6 rounded-2xl shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-50 hover:shadow-soft-lg transition-shadow">
                <div className="flex gap-4 items-start flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === "available" ? "bg-secondary/10 text-secondary" : "bg-status-transit/10 text-status-transit"
                  }`}>
                    <PackageSearch className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-ink mb-1">{donation.food_type}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {donation.pickup_address}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(donation.created_at).toLocaleString()}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{donation.quantity} {donation.unit}</span>
                    </div>
                  </div>
                </div>
                {activeTab === "available" ? (
                  <button
                    onClick={() => handleClaim(donation.id)}
                    disabled={busyId === donation.id}
                    className="bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full md:w-auto text-center shrink-0 flex items-center justify-center gap-2"
                  >
                    {busyId === donation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim Donation"}
                  </button>
                ) : donation.status === "claimed" ? (
                  <div className="flex flex-col gap-2 w-full md:w-64 shrink-0">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Volunteer ID"
                        value={volunteerInputs[donation.id] || ""}
                        onChange={(e) => setVolunteerInputs((prev) => ({ ...prev, [donation.id]: e.target.value }))}
                        className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <button
                        onClick={() => handleAssign(donation.id)}
                        disabled={busyId === donation.id}
                        className="bg-primary hover:bg-primary-hover disabled:opacity-60 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1"
                      >
                        {busyId === donation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Truck className="w-4 h-4" /> Assign</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide text-center w-full md:w-auto shrink-0 bg-status-transit/10 text-status-transit">
                    {donation.status.replace("_", " ")}
                  </div>
                )}
              </div>
            ))}
            {activeTab === "available" && availableDonations.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-50">
                <p className="text-gray-500">No available donations nearby right now.</p>
              </div>
            )}
            {activeTab === "claims" && myClaims.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-50">
                <p className="text-gray-500">You haven't claimed any donations yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
