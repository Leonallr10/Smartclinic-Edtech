import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

export interface TokenPayload {
  id: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(getJwtSecretKey());
}

export async function verifyToken(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get('token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
