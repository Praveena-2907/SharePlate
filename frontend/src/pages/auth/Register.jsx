import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/role-selection");
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <p className="mt-8 text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
