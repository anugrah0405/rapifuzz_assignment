// Utility for handling JWT token generation and verification (frontend only, static secret)
import jwt from 'jwt-simple';

const SECRET = '3c88910e0cc4991951191e7ecf2edff2';

export function generateToken(payload: object, expiresInSeconds: number = 600) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return jwt.encode({ ...payload, exp }, SECRET);
}

export function decodeToken(token: string) {
  try {
    return jwt.decode(token, SECRET);
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
}
