import React, { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

interface CookieConsentProps {
  onOpenLegalModal?: (tab: "privacy" | "cookies" | "rules" | "terms") => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenLegalModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("charla_cookie_consent");
      if (!consent) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch (err) {
      void err;
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(
        "charla_cookie_consent",
        JSON.stringify({ accepted: true, date: new Date().toISOString() })
      );
    } catch (err) {
      void err;
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      className="charla-cookie-pill-wrap" 
      role="region" 
      aria-label="Cookie notification"
    >
      <div className="charla-cookie-pill">
        <div className="charla-cookie-pill__icon-wrap" aria-hidden="true">
          <Cookie size={20} className="charla-cookie-pill__icon" />
        </div>

        <div className="charla-cookie-pill__text">
          <span>This website uses cookies. </span>
          <button
            type="button"
            className="charla-cookie-pill__link"
            onClick={() => onOpenLegalModal?.("cookies")}
            title="Read cookie policy"
          >
            Learn more.
          </button>
        </div>

        <button
          type="button"
          className="charla-cookie-pill__ok"
          onClick={handleAccept}
          aria-label="Acknowledge cookies"
        >
          Ok
        </button>
      </div>
    </aside>
  );
};

export default CookieConsent;
