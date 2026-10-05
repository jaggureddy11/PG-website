import { type CSSProperties } from "react";

interface LegacySectionsProps {
  onSelectResidence?: (id: string) => void;
  onNavigateResidences?: () => void;
}

export function LegacySections({
  onSelectResidence: _onSelectResidence,
  onNavigateResidences: _onNavigateResidences
}: LegacySectionsProps = {}) {
  return (
    <>
<div>
  <section className="stats">
    <div className="container">
      <div className="stats__grid">
        <div className="stat" data-reveal>
          <span className="stat__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.8V21h14V9.8" /><path d="M10 21v-6h4v6" /></svg></span>
          <p className="stat__num"><span data-count={100}>0</span>%</p>
          <p className="stat__label">Consistent quality standard</p>
        </div>
        <div className="stat" data-reveal>
          <span className="stat__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx={9} cy={8} r="3.4" /><path d="M2.6 20c.8-3.5 3.4-5.2 6.4-5.2s5.6 1.7 6.4 5.2" /><circle cx="17.2" cy={9} r="2.6" /><path d="M15.8 15.1c2.6.4 4.6 1.9 5.4 4.6" /></svg></span>
          <p className="stat__num"><span data-count={500}>0</span>+</p>
          <p className="stat__label">Residents calling us home</p>
        </div>
        <div className="stat" data-reveal>
          <span className="stat__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
          <p className="stat__num"><span>24/7</span></p>
          <p className="stat__label">On-site manager & support</p>
        </div>
        <div className="stat" data-reveal>
          <span className="stat__icon stat__icon--star"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg></span>
          <p className="stat__num"><span data-count="4.8" data-decimal={1}>0</span></p>
          <p className="stat__label">Average Google rating</p>
        </div>
      </div>
    </div>
  </section>
  {/* ─── ALTERNATING STORY ZIGZAG SECTION (WITH FLOWING CONNECTING THREAD) ─── */}
  <section className="story-zigzag-section" id="stories">
    <div className="container">
      <div className="story-zigzag-wrap">
        {/* ─── Minimalist Orange Flowing Thread ─── */}
        <svg
          className="story-zigzag-thread-svg"
          viewBox="0 0 1200 2400"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="storyThreadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FB7009" />
              <stop offset="40%" stopColor="#FFA14A" />
              <stop offset="70%" stopColor="#FB7009" />
              <stop offset="100%" stopColor="#F95A00" />
            </linearGradient>
            <filter id="storyThreadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(251, 112, 9, 0.28)" />
            </filter>
          </defs>

          {/* Subtle Sketched Dashed Guide Trail */}
          <path
            id="storyThreadTrack"
            className="story-thread-track"
            stroke="rgba(251, 112, 9, 0.2)"
            strokeWidth="2"
            strokeDasharray="5 7"
            strokeLinecap="round"
          />

          {/* Smooth Luminous Orange Active Sketched Thread */}
          <path
            id="storyThreadPath"
            className="story-thread-path"
            stroke="url(#storyThreadGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#storyThreadGlow)"
          />
        </svg>

        {/* ─── ROW 1 (Image Left, Text Right) ─── */}
        <div className="story-row story-row--left-img">
          <div className="story-collage">
            <div className="story-card story-card--tall">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80" alt="Modern Charla Living residence building" />
            </div>
            <div className="story-card story-card--wide">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80" alt="Daily professional housekeeping and clean spaces" />
            </div>
          </div>

          <div className="story-content">
            <h2 className="story-title">
              Take your daily list of chores. And <span className="story-accent">tear it up</span>
            </h2>
            <p className="story-desc">
              You have better things to do than wash your clothes, clean up your room and cook your meals. Our team of in-house pros will do them all for you.
            </p>
          </div>
        </div>

        {/* ─── ROW 2 (Text Left, Image Right - ALTERNATING) ─── */}
        <div className="story-row story-row--right-img">
          <div className="story-content">
            <h2 className="story-title">
              Step into a room that has <span className="story-accent">room for everything</span>
            </h2>
            <p className="story-desc">
              Your clothes and bags won't be fighting for space on the same chair. Thoughtfully designed personal spaces with ample wardrobes, ergonomic desks, and peaceful sleep.
            </p>
          </div>

          <div className="story-collage story-collage--right">
            <div className="story-card story-card--tall">
              <img src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=700&q=80" alt="Spacious furnished bedroom with large wardrobe" />
            </div>
            <div className="story-card story-card--wide">
              <img src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=700&q=80" alt="Dedicated study work desk area" />
            </div>
          </div>
        </div>

        {/* ─── ROW 3 (Image Left, Text Right - ALTERNATING) ─── */}
        <div className="story-row story-row--left-img">
          <div className="story-collage">
            <div className="story-card story-card--tall">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80" alt="Bright and spacious cafeteria dining lounge" />
            </div>
            <div className="story-card story-card--wide">
              <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80" alt="Freshly cooked homestyle Indian meals" />
            </div>
          </div>

          <div className="story-content">
            <h2 className="story-title">
              Nutritious homestyle meals. Cooked <span className="story-accent">fresh daily</span>
            </h2>
            <p className="story-desc">
              No watery gravies or frozen supplies. Cooked fresh 4 times daily by dedicated kitchen teams with high-grade ingredients, weekly menu votes, and hot filter coffee whenever you need a recharge.
            </p>
          </div>
        </div>

        {/* ─── ROW 4 (Text Left, Image Right - ALTERNATING) ─── */}
        <div className="story-row story-row--right-img">
          <div className="story-content">
            <h2 className="story-title">
              Chill in common areas that are <span className="story-accent">anything but common</span>
            </h2>
            <p className="story-desc">
              Unwind on the breezy rooftop terrace, challenge flatmates to PlayStation tournaments, or catch live match screenings. A vibrant community where friends turn into family.
            </p>
          </div>

          <div className="story-collage story-collage--right">
            <div className="story-card story-card--tall">
              <img src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=80" alt="Rooftop evening celebration and lounge" />
            </div>
            <div className="story-card story-card--wide">
              <img src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=700&q=80" alt="Gaming console and entertainment zone" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section className="amenities" id="amenities">
    <div className="container amenities__grid">
      <div className="amenities__sticky" data-reveal>
        <span className="eyebrow"><span className="eyebrow__dot"></span>All-Inclusive Living</span>
        <h2 className="h2">Everything handled, <span className="story-accent">daily.</span></h2>
        <p className="section-sub">A residence should feel effortless — fresh meals on time, spotless rooms, lightning-fast internet, and zero hidden utility bills. That's our standard.</p>
        
        <div className="amenities__promise">
          <div className="amenities__promise-item">
            <span className="tick" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            <div>
              <strong>Zero Brokerage. Always.</strong>
              <p>Direct resident booking with property management, not a broker chain.</p>
            </div>
          </div>
          <div className="amenities__promise-item">
            <span className="tick" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            <div>
              <strong>Flexible 30-Day Notice</strong>
              <p>No lock-in traps. Hassle-free 100% deposit refund policy.</p>
            </div>
          </div>
          <div className="amenities__promise-item">
            <span className="tick" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            <div>
              <strong>Prompt 30-Min Maintenance</strong>
              <p>Raise a ticket anytime on the resident app, handled by on-site crew.</p>
            </div>
          </div>
        </div>

        <div className="amenities__cta-wrap">
          <a href="#visit" className="btn btn--primary">
            Book a free walkthrough
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>

      <div className="amenities__content-col">
        {/* Category Filter Pills */}
        <div className="amenities__filters" role="tablist" aria-label="Filter amenities by category" data-reveal>
          <button type="button" className="am-filter is-active" data-cat="all">All (8)</button>
          <button type="button" className="am-filter" data-cat="living">Daily Living</button>
          <button type="button" className="am-filter" data-cat="food">Food &amp; Dining</button>
          <button type="button" className="am-filter" data-cat="tech">Security &amp; Tech</button>
        </div>

        <div className="amenities__list">
          {/* Card 1: Wi-Fi */}
          <div className="amcard" data-cat="tech" data-reveal>
            <div className="amcard__top">
              <span className="amcard__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" /></svg>
              </span>
              <span className="amcard__badge">100 Mbps Fibre</span>
            </div>
            <div className="amcard__body">
              <h3>High-speed Wi-Fi</h3>
              <p>Dedicated high-speed fibre in every room with automated secondary backup for calls that can't drop.</p>
            </div>
            <div className="amcard__footer">
              <span className="amcard__status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Included in rent
              </span>
            </div>
          </div>

          {/* Card 2: Meals */}
          <div className="amcard" data-cat="food" data-reveal>
            <div className="amcard__top">
              <span className="amcard__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>
              </span>
              <span className="amcard__badge">4 Meals Daily</span>
            </div>
            <div className="amcard__body">
              <h3>Homely Fresh Meals</h3>
              <p>Four freshly prepared meals daily — balanced South &amp; North Indian menus with Sunday feast specials.</p>
            </div>
            <div className="amcard__footer">
              <span className="amcard__status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Cooked fresh daily
              </span>
            </div>
          </div>

          {/* Card 3: Housekeeping */}
          <div className="amcard" data-cat="living" data-reveal>
            <div className="amcard__top">
              <span className="amcard__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" /></svg>
              </span>
              <span className="amcard__badge">Daily Routine</span>
            </div>
            <div className="amcard__body">
              <h3>Daily Housekeeping</h3>
              <p>Rooms cleaned, surfaces dusted, and corridors mopped daily. Fresh bedsheets changed twice weekly.</p>
            </div>
            <div className="amcard__footer">
              <span className="amcard__status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Included in rent
              </span>
            </div>
          </div>

          {/* Card 4: Laundry */}
          <div className="amcard" data-cat="living" data-reveal>
            <div className="amcard__top">
              <span className="amcard__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x={2} y={4} width={20} height={16} rx={2} /><circle cx={12} cy={12} r={4} /><path d="M12 4v2" /></svg>
              </span>
              <span className="amcard__badge">In-House Hub</span>
            </div>
            <div className="amcard__body">
              <h3>Laundry &amp; Ironing</h3>
              <p>High-capacity smart washing machines on premises plus an iron-and-fold service on request.</p>
            </div>
            <div className="amcard__footer">
              <span className="amcard__status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Smart machines ready
              </span>
            </div>
          </div>

          {/* Card 5: Security */}
          <div className="amcard" data-cat="tech" data-reveal>
            <div className="amcard__top">
              <span className="amcard__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9.5 11.5l2 2 3.5-3.5" /></svg>
              </span>
              <span className="amcard__badge">Biometric &amp; CCTV</span>
            </div>
            <div className="amcard__body">
              <h3>24×7 Smart Security</h3>
              <p>Biometric access control, full entry CCTV coverage, and night guard presence with strict guest logs.</p>
            </div>
            <div className="amcard__footer">
              <span className="amcard__status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Always protected
              </span>
            </div>
          </div>

          {/* Card 6: Power Backup */}
          <div className="amcard" data-cat="tech" data-reveal>
            <div className="amcard__top">
              <span className="amcard__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              </span>
              <span className="amcard__badge">Zero Downtime</span>
            </div>
            <div className="amcard__body">
              <h3>100% Power Backup</h3>
              <p>Instant inverters for room lights, fans and Wi-Fi routers, plus diesel generators for building lifts.</p>
            </div>
            <div className="amcard__footer">
              <span className="amcard__status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Seamless switchover
              </span>
            </div>
          </div>

          {/* Card 7: Attached Washrooms */}
          <div className="amcard" data-cat="living" data-reveal>
            <div className="amcard__top">
              <span className="amcard__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2zM6 12V5a2 2 0 0 1 4 0" /><path d="M7 21l1-1M17 21l-1-1" /></svg>
              </span>
              <span className="amcard__badge">Private Ensuite</span>
            </div>
            <div className="amcard__body">
              <h3>Attached Washrooms</h3>
              <p>Private western-style washrooms with 24/7 instant hot geysers, modern fittings, and exhaust airflow.</p>
            </div>
            <div className="amcard__footer">
              <span className="amcard__status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Attached in every room
              </span>
            </div>
          </div>

          {/* Card 8: Fully Furnished */}
          <div className="amcard" data-cat="living" data-reveal>
            <div className="amcard__top">
              <span className="amcard__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" /></svg>
              </span>
              <span className="amcard__badge">Move-in Ready</span>
            </div>
            <div className="amcard__body">
              <h3>Fully Furnished Rooms</h3>
              <p>Ergonomic study desk, cushioned mattress, spacious wardrobe with personal key lock. Move in with one bag.</p>
            </div>
            <div className="amcard__footer">
              <span className="amcard__status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                All furniture included
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="container strip">
      <figure className="strip__item" data-parallax={-8} data-reveal>
        <img src="https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=800&q=75" alt="Fresh meals prepared in the residence kitchen" />
        <figcaption>The kitchen, 7 a.m.</figcaption>
      </figure>
      <figure className="strip__item strip__item--tall" data-parallax={6} data-reveal>
        <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=75" alt="Residents relaxing in the common lounge" />
        <figcaption>The lounge, after hours</figcaption>
      </figure>
      <figure className="strip__item" data-parallax={-5} data-reveal>
        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=75" alt="Clean attached washroom with geyser" />
        <figcaption>Washed twice a day</figcaption>
      </figure>
    </div>
  </section>
  <section className="locations" id="map">
    <div className="container">
      <div className="section-head" data-reveal>
        <h2 className="h2">All of South Bengaluru, <em>within reach.</em></h2>
        <p className="section-sub">Residences pinned across South Bengaluru. Tap one for directions, or call us and we'll tell you which address fits your commute best.</p>
      </div>
      <div className="locations__layout" data-reveal>
        <div className="mapwrap">
          <iframe id="gmap" title="Charla Living residences on the map" src="https://maps.google.com/maps?q=12.9187,77.5645&z=14&hl=en&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <div className="mapwrap__pins" id="mapPins">
            <a className="pin" style={{ "--i": "0" } as CSSProperties} data-lat="12.9089" data-lng="77.5528" data-locality="Kumaraswamy Layout" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Kumaraswamy+Layout+Bengaluru" target="_blank" rel="noopener" aria-label="Charla Living Kumaraswamy Layout — open in Google Maps">
              <svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6.5 1 2 5.6 2 11.2 2 19 12 31 12 31s10-12 10-19.8C22 5.6 17.5 1 12 1z" fill="currentColor" /><circle cx={12} cy={11} r="5.8" fill="#fff" /><text x={12} y="14.4" textAnchor="middle" fontSize="8.5" fontWeight={700} fill="currentColor" fontFamily="Inter, sans-serif">1</text></svg>
              <span className="pin__tip">Kumaraswamy Layout</span>
            </a>
            <a className="pin" style={{ "--i": "1" } as CSSProperties} data-lat="12.9068" data-lng="77.5440" data-locality="Uttarahalli" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Uttarahalli+Bengaluru" target="_blank" rel="noopener" aria-label="Charla Living Uttarahalli — open in Google Maps">
              <svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6.5 1 2 5.6 2 11.2 2 19 12 31 12 31s10-12 10-19.8C22 5.6 17.5 1 12 1z" fill="currentColor" /><circle cx={12} cy={11} r="5.8" fill="#fff" /><text x={12} y="14.4" textAnchor="middle" fontSize="8.5" fontWeight={700} fill="currentColor" fontFamily="Inter, sans-serif">2</text></svg>
              <span className="pin__tip">Uttarahalli</span>
            </a>
            <a className="pin" style={{ "--i": "2" } as CSSProperties} data-lat="12.9252" data-lng="77.5740" data-locality="Banashankari" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Banashankari+Bengaluru" target="_blank" rel="noopener" aria-label="Charla Living Banashankari — open in Google Maps">
              <svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6.5 1 2 5.6 2 11.2 2 19 12 31 12 31s10-12 10-19.8C22 5.6 17.5 1 12 1z" fill="currentColor" /><circle cx={12} cy={11} r="5.8" fill="#fff" /><text x={12} y="14.4" textAnchor="middle" fontSize="8.5" fontWeight={700} fill="currentColor" fontFamily="Inter, sans-serif">3</text></svg>
              <span className="pin__tip">Banashankari</span>
            </a>
            <a className="pin" style={{ "--i": "3" } as CSSProperties} data-lat="12.9149" data-lng="77.5610" data-locality="Padmanabhanagar" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Padmanabhanagar+Bengaluru" target="_blank" rel="noopener" aria-label="Charla Living Padmanabhanagar — open in Google Maps">
              <svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6.5 1 2 5.6 2 11.2 2 19 12 31 12 31s10-12 10-19.8C22 5.6 17.5 1 12 1z" fill="currentColor" /><circle cx={12} cy={11} r="5.8" fill="#fff" /><text x={12} y="14.4" textAnchor="middle" fontSize="8.5" fontWeight={700} fill="currentColor" fontFamily="Inter, sans-serif">4</text></svg>
              <span className="pin__tip">Padmanabhanagar</span>
            </a>
            <a className="pin" style={{ "--i": "4" } as CSSProperties} data-lat="12.9070" data-lng="77.5850" data-locality="JP Nagar" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+JP+Nagar+Bengaluru" target="_blank" rel="noopener" aria-label="Charla Living JP Nagar — open in Google Maps">
              <svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6.5 1 2 5.6 2 11.2 2 19 12 31 12 31s10-12 10-19.8C22 5.6 17.5 1 12 1z" fill="currentColor" /><circle cx={12} cy={11} r="5.8" fill="#fff" /><text x={12} y="14.4" textAnchor="middle" fontSize="8.5" fontWeight={700} fill="currentColor" fontFamily="Inter, sans-serif">5</text></svg>
              <span className="pin__tip">JP Nagar</span>
            </a>
            <a className="pin" style={{ "--i": "5" } as CSSProperties} data-lat="12.9305" data-lng="77.5830" data-locality="Jayanagar" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Jayanagar+Bengaluru" target="_blank" rel="noopener" aria-label="Charla Living Jayanagar — open in Google Maps">
              <svg viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6.5 1 2 5.6 2 11.2 2 19 12 31 12 31s10-12 10-19.8C22 5.6 17.5 1 12 1z" fill="currentColor" /><circle cx={12} cy={11} r="5.8" fill="#fff" /><text x={12} y="14.4" textAnchor="middle" fontSize="8.5" fontWeight={700} fill="currentColor" fontFamily="Inter, sans-serif">6</text></svg>
              <span className="pin__tip">Jayanagar</span>
            </a>
          </div>
        </div>
        <aside className="mapcard" data-reveal>
          <h3>Pick a pin</h3>
          <ul className="mapcard__list">
            <li>
              <a className="mapcard__row" data-locality="Kumaraswamy Layout" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Kumaraswamy+Layout+Bengaluru" target="_blank" rel="noopener">
                <span className="mapcard__num">1</span>
                <span className="mapcard__name">Kumaraswamy Layout</span>
                <span className="mapcard__meta">from ₹8,500 · 92 beds</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
              </a>
            </li>
            <li>
              <a className="mapcard__row" data-locality="Uttarahalli" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Uttarahalli+Bengaluru" target="_blank" rel="noopener">
                <span className="mapcard__num">2</span>
                <span className="mapcard__name">Uttarahalli</span>
                <span className="mapcard__meta">from ₹7,500 · 68 beds</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
              </a>
            </li>
            <li>
              <a className="mapcard__row" data-locality="Banashankari" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Banashankari+Bengaluru" target="_blank" rel="noopener">
                <span className="mapcard__num">3</span>
                <span className="mapcard__name">Banashankari</span>
                <span className="mapcard__meta">from ₹9,000 · 110 beds</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
              </a>
            </li>
            <li>
              <a className="mapcard__row" data-locality="Padmanabhanagar" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Padmanabhanagar+Bengaluru" target="_blank" rel="noopener">
                <span className="mapcard__num">4</span>
                <span className="mapcard__name">Padmanabhanagar</span>
                <span className="mapcard__meta">from ₹8,000 · 84 beds</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
              </a>
            </li>
            <li>
              <a className="mapcard__row" data-locality="JP Nagar" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+JP+Nagar+Bengaluru" target="_blank" rel="noopener">
                <span className="mapcard__num">5</span>
                <span className="mapcard__name">JP Nagar</span>
                <span className="mapcard__meta">from ₹10,500 · 64 beds</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
              </a>
            </li>
            <li>
              <a className="mapcard__row" data-locality="Jayanagar" href="https://www.google.com/maps/search/?api=1&query=Charla+Living+Jayanagar+Bengaluru" target="_blank" rel="noopener">
                <span className="mapcard__num">6</span>
                <span className="mapcard__name">Jayanagar</span>
                <span className="mapcard__meta">from ₹11,000 · 62 beds</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
              </a>
            </li>
          </ul>
          <p className="mapcard__foot">Live directions open in Google Maps — distances are short, walk the route on your visit.</p>
        </aside>
      </div>
    </div>
  </section>
  <section className="how" id="how">
    <div className="container">
      <div className="section-head" data-reveal>
        <h2 className="h2">From enquiry to keys in <em>72 hours.</em></h2>
      </div>
      <div className="how__steps">
        <div className="how__line" aria-hidden="true"><span id="howLine" /></div>
        <div className="step" data-reveal>
          <p className="step__num">01</p>
          <h3><span className="step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5.6-7-10.8a7 7 0 0 1 14 0C19 15.4 12 21 12 21z" /><circle cx={12} cy={10} r="2.6" /></svg></span>Pick your locality</h3>
          <p>Browse the residences, compare room types and prices, or just call us and say what you need.</p>
        </div>
        <div className="step" data-reveal>
          <p className="step__num">02</p>
          <h3><span className="step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x={1} y={5} width={15} height={14} rx={2} /></svg></span>Take the free walkthrough</h3>
          <p>Visit in person or over a video call. See the room you'll actually get — same floor, same light.</p>
        </div>
        <div className="step" data-reveal>
          <p className="step__num">03</p>
          <h3><span className="step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="4.5" /><path d="M10.8 12.2 21 2m-3.5 3.5L21 9" /></svg></span>Move in with one bag</h3>
          <p>Sign a one-page agreement, pay a one-month deposit, and collect your keys. Dinner's included that night.</p>
        </div>
      </div>
    </div>
  </section>
  <section className="stories" id="reviews">
    <div className="container section-head section-head--row stories__head" data-reveal>
      <div>
        <h2 className="h2">People stay <em>longer</em> here.</h2>
      </div>
      <aside className="stories__rating" aria-label="Rated 4.8 out of 5 from over 1,200 resident reviews">
        <span className="stories__rating-num">4.8</span>
        <span className="stories__rating-detail">
          <span className="stories__rating-stars" aria-hidden="true">★★★★★</span>
          <span className="stories__rating-copy">out of 5 · 1,200+ resident reviews</span>
        </span>
      </aside>
    </div>
    <div className="stories__marquee" data-reveal role="region" aria-label="Rolling resident feedback">
      <div className="stories__row stories__row--a">
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">The food is the reason I renewed. Hot rasam on a rainy day after a 10-hour shift — my mother approves of this PG, and she approves of nothing.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#003B99" } as CSSProperties}>AS</span>
            <div className="tcard__id"><strong>Ananya S.</strong><p>JP Nagar · 2 yrs · ★★★★★</p></div>
            <span className="tcard__tag">Food</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Wi-Fi never died once during my GATE prep, which is more than I can say for my last place. The owner personally fixed my geyser on a Sunday.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#FB7009" } as CSSProperties}>RV</span>
            <div className="tcard__id"><strong>Rohit V.</strong><p>Jayanagar · 14 mo · ★★★★★</p></div>
            <span className="tcard__tag">Wi-Fi</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">3-minute walk to class, laundry that comes back folded, and a strict no-nonsense guest policy. Exactly what a student needs, nothing he doesn't.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#B03A5B" } as CSSProperties}>AM</span>
            <div className="tcard__id"><strong>Arjun M.</strong><p>Kumaraswamy Layout · 8 mo · ★★★★☆</p></div>
            <span className="tcard__tag">Walk to class</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Night-shift nurse, odd hours. They keep my dinner aside without my asking. That one small thing made me move my sister in too.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#7A5C3E" } as CSSProperties}>DR</span>
            <div className="tcard__id"><strong>Divya R.</strong><p>Uttarahalli · 1 yr · ★★★★★</p></div>
            <span className="tcard__tag">Night shift</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">My room is cleaned before I even notice it needs cleaning. Bedsheets changed twice a week, like clockwork, every single week.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#3E5F7A" } as CSSProperties}>SP</span>
            <div className="tcard__id"><strong>Sneha P.</strong><p>Uttarahalli · 1.5 yrs · ★★★★★</p></div>
            <span className="tcard__tag">Housekeeping</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">The food is the reason I renewed. Hot rasam on a rainy day after a 10-hour shift — my mother approves of this PG, and she approves of nothing.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#003B99" } as CSSProperties}>AS</span>
            <div className="tcard__id"><strong>Ananya S.</strong><p>JP Nagar · 2 yrs · ★★★★★</p></div>
            <span className="tcard__tag">Food</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Wi-Fi never died once during my GATE prep, which is more than I can say for my last place. The owner personally fixed my geyser on a Sunday.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#FB7009" } as CSSProperties}>RV</span>
            <div className="tcard__id"><strong>Rohit V.</strong><p>Jayanagar · 14 mo · ★★★★★</p></div>
            <span className="tcard__tag">Wi-Fi</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">3-minute walk to class, laundry that comes back folded, and a strict no-nonsense guest policy. Exactly what a student needs, nothing he doesn't.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#B03A5B" } as CSSProperties}>AM</span>
            <div className="tcard__id"><strong>Arjun M.</strong><p>Kumaraswamy Layout · 8 mo · ★★★★☆</p></div>
            <span className="tcard__tag">Walk to class</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Night-shift nurse, odd hours. They keep my dinner aside without my asking. That one small thing made me move my sister in too.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#7A5C3E" } as CSSProperties}>DR</span>
            <div className="tcard__id"><strong>Divya R.</strong><p>Uttarahalli · 1 yr · ★★★★★</p></div>
            <span className="tcard__tag">Night shift</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">My room is cleaned before I even notice it needs cleaning. Bedsheets changed twice a week, like clockwork, every single week.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#3E5F7A" } as CSSProperties}>SP</span>
            <div className="tcard__id"><strong>Sneha P.</strong><p>Uttarahalli · 1.5 yrs · ★★★★★</p></div>
            <span className="tcard__tag">Housekeeping</span>
          </div>
        </article>
      </div>
      <div className="stories__row stories__row--b">
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Rooftop terrace is where half my team now does our sprint planning. Faster internet than office, and someone always refills the chai kettle.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#3E5F7A" } as CSSProperties}>KN</span>
            <div className="tcard__id"><strong>Karthik N.</strong><p>Padmanabhanagar · 10 mo · ★★★★★</p></div>
            <span className="tcard__tag">Rooftop</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Booked on Tuesday after a video tour, moved in on Friday. The room was exactly what they showed me — same view of the gulmohar tree outside.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#003B99" } as CSSProperties}>MT</span>
            <div className="tcard__id"><strong>Meghana T.</strong><p>Banashankari · 6 mo · ★★★★★</p></div>
            <span className="tcard__tag">Video tour</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Parents visited for one afternoon, approved the CCTV, the visitor log and the cook's sambhar in a single sitting. That's the review that matters.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#0E7C66" } as CSSProperties}>IK</span>
            <div className="tcard__id"><strong>Imran K.</strong><p>Jayanagar · 4 mo · ★★★★★</p></div>
            <span className="tcard__tag">Family-approved</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">Two metro stops from the office and exactly zero landlord drama. I should have moved out of my old flat years ago, honestly.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#B03A5B" } as CSSProperties}>NR</span>
            <div className="tcard__id"><strong>Navya R.</strong><p>Padmanabhanagar · 9 mo · ★★★★☆</p></div>
            <span className="tcard__tag">Working pro</span>
          </div>
        </article>
        <article className="tcard">
          <span className="tcard__glyph" aria-hidden="true">“</span>
          <p className="tcard__text">The filter coffee at 7 a.m. is worth the rent by itself. Everything after that — the meals, the cleaning, the quiet — feels like a bonus.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#FB7009" } as CSSProperties}>VC</span>
            <div className="tcard__id"><strong>Vivek C.</strong><p>JP Nagar · 1 yr · ★★★★★</p></div>
            <span className="tcard__tag">Filter coffee</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Rooftop terrace is where half my team now does our sprint planning. Faster internet than office, and someone always refills the chai kettle.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#3E5F7A" } as CSSProperties}>KN</span>
            <div className="tcard__id"><strong>Karthik N.</strong><p>Padmanabhanagar · 10 mo · ★★★★★</p></div>
            <span className="tcard__tag">Rooftop</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Booked on Tuesday after a video tour, moved in on Friday. The room was exactly what they showed me — same view of the gulmohar tree outside.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#003B99" } as CSSProperties}>MT</span>
            <div className="tcard__id"><strong>Meghana T.</strong><p>Banashankari · 6 mo · ★★★★★</p></div>
            <span className="tcard__tag">Video tour</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Parents visited for one afternoon, approved the CCTV, the visitor log and the cook's sambhar in a single sitting. That's the review that matters.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#0E7C66" } as CSSProperties}>IK</span>
            <div className="tcard__id"><strong>Imran K.</strong><p>Jayanagar · 4 mo · ★★★★★</p></div>
            <span className="tcard__tag">Family-approved</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">Two metro stops from the office and exactly zero landlord drama. I should have moved out of my old flat years ago, honestly.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#B03A5B" } as CSSProperties}>NR</span>
            <div className="tcard__id"><strong>Navya R.</strong><p>Padmanabhanagar · 9 mo · ★★★★☆</p></div>
            <span className="tcard__tag">Working pro</span>
          </div>
        </article>
        <article className="tcard" aria-hidden="true">
          <span className="tcard__glyph">“</span>
          <p className="tcard__text">The filter coffee at 7 a.m. is worth the rent by itself. Everything after that — the meals, the cleaning, the quiet — feels like a bonus.</p>
          <div className="tcard__foot">
            <span className="tcard__avatar" style={{ "--a": "#FB7009" } as CSSProperties}>VC</span>
            <div className="tcard__id"><strong>Vivek C.</strong><p>JP Nagar · 1 yr · ★★★★★</p></div>
            <span className="tcard__tag">Filter coffee</span>
          </div>
        </article>
      </div>
    </div>
  </section>
  <section className="faq" id="faq">
    <div className="container faq__grid">
      <div className="faq__intro" data-reveal>
        <h2 className="h2">Asked <em>every</em> week.</h2>
        <p className="section-sub">Straight answers, no fine print. For anything else, call us — a human picks up.</p>
        <a href="tel:+918884446093" className="btn btn--ghost">Talk to us</a>
      </div>
      <div className="faq__list">
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-rent" aria-expanded="false" aria-controls="faq-a-rent">
            <span>What does the monthly rent include?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-rent" role="region" aria-labelledby="faq-q-rent" aria-hidden="true"><p>Rent covers your furnished room, high-speed Wi-Fi, daily housekeeping, laundry machines, power backup and maintenance. Food plans are optional and billed separately at ₹3,200/month.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-deposit" aria-expanded="false" aria-controls="faq-a-deposit">
            <span>Is there brokerage or a huge deposit?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-deposit" role="region" aria-labelledby="faq-q-deposit" aria-hidden="true"><p>Never any brokerage — you rent directly from the owner. We take one month's rent as a fully refundable deposit, returned within 7 days of vacating.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-food" aria-expanded="false" aria-controls="faq-a-food">
            <span>How is the food, honestly?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-food" role="region" aria-labelledby="faq-q-food" aria-hidden="true"><p>Four meals a day, cooked fresh in-house by our own chefs. Rotating South and North Indian menus with veg and non-veg options, and a resident suggestion board that actually changes the menu.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-lockin" aria-expanded="false" aria-controls="faq-a-lockin">
            <span>Is there a lock-in period?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-lockin" role="region" aria-labelledby="faq-q-lockin" aria-hidden="true"><p>Most rooms have no lock-in at all. Give us 30 days' notice and move out whenever life changes — the deposit still comes back in full.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-safety" aria-expanded="false" aria-controls="faq-a-safety">
            <span>How safe are the residences?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-safety" role="region" aria-labelledby="faq-q-safety" aria-hidden="true"><p>Biometric entry, CCTV on all common areas, a night guard and a resident manager living on site. Guests sign in at the desk, and visiting hours end at 10 p.m.</p></div>
        </div>
        <div className="faq__item" data-reveal>
          <button className="faq__q" id="faq-q-visit" aria-expanded="false" aria-controls="faq-a-visit">
            <span>How do I schedule a visit?</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <div className="faq__a" id="faq-a-visit" role="region" aria-labelledby="faq-q-visit" aria-hidden="true"><p>Call or WhatsApp us on +91 88844 46093, or drop your number below. We host walkthroughs every day between 9 a.m. and 8 p.m. — video tours available if you're out of town.</p></div>
        </div>
      </div>
    </div>
  </section>
  <section className="visit" id="visit">
    <div className="container">
      <div className="visit__panel" data-reveal>
        <div className="visit__glow" aria-hidden="true" />
        <img className="visit__logo" src="/assets/logo.png" alt="Charla Living" width={180} height={120} data-reveal />
        <h2 className="visit__title" data-reveal>Your next home is closer than you think.<br />Come take a look.</h2>
        <p className="visit__sub" data-reveal>Leave your number and preferred locality. We'll call within 2 working hours and set up your walkthrough — chai included, pressure absent.</p>
        <form className="visit__form" id="visitForm" data-reveal>
          <div className="visit__field">
            <label htmlFor="visit-name">Your name</label>
            <input id="visit-name" type="text" name="name" placeholder="e.g. Ananya Rao" autoComplete="name" required />
          </div>
          <div className="visit__field">
            <label htmlFor="visit-phone">Phone number</label>
            <input id="visit-phone" type="tel" name="phone" placeholder="+91 98765 43210" inputMode="tel" autoComplete="tel" pattern="[0-9+ ]{10,14}" required />
          </div>
          <div className="visit__field">
            <label htmlFor="visit-locality">Preferred locality</label>
            <select id="visit-locality" name="locality" defaultValue="" required>
              <option value="" disabled>Choose a locality</option>
              <option>Kumaraswamy Layout</option>
              <option>Uttarahalli</option>
              <option>Banashankari</option>
              <option>Padmanabhanagar</option>
              <option>JP Nagar</option>
              <option>Jayanagar</option>
              <option>Not sure yet — guide me</option>
            </select>
          </div>
          <button type="submit" className="btn btn--orange">Request a callback
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </form>
        <p className="visit__alt" data-reveal>Prefer talking? <a href="tel:+918884446093">+91 88844 46093</a> · Mon–Sun, 9 a.m.–8 p.m.</p>
        <div className="visit__success" id="visitSuccess" hidden>
          <span className="tick tick--lg" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <h3>Done. We'll call you shortly.</h3>
          <p>Keep your phone close — a real person from our team will reach out.</p>
        </div>
      </div>
    </div>
  </section>
</div>

    </>
  );
}
