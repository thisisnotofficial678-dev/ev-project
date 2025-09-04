import React, { useState } from 'react';
import { Zap, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Background Image Section */}
      <div className="hidden lg:flex lg:w-2/3 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/022/693/300/small_2x/electric-car-charging-at-the-charging-station-electric-vehicle-concept-illustration-vector.jpg')`,
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content on the left side */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              EV Charge Admin
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Manage your electric vehicle charging network across Karnataka with our comprehensive admin dashboard
            </p>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-cyan-400">8</div>
                <div className="text-sm text-gray-300">Charging Stations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-purple-400">₹18.50</div>
                <div className="text-sm text-gray-300">Avg. Price/kWh</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/3 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-cyan-400">EV Charge Admin</h2>
          </div>

          {/* Login Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-400/20 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 px-8 py-8 text-center relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-cyan-200">Sign in to your admin dashboard</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center space-x-3 p-4 bg-red-900/50 border border-red-500/30 text-red-400 rounded-xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-cyan-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-cyan-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-300">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none shadow-lg hover:shadow-cyan-500/25"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-6 bg-gray-800/50 rounded-2xl border border-cyan-400/20">
                <h3 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                  Demo Credentials
                </h3>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-cyan-300">Admin:</span>
                    <span>admin@evcharge.com / password123</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-cyan-300">Sub-Admin:</span>
                    <span>subadmin@evcharge.com / password123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              © 2024 EV Charge Admin. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}