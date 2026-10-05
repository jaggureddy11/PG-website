import { useState, useEffect } from "react";
import { type Residence, RESIDENCES } from "@/data/residences";
import "@/residence.css";

interface ResidenceDetailProps {
  residence: Residence;
  onBack: () => void;
  onSelectResidence?: (id: string) => void;
}

const WEEKLY_MENU_DATA: Record<string, { breakfast: string[]; lunch: string[]; dinner: string[] }> = {
  Mon: {
    breakfast: ["Girnar Coffee / Masala Chai", "Green Chutney", "Kanda Batata Poha", "Lemon wedges", "Crisp Sev"],
    lunch: ["Dal Achari", "Green Salad", "Lauki Chatpata Masala", "Plain Rice", "Fresh Hot Phulka ROTI"],
    dinner: ["Baingan Do Pyaza", "Black Chana Masala", "Fresh Curd", "Plain Rice", "Fresh Hot Phulka ROTI"]
  },
  Tue: {
    breakfast: ["South Indian Filter Coffee", "Coconut & Tomato Chutneys", "Soft Idli & Crispy Vada", "Hot Veg Sambar"],
    lunch: ["Yellow Moong Dal Tadka", "Aloo Beans Poriyal", "Tomato Pepper Rasam", "Steamed Basmati Rice", "Tawa Phulkas"],
    dinner: ["Paneer Butter Masala", "Mixed Veg Handi", "Fresh Onion Salad", "Jeera Rice", "Butter Phulkas"]
  },
  Wed: {
    breakfast: ["Adrak Elaichi Chai", "Fresh Mint Chutney", "Stuffed Aloo Paratha", "Creamy Curd & Pickle"],
    lunch: ["Punjabi Chole Masala", "Fresh Phulkas / Puri", "Boondi Raita", "Steamed Rice", "Crisp Papad"],
    dinner: ["Shahi Paneer", "Dal Makhani", "Veg Dum Pulao", "Hot Phulka Rotis", "Warm Gulab Jamun"]
  },
  Thu: {
    breakfast: ["Filter Coffee / Milk", "Tangy Tomato Chutney", "Vegetable Upma / Uttapam", "Roasted Peanut Chutney"],
    lunch: ["Kashmiri Rajma Masala", "Aloo Gobhi Dry", "Steamed Rice", "Fresh Cucumber Salad", "Tawa Rotis"],
    dinner: ["Palak Paneer", "Toor Dal Fry", "Ghee Jeera Rice", "Carrot & Onion Salad", "Hot Phulka Rotis"]
  },
  Fri: {
    breakfast: ["Masala Chai / Filter Coffee", "Coconut Chutney & Sambar", "Crispy Masala Dosa", "Fresh Seasonal Fruit"],
    lunch: ["South Indian Sambar", "Bhindi Do Pyaza", "Mysore Rasam", "Steamed Rice & Curd", "Fried Appalam"],
    dinner: ["Veg Hyderabadi Biryani", "Mirchi Ka Salan", "Mix Veg Raita", "Paneer Tikka Masala", "Sweet Kheer"]
  },
  Sat: {
    breakfast: ["Ginger Cardamom Tea", "Green Mint Chutney", "Puri with Aloo Bhaji", "Fresh Cut Fruit Bowl"],
    lunch: ["Gujarati Khatti Meethi Dal", "Sev Tameta Nu Shaak", "Steamed Basmati Rice", "Crispy Roasted Papad", "Phulkas"],
    dinner: ["Kadai Paneer", "Dal Tadka", "Veg Hakka Fried Rice", "Crunchy Salad", "Hot Phulka Rotis"]
  },
  Sun: {
    breakfast: ["Special Filter Coffee", "Mysore Masala Dosa", "Coconut & Peanut Chutney", "Kesari Bath (Sweet)"],
    lunch: ["Special Chef's Dum Biryani", "Mirchi Ka Salan", "Cucumber Onion Raita", "Roasted Papad", "Gulab Jamun"],
    dinner: ["Pav Bhaji / Chole Bhature", "Chopped Onions & Lemon", "Jeera Rice & Dal Fry", "Chef's Weekend Dessert"]
  }
};

const NEARBY_LOCATIONS_MAP: Record<string, Array<{ name: string; dist: string }>> = {
  "jp-nagar": [
    { name: "Christ University Bannerghatta", dist: "0.2 km away" },
    { name: "NMIMS (Narsee Monjee Institute)", dist: "4 km away" },
    { name: "AMC Engineering College", dist: "4 km away" },
    { name: "T John College", dist: "3.9 km away" }
  ],
  "padmanabhanagar": [
    { name: "Dayananda Sagar University (DSU)", dist: "0.5 km away" },
    { name: "Carmel Pre-University College", dist: "0.3 km away" },
    { name: "Banashankari Metro Station", dist: "1.2 km away" },
    { name: "PES University Electronic City", dist: "4.5 km away" }
  ],
  "kumaraswamy-layout": [
    { name: "Dayananda Sagar College (DSCE)", dist: "0.2 km away" },
    { name: "Dayananda Sagar Dental College", dist: "0.3 km away" },
    { name: "Banashankari 2nd Stage Metro", dist: "1.0 km away" },
    { name: "Kumaraswamy Layout Bus Terminal", dist: "0.2 km away" }
  ],
  "uttarahalli": [
    { name: "Kumaran's Children's Home & College", dist: "0.8 km away" },
    { name: "RNS Institute of Technology (RNSIT)", dist: "2.5 km away" },
    { name: "JSS Academy of Technical Education", dist: "3.2 km away" },
    { name: "Uttarahalli Lake & Park", dist: "0.3 km away" }
  ],
  "chikkallasandra": [
    { name: "PES University Main Campus (Ring Rd)", dist: "2.1 km away" },
    { name: "BMS College of Engineering", dist: "3.5 km away" },
    { name: "Gowdanapalya Bus Station", dist: "0.4 km away" },
    { name: "Banashankari Metro", dist: "1.8 km away" }
  ],
  "banashankari": [
    { name: "BNM Institute of Technology (BNMIT)", dist: "0.7 km away" },
    { name: "BMS College of Engineering", dist: "2.0 km away" },
    { name: "Banashankari TTMC & Metro", dist: "0.4 km away" },
    { name: "National College Jayanagar", dist: "2.8 km away" }
  ]
};

export function ResidenceDetail({ residence, onBack, onSelectResidence }: ResidenceDetailProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    residence.roomTypes[1]?.id || residence.roomTypes[0]?.id || "single"
  );
  const [selectedDay, setSelectedDay] = useState<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun">("Mon");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [tourType, setTourType] = useState<"in-person" | "video">("in-person");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("12:00 PM – 01:30 PM");
  const [isBooked, setIsBooked] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsBooked(false);
    setIsMobileMenuOpen(false);
    setSelectedRoomId(residence.roomTypes[1]?.id || residence.roomTypes[0]?.id || "single");
  }, [residence.id]);

  const gallerySlides = [
    { src: residence.images.hero, label: "Master Suite & Furnished Bedroom" },
    { src: residence.images.room, label: "Spacious Air-Conditioned Room" },
    { src: residence.images.lounge, label: "Co-working & Community Lounge" },
    { src: residence.images.dining, label: "Hygienic Dining Area & Pantry" },
    { src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", label: "Attached Modern Washroom" },
    { src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", label: "High-Speed WiFi Study Desks" },
    { src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80", label: "Twin Sharing Layout" },
    { src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80", label: "Terrace Garden & Fitness Zone" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!isAutoPlaying || isGalleryOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gallerySlides.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isGalleryOpen, gallerySlides.length]);

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + gallerySlides.length) % gallerySlides.length);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % gallerySlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;
    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      if (e.key === "Escape") setIsGalleryOpen(false);
      if (e.key === "ArrowRight") setActivePhotoIdx((prev) => (prev + 1) % gallerySlides.length);
      if (e.key === "ArrowLeft") setActivePhotoIdx((prev) => (prev - 1 + gallerySlides.length) % gallerySlides.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, gallerySlides.length]);

  const selectedRoom = residence.roomTypes.find((r) => r.id === selectedRoomId) || residence.roomTypes[0];
  const galleryImages = gallerySlides.map((s) => s.src);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setIsBooked(true);
  };

  const scrollToBooking = () => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById("booking-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="residence-page">
      {/* ─── MINIMAL HEADER ─── */}
      <header className="nav" id="nav">
        <div className="container nav__inner">
          <a href="#home" onClick={(e) => { e.preventDefault(); onBack(); }} className="brand" aria-label="Charla Living home">
            <img src="/assets/logo.png" alt="Charla Living" className="brand__mark" width={96} height={64} />
          </a>

          <div className="nav__cta">
            <select
              value={residence.id}
              onChange={(e) => onSelectResidence?.(e.target.value)}
              className="residence-locality-dropdown"
              aria-label="Select locality"
            >
              <option value="kumaraswamy-layout">Kumaraswamy Layout</option>
              <option value="jp-nagar">JP Nagar (5th Phase)</option>
              <option value="jayanagar">Jayanagar (4th Block)</option>
              <option value="banashankari">Banashankari (2nd Stage)</option>
              <option value="padmanabhanagar">Padmanabhanagar</option>
              <option value="uttarahalli">Uttarahalli Main Rd</option>
            </select>

            <a href="tel:+918884446093" className="nav__phone" aria-label="Call Charla Living">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>88844 46093</span>
            </a>

            <button 
              onClick={scrollToBooking} 
              className="btn btn--orange"
            >
              Schedule visit
            </button>
          </div>

          <button 
            className={`nav__burger ${isMobileMenuOpen ? "open" : ""}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span /><span />
          </button>
        </div>
      </header>

      {/* ─── MOBILE DRAWER ─── */}
      <div className={`mmenu ${isMobileMenuOpen ? "open" : ""}`} aria-hidden={!isMobileMenuOpen}>
        <div style={{ padding: "16px 24px", width: "100%" }}>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
            Select Locality
          </label>
          <select
            value={residence.id}
            onChange={(e) => {
              onSelectResidence?.(e.target.value);
              setIsMobileMenuOpen(false);
            }}
            className="residence-locality-dropdown"
            style={{ width: "100%", height: "42px" }}
          >
            <option value="kumaraswamy-layout">Kumaraswamy Layout</option>
            <option value="jp-nagar">JP Nagar (5th Phase)</option>
            <option value="jayanagar">Jayanagar (4th Block)</option>
            <option value="banashankari">Banashankari (2nd Stage)</option>
            <option value="padmanabhanagar">Padmanabhanagar</option>
            <option value="uttarahalli">Uttarahalli Main Rd</option>
          </select>
        </div>

        <nav className="mmenu__links" aria-label="Mobile Navigation">
          <a href="#rooms" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" }); }}>Room Types &amp; Rent</a>
          <a href="#food" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById("food")?.scrollIntoView({ behavior: "smooth" }); }}>Daily Meals</a>
          <a href="#amenities" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById("amenities")?.scrollIntoView({ behavior: "smooth" }); }}>Amenities</a>
          <a href="#location" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById("location")?.scrollIntoView({ behavior: "smooth" }); }}>Location</a>
        </nav>
        
        <div style={{ padding: "0 24px 24px", width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button 
            onClick={scrollToBooking} 
            className="btn btn--orange btn--lg" 
            style={{ width: "100%", justifyContent: "center" }}
          >
            Schedule a visit
          </button>
          <a 
            href="tel:+918884446093" 
            className="btn btn--ghost" 
            style={{ width: "100%", justifyContent: "center", fontSize: "13.5px" }}
          >
            Call +91 88844 46093
          </a>
        </div>
      </div>

      {/* ─── HERO & GALLERY ─── */}
      <section className="residence-hero">
        <div className="container">
          {/* Back button strip */}
          <div className="residence-nav-strip">
            <button 
              onClick={onBack} 
              className="nav-back-link"
              aria-label="Back to all residences"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>All Residences</span>
            </button>
            <div className="residence-breadcrumbs">
              <span>Bengaluru</span>
              <span className="separator">/</span>
              <span>{residence.locality}</span>
            </div>
          </div>

          {/* Title Area */}
          <div className="residence-hero-header">
            <div>
              <div className="residence-meta-tags">
                <span className="residence-meta-tag residence-meta-tag--orange">
                  {residence.tag}
                </span>
                <span className="residence-meta-tag residence-meta-tag--blue">
                  Boys &amp; Working Men
                </span>
                <span className="residence-meta-tag residence-meta-tag--rating">
                  ★ 4.8 (40+ Reviews)
                </span>
              </div>
              <h1 className="residence-hero-title">{residence.headline}</h1>
              <p className="residence-hero-address">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx={12} cy={10} r={3} />
                </svg>
                <span>{residence.locationDetails}</span>
                <span style={{ color: "var(--line)" }}>•</span>
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>{residence.landmark}</span>
              </p>
            </div>
          </div>

          {/* Rolling Photo Gallery */}
          <div 
            className="residence-rolling-gallery"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sliding Reel Track */}
            <div 
              className="residence-rolling-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {gallerySlides.map((slide, idx) => (
                <div 
                  key={idx} 
                  className="residence-rolling-slide"
                  onClick={() => {
                    setActivePhotoIdx(idx);
                    setIsGalleryOpen(true);
                  }}
                >
                  <img src={slide.src} alt={`${residence.name} - ${slide.label}`} loading={idx === 0 ? "eager" : "lazy"} />
                </div>
              ))}
            </div>

            {/* Current Image Label Tag */}
            <div className="residence-rolling-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, color: "var(--orange)" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx={12} cy={10} r={3} />
              </svg>
              <span>{gallerySlides[currentSlide]?.label}</span>
            </div>

            {/* Photo Counter */}
            <div className="residence-rolling-counter">
              {currentSlide + 1} / {gallerySlides.length}
            </div>

            {/* Left / Right Nav Arrows */}
            <button
              type="button"
              className="residence-rolling-nav-btn residence-rolling-nav-btn--prev"
              onClick={handlePrevSlide}
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              className="residence-rolling-nav-btn residence-rolling-nav-btn--next"
              onClick={handleNextSlide}
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Bottom Controls Bar */}
            <div className="residence-rolling-bottom-bar">
              {/* Pagination Dots */}
              <div className="residence-rolling-dots">
                {gallerySlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`residence-rolling-dot ${currentSlide === idx ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* View All Photos Fullscreen Trigger */}
              <button 
                type="button" 
                className="residence-rolling-view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx(currentSlide);
                  setIsGalleryOpen(true);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, color: "var(--orange)" }}>
                  <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
                  <circle cx={8.5} cy={8.5} r={1.5} />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>View {gallerySlides.length}+ photos</span>
              </button>
            </div>
          </div>

          {/* Quick Highlight Cards (Scannable) */}
          <div className="residence-highlights-strip">
            <div className="residence-highlight-pill">
              <span className="residence-highlight-pill__label">Starting Rent</span>
              <span className="residence-highlight-pill__val" style={{ color: "var(--blue)" }}>
                ₹{residence.startingPrice.toLocaleString("en-IN")}<small style={{ fontSize: "11px", fontWeight: 400 }}> /mo</small>
              </span>
            </div>
            <div className="residence-highlight-pill">
              <span className="residence-highlight-pill__label">Deposit</span>
              <span className="residence-highlight-pill__val" style={{ color: "var(--orange)" }}>
                {residence.deposit}
              </span>
            </div>
            <div className="residence-highlight-pill">
              <span className="residence-highlight-pill__label">Food Included</span>
              <span className="residence-highlight-pill__val">
                3-4 Meals
              </span>
            </div>
            <div className="residence-highlight-pill">
              <span className="residence-highlight-pill__label">Brokerage</span>
              <span className="residence-highlight-pill__val" style={{ color: "#2BB673" }}>
                ₹0 Free
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STREAMLINED 2-COLUMN LAYOUT ─── */}
      <div className="container">
        <div className="residence-layout-container">
          
          {/* ════ LEFT COLUMN: FAST-SCANNABLE CONTENT ════ */}
          <div className="residence-main-stream">

            {/* 1. Interactive Room Selector (Segmented Tabs) */}
            <div className="residence-block" id="rooms">
              <div className="residence-block__header-row">
                <h2 className="residence-block__title">Room Types &amp; Pricing</h2>
                <span className="residence-badge-sub">All-inclusive monthly rent</span>
              </div>

              {/* Segmented Tab Buttons */}
              <div className="room-tabs-switcher">
                {residence.roomTypes.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  const combined = (room.id + " " + room.name).toLowerCase();
                  const personCount = combined.includes("single") || combined.includes("private")
                    ? 1 
                    : combined.includes("double") || combined.includes("twin") 
                    ? 2 
                    : combined.includes("triple") 
                    ? 3 
                    : combined.includes("quad") 
                    ? 4 
                    : 1;

                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`room-tab-btn ${isSelected ? "active" : ""}`}
                      aria-label={`${room.name} for ${personCount} person${personCount > 1 ? "s" : ""}`}
                    >
                      {/* Person Icons Row */}
                      <div className="room-tab-btn__icons" aria-hidden="true">
                        {Array.from({ length: personCount }).map((_, i) => (
                          <svg 
                            key={i} 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="room-tab-btn__person-icon"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        ))}
                      </div>
                      <span className="room-tab-btn__name">{room.name}</span>
                      <span className="room-tab-btn__price">₹{room.price.toLocaleString("en-IN")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Room Details Card */}
              <div className="room-active-card">
                <div className="room-active-card__head">
                  <div>
                    <h3 className="room-active-card__title">{selectedRoom.name}</h3>
                    <p className="room-active-card__tagline">{selectedRoom.tagline}</p>
                  </div>
                  <div className="room-active-card__price-badge">
                    <span className="room-active-card__amount">₹{selectedRoom.price.toLocaleString("en-IN")}</span>
                    <span className="room-active-card__per">/ month</span>
                  </div>
                </div>

                <div className="room-active-card__features">
                  <div className="room-feature-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    <span>{selectedRoom.bedType}</span>
                  </div>
                  {selectedRoom.features.map((feat, idx) => (
                    <div key={idx} className="room-feature-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="room-active-card__footer">
                  <span className="room-active-card__note">
                    ✨ Zero hidden fees · Electricity, Wi-Fi &amp; 3-4 daily meals included
                  </span>
                  <button 
                    onClick={scrollToBooking}
                    className="btn btn--orange"
                    style={{ padding: "8px 18px", fontSize: "13px" }}
                  >
                    Select &amp; Schedule Visit
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Amenities & Services (Capsule Pills) */}
            <div className="residence-block" id="amenities">
              <div className="residence-pills-group">
                <div className="residence-pills-subgroup">
                  <span className="residence-pills-label">Amenities</span>
                  <div className="residence-pills-wrap">
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <path d="M6 12V7a6 6 0 0 1 12 0v5" />
                        <line x1="10" y1="16" x2="10" y2="16.01" />
                        <line x1="14" y1="16" x2="14" y2="16.01" />
                      </svg>
                      <span>Attached Washroom</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                        <line x1="9" y1="12" x2="9.01" y2="12" />
                        <line x1="15" y1="12" x2="15.01" y2="12" />
                      </svg>
                      <span>Spacious Cupboard</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                      </svg>
                      <span>Private Balcony</span>
                    </div>
                  </div>
                </div>

                <div className="residence-pills-subgroup">
                  <span className="residence-pills-label">Services</span>
                  <div className="residence-pills-wrap">
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                      </svg>
                      <span>Hot and Delicious Meals</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                        <line x1="12" y1="20" x2="12.01" y2="20" />
                      </svg>
                      <span>High-Speed WIFI</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                      <span>Laundry Service</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v18M3 12h18M6 6l12 12M6 18L18 6" />
                      </svg>
                      <span>Professional Housekeeping</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="4" y1="10" x2="20" y2="10" />
                        <line x1="15" y1="6" x2="15.01" y2="6" />
                        <line x1="15" y1="15" x2="15.01" y2="15" />
                      </svg>
                      <span>Spacious Refrigerator</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="18" rx="2" />
                        <circle cx="12" cy="13" r="5" />
                        <path d="M12 10a3 3 0 0 1 3 3" />
                      </svg>
                      <span>Washing Machine</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>24x7 Security Surveillance</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <span>Water Purifier</span>
                    </div>
                    <div className="pill-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="15" rx="2" />
                        <polyline points="17 2 12 7 7 2" />
                      </svg>
                      <span>Flat Screen Television</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Amazing Amenities (Clean Line Icon Grid) */}
            <div className="residence-block">
              <h2 className="residence-block__title">
                Amazing <span style={{ color: "var(--blue)" }}>Amenities</span>
              </h2>

              <div className="amazing-amenities-grid">
                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="4" y1="9" x2="20" y2="9" />
                    <line x1="15" y1="5.5" x2="15.01" y2="5.5" />
                    <line x1="15" y1="14" x2="15.01" y2="14" />
                  </svg>
                  <span>Refrigerator</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="16" height="10" rx="2" />
                    <line x1="20" y1="10" x2="20" y2="14" />
                    <line x1="6" y1="10" x2="6" y2="14" />
                    <line x1="10" y1="10" x2="10" y2="14" />
                  </svg>
                  <span>Power Backup</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <circle cx="9" cy="9" r="1.5" />
                    <circle cx="15" cy="15" r="1.5" />
                  </svg>
                  <span>Indoor Games</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 6l7.5 7.5a2.12 2.12 0 0 1 0 3l-2 2a2.12 2.12 0 0 1-3 0L9 11" />
                    <path d="M2 19h5l3-3-3-3" />
                  </svg>
                  <span>CCTV</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
                    <path d="M8 7h8M8 11h8" />
                  </svg>
                  <span>House Keeping</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Security</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
                    <rect x="2" y="19" width="20" height="2" rx="1" />
                  </svg>
                  <span>Reception</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="18" rx="2" />
                    <circle cx="12" cy="13" r="5" />
                    <path d="M12 10a3 3 0 0 1 3 3" />
                  </svg>
                  <span>Wash</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                  <span>Wifi</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <polyline points="7 9 9 7 11 9" />
                    <polyline points="13 15 15 17 17 15" />
                  </svg>
                  <span>Lift</span>
                </div>

                <div className="amazing-amenity-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                  <span>Drinking Water</span>
                </div>
              </div>
            </div>

            {/* 4. Food Menu (Interactive Mon-Sun Meal Planner matching reference) */}
            <div className="residence-block" id="food-menu">
              <h2 className="residence-block__title">Food Menu</h2>
              
              <div className="food-menu-container">
                {/* Left Day Selector */}
                <div className="food-menu-days">
                  <span className="food-menu-days-title">Days<br/><small style={{ fontSize: "10px", fontWeight: 500, color: "var(--muted)" }}>Mon - Sun</small></span>
                  {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const).map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`food-day-btn ${selectedDay === day ? "active" : ""}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Right Meals Grid */}
                <div className="food-menu-cards">
                  {/* Breakfast */}
                  <div className="food-meal-card">
                    <div className="food-meal-card__header">
                      <div className="food-meal-card__name">Breakfast</div>
                      <div className="food-meal-card__time">07:30 - 09:00</div>
                    </div>
                    <div className="food-meal-items">
                      {WEEKLY_MENU_DATA[selectedDay].breakfast.map((item, idx) => (
                        <div key={idx} className="food-meal-item">{item}</div>
                      ))}
                    </div>
                    <div className="food-meal-arc breakfast-arc" />
                  </div>

                  {/* Lunch */}
                  <div className="food-meal-card">
                    <div className="food-meal-card__header">
                      <div className="food-meal-card__name">Lunch</div>
                      <div className="food-meal-card__time">12:30 - 14:30</div>
                    </div>
                    <div className="food-meal-items">
                      {WEEKLY_MENU_DATA[selectedDay].lunch.map((item, idx) => (
                        <div key={idx} className="food-meal-item">{item}</div>
                      ))}
                    </div>
                    <div className="food-meal-arc lunch-arc" />
                  </div>

                  {/* Dinner */}
                  <div className="food-meal-card">
                    <div className="food-meal-card__header">
                      <div className="food-meal-card__name">Dinner</div>
                      <div className="food-meal-card__time">19:30 - 21:00</div>
                    </div>
                    <div className="food-meal-items">
                      {WEEKLY_MENU_DATA[selectedDay].dinner.map((item, idx) => (
                        <div key={idx} className="food-meal-item">{item}</div>
                      ))}
                    </div>
                    <div className="food-meal-arc dinner-arc" />
                  </div>
                </div>
              </div>

              <div className="food-menu-disclaimer">
                *This food menu is currently being served on the residence and is subject to change in future.
              </div>
            </div>

            {/* 5. Nearby Locations (Matching Reference 3) */}
            <div className="residence-block" id="location">
              <h2 className="residence-block__title">
                Nearby <span style={{ color: "var(--blue)" }}>Locations</span>
              </h2>
              <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: "-4px 0 14px" }}>
                {residence.name} is strategically placed nearby key colleges, tech parks, and transit hubs.
              </p>

              <div className="nearby-loc-grid">
                {(NEARBY_LOCATIONS_MAP[residence.id] || NEARBY_LOCATIONS_MAP["jp-nagar"]).map((loc, idx) => (
                  <div key={idx} className="nearby-loc-card">
                    <div className="nearby-loc-name">{loc.name}</div>
                    <div className="nearby-loc-dist">{loc.dist}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Nearby Properties (Matching Reference 4) */}
            <div className="residence-block">
              <h2 className="residence-block__title">
                Nearby <span style={{ color: "var(--blue)" }}>Properties</span>
              </h2>

              <div className="nearby-props-grid">
                {Object.values(RESIDENCES).filter((r: Residence) => r.id !== residence.id).slice(0, 4).map((prop: Residence) => (
                  <div 
                    key={prop.id} 
                    className="nearby-prop-card"
                    onClick={() => {
                      if (onSelectResidence) onSelectResidence(prop.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <div className="nearby-prop-img-wrap">
                      <img src={prop.images.hero} alt={prop.name} />
                      <button
                        type="button"
                        className={`nearby-prop-fav-btn ${favorites[prop.id] ? "favorited" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prop.id, e);
                        }}
                        aria-label="Save to favorites"
                      >
                        <svg viewBox="0 0 24 24" fill={favorites[prop.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                    <div className="nearby-prop-body">
                      <div className="nearby-prop-name">{prop.name}</div>
                      <div className="nearby-prop-loc">{prop.locality} · {prop.tag || "Premium PG"}</div>
                      <div className="nearby-prop-price">
                        Starts ₹{prop.startingPrice.toLocaleString("en-IN")}<small>/mo</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. House Rules & Transparency */}
            <div className="residence-block">
              <h2 className="residence-block__title">House Rules &amp; Policies</h2>
              <div className="rules-compact-list">
                <div className="rule-compact-pill">
                  <span className="rule-dot" />
                  <span><strong>10:30 PM Gate Timings</strong> (Late biometric access for office shifts)</span>
                </div>
                <div className="rule-compact-pill">
                  <span className="rule-dot" />
                  <span><strong>Visitors Welcome</strong> in reception &amp; lounge area till 8:00 PM</span>
                </div>
                <div className="rule-compact-pill">
                  <span className="rule-dot" />
                  <span><strong>30-Day Notice Period</strong> with zero lock-in penalty</span>
                </div>
                <div className="rule-compact-pill">
                  <span className="rule-dot" />
                  <span><strong>100% Deposit Refund</strong> to your bank account within 3 days of checkout</span>
                </div>
              </div>
            </div>

          </div>

          {/* ════ RIGHT COLUMN: DESKTOP STICKY BOOKING CARD ════ */}
          <aside className="residence-booking-sidebar" id="booking-card">
            <div className="residence-booking-sidebar__header">
              <div className="residence-booking-sidebar__title">Schedule a Free Visit</div>
              <div className="residence-booking-sidebar__room-name">
                {selectedRoom.name}
              </div>
              <div className="residence-booking-sidebar__price-row">
                <span className="residence-booking-sidebar__price">
                  ₹{selectedRoom.price.toLocaleString("en-IN")}
                </span>
                <span className="residence-booking-sidebar__price-sub">/ mo (all-inclusive)</span>
              </div>
            </div>

            <div className="residence-booking-sidebar__body">
              {isBooked ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#E6F7ED", color: "#2BB673", display: "grid", placeItems: "center", margin: "0 auto 10px" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--ink)", marginBottom: "4px" }}>
                    Walkthrough Reserved!
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.4, marginBottom: "14px" }}>
                    We booked your {tourType === "video" ? "Video Tour" : "Visit"} for <strong>{selectedRoom.name}</strong> on {date} ({timeSlot}).
                  </p>
                  <button 
                    onClick={() => setIsBooked(false)}
                    className="btn btn--ghost"
                    style={{ width: "100%", justifyContent: "center", fontSize: "12.5px" }}
                  >
                    Book another slot
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="residence-booking-form">
                  <div className="residence-booking-field">
                    <label htmlFor="resTourType">Tour format</label>
                    <select
                      id="resTourType"
                      value={tourType}
                      onChange={(e) => setTourType(e.target.value as "in-person" | "video")}
                    >
                      <option value="in-person">In-Person Visit (with Chai &amp; Food Tasting)</option>
                      <option value="video">WhatsApp Live Video Walkthrough</option>
                    </select>
                  </div>

                  <div className="residence-booking-field">
                    <label htmlFor="resDate">Preferred date &amp; slot</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <input
                        id="resDate"
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                      <select
                        id="resSlot"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                      >
                        <option value="10:00 AM – 11:30 AM">10:00 AM (Morning)</option>
                        <option value="12:00 PM – 01:30 PM">12:00 PM (Lunch)</option>
                        <option value="03:00 PM – 04:30 PM">03:00 PM (Afternoon)</option>
                        <option value="05:30 PM – 07:00 PM">05:30 PM (Evening)</option>
                        <option value="07:30 PM – 09:00 PM">07:30 PM (Dinner)</option>
                      </select>
                    </div>
                  </div>

                  <div className="residence-booking-field">
                    <label htmlFor="resName">Your name</label>
                    <input
                      id="resName"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="residence-booking-field">
                    <label htmlFor="resPhone">WhatsApp Phone</label>
                    <input
                      id="resPhone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn--orange"
                    style={{ width: "100%", justifyContent: "center", marginTop: "2px" }}
                  >
                    <span>Confirm Free Walkthrough</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div className="residence-booking-sidebar__trust">
                    <div className="residence-booking-trust-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      <span>100% Free visit</span>
                    </div>
                    <div className="residence-booking-trust-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      <span>Zero brokerage</span>
                    </div>
                    <div className="residence-booking-trust-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      <span>1-Mo Deposit</span>
                    </div>
                  </div>

                  <div className="residence-booking-sidebar__call">
                    Direct Manager: <a href="tel:+918884446093">+91 88844 46093</a>
                  </div>
                </form>
              )}
            </div>
          </aside>

        </div>
      </div>

      {/* ─── MOBILE FLOATING BOTTOM BAR ─── */}
      <div className="residence-floating-bar" aria-label="Quick booking bar">
        <div>
          <div className="residence-floating-bar__price">
            ₹{selectedRoom.price.toLocaleString("en-IN")}<span style={{ fontSize: "11px", fontWeight: 400, color: "var(--muted)" }}> / mo</span>
          </div>
          <div className="residence-floating-bar__meta">
            {selectedRoom.name} · {residence.deposit} deposit
          </div>
        </div>
        <button 
          className="btn btn--orange"
          onClick={scrollToBooking}
        >
          <span>Schedule visit</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ─── LIGHTBOX MODAL ─── */}
      {isGalleryOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(12, 27, 52, 0.96)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>
              {residence.name} · Photo {activePhotoIdx + 1} of {galleryImages.length}
            </span>
            <button 
              onClick={() => setIsGalleryOpen(false)}
              style={{ padding: "8px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.1)", color: "#fff", cursor: "pointer", border: "none" }}
              aria-label="Close photo gallery"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", maxHeight: "70vh", margin: "auto 0" }}>
            <img 
              src={galleryImages[activePhotoIdx]} 
              alt={`Gallery Preview ${activePhotoIdx + 1}`} 
              style={{ maxHeight: "70vh", maxWidth: "100%", borderRadius: "var(--radius-sm)", objectFit: "contain" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", overflowX: "auto", padding: "8px 0" }}>
            {galleryImages.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                onClick={() => setActivePhotoIdx(i)}
                alt={`Thumbnail ${i + 1}`}
                style={{
                  width: "54px",
                  height: "54px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: activePhotoIdx === i ? "2px solid var(--orange)" : "1px solid rgba(255,255,255,0.2)",
                  opacity: activePhotoIdx === i ? 1 : 0.5
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
