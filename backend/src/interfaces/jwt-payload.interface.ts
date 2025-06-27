export interface JwtPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
}
