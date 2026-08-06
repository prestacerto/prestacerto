import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "./client";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface UserProfile {
  id: string;
  role: "freelancer" | "client" | "both";
  full_name: string;
  email: string;
  city?: string;
  state?: string;
  bio?: string;
  avatar_url?: string;
  contact_email?: string;
  contact_phone?: string;
  plan: "free" | "pro" | "business";
  created_at: number;
}

// Auth functions
export async function registerUser(
  email: string,
  password: string,
  full_name: string,
  role: "freelancer" | "client"
): Promise<User> {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  // Create user profile in Firestore
  const userProfile: UserProfile = {
    id: userCred.user.uid,
    email,
    full_name,
    role,
    plan: "free",
    created_at: Date.now(),
  };

  await setDoc(doc(db, "profiles", userCred.user.uid), userProfile);

  return userCred.user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

export async function logoutUser(): Promise<void> {
  return signOut(auth);
}

export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docSnap = await getDoc(doc(db, "profiles", uid));
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
}
