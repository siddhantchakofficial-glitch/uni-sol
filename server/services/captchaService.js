import crypto from 'crypto';

/**
 * Self-contained SVG captcha — no external dependencies or API keys.
 *
 * Issue:  server generates a 5-char code, returns an SVG rendering of it plus
 *         an HMAC signature over (id:answer:expiry). The answer is NEVER sent
 *         to the client — the client receives only the signature, which it
 *         must echo back at verify time.
 * Verify: the client sends (id, userAnswer, expiry, signature); the server
 *         recomputes the HMAC over the submitted answer and compares. A wrong
 *         answer fails the signature check, so answers cannot be forged.
 *
 * Tokens are single-use (in-memory consumed set) and expire after 10 minutes.
 * If RECAPTCHA_SECRET_KEY is configured, the Google reCAPTCHA path in
 * submissionRoutes takes precedence and this module is not consulted.
 */

const CAPTCHA_TTL_MS = 10 * 60 * 1000;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/1/0/O look-alikes
const consumed = new Set();

const getSecret = () =>
  process.env.CAPTCHA_SECRET ||
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  'unispark-dev-captcha-secret';

const sign = (id, answer, expiry) =>
  crypto.createHmac('sha256', getSecret()).update(`${id}:${answer}:${expiry}`).digest('hex');

const makeCode = (len = 5) => {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)];
  }
  return out;
};

/** Render the code into a noisy SVG so simple OCR/scrapers have a hard time. */
const renderSvg = (code) => {
  const width = 180;
  const height = 56;
  const colors = ['#0470aa', '#0a1e3f', '#035a88', '#0052cc'];
  const glyphs = code.split('').map((ch, i) => {
    const x = 22 + i * 30 + crypto.randomInt(-3, 4);
    const y = 38 + crypto.randomInt(-4, 5);
    const rot = crypto.randomInt(-22, 23);
    const color = colors[crypto.randomInt(colors.length)];
    const size = crypto.randomInt(26, 34);
    return `<text x="${x}" y="${y}" fill="${color}" font-family="Georgia, serif" font-size="${size}" font-weight="bold" transform="rotate(${rot} ${x} ${y})">${ch}</text>`;
  });

  const lines = Array.from({ length: 4 }, () => {
    const x1 = crypto.randomInt(width);
    const y1 = crypto.randomInt(height);
    const x2 = crypto.randomInt(width);
    const y2 = crypto.randomInt(height);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9fc7de" stroke-width="1" opacity="0.7"/>`;
  }).join('');

  const dots = Array.from({ length: 60 }, () => {
    const cx = crypto.randomInt(width);
    const cy = crypto.randomInt(height);
    return `<circle cx="${cx}" cy="${cy}" r="1" fill="#b9d8ea" opacity="0.6"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="captcha">
    <rect width="100%" height="100%" fill="#f1f9ff"/>
    ${dots}${lines}${glyphs.join('')}
  </svg>`;
};

/** Issue a fresh challenge: { id, svg, expiry, signature } (answer stays server-side). */
export const issueCaptcha = () => {
  const code = makeCode();
  const id = crypto.randomUUID();
  const expiry = Date.now() + CAPTCHA_TTL_MS;
  const signature = sign(id, code, expiry);

  return {
    id,
    expiry,
    signature,
    svg: renderSvg(code),
  };
};

/**
 * Verify a submitted challenge. Single-use and time-limited.
 * @returns {boolean} true when (id, answer, expiry, signature) is valid.
 */
export const verifyCaptcha = ({ id, answer, expiry, signature }) => {
  if (!id || !answer || !expiry || !signature) return false;
  const key = `${id}`;
  if (consumed.has(key)) return false;
  if (Date.now() > Number(expiry)) return false;

  const normalized = String(answer).trim().toUpperCase();
  const expected = sign(id, normalized, expiry);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (ok) consumed.add(key);

  // Prune old consumed ids so the set cannot grow unbounded.
  if (consumed.size > 1000) {
    for (const k of consumed) consumed.delete(k);
  }
  return ok;
};

/** Only used by tests/dev to flush state. */
export const resetCaptchaStore = () => consumed.clear();
