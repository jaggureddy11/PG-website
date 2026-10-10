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
  Phone,
  X,
  CheckCircle,
  MessageCircle,
  Loader2,
  ShieldCheck,
  Building2
} from "lucide-react";
import { calculateDistanceKm } from "@/utils/location";
import { saveCallbackRequestToFirestore } from "@/lib/firebase";
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

  // Callback Modal State
  const [callbackModalResidence, setCallbackModalResidence] = useState<ResidenceItem | null>(null);
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);

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

  // Handle ESC key to close callback modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && callbackModalResidence && !isSubmittingCallback) {
        setCallbackModalResidence(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callbackModalResidence, isSubmittingCallback]);

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

  const handleScheduleVisit = (_residenceName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBackToHome) {
      onBackToHome("visit");
    } else {
      window.location.hash = "#visit";
    }
  };

  const handleRequestCallback = (res: ResidenceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCallbackModalResidence(res);
    setCallbackName("");
    setCallbackPhone("");
    setCallbackSuccess(false);
    setIsSubmittingCallback(false);
  };

  const handleModalCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackModalResidence || !callbackName.trim() || !callbackPhone.trim()) return;

    setIsSubmittingCallback(true);
    const targetRes = callbackModalResidence;
    const residentName = callbackName.trim();
    const residentPhone = callbackPhone.trim();

    try {
      await saveCallbackRequestToFirestore({
        name: residentName,
        phone: residentPhone,
        locality: targetRes.locality,
        residenceId: targetRes.id,
        residenceName: `${targetRes.houseName} (${targetRes.name})`,
        source: "Property Card Callback",
        status: "new",
      });
    } catch (err) {
      console.warn("Could not save callback request to Firestore:", err);
    } finally {
      setIsSubmittingCallback(false);
      setCallbackSuccess(true);

      const msg = `Hello Charla Living! My name is ${residentName}. I would like to request a callback regarding ${targetRes.houseName} (${targetRes.name}) in ${targetRes.locality}. My contact number is ${residentPhone}.`;
      const whatsappUrl = `https://wa.me/918884446093?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      setTimeout(() => {
        setCallbackModalResidence(null);
        setCallbackSuccess(false);
      }, 2500);
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
              if (onBackToHome) onBackToHome("visit");
              else window.location.hash = "#visit";
            }}
          />

          {/* ─── Category / Gender Filter Tabs ─── */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase mr-1">Category:</span>
            <button
              type="button"
              onClick={() => setSelectedGender("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedGender === "all"
                  ? "bg-[#003B99] text-white border-[#003B99] shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender("Male")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedGender === "Male"
                  ? "bg-[#003B99] text-white border-[#003B99] shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              MALE
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender("Female")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedGender === "Female"
                  ? "bg-[#FB7009] text-white border-[#FB7009] shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              FEMALE
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender("Unisex")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedGender === "Unisex"
                  ? "bg-[#0C1B34] text-white border-[#0C1B34] shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              CO-LIVING
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
                            onClick={(e) => handleScheduleVisit(res.name, e)}
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

      {/* ── Callback Capture Modal ── */}
      {callbackModalResidence && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !isSubmittingCallback && setCallbackModalResidence(null)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Brand Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#003b99] via-[#2563eb] to-[#FB7009]" />

            {/* Header */}
            <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-[#003b99] border border-blue-100 mb-1.5">
                  <Phone size={11} strokeWidth={2.5} />
                  <span>Instant Callback</span>
                </div>
                <h3 className="text-lg font-bold text-[#0c1b34] tracking-tight">
                  Request a Callback
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Leave your contact details and our manager will call you shortly.
                </p>
              </div>

              <button
                type="button"
                onClick={() => !isSubmittingCallback && setCallbackModalResidence(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Selected Property Preview Strip */}
            <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200/80">
                <img 
                  src={callbackModalResidence.image} 
                  alt={callbackModalResidence.houseName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#0c1b34] truncate">
                  {callbackModalResidence.houseName}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                  <Building2 size={11} className="text-slate-400 flex-shrink-0" />
                  <span>{callbackModalResidence.locality}</span>
                </div>
                <div className="text-[11.5px] font-semibold text-[#FB7009] mt-0.5">
                  Starting from {callbackModalResidence.price}/mo
                </div>
              </div>
            </div>

            {/* Body / Form */}
            <div className="p-5">
              {callbackSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle size={26} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0c1b34]">
                      Callback Request Received
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                      Thank you, <strong>{callbackName}</strong>. Your inquiry has been saved and routed to WhatsApp.
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/918884446093?text=${encodeURIComponent(
                        `Hello Charla Living! My name is ${callbackName}. I would like to request a callback regarding ${callbackModalResidence.houseName} (${callbackModalResidence.name}) in ${callbackModalResidence.locality}. My contact number is ${callbackPhone}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-md hover:bg-[#20ba59] transition-all"
                    >
                      <MessageCircle size={15} />
                      <span>Chat Directly on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleModalCallbackSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label 
                      htmlFor="modal-callback-name" 
                      style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}
                    >
                      Your Full Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                        <UserRound size={16} />
                      </span>
                      <input
                        id="modal-callback-name"
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Rahul Sharma"
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        style={{
                          width: "100%",
                          height: "44px",
                          paddingLeft: "40px",
                          paddingRight: "14px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          color: "#0f172a",
                          background: "#ffffff",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label 
                      htmlFor="modal-callback-phone" 
                      style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}
                    >
                      Phone Number <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                        <Phone size={16} />
                      </span>
                      <input
                        id="modal-callback-phone"
                        type="tel"
                        required
                        placeholder="e.g. 98765 43210"
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        style={{
                          width: "100%",
                          height: "44px",
                          paddingLeft: "40px",
                          paddingRight: "14px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          color: "#0f172a",
                          background: "#ffffff",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0" }}>
                      We will call or WhatsApp you on this number to coordinate your visit.
                    </p>
                  </div>

                  {/* Trust Assurance Banner */}
                  <div style={{ padding: "10px 12px", borderRadius: "10px", background: "#f0f9ff", border: "1px solid #e0f2fe", display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "11px", color: "#0369a1", lineHeight: 1.45 }}>
                    <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: "1px", color: "#0284c7" }} />
                    <span>Zero spam guarantee. Your contact details are stored securely and used solely for this property inquiry.</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "4px" }}>
                    <button
                      type="button"
                      onClick={() => setCallbackModalResidence(null)}
                      disabled={isSubmittingCallback}
                      style={{
                        flex: 1,
                        height: "44px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        background: "#f8fafc",
                        color: "#475569",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingCallback || !callbackName.trim() || !callbackPhone.trim()}
                      style={{
                        flex: 2,
                        height: "44px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#FB7009",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: isSubmittingCallback ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 2px 8px rgba(251, 112, 9, 0.35)",
                        opacity: isSubmittingCallback || !callbackName.trim() || !callbackPhone.trim() ? 0.65 : 1
                      }}
                    >
                      {isSubmittingCallback ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Requesting...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle size={15} />
                          <span>Submit &amp; Open WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
