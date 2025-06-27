export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
    profileImage?: string;
    phoneNumber?: string;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
}
