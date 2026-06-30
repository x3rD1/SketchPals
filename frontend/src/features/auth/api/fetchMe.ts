import { api } from "../../api/client";

export const fetchMe = async () => {
  return api.get("/auth/me");
};
