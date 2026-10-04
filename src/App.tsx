import { useState, useEffect } from "react";
import { LegacyChrome } from "@/components/site/LegacyChrome";
import { LegacyFooter } from "@/components/site/LegacyFooter";
import { LegacySections } from "@/components/site/LegacySections";
import { ResidenceDetail } from "@/components/residence/ResidenceDetail";
import { RESIDENCES } from "@/data/residences";
import Skiper39 from "@/components/ui/skiper39";
import { initSiteInteractions } from "./site-interactions";
import "./site.css";
import "./hero.css";

function getResidenceIdFromHash(): string | null {
  const hash = window.location.hash;
  if (!hash) return null;
  
  if (hash.startsWith("#/residence/")) {
    const id = hash.replace("#/residence/", "").trim();
    return RESIDENCES[id] ? id : null;
  }
  if (hash.startsWith("#residence/")) {
    const id = hash.replace("#residence/", "").trim();
    return RESIDENCES[id] ? id : null;
  }
  return null;
}

function App() {
  const [selectedResidenceId, setSelectedResidenceId] = useState<string | null>(() => getResidenceIdFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      const resId = getResidenceIdFromHash();
      setSelectedResidenceId(resId);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!selectedResidenceId) {
      initSiteInteractions();
    }
  }, [selectedResidenceId]);

  const handleSelectResidence = (id: string) => {
    if (RESIDENCES[id]) {
      setSelectedResidenceId(id);
      window.location.hash = `#/residence/${id}`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToHome = (targetHash: string = "home") => {
    setSelectedResidenceId(null);
    window.location.hash = targetHash;
    if (targetHash === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTimeout(() => {
        const el = document.getElementById(targetHash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const currentResidence = selectedResidenceId ? RESIDENCES[selectedResidenceId] : null;

  return (
    <>
      {currentResidence ? (
        <ResidenceDetail
          residence={currentResidence}
          onBack={() => handleBackToHome("residences")}
          onSelectResidence={handleSelectResidence}
        />
      ) : (
        <>
          <LegacyChrome 
            onNavigateHome={() => handleBackToHome("home")} 
            onSelectResidence={handleSelectResidence} 
          />
          <main id="home">
            <Skiper39 />
            <LegacySections onSelectResidence={handleSelectResidence} />
          </main>
        </>
      )}

      <LegacyFooter 
        onSelectResidence={handleSelectResidence} 
        onNavigateHome={() => handleBackToHome("home")} 
      />
    </>
  );
}

export default App;

