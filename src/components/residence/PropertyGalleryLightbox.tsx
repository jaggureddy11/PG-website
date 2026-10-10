import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  CalendarCheck,
  MessageCircle,
  Eye,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";

export interface GalleryMediaItem {
  id: string;
  src: string;
  label: string;
  category: "all" | "bedroom" | "lounge" | "dining" | "washroom" | "exterior" | "video";
  type: "image" | "video";
  thumbnail?: string;
}

export interface PropertyGalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  residenceName: string;
  residenceLocality: string;
  items: GalleryMediaItem[];
  initialIndex?: number;
  onScheduleVisit?: () => void;
  onWhatsAppInquiry?: () => void;
}

export const PropertyGalleryLightbox: React.FC<PropertyGalleryLightboxProps> = ({
  isOpen,
  onClose,
  residenceName,
  residenceLocality,
  items,
  initialIndex = 0,
  onScheduleVisit,
  onWhatsAppInquiry,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dragOffset, setDragOffset] = useState(0);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  // Sync initialIndex when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, items.length - 1)));
      setDragOffset(0);
      setVerticalOffset(0);
      setSelectedCategory("all");
      // Prevent body scrolling
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex, items.length]);

  // Pause video on slide change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentIndex]);

  // Filtered items based on category
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category && item.category !== "all") {
        set.add(item.category);
      }
    });
    return Array.from(set);
  }, [items]);

  const categoryLabels: Record<string, string> = {
    bedroom: "Bedrooms & Suites",
    lounge: "Lounge & Community",
    dining: "Dining & Kitchen",
    washroom: "Bathrooms",
    exterior: "Terrace & Facade",
    video: "Video Tour",
  };

  // Navigate functions
  const goToNext = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setDragOffset(0);
    setVerticalOffset(0);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setDragOffset(0);
    setVerticalOffset(0);
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (!isOpen) return;
    const activeThumb = thumbnailRefs.current[currentIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex, isOpen]);

  // Touch Handlers for Mobile Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Detect if primary direction is horizontal swipe or downward pull-to-dismiss
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffset(deltaX);
      setVerticalOffset(0);
    } else if (deltaY > 0) {
      // Pull down to dismiss
      setVerticalOffset(deltaY * 0.7);
      setDragOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const duration = Date.now() - touchStartRef.current.time;

    // Pull down to dismiss check
    if (verticalOffset > 90) {
      onClose();
      setIsDragging(false);
      setDragOffset(0);
      setVerticalOffset(0);
      touchStartRef.current = null;
      return;
    }

    // Horizontal swipe check: threshold is 45px or rapid flick within 250ms
    const flickThreshold = duration < 250 && Math.abs(dragOffset) > 25;
    const distanceThreshold = Math.abs(dragOffset) > 45;

    if (flickThreshold || distanceThreshold) {
      if (dragOffset < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setVerticalOffset(0);
    touchStartRef.current = null;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const backdropOpacity = Math.max(0.4, 1 - verticalOffset / 300);

  return (
    <div
      ref={lightboxRef}
      className="charla-lightbox-root"
      style={{
        backgroundColor: `rgba(10, 15, 29, ${backdropOpacity * 0.98})`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo gallery for ${residenceName}`}
    >
      {/* ── Top Navigation Bar ── */}
      <header className="charla-lightbox-header">
        <div className="charla-lightbox-header__left">
          <div className="charla-lightbox-brand-pill">
            <Sparkles size={13} className="text-orange-400" />
            <span className="charla-lightbox-brand-text">Verified PG Walkthrough</span>
          </div>
          <div className="charla-lightbox-title-box">
            <h3 className="charla-lightbox-title">{residenceName}</h3>
            <span className="charla-lightbox-locality">PG in {residenceLocality} · Bengaluru</span>
          </div>
        </div>

        <div className="charla-lightbox-header__right">
          {/* Schedule Visit Action */}
          {onScheduleVisit && (
            <button
              type="button"
              className="charla-lightbox-cta-btn charla-lightbox-cta-btn--visit"
              onClick={() => {
                onScheduleVisit();
                onClose();
              }}
              title="Schedule a visit to this residence"
            >
              <CalendarCheck size={14} />
              <span>Schedule Visit</span>
            </button>
          )}

          {/* WhatsApp Direct Chat Action */}
          {onWhatsAppInquiry && (
            <button
              type="button"
              className="charla-lightbox-cta-btn charla-lightbox-cta-btn--wa"
              onClick={() => {
                onWhatsAppInquiry();
              }}
              title="Chat with property manager on WhatsApp"
            >
              <MessageCircle size={14} />
              <span className="charla-lightbox-cta-btn__text">WhatsApp</span>
            </button>
          )}

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            className="charla-lightbox-icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          {/* Close Lightbox Button */}
          <button
            type="button"
            className="charla-lightbox-icon-btn charla-lightbox-icon-btn--close"
            onClick={onClose}
            title="Close Gallery (Esc)"
            aria-label="Close photo gallery"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* ── Category Filter Pills ── */}
      {categories.length > 1 && (
        <nav className="charla-lightbox-categories" aria-label="Photo categories">
          <button
            type="button"
            className={`charla-lightbox-cat-pill ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            All Photos ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((it) => it.category === cat).length;
            const firstIdx = items.findIndex((it) => it.category === cat);
            return (
              <button
                key={cat}
                type="button"
                className={`charla-lightbox-cat-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (firstIdx !== -1) {
                    setCurrentIndex(firstIdx);
                  }
                }}
              >
                {categoryLabels[cat] || cat} ({count})
              </button>
            );
          })}
        </nav>
      )}

      {/* ── Main Media Display Stage (Touch Area) ── */}
      <main
        className="charla-lightbox-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Desktop Prev Button */}
        {items.length > 1 && (
          <button
            type="button"
            className="charla-lightbox-nav charla-lightbox-nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={26} strokeWidth={2.4} />
          </button>
        )}

        {/* Media Container with smooth swipe drag transform */}
        <div
          className="charla-lightbox-media-wrapper"
          style={{
            transform: `translate3d(${dragOffset}px, ${verticalOffset}px, 0)`,
            transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {currentItem.type === "video" ? (
            <div className="charla-lightbox-video-frame">
              <video
                ref={videoRef}
                src={currentItem.src}
                controls
                playsInline
                autoPlay
                className="charla-lightbox-video"
                title={`${residenceName} - ${currentItem.label}`}
              />
              <div className="charla-lightbox-video-badge">
                <Play size={12} fill="currentColor" />
                <span>Video Walkthrough</span>
              </div>
            </div>
          ) : (
            <div className="charla-lightbox-img-frame">
              {!imgLoaded[currentIndex] && (
                <div className="charla-lightbox-loader">
                  <div className="charla-lightbox-spinner" />
                </div>
              )}
              <img
                src={currentItem.src}
                alt={`${residenceName} - ${currentItem.label}`}
                className={`charla-lightbox-img ${imgLoaded[currentIndex] ? "is-loaded" : ""}`}
                onLoad={() => setImgLoaded((prev) => ({ ...prev, [currentIndex]: true }))}
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* Desktop Next Button */}
        {items.length > 1 && (
          <button
            type="button"
            className="charla-lightbox-nav charla-lightbox-nav--next"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={26} strokeWidth={2.4} />
          </button>
        )}
      </main>

      {/* ── Slide Info Overlay & Counter ── */}
      <div className="charla-lightbox-info-bar">
        <div className="charla-lightbox-info-details">
          <span className="charla-lightbox-counter">
            {currentIndex + 1} / {items.length}
          </span>
          <span className="charla-lightbox-label">{currentItem.label}</span>
        </div>

        <div className="charla-lightbox-swipe-hint">
          <Eye size={12} />
          <span>Swipe left / right to browse · Pull down to close</span>
        </div>
      </div>

      {/* ── Bottom Filmstrip Thumbnails Ribbon ── */}
      <footer className="charla-lightbox-thumbnails" aria-label="Photo filmstrip">
        <div className="charla-lightbox-thumbnails-scroll">
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id || idx}
                ref={(el) => {
                  thumbnailRefs.current[idx] = el;
                }}
                type="button"
                className={`charla-lightbox-thumb ${isActive ? "is-active" : ""}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setDragOffset(0);
                  setVerticalOffset(0);
                }}
                aria-label={`Jump to ${item.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                <img
                  src={item.thumbnail || item.src}
                  alt={item.label}
                  loading="lazy"
                  draggable={false}
                />
                {item.type === "video" && (
                  <div className="charla-lightbox-thumb-video-icon">
                    <Play size={10} fill="#fff" stroke="none" />
                  </div>
                )}
                <span className="charla-lightbox-thumb-idx">{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
