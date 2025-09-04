import { getApps, getApp, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "@/firebase_service_key.json";

const adminApp = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount as ServiceAccount) });

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };
