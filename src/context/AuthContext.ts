import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | undefined>(undefined);