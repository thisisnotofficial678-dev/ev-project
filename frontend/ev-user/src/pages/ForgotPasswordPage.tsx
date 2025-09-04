import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset link sent (demo)");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" required className="w-full h-11 border border-gray-300 rounded-lg px-3" />
        </div>
        <button type="submit" className="w-full h-11 rounded-lg bg-green-600 text-white font-semibold">Send reset link</button>
      </form>
      <div className="mt-4 text-sm text-center">
        <Link to="/login" className="text-green-700">Back to login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;


