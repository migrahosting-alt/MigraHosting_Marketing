import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setIsVisible(false);
    // Enable all tracking/analytics here
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    setIsVisible(false);
    // Disable non-essential tracking/analytics here
  };

  const handleCustomize = () => {
    // You can implement a modal with detailed cookie preferences
    // Optionally redirect to cookie policy page or open a settings modal
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-[#0A0118]/95 backdrop-blur-lg border-t border-[#8A4DFF]/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 text-sm text-gray-300">
              <p>
                We use cookies and similar technologies to enable essential site functionality, analyze traffic, and personalize content. 
                By clicking <strong className="text-white">'Accept all'</strong>, you agree to our use of cookies for these purposes. 
                You can manage your preferences or withdraw consent at any time. 
                For more information, please read our{' '}
                <Link to="/cookies" className="text-[#8A4DFF] hover:underline font-medium">
                  Cookie Policy
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#8A4DFF] hover:underline font-medium">
                  Privacy Policy
                </Link>.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={handleRejectNonEssential}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors border border-gray-600 rounded-lg hover:border-gray-500"
              >
                Reject non-essential cookies
              </button>
              <button
                onClick={handleCustomize}
                className="px-4 py-2 text-sm font-medium text-[#8A4DFF] hover:text-[#a06fff] transition-colors"
              >
                Customize settings
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#8A4DFF] to-[#6B2FD6] rounded-lg hover:from-[#9B5FFF] hover:to-[#7C3FE7] transition-all shadow-lg shadow-[#8A4DFF]/20"
              >
                Accept all cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
