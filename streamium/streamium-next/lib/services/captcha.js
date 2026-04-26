import crypto from 'crypto';

const CAPTCHA_EXPIRY = 5 * 60 * 1000; // 5 minutes
const captchaStore = new Map();

// Cleanup expired captchas every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [id, entry] of captchaStore.entries()) {
      if (now - entry.createdAt > CAPTCHA_EXPIRY) {
        captchaStore.delete(id);
      }
    }
  }, 60 * 1000);
}

export class CaptchaService {
  static CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  static LENGTH = 6;

  static generateCaptcha() {
    const text = Array(this.LENGTH)
      .fill(0)
      .map(() => this.CHARS[Math.floor(Math.random() * this.CHARS.length)])
      .join('');

    const id = crypto.randomBytes(16).toString('hex');

    captchaStore.set(id, {
      text,
      createdAt: Date.now(),
    });

    return { id, text };
  }

  static validateCaptcha(id, userInput, options = {}) {
    const entry = captchaStore.get(id);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() - entry.createdAt > CAPTCHA_EXPIRY) {
      captchaStore.delete(id);
      return false;
    }

    const matches = entry.text.toLowerCase() === userInput.toLowerCase();
    const consume = options.consume ?? true;
    if (consume || !matches) {
      captchaStore.delete(id);
    }

    return matches;
  }

  static invalidateCaptcha(id) {
    captchaStore.delete(id);
  }
}
