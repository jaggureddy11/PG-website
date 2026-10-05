import { useState, useEffect, useRef } from "react";
import { ArrowRight, LocateFixed, Loader2, Search } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { findNearestLocality } from "@/utils/location";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
}

type SpriteRect = [number, number, number, number];

type Peep = {
  rect: SpriteRect;
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  setScale: (scale: number) => void;
  render: (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => void;
};

type Stage = { width: number; height: number };

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomIndex = (length: number) => Math.floor(Math.random() * length);

function CrowdCanvas({ src, rows = 15, cols = 7, className = "" }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let disposed = false;
    let imageReady = false;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const stage: Stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const image = new Image();

    const createPeep = (rect: SpriteRect): Peep => {
      const peep: Peep = {
        rect,
        width: rect[2],
        height: rect[3],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setScale(scale) {
          peep.width = rect[2] * scale;
          peep.height = rect[3] * scale;
        },
        render(context, sprite) {
          context.save();
          context.translate(peep.x, peep.y);
          context.scale(peep.scaleX, 1);
          context.drawImage(
            sprite,
            rect[0],
            rect[1],
            rect[2],
            rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          context.restore();
        },
      };
      return peep;
    };

    const resetPeep = (peep: Peep) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 80 - 220 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : -peep.width;

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;

      return { startY, endX };
    };

    const render = () => {
      if (disposed || !imageReady) return;
      ctx.clearRect(0, 0, stage.width, stage.height);
      crowd.forEach((peep) => peep.render(ctx, image));
    };

    const addPeepToCrowd = () => {
      if (disposed || availablePeeps.length === 0) return;
      const peep = availablePeeps.splice(randomIndex(availablePeeps.length), 1)[0];
      const { startY, endX } = resetPeep(peep);
      const duration = randomRange(9, 14);
      const timeline = gsap.timeline({
        onComplete: () => {
          if (disposed) return;
          const index = crowd.indexOf(peep);
          if (index !== -1) crowd.splice(index, 1);
          availablePeeps.push(peep);
          addPeepToCrowd();
        },
      });

      peep.walk = timeline;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      timeline.fromTo(
        peep,
        { x: peep.x, y: startY },
        {
          x: endX,
          duration,
          ease: "none",
          immediateRender: true,
        },
      );
    };

    const createSprites = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      allPeeps.length = 0;
      availablePeeps.length = 0;
      crowd.length = 0;

      const spriteWidth = image.naturalWidth / cols;
      const spriteHeight = image.naturalHeight / rows;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const rect: SpriteRect = [
            j * spriteWidth,
            i * spriteHeight,
            spriteWidth,
            spriteHeight,
          ];
          allPeeps.push(createPeep(rect));
        }
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      stage.width = Math.max(rect.width, 320);
      stage.height = Math.max(rect.height, 240);

      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = stage.width * pixelRatio;
      canvas.height = stage.height * pixelRatio;
      canvas.style.width = `${stage.width}px`;
      canvas.style.height = `${stage.height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(pixelRatio, pixelRatio);

      const isMobile = stage.width < 640;
      const targetCrowdSize = isMobile ? 8 : 16;
      const scale = isMobile ? 0.38 : 0.48;

      allPeeps.forEach((peep) => peep.setScale(scale));
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;

      if (reducedMotion.matches) {
        const staticCount = Math.min(allPeeps.length, isMobile ? 6 : 10);
        for (let i = 0; i < staticCount; i++) {
          const peep = availablePeeps.splice(randomIndex(availablePeeps.length), 1)[0];
          peep.x = (stage.width / (staticCount + 1)) * (i + 1) - peep.width / 2;
          peep.y = stage.height - peep.height + randomRange(-40, 20);
          peep.scaleX = Math.random() > 0.5 ? 1 : -1;
          crowd.push(peep);
        }
        crowd.sort((a, b) => a.anchorY - b.anchorY);
        render();
        return;
      }

      for (let i = 0; i < targetCrowdSize; i++) {
        addPeepToCrowd();
      }
    };

    const initialize = () => {
      imageReady = true;
      createSprites();
      resize();
    };

    image.decoding = "async";
    image.onload = initialize;
    image.onerror = () => canvas.setAttribute("data-canvas-error", "true");
    image.src = src;
    if (image.complete && image.naturalWidth > 0) initialize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", resize);
    gsap.ticker.add(render);

    return () => {
      disposed = true;
      image.onload = null;
      image.onerror = null;
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className={`hero-crowd-canvas ${className}`} aria-hidden="true" />;
}

interface Skiper39Props {
  onSearch?: (searchData: {
    locality: string;
    roomType: string;
    userCoords: { lat: number; lng: number } | null;
    detectedLocalityInfo?: { id: string; name: string; distanceKm: number } | null;
    sortBy?: string;
  }) => void;
}

function resolveLocalityFromQuery(query: string): string {
  const q = query.toLowerCase().trim();
  if (!q) return "all";
  if (q.includes("kumara") || q.includes("layout") || q.includes("ks layout")) return "kumaraswamy-layout";
  if (q.includes("uttara") || q.includes("halli")) return "uttarahalli";
  if (q.includes("banashankari") || q.includes("bsk")) return "banashankari";
  if (q.includes("padmanabha") || q.includes("padman")) return "padmanabhanagar";
  if (q.includes("jp") || q.includes("jp nagar")) return "jp-nagar";
  if (q.includes("jaya") || q.includes("jayanagar")) return "jayanagar";
  return "all";
}

function Skiper39({ onSearch }: Skiper39Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "success" | "denied">("idle");
  const [detectedLocality, setDetectedLocality] = useState<{ id: string; name: string; distanceKm: number } | null>(null);

  const handleDetectLocation = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please search your locality manually.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("idle");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestLocality(latitude, longitude);

        setIsLocating(false);
        setLocationStatus("success");
        setDetectedLocality(nearest);
        setSearchQuery(`📍 Near ${nearest.name}`);

        if (onSearch) {
          onSearch({
            locality: nearest.id,
            roomType: "any",
            userCoords: { lat: latitude, lng: longitude },
            detectedLocalityInfo: nearest,
            sortBy: "nearest"
          });
        }
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        setIsLocating(false);
        setLocationStatus("denied");

        if (onSearch) {
          onSearch({
            locality: resolveLocalityFromQuery(searchQuery),
            roomType: "any",
            userCoords: null,
            sortBy: "featured"
          });
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedLocality = detectedLocality && searchQuery.includes(detectedLocality.name)
      ? detectedLocality.id
      : resolveLocalityFromQuery(searchQuery);

    if (onSearch) {
      onSearch({
        locality: resolvedLocality,
        roomType: "any",
        userCoords: null,
        detectedLocalityInfo: detectedLocality,
        sortBy: detectedLocality ? "nearest" : "featured"
      });
    }
  };

  return (
    <section className="site-hero relative isolate flex w-full flex-col items-center overflow-hidden" aria-labelledby="site-hero-title">
      <div className="site-hero__copy container relative z-10 flex flex-col items-center text-center">
        <h1 className="hero-title" id="site-hero-title" data-reveal>
          Move in today.<br />Feel at <em>home</em> tonight.
        </h1>

        {/* ── Minimalist Unified Hero Finder ── */}
        <form className="finder hero-finder" id="finder" onSubmit={handleSubmit} data-reveal>
          <div className="finder__search-box">
            <Search className="finder__search-icon" size={20} aria-hidden="true" />
            <input
              type="text"
              className="finder__input"
              placeholder="Find residences in South Bangalore..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (locationStatus === "success") setLocationStatus("idle");
              }}
              aria-label="Find residences in South Bangalore"
            />

            <div className="finder__gps-wrap">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className={`finder__gps-icon-btn ${isLocating ? "is-loading" : ""} ${locationStatus === "success" ? "is-success" : ""}`}
                aria-label="Detect current location"
              >
                {isLocating ? (
                  <Loader2 className="animate-spin text-blue-600" size={19} />
                ) : (
                  <LocateFixed size={19} className="finder__gps-svg" />
                )}
              </button>

              {/* On-Hover Tooltip Popup */}
              <div className="finder__gps-tooltip" role="tooltip">
                <LocateFixed size={15} className="finder__tooltip-icon" />
                <span className="finder__tooltip-text">
                  Search <strong>Near me</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <Button size="lg" type="submit" className="btn btn--blue finder__go">
            <span>Find my room</span>
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>

        {/* ── Minimal Social Proof ── */}
        <div className="hero__proof" data-reveal>
          <span className="hero__proof-item">4.8 Google rating</span>
          <i aria-hidden="true" />
          <span className="hero__proof-item">500+ happy residents</span>
          <i aria-hidden="true" />
          <span className="hero__proof-item">Zero Brokerage Guaranteed</span>
        </div>
      </div>

      <div className="site-hero__skyline pointer-events-none absolute inset-x-0 bottom-0 z-0" aria-hidden="true">
        <img
          src="/bangalore-city-landscape.svg"
          alt=""
          className="site-hero__skyline-image"
          width="2172"
          height="724"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}

export { CrowdCanvas, Skiper39 };
export default Skiper39;
