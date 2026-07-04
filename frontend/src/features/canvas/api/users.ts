import { api } from "../../api/client";
import type { User } from "./types";

type permissionInput = {
  memberId: string;
  canvasId: string;
};

export const searchUsers = async (
  input: string | null,
  canvasId: string,
): Promise<User[]> => {
  return api.get(`/users/search?query=${input}&canvasId=${canvasId}`);
};

export const getMembers = async (canvasId: string): Promise<User[]> => {
  return api.get(`/canvas/${canvasId}/members`);
};

export const createPermission = async ({
  memberId,
  canvasId,
}: permissionInput): Promise<User> => {
  return api.post(`/canvas/${canvasId}/members`, { memberId });
};

export const removePermission = async ({
  memberId,
  canvasId,
}: permissionInput) => {
  return api.delete(`/canvas/${canvasId}/members/${memberId}`);
};
