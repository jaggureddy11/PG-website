import React, { useState, useEffect } from "react";
import { ShieldCheck, Cookie, ChevronRight, X } from "lucide-react";

interface CookieConsentProps {
  onOpenLegalModal?: (tab: "privacy" | "cookies" | "rules" | "terms") => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenLegalModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    try {
      const consent = localStorage.getItem("charla_cookie_consent");
      if (!consent) {
        // Show after a brief delay so page loads gracefully first
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("charla_cookie_consent", JSON.stringify({ type: "all", date: new Date().toISOString() }));
    } catch (err) {
      void err;
    }
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem("charla_cookie_consent", JSON.stringify({ type: "essential", date: new Date().toISOString() }));
    } catch (err) {
      void err;
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      className="charla-cookie-consent" 
      role="region" 
      aria-label="Cookie and Privacy Consent Banner"
    >
      <div className="charla-cookie-consent__card">
        <div className="charla-cookie-consent__header">
          <div className="charla-cookie-consent__icon-wrap" aria-hidden="true">
            <Cookie size={18} className="charla-cookie-consent__icon" />
          </div>
          <div className="charla-cookie-consent__title-wrap">
            <span className="charla-cookie-consent__badge">
              <ShieldCheck size={12} /> DPDP & Privacy Compliant
            </span>
            <h3 className="charla-cookie-consent__title">We value your privacy</h3>
          </div>
          <button
            type="button"
            className="charla-cookie-consent__close"
            onClick={handleEssentialOnly}
            aria-label="Dismiss cookie notice with essential cookies only"
          >
            <X size={16} />
          </button>
        </div>

        <p className="charla-cookie-consent__desc">
          We use essential local storage to remember your search preferences, save walkthrough slots, and keep your experience fast. We do not sell your personal data.
        </p>

        <div className="charla-cookie-consent__actions">
          <button
            type="button"
            className="charla-cookie-btn charla-cookie-btn--primary"
            onClick={handleAcceptAll}
          >
            Accept All
          </button>

          <button
            type="button"
            className="charla-cookie-btn charla-cookie-btn--secondary"
            onClick={handleEssentialOnly}
          >
            Essential Only
          </button>

          {onOpenLegalModal && (
            <button
              type="button"
              className="charla-cookie-btn charla-cookie-btn--text"
              onClick={() => onOpenLegalModal("cookies")}
            >
              <span>Learn more</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
