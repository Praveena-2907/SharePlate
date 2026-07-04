import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { stats, pendingApprovals, activityFeed, ngos, volunteers } from "../../data/mockData";
import { Heart, LogOut, Users, Activity, Check, X, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-ink shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary text-primary" />
            SharePlate <span className="font-normal text-gray-400">Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-300">{user?.name || "System Admin"}</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Approvals */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold text-ink">Platform Overview</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wide">Meals Rescued</div>
              <div className="text-3xl font-bold text-primary">{stats.mealsRescued.toLocaleString()}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wide">Active Donors</div>
              <div className="text-3xl font-bold text-ink">{stats.activeDonors}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wide">Partner NGOs</div>
              <div className="text-3xl font-bold text-ink">{stats.partnerNgos}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
              <div className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wide">Volunteers</div>
              <div className="text-3xl font-bold text-ink">{stats.volunteers}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-status-pending" /> Pending Approvals
              </h2>
              <span className="bg-status-pending/20 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">{pendingApprovals.length} waiting</span>
            </div>
            <div className="divide-y divide-gray-50">
              {pendingApprovals.map(approval => (
                <div key={approval.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-ink">{approval.name}</h4>
                    <p className="text-sm text-gray-500">Type: <span className="font-medium text-gray-700">{approval.type}</span> • Submitted: {new Date(approval.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-status-success hover:bg-status-success/10 rounded-lg transition-colors"><Check className="w-5 h-5"/></button>
                    <button className="p-2 text-status-error hover:bg-status-error/10 rounded-lg transition-colors"><X className="w-5 h-5"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-ink text-lg">Recent NGOs</h3>
              </div>
              <div className="p-4 space-y-4">
                {ngos.map(ngo => (
                  <div key={ngo.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-ink">{ngo.name}</div>
                      <div className="text-xs text-gray-500">{ngo.city}</div>
                    </div>
                    {ngo.verified ? 
                      <span className="text-xs bg-status-success/10 text-status-success px-2 py-1 rounded font-bold">Verified</span> : 
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold">Pending</span>
                    }
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-ink text-lg">Volunteer Fleet</h3>
              </div>
              <div className="p-4 space-y-4">
                {volunteers.map(vol => (
                  <div key={vol.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-ink">{vol.name}</div>
                      <div className="text-xs text-gray-500">{vol.deliveriesCompleted} deliveries</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      vol.status === 'available' ? 'bg-status-success/10 text-status-success' :
                      vol.status === 'on_route' ? 'bg-status-transit/10 text-status-transit' :
                      'bg-gray-100 text-gray-500'
                    }`}>{vol.status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Activity Feed */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 h-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" /> Activity Feed
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {activityFeed.map((item, i) => (
                <div key={item.id} className="flex gap-4 relative">
                  {i !== activityFeed.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-24px] w-0.5 bg-gray-100"></div>}
                  <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-white shrink-0 mt-0.5 relative z-10"></div>
                  <div>
                    <p className="text-sm text-ink font-medium leading-snug mb-1">{item.text}</p>
                    <p className="text-xs text-gray-400 font-mono">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
