import { Request } from 'express';
import { User } from '../entities/user.entity';

/**
 * Interface pour Request avec utilisateur authentifié
 */
export interface RequestWithUser extends Request {
  user: User;
}
