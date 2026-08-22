// Initializes Firestore

import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./fb_config";

export const db = getFirestore(firebaseApp);