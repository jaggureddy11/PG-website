import { useState, useEffect, useRef } from "react";
import { ArrowRight, LocateFixed, Loader2, Search, X } from "lucide-react";
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

interface SearchResolution {
  status: "matched" | "unlisted" | "all";
  localityId?: string;
  searchedPlace?: string;
}

function resolveSearchQuery(query: string): SearchResolution {
  const q = query.toLowerCase().trim();
  if (!q) return { status: "all" };

  // Common generalized queries meaning all South Bangalore residences
  if (
    q === "all" ||
    q === "bangalore" ||
    q === "bengaluru" ||
    q === "south bangalore" ||
    q === "south bengaluru" ||
    q.includes("near me")
  ) {
    return { status: "all" };
  }

  // Known listed localities in South Bangalore
  if (q.includes("kumara") || q.includes("layout") || q.includes("ks layout") || q.includes("k s layout") || q.includes("dayananda") || q.includes("dsi")) {
    return { status: "matched", localityId: "kumaraswamy-layout" };
  }
  if (q.includes("uttara") || q.includes("halli") || q.includes("subramanya") || q.includes("channasandra")) {
    return { status: "matched", localityId: "uttarahalli" };
  }
  if (q.includes("banashankari") || q.includes("bsk") || q.includes("kathriguppe") || q.includes("pes")) {
    return { status: "matched", localityId: "banashankari" };
  }
  if (q.includes("padmanabha") || q.includes("padman") || q.includes("kadirenahalli")) {
    return { status: "matched", localityId: "padmanabhanagar" };
  }
  if (q.includes("jp") || q.includes("jp nagar") || q.includes("j p nagar") || q.includes("vega city") || q.includes("bannerghatta")) {
    return { status: "matched", localityId: "jp-nagar" };
  }
  if (q.includes("jaya") || q.includes("jayanagar") || q.includes("jaya nagar") || q.includes("south end")) {
    return { status: "matched", localityId: "jayanagar" };
  }

  // Any other city, town or locality where we have NO properties listed (e.g. sindhanur, whitefield, etc.)
  return { status: "unlisted", searchedPlace: query.trim() };
}

function Skiper39({ onSearch }: Skiper39Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [unlistedPlace, setUnlistedPlace] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "success" | "denied">("idle");
  const [detectedLocality, setDetectedLocality] = useState<{ id: string; name: string; distanceKm: number } | null>(null);

  // ─── Hero Heart Interactive Tap Effects ───
  const heartRef = useRef<SVGSVGElement | null>(null);
  const ambientGlowRef = useRef<HTMLDivElement | null>(null);
  const [badgeKey, setBadgeKey] = useState<number>(0);
  const [showBadge, setShowBadge] = useState<boolean>(false);

  const handleHeartTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setBadgeKey(Date.now());
    setShowBadge(true);

    // 1. Tactile GSAP bounce on heart icon
    if (heartRef.current) {
      gsap.killTweensOf(heartRef.current);
      gsap.timeline()
        .to(heartRef.current, { scale: 1.55, rotate: -14, duration: 0.14, ease: "back.out(3)" })
        .to(heartRef.current, { scale: 0.88, rotate: 8, duration: 0.12, ease: "power2.inOut" })
        .to(heartRef.current, { scale: 1, rotate: 0, duration: 0.35, ease: "elastic.out(1.2, 0.45)" });
    }

    // 2. Ambient background radial ripple
    if (ambientGlowRef.current) {
      gsap.killTweensOf(ambientGlowRef.current);
      gsap.fromTo(ambientGlowRef.current,
        { opacity: 0.85, scale: 0.3 },
        { opacity: 0, scale: 3.2, duration: 0.85, ease: "power2.out" }
      );
    }

    // 3. Spawn 16 radiant floating heart particles from tap origin
    const target = heartRef.current || (e.currentTarget as HTMLElement);
    const rect = target.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const colors = ["#FB7009", "#FF385C", "#FF6B81", "#FFA502", "#FF4757", "#003B99", "#E0245E"];
    const particleCount = 16;

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement("div");
      el.className = "hero-particle-heart";

      const size = Math.floor(14 + Math.random() * 16);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${originX}px`;
      el.style.top = `${originY}px`;

      const color = colors[Math.floor(Math.random() * colors.length)];
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      `;

      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 55 + Math.random() * 95;
      const destX = Math.cos(angle) * velocity;
      // Buoyancy bias so hearts float upward
      const destY = Math.sin(angle) * velocity - (55 + Math.random() * 85);
      const rot = -70 + Math.random() * 140;

      gsap.fromTo(el,
        { scale: 0.2, x: 0, y: 0, opacity: 1 },
        {
          scale: 1 + Math.random() * 0.4,
          x: destX,
          y: destY,
          rotation: rot,
          opacity: 0,
          duration: 0.85 + Math.random() * 0.45,
          ease: "power2.out",
          onComplete: () => {
            el.remove();
          }
        }
      );
    }
  };

  const handleDetectLocation = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please search your locality manually.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("idle");
    setUnlistedPlace(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestLocality(latitude, longitude);

        setIsLocating(false);
        setLocationStatus("success");
        setDetectedLocality(nearest);
        setSearchQuery(`Near ${nearest.name}`);

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
            locality: "all",
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

    // If GPS locality was detected and is still in query
    if (detectedLocality && searchQuery.includes(detectedLocality.name)) {
      setUnlistedPlace(null);
      if (onSearch) {
        onSearch({
          locality: detectedLocality.id,
          roomType: "any",
          userCoords: null,
          detectedLocalityInfo: detectedLocality,
          sortBy: "nearest"
        });
      }
      return;
    }

    const resolution = resolveSearchQuery(searchQuery);

    if (resolution.status === "unlisted") {
      setUnlistedPlace(resolution.searchedPlace || searchQuery.trim() || "your location");
      return;
    }

    setUnlistedPlace(null);
    if (onSearch) {
      onSearch({
        locality: resolution.status === "matched" ? (resolution.localityId || "all") : "all",
        roomType: "any",
        userCoords: null,
        detectedLocalityInfo: null,
        sortBy: "featured"
      });
    }
  };

  return (
    <section className="site-hero relative isolate flex w-full flex-col items-center overflow-hidden" aria-labelledby="site-hero-title">
      <div className="site-hero__copy container relative z-10 flex flex-col items-center text-center">
        <h1 className="hero-title" id="site-hero-title" data-reveal>
          More than a PG.<br />
          A space you actually{" "}
          <span className="inline-flex items-center whitespace-nowrap">
            <em>love</em>
            <span className="hero-heart-wrap">
            <div ref={ambientGlowRef} className="hero-heart-ambient-glow" aria-hidden="true" />
            {showBadge && (
              <span key={badgeKey} className="hero-love-pill" aria-live="polite">
                +1 Love
              </span>
            )}
            <button
              type="button"
              className="hero-heart-btn"
              onClick={handleHeartTap}
              aria-label="Tap to send love to Charla Living"
              title="Tap for love"
            >
              <svg
                ref={heartRef}
                viewBox="0 0 24 24"
                className="hero-heart-svg"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="heroHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FB7009" />
                    <stop offset="45%" stopColor="#FF385C" />
                    <stop offset="100%" stopColor="#E0245E" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="url(#heroHeartGrad)"
                />
              </svg>
            </button>
          </span>
          </span>
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
                if (unlistedPlace) setUnlistedPlace(null);
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

        {/* ── Unlisted Place Cool Notification (Matching Screenshot) ── */}
        {unlistedPlace && (
          <div className="hero-unlisted-alert" role="alert">
            <button
              type="button"
              onClick={() => setUnlistedPlace(null)}
              className="hero-unlisted-close"
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
            <h2 className="hero-unlisted-title">Sorry :(</h2>
            <p className="hero-unlisted-text">
              We don’t have any property near {unlistedPlace.toLowerCase()} at the moment
            </p>
            <button
              type="button"
              onClick={() => {
                setUnlistedPlace(null);
                if (onSearch) {
                  onSearch({
                    locality: "all",
                    roomType: "any",
                    userCoords: null,
                    sortBy: "featured"
                  });
                }
              }}
              className="hero-unlisted-btn"
            >
              <span>Explore all South Bangalore Residences</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* ── Minimal Social Proof ── */}
        <div className="hero__proof" data-reveal>
          <span className="hero__proof-item">4.8 Google rating</span>
          <i aria-hidden="true" />
          <span className="hero__proof-item">150+ happy residents</span>
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
