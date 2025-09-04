import { Link, useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Signed up (demo)");
    navigate("/login");
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


