import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
        
        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold text-ink mb-2 text-center">Reset Password</h2>
            <p className="text-gray-500 text-center mb-8">Enter your email and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="you@example.com"
                />
              </div>
              
              <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold transition-colors">
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-status-success/10 text-status-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-2">Check your email</h2>
            <p className="text-gray-500 mb-8">We've sent a password reset link to your email address.</p>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link to="/login" className="text-gray-500 font-medium hover:text-primary flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
