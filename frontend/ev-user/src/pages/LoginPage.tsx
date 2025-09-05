import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoogle = () => {
    alert("Google OAuth flow placeholder");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required 
            className="w-full h-11 border border-gray-300 rounded-lg px-3" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required 
            className="w-full h-11 border border-gray-300 rounded-lg px-3" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting || loading}
          className={`w-full h-11 rounded-lg font-semibold ${
            isSubmitting || loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {isSubmitting || loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4">
        <button onClick={handleGoogle} className="w-full h-11 rounded-lg border border-gray-300 font-semibold">Continue with Google</button>
      </div>
      <div className="mt-4 text-sm flex justify-between">
        <Link to="/forgot" className="text-green-700">Forgot Password?</Link>
        <Link to="/signup" className="text-green-700">Create an account</Link>
      </div>
    </div>
  );
};

export default LoginPage;


