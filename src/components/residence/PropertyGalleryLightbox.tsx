import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

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
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [dragOffset, setDragOffset] = useState(0);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, items.length - 1)));
      setDragOffset(0);
      setVerticalOffset(0);
    }
  }

  // Handle body scroll locking and video cleanup
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  // Pause video on slide change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentIndex]);

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

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffset(deltaX);
      setVerticalOffset(0);
    } else if (deltaY > 0) {
      setVerticalOffset(deltaY * 0.7);
      setDragOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const duration = Date.now() - touchStartRef.current.time;

    if (verticalOffset > 90) {
      onClose();
      setIsDragging(false);
      setDragOffset(0);
      setVerticalOffset(0);
      touchStartRef.current = null;
      return;
    }

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

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const backdropOpacity = Math.max(0.4, 1 - verticalOffset / 300);

  return (
    <div
      ref={lightboxRef}
      className="charla-lightbox-root"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${backdropOpacity * 0.98})`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo gallery for ${residenceName}`}
    >
      {/* ── Top Clean Header Bar ── */}
      <header className="charla-lightbox-header">
        <div className="charla-lightbox-header__left">
          <h3 className="charla-lightbox-title">{residenceName}</h3>
          <span className="charla-lightbox-locality">PG in {residenceLocality} · Bengaluru</span>
        </div>

        <div className="charla-lightbox-header__right">
          <span className="charla-lightbox-counter-badge">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            className="charla-lightbox-close-btn"
            onClick={onClose}
            title="Close Gallery (Esc)"
            aria-label="Close photo gallery"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>
      </header>

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
            <ChevronLeft size={24} strokeWidth={2.4} />
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
            <ChevronRight size={24} strokeWidth={2.4} />
          </button>
        )}
      </main>

      {/* ── Slide Info Caption ── */}
      <div className="charla-lightbox-caption">
        <span className="charla-lightbox-caption-text">{currentItem.label}</span>
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
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
