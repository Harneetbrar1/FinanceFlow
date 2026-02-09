import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, BarChart3, Lock, TrendingUp } from "lucide-react";

/**
 * Home page - Landing page for the application
 */
export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-b from-primary-50 to-white"
    >
      {/* Hero Section */}
      <section className="container-responsive py-12 md:py-20 lg:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Take Control of Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Financial Future
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            FinanceFlow is your personal finance companion. Track expenses,
            manage budgets, and build wealth with intelligent insights and
            easy-to-use tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2 justify-center"
              >
                Go to Dashboard
                <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2 justify-center"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-responsive py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Powerful Features for Smart Money Management
        </h2>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          Everything you need to understand and improve your financial health in
          one place.
        </p>

        <div className="grid-responsive">
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Track Expenses"
            description="Easily track all your spending with automatic categorization and detailed reports."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Smart Budgets"
            description="Set spending limits and get alerts when you're close to exceeding your budget."
          />
          <FeatureCard
            icon={<Lock className="w-8 h-8" />}
            title="Bank-Level Security"
            description="Your data is encrypted and secured with industry-standard protocols."
          />
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container-responsive py-16 md:py-24 bg-primary-50 rounded-2xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who are already managing their finances
              smarter with FinanceFlow.
            </p>
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
            >
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

/**
 * Feature Card Component
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="card-hover p-6 md:p-8 text-center">
      <div className="flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-xl mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Home;
