import { useState, useEffect } from "react";

interface LegacyChromeProps {
  onNavigateHome?: (targetHash?: string) => void;
  onNavigateResidences?: () => void;
  onNavigatePartner?: () => void;
  onSelectResidence?: (id: string) => void;
  currentPage?: "home" | "residences" | "detail" | "partner";
}

interface NavItem {
  id: string;
  label: string;
  badge?: string;
  icon?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "residences", label: "Explore Residences" },
  { id: "partner", label: "Partner with Us" },
];

export function LegacyChrome({ onNavigateHome, onNavigateResidences, onNavigatePartner, currentPage = "home" }: LegacyChromeProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  // Track scroll position for navbar styling & scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      if (currentPage !== "home") {
        setActiveSection(currentPage);
        return;
      }

      // Section scrollspy
      const sections = ["home", "map", "visit"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const secId = sections[i];
        const el = document.getElementById(secId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(secId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const scrollToSection = (targetId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);

    if (targetId === "residences") {
      if (onNavigateResidences) {
        onNavigateResidences();
      } else {
        window.location.hash = "#/residences";
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (targetId === "partner") {
      if (onNavigatePartner) {
        onNavigatePartner();
      } else {
        window.location.hash = "#/partner-with-us";
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (onNavigateHome) {
      onNavigateHome(targetId);
    }

    window.location.hash = targetId;

    setTimeout(() => {
      if (targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    }, 60);
  };

  return (
    <>
      {/* ── Main Navigation Bar ── */}
      <header className={`nav ${isScrolled ? "scrolled" : ""}`} id="nav">
        <div className="container nav__inner">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection("home", e)}
            className="brand"
            aria-label="Charla Living home"
          >
            <img
              src="/assets/logo.png"
              alt="Charla Living"
              className="brand__mark"
              width={96}
              height={64}
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="nav__links" aria-label="Primary Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(item.id, e)}
                className={activeSection === item.id ? "is-active" : ""}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Call-to-Actions */}
          <div className="nav__cta">
            <a
              href="tel:+918884446093"
              className="nav__phone"
              aria-label="Call Charla Living at +91 88844 46093"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 88844 46093</span>
            </a>

            <button
              type="button"
              onClick={(e) => scrollToSection("visit", e)}
              className="btn btn--orange nav__visit-btn"
            >
              Schedule a visit
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile Right Controls (Quick Call + Hamburger) */}
          <div className="nav__mobile-actions">
            <a
              href="tel:+918884446093"
              className="nav__mobile-call-btn"
              aria-label="Call Charla Living"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>

            <button
              type="button"
              className={`nav__burger ${isMobileMenuOpen ? "open" : ""}`}
              id="burger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mmenu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* ── Modern Full Mobile Drawer ── */}
      <div
        className={`mmenu-backdrop ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`mmenu ${isMobileMenuOpen ? "open" : ""}`}
        id="mmenu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Mobile Menu Top Bar */}
        <div className="mmenu__header">
          <a
            href="#home"
            onClick={(e) => scrollToSection("home", e)}
            className="brand"
            aria-label="Charla Living home"
          >
            <img
              src="/assets/logo.png"
              alt="Charla Living"
              className="brand__mark"
              width={86}
              height={56}
            />
          </a>

          <button
            type="button"
            className="mmenu__close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="mmenu__body">
          <nav className="mmenu__links" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(item.id, e)}
                className={`mmenu__link ${activeSection === item.id ? "active" : ""}`}
              >
                <span>{item.label}</span>
                <svg className="mmenu__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}
          </nav>

          {/* Quick Action Footer in Mobile Drawer */}
          <div className="mmenu__footer">
            <button
              type="button"
              onClick={(e) => scrollToSection("visit", e)}
              className="btn btn--orange btn--lg mmenu__cta-btn"
            >
              Schedule a visit
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="mmenu__contact-row">
              <a href="tel:+918884446093" className="mmenu__contact-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Call +91 88844 46093</span>
              </a>

              <a
                href="https://wa.me/918884446093?text=Hi%20Charla%20Living%2C%20I%20would%20like%20to%20know%20more%20about%20your%20PGs"
                target="_blank"
                rel="noopener noreferrer"
                className="mmenu__contact-pill mmenu__contact-pill--whatsapp"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="mmenu__trust-badges">
              <span>Zero Brokerage</span>
              <span>•</span>
              <span>1-Mo Deposit</span>
              <span>•</span>
              <span>Daily Housekeeping</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
