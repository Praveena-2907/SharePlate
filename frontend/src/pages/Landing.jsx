import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Truck, Users, Activity, ChevronRight } from "lucide-react";
import { stats } from "../data/mockData";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Heart className="w-6 h-6 fill-primary" />
          SharePlate
        </Link>
        <div className="flex gap-4">
          <Link to="/login" className="text-ink font-medium px-4 py-2 hover:text-primary transition-colors">
            Log In
          </Link>
          <Link to="/register" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-colors shadow-soft hover:shadow-soft-lg">
            Join Now
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-ink leading-tight mb-6 tracking-tight">
            Share More. <br className="hidden md:block"/> Waste Less. <span className="text-primary">Feed Hope.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A civic-tech platform seamlessly connecting food donors, NGOs, and volunteers to rescue surplus food and distribute it to those in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-soft hover:shadow-soft-lg flex items-center justify-center gap-2">
              Start Donating <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/how-it-works" className="bg-white hover:bg-gray-50 text-ink border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-soft flex items-center justify-center">
              Learn More
            </Link>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">{stats.mealsRescued.toLocaleString()}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Meals Rescued</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">{stats.activeDonors}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Donors</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-status-transit">{stats.volunteers}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Volunteers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-ink">{stats.partnerNgos}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Partner NGOs</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-ink">Built for Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-shadow border border-gray-50">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Network</h3>
              <p className="text-gray-600 leading-relaxed">Every NGO and volunteer is thoroughly vetted to ensure food safety and reliable distribution to communities.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-shadow border border-gray-50">
              <div className="w-12 h-12 bg-status-transit/10 rounded-xl flex items-center justify-center mb-6 text-status-transit">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Logistics</h3>
              <p className="text-gray-600 leading-relaxed">Smart routing and instant notifications keep the supply chain moving while food is fresh and safe.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-shadow border border-gray-50">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 text-secondary">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Impact Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Watch your contribution grow with detailed analytics and stories from the communities you support.</p>
            </div>
          </div>
        </section>

        {/* How it Works Timeline */}
        <section className="py-24 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
            <div className="space-y-12">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">List Surplus Food</h3>
                  <p className="text-primary-100 text-lg opacity-90">Restaurants and event organizers easily log excess food quantities and pickup times.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Match & Accept</h3>
                  <p className="text-primary-100 text-lg opacity-90">Nearby NGOs are notified and can claim the donation based on their immediate community needs.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Pickup & Delivery</h3>
                  <p className="text-primary-100 text-lg opacity-90">Volunteers pick up the food and deliver it safely, tracked in real-time on our platform.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 text-center text-gray-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-ink">
            <Heart className="w-5 h-5 fill-primary text-primary" /> SharePlate
          </div>
          <p>© 2026 SharePlate Civic Tech. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
