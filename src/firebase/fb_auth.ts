// Initializes Firebase Authentication

import { getAuth } from "firebase/auth";
import { firebaseApp } from "./fb_config";

export const auth = getAuth(firebaseApp);