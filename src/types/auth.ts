export type UserRole = 'USER' | 'ADMIN';

export type AuthUser = {
  userId: string;
  username: string;
  role: UserRole;
};
