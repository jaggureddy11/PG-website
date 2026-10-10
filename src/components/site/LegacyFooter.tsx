interface LegacyFooterProps {
  onSelectResidence?: (id: string) => void;
  onNavigateHome?: () => void;
  onNavigatePartner?: () => void;
}

export function LegacyFooter({ onSelectResidence, onNavigateHome, onNavigatePartner }: LegacyFooterProps = {}) {
  const handleResidenceClick = (e: React.MouseEvent, id: string) => {
    if (onSelectResidence) {
      e.preventDefault();
      onSelectResidence(id);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePartnerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigatePartner) {
      onNavigatePartner();
    } else {
      window.location.hash = "#/partner-with-us";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="footer">
        {/* ── Bengaluru Skyline Minimal Line Art Divider ── */}
        <div className="footer__sketch-divider" aria-hidden="true">
          <div className="footer__sketch-divider-inner">
            <img 
              src="/assets/bengaluru-skyline-minimal-line-art-cropped.png" 
              alt="" 
              className="footer__sketch-img" 
              width={2172} 
              height={250}
              loading="lazy" 
            />
          </div>
        </div>

        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <a href="#home" onClick={handleHomeClick} className="brand" aria-label="Charla Living home">
                <img src="/assets/logo.png" alt="Charla Living" className="brand__mark brand__mark--footer" width={114} height={76} />
              </a>
              <p>Family-run PG residences across South Bengaluru, hosting students and professionals since 2019.</p>
              <div className="footer__social">
                <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x={2} y={2} width={20} height={20} rx={5} /><circle cx={12} cy={12} r={4} /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg></a>
                <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
                <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 2c1.71.42 8.59.42 8.59.42s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" /></svg></a>
              </div>
            </div>
            <div className="footer__col">
              <h4>Our residences</h4>
              <a href="#/residence/kumaraswamy-layout" onClick={(e) => handleResidenceClick(e, "kumaraswamy-layout")}>PG in Kumaraswamy Layout</a>
              <a href="#/residence/uttarahalli" onClick={(e) => handleResidenceClick(e, "uttarahalli")}>PG in Uttarahalli</a>
              <a href="#/residence/banashankari" onClick={(e) => handleResidenceClick(e, "banashankari")}>PG in Banashankari</a>
              <a href="#/residence/padmanabhanagar" onClick={(e) => handleResidenceClick(e, "padmanabhanagar")}>PG in Padmanabhanagar</a>
              <a href="#/residence/jp-nagar" onClick={(e) => handleResidenceClick(e, "jp-nagar")}>PG in JP Nagar</a>
              <a href="#/residence/jayanagar" onClick={(e) => handleResidenceClick(e, "jayanagar")}>PG in Jayanagar</a>
            </div>
            <div className="footer__col">
              <h4>Explore</h4>
              <a href="#/partner-with-us" onClick={handlePartnerClick}>Partner with us</a>
              <a href="#map">Find us on the map</a>
              <a href="#how">How it works</a>
              <a href="#stories">Resident stories</a>
              <a href="#faq">FAQ</a>
              <a href="#visit">Schedule a visit</a>
            </div>
            <div className="footer__col">
              <h4>Contact</h4>
              <a href="tel:+918884446093">+91 88844 46093</a>
              <a href="mailto:hello@charlaliving.in">hello@charlaliving.in</a>
              <p className="footer__addr">4th Block, Jayanagar,<br />Bengaluru, Karnataka 560011</p>
            </div>
            <div className="footer__col">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">House rules</a>
              <a href="#/admin" style={{ opacity: 0.7, fontSize: "12px", marginTop: "4px" }}>Admin Space</a>
              <p className="footer__disclaimer">Images shown are for representational purposes only. Amenities depicted may or may not form a part of that individual property.</p>
              <p className="footer__availability">© <span id="year">2026</span> Charla Living.<br />All rooms subject to availability.</p>
            </div>
          </div>
        </div>

        <div className="footer__giant-wordmark-wrap">
          <img 
            src="/assets/charla-living-wordmark.png" 
            alt="Charla Living" 
            className="footer__giant-wordmark" 
            width={1017} 
            height={211}
            loading="lazy" 
          />
        </div>
      </footer>
    </>
  );
}
