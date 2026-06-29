export type GoogleUser = {
  email: string;
  name: string;
  sub: string;
  picture?: string;
};

export type AuthUser = {
  userId: string;
  email?: string;
};

export type User = {
  id: string;
  email: string;
  googleId: string;
  name: string;
  createdAt: Date;
};
