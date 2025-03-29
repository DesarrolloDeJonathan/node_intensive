import type { IncomingMessage, ServerResponse } from "http";
import type { JwtPayload } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import { isTokenRevoked } from "../models";
import config from "../config";

/**
 * Extends the IncomingMessage interface to include an optional `user` property.
 */
export interface AuthenticatedRequest extends IncomingMessage {
  /**
   * The decoded JWT payload or string representing the authenticated user.
   */
  user?: JwtPayload | string;
}

/**
 * Middleware function to authenticate a JWT token from the request headers.
 *
 * @param {AuthenticatedRequest} req - The incoming HTTP request with optional user information.
 * @param {ServerResponse} res - The HTTP response object.
 * @returns {Promise<boolean>} - Resolves to `true` if the token is valid, otherwise `false`.
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: ServerResponse
): Promise<boolean> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.statusCode = 401;
    // Convert the object to a string before sending
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return false;
  }

  if (isTokenRevoked(token)) {
    res.statusCode = 403;
    res.end(JSON.stringify({ message: "Forbidden" }));
    return false;
  }

  try {
    const decoded = verify(token, config.jwSecret);
    req.user = decoded;
    return true;
  } catch (_err) {
    res.statusCode = 403;
    res.end(JSON.stringify({ message: "Forbidden" }));
    return false;
  }
};
