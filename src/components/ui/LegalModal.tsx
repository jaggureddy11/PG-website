import React, { useEffect, useRef } from "react";
import { X, Shield, Cookie, Home, FileText, CheckCircle2 } from "lucide-react";

export type LegalTab = "privacy" | "cookies" | "rules" | "terms";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: LegalTab;
  onSelectTab: (tab: LegalTab) => void;
  onResetCookies?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onResetCookies,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="charla-legal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="legal-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="charla-legal-dialog" ref={modalRef}>
        <div className="charla-legal-header">
          <div className="charla-legal-header__brand">
            <span className="charla-legal-header__badge">Charla Living</span>
            <h2 id="legal-modal-title" className="charla-legal-header__title">
              Transparency & Legal Policies
            </h2>
          </div>
          <button
            type="button"
            className="charla-legal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="charla-legal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "privacy"}
            className={`charla-legal-tab ${activeTab === "privacy" ? "is-active" : ""}`}
            onClick={() => onSelectTab("privacy")}
          >
            <Shield size={15} />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "cookies"}
            className={`charla-legal-tab ${activeTab === "cookies" ? "is-active" : ""}`}
            onClick={() => onSelectTab("cookies")}
          >
            <Cookie size={15} />
            <span>Cookie Policy</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "rules"}
            className={`charla-legal-tab ${activeTab === "rules" ? "is-active" : ""}`}
            onClick={() => onSelectTab("rules")}
          >
            <Home size={15} />
            <span>House Rules</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "terms"}
            className={`charla-legal-tab ${activeTab === "terms" ? "is-active" : ""}`}
            onClick={() => onSelectTab("terms")}
          >
            <FileText size={15} />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="charla-legal-body">
          {activeTab === "privacy" && (
            <div className="charla-legal-section">
              <h3>Privacy Policy</h3>
              <p className="charla-legal-updated">Last Updated: October 2026</p>
              <p>
                Charla Living respects your privacy and is committed to protecting your personal data in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP)</strong> and applicable Indian data protection laws.
              </p>

              <h4>1. Information We Collect</h4>
              <ul>
                <li><strong>Contact details:</strong> Name, WhatsApp phone number, and email address provided when scheduling a walkthrough or inquiring about partner properties.</li>
                <li><strong>Visit preferences:</strong> Selected residence location, preferred room type (single, double, triple sharing), and chosen visit time slot.</li>
                <li><strong>Technical data:</strong> Non-personal device info, screen resolution, and approximate locality (only if GPS permission is granted to calculate distance to nearby residences).</li>
              </ul>

              <h4>2. How We Use Your Data</h4>
              <ul>
                <li>To confirm and coordinate property walkthroughs via WhatsApp or direct phone call.</li>
                <li>To respond to property owner partnership inquiries.</li>
                <li>To preserve your browsing filters (locality, pricing) between page sessions.</li>
                <li>We <strong>never sell, lease, or distribute</strong> your personal phone numbers or contact details to third-party telemarketers or advertisers.</li>
              </ul>

              <h4>3. Storage & Security</h4>
              <p>
                Inquiries are encrypted in transit and securely stored in Firebase Cloud Firestore hosted in Mumbai (asia-south1) with strict role-based access control.
              </p>

              <h4>4. Your Rights</h4>
              <p>
                You may request access to, correction of, or deletion of your contact records at any time by contacting our support team at <a href="mailto:hello@charlaliving.in">hello@charlaliving.in</a> or WhatsApp at <a href="https://wa.me/918884446093" target="_blank" rel="noopener noreferrer">+91 88844 46093</a>.
              </p>
            </div>
          )}

          {activeTab === "cookies" && (
            <div className="charla-legal-section">
              <h3>Cookie & Local Storage Policy</h3>
              <p className="charla-legal-updated">Last Updated: October 2026</p>
              <p>
                Charla Living uses minimal, privacy-first browser storage and cookies to provide you with a fast, modern property discovery experience.
              </p>

              <h4>1. Types of Storage We Use</h4>
              <div className="charla-legal-card-grid">
                <div className="charla-legal-mini-card">
                  <div className="charla-legal-mini-card__head">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <strong>Essential Functional Storage</strong>
                  </div>
                  <p>Required for essential features such as preserving active filters, gallery state, and remembering your consent status.</p>
                </div>
                <div className="charla-legal-mini-card">
                  <div className="charla-legal-mini-card__head">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <strong>Location Cache (Session)</strong>
                  </div>
                  <p>Temporarily holds distance calculations between your detected locality and nearby Charla residences during your visit.</p>
                </div>
              </div>

              <h4>2. No Third-Party Tracking Pixels</h4>
              <p>
                We do not inject invasive third-party ad retargeting pixels (e.g. ad networks that track you across the web). Your browsing inside Charla Living stays inside Charla Living.
              </p>

              <div className="charla-legal-reset-box">
                <div>
                  <strong>Manage Your Preferences</strong>
                  <p>You can clear your stored consent preference anytime to re-evaluate cookie settings.</p>
                </div>
                {onResetCookies && (
                  <button
                    type="button"
                    className="charla-legal-reset-btn"
                    onClick={() => {
                      onResetCookies();
                      onClose();
                    }}
                  >
                    Reset Cookie Settings
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="charla-legal-section">
              <h3>House Rules & Community Standards</h3>
              <p className="charla-legal-updated">Charla Living Community Charter</p>
              <p>
                Charla Living was built to provide a clean, respectful, and peaceful living environment for ambitious students and working professionals.
              </p>

              <h4>1. Peaceful Living & Quiet Hours</h4>
              <ul>
                <li>Quiet hours are observed from <strong>10:30 PM to 6:30 AM</strong> to respect working roommates and early morning study schedules.</li>
                <li>Loud speaker music or disruptive common area activities during quiet hours are strictly prohibited.</li>
              </ul>

              <h4>2. Cleanliness & Shared Hygiene</h4>
              <ul>
                <li>Daily professional housekeeping is provided for common zones and room floors.</li>
                <li>Residents are requested to maintain personal hygiene and keep dining and study areas tidy after use.</li>
              </ul>

              <h4>3. Visitor & Security Policy</h4>
              <ul>
                <li>Day visitors are permitted in designated lounge areas until 8:30 PM with prior caretaker check-in.</li>
                <li>Overnight external guests require prior property manager notice for community safety.</li>
              </ul>

              <h4>4. Zero Tolerance Policy</h4>
              <p>
                Illegal substances, hazardous materials, and disorderly conduct are strictly prohibited and will lead to immediate cancellation of tenancy.
              </p>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="charla-legal-section">
              <h3>Terms of Service</h3>
              <p className="charla-legal-updated">Last Updated: October 2026</p>
              
              <h4>1. Walkthroughs & Booking</h4>
              <p>
                Walkthrough bookings scheduled through our website are free of cost and do not obligate you to sign a lease. Room availability is subject to physical verification and timely confirmation.
              </p>

              <h4>2. Zero Brokerage Guarantee</h4>
              <p>
                Charla Living is family-run and directly managed. No resident is ever charged a broker fee, middleman commission, or booking surcharge.
              </p>

              <h4>3. Transparent Security Deposit</h4>
              <p>
                All residences operate on a transparent <strong>1-month security deposit</strong> policy. Deposits are refunded at the end of tenure minus agreed utility reconciliation and mandatory check-out notice conditions specified in your formal resident agreement.
              </p>

              <h4>4. Meal & Amenity Service</h4>
              <p>
                Fresh homestyle meals (up to 4 times daily depending on package), 100 Mbps Wi-Fi, and power backup are provided as part of managed residency terms.
              </p>
            </div>
          )}
        </div>

        <div className="charla-legal-footer">
          <span className="charla-legal-footer__note">Questions? Reach out to <a href="mailto:hello@charlaliving.in">hello@charlaliving.in</a></span>
          <button
            type="button"
            className="charla-cookie-btn charla-cookie-btn--primary"
            onClick={onClose}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
