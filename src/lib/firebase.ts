import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
export const auth = getAuth(app);
export const storage = getStorage(app);

// Configure storage retry limits to prevent default 10-minute exponential backoff on unprovisioned buckets
try {
  (storage as unknown as { _maxUploadRetryTime?: number })._maxUploadRetryTime = 2500;
  (storage as unknown as { _maxOperationRetryTime?: number })._maxOperationRetryTime = 2500;
} catch {
  // ignore
}

/**
 * Cache storage availability to prevent repeated network timeout waits on subsequent uploads
 */
let isCloudStorageAvailable: boolean | null = null;

/**
 * Client-side input sanitization helpers
 */
export function sanitizeText(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/[<>]/g, "");
}

export function sanitizePhoneNumber(phone?: string): string {
  if (!phone) return "";
  return phone.trim().replace(/[^\d+]/g, "");
}

/**
 * Safely convert an image file to a compressed base64 data URI (guarantees persistence across devices)
 * Resizes large phone photos (e.g. 48MP) to 1080px max-width in ~100ms for instant saving.
 */
export async function fileToOptimizedDataUrl(file: File, maxWidth = 1080, quality = 0.76): Promise<string> {
  if (file.type.startsWith("video/")) {
    if (file.size > 1024 * 900) {
      throw new Error(
        "Local video file is too large for database storage. Cloud Firestore limits documents to 1MB. Please enable Firebase Storage in the Firebase Console or paste an external video link."
      );
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image or video to Firebase Cloud Storage with fast fallback to optimized inline data URI.
 * Avoids the default 10-minute Firebase Storage retry loop if the storage bucket is not yet provisioned.
 */
export async function uploadMediaFile(file: File, folder = "residences"): Promise<string> {
  // If we already know cloud storage is not provisioned or failed, use instant fast-path
  if (isCloudStorageAvailable !== false) {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${folder}/${Date.now()}_${cleanName}`;
    const storageRef = ref(storage, filename);
    try {
      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Storage timeout - bucket unprovisioned")), 2500)
      );
      const snap = await Promise.race([uploadPromise, timeoutPromise]);
      const url = await getDownloadURL(snap.ref);
      isCloudStorageAvailable = true;
      return url;
    } catch (err) {
      isCloudStorageAvailable = false;
      console.warn("Cloud Storage unconfigured or timed out, falling back to fast optimized inline URI:", err);
    }
  }

  return await fileToOptimizedDataUrl(file);
}

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
    name: sanitizeText(booking.name),
    phone: sanitizePhoneNumber(booking.phone),
    residenceName: sanitizeText(booking.residenceName),
    timeSlot: sanitizeText(booking.timeSlot),
    date: sanitizeText(booking.date),
    tourType: booking.tourType === "video" ? "video" : "in-person",
    sharingType: sanitizeText(booking.sharingType || "Standard"),
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
    fullName: sanitizeText(inquiry.fullName),
    phone: sanitizePhoneNumber(inquiry.phone),
    email: sanitizeText(inquiry.email),
    propertyType: sanitizeText(inquiry.propertyType),
    locality: sanitizeText(inquiry.locality),
    roomCount: sanitizeText(inquiry.roomCount),
    note: sanitizeText(inquiry.note),
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
    name: sanitizeText(callback.name),
    phone: sanitizePhoneNumber(callback.phone),
    locality: sanitizeText(callback.locality),
    residenceName: sanitizeText(callback.residenceName),
    source: sanitizeText(callback.source || "Website Callback"),
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

export const ADMIN_CREDENTIALS_COLLECTION = "admin_credentials";

export interface AdminCredentialDoc {
  username?: string;
  phone?: string;
  password?: string;
  role?: string;
  updatedAt?: string;
}

/**
 * Safely sign out admin from Firebase Auth
 */
export async function signOutAdmin(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.warn("Firebase sign out note:", err);
  }
}

/**
 * Listen to Firebase Auth state changes
 */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Verify admin credentials against Firebase Auth, environment variables, or fallback store.
 * Supports login via Email, Username, or Registered Phone.
 */
export async function verifyAdminCredentials(
  identifier: string,
  passwordAttempt: string
): Promise<{ success: boolean; error?: string; username?: string; firebaseUser?: User }> {
  const trimmedId = identifier.trim();
  const trimmedPass = passwordAttempt.trim();

  if (!trimmedId || !trimmedPass) {
    return { success: false, error: "Please enter both identifier (username/phone/email) and password." };
  }

  // 1. Try Firebase Authentication if an email format is supplied
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId);
  if (isEmail) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, trimmedId, trimmedPass);
      return {
        success: true,
        username: userCred.user.displayName || userCred.user.email || trimmedId,
        firebaseUser: userCred.user,
      };
    } catch (fbErr: unknown) {
      const errCode = (fbErr as { code?: string })?.code;
      if (errCode === "auth/invalid-credential" || errCode === "auth/wrong-password") {
        return { success: false, error: "Invalid password for this account." };
      }
      // If Firebase Auth is not yet provisioned, proceed seamlessly to credentials verification
    }
  }

  // 2. Check against Environment variables (.env)
  const envUsername = (import.meta.env.VITE_ADMIN_USERNAME || "admin").toString().trim().toLowerCase();
  const envPhone = (import.meta.env.VITE_ADMIN_PHONE || "8884446093").toString().trim().replace(/\D/g, "");
  const envPassword = (import.meta.env.VITE_ADMIN_PASSWORD || "CharlaAdmin@2026").toString().trim();

  const inputRawLower = trimmedId.toLowerCase();
  const inputDigits = trimmedId.replace(/\D/g, "");

  const matchesEnvUsername = inputRawLower === envUsername;
  const matchesEnvPhone =
    Boolean(envPhone) &&
    (inputDigits === envPhone ||
      (inputDigits.length >= 10 && inputDigits.endsWith(envPhone)) ||
      (envPhone.length >= 10 && envPhone.endsWith(inputDigits)));

  if ((matchesEnvUsername || matchesEnvPhone) && trimmedPass === envPassword) {
    return {
      success: true,
      username: matchesEnvUsername ? envUsername : `Admin (${envPhone})`,
    };
  }

  return { success: false, error: "Invalid username/phone number or password." };
}

