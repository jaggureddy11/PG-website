export function LegacyFooter() {
  return (
    <>
<footer className="footer">
  <div className="container">
    <div className="footer__grid">
      <div className="footer__brand">
        <a href="#home" className="brand" aria-label="Charla Living home">
          <img src="assets/logo.png" alt="Charla Living" className="brand__mark brand__mark--footer" width={114} height={76} />
        </a>
        <p>Six family-run PG residences across South Bengaluru, hosting students and professionals since 2019.</p>
        <div className="footer__social">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x={2} y={2} width={20} height={20} rx={5} /><circle cx={12} cy={12} r={4} /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg></a>
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
          <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 2c1.71.42 8.59.42 8.59.42s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" /></svg></a>
        </div>
      </div>
      <div className="footer__col">
        <h4>Our residences</h4>
        <a href="#residences">PG in Kumaraswamy Layout</a>
        <a href="#residences">PG in Uttarahalli</a>
        <a href="#residences">PG in Banashankari</a>
        <a href="#residences">PG in Padmanabhanagar</a>
        <a href="#residences">PG in JP Nagar</a>
        <a href="#residences">PG in Jayanagar</a>
      </div>
      <div className="footer__col">
        <h4>Explore</h4>
        <a href="#food">The kitchen</a>
        <a href="#amenities">Amenities</a>
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
    </div>
    <div className="footer__bar">
      <p>© <span id="year">2026</span> Charla Living. All rooms subject to availability.</p>
      <div className="footer__legal">
        <a href="#">Privacy</a><a href="#">Terms</a><a href="#">House rules</a>
      </div>
    </div>
  </div>
</footer>

    </>
  );
}
