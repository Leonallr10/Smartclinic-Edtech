import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 }
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

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${rawToken}`;
      console.log(`\n[RESET LINK] ${resetUrl}\n`);

      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been generated.',
        resetLink: resetUrl,
      });
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been generated.',
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
