import React, { useState } from "react";
import {
  Building2,
  BedDouble,
  Flame,
  Lock,
  Globe,
  Plus,
  Search,
  MapPin,
  Play,
  Eye,
  Edit3,
  Trash2,
  X,
  ExternalLink,
  Video,
  CalendarCheck,
  Users,
  MessageCircle,
  Phone,
  LogOut,
  Loader2,
} from "lucide-react";
import { AdminLogin } from "./AdminLogin";
import {
  uploadMediaFile,
  signOutAdmin,
  type ExtendedResidence,
  type CallbackRequest,
  type VisitBooking,
  type PartnerInquiry,
} from "@/lib/firebase";
import { useResidences } from "@/context/ResidencesContext";

export type { ExtendedResidence };

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onSelectResidence?: (id: string) => void;
}

function extractCoordsFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;
  // Match @lat,lng e.g. https://www.google.com/maps/@12.9234,77.5843,17z
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  // Match embed link e.g. !3d12.9234!4d77.5843
  const embedMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (embedMatch) {
    const lat = parseFloat(embedMatch[1]);
    const lng = parseFloat(embedMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  // Match query parameter e.g. ?q=12.9234,77.5843 or ?query=12.9234,77.5843
  const qMatch = url.match(/[?&](?:q|query|ll|loc)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  return null;
}

const DEFAULT_AMENITIES_OPTIONS = [
  { icon: "wifi", title: "High-Speed Wi-Fi", description: "Seamless fiber connectivity" },
  { icon: "utensils", title: "Homestyle 3-Time Meals", description: "Nutritious breakfast, lunch & dinner" },
  { icon: "sparkles", title: "Daily Housekeeping", description: "Sanitized rooms & common areas" },
  { icon: "shirt", title: "Washing Machines", description: "Automated laundry access" },
  { icon: "zap", title: "24x7 Power Backup", description: "Heavy-duty generator backup" },
  { icon: "fingerprint", title: "Biometric Access", description: "Secure smart door entry" },
  { icon: "shield-check", title: "CCTV Surveillance", description: "Round-the-clock safety monitoring" },
  { icon: "droplet", title: "RO Purified Water", description: "Multi-stage mineral water dispensers" },
  { icon: "wind", title: "Air Conditioning", description: "Climate control in rooms" },
  { icon: "tv", title: "Entertainment Lounge", description: "TV with recreational seating" },
];

const EMPTY_FORM_STATE: Partial<ExtendedResidence> = {
  name: "",
  locality: "",
  headline: "",
  landmark: "",
  locationDetails: "",
  googleMapsUrl: "",
  description: "",
  startingPrice: 0,
  deposit: "",
  status: "available",
  gender: "male",
  tag: "",
  galleryCount: 0,
  videoUrl: "",
  lat: undefined,
  lng: undefined,
  images: {
    hero: "",
    room: "",
    lounge: "",
    dining: "",
  },
  additionalPhotos: [],
  roomTypes: [
    {
      id: "single",
      name: "Single Sharing",
      price: 0,
      bedType: "Single Bed",
      tagline: "",
      features: [],
      specs: [],
    },
    {
      id: "double",
      name: "2-Sharing",
      price: 0,
      bedType: "2 Beds",
      tagline: "",
      features: [],
      specs: [],
    },
    {
      id: "triple",
      name: "3-Sharing",
      price: 0,
      bedType: "3 Beds",
      tagline: "",
      features: [],
      specs: [],
    },
  ],
  amenities: [],
  menu: {
    specialDay: "",
    breakfast: "",
    lunch: "",
    dinner: "",
  },
  reviews: [],
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome, onSelectResidence }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = sessionStorage.getItem("charla_admin_auth") || localStorage.getItem("charla_admin_auth");
      if (!session) return false;
      const parsed = JSON.parse(session);
      return Boolean(parsed?.authenticated);
    } catch {
      return false;
    }
  });

  const [loggedAdminUser, setLoggedAdminUser] = useState<string>(() => {
    try {
      const session = sessionStorage.getItem("charla_admin_auth") || localStorage.getItem("charla_admin_auth");
      if (!session) return "Admin";
      const parsed = JSON.parse(session);
      return parsed?.username || "Admin";
    } catch {
      return "Admin";
    }
  });

  const handleLogout = () => {
    try {
      signOutAdmin();
      sessionStorage.removeItem("charla_admin_auth");
      localStorage.removeItem("charla_admin_auth");
    } catch (e) {
      console.warn("Error removing auth:", e);
    }
    setIsAuthenticated(false);
  };

  const {
    residences,
    saveResidence,
    deleteResidence,
    quickStatusChange,
    visitBookings,
    partnerInquiries,
    callbackRequests,
    updateCallbackStatus,
    updateBookingStatus,
    updateInquiryStatus,
  } = useResidences();

  const [currentAdminTab, setCurrentAdminTab] = useState<"properties" | "callbacks" | "bookings" | "partner">("properties");
  const [searchTerm, setSearchTerm] = useState("");
  const [localityFilter, setLocalityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "media" | "amenities">("basic");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Video Preview Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Hassle-Free Inline Delete States (zero browser popups)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<ExtendedResidence>>(EMPTY_FORM_STATE);

  // Unique Localities for Filter
  const localities = Array.from(new Set(residences.map((r) => r.locality).filter(Boolean)));

  // Filtered List
  const filteredResidences = residences.filter((res) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (res.name || "").toLowerCase().includes(query) ||
      (res.locality || "").toLowerCase().includes(query) ||
      (res.landmark || "").toLowerCase().includes(query);
    const matchesLocality = localityFilter === "all" || res.locality === localityFilter;
    const matchesStatus = statusFilter === "all" || (res.status || "available") === statusFilter;
    const matchesGender = genderFilter === "all" || (res.gender || "male") === genderFilter;
    return matchesSearch && matchesLocality && matchesStatus && matchesGender;
  });

  // Metrics
  const totalCount = residences.length;
  const availableCount = residences.filter((r) => (r.status || "available") === "available").length;
  const fastFillingCount = residences.filter((r) => r.status === "fast-filling").length;
  const soldOutCount = residences.filter((r) => r.status === "sold-out").length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setModalConfirmDelete(false);
    setFormData({
      ...EMPTY_FORM_STATE,
      id: "residence-" + Date.now(),
      images: { hero: "", room: "", lounge: "", dining: "" },
      additionalPhotos: [],
      amenities: [],
    });
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res: ExtendedResidence) => {
    setEditingId(res.id);
    setModalConfirmDelete(false);
    setFormData({
      ...res,
      additionalPhotos: res.additionalPhotos || [],
    });
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleSaveResidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.locality?.trim()) {
      alert("Please provide at least Property Name and Locality.");
      return;
    }

    let finalLat = formData.lat;
    let finalLng = formData.lng;
    if ((finalLat === undefined || finalLng === undefined) && formData.googleMapsUrl) {
      const extracted = extractCoordsFromGoogleMapsUrl(formData.googleMapsUrl);
      if (extracted) {
        finalLat = extracted.lat;
        finalLng = extracted.lng;
      }
    }

    if (editingId) {
      const updatedProperty = {
        ...formData,
        lat: finalLat,
        lng: finalLng,
        id: editingId,
      } as ExtendedResidence;
      await saveResidence(updatedProperty);
    } else {
      const newId = (formData.name || "property")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4);
      const newProperty: ExtendedResidence = {
        ...(formData as ExtendedResidence),
        lat: finalLat,
        lng: finalLng,
        id: newId,
      };
      await saveResidence(newProperty);
    }

    setIsModalOpen(false);
  };

  // Completely Hassle-Free Deletion (No blocked browser pop-ups, instant sync)
  const executeDelete = async (id: string, name?: string) => {
    setDeletingId(id);
    try {
      await deleteResidence(id);
      setDeleteNotice(name ? `"${name}" was successfully removed.` : "Property was removed.");
      setTimeout(() => setDeleteNotice(null), 4000);
    } catch (err) {
      console.error("Failed to delete residence:", err);
      alert("Failed to delete residence. Please check your connection.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleQuickStatusChange = async (id: string, status: "available" | "fast-filling" | "sold-out") => {
    await quickStatusChange(id, status);
  };

  // Media upload handling (permanent cloud storage / persistent optimized URI)
  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hero" | "room" | "lounge" | "dining" | "video" | "gallery"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    try {
      const uploadedUrl = await uploadMediaFile(file, `residences/${formData.id || "property"}`);
      if (type === "video") {
        setFormData((prev) => ({ ...prev, videoUrl: uploadedUrl }));
      } else if (type === "gallery") {
        setFormData((prev) => ({
          ...prev,
          additionalPhotos: [...(prev.additionalPhotos || []), uploadedUrl],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          images: {
            ...(prev.images || { hero: "", room: "", lounge: "", dining: "" }),
            [type]: uploadedUrl,
          },
        }));
      }
    } catch (err: unknown) {
      console.error("Failed to upload media:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to process media file. Please provide a direct image/video URL instead.";
      alert(msg);
    } finally {
      setIsUploadingMedia(false);
      e.target.value = "";
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setLoggedAdminUser(user);
          setIsAuthenticated(true);
        }}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  return (
    <div className="admin-layout">
      {/* ── Top Header ── */}
      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-brand">
            <img src="/assets/logo.png" alt="Charla Living" className="admin-brand__logo" />
            <div className="admin-brand__badge" title={`Signed in as ${loggedAdminUser}`}>
              <span className="admin-brand__dot" aria-hidden="true" />
              <span>{loggedAdminUser}</span>
            </div>
          </div>

          <div className="admin-header__actions">
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={onNavigateHome}
              title="View live website"
            >
              <Globe size={15} strokeWidth={2} />
              <span>View Website</span>
            </button>

            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleOpenAdd}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add Property</span>
            </button>

            <button
              type="button"
              className="admin-btn admin-btn--logout"
              onClick={handleLogout}
              title="Sign out of Admin Dashboard"
            >
              <LogOut size={15} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Admin Navigation Tabs (Properties vs Leads from Firestore) ── */}
      <div className="admin-nav-tabs-bar">
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-nav-tab ${currentAdminTab === "properties" ? "active" : ""}`}
            onClick={() => setCurrentAdminTab("properties")}
          >
            <Building2 size={16} />
            <span>Properties Portfolio ({residences.length})</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${currentAdminTab === "callbacks" ? "active" : ""}`}
            onClick={() => setCurrentAdminTab("callbacks")}
          >
            <Phone size={16} />
            <span>Callback Requests ({callbackRequests.length})</span>
            {callbackRequests.filter((c) => (c.status || "new") === "new").length > 0 && (
              <span className="admin-nav-tab-badge admin-nav-tab-badge--orange">
                {callbackRequests.filter((c) => (c.status || "new") === "new").length} New
              </span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${currentAdminTab === "bookings" ? "active" : ""}`}
            onClick={() => setCurrentAdminTab("bookings")}
          >
            <CalendarCheck size={16} />
            <span>Tour Bookings ({visitBookings.length})</span>
            {visitBookings.filter((b) => (b.status || "new") === "new").length > 0 && (
              <span className="admin-nav-tab-badge">
                {visitBookings.filter((b) => (b.status || "new") === "new").length} New
              </span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${currentAdminTab === "partner" ? "active" : ""}`}
            onClick={() => setCurrentAdminTab("partner")}
          >
            <Users size={16} />
            <span>Partner Inquiries ({partnerInquiries.length})</span>
            {partnerInquiries.filter((p) => (p.status || "new") === "new").length > 0 && (
              <span className="admin-nav-tab-badge admin-nav-tab-badge--orange">
                {partnerInquiries.filter((p) => (p.status || "new") === "new").length} New
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Container ── */}
      <main className="admin-main">
        {currentAdminTab === "properties" && (
          <>
            {/* ── Metric Stats Bento ── */}
            <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-icon--blue">
              <Building2 size={24} strokeWidth={2.2} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Total Properties</span>
              <span className="admin-stat-value">{totalCount}</span>
              <span className="admin-stat-subtext">Across Bengaluru</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-icon--green">
              <BedDouble size={24} strokeWidth={2.2} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Available for Move-in</span>
              <span className="admin-stat-value">{availableCount}</span>
              <span className="admin-stat-subtext">Ready for move-in</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-icon--amber">
              <Flame size={24} strokeWidth={2.2} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Fast Filling (High Demand)</span>
              <span className="admin-stat-value">{fastFillingCount}</span>
              <span className="admin-stat-subtext">High demand surge</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon admin-stat-icon--purple">
              <Lock size={24} strokeWidth={2.2} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">Sold Out / Waitlist</span>
              <span className="admin-stat-value">{soldOutCount}</span>
              <span className="admin-stat-subtext">100% capacity · waitlist</span>
            </div>
          </div>
        </div>

        {/* ── Deletion Success Notice ── */}
        {deleteNotice && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "12px 18px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#991b1b",
              fontSize: "13.5px",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.08)",
            }}
          >
            <span>{deleteNotice}</span>
            <button
              type="button"
              onClick={() => setDeleteNotice(null)}
              style={{
                background: "none",
                border: "none",
                color: "#991b1b",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Toolbar: Search & Filters ── */}
        <div className="admin-toolbar">
          <div className="admin-toolbar__left">
            <div className="admin-search-wrap">
              <Search size={16} strokeWidth={2} style={{ color: "#64748b", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by property name, locality, landmark..."
                className="admin-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="admin-select"
              value={localityFilter}
              onChange={(e) => setLocalityFilter(e.target.value)}
            >
              <option value="all">All Localities ({residences.length})</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Availability Status</option>
              <option value="available">Available</option>
              <option value="fast-filling">Fast Filling</option>
              <option value="sold-out">Sold Out</option>
            </select>

            <select
              className="admin-select"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="co-living">Co-living</option>
            </select>
          </div>

          <div className="admin-toolbar__right">
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
              Showing {filteredResidences.length} of {residences.length}
            </span>
          </div>
        </div>

        {/* ── Properties Grid ── */}
        {filteredResidences.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#ffffff",
              borderRadius: "18px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", color: "#94a3b8" }}>
              <Search size={38} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0c1b34", margin: "0 0 6px" }}>
              No residences matched your filters
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 18px" }}>
              Try adjusting your search query, locality, or availability status.
            </p>
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => {
                setSearchTerm("");
                setLocalityFilter("all");
                setStatusFilter("all");
                setGenderFilter("all");
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="admin-properties-grid">
            {filteredResidences.map((res) => {
              const status = res.status || "available";

              return (
                <div key={res.id} className="admin-property-card">
                  {/* Media Banner */}
                  <div className="admin-property-card__media">
                    {res.images?.hero || res.images?.room ? (
                      <img
                        src={res.images.hero || res.images.room}
                        alt={res.name}
                        className="admin-property-card__img"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#0f172a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          fontSize: "13px",
                        }}
                      >
                        No Cover Photo Added
                      </div>
                    )}

                    {/* Status & Gender Badges */}
                    <div className="admin-property-card__badges">
                      <span className={`admin-badge admin-badge--${status}`}>
                        <span className="admin-badge-dot" />
                        {status === "available" && "Available"}
                        {status === "fast-filling" && "Fast Filling"}
                        {status === "sold-out" && "Sold Out"}
                      </span>

                      <span className="admin-badge admin-badge--gender">
                        {res.gender === "female" ? "FEMALE" : res.gender === "co-living" ? "CO-LIVING" : "MALE"}
                      </span>
                    </div>

                    {/* Video Walkthrough Indicator / Clickable Preview */}
                    {res.videoUrl && (
                      <button
                        type="button"
                        className="admin-property-card__video-indicator"
                        style={{ border: "none", cursor: "pointer" }}
                        onClick={() => setPreviewVideoUrl(res.videoUrl || null)}
                        title="Play Property Video Walkthrough"
                      >
                        <Play size={12} fill="currentColor" strokeWidth={0} />
                        Walkthrough Video
                      </button>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="admin-property-card__body">
                    <div className="admin-property-card__header">
                      <div style={{ width: "100%" }}>
                        <h4 className="admin-property-card__title">{res.name}</h4>
                        <div className="admin-property-card__locality">
                          <MapPin size={14} strokeWidth={2} color="#fb7009" style={{ flexShrink: 0 }} />
                          <span>{res.locality}{res.landmark ? ` · ${res.landmark}` : ""}</span>
                        </div>

                        {/* Google Maps Link */}
                        {res.googleMapsUrl && (
                          <a
                            href={res.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-maps-link"
                            title="Open Google Maps in new tab"
                          >
                            <ExternalLink size={12} strokeWidth={2} style={{ flexShrink: 0 }} />
                            View on Google Maps
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Room Sharing Pills */}
                    {res.roomTypes && res.roomTypes.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {res.roomTypes.map((rt) => (
                          <span key={rt.id} className="admin-room-pill">
                            {rt.name.replace("Standard", "").replace("Budget", "").trim()}: ₹{Number(rt.price || 0).toLocaleString("en-IN")}/mo
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Row: Starting Price & Deposit */}
                    <div className="admin-property-card__meta-row">
                      <div className="admin-property-card__price">
                        <span className="admin-property-card__price-label">Starts at</span>
                        <span className="admin-property-card__price-value">
                          ₹{Number(res.startingPrice || 0).toLocaleString("en-IN")}
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 400 }}> /month</span>
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="admin-property-card__price-label">Security Deposit</span>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                          {res.deposit || "1 Month"}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions & Quick Status Switcher */}
                    <div className="admin-property-card__actions">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Status:</span>
                        <select
                          className="admin-status-select"
                          value={status}
                          onChange={(e) =>
                            handleQuickStatusChange(
                              res.id,
                              e.target.value as "available" | "fast-filling" | "sold-out"
                            )
                          }
                        >
                          <option value="available">Available</option>
                          <option value="fast-filling">Fast Filling</option>
                          <option value="sold-out">Sold Out</option>
                        </select>
                      </div>

                      <div style={{ display: "flex", gap: "6px" }}>
                        {onSelectResidence && (
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            style={{ padding: "6px 10px" }}
                            onClick={() => onSelectResidence(res.id)}
                            title="Preview on customer website"
                          >
                            <Eye size={15} strokeWidth={2} />
                          </button>
                        )}

                        <button
                          type="button"
                          className="admin-btn admin-btn--secondary"
                          style={{ padding: "6px 12px" }}
                          onClick={() => handleOpenEdit(res)}
                        >
                          <Edit3 size={14} strokeWidth={2} />
                          Edit
                        </button>

                        {confirmDeleteId === res.id ? (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <button
                              type="button"
                              className="admin-btn admin-btn--danger"
                              style={{
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: 700,
                                background: "#dc2626",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                              disabled={deletingId === res.id}
                              onClick={() => executeDelete(res.id, res.name)}
                            >
                              <Trash2 size={13} strokeWidth={2.5} />
                              {deletingId === res.id ? "Deleting..." : "Confirm Delete"}
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn--ghost"
                              style={{ padding: "6px 8px", fontSize: "12px", cursor: "pointer" }}
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger"
                            style={{ padding: "6px 10px", cursor: "pointer" }}
                            onClick={() => setConfirmDeleteId(res.id)}
                            title="Delete residence"
                          >
                            <Trash2 size={14} strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>
      )}

      {/* ── CALLBACK REQUESTS TAB (Live From Cloud Firestore) ── */}
      {currentAdminTab === "callbacks" && (
        <div className="admin-leads-section">
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0c1b34", margin: "0 0 4px" }}>
                Callback &amp; Phone Inquiries
              </h2>
              <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                Live customer callback requests submitted through website forms
              </p>
            </div>
            <span className="admin-cloud-badge admin-cloud-badge--synced">
              <span className="admin-cloud-dot admin-cloud-dot--synced" />
              {callbackRequests.length} Total Requests
            </span>
          </div>

          {callbackRequests.length === 0 ? (
            <div className="admin-empty-state">
              <Phone size={40} strokeWidth={1.5} style={{ color: "#94a3b8", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0c1b34", margin: "0 0 6px" }}>
                No callback requests received yet
              </h3>
              <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                When visitors click &quot;Request a callback&quot; on the website, their contact details appear here instantly in real-time.
              </p>
            </div>
          ) : (
            <div className="admin-leads-wrap">
              <div style={{ overflowX: "auto" }}>
                <table className="admin-leads-table">
                  <thead>
                    <tr>
                      <th>Resident Name</th>
                      <th>Phone Number</th>
                      <th>Preferred Locality</th>
                      <th>Source</th>
                      <th>Received</th>
                      <th>Status</th>
                      <th>Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {callbackRequests.map((c, index) => {
                      const dateFormatted = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }) : "Just now";
                      const cleanPhone = c.phone.replace(/[^0-9]/g, "");
                      const waNumber = cleanPhone.startsWith("91") ? cleanPhone : cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                      const waMsg = c.residenceName
                        ? `Hello ${c.name}, this is Charla Living following up on your callback request for ${c.residenceName} in ${c.locality}. When would be a convenient time to speak?`
                        : `Hello ${c.name}, this is Charla Living following up on your callback request for ${c.locality}. When would be a convenient time to speak?`;

                      return (
                        <tr key={c.id || `callback-${index}`}>
                          <td>
                            <strong style={{ fontWeight: 700, fontSize: "14px", color: "#0c1b34" }}>{c.name}</strong>
                          </td>
                          <td>
                            <a
                              href={`tel:${c.phone}`}
                              style={{ color: "#003b99", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                            >
                              <Phone size={13} />
                              {c.phone}
                            </a>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: "#1e293b" }}>{c.locality}</span>
                            {c.residenceName && (
                              <div style={{ fontSize: "11.5px", color: "#003b99", fontWeight: 500, marginTop: "2px" }}>
                                {c.residenceName}
                              </div>
                            )}
                          </td>
                          <td>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{c.source || "Website Form"}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{dateFormatted}</span>
                          </td>
                          <td>
                            <select
                              value={c.status || "new"}
                              onChange={(e) => {
                                if (c.id) {
                                  updateCallbackStatus(c.id, e.target.value as CallbackRequest["status"]);
                                }
                              }}
                              className="admin-status-select"
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderColor: c.status === "new" ? "#a7f3d0" : c.status === "contacted" ? "#fef08a" : c.status === "scheduled" ? "#bfdbfe" : "#e2e8f0",
                                background: c.status === "new" ? "#ecfdf5" : c.status === "contacted" ? "#fefce8" : c.status === "scheduled" ? "#eff6ff" : "#f8fafc",
                                color: c.status === "new" ? "#047857" : c.status === "contacted" ? "#a16207" : c.status === "scheduled" ? "#1d4ed8" : "#475569"
                              }}
                            >
                              <option value="new">New Lead</option>
                              <option value="contacted">Contacted</option>
                              <option value="scheduled">Visit Scheduled</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <a
                                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-btn admin-btn--secondary"
                                style={{ padding: "6px 12px", fontSize: "12px", gap: "6px" }}
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={14} style={{ color: "#25D366" }} />
                                <span>WhatsApp</span>
                              </a>
                              <a
                                href={`tel:${c.phone}`}
                                className="admin-btn admin-btn--secondary"
                                style={{ padding: "6px 10px", fontSize: "12px", gap: "4px" }}
                                title="Call Now"
                              >
                                <Phone size={13} style={{ color: "#003b99" }} />
                                <span>Call</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TOUR BOOKINGS TAB (From Firebase Firestore) ── */}
      {currentAdminTab === "bookings" && (
        <div className="admin-leads-section">
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0c1b34", margin: "0 0 4px" }}>
                Customer Tour &amp; Walkthrough Bookings
              </h2>
              <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                Live customer tour bookings submitted through the website
              </p>
            </div>
            <span className="admin-cloud-badge admin-cloud-badge--synced">
              <span className="admin-cloud-dot admin-cloud-dot--synced" />
              {visitBookings.length} Total Bookings
            </span>
          </div>

          {visitBookings.length === 0 ? (
            <div className="admin-empty-state">
              <CalendarCheck size={40} strokeWidth={1.5} style={{ color: "#94a3b8", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0c1b34", margin: "0 0 6px" }}>
                No visit bookings received yet
              </h3>
              <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                When visitors book an in-person visit or video walkthrough on property pages, they appear here instantly in real-time.
              </p>
            </div>
          ) : (
            <div className="admin-leads-wrap">
              <div style={{ overflowX: "auto" }}>
                <table className="admin-leads-table">
                  <thead>
                    <tr>
                      <th>Resident Name</th>
                      <th>Phone / Contact</th>
                      <th>Selected Property</th>
                      <th>Date &amp; Slot</th>
                      <th>Tour Format</th>
                      <th>Sharing</th>
                      <th>Received</th>
                      <th>Status</th>
                      <th>Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitBookings.map((b, index) => {
                      const dateFormatted = b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }) : "Just now";
                      const cleanPhone = b.phone.replace(/[^0-9]/g, "");
                      const waNumber = cleanPhone.startsWith("91") ? cleanPhone : cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                      const waMsg = `Hello ${b.name}, this is Charla Living regarding your ${b.tourType === "in-person" ? "in-person visit" : "video walkthrough"} for ${b.residenceName} on ${b.date}.`;

                      return (
                        <tr key={b.id || `booking-${index}`}>
                          <td>
                            <strong style={{ fontWeight: 700 }}>{b.name}</strong>
                          </td>
                          <td>
                            <a
                              href={`tel:${b.phone}`}
                              style={{ color: "#003b99", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "5px", textDecoration: "none" }}
                            >
                              <Phone size={13} />
                              {b.phone}
                            </a>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{b.residenceName}</span>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ fontWeight: 600 }}>{b.date}</span>
                              <span style={{ fontSize: "11.5px", color: "#64748b" }}>{b.timeSlot}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`admin-lead-badge admin-lead-badge--${b.tourType}`}>
                              {b.tourType === "in-person" ? "In-Person Visit" : "Video Call"}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12.5px", color: "#475569" }}>{b.sharingType || "Standard"}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{dateFormatted}</span>
                          </td>
                          <td>
                            <select
                              value={b.status || "new"}
                              onChange={(e) => {
                                if (b.id) {
                                  updateBookingStatus(b.id, e.target.value as VisitBooking["status"]);
                                }
                              }}
                              className="admin-status-select"
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderColor: b.status === "new" ? "#a7f3d0" : b.status === "confirmed" ? "#bfdbfe" : b.status === "completed" ? "#bbf7d0" : "#fecdd3",
                                background: b.status === "new" ? "#ecfdf5" : b.status === "confirmed" ? "#eff6ff" : b.status === "completed" ? "#f0fdf4" : "#fff1f2",
                                color: b.status === "new" ? "#047857" : b.status === "confirmed" ? "#1d4ed8" : b.status === "completed" ? "#15803d" : "#be123c"
                              }}
                            >
                              <option value="new">New Booking</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <a
                                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-btn admin-btn--secondary"
                                style={{ padding: "6px 12px", fontSize: "12px", gap: "6px" }}
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={14} style={{ color: "#25D366" }} />
                                <span>WhatsApp</span>
                              </a>
                              <a
                                href={`tel:${b.phone}`}
                                className="admin-btn admin-btn--secondary"
                                style={{ padding: "6px 10px", fontSize: "12px", gap: "4px" }}
                                title="Call Now"
                              >
                                <Phone size={13} style={{ color: "#003b99" }} />
                                <span>Call</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PARTNER INQUIRIES TAB (From Firebase Firestore) ── */}
      {currentAdminTab === "partner" && (
        <div className="admin-leads-section">
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0c1b34", margin: "0 0 4px" }}>
                Property Owner &amp; Institution Applications
              </h2>
              <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                Live partner proposals submitted through the website
              </p>
            </div>
            <span className="admin-cloud-badge admin-cloud-badge--synced">
              <span className="admin-cloud-dot admin-cloud-dot--synced" />
              {partnerInquiries.length} Total Applications
            </span>
          </div>

          {partnerInquiries.length === 0 ? (
            <div className="admin-empty-state">
              <Users size={40} strokeWidth={1.5} style={{ color: "#94a3b8", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0c1b34", margin: "0 0 6px" }}>
                No partner applications received yet
              </h3>
              <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                When property owners or colleges apply on the Partner page, submissions appear here instantly in real-time.
              </p>
            </div>
          ) : (
            <div className="admin-leads-wrap">
              <div style={{ overflowX: "auto" }}>
                <table className="admin-leads-table">
                  <thead>
                    <tr>
                      <th>Applicant Name</th>
                      <th>Phone</th>
                      <th>Type</th>
                      <th>Locality</th>
                      <th>Rooms / Capacity</th>
                      <th>Notes</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnerInquiries.map((p, index) => {
                      const dateFormatted = p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }) : "Just now";
                      const cleanPhone = p.phone.replace(/[^0-9]/g, "");
                      const waNumber = cleanPhone.startsWith("91") ? cleanPhone : cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                      const waMsg = `Hello ${p.fullName}, this is Charla Living following up on your partnership proposal for property in ${p.locality}.`;

                      return (
                        <tr key={p.id || `partner-${index}`}>
                          <td>
                            <strong style={{ fontWeight: 700 }}>{p.fullName}</strong>
                          </td>
                          <td>
                            <a
                              href={`tel:${p.phone}`}
                              style={{ color: "#003b99", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "5px", textDecoration: "none" }}
                            >
                              <Phone size={13} />
                              {p.phone}
                            </a>
                          </td>
                          <td>
                            <span className="admin-lead-badge admin-lead-badge--new">
                              {p.propertyType}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{p.locality}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12.5px", color: "#475569" }}>{p.roomCount}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{p.note || "—"}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{dateFormatted}</span>
                          </td>
                          <td>
                            <select
                              value={p.status || "new"}
                              onChange={(e) => {
                                if (p.id) {
                                  updateInquiryStatus(p.id, e.target.value as PartnerInquiry["status"]);
                                }
                              }}
                              className="admin-status-select"
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderColor: p.status === "new" ? "#fed7aa" : p.status === "contacted" ? "#bfdbfe" : p.status === "approved" ? "#bbf7d0" : "#e2e8f0",
                                background: p.status === "new" ? "#fff7ed" : p.status === "contacted" ? "#eff6ff" : p.status === "approved" ? "#f0fdf4" : "#f8fafc",
                                color: p.status === "new" ? "#c2410c" : p.status === "contacted" ? "#1d4ed8" : p.status === "approved" ? "#15803d" : "#475569"
                              }}
                            >
                              <option value="new">New Proposal</option>
                              <option value="contacted">Contacted</option>
                              <option value="approved">Approved</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <a
                                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-btn admin-btn--secondary"
                                style={{ padding: "6px 12px", fontSize: "12px", gap: "6px" }}
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={14} style={{ color: "#25D366" }} />
                                <span>WhatsApp</span>
                              </a>
                              <a
                                href={`tel:${p.phone}`}
                                className="admin-btn admin-btn--secondary"
                                style={{ padding: "6px 10px", fontSize: "12px", gap: "4px" }}
                                title="Call Now"
                              >
                                <Phone size={13} style={{ color: "#003b99" }} />
                                <span>Call</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      </main>

      {/* ── Add / Edit Residence Modal ── */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">
                {editingId ? "Edit Residence Details" : "Add New Residence"}
              </h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setIsModalOpen(false)}
                title="Close modal"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="admin-modal__tabs">
              <button
                type="button"
                className={`admin-tab ${activeTab === "basic" ? "admin-tab--active" : ""}`}
                onClick={() => setActiveTab("basic")}
              >
                1. Basic Info
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === "pricing" ? "admin-tab--active" : ""}`}
                onClick={() => setActiveTab("pricing")}
              >
                2. Pricing & Sharing
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === "media" ? "admin-tab--active" : ""}`}
                onClick={() => setActiveTab("media")}
              >
                3. Photos & Video
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === "amenities" ? "admin-tab--active" : ""}`}
                onClick={() => setActiveTab("amenities")}
              >
                4. Amenities & Services
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveResidence} style={{ display: "contents" }}>
              <div className="admin-modal__body">
                {/* ── TAB 1: BASIC INFO ── */}
                {activeTab === "basic" && (
                  <div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Property Name *</label>
                      <input
                        type="text"
                        required
                        className="admin-form-input"
                        placeholder="e.g. Charla Living — JP Nagar"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Locality / Neighborhood *</label>
                        <input
                          type="text"
                          required
                          className="admin-form-input"
                          placeholder="e.g. JP Nagar, Bengaluru"
                          value={formData.locality || ""}
                          onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Category *</label>
                        <select
                          className="admin-form-input"
                          value={formData.gender || "male"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gender: e.target.value as "male" | "female" | "co-living",
                            })
                          }
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="co-living">Co-living</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Key Landmark</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="e.g. Behind Vega City Mall, 5 mins to Metro"
                          value={formData.landmark || ""}
                          onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Availability Status</label>
                        <select
                          className="admin-form-input"
                          value={formData.status || "available"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value as "available" | "fast-filling" | "sold-out",
                            })
                          }
                        >
                          <option value="available">Available for Move-in</option>
                          <option value="fast-filling">Fast Filling (Few Beds Left)</option>
                          <option value="sold-out">Sold Out / Waitlist</option>
                        </select>
                      </div>
                    </div>

                    {/* Google Maps Link Field */}
                    <div className="admin-form-group">
                      <label className="admin-form-label">Google Maps Link</label>
                      <input
                        type="url"
                        className="admin-form-input"
                        placeholder="https://maps.google.com/... or https://maps.app.goo.gl/..."
                        value={formData.googleMapsUrl || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const extracted = extractCoordsFromGoogleMapsUrl(val);
                          if (extracted) {
                            setFormData({
                              ...formData,
                              googleMapsUrl: val,
                              lat: extracted.lat,
                              lng: extracted.lng,
                            });
                          } else {
                            setFormData({ ...formData, googleMapsUrl: val });
                          }
                        }}
                      />
                      <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
                        Paste any Google Maps link. GPS coordinates will be auto-extracted to pinpoint this property on the map.
                      </span>

                      {formData.lat && formData.lng && (
                        <div style={{ marginTop: "6px", fontSize: "12px", color: "#00875a", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#00875a" }} />
                          <span>Coordinates detected ({formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}) · Synced to map view</span>
                        </div>
                      )}
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Map Latitude (Auto / Optional)</label>
                        <input
                          type="number"
                          step="0.0001"
                          className="admin-form-input"
                          placeholder="e.g. 12.9123"
                          value={formData.lat !== undefined ? formData.lat : ""}
                          onChange={(e) => setFormData({ ...formData, lat: e.target.value ? parseFloat(e.target.value) : undefined })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Map Longitude (Auto / Optional)</label>
                        <input
                          type="number"
                          step="0.0001"
                          className="admin-form-input"
                          placeholder="e.g. 77.5841"
                          value={formData.lng !== undefined ? formData.lng : ""}
                          onChange={(e) => setFormData({ ...formData, lng: e.target.value ? parseFloat(e.target.value) : undefined })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Location Transit Details</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. 5th Phase, 6 min walk to JP Nagar Metro, near Central Mall"
                        value={formData.locationDetails || ""}
                        onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Marketing Headline</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. Premium Living in the Heart of JP Nagar"
                        value={formData.headline || ""}
                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Property Description</label>
                      <textarea
                        rows={3}
                        className="admin-form-textarea"
                        placeholder="Describe the rooms, food, environment, and neighborhood connectivity..."
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* ── TAB 2: PRICING & ROOM TYPES ── */}
                {activeTab === "pricing" && (
                  <div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Starting Price (₹/month) *</label>
                        <input
                          type="number"
                          required
                          min={0}
                          className="admin-form-input"
                          placeholder="e.g. 10500"
                          value={formData.startingPrice || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, startingPrice: Number(e.target.value) })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Security Deposit Terms</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="e.g. 1 Month (100% Refundable)"
                          value={formData.deposit || ""}
                          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                        />
                      </div>
                    </div>

                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#003b99",
                        marginTop: "16px",
                        marginBottom: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      Room Sharing Configurations
                    </h4>

                    {formData.roomTypes?.map((rt, idx) => (
                      <div
                        key={rt.id || idx}
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          padding: "16px",
                          marginBottom: "12px",
                        }}
                      >
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Sharing Option Name</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              placeholder="e.g. Single Sharing, 2-Sharing"
                              value={rt.name || ""}
                              onChange={(e) => {
                                const updated = [...(formData.roomTypes || [])];
                                updated[idx].name = e.target.value;
                                setFormData({ ...formData, roomTypes: updated });
                              }}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label className="admin-form-label">Monthly Rent (₹)</label>
                            <input
                              type="number"
                              className="admin-form-input"
                              placeholder="e.g. 15000"
                              value={rt.price || ""}
                              onChange={(e) => {
                                const updated = [...(formData.roomTypes || [])];
                                updated[idx].price = Number(e.target.value);
                                setFormData({ ...formData, roomTypes: updated });
                              }}
                            />
                          </div>
                        </div>

                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label className="admin-form-label">Bed Type</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              placeholder="e.g. Queen Sized Bed, 2 Single Beds"
                              value={rt.bedType || ""}
                              onChange={(e) => {
                                const updated = [...(formData.roomTypes || [])];
                                updated[idx].bedType = e.target.value;
                                setFormData({ ...formData, roomTypes: updated });
                              }}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label className="admin-form-label">Vacancy Badge (optional)</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              placeholder="e.g. ONLY 2 LEFT, HIGH DEMAND"
                              value={rt.badge || ""}
                              onChange={(e) => {
                                const updated = [...(formData.roomTypes || [])];
                                updated[idx].badge = e.target.value;
                                setFormData({ ...formData, roomTypes: updated });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── TAB 3: PHOTOS & VIDEO WALKTHROUGH ── */}
                {activeTab === "media" && (
                  <div>
                    {isUploadingMedia && (
                      <div
                        style={{
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "10px",
                          padding: "12px 16px",
                          marginBottom: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          color: "#1d4ed8",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        <Loader2 size={16} className="animate-spin" />
                        Uploading & optimizing media file... Please wait.
                      </div>
                    )}

                    {/* Video Walkthrough Section */}
                    <div
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "14px",
                        padding: "16px",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <Video size={20} strokeWidth={2} color="#166534" />
                        <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#166534" }}>
                          Property Video Walkthrough
                        </h4>
                      </div>
                      <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#15803d" }}>
                        Add an authentic walkthrough video of the room and amenities. Enter a video URL or upload an MP4.
                      </p>

                      <div className="admin-form-row">
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="Video URL (e.g. https://... or /assets/...)"
                          value={formData.videoUrl || ""}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        />

                        <label
                          className="admin-btn admin-btn--secondary"
                          style={{
                            cursor: isUploadingMedia ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            justifyContent: "center",
                            opacity: isUploadingMedia ? 0.6 : 1,
                          }}
                        >
                          {isUploadingMedia ? "Uploading..." : "Upload MP4 Video"}
                          <input
                            type="file"
                            accept="video/*"
                            disabled={isUploadingMedia}
                            style={{ display: "none" }}
                            onChange={(e) => handleMediaUpload(e, "video")}
                          />
                        </label>
                      </div>

                      {formData.videoUrl && (
                        <div style={{ marginTop: "12px", borderRadius: "10px", overflow: "hidden", maxHeight: "200px" }}>
                          <video
                            src={formData.videoUrl}
                            controls
                            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Primary Photos */}
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#003b99",
                        margin: "16px 0 10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      Primary Property Photos
                    </h4>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Hero / Facade Photo URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="https://..."
                          value={formData.images?.hero || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              images: {
                                ...(formData.images || { hero: "", room: "", lounge: "", dining: "" }),
                                hero: e.target.value,
                              },
                            })
                          }
                        />
                        <div style={{ marginTop: "6px" }}>
                          <label
                            className="admin-btn admin-btn--ghost"
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              cursor: isUploadingMedia ? "not-allowed" : "pointer",
                              opacity: isUploadingMedia ? 0.6 : 1,
                            }}
                          >
                            {isUploadingMedia ? "Uploading..." : "Upload Hero File"}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingMedia}
                              style={{ display: "none" }}
                              onChange={(e) => handleMediaUpload(e, "hero")}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Room Interior Photo URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="https://..."
                          value={formData.images?.room || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              images: {
                                ...(formData.images || { hero: "", room: "", lounge: "", dining: "" }),
                                room: e.target.value,
                              },
                            })
                          }
                        />
                        <div style={{ marginTop: "6px" }}>
                          <label
                            className="admin-btn admin-btn--ghost"
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              cursor: isUploadingMedia ? "not-allowed" : "pointer",
                              opacity: isUploadingMedia ? 0.6 : 1,
                            }}
                          >
                            {isUploadingMedia ? "Uploading..." : "Upload Room File"}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingMedia}
                              style={{ display: "none" }}
                              onChange={(e) => handleMediaUpload(e, "room")}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Lounge / Recreation Area URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="https://..."
                          value={formData.images?.lounge || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              images: {
                                ...(formData.images || { hero: "", room: "", lounge: "", dining: "" }),
                                lounge: e.target.value,
                              },
                            })
                          }
                        />
                        <div style={{ marginTop: "6px" }}>
                          <label
                            className="admin-btn admin-btn--ghost"
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              cursor: isUploadingMedia ? "not-allowed" : "pointer",
                              opacity: isUploadingMedia ? 0.6 : 1,
                            }}
                          >
                            {isUploadingMedia ? "Uploading..." : "Upload Lounge File"}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingMedia}
                              style={{ display: "none" }}
                              onChange={(e) => handleMediaUpload(e, "lounge")}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-form-label">Dining & Kitchen Area URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          placeholder="https://..."
                          value={formData.images?.dining || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              images: {
                                ...(formData.images || { hero: "", room: "", lounge: "", dining: "" }),
                                dining: e.target.value,
                              },
                            })
                          }
                        />
                        <div style={{ marginTop: "6px" }}>
                          <label
                            className="admin-btn admin-btn--ghost"
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              cursor: isUploadingMedia ? "not-allowed" : "pointer",
                              opacity: isUploadingMedia ? 0.6 : 1,
                            }}
                          >
                            {isUploadingMedia ? "Uploading..." : "Upload Dining File"}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingMedia}
                              style={{ display: "none" }}
                              onChange={(e) => handleMediaUpload(e, "dining")}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Additional Gallery Photos */}
                    <div style={{ marginTop: "18px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <label className="admin-form-label" style={{ margin: 0 }}>
                          Additional Gallery Photos ({formData.additionalPhotos?.length || 0})
                        </label>
                        <label
                          className="admin-btn admin-btn--secondary"
                          style={{
                            fontSize: "12px",
                            padding: "4px 10px",
                            cursor: isUploadingMedia ? "not-allowed" : "pointer",
                            opacity: isUploadingMedia ? 0.6 : 1,
                          }}
                        >
                          {isUploadingMedia ? "Uploading..." : "+ Add Photo"}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingMedia}
                            style={{ display: "none" }}
                            onChange={(e) => handleMediaUpload(e, "gallery")}
                          />
                        </label>
                      </div>

                      {formData.additionalPhotos && formData.additionalPhotos.length > 0 ? (
                        <div className="admin-gallery-preview">
                          {formData.additionalPhotos.map((photoUrl, pIdx) => (
                            <div key={pIdx} className="admin-gallery-thumb">
                              <img src={photoUrl} alt={`Gallery ${pIdx}`} />
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    additionalPhotos: formData.additionalPhotos?.filter((_, i) => i !== pIdx),
                                  });
                                }}
                                title="Remove photo"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0" }}>
                          No additional gallery photos added yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── TAB 4: AMENITIES ── */}
                {activeTab === "amenities" && (
                  <div>
                    <p style={{ margin: "0 0 16px", fontSize: "13.5px", color: "#64748b" }}>
                      Select the verified amenities included in this property's rent:
                    </p>

                    <div className="admin-amenities-grid">
                      {DEFAULT_AMENITIES_OPTIONS.map((item) => {
                        const isChecked = formData.amenities?.some((a) => a.title === item.title);
                        return (
                          <div
                            key={item.title}
                            className={`admin-amenity-checkbox ${isChecked ? "is-checked" : ""}`}
                            onClick={() => {
                              const current = formData.amenities || [];
                              if (isChecked) {
                                setFormData({
                                  ...formData,
                                  amenities: current.filter((a) => a.title !== item.title),
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  amenities: [...current, item],
                                });
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              style={{ cursor: "pointer" }}
                            />
                            <div>
                              <div style={{ fontSize: "13.5px", fontWeight: 600 }}>{item.title}</div>
                              <div style={{ fontSize: "12px", color: "#64748b" }}>{item.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div
                className="admin-modal__footer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {editingId ? (
                  modalConfirmDelete ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "#dc2626", fontWeight: 600 }}>Remove property?</span>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        style={{ padding: "6px 12px", fontSize: "12px", background: "#dc2626", color: "#fff" }}
                        onClick={async () => {
                          if (editingId) {
                            await executeDelete(editingId, formData.name);
                            setIsModalOpen(false);
                            setModalConfirmDelete(false);
                          }
                        }}
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        style={{ padding: "6px 10px", fontSize: "12px" }}
                        onClick={() => setModalConfirmDelete(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      style={{
                        padding: "7px 14px",
                        fontSize: "13px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() => setModalConfirmDelete(true)}
                    >
                      <Trash2 size={14} />
                      Delete Listing
                    </button>
                  )
                ) : (
                  <div />
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn--secondary"
                    onClick={() => {
                      setIsModalOpen(false);
                      setModalConfirmDelete(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn--primary">
                    {editingId ? "Save Changes" : "Publish Residence"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Video Player Modal ── */}
      {previewVideoUrl && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setPreviewVideoUrl(null)}
          style={{ zIndex: 120 }}
        >
          <div
            style={{
              maxWidth: "720px",
              width: "100%",
              background: "#000000",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                background: "rgba(12, 27, 52, 0.9)",
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Video size={16} strokeWidth={2} />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>Property Video Walkthrough</span>
              </div>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
                onClick={() => setPreviewVideoUrl(null)}
                title="Close video walkthrough"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              style={{ width: "100%", maxHeight: "75vh", display: "block" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
