import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import bannerComfortablePgs from "@/assets/banners/banner_comfortable_pgs.webp";
import bannerBetterLiving from "@/assets/banners/banner_better_living.webp";
import bannerPreferredLocation from "@/assets/banners/banner_preferred_location.webp";

interface BannerItem {
  id: string;
  image: string;
  alt: string;
  bgColor: string;
  linkHash?: string;
}

interface ResidencesBannerCarouselProps {
  onBookVisit?: () => void;
}

export function ResidencesBannerCarousel({ onBookVisit }: ResidencesBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);

  const banners: BannerItem[] = [
    {
      id: "comfortable-pgs",
      image: bannerComfortablePgs,
      alt: "Comfortable PGs for a Better Tomorrow — Clean rooms, Safe spaces, Great locations",
      bgColor: "#FDF9F2",
      linkHash: "#residences"
    },
    {
      id: "better-living",
      image: bannerBetterLiving,
      alt: "More than a Room, A Better Living Experience — Nutritious Meals, Laundry Service, Housekeeping, Community",
      bgColor: "#F8F8FD",
      linkHash: "#visit"
    },
    {
      id: "preferred-location",
      image: bannerPreferredLocation,
      alt: "Find the Right PG in Your Preferred Location — Close to colleges, offices and transit points",
      bgColor: "#F3FAF5",
      linkHash: "#residences"
    }
  ];

  const totalBanners = banners.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  }, [totalBanners]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  }, [totalBanners]);

  // Rolling autoplay every 4.5 seconds
  useEffect(() => {
    if (isPaused || isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, isDragging, nextSlide]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = currentXRef.current - startXRef.current;
    if (diff < -50) {
      nextSlide();
    } else if (diff > 50) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
    setIsPaused(false);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    currentXRef.current = e.clientX;
    const diff = currentXRef.current - startXRef.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const diff = currentXRef.current - startXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
    setIsPaused(false);
  };

  const handleBannerClick = (banner: BannerItem) => {
    // Only register click if not dragging
    if (Math.abs(dragOffset) > 8) return;

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
      className="residences-banner-showcase mb-10 md:mb-12 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsPaused(false);
      }}
    >
      {/* ─── Premium Rounded Banner Rolling Frame ─── */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,35,80,0.06)] bg-white group cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Rolling Horizontal Track Container */}
        <div
          className={`flex w-full ${isDragging ? "" : "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"}`}
          style={{
            transform: isDragging
              ? `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
              : `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {banners.map((banner, index) => {
            return (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner)}
                className="w-full flex-shrink-0 relative overflow-hidden flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: banner.bgColor }}
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                  draggable={false}
                  className="w-full h-auto max-h-[220px] md:max-h-[260px] object-contain pointer-events-none transform transition-transform duration-700 group-hover:scale-[1.006]"
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
            prevSlide();
          }}
          aria-label="Previous banner"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next banner"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ─── Big Pagination Dots ─── */}
      <div className="flex items-center justify-center gap-3.5 mt-5 md:mt-6">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-115 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003b99]"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-3.5 h-3.5 bg-[#003b99] ring-4 ring-[#003b99]/20 shadow-sm"
                    : "w-3 h-3 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
