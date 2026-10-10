import { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExternalLink, RotateCcw } from "lucide-react";

export interface MapResidencePoint {
  id: string;
  name: string;
  houseName?: string;
  locality: string;
  price: string;
  priceNum: number;
  lat: number;
  lng: number;
  xPercent?: number;
  yPercent?: number;
}

interface ResidencesMapViewProps {
  residences: MapResidencePoint[];
  selectedId: string | null;
  onSelectResidence: (id: string) => void;
  userCoords?: { lat: number; lng: number } | null;
}

const DEFAULT_CENTER: [number, number] = [12.9187, 77.5645];
const DEFAULT_ZOOM = 13;

export function ResidencesMapView({
  residences,
  selectedId,
  onSelectResidence,
}: ResidencesMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelectResidence);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    onSelectRef.current = onSelectResidence;
    selectedIdRef.current = selectedId;
  }, [onSelectResidence, selectedId]);

  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  const effectiveActiveId = hoveredPinId || selectedId;
  const activeResidence = useMemo(() => {
    if (!effectiveActiveId) return null;
    return residences.find((r) => r.id === effectiveActiveId) || null;
  }, [residences, effectiveActiveId]);

  // Helper to construct custom HTML DivIcon (Visually minimal, user-friendly price pill)
  const createCustomIcon = (res: MapResidencePoint, isLit: boolean) => {
    return L.divIcon({
      className: `charla-leaflet-pin-wrap ${isLit ? "is-lit" : ""}`,
      html: `
        <div class="charla-map-pin ${isLit ? "is-lit" : ""}">
          <div class="charla-map-pin-pill">
            <span>${res.price}</span>
          </div>
          <div class="charla-map-pin-arrow"></div>
        </div>
      `,
      iconSize: [68, 34],
      iconAnchor: [34, 32],
      popupAnchor: [0, -30],
    });
  };

  // Initialize realistic Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    // Realistic Google Maps tiles in Leaflet
    L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(map);

    // Zoom controls in bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;

    // Responsive redraw: immediately adapt when toggling between List and Map on mobile
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when residences list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    residences.forEach((res, idx) => {
      const isLit = res.id === selectedIdRef.current;
      const marker = L.marker([res.lat, res.lng], {
        icon: createCustomIcon(res, isLit),
        zIndexOffset: isLit ? 1000 : 100 + idx,
      });

      // Bind sleek tooltip
      marker.bindTooltip(
        `<div class="charla-leaflet-tip">
          <strong>${res.houseName || res.name}</strong>
          <span class="tip-loc">${res.locality}</span>
        </div>`,
        {
          direction: "top",
          offset: [0, -32],
          className: "charla-tip-popup",
          permanent: false,
        }
      );

      marker.on("click", () => {
        onSelectRef.current(res.id);
        map.flyTo([res.lat, res.lng], 15, { animate: true, duration: 0.5 });
      });

      marker.on("mouseover", () => {
        setHoveredPinId(res.id);
        marker.openTooltip();
      });

      marker.on("mouseout", () => {
        setHoveredPinId(null);
        if (res.id !== selectedIdRef.current) {
          marker.closeTooltip();
        }
      });

      marker.addTo(map);
      markersRef.current.set(res.id, marker);
    });
  }, [residences]);

  // Handle active residence change (Hover / selection)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    residences.forEach((res, idx) => {
      const marker = markersRef.current.get(res.id);
      if (!marker) return;

      const isLit = res.id === effectiveActiveId;
      marker.setIcon(createCustomIcon(res, isLit));
      marker.setZIndexOffset(isLit ? 1000 : 100 + idx);

      if (isLit) {
        marker.openTooltip();
      } else if (!hoveredPinId) {
        marker.closeTooltip();
      }
    });

    if (activeResidence) {
      const container = mapContainerRef.current;
      const hasSize = container && container.offsetWidth > 0 && container.offsetHeight > 0;
      const isValidCoords =
        typeof activeResidence.lat === "number" &&
        !isNaN(activeResidence.lat) &&
        typeof activeResidence.lng === "number" &&
        !isNaN(activeResidence.lng);

      if (hasSize && isValidCoords) {
        try {
          map.flyTo([activeResidence.lat, activeResidence.lng], 15, {
            animate: true,
            duration: 0.6,
          });
        } catch {
          // Gracefully fallback if animated transition interrupted
        }
      }
    }
  }, [effectiveActiveId, activeResidence, residences, hoveredPinId]);

  const handleResetOverview = () => {
    setHoveredPinId(null);
    const map = mapInstanceRef.current;
    const container = mapContainerRef.current;
    if (map && container && container.offsetWidth > 0) {
      try {
        map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
          animate: true,
          duration: 0.6,
        });
      } catch {
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      }
    }
  };

  const directionsUrl = activeResidence
    ? `https://www.google.com/maps/dir/?api=1&destination=${activeResidence.lat},${activeResidence.lng}`
    : `https://www.google.com/maps/search/?api=1&query=Charla+Living+Bengaluru`;

  return (
    <div className="mapwrap in-view relative w-full h-[480px] sm:h-[560px] lg:h-[calc(100vh-110px)] min-h-[440px] lg:min-h-[760px] lg:max-h-[960px] rounded-2xl lg:rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-[#E9EDF2] select-none">
      {/* ─── Leaflet Map Container ─── */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ─── Top-Right Minimal Controls ─── */}
      <div className="absolute top-3.5 right-3.5 z-[1000] flex items-center gap-2">
        <button
          type="button"
          onClick={handleResetOverview}
          className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-[#003B99] border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          title="Reset to South Bangalore overview"
        >
          <RotateCcw size={13} className="text-slate-500" />
          <span>Overview</span>
        </button>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-[#003B99] border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          title="Open in Google Maps"
        >
          <ExternalLink size={13} className="text-slate-500" />
          <span>Directions</span>
        </a>
      </div>

      {/* ─── Bottom-Left Locality Quick-Pills ─── */}
      <div className="absolute bottom-3.5 left-3.5 z-[1000] hidden sm:flex items-center gap-1.5 flex-wrap max-w-[85%] pointer-events-none">
        {residences.map((res) => {
          const isActive = res.id === effectiveActiveId;
          return (
            <button
              key={res.id}
              type="button"
              onClick={() => {
                onSelectResidence(res.id);
                mapInstanceRef.current?.flyTo([res.lat, res.lng], 15, { animate: true, duration: 0.5 });
              }}
              className={`pointer-events-auto text-[11px] font-semibold px-2.5 py-1 rounded-xl shadow-sm border transition-all ${
                isActive
                  ? "bg-[#FB7009] text-white border-[#FB7009] shadow-md scale-105"
                  : "bg-white/95 text-slate-700 border-slate-200 hover:bg-white hover:text-[#003B99]"
              }`}
            >
              {res.locality}
            </button>
          );
        })}
      </div>
    </div>
  );
}
