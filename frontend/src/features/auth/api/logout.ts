import { api } from "../../api/client";

export const logout = async () => {
  return api.post("/auth/logout");
};
