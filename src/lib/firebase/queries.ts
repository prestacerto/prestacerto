import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  QueryConstraint,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./client";
import { COLLECTIONS } from "./firestore-schema";
import type {
  Service,
  Project,
  Proposal,
  Message,
  Category,
  ProjectContact,
} from "./firestore-schema";

// ============================================================
// CATEGORIES
// ============================================================

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      orderBy("sort_order", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// ============================================================
// SERVICES
// ============================================================

export async function listServices(
  categoryId?: string
): Promise<Service[]> {
  try {
    const constraints: QueryConstraint[] = [where("is_active", "==", true)];
    if (categoryId) {
      constraints.push(where("category_id", "==", categoryId));
    }
    constraints.push(orderBy("created_at", "desc"));

    const q = query(collection(db, COLLECTIONS.SERVICES), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.SERVICES, id));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Service) : null;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}

export async function getMyServices(freelancerId: string): Promise<Service[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.SERVICES),
      where("freelancer_id", "==", freelancerId),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];
  } catch (error) {
    console.error("Error fetching my services:", error);
    return [];
  }
}

export async function createService(data: Omit<Service, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.SERVICES, id), data);
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

// ============================================================
// PROJECTS
// ============================================================

export async function listProjects(categoryId?: string): Promise<Project[]> {
  try {
    const constraints: QueryConstraint[] = [where("status", "==", "open")];
    if (categoryId) {
      constraints.push(where("category_id", "==", categoryId));
    }
    constraints.push(orderBy("created_at", "desc"));

    const q = query(collection(db, COLLECTIONS.PROJECTS), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.PROJECTS, id));
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Project) : null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function getMyProjects(clientId: string): Promise<Project[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where("client_id", "==", clientId),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error) {
    console.error("Error fetching my projects:", error);
    return [];
  }
}

export async function createProject(data: Omit<Project, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.PROJECTS, id), data);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

// ============================================================
// PROPOSALS
// ============================================================

export async function getProposalsForProject(projectId: string): Promise<Proposal[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROPOSALS),
      where("project_id", "==", projectId),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Proposal[];
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return [];
  }
}

export async function getMyProposals(freelancerId: string): Promise<Proposal[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROPOSALS),
      where("freelancer_id", "==", freelancerId),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Proposal[];
  } catch (error) {
    console.error("Error fetching my proposals:", error);
    return [];
  }
}

export async function createProposal(data: Omit<Proposal, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROPOSALS), data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
}

export async function updateProposal(id: string, data: Partial<Proposal>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.PROPOSALS, id), data);
  } catch (error) {
    console.error("Error updating proposal:", error);
    throw error;
  }
}

// ============================================================
// MESSAGES
// ============================================================

export async function getMessagesForProposal(proposalId: string): Promise<Message[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where("proposal_id", "==", proposalId),
      orderBy("created_at", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function createMessage(data: Omit<Message, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), data);
    return docRef.id;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

// ============================================================
// PROJECT CONTACTS (Conditional Reveal)
// ============================================================

export async function getProjectContact(
  projectId: string
): Promise<ProjectContact | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.PROJECT_CONTACTS, projectId));
    return docSnap.exists() ? (docSnap.data() as ProjectContact) : null;
  } catch (error) {
    console.error("Error fetching project contact:", error);
    return null;
  }
}

export async function createProjectContact(
  projectId: string,
  data: Omit<ProjectContact, "project_id">
): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.PROJECT_CONTACTS, projectId), {
      project_id: projectId,
      ...data,
    });
  } catch (error) {
    console.error("Error creating project contact:", error);
    throw error;
  }
}

// ============================================================
// HELPER: Get Proposal + Thread Info
// ============================================================

export async function getProposalThreadInfo(proposalId: string) {
  try {
    const proposalDoc = await getDoc(doc(db, COLLECTIONS.PROPOSALS, proposalId));
    if (!proposalDoc.exists()) return null;

    const proposal = { id: proposalDoc.id, ...proposalDoc.data() } as Proposal;
    const messages = await getMessagesForProposal(proposalId);

    return { proposal, messages };
  } catch (error) {
    console.error("Error fetching proposal thread:", error);
    return null;
  }
}
