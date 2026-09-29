import { useEffect } from "react";
import { LegacyChrome } from "@/components/site/LegacyChrome";
import { LegacyFooter } from "@/components/site/LegacyFooter";
import { LegacySections } from "@/components/site/LegacySections";
import Skiper39 from "@/components/ui/skiper39";
import { initSiteInteractions } from "./site-interactions";
import "./site.css";
import "./hero.css";

function App() {
  useEffect(() => {
    initSiteInteractions();
  }, []);

  return (
    <>
      <LegacyChrome />
      <main id="home">
        <Skiper39 />
        <LegacySections />
      </main>
      <LegacyFooter />
    </>
  );
}

export default App;
