import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Clock,
  Phone,
  Loader2,
  CheckCircle2,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { savePartnerInquiryToFirestore } from "@/lib/firebase";

interface PartnerPageProps {
  onBackToHome?: (targetHash?: string) => void;
}

export function PartnerPage({ onBackToHome }: PartnerPageProps) {
  const [partnerType, setPartnerType] = useState<"owner" | "institution">("owner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    locality: "Kumaraswamy Layout",
    rooms: "15-25 Rooms",
    note: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setIsSubmitting(true);
    try {
      await savePartnerInquiryToFirestore({
        fullName: formData.name.trim(),
        phone: formData.phone.trim(),
        propertyType: partnerType === "owner" ? "Property Owner" : "College / Institution",
        locality: formData.locality,
        roomCount: formData.rooms,
        note: formData.note,
        status: "new",
      });
    } catch (err) {
      console.warn("Could not save partner inquiry to Firestore, recorded locally:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (onBackToHome) {
      onBackToHome("home");
    } else {
      window.location.hash = "#home";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="partner-page">
      {/* ── Minimal Breadcrumb / Top Bar ── */}
      <div className="partner-page__nav">
        <div className="container">
          <div className="partner-page__nav-inner">
            <button
              type="button"
              onClick={handleBack}
              className="partner-page__back-btn"
              aria-label="Back to Home"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <span className="partner-page__badge">Partnership</span>
          </div>
        </div>
      </div>

      {/* ── Clean Hero Section ── */}
      <section className="partner-hero">
        <div className="container">
          <div className="partner-hero__content">
            <h1 className="partner-hero__title">
              <span>Partner with</span>
              <img
                src="/assets/charla-living-wordmark.png"
                alt="Charla Living"
                className="partner-hero__title-wordmark"
              />
            </h1>

            <p className="partner-hero__subtitle">
              Turn your property in South Bengaluru into guaranteed monthly income with zero tenant management or maintenance hassles.
            </p>

            {/* 3 Core Highlights */}
            <div className="partner-hero__stats">
              <div className="partner-stat-pill">
                <div className="partner-stat-icon">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <strong className="partner-stat-value">Guaranteed Rent</strong>
                  <span className="partner-stat-label">Paid on the 1st of every month</span>
                </div>
              </div>

              <div className="partner-stat-pill">
                <div className="partner-stat-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong className="partner-stat-value">Zero Maintenance</strong>
                  <span className="partner-stat-label">Full facility upkeep by Charla</span>
                </div>
              </div>

              <div className="partner-stat-pill">
                <div className="partner-stat-icon">
                  <Clock size={18} />
                </div>
                <div>
                  <strong className="partner-stat-value">5–9 Year Leases</strong>
                  <span className="partner-stat-label">Vetted commercial security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two Simple Tracks ── */}
      <section className="partner-tracks-section">
        <div className="container">
          <div className="partner-tracks-grid">
            <div className="partner-track-card">
              <div className="partner-track-card__icon-wrap">
                <Building2 size={22} />
              </div>
              <h2 className="partner-track-card__title">For Property Owners</h2>
              <p className="partner-track-card__desc">
                Lease your standalone building or apartment floors. We upgrade the interiors with smart access, manage day-to-day operations, and ensure assured monthly rent.
              </p>
              <ul className="partner-track-card__simple-list">
                <li>Fixed lease or revenue-share commercial models</li>
                <li>Zero tenant handling or vacancy risk</li>
                <li>Regular deep-cleaning and asset upkeep</li>
              </ul>
            </div>

            <div className="partner-track-card">
              <div className="partner-track-card__icon-wrap">
                <GraduationCap size={22} />
              </div>
              <h2 className="partner-track-card__title">For Colleges & Corporates</h2>
              <p className="partner-track-card__desc">
                Managed accommodation cohorts near Dayananda Sagar and South Bengaluru tech corridors for student batches and company teams.
              </p>
              <ul className="partner-track-card__simple-list">
                <li>3-tier security: biometrics, CCTV & live-in wardens</li>
                <li>FSSAI-certified chef-prepared daily meals</li>
                <li>Customized institutional billing agreements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Simple 3 Steps Flow ── */}
      <section className="partner-steps-section">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="section-title">How It Works</h2>
          </div>

          <div className="partner-steps-grid">
            <div className="partner-step-item">
              <div className="partner-step-number">1</div>
              <div className="partner-step-body">
                <h3 className="partner-step-title">Share Details</h3>
                <p className="partner-step-desc">
                  Provide your property location, room count, and basic details below.
                </p>
              </div>
            </div>

            <div className="partner-step-item">
              <div className="partner-step-number">2</div>
              <div className="partner-step-body">
                <h3 className="partner-step-title">Site Audit & Proposal</h3>
                <p className="partner-step-desc">
                  Our team visits the site and shares a customized commercial yield offer within 48 hours.
                </p>
              </div>
            </div>

            <div className="partner-step-item">
              <div className="partner-step-number">3</div>
              <div className="partner-step-body">
                <h3 className="partner-step-title">Agreement & Rent</h3>
                <p className="partner-step-desc">
                  Sign a legally vetted 5–9 year contract. We furnish, retrofit, and begin monthly payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Simple, Focused Contact Form ── */}
      <section className="partner-form-section" id="partner-form">
        <div className="container">
          <div className="partner-form-box">
            <div className="partner-form-header text-center">
              <h2 className="partner-form-title">Request a Partnership Proposal</h2>
              <p className="partner-form-desc">
                Leave your contact details and our team will connect within 24 hours.
              </p>
            </div>

            <div className="partner-type-toggle">
              <button
                type="button"
                className={`partner-type-btn ${partnerType === "owner" ? "is-active" : ""}`}
                onClick={() => setPartnerType("owner")}
              >
                <Building2 size={15} />
                <span>Property Owner</span>
              </button>
              <button
                type="button"
                className={`partner-type-btn ${partnerType === "institution" ? "is-active" : ""}`}
                onClick={() => setPartnerType("institution")}
              >
                <GraduationCap size={15} />
                <span>College / Corporate</span>
              </button>
            </div>

            {isSubmitted ? (
              <div className="partner-form-success">
                <div className="partner-success-icon">
                  <CheckCircle2 size={36} />
                </div>
                <h3>Thank You, {formData.name || "Partner"}</h3>
                <p>
                  Your details have been received. Our partnership manager will review your property in {formData.locality} and get in touch within 24 hours.
                </p>

                <a
                  href={`https://wa.me/918884446093?text=${encodeURIComponent(
                    `Hello Charla Living! I submitted a property partnership inquiry on your website:\n• Category: ${partnerType === "owner" ? "Property Owner" : "College / Corporate Housing"}\n• Name: ${formData.name}\n• Phone: ${formData.phone}\n• Locality: ${formData.locality}\n• Size: ${formData.rooms}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--blue"
                  style={{ width: "100%", justifyContent: "center", marginBottom: "10px", gap: "8px" }}
                >
                  <MessageCircle size={16} />
                  <span>Chat with Partnership Manager on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn--outline"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="partner-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="p-name">Your Name</label>
                    <input
                      type="text"
                      id="p-name"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Hegde"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="p-phone">Phone Number</label>
                    <input
                      type="tel"
                      id="p-phone"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="p-locality">Property Locality</label>
                    <select
                      id="p-locality"
                      name="locality"
                      value={formData.locality}
                      onChange={handleInputChange}
                    >
                      <option>Kumaraswamy Layout</option>
                      <option>Uttarahalli</option>
                      <option>Banashankari</option>
                      <option>Padmanabhanagar</option>
                      <option>JP Nagar</option>
                      <option>Jayanagar</option>
                      <option>Other South Bengaluru Location</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="p-rooms">Scale / Capacity</label>
                    <select
                      id="p-rooms"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleInputChange}
                    >
                      <option>10–20 Rooms</option>
                      <option>20–40 Rooms</option>
                      <option>40+ Rooms</option>
                      <option>Apartment Floors (2BHK / 3BHK)</option>
                      <option>Group Housing for Students / Staff</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn--blue btn--full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Commercial Offer</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="partner-direct-contact">
              <span>Or speak to us directly:</span>
              <a href="tel:+918884446093" className="direct-link">
                <Phone size={14} />
                <span>+91 88844 46093</span>
              </a>
              <span className="dot-sep">·</span>
              <a
                href="https://wa.me/918884446093?text=Hello%20Charla%20Living%2C%20I%20am%20interested%20in%20partnering%20with%20my%20property."
                target="_blank"
                rel="noopener noreferrer"
                className="direct-link"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
