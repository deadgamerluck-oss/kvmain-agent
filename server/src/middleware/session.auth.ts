import crypto from 'crypto';

export interface AnonymousSessionToken {
  sessionId: string;
  rawSecret: string;
}

/**
 * Generates a cryptographically strong anonymous session ID and a high-entropy secret.
 */
export const generateAnonymousSession = (): AnonymousSessionToken => {
  const sessionId = 'anon_' + crypto.randomBytes(12).toString('hex');
  const rawSecret = crypto.randomBytes(32).toString('hex');
  return { sessionId, rawSecret };
};

/**
 * Computes a SHA-256 hash of the session secret for storage in the database.
 * The raw secret is kept exclusively on the client in an HTTP-only secure cookie.
 */
export const hashSessionSecret = (secret: string): string => {
  return crypto.createHash('sha256').update(secret).digest('hex');
};

/**
 * Validates that the provided session secret matches the stored hash in constant time.
 */
export const verifySessionSecret = (secret: string, storedHash: string): boolean => {
  const computedHash = hashSessionSecret(secret);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, 'utf-8'),
      Buffer.from(storedHash, 'utf-8')
    );
  } catch {
    return false;
  }
};
