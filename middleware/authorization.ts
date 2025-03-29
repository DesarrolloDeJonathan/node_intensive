import type { ServerResponse } from 'http';
import type { AuthenticatedRequest } from './authentication';
import type { User } from '../models';

/**
 * Middleware to authorize user roles.
 * 
 * @param {...string[]} roles - The roles that are allowed to access the resource.
 * @returns {Function} - An asynchronous middleware function that checks the user's role.
 */
export const authorizeRoles = (...roles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: ServerResponse, 
  ): Promise<boolean> => {
    const userRole = (req.user as User).role;

    if (!userRole || !roles.includes(userRole)) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: "Forbidden" }));
      return false;
    }
    return true;
  }
}