import { useState, useEffect } from "react";
import { LegacyChrome } from "@/components/site/LegacyChrome";
import { LegacyFooter } from "@/components/site/LegacyFooter";
import { LegacySections } from "@/components/site/LegacySections";
import { FloatingContactActions } from "@/components/site/FloatingContactActions";
import { ResidenceDetail } from "@/components/residence/ResidenceDetail";
import { ResidencesPage } from "@/components/residence/ResidencesPage";
import { PartnerPage } from "@/components/partner/PartnerPage";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { LegalModal, type LegalTab } from "@/components/ui/LegalModal";
import { RESIDENCES } from "@/data/residences";
import { ResidencesProvider, useResidences } from "@/context/ResidencesContext";
import Skiper39 from "@/components/ui/skiper39";
import { initSiteInteractions } from "./site-interactions";
import "./site.css";
import "./hero.css";
import "./partner.css";
import "./admin.css";

type ViewState = "home" | "residences" | "detail" | "partner" | "admin";

function parseRouteFromHash(): { view: ViewState; residenceId: string | null; targetSection?: string } {
  const hash = window.location.hash;
  const path = window.location.pathname.replace(/\/$/, "");

  // 1. Process hash route if present
  if (hash && hash !== "#" && hash !== "#home" && hash !== "#/home") {
    if (hash === "#admin" || hash === "#/admin" || hash.startsWith("#/admin")) {
      return { view: "admin", residenceId: null };
    }
    if (hash.startsWith("#/residence/")) {
      const id = hash.replace("#/residence/", "").trim();
      if (id) return { view: "detail", residenceId: id };
    }
    if (hash.startsWith("#residence/")) {
      const id = hash.replace("#residence/", "").trim();
      if (id) return { view: "detail", residenceId: id };
    }
    if (hash === "#residences" || hash === "#/residences" || hash.startsWith("#/residences")) {
      return { view: "residences", residenceId: null };
    }
    if (hash === "#partner" || hash === "#/partner" || hash === "#partner-with-us" || hash === "#/partner-with-us") {
      return { view: "partner", residenceId: null };
    }
    return { view: "home", residenceId: null, targetSection: hash.replace("#", "") };
  }

  // 2. Direct clean pathname fallback (Google search results or clean URL direct hits)
  if (path === "/admin") {
    return { view: "admin", residenceId: null };
  }
  if (path === "/residences") {
    return { view: "residences", residenceId: null };
  }
  if (path === "/partner" || path === "/partner-with-us") {
    return { view: "partner", residenceId: null };
  }
  if (path.startsWith("/residence/")) {
    const id = path.replace("/residence/", "").trim();
    if (id) return { view: "detail", residenceId: id };
  }

  return { view: "home", residenceId: null };
}

function AppContent() {
  const { residences, residencesMap, residenceItems } = useResidences();
  const [currentView, setCurrentView] = useState<ViewState>(() => parseRouteFromHash().view);
  const [selectedResidenceId, setSelectedResidenceId] = useState<string | null>(() => parseRouteFromHash().residenceId);
  const [selectedLocality, setSelectedLocality] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("any");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedLocalityInfo, setDetectedLocalityInfo] = useState<{ id: string; name: string; distanceKm: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTab>("privacy");
  const [cookieConsentKey, setCookieConsentKey] = useState<number>(0);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseRouteFromHash();
      setCurrentView(parsed.view);
      setSelectedResidenceId(parsed.residenceId);
      if (parsed.view === "home" && parsed.targetSection && parsed.targetSection !== "home") {
        setTimeout(() => {
          const el = document.getElementById(parsed.targetSection!);
          if (el) {
            const navOffset = 80;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (currentView === "home") {
      const cleanup = initSiteInteractions();
      return () => {
        if (typeof cleanup === "function") cleanup();
      };
    }
  }, [currentView]);

  const handleSelectResidence = (id: string) => {
    setSelectedResidenceId(id);
    setCurrentView("detail");
    window.location.hash = `#/residence/${id}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateResidences = () => {
    setSelectedResidenceId(null);
    setCurrentView("residences");
    window.location.hash = "#/residences";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigatePartner = () => {
    setSelectedResidenceId(null);
    setCurrentView("partner");
    window.location.hash = "#/partner-with-us";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = (targetHash: string = "home") => {
    setSelectedResidenceId(null);
    if (targetHash === "residences" || targetHash === "#/residences") {
      setCurrentView("residences");
      window.location.hash = "#/residences";
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentView("home");
    const cleanHash = targetHash.replace("#", "").replace("/", "");
    window.location.hash = cleanHash === "home" ? "#home" : `#${cleanHash}`;

    if (cleanHash === "home" || !cleanHash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTimeout(() => {
        const el = document.getElementById(cleanHash);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 60);
    }
  };

  const handleHeroSearch = (searchData: {
    locality: string;
    roomType: string;
    userCoords: { lat: number; lng: number } | null;
    detectedLocalityInfo?: { id: string; name: string; distanceKm: number } | null;
    sortBy?: string;
  }) => {
    setSelectedLocality(searchData.locality || "all");
    setRoomTypeFilter(searchData.roomType || "any");
    setUserCoords(searchData.userCoords || null);
    setDetectedLocalityInfo(searchData.detectedLocalityInfo || null);
    if (searchData.sortBy) {
      setSortBy(searchData.sortBy);
    }

    // Direct navigation to dedicated Residences Page
    setCurrentView("residences");
    window.location.hash = "#/residences";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearLocation = () => {
    setUserCoords(null);
    setDetectedLocalityInfo(null);
    setSelectedLocality("all");
    setSortBy("featured");
    setRoomTypeFilter("any");
  };

  const currentResidence = selectedResidenceId
    ? (residencesMap[selectedResidenceId] || RESIDENCES[selectedResidenceId] || null)
    : null;

  // Dynamic SEO page title and meta description updates
  useEffect(() => {
    let title = "Charla Living | Premium PG & Co-Living in South Bangalore";
    let desc = "Family-run, fully managed PG residences across South Bengaluru: Kumaraswamy Layout, JP Nagar, Banashankari, Padmanabhanagar, Jayanagar & Uttarahalli. Zero brokerage, 4 daily meals, 100 Mbps Wi-Fi, and 1-month deposit.";

    if (currentView === "residences") {
      title = "Explore All Residences | Charla Living - South Bangalore PGs";
      desc = "Browse verified, fully managed student and professional PG homes across South Bengaluru. Filter by sharing type, budget, and proximity to DSCE, Jain, RV, or Namma Metro.";
    } else if (currentView === "detail" && currentResidence) {
      title = `${currentResidence.name} | Charla Living - PG in ${currentResidence.locality}`;
      desc = `Explore ${currentResidence.name} in ${currentResidence.locality}, Bangalore. Starting ₹${currentResidence.startingPrice.toLocaleString("en-IN")}/mo with 4 fresh meals, high-speed Wi-Fi, and zero brokerage.`;
    } else if (currentView === "partner") {
      title = "Partner with Us | Charla Living - PG Property Management";
      desc = "Partner your property with Charla Living for guaranteed on-time rental income, professional property upkeep, and zero hassle.";
    } else if (currentView === "admin") {
      title = "Admin Space | Charla Living";
      desc = "Charla Living administration and inquiries management dashboard.";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", desc);
    }
  }, [currentView, currentResidence]);

  const handleOpenLegalModal = (tab: LegalTab = "privacy") => {
    setActiveLegalTab(tab);
    setIsLegalModalOpen(true);
  };

  const handleResetCookies = () => {
    try {
      localStorage.removeItem("charla_cookie_consent");
      setCookieConsentKey((k) => k + 1);
    } catch (err) {
      void err;
    }
  };

  if (currentView === "admin") {
    return (
      <AdminDashboard
        onNavigateHome={() => handleBackToHome("home")}
        onSelectResidence={handleSelectResidence}
      />
    );
  }

  return (
    <>
      <LegacyChrome 
        onNavigateHome={handleBackToHome} 
        onNavigateResidences={handleNavigateResidences}
        onNavigatePartner={handleNavigatePartner}
        onSelectResidence={handleSelectResidence} 
        currentPage={currentView === "detail" ? "detail" : currentView === "residences" ? "residences" : currentView === "partner" ? "partner" : "home"}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        onCloseSearch={() => setIsSearchOpen(false)}
      />

      {currentView === "detail" && currentResidence ? (
        <ResidenceDetail
          key={currentResidence.id}
          residence={currentResidence}
          allResidences={residences}
          onBack={() => handleBackToHome("residences")}
          onSelectResidence={handleSelectResidence}
        />
      ) : currentView === "residences" ? (
        <ResidencesPage
          residences={residenceItems}
          onSelectResidence={handleSelectResidence}
          selectedLocality={selectedLocality}
          onSelectLocality={setSelectedLocality}
          sortBy={sortBy}
          onSortChange={setSortBy}
          userCoords={userCoords}
          detectedLocalityInfo={detectedLocalityInfo}
          roomTypeFilter={roomTypeFilter}
          onClearLocation={handleClearLocation}
          onBackToHome={handleBackToHome}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      ) : currentView === "partner" ? (
        <PartnerPage onBackToHome={handleBackToHome} />
      ) : (
        <main id="home">
          <Skiper39 onSearch={handleHeroSearch} />
          <LegacySections />
        </main>
      )}

      <LegacyFooter 
        onSelectResidence={handleSelectResidence} 
        onNavigateHome={handleBackToHome} 
        onNavigatePartner={handleNavigatePartner}
        onOpenLegalModal={handleOpenLegalModal}
      />

      <FloatingContactActions />

      <CookieConsent 
        key={cookieConsentKey} 
        onOpenLegalModal={handleOpenLegalModal} 
      />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        activeTab={activeLegalTab}
        onSelectTab={setActiveLegalTab}
        onResetCookies={handleResetCookies}
      />
    </>
  );
}

function App() {
  return (
    <ResidencesProvider>
      <AppContent />
    </ResidencesProvider>
  );
}

export default App;
