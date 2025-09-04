import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: crypto.randomUUID(), name: "User", email: "user@example.com" });
    navigate("/dashboard");
  };

  const handleGoogle = () => {
    alert("Google OAuth flow placeholder");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" required className="w-full h-11 border border-gray-300 rounded-lg px-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" required className="w-full h-11 border border-gray-300 rounded-lg px-3" />
        </div>
        <button type="submit" className="w-full h-11 rounded-lg bg-green-600 text-white font-semibold">Login</button>
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


