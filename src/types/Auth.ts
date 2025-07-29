export interface User {
  id: string;
  name: string;
  email: string;
  houseNumber: string;
  rt: string;
  rw: string;
  role: 'resident' | 'admin' | 'rt_head' | 'rw_head';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface RegistrationData {
  name: string;
  email: string;
  houseNumber: string;
  rt: string;
  rw: string;
  phone: string;
  identityNumber: string; // KTP/KK
}