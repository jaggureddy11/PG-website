interface LegacyChromeProps {
  onNavigateHome?: () => void;
  onSelectResidence?: (id: string) => void;
}

export function LegacyChrome({ onNavigateHome }: LegacyChromeProps = {}) {
  const handleHomeClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
      window.location.hash = "home";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleResidencesClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
      window.location.hash = "residences";
      setTimeout(() => {
        const el = document.getElementById("residences");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <>
<div>
  <div className="topbar">
    <p><span>Zero brokerage</span><i /><span>1-month refundable deposit</span><i /><span>Six residences across South Bengaluru</span></p>
  </div>
  <header className="nav" id="nav">
    <div className="container nav__inner">
      <a href="#home" onClick={handleHomeClick} className="brand" aria-label="Charla Living home">
        <img src="/assets/logo.png" alt="Charla Living" className="brand__mark" width={96} height={64} />
      </a>
      <nav className="nav__links" aria-label="Primary">
        <a href="#residences" onClick={handleResidencesClick}>Residences</a>
        <a href="#amenities" onClick={(e) => { if (onNavigateHome) { e.preventDefault(); onNavigateHome(); setTimeout(() => document.getElementById("amenities")?.scrollIntoView({ behavior: "smooth" }), 50); } }}>Amenities</a>
        <a href="#map" onClick={(e) => { if (onNavigateHome) { e.preventDefault(); onNavigateHome(); setTimeout(() => document.getElementById("map")?.scrollIntoView({ behavior: "smooth" }), 50); } }}>Map</a>
        <a href="#stories" onClick={(e) => { if (onNavigateHome) { e.preventDefault(); onNavigateHome(); setTimeout(() => document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" }), 50); } }}>Stories</a>
        <a href="#faq" onClick={(e) => { if (onNavigateHome) { e.preventDefault(); onNavigateHome(); setTimeout(() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }), 50); } }}>FAQ</a>
      </nav>
      <div className="nav__cta">
        <a href="tel:+918884446093" className="nav__phone" aria-label="Call Charla Living at +91 88844 46093">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          <span>88844 46093</span>
        </a>
        <a href="#visit" className="btn btn--orange">Schedule a visit
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>
      <button className="nav__burger" id="burger" aria-label="Open menu" aria-expanded="false">
        <span /><span />
      </button>
    </div>
  </header>
  <div className="mmenu" id="mmenu" aria-hidden="true">
    <nav className="mmenu__links" aria-label="Mobile">
      <a href="#residences">Residences</a>
      <a href="#amenities">Amenities</a>
      <a href="#map">Map</a>
      <a href="#stories">Stories</a>
      <a href="#faq">FAQ</a>
    </nav>
    <a href="#visit" className="btn btn--orange btn--lg">Schedule a visit</a>
    <p className="mmenu__phone">or call <a href="tel:+918884446093">+91 88844 46093</a></p>
  </div>
</div>

    </>
  );
}
