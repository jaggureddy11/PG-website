import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, ArrowRight } from "lucide-react";
import { calculateDistanceKm } from "@/utils/location";
import { ResidencesBannerCarousel } from "./ResidencesBannerCarousel";

interface ResidenceItem {
  id: string;
  name: string;
  locality: string;
  localityId: string;
  lat: number;
  lng: number;
  price: string;
  priceNum: number;
  flag: string;
  flagType: "blue" | "orange";
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
    name: "Charla Living — Kumaraswamy Layout",
    locality: "Kumaraswamy Layout",
    localityId: "kumaraswamy-layout",
    lat: 12.9056,
    lng: 77.5612,
    price: "₹8,500",
    priceNum: 8500,
    flag: "Bestseller",
    flagType: "blue",
    rating: "4.9",
    reviewsCount: "148",
    locationSnippet: "Off Kanakapura Rd · 10 min to Dayananda Sagar College (DSCE)",
    proximityBadge: "🎓 Near DSCE Campus",
    sharingTypes: ["Single", "Double", "Triple"],
    highlights: ["4 Fresh Meals / Day", "100 Mbps Wi-Fi", "Attached Washrooms", "Daily Cleaning"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80",
    alt: "Charla Living Kumaraswamy Layout residence exterior"
  },
  {
    id: "uttarahalli",
    name: "Charla Living — Uttarahalli",
    locality: "Uttarahalli",
    localityId: "uttarahalli",
    lat: 12.9022,
    lng: 77.5385,
    price: "₹7,500",
    priceNum: 7500,
    flag: "Most Affordable",
    flagType: "blue",
    rating: "4.8",
    reviewsCount: "96",
    locationSnippet: "Uttarahalli Main Rd · 8 min to Kumaran's School & Bus Stop",
    proximityBadge: "🚌 Transit Hub",
    sharingTypes: ["Double", "Triple"],
    highlights: ["Veg & Non-Veg Plans", "On-Site Parking", "100 Mbps Wi-Fi", "Linen & Laundry"],
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    alt: "Furnished lounge at Charla Living Uttarahalli"
  },
  {
    id: "banashankari",
    name: "Charla Living — Banashankari",
    locality: "Banashankari",
    localityId: "banashankari",
    lat: 12.9255,
    lng: 77.5468,
    price: "₹9,000",
    priceNum: 9000,
    flag: "3 min to Metro",
    flagType: "orange",
    rating: "4.9",
    reviewsCount: "182",
    locationSnippet: "2nd Stage · 3 min walk to Banashankari Green Line Metro & BDA",
    proximityBadge: "🚇 3 Min to Metro",
    sharingTypes: ["Single", "Double"],
    highlights: ["AC Rooms Available", "Attached Washrooms", "4 Homestyle Meals", "Power Backup"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
    alt: "Premium double room at Charla Living Banashankari"
  },
  {
    id: "padmanabhanagar",
    name: "Charla Living — Padmanabhanagar",
    locality: "Padmanabhanagar",
    localityId: "padmanabhanagar",
    lat: 12.9180,
    lng: 77.5580,
    price: "₹8,000",
    priceNum: 8000,
    flag: "Newly Renovated",
    flagType: "blue",
    rating: "4.8",
    reviewsCount: "114",
    locationSnippet: "Near Brigade Millennium · 12 min to JP Nagar 6th Phase",
    proximityBadge: "🌿 Quiet Neighborhood",
    sharingTypes: ["Double", "Triple"],
    highlights: ["Rooftop Terrace Lounge", "RO Water Purifiers", "Biometric Entry", "Hot Water 24/7"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    alt: "Modern interiors at Charla Living Padmanabhanagar"
  },
  {
    id: "jp-nagar",
    name: "Charla Living — JP Nagar",
    locality: "JP Nagar",
    localityId: "jp-nagar",
    lat: 12.9077,
    lng: 77.5855,
    price: "₹10,500",
    priceNum: 10500,
    flag: "Professionals' Pick",
    flagType: "orange",
    rating: "4.9",
    reviewsCount: "210",
    locationSnippet: "5th Phase · 6 min to JP Nagar Metro & Central Mall Corridor",
    proximityBadge: "💼 Tech Corridor",
    sharingTypes: ["Single", "Double"],
    highlights: ["Ergonomic Work Desks", "Night-Shift Friendly", "Fiber Wi-Fi & Backup", "Cafeteria Meals"],
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
    alt: "Hotel-style single room at Charla Living JP Nagar"
  },
  {
    id: "jayanagar",
    name: "Charla Living — Jayanagar",
    locality: "Jayanagar",
    localityId: "jayanagar",
    lat: 12.9308,
    lng: 77.5838,
    price: "₹11,000",
    priceNum: 11000,
    flag: "Flagship Residence",
    flagType: "blue",
    rating: "5.0",
    reviewsCount: "240",
    locationSnippet: "4th Block · 7 min to Jayanagar Metro Station & South End Circle",
    proximityBadge: "👑 Flagship Location",
    sharingTypes: ["Single", "Double"],
    highlights: ["Chef-Prepared Gourmet Menu", "Resident Lounge & Gaming", "Premium Custom Beds", "Daily Room Service"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
    alt: "Warm furnished bedroom at Charla Living Jayanagar"
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

  const selectedLocality = propLocality !== undefined ? propLocality : internalLocality;
  const sortBy = propSortBy !== undefined ? propSortBy : internalSortBy;

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

  // Compute distance for all residences if user coordinates exist
  const residencesWithDistances = RESIDENCE_ITEMS.map((item) => {
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
      return matchesLocality && matchesRoom;
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
    <div className="residences-page min-h-screen bg-[#f8faf8] pt-24 pb-20">
      {/* ─── Clean Breadcrumb & Navigation Bar ─── */}
      <div className="container mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2.5 px-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-sm">
          <button
            type="button"
            onClick={() => onBackToHome ? onBackToHome("home") : (window.location.hash = "#home")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#003b99] transition-colors group cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-[#003b99]" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="cursor-pointer hover:text-slate-800" onClick={() => onBackToHome && onBackToHome("home")}>Home</span>
            <span>/</span>
            <span className="text-[#003b99] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Residences in South Bangalore
            </span>
          </div>
        </div>
      </div>

      <section className="residences" id="residences" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* ─── Top Promotional Banner Showcase ─── */}
          <ResidencesBannerCarousel 
            onBookVisit={() => {
              if (onBackToHome) onBackToHome("visit");
              else window.location.hash = "#visit";
            }}
          />

          {/* ─── Clean Locality Filters & Sort ─── */}
          <div className="residences-controls-bar">
            <div className="residences-pills-bar">
              {LOCALITY_FILTERS.map((loc) => (
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
                  {userCoords && <option value="nearest">📍 Nearest to Me</option>}
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

          {/* ─── Geolocation Proximity Notification Banner ─── */}
          {userCoords && detectedLocalityInfo && (
            <div className="residences-location-banner">
              <div className="residences-location-banner__info">
                <span className="residences-location-banner__pulse" />
                <div>
                  <p className="residences-location-banner__title">
                    Showing residences sorted by proximity to your location
                  </p>
                  <p className="residences-location-banner__sub">
                    Closest PG: <strong>{detectedLocalityInfo.name}</strong> ({detectedLocalityInfo.distanceKm} km away)
                  </p>
                </div>
              </div>
              {onClearLocation && (
                <button
                  type="button"
                  onClick={onClearLocation}
                  className="residences-location-banner__btn"
                >
                  Reset Location Filter
                </button>
              )}
            </div>
          )}

          <div className="residences__grid" id="residenceGrid">
            {filteredResidences.map((res) => (
              <article key={res.id} className="rcard group" data-locality={res.locality}>
                <a
                  href={`#/residence/${res.id}`}
                  onClick={(e) => handleOpenResidence(res.id, e)}
                  className="rcard__media"
                  data-mask
                >
                  <img src={res.image} alt={res.alt} />
                  <span className={`rcard__flag rcard__flag--${res.flagType}`}>{res.flag}</span>
                  {res.distanceKm !== undefined && (
                    <span className="rcard__distance-pill">
                      📍 {res.distanceKm} km away
                    </span>
                  )}
                </a>
                <div className="rcard__body">
                  <div className="rcard__top">
                    <h3
                      className="cursor-pointer hover:text-[#f8750b] transition-colors"
                      onClick={(e) => handleOpenResidence(res.id, e)}
                    >
                      {res.name}
                    </h3>
                    <p className="rcard__price">
                      <span>from</span> {res.price}<em>/mo</em>
                    </p>
                  </div>
                  <p className="rcard__loc">
                    <MapPin size={16} className="text-[#003b99] flex-shrink-0" />
                    <span>{res.locationSnippet}</span>
                  </p>
                  <ul className="rcard__tags">
                    {res.highlights.slice(0, 3).map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                  <a
                    href={`#/residence/${res.id}`}
                    onClick={(e) => handleOpenResidence(res.id, e)}
                    className="rcard__cta"
                  >
                    Explore residence
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {filteredResidences.length === 0 && (
            <div className="residences-empty-state">
              <p>No residences found for this filter combination.</p>
              <button
                type="button"
                onClick={() => {
                  handleLocalityChange("all");
                  if (onClearLocation) onClearLocation();
                }}
                className="residences-reset-btn"
              >
                View all residences
              </button>
            </div>
          )}

          <p className="residences__note">*All-inclusive covers rent, Wi-Fi, housekeeping and maintenance. Food plans optional at ₹3,200/month.</p>
        </div>
      </section>
    </div>
  );
}
