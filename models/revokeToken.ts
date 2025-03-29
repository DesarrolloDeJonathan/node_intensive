const revokedTokens: Set<string> = new Set();

/**
 * Adds a token to the set of revoked tokens.
 * 
 * @param {string} token - The token to be revoked.
 * @returns {void}
 */
export const addRevokeToken = (token: string): void => {
  revokedTokens.add(token);
}

/**
 * Checks if a token has been revoked.
 * 
 * @param {string} token - The token to check.
 * @returns {boolean} - Returns `true` if the token is revoked, otherwise `false`.
 */
export const isTokenRevoked = (token: string): boolean => {
  return revokedTokens.has(token);
}