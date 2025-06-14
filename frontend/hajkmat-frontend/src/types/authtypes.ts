// Define user interface
export interface User {
  id: string;
  displayName: string;
  email?: string;
}

// Define authentication context interface
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
  handleTokenAuthentication: (token: string) => Promise<boolean>;
}
