import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Eye, 
  Compass, 
  Navigation, 
  Bath, 
  BedDouble, 
  UserRound, 
  Map as MapIcon, 
  List as ListIcon,
  X,
  CheckCircle,
  Loader2,
  Building2,
  Layers
} from "lucide-react";
import { calculateDistanceKm } from "@/utils/location";
import { saveCallbackRequestToFirestore, saveVisitBookingToFirestore } from "@/lib/firebase";
import { ResidencesBannerCarousel } from "./ResidencesBannerCarousel";
import { ResidencesMapView } from "./ResidencesMapView";

export interface ResidenceItem {
  id: string;
  name: string;
  houseName: string;
  locality: string;
  localityId: string;
  lat: number;
  lng: number;
  xPercent: number;
  yPercent: number;
  price: string;
  priceNum: number;
  flag: string;
  flagType: "blue" | "orange";
  gender: "Male" | "Female" | "Unisex";
  viewingCount: number;
  rating: string;
  reviewsCount: string;
  locationSnippet: string;
  proximityBadge: string;
  sharingTypes: string[];
  highlights: string[];
  image: string;
  alt: string;
  distanceKm?: number;
}

export const RESIDENCE_ITEMS: ResidenceItem[] = [
  {
    id: "kumaraswamy-layout",
    name: "Charla Living — Tumaco House",
    houseName: "Tumaco House",
    locality: "Kumaraswamy Layout",
    localityId: "kumaraswamy-layout",
    lat: 12.9089,
    lng: 77.5528,
    xPercent: 42,
    yPercent: 76,
    price: "₹8,500",
    priceNum: 8500,
    flag: "Preferred By Students",
    flagType: "orange",
    gender: "Male",
    viewingCount: 7,
    rating: "4.9",
    reviewsCount: "148",
    locationSnippet: "0.8 km away from your location",
    proximityBadge: "Near DSCE Campus",
    sharingTypes: ["Triple"],
    highlights: ["4 Fresh Meals / Day", "100 Mbps Wi-Fi", "Attached Washrooms", "Daily Cleaning"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80",
    alt: "Charla Living Tumaco House Kumaraswamy Layout"
  },
  {
    id: "uttarahalli",
    name: "Charla Living — Rotherham House",
    houseName: "Rotherham House",
    locality: "Uttarahalli",
    localityId: "uttarahalli",
    lat: 12.9068,
    lng: 77.5440,
    xPercent: 18,
    yPercent: 64,
    price: "₹7,500",
    priceNum: 7500,
    flag: "Preferred By Students",
    flagType: "orange",
    gender: "Male",
    viewingCount: 12,
    rating: "4.8",
    reviewsCount: "96",
    locationSnippet: "0.8 km away from your location",
    proximityBadge: "Transit Hub",
    sharingTypes: ["Single", "Double", "Triple"],
    highlights: ["Veg & Non-Veg Plans", "On-Site Parking", "100 Mbps Wi-Fi", "Linen & Laundry"],
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    alt: "Furnished lounge at Charla Living Rotherham House Uttarahalli"
  },
  {
    id: "banashankari",
    name: "Charla Living — Anamur House",
    houseName: "Anamur House",
    locality: "Banashankari",
    localityId: "banashankari",
    lat: 12.9252,
    lng: 77.5740,
    xPercent: 32,
    yPercent: 30,
    price: "₹9,000",
    priceNum: 9000,
    flag: "Preferred By Students",
    flagType: "orange",
    gender: "Female",
    viewingCount: 9,
    rating: "4.9",
    reviewsCount: "182",
    locationSnippet: "1.5 km away from your location",
    proximityBadge: "3 Min to Metro",
    sharingTypes: ["Double", "Triple"],
    highlights: ["AC Rooms Available", "Attached Washrooms", "4 Homestyle Meals", "Power Backup"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
    alt: "Premium double room at Charla Living Anamur House Banashankari"
  },
  {
    id: "padmanabhanagar",
    name: "Charla Living — Brigade House",
    houseName: "Brigade House",
    locality: "Padmanabhanagar",
    localityId: "padmanabhanagar",
    lat: 12.9149,
    lng: 77.5610,
    xPercent: 40,
    yPercent: 50,
    price: "₹8,000",
    priceNum: 8000,
    flag: "Newly Renovated",
    flagType: "blue",
    gender: "Unisex",
    viewingCount: 8,
    rating: "4.8",
    reviewsCount: "114",
    locationSnippet: "1.1 km away from your location",
    proximityBadge: "Quiet Neighborhood",
    sharingTypes: ["Double", "Triple"],
    highlights: ["Rooftop Terrace Lounge", "RO Water Purifiers", "Biometric Entry", "Hot Water 24/7"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    alt: "Modern interiors at Charla Living Brigade House Padmanabhanagar"
  },
  {
    id: "jp-nagar",
    name: "Charla Living — Cyber House",
    houseName: "Cyber House",
    locality: "JP Nagar",
    localityId: "jp-nagar",
    lat: 12.9070,
    lng: 77.5850,
    xPercent: 74,
    yPercent: 65,
    price: "₹10,500",
    priceNum: 10500,
    flag: "Professionals' Pick",
    flagType: "orange",
    gender: "Male",
    viewingCount: 15,
    rating: "4.9",
    reviewsCount: "210",
    locationSnippet: "0.6 km away from your location",
    proximityBadge: "Tech Corridor",
    sharingTypes: ["Single", "Double"],
    highlights: ["Ergonomic Work Desks", "Night-Shift Friendly", "Fiber Wi-Fi & Backup", "Cafeteria Meals"],
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
    alt: "Hotel-style single room at Charla Living Cyber House JP Nagar"
  },
  {
    id: "jayanagar",
    name: "Charla Living — South End House",
    houseName: "South End House",
    locality: "Jayanagar",
    localityId: "jayanagar",
    lat: 12.9305,
    lng: 77.5830,
    xPercent: 76,
    yPercent: 26,
    price: "₹11,000",
    priceNum: 11000,
    flag: "Flagship Residence",
    flagType: "blue",
    gender: "Unisex",
    viewingCount: 19,
    rating: "5.0",
    reviewsCount: "240",
    locationSnippet: "0.4 km away from your location",
    proximityBadge: "Flagship Location",
    sharingTypes: ["Single", "Double"],
    highlights: ["Chef-Prepared Gourmet Menu", "Resident Lounge & Gaming", "Premium Custom Beds", "Daily Room Service"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
    alt: "Warm furnished bedroom at Charla Living South End House Jayanagar"
  }
];

const LOCALITY_FILTERS = [
  { id: "all", label: "All Localities" },
  { id: "kumaraswamy-layout", label: "Kumaraswamy Layout" },
  { id: "uttarahalli", label: "Uttarahalli" },
  { id: "banashankari", label: "Banashankari" },
  { id: "padmanabhanagar", label: "Padmanabhanagar" },
  { id: "jp-nagar", label: "JP Nagar" },
  { id: "jayanagar", label: "Jayanagar" },
];

export interface ResidencesPageProps {
  residences?: ResidenceItem[];
  onSelectResidence?: (id: string) => void;
  selectedLocality?: string;
  onSelectLocality?: (locality: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  userCoords?: { lat: number; lng: number } | null;
  detectedLocalityInfo?: { id: string; name: string; distanceKm: number } | null;
  roomTypeFilter?: string;
  onClearLocation?: () => void;
  onBackToHome?: (hash?: string) => void;
}

export function ResidencesPage({
  residences: propResidences,
  onSelectResidence,
  selectedLocality: propLocality,
  onSelectLocality,
  sortBy: propSortBy,
  onSortChange,
  userCoords,
  detectedLocalityInfo,
  roomTypeFilter = "any",
  onClearLocation,
  onBackToHome
}: ResidencesPageProps) {
  const [internalLocality, setInternalLocality] = useState<string>("all");
  const [internalSortBy, setInternalSortBy] = useState<string>("featured");
  const [selectedGender, setSelectedGender] = useState<"all" | "Male" | "Female" | "Unisex">("all");
  const [activeResidenceId, setActiveResidenceId] = useState<string | null>(null);
  const [mobileViewMode, setMobileViewMode] = useState<"list" | "map">("list");

  // Unified Property Interaction Modal State (Matching Stanza Reference UI)
  const [activeModalResidence, setActiveModalResidence] = useState<ResidenceItem | null>(null);
  const [modalTab, setModalTab] = useState<"visit" | "callback">("visit");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Visit-specific details
  const [visitTourFormat, setVisitTourFormat] = useState<"in-person" | "video">("in-person");
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [visitSlot, setVisitSlot] = useState("12:00 PM (Lunch)");
  const [visitSharing, setVisitSharing] = useState("Private");

  // Modal Submission & Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0];

  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const selectedLocality = propLocality !== undefined ? propLocality : internalLocality;
  const sortBy = propSortBy !== undefined ? propSortBy : internalSortBy;

  const rawItems = propResidences && propResidences.length > 0 ? propResidences : RESIDENCE_ITEMS;

  // Set default active residence on initial load
  useEffect(() => {
    if (!activeResidenceId && rawItems.length > 0) {
      setActiveResidenceId(rawItems[0].id);
    }
  }, [rawItems, activeResidenceId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModalResidence && !isSubmitting) {
        setActiveModalResidence(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalResidence, isSubmitting]);

  // Dynamic localities derived from active residence data
  const dynamicLocalityFilters = useRef<{ id: string; label: string }[]>(LOCALITY_FILTERS);
  const localityList = (() => {
    const map = new Map<string, string>();
    map.set("all", "All Localities");
    rawItems.forEach((item) => {
      if (item.localityId && item.locality) {
        map.set(item.localityId, item.locality);
      }
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  })();
  dynamicLocalityFilters.current = localityList;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLocalityChange = (locId: string) => {
    if (onSelectLocality) {
      onSelectLocality(locId);
    } else {
      setInternalLocality(locId);
    }
  };

  const handleSortChange = (newSort: string) => {
    if (onSortChange) {
      onSortChange(newSort);
    } else {
      setInternalSortBy(newSort);
    }
  };

  const handleOpenResidence = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectResidence) {
      onSelectResidence(id);
    }
  };

  const handleScheduleVisit = (res: ResidenceItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveModalResidence(res);
    setModalTab("visit");
    setGuestName("");
    setGuestPhone("");
    setVisitTourFormat("in-person");
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setVisitDate(d.toISOString().split("T")[0]);
    setVisitSlot("12:00 PM (Lunch)");
    setVisitSharing("Private");
    setIsSubmitting(false);
    setSubmitSuccess(false);
  };

  const handleRequestCallback = (res: ResidenceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveModalResidence(res);
    setModalTab("callback");
    setGuestName("");
    setGuestPhone("");
    setIsSubmitting(false);
    setSubmitSuccess(false);
  };

  const handleUnifiedModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalResidence || !guestName.trim() || !guestPhone.trim()) return;

    setIsSubmitting(true);
    const targetRes = activeModalResidence;
    const nameVal = guestName.trim();
    const phoneVal = guestPhone.trim();

    if (modalTab === "visit") {
      const formatLabel = visitTourFormat === "in-person"
        ? "In-Person Visit"
        : "Video Walkthrough";

      let dateDisplay = visitDate;
      try {
        const parts = visitDate.split("-");
        if (parts.length === 3) {
          dateDisplay = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      } catch {
        dateDisplay = visitDate;
      }

      try {
        await saveVisitBookingToFirestore({
          residenceId: targetRes.id,
          residenceName: `${targetRes.houseName} (${targetRes.name})`,
          tourType: visitTourFormat,
          date: dateDisplay,
          timeSlot: visitSlot,
          name: nameVal,
          phone: phoneVal,
          sharingType: visitSharing || "Private",
          status: "new",
        });
      } catch (err) {
        console.warn("Could not save visit booking to Firestore:", err);
      } finally {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        const msg = `Hello Charla Living! My name is ${nameVal}. I would like to schedule a visit for ${targetRes.houseName} (${targetRes.name}) in ${targetRes.locality}.\n\n• Tour Format: ${formatLabel}\n• Preferred Date: ${dateDisplay}\n• Preferred Slot: ${visitSlot}\n• WhatsApp Phone: ${phoneVal}\n• Room Preference: ${visitSharing}\n\nPlease confirm my visit!`;
        const whatsappUrl = `https://wa.me/918884446093?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        setTimeout(() => {
          setActiveModalResidence(null);
          setSubmitSuccess(false);
        }, 3000);
      }
    } else {
      // Request callback flow
      try {
        await saveCallbackRequestToFirestore({
          name: nameVal,
          phone: phoneVal,
          locality: targetRes.locality,
          residenceId: targetRes.id,
          residenceName: `${targetRes.houseName} (${targetRes.name})`,
          source: "Property Card Callback",
          status: "new",
        });
      } catch (err) {
        console.warn("Could not save callback request to Firestore:", err);
      } finally {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        const msg = `Hello Charla Living! My name is ${nameVal}. I would like to request a callback regarding ${targetRes.houseName} (${targetRes.name}) in ${targetRes.locality}. My contact number is ${phoneVal}.`;
        const whatsappUrl = `https://wa.me/918884446093?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        setTimeout(() => {
          setActiveModalResidence(null);
          setSubmitSuccess(false);
        }, 2500);
      }
    }
  };

  const handleSelectFromMap = (id: string) => {
    setActiveResidenceId(id);
    const targetCard = cardRefs.current[id];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Compute distance for all residences if user coordinates exist
  const residencesWithDistances = rawItems.map((item) => {
    if (userCoords) {
      const distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, item.lat, item.lng);
      return { ...item, distanceKm };
    }
    return item;
  });

  const filteredResidences = residencesWithDistances
    .filter((item) => {
      const matchesLocality = selectedLocality === "all" || item.localityId === selectedLocality;
      const matchesRoom =
        roomTypeFilter === "any" ||
        item.sharingTypes.some((t) => t.toLowerCase().includes(roomTypeFilter.toLowerCase()));
      const matchesGender =
        selectedGender === "all" ||
        (selectedGender === "Male" && item.gender === "Male") ||
        (selectedGender === "Female" && item.gender === "Female") ||
        (selectedGender === "Unisex" && (item.gender === "Unisex" || (item as any).gender === "Co-living"));
      return matchesLocality && matchesRoom && matchesGender;
    })
    .sort((a, b) => {
      if (sortBy === "nearest") {
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
      }
      if (sortBy === "price-asc") return a.priceNum - b.priceNum;
      if (sortBy === "price-desc") return b.priceNum - a.priceNum;
      if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating);
      return 0;
    });

  return (
    <div className="residences-page" id="residences">
      {/* ─── Clean Breadcrumb & Navigation Bar ─── */}
      <div className="container residences-breadcrumb-bar">
        <div className="residences-breadcrumb-inner">
          <button
            type="button"
            onClick={() => onBackToHome ? onBackToHome("home") : (window.location.hash = "#home")}
            className="residences-back-btn"
            aria-label="Back to Home"
          >
            <div className="residences-back-icon-wrap">
              <ArrowLeft size={14} />
            </div>
            <span>Back to Home</span>
          </button>

          <div className="residences-breadcrumb-path">
            <button 
              type="button"
              className="residences-breadcrumb-link" 
              onClick={() => onBackToHome ? onBackToHome("home") : (window.location.hash = "#home")}
            >
              Home
            </button>
            <span className="residences-breadcrumb-sep">/</span>
            <span className="residences-breadcrumb-badge">
              {selectedLocality !== "all"
                ? `PG in ${LOCALITY_FILTERS.find((l) => l.id === selectedLocality)?.label || "South Bangalore"}`
                : "Residences in South Bangalore"}
            </span>
          </div>
        </div>
      </div>

      <section className="residences" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* ─── Top Promotional Banner Showcase ─── */}
          <ResidencesBannerCarousel 
            onBookVisit={() => {
              const defaultRes = rawItems.find((r) => r.id === activeResidenceId) || rawItems[0] || RESIDENCE_ITEMS[0];
              if (defaultRes) handleScheduleVisit(defaultRes);
            }}
          />

          {/* ─── Category / Gender Filter Tabs (Properly Styled with Dedicated CSS) ─── */}
          <div className="charla-category-bar">
            <div className="charla-category-label">
              <Layers size={13} className="text-[#003B99]" />
              <span>Category:</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedGender("all")}
              className={`charla-category-pill ${selectedGender === "all" ? "active" : ""}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender("Male")}
              className={`charla-category-pill ${selectedGender === "Male" ? "active" : ""}`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender("Female")}
              className={`charla-category-pill pill-female ${selectedGender === "Female" ? "active" : ""}`}
            >
              Female
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender("Unisex")}
              className={`charla-category-pill pill-coliving ${selectedGender === "Unisex" ? "active" : ""}`}
            >
              Co-Living
            </button>
          </div>

          {/* ─── Locality Filters & Sort Controls Bar ─── */}
          <div className="residences-controls-bar">
            <div className="residences-pills-bar">
              {localityList.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleLocalityChange(loc.id)}
                  className={`residences-pill ${selectedLocality === loc.id ? "active" : ""}`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between w-full lg:w-auto lg:ml-auto gap-3 pt-1 lg:pt-0">
              {/* Mobile View Toggle: List vs Map */}
              <div className="view-toggle-wrap flex lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileViewMode("list")}
                  className={`view-toggle-btn ${mobileViewMode === "list" ? "is-active" : ""}`}
                >
                  <ListIcon size={13} />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileViewMode("map");
                    setTimeout(() => window.dispatchEvent(new Event("resize")), 80);
                  }}
                  className={`view-toggle-btn ${mobileViewMode === "map" ? "is-active" : ""}`}
                >
                  <MapIcon size={13} />
                  <span>Map</span>
                </button>
              </div>

              {/* Sort by dropdown */}
              <div className="residences-sort-wrap">
                <label htmlFor="residences-sort" className="residences-sort-label">
                  Sort by:
                </label>
                <div className="residences-select-custom">
                  <select
                    id="residences-sort"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="residences-sort-select"
                  >
                    {userCoords && <option value="nearest">Nearest to Me</option>}
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <svg className="residences-sort-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Geolocation Proximity Bar ─── */}
          {userCoords && detectedLocalityInfo && (
            <div className="residences-location-bar mb-6">
              <div className="residences-location-bar__info">
                <span className="residences-location-bar__dot" aria-hidden="true" />
                <span className="residences-location-bar__text">
                  Sorted by proximity · Nearest: <strong>{detectedLocalityInfo.name}</strong> ({detectedLocalityInfo.distanceKm} km)
                </span>
              </div>
              {onClearLocation && (
                <button
                  type="button"
                  onClick={onClearLocation}
                  className="residences-location-bar__clear"
                  title="Reset location filter"
                >
                  <span>Reset</span>
                  <span className="residences-location-bar__clear-x">×</span>
                </button>
              )}
            </div>
          )}

          {/* ─── SPLIT VIEW: Horizontal Listing Cards (Left) + Sticky Interactive Map (Right) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── LEFT COLUMN: Residence Cards (Matching Template) ── */}
            <div className={`lg:col-span-7 xl:col-span-7 space-y-6 ${mobileViewMode === "map" ? "hidden lg:block" : "block"}`}>
              {filteredResidences.map((res) => {
                const isSelected = activeResidenceId === res.id;
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${res.lat},${res.lng}`;

                return (
                  <article
                    key={res.id}
                    ref={(el) => { cardRefs.current[res.id] = el; }}
                    data-locality={res.locality}
                    onMouseEnter={() => setActiveResidenceId(res.id)}
                    className={`rcard rcard-horizontal-template cursor-pointer ${
                      isSelected ? "is-active" : ""
                    }`}
                    onClick={(e) => handleOpenResidence(res.id, e)}
                  >
                    {/* Left Side: Photo with Badge & Live Viewing Overlay */}
                    <div className="rcard-img-side">
                      <img
                        src={res.image}
                        alt={res.alt}
                        loading="eager"
                      />

                      {/* Top Status Tag Badge */}
                      <div className="rcard-student-badge">
                        <span>{res.flag}</span>
                      </div>

                      {/* Bottom Real-time Social Proof Viewing Overlay Bar */}
                      <div className="rcard-viewing-bar">
                        <Eye size={13} />
                        <span>{res.viewingCount} People Viewing Now</span>
                      </div>
                    </div>

                    {/* Right Side: Details & Actions */}
                    <div className="rcard-details-side">
                      {/* Row 1: Title, Locality & Gender Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <h3 className="rcard-house-title">
                              {res.houseName}
                            </h3>
                            <p className="rcard-house-sub">
                              PG in {res.locality}
                            </p>
                          </div>

                          {/* Gender Tag Pill */}
                          <span className="rcard-gender-pill">
                            <span>{res.gender}</span>
                            <UserRound size={12} className={res.gender === "Female" ? "text-pink-500" : "text-[#003b99]"} />
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Location snippet / Distance & View Directions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        {/* Location Proximity Pill */}
                        <div className="rcard-proximity-pill">
                          <Compass size={13} className="text-[#003b99]" />
                          <span>
                            {res.distanceKm !== undefined
                              ? `${res.distanceKm} km away from your location`
                              : res.locationSnippet}
                          </span>
                        </div>

                        {/* Directions Link (Google Maps) */}
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rcard-directions-link"
                        >
                          <Navigation size={12} className="rotate-45" />
                          <span>View Directions</span>
                        </a>
                      </div>

                      {/* Row 3: Attached Washroom + Bed Sharing Types */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {/* Attached Washroom badge */}
                        <span className="rcard-amenity-chip washroom">
                          <Bath size={13} className="text-[#059669]" />
                          <span>Attached Washroom</span>
                        </span>

                        {/* Room Sharing options */}
                        {res.sharingTypes.map((type) => (
                          <span
                            key={type}
                            className="rcard-amenity-chip sharing"
                          >
                            <BedDouble size={12} className="text-slate-400" />
                            <span>{type}</span>
                          </span>
                        ))}
                      </div>

                      {/* Row 4: Pricing & Dual CTA Buttons */}
                      <div className="rcard-action-row">
                        {/* Pricing */}
                        <div className="rcard-price-box">
                          <span className="starts-text">
                            Starts from
                          </span>
                          <div className="price-val">
                            {res.price}
                            <span>/mo*</span>
                          </div>
                        </div>

                        {/* CTAs matching Charla Living's Brand Theme */}
                        <div className="rcard-buttons-group">
                          {/* Schedule a Visit (Primary Brand Navy Blue) */}
                          <button
                            type="button"
                            onClick={(e) => handleScheduleVisit(res, e)}
                            className="btn-schedule-visit"
                          >
                            Schedule a Visit
                          </button>

                          {/* Request a Callback (Outlined Blue) */}
                          <button
                            type="button"
                            onClick={(e) => handleRequestCallback(res, e)}
                            className="btn-request-callback"
                          >
                            Request a Callback
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {filteredResidences.length === 0 && (
                <div className="residences-empty-state text-center py-14 px-6 bg-white/80 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-3xl font-bold text-[#FB7009] mb-3">Sorry :(</h3>
                  <p className="text-lg font-semibold text-slate-800 mb-6">
                    We don’t have any property near {selectedLocality} at the moment
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      handleLocalityChange("all");
                      if (onClearLocation) onClearLocation();
                    }}
                    className="btn btn--blue px-6 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    <span>View all South Bangalore residences</span>
                  </button>
                </div>
              )}

              <p className="residences__note text-xs text-slate-400 pt-2">
                *All-inclusive covers rent, Wi-Fi, housekeeping and maintenance. Food plans optional at ₹3,200/month.
              </p>
            </div>

            {/* ── RIGHT COLUMN: Sticky Interactive Map (Longer, Realistic Open-Source) ── */}
            <div className={`lg:col-span-5 xl:col-span-5 ${mobileViewMode === "list" ? "hidden lg:block" : "block"} lg:sticky lg:top-24`}>
              <ResidencesMapView
                residences={filteredResidences.length > 0 ? filteredResidences : rawItems}
                selectedId={activeResidenceId}
                onSelectResidence={handleSelectFromMap}
                userCoords={userCoords}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── UNIFIED PROPERTY MODAL (STANZA-STYLE WITH CHARLA BRAND THEME) ─── */}
      {activeModalResidence && (
        <div 
          className="charla-modal-backdrop"
          onClick={() => !isSubmitting && setActiveModalResidence(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Relative Wrapper with unclipped close button */}
          <div 
            className="charla-modal-shell"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Top-Right Circular Close Button */}
            <button
              type="button"
              className="charla-modal-close"
              onClick={() => !isSubmitting && setActiveModalResidence(null)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              aria-label="Close modal"
            >
              <X size={17} strokeWidth={2.5} />
            </button>

            {/* Modal Card */}
            <div className="charla-modal-card">
              {/* Top Pill Segmented Switcher */}
              <div className="charla-modal-tab-container">
                <button
                  type="button"
                  onClick={() => setModalTab("visit")}
                  className="charla-modal-tab-btn"
                  style={{
                    backgroundColor: modalTab === "visit" ? "#003B99" : "transparent",
                    color: modalTab === "visit" ? "#ffffff" : "#475569",
                    boxShadow: modalTab === "visit" ? "0 2px 8px rgba(0, 59, 153, 0.25)" : "none",
                  }}
                >
                  Schedule a Visit
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("callback")}
                  className="charla-modal-tab-btn"
                  style={{
                    backgroundColor: modalTab === "callback" ? "#003B99" : "transparent",
                    color: modalTab === "callback" ? "#ffffff" : "#475569",
                    boxShadow: modalTab === "callback" ? "0 2px 8px rgba(0, 59, 153, 0.25)" : "none",
                  }}
                >
                  Request a callback
                </button>
              </div>

              {/* Selected Property Preview Strip */}
              <div className="charla-modal-preview">
                <div className="charla-modal-preview-img">
                  <img 
                    src={activeModalResidence.image} 
                    alt={activeModalResidence.houseName} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0c1b34", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeModalResidence.houseName}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Building2 size={11} style={{ color: "#94a3b8", flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeModalResidence.locality}</span>
                  </div>
                  <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#FB7009", marginTop: "1px" }}>
                    Starts from {activeModalResidence.price}/mo
                  </div>
                </div>
              </div>

              {/* Body */}
              {submitSuccess ? (
                <div style={{ padding: "20px 8px", textAlign: "center" }}>
                  <div 
                    style={{
                      width: "52px",
                      height: "52px",
                      margin: "0 auto 12px",
                      borderRadius: "50%",
                      backgroundColor: "#dcfce7",
                      color: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <CheckCircle size={30} strokeWidth={2.2} />
                  </div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0c1b34", marginBottom: "6px" }}>
                    {modalTab === "visit" ? "Visit Scheduled Successfully!" : "Callback Request Sent!"}
                  </h4>
                  <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5, maxWidth: "340px", margin: "0 auto 14px" }}>
                    {modalTab === "visit"
                      ? `Thank you, ${guestName}! Your ${visitTourFormat === "in-person" ? "In-Person Visit" : "Video Walkthrough"} for ${activeModalResidence.houseName} has been recorded. Opening WhatsApp...`
                      : `Thank you, ${guestName}! Our manager for ${activeModalResidence.houseName} will call you shortly.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalResidence(null);
                      setSubmitSuccess(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor: "#f1f5f9",
                      color: "#334155",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUnifiedModalSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Inner Card Grouping Fields (matching reference image) */}
                  <div className="charla-modal-inner-card">
                    {/* Name Input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        className="charla-modal-input"
                      />
                    </div>

                    {/* Phone Input with 🇮🇳 +91 | Prefix (matching reference image) */}
                    <div className="charla-modal-phone-box">
                      <div 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          paddingLeft: "12px",
                          paddingRight: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#334155",
                          userSelect: "none",
                          flexShrink: 0
                        }}
                      >
                        <span style={{ fontSize: "15px", lineHeight: 1 }}>🇮🇳</span>
                        <span>+91</span>
                        <span style={{ color: "#cbd5e1", marginLeft: "2px" }}>|</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={guestPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setGuestPhone(val);
                        }}
                        required
                        maxLength={10}
                        style={{
                          flex: 1,
                          height: "100%",
                          paddingRight: "14px",
                          border: "none",
                          backgroundColor: "transparent",
                          fontSize: "13.5px",
                          color: "#0f172a",
                          outline: "none",
                          minWidth: 0
                        }}
                      />
                    </div>

                    {/* Visit-Specific Details (Only if modalTab === "visit") */}
                    {modalTab === "visit" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "9px", paddingTop: "5px", borderTop: "1px solid #e2e8f0" }}>
                        {/* Tour Format */}
                        <div>
                          <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "5px" }}>
                            Tour Format
                          </label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                            <button
                              type="button"
                              onClick={() => setVisitTourFormat("in-person")}
                              className="charla-modal-tour-btn"
                              style={{
                                border: visitTourFormat === "in-person" ? "2px solid #003B99" : "1px solid #cbd5e1",
                                backgroundColor: visitTourFormat === "in-person" ? "#eff6ff" : "#ffffff",
                                color: visitTourFormat === "in-person" ? "#003B99" : "#334155"
                              }}
                            >
                              In-Person Visit
                            </button>
                            <button
                              type="button"
                              onClick={() => setVisitTourFormat("video")}
                              className="charla-modal-tour-btn"
                              style={{
                                border: visitTourFormat === "video" ? "2px solid #003B99" : "1px solid #cbd5e1",
                                backgroundColor: visitTourFormat === "video" ? "#eff6ff" : "#ffffff",
                                color: visitTourFormat === "video" ? "#003B99" : "#334155"
                              }}
                            >
                              Video Walkthrough
                            </button>
                          </div>
                        </div>

                        {/* Preferred Date & Slot */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
                              Preferred Date
                            </label>
                            <input
                              type="date"
                              min={todayStr}
                              value={visitDate}
                              onChange={(e) => setVisitDate(e.target.value)}
                              required
                              className="charla-modal-date-input"
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
                              Preferred Slot
                            </label>
                            <select
                              value={visitSlot}
                              onChange={(e) => setVisitSlot(e.target.value)}
                              className="charla-modal-slot-select"
                            >
                              <option value="10:00 AM (Morning)">10:00 AM (Morning)</option>
                              <option value="12:00 PM (Lunch)">12:00 PM (Lunch)</option>
                              <option value="03:00 PM (Afternoon)">03:00 PM (Afternoon)</option>
                              <option value="05:30 PM (Evening)">05:30 PM (Evening)</option>
                              <option value="07:30 PM (Night)">07:30 PM (Night)</option>
                            </select>
                          </div>
                        </div>

                        {/* Room Preference: Private, Double, Triple, Any */}
                        <div>
                          <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "5px" }}>
                            Room Preference
                          </label>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px" }}>
                            {(["Private", "Double", "Triple", "Any"] as const).map((sharing) => {
                              const isSelected = visitSharing === sharing;
                              return (
                                <button
                                  key={sharing}
                                  type="button"
                                  onClick={() => setVisitSharing(sharing)}
                                  className="charla-modal-sharing-btn"
                                  style={{
                                    fontWeight: isSelected ? 700 : 500,
                                    border: isSelected ? "1.5px solid #003B99" : "1px solid #cbd5e1",
                                    backgroundColor: isSelected ? "#003B99" : "#ffffff",
                                    color: isSelected ? "#ffffff" : "#475569"
                                  }}
                                >
                                  {sharing}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms and Privacy Checkbox (matching reference image) */}
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "0 2px", cursor: "pointer", userSelect: "none" }}>
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      style={{
                        marginTop: "2px",
                        width: "15px",
                        height: "15px",
                        accentColor: "#003B99",
                        cursor: "pointer",
                        flexShrink: 0
                      }}
                    />
                    <span style={{ fontSize: "11.5px", color: "#475569", lineHeight: 1.45 }}>
                      I have read and agreed to the{" "}
                      <a href="#/terms" style={{ color: "#003B99", textDecoration: "underline", fontWeight: 600 }}>terms and conditions</a>{" "}
                      and{" "}
                      <a href="#/privacy" style={{ color: "#003B99", textDecoration: "underline", fontWeight: 600 }}>privacy policy</a>{" "}
                      and hereby confirm to proceed.
                    </span>
                  </label>

                  {/* Full-width Primary CTA Button in Brand Navy #003B99 */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !guestName.trim() || !guestPhone.trim() || !agreedToTerms}
                    className="charla-modal-cta"
                    style={{
                      cursor: isSubmitting || !guestName.trim() || !guestPhone.trim() || !agreedToTerms ? "not-allowed" : "pointer",
                      opacity: isSubmitting || !guestName.trim() || !guestPhone.trim() || !agreedToTerms ? 0.6 : 1
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{modalTab === "visit" ? "Scheduling Visit..." : "Requesting Callback..."}</span>
                      </>
                    ) : (
                      <span>{modalTab === "visit" ? "Schedule a Visit" : "Request a callback"}</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
