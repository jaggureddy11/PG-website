import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { RESIDENCES } from "@/data/residences";
import {
  type ExtendedResidence,
  type VisitBooking,
  type PartnerInquiry,
  type CallbackRequest,
  subscribeToResidences,
  saveResidenceToFirestore,
  deleteResidenceFromFirestore,
  seedResidencesToFirestore,
  subscribeToVisitBookings,
  subscribeToPartnerInquiries,
  subscribeToCallbackRequests,
  saveVisitBookingToFirestore,
  savePartnerInquiryToFirestore,
  saveCallbackRequestToFirestore,
  updateCallbackRequestStatus,
  updateVisitBookingStatus,
  updatePartnerInquiryStatus,
} from "@/lib/firebase";
import { CHARLA_LOCALITIES } from "@/utils/location";
import type { ResidenceItem } from "@/components/residence/ResidencesPage";

const STORAGE_KEY = "charla_admin_residences_v4";

// Initial fallback seeds
export function getFallbackResidences(): ExtendedResidence[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          ...item,
          gender: item.gender === "female" ? "female" : item.gender === "co-living" ? "co-living" : "male",
        }));
      }
    }
  } catch (e) {
    console.error("Failed to load residences from localStorage:", e);
  }

  return Object.values(RESIDENCES).map((res) => ({
    ...res,
    status: "available",
    gender: "male",
    googleMapsUrl: "https://maps.google.com/?q=" + encodeURIComponent(`${res.name}, ${res.locality}, Bangalore`),
    videoUrl: "",
    additionalPhotos: [],
  }));
}

// Map ExtendedResidence into ResidenceItem for Listings & Map View
export function convertToResidenceItem(res: ExtendedResidence, index: number): ResidenceItem {
  const localityKey = (res.locality || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const knownLoc = CHARLA_LOCALITIES[localityKey] || CHARLA_LOCALITIES[res.id];

  // Default coordinate spreading around South Bangalore if not specified
  const baseLat = res.lat || knownLoc?.lat || (12.9100 + (index * 0.004));
  const baseLng = res.lng || knownLoc?.lng || (77.5600 + (index * 0.004));

  const houseName = res.name.includes("—") 
    ? res.name.split("—")[1].trim() 
    : res.name.replace(/^Charla Living\s*/i, "").trim() || res.name;

  const flagType: "blue" | "orange" = res.status === "fast-filling" ? "orange" : "blue";
  const flagText = res.tag || (res.status === "fast-filling" ? "Fast Filling" : res.status === "sold-out" ? "Sold Out" : "Verified Residence");

  const displayGender: "Male" | "Female" | "Unisex" = 
    res.gender === "female" ? "Female" : res.gender === "co-living" ? "Unisex" : "Male";

  const sharingTypes = res.roomTypes && res.roomTypes.length > 0
    ? res.roomTypes.map((r) => r.name.replace(/Sharing|Bed|Room/gi, "").trim() || r.name)
    : ["Single", "Double", "Triple"];

  const highlights = res.amenities && res.amenities.length > 0
    ? res.amenities.slice(0, 4).map((a) => a.title)
    : ["High-Speed Wi-Fi", "Homestyle Food", "Attached Washrooms", "Daily Housekeeping"];

  return {
    id: res.id,
    name: res.name,
    houseName,
    locality: res.locality || "Bangalore",
    localityId: localityKey || res.id,
    lat: baseLat,
    lng: baseLng,
    xPercent: 30 + ((index * 13) % 55),
    yPercent: 30 + ((index * 17) % 55),
    price: `₹${(res.startingPrice || 8500).toLocaleString("en-IN")}`,
    priceNum: res.startingPrice || 8500,
    flag: flagText,
    flagType,
    gender: displayGender,
    viewingCount: 6 + (index * 2),
    rating: "4.9",
    reviewsCount: (100 + index * 25).toString(),
    locationSnippet: res.locationDetails || res.landmark || "South Bangalore prime location",
    proximityBadge: res.landmark || knownLoc?.addressSnippet || "Near Transit",
    sharingTypes,
    highlights,
    image: res.images?.hero || res.images?.room || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80",
    alt: res.name,
  };
}

interface ResidencesContextValue {
  residences: ExtendedResidence[];
  residencesMap: Record<string, ExtendedResidence>;
  residenceItems: ResidenceItem[];
  firebaseStatus: "connecting" | "synced" | "offline";
  saveResidence: (r: ExtendedResidence) => Promise<void>;
  deleteResidence: (id: string) => Promise<void>;
  quickStatusChange: (id: string, status: "available" | "fast-filling" | "sold-out") => Promise<void>;
  visitBookings: VisitBooking[];
  partnerInquiries: PartnerInquiry[];
  callbackRequests: CallbackRequest[];
  createVisitBooking: (b: Omit<VisitBooking, "id" | "createdAt" | "status">) => Promise<string>;
  createPartnerInquiry: (p: Omit<PartnerInquiry, "id" | "createdAt" | "status">) => Promise<string>;
  createCallbackRequest: (c: Omit<CallbackRequest, "id" | "createdAt" | "status">) => Promise<string>;
  updateBookingStatus: (id: string, status: VisitBooking["status"]) => Promise<void>;
  updateInquiryStatus: (id: string, status: PartnerInquiry["status"]) => Promise<void>;
  updateCallbackStatus: (id: string, status: CallbackRequest["status"]) => Promise<void>;
}

const ResidencesContext = createContext<ResidencesContextValue | undefined>(undefined);

export const ResidencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [residences, setResidences] = useState<ExtendedResidence[]>(getFallbackResidences);
  const [firebaseStatus, setFirebaseStatus] = useState<"connecting" | "synced" | "offline">("connecting");
  const [visitBookings, setVisitBookings] = useState<VisitBooking[]>([]);
  const [partnerInquiries, setPartnerInquiries] = useState<PartnerInquiry[]>([]);
  const [callbackRequests, setCallbackRequests] = useState<CallbackRequest[]>([]);

  // 1. Subscribe to Cloud Firestore Residences in real-time
  useEffect(() => {
    let hasSeeded = false;

    const unsubscribe = subscribeToResidences(
      async (cloudResidences) => {
        if (cloudResidences && cloudResidences.length > 0) {
          setResidences(cloudResidences);
          setFirebaseStatus("synced");
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudResidences));
          } catch {
            // ignore quota errors
          }
        } else if (!hasSeeded) {
          // If Firestore is empty, seed it once with the initial properties
          hasSeeded = true;
          const initial = getFallbackResidences();
          try {
            await seedResidencesToFirestore(initial);
            setResidences(initial);
            setFirebaseStatus("synced");
          } catch (e) {
            console.warn("Failed to auto-seed to Firestore:", e);
            setFirebaseStatus("offline");
          }
        }
      },
      (err) => {
        console.warn("Realtime Firestore listener error:", err);
        setFirebaseStatus("offline");
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // 2. Subscribe to Visit Bookings in real-time
  useEffect(() => {
    const unsub = subscribeToVisitBookings((bookings) => {
      setVisitBookings(bookings);
    });
    return () => unsub();
  }, []);

  // 3. Subscribe to Partner Inquiries in real-time
  useEffect(() => {
    const unsub = subscribeToPartnerInquiries((inquiries) => {
      setPartnerInquiries(inquiries);
    });
    return () => unsub();
  }, []);

  // 4. Subscribe to Callback Requests in real-time
  useEffect(() => {
    const unsub = subscribeToCallbackRequests((requests) => {
      setCallbackRequests(requests);
    });
    return () => unsub();
  }, []);

  // Save / Update residence to Firestore + local state
  const saveResidence = async (residence: ExtendedResidence) => {
    setResidences((prev) => {
      const idx = prev.findIndex((r) => r.id === residence.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = residence;
        return next;
      }
      return [residence, ...prev];
    });

    try {
      await saveResidenceToFirestore(residence);
      setFirebaseStatus("synced");
    } catch (err) {
      console.warn("Cloud Firestore save error:", err);
    }
  };

  // Delete residence from Firestore + local state
  const deleteResidence = async (id: string) => {
    setResidences((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteResidenceFromFirestore(id);
      setFirebaseStatus("synced");
    } catch (err) {
      console.warn("Cloud Firestore delete error:", err);
    }
  };

  // Quick status toggle
  const quickStatusChange = async (id: string, status: "available" | "fast-filling" | "sold-out") => {
    const target = residences.find((r) => r.id === id);
    if (!target) return;
    const updated: ExtendedResidence = { ...target, status };
    await saveResidence(updated);
  };

  // Create booking
  const createVisitBooking = async (b: Omit<VisitBooking, "id" | "createdAt" | "status">) => {
    return await saveVisitBookingToFirestore(b);
  };

  // Create partner inquiry
  const createPartnerInquiry = async (p: Omit<PartnerInquiry, "id" | "createdAt" | "status">) => {
    return await savePartnerInquiryToFirestore(p);
  };

  // Create callback request
  const createCallbackRequest = async (c: Omit<CallbackRequest, "id" | "createdAt" | "status">) => {
    return await saveCallbackRequestToFirestore(c);
  };

  // Update status handlers
  const updateBookingStatus = async (id: string, status: VisitBooking["status"]) => {
    await updateVisitBookingStatus(id, status);
  };

  const updateInquiryStatus = async (id: string, status: PartnerInquiry["status"]) => {
    await updatePartnerInquiryStatus(id, status);
  };

  const updateCallbackStatus = async (id: string, status: CallbackRequest["status"]) => {
    await updateCallbackRequestStatus(id, status);
  };

  // Build map lookup dictionary
  const residencesMap = useMemo(() => {
    const map: Record<string, ExtendedResidence> = {};
    for (const res of residences) {
      map[res.id] = res;
    }
    return map;
  }, [residences]);

  // Build ResidenceItem array for customer listings
  const residenceItems = useMemo(() => {
    return residences.map((r, i) => convertToResidenceItem(r, i));
  }, [residences]);

  const value: ResidencesContextValue = {
    residences,
    residencesMap,
    residenceItems,
    firebaseStatus,
    saveResidence,
    deleteResidence,
    quickStatusChange,
    visitBookings,
    partnerInquiries,
    callbackRequests,
    createVisitBooking,
    createPartnerInquiry,
    createCallbackRequest,
    updateBookingStatus,
    updateInquiryStatus,
    updateCallbackStatus,
  };

  return (
    <ResidencesContext.Provider value={value}>
      {children}
    </ResidencesContext.Provider>
  );
};

export function useResidences() {
  const ctx = useContext(ResidencesContext);
  if (!ctx) {
    throw new Error("useResidences must be used within a ResidencesProvider");
  }
  return ctx;
}
