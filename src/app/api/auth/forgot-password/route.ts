import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function appOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '');

  const host = req.headers.get('host');
  if (host) {
    const proto = host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https';
    return `${proto}://${host}`;
  }

  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const rawToken = crypto.randomUUID();
      const hashedToken = hashToken(rawToken);
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashedToken,
          resetTokenExpiry: expiry,
        },
      });

      const path = `/auth/reset-password?token=${rawToken}`;
      const resetUrl = `${appOrigin(req)}${path}`;
      console.log(`\n[RESET LINK] ${resetUrl}\n`);

      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been generated.',
        // Relative path so the button stays on the same host (avoids localhost mismatch)
        resetLink: path,
        resetUrl,
      });
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been generated.',
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
