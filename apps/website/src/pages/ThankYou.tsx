import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ThankYouPage() {
  const location = useLocation();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    const email = params.get("email");

    if (!sessionId) {
      setError("No order session found");
      setLoading(false);
      return;
    }

    // Fetch order details from mPanel
    fetch(`https://migrapanel.com/api/marketing/order-status/${sessionId}`, {
      headers: {
        "X-API-Key": import.meta.env.VITE_MPANEL_API_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrderData({ ...data.data, email });
        } else {
          setError(data.error || "Could not load order details");
        }
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        setError("Unable to load order details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful! 🎉</h1>
        
        {loading && (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {orderData && !loading && (
          <>
            <p className="text-lg text-gray-600 mb-8">
              {orderData.email ? (
                <>A confirmation email has been sent to <strong>{orderData.email}</strong></>
              ) : (
                "Thank you for choosing MigraHosting. Your hosting account is being set up."
              )}
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">#{orderData.subscriptionId?.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{orderData.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing:</span>
                  <span className="font-semibold capitalize">{orderData.billingCycle}</span>
                </div>
                {orderData.domain && !orderData.domain.startsWith('temp-') && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain:</span>
                    <span className="font-semibold">{orderData.domain}</span>
                  </div>
                )}
                {orderData.discount && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="font-semibold">${orderData.discount.originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-green-600">-${orderData.discount.amount.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-900 font-semibold">Total Paid:</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ${orderData.price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 What's Next?</h3>
              <ol className="space-y-2 text-gray-700">
                <li>1. Check your email for your account credentials</li>
                <li>2. Your hosting will be provisioned within a few minutes</li>
                <li>3. You'll receive another email when everything is ready</li>
                <li>4. Log in to your control panel to manage your hosting</li>
              </ol>
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://migrapanel.com"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl hover:shadow-lg transition"
          >
            Access Control Panel
          </a>
          <a
            href="https://migrahosting.com"
            className="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl border-2 border-purple-600 hover:bg-purple-50 transition"
          >
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
