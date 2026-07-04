import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Users, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const roles = [
  { id: "donor", title: "Donor", desc: "Restaurants, hotels, or events with surplus food", icon: Store },
  { id: "ngo", title: "NGO", desc: "Organizations distributing food to communities", icon: Users },
  { id: "volunteer", title: "Volunteer", desc: "Drivers and helpers transporting the food", icon: Truck },
  { id: "admin", title: "Administrator", desc: "Platform oversight and verification", icon: ShieldCheck },
];

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) return;
    
    // Simulate login
    login({
      id: "usr_mock_123",
      name: "Demo User",
      role: selectedRole
    });

    // Navigate to dashboard
    navigate(`/dashboard/${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bg p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-soft-lg p-10">
        <h2 className="text-3xl font-bold text-ink mb-2 text-center">How will you use SharePlate?</h2>
        <p className="text-gray-500 text-center mb-10 text-lg">Choose your primary role to customize your dashboard.</p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-gray-100 hover:border-gray-300 bg-white"
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isSelected ? "text-primary" : "text-ink"}`}>
                  {role.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {role.desc}
                </p>
              </button>
            )
          })}
        </div>

        <button 
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            selectedRole 
              ? "bg-primary hover:bg-primary-hover text-white shadow-soft" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Dashboard <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
