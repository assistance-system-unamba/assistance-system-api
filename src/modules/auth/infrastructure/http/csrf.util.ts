import { randomBytes } from 'crypto';

export function generateCsrfToken() {
  return randomBytes(24).toString('base64url');
}
