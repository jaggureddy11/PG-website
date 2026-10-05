import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import bannerZeroBrokerage from "@/assets/banners/charla_zero_brokerage_banner.png";
import bannerVisit from "@/assets/banners/charla_visit_banner.jpg";
import bannerFood from "@/assets/banners/charla_food_banner.jpg";

interface BannerItem {
  id: string;
  image: string;
  alt: string;
  linkHash?: string;
}

interface ResidencesBannerCarouselProps {
  onBookVisit?: () => void;
}

export function ResidencesBannerCarousel({ onBookVisit }: ResidencesBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const banners: BannerItem[] = [
    {
      id: "zero-brokerage-banner",
      image: bannerZeroBrokerage,
      alt: "Charla Living — Zero Brokerage. Move in today. Fully furnished, 100 Mbps Wi-Fi, Daily cleaning",
      linkHash: "#residences"
    },
    {
      id: "visit-banner",
      image: bannerVisit,
      alt: "Charla Living — Skip the queue, book a house visit today with priority perks",
      linkHash: "#visit"
    },
    {
      id: "food-banner",
      image: bannerFood,
      alt: "Charla Living — 4 Chef-Crafted Meals fresh daily with hygienic kitchen",
      linkHash: "#visit"
    }
  ];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleBannerClick = (banner: BannerItem) => {
    if (banner.linkHash === "#visit" && onBookVisit) {
      onBookVisit();
    } else if (banner.linkHash) {
      const targetId = banner.linkHash.replace("#", "");
      const el = document.getElementById(targetId) || document.querySelector(".residences-controls-bar");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className="residences-banner-showcase mb-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ─── Premium Rounded Banner Frame (Matches Page Cards) ─── */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,35,80,0.06)] bg-slate-50 group">
        
        {/* Banner Images Container (2.26:1 ratio) */}
        <div className="relative w-full aspect-[2.26/1] max-h-[360px] overflow-hidden">
          {banners.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner)}
                className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.006]"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            );
          })}
        </div>

        {/* ─── Frosted Rounded Navigation Chevrons ─── */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous banner"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md border border-slate-200/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next banner"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md border border-slate-200/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ─── Sleek Rolling Indicator Pills ─── */}
      <div className="flex items-center justify-center gap-2 mt-3.5">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive 
                  ? "w-8 h-2 bg-[#003b99] shadow-sm" 
                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
