import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input required className="w-full h-11 border border-gray-300 rounded-lg px-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" required className="w-full h-11 border border-gray-300 rounded-lg px-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mobile</label>
          <input type="tel" required className="w-full h-11 border border-gray-300 rounded-lg px-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Type</label>
          <select required className="w-full h-11 border border-gray-300 rounded-lg px-3">
            <option>EV Car</option>
            <option>EV Bike</option>
            <option>EV Scooter</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" required className="w-full h-11 border border-gray-300 rounded-lg px-3" />
        </div>
        <button type="submit" className="w-full h-11 rounded-lg bg-green-600 text-white font-semibold">Create account</button>
      </form>
      <div className="mt-4 text-sm text-center">
        <Link to="/login" className="text-green-700">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default SignupPage;


