import { useState, useEffect } from "react";
import { LegacyChrome } from "@/components/site/LegacyChrome";
import { LegacyFooter } from "@/components/site/LegacyFooter";
import { LegacySections } from "@/components/site/LegacySections";
import { ResidenceDetail } from "@/components/residence/ResidenceDetail";
import { ResidencesPage } from "@/components/residence/ResidencesPage";
import { RESIDENCES } from "@/data/residences";
import Skiper39 from "@/components/ui/skiper39";
import { initSiteInteractions } from "./site-interactions";
import "./site.css";
import "./hero.css";

type ViewState = "home" | "residences" | "detail";

function parseRouteFromHash(): { view: ViewState; residenceId: string | null; targetSection?: string } {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#home" || hash === "#/home") {
    return { view: "home", residenceId: null };
  }
  if (hash.startsWith("#/residence/")) {
    const id = hash.replace("#/residence/", "").trim();
    if (RESIDENCES[id]) return { view: "detail", residenceId: id };
  }
  if (hash.startsWith("#residence/")) {
    const id = hash.replace("#residence/", "").trim();
    if (RESIDENCES[id]) return { view: "detail", residenceId: id };
  }
  if (hash === "#residences" || hash === "#/residences" || hash.startsWith("#/residences")) {
    return { view: "residences", residenceId: null };
  }
  return { view: "home", residenceId: null, targetSection: hash.replace("#", "") };
}

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(() => parseRouteFromHash().view);
  const [selectedResidenceId, setSelectedResidenceId] = useState<string | null>(() => parseRouteFromHash().residenceId);
  const [selectedLocality, setSelectedLocality] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("any");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedLocalityInfo, setDetectedLocalityInfo] = useState<{ id: string; name: string; distanceKm: number } | null>(null);

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
      initSiteInteractions();
    }
  }, [currentView]);

  const handleSelectResidence = (id: string) => {
    if (RESIDENCES[id]) {
      setSelectedResidenceId(id);
      setCurrentView("detail");
      window.location.hash = `#/residence/${id}`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavigateResidences = () => {
    setSelectedResidenceId(null);
    setCurrentView("residences");
    window.location.hash = "#/residences";
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

  const currentResidence = selectedResidenceId ? RESIDENCES[selectedResidenceId] : null;

  return (
    <>
      <LegacyChrome 
        onNavigateHome={handleBackToHome} 
        onNavigateResidences={handleNavigateResidences}
        onSelectResidence={handleSelectResidence} 
        currentPage={currentView === "detail" ? "detail" : currentView === "residences" ? "residences" : "home"}
      />

      {currentView === "detail" && currentResidence ? (
        <ResidenceDetail
          residence={currentResidence}
          onBack={() => handleBackToHome("residences")}
          onSelectResidence={handleSelectResidence}
        />
      ) : currentView === "residences" ? (
        <ResidencesPage
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
        />
      ) : (
        <main id="home">
          <Skiper39 onSearch={handleHeroSearch} />
          <LegacySections
            onSelectResidence={handleSelectResidence}
            onNavigateResidences={handleNavigateResidences}
          />
        </main>
      )}

      <LegacyFooter 
        onSelectResidence={handleSelectResidence} 
        onNavigateHome={handleBackToHome} 
      />
    </>
  );
}

export default App;

