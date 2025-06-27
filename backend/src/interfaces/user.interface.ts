export interface IUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
