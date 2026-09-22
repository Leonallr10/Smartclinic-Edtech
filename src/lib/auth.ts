import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-development';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  id: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);
}

export async function verifyToken(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get('token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}
