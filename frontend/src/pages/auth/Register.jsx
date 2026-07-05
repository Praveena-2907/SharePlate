import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { extractErrorMessage } from "../../api/client";

const roles = [
  { id: "donor", label: "Donor" },
  { id: "ngo", label: "NGO" },
  { id: "volunteer", label: "Volunteer" },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "donor" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const profile = await register(form);
      navigate(`/dashboard/${profile.role}`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft-lg p-8">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Heart className="w-8 h-8 fill-primary" />
            SharePlate
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-ink mb-2 text-center">Join SharePlate</h2>
        <p className="text-gray-500 text-center mb-8">Create an account to start making an impact.</p>

        {error && (
          <div className="mb-6 bg-status-error/10 text-status-error text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={handleChange("full_name")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange("email")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange("password")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setForm((f) => ({ ...f, role: role.id }))}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    form.role === role.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
