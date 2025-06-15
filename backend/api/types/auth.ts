export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  token: string;
  expiresIn: number;
}

export interface GoogleOAuthResponse {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface User {
  _id: string;
  googleId: string;
  displayName: string;
  email: string;
  picture?: string;
}
