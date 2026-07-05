import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listDonations, markDelivered, markPickup, markTransit } from "../../api/donations";
import { extractErrorMessage } from "../../api/client";
import NotificationsBell from "../../components/NotificationsBell";
import { Heart, LogOut, Map, Navigation, CheckCircle2, Loader2 } from "lucide-react";

const STEP_LABEL = {
  assigned: "Awaiting Pickup",
  picked_up: "Picked Up",
  in_transit: "In Transit",
};

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

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

  const activeDeliveries = donations.filter((d) => ["assigned", "picked_up", "in_transit"].includes(d.status));

  const runAction = async (id, action) => {
    setActionError("");
    setBusyId(id);
    try {
      const updated = await action(id);
      setDonations((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const renderAction = (delivery) => {
    if (delivery.status === "assigned") {
      return (
        <button onClick={() => runAction(delivery.id, markPickup)} disabled={busyId === delivery.id} className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
          {busyId === delivery.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Mark Picked Up</>}
        </button>
      );
    }
    if (delivery.status === "picked_up") {
      return (
        <button onClick={() => runAction(delivery.id, markTransit)} disabled={busyId === delivery.id} className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
          {busyId === delivery.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Navigation className="w-4 h-4" /> Mark In Transit</>}
        </button>
      );
    }
    return (
      <button onClick={() => runAction(delivery.id, markDelivered)} disabled={busyId === delivery.id} className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
        {busyId === delivery.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Mark Delivered</>}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary" />
            SharePlate
          </Link>
          <span className="bg-status-transit/10 text-status-transit px-3 py-1 rounded-full text-sm font-medium">Volunteer Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-status-success animate-pulse"></div>
            <span className="text-sm font-medium text-gray-500">On Duty</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Hello, {user?.full_name || "Volunteer"}</h1>
          <p className="text-gray-500">You have {activeDeliveries.length} active delivery routes today.</p>
        </div>

        {actionError && (
          <div className="mb-6 bg-status-error/10 text-status-error text-sm font-medium px-4 py-3 rounded-xl">
            {actionError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading deliveries...
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-gray-50">
            <p className="text-status-error font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-mono text-sm text-gray-500 font-bold">Route #{delivery.id}</span>
                  <span className="bg-status-transit text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{STEP_LABEL[delivery.status]}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6 relative">
                    <div className="absolute left-6 top-8 bottom-2 w-0.5 bg-gray-200"></div>

                    <div className="space-y-8 w-full">
                      <div className="flex gap-4 items-start relative z-10">
                        <div className="w-12 h-12 bg-white border-2 border-primary rounded-full flex items-center justify-center shrink-0">
                          <Map className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Pickup</p>
                          <h4 className="text-lg font-bold text-ink">{delivery.pickup_address}</h4>
                          <p className="text-gray-500 text-sm">{delivery.quantity} {delivery.unit} • {delivery.food_type}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start relative z-10">
                        <div className="w-12 h-12 bg-white border-2 border-secondary rounded-full flex items-center justify-center shrink-0">
                          <Navigation className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Dropoff</p>
                          <h4 className="text-lg font-bold text-ink">Partner NGO</h4>
                          <p className="text-gray-500 text-sm">Donation #{delivery.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-ink py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                      <Navigation className="w-4 h-4" /> Get Directions
                    </button>
                    {renderAction(delivery)}
                  </div>
                </div>
              </div>
            ))}
            {activeDeliveries.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-gray-50">
                <div className="w-16 h-16 bg-status-success/10 text-status-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">All caught up!</h3>
                <p className="text-gray-500">You have completed all assigned deliveries. Thank you!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
