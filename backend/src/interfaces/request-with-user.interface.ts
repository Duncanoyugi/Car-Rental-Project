import { IUser } from './user.interface';

export interface RequestWithUser {
  user: Pick<IUser, 'id' | 'email' | 'role'>;
}
