import { NextResponse } from 'next/server';
import { CaptchaService } from '@/lib/services/captcha';
import { z } from 'zod';

const validateSchema = z.object({
  id: z.string().length(32),
  answer: z.string().min(1).max(10),
});

// Generate a new captcha
export async function GET() {
  const { id, text } = CaptchaService.generateCaptcha();
  return NextResponse.json({ id, text });
}

// Validate captcha (used during form submission or as preliminary check)
export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ valid: false, error: 'Invalid request' }, { status: 400 });
    }

    const { id, answer } = validation.data;
    // Preliminary check without consuming the captcha
    const isValid = CaptchaService.validateCaptcha(id, answer, { consume: false });

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Captcha validation error:', error);
    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 });
  }
}
