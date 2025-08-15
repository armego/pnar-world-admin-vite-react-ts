export interface IAuthInfo {
  user: {
    email: string;
    role: string;
  },
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
