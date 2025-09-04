import MapSection from "../components/MapSection";
import { useAuth } from "../context/AuthContext";
import { startRazorpayPayment } from "../lib/razorpay";
import { useState } from "react";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // Example: charge INR 100.00
      const amountInPaise = 100 * 100;
      await startRazorpayPayment(
        {
          amountInPaise,
          name: "EV Slot Booking",
          description: "Slot payment",
          prefill: { name: user?.name || "User", email: user?.email },
        },
        (resp) => {
          setIsProcessingPayment(false);
          alert("Payment success! Transaction ID: " + resp.razorpay_payment_id);
        },
        (err) => {
          setIsProcessingPayment(false);
          const detail = err?.error?.description || err?.error?.reason || err?.description || "Payment failed";
          const code = err?.error?.code ? ` (code: ${err.error.code})` : "";
          console.error("Razorpay failure", err);
          alert(`Payment failed!\n${detail}${code}`);
        }
      );
    } catch (error) {
      setIsProcessingPayment(false);
      console.error("Payment error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome {user?.name || "User"}</h1>
          <p className="text-gray-600">Manage your EV charging</p>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Map with Stations</h2>
        <MapSection />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Slot Booking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 p-4 bg-white/80">
            <div className="mb-3">
              <label className="block text-sm font-medium">Station</label>
              <select className="w-full h-10 border border-gray-300 rounded-lg px-3">
                <option>Pick from map</option>
                <option>Station A</option>
                <option>Station B</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input type="date" className="w-full h-10 border border-gray-300 rounded-lg px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input type="time" className="w-full h-10 border border-gray-300 rounded-lg px-3" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-700">Recommended: 6:30 PM (Low wait)</div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" /> Urgent Mode
              </label>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-700">Price</div>
              <div className="font-semibold">₹100.00</div>
            </div>
            <button
              className={`w-full h-11 rounded-lg font-semibold transition-colors ${
                isProcessingPayment 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing...' : 'Confirm & Pay'}
            </button>
            {isProcessingPayment && (
              <p className="text-xs text-gray-600 mt-2 text-center">
                Please wait while we redirect you to payment...
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4 bg-white/80">
              <h3 className="font-semibold mb-2">Upcoming Bookings</h3>
              <div className="text-sm text-gray-700">No upcoming bookings</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 bg-white/80">
              <h3 className="font-semibold mb-2">Booking History</h3>
              <div className="text-sm text-gray-700">No past bookings</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 bg-white/80">
              <h3 className="font-semibold mb-2">Notifications</h3>
              <div className="text-sm text-gray-700">You will see alerts here</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Profile Settings</h2>
        <div className="rounded-xl border border-gray-200 p-4 bg-white/80 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="w-full h-10 border border-gray-300 rounded-lg px-3" defaultValue={user?.name || ''} />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input className="w-full h-10 border border-gray-300 rounded-lg px-3" defaultValue={user?.email || ''} />
          </div>
          <div>
            <label className="block text-sm font-medium">Vehicle Info</label>
            <input className="w-full h-10 border border-gray-300 rounded-lg px-3" placeholder="EV Model" />
          </div>
          <div>
            <label className="block text-sm font-medium">Payment Method</label>
            <input className="w-full h-10 border border-gray-300 rounded-lg px-3" placeholder="Save UPI / Card" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="h-10 px-4 rounded-lg bg-black text-white">Save</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;


