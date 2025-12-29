import { useContext } from "react";
import { AuthContext } from "../jsx/AuthContext";

export function useAuth() {
  return useContext(AuthContext);
}
