import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  addDoc,
  updateDoc,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import type { Residence } from "@/data/residences";

export interface ExtendedResidence extends Residence {
  status?: "available" | "fast-filling" | "sold-out";
  gender?: "male" | "female" | "co-living";
  googleMapsUrl?: string;
  videoUrl?: string;
  additionalPhotos?: string[];
  lat?: number;
  lng?: number;
}

export interface VisitBooking {
  id?: string;
  residenceId: string;
  residenceName: string;
  tourType: "in-person" | "video";
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  sharingType?: string;
  status: "new" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface PartnerInquiry {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  propertyType: string;
  locality: string;
  roomCount: string;
  note?: string;
  status: "new" | "contacted" | "approved" | "archived";
  createdAt: string;
}

export interface CallbackRequest {
  id?: string;
  name: string;
  phone: string;
  locality: string;
  residenceId?: string;
  residenceName?: string;
  source?: string;
  status: "new" | "contacted" | "scheduled" | "closed";
  createdAt: string;
}

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "charla-c31b2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "charla-c31b2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "charla-c31b2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

export const RESIDENCES_COLLECTION = "residences";
export const BOOKINGS_COLLECTION = "visit_bookings";
export const PARTNER_COLLECTION = "partner_inquiries";

/**
 * Real-time subscription to residences
 */
export function subscribeToResidences(
  onUpdate: (residences: ExtendedResidence[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, RESIDENCES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const data = snapshot.docs.map((d) => d.data() as ExtendedResidence);
      onUpdate(data);
    },
    (err) => {
      console.warn("Firestore residences snapshot error:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch all residences from Cloud Firestore
 */
export async function getResidencesFromFirestore(): Promise<ExtendedResidence[]> {
  const colRef = collection(db, RESIDENCES_COLLECTION);
  const snapshot = await getDocs(colRef);
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((docSnap) => docSnap.data() as ExtendedResidence);
}

/**
 * Save or update a single residence in Cloud Firestore
 */
export async function saveResidenceToFirestore(residence: ExtendedResidence): Promise<void> {
  const docRef = doc(db, RESIDENCES_COLLECTION, residence.id);
  await setDoc(docRef, residence, { merge: true });
}

/**
 * Delete a residence by ID from Cloud Firestore
 */
export async function deleteResidenceFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, RESIDENCES_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Seed initial properties to Firestore in a batch
 */
export async function seedResidencesToFirestore(residences: ExtendedResidence[]): Promise<void> {
  const batch = writeBatch(db);
  for (const res of residences) {
    const docRef = doc(db, RESIDENCES_COLLECTION, res.id);
    batch.set(docRef, res, { merge: true });
  }
  await batch.commit();
}

/**
 * Save customer visit/tour booking to Firestore
 */
export async function saveVisitBookingToFirestore(
  booking: Omit<VisitBooking, "id" | "createdAt" | "status"> & {
    status?: VisitBooking["status"];
    createdAt?: string;
  }
): Promise<string> {
  const colRef = collection(db, BOOKINGS_COLLECTION);
  const docData: VisitBooking = {
    ...booking,
    status: booking.status || "new",
    createdAt: booking.createdAt || new Date().toISOString(),
  };
  const docRef = await addDoc(colRef, docData);
  return docRef.id;
}

/**
 * Subscribe to visit bookings in real-time
 */
export function subscribeToVisitBookings(
  onUpdate: (bookings: VisitBooking[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, BOOKINGS_COLLECTION);
  const q = query(colRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const bookings = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as VisitBooking)
      );
      onUpdate(bookings);
    },
    (err) => {
      console.warn("Firestore bookings snapshot error:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Update booking status
 */
export async function updateVisitBookingStatus(
  id: string,
  status: VisitBooking["status"]
): Promise<void> {
  const docRef = doc(db, BOOKINGS_COLLECTION, id);
  await updateDoc(docRef, { status });
}

/**
 * Save partner application to Firestore
 */
export async function savePartnerInquiryToFirestore(
  inquiry: Omit<PartnerInquiry, "id" | "createdAt" | "status"> & {
    status?: PartnerInquiry["status"];
    createdAt?: string;
  }
): Promise<string> {
  const colRef = collection(db, PARTNER_COLLECTION);
  const docData: PartnerInquiry = {
    ...inquiry,
    status: inquiry.status || "new",
    createdAt: inquiry.createdAt || new Date().toISOString(),
  };
  const docRef = await addDoc(colRef, docData);
  return docRef.id;
}

/**
 * Subscribe to partner inquiries in real-time
 */
export function subscribeToPartnerInquiries(
  onUpdate: (inquiries: PartnerInquiry[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, PARTNER_COLLECTION);
  const q = query(colRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const inquiries = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as PartnerInquiry)
      );
      onUpdate(inquiries);
    },
    (err) => {
      console.warn("Firestore partner snapshot error:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Update partner inquiry status
 */
export async function updatePartnerInquiryStatus(
  id: string,
  status: PartnerInquiry["status"]
): Promise<void> {
  const docRef = doc(db, PARTNER_COLLECTION, id);
  await updateDoc(docRef, { status });
}

/* ─────────────────────────────────────────────────────────────
 * CALLBACK REQUESTS API (Cloud Firestore)
 * ───────────────────────────────────────────────────────────── */
const CALLBACK_COLLECTION = "callback_requests";

/**
 * Save customer callback request to Firestore
 */
export async function saveCallbackRequestToFirestore(
  callback: Omit<CallbackRequest, "id" | "createdAt" | "status"> & {
    status?: CallbackRequest["status"];
    createdAt?: string;
  }
): Promise<string> {
  const colRef = collection(db, CALLBACK_COLLECTION);
  const docData: CallbackRequest = {
    ...callback,
    status: callback.status || "new",
    createdAt: callback.createdAt || new Date().toISOString(),
  };
  const docRef = await addDoc(colRef, docData);
  return docRef.id;
}

/**
 * Subscribe to callback requests in real-time
 */
export function subscribeToCallbackRequests(
  onUpdate: (requests: CallbackRequest[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, CALLBACK_COLLECTION);
  const q = query(colRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const requests = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as CallbackRequest)
      );
      onUpdate(requests);
    },
    (err) => {
      console.warn("Firestore callback snapshot error:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Update callback request status
 */
export async function updateCallbackRequestStatus(
  id: string,
  status: CallbackRequest["status"]
): Promise<void> {
  const docRef = doc(db, CALLBACK_COLLECTION, id);
  await updateDoc(docRef, { status });
}

