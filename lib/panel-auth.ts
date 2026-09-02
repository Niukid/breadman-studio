// Usa Web Crypto (SubtleCrypto) en vez del módulo "crypto" de Node,
// para que funcione tanto en middleware (Edge runtime) como en API routes (Node runtime).

const COOKIE_NAME = "panel_session";
const SESSION_HOURS = 24 * 7; // 7 días

function getSecret(): string {
  const secret = process.env.PANEL_SESSION_SECRET;
  if (!secret) {
    throw new Error("PANEL_SESSION_SECRET no está configurado");
  }
  return secret;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bufferToHex(signature);
}

/**
 * Crea un token de sesión firmado: "username.expiry.signature"
 */
export async function createSessionToken(username: string): Promise<string> {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${username}.${expiry}`;
  const signature = await hmacSign(payload);
  return `${payload}.${signature}`;
}

/**
 * Verifica un token de sesión. Devuelve el username si es válido, o null.
 */
export async function verifySessionToken(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, expiryStr, signature] = parts;
  const payload = `${username}.${expiryStr}`;
  const expectedSignature = await hmacSign(payload);

  if (signature.length !== expectedSignature.length || signature !== expectedSignature) {
    return null;
  }

  const expiry = parseInt(expiryStr, 10);
  if (Number.isNaN(expiry) || Date.now() > expiry) return null;

  return username;
}

/**
 * Valida usuario/contraseña contra las credenciales configuradas en variables de entorno.
 * Soporta múltiples usuarios: PANEL_USER_1/PANEL_PASS_1, PANEL_USER_2/PANEL_PASS_2, etc.
 */
export function validateCredentials(
  username: string,
  password: string
): boolean {
  for (let i = 1; i <= 10; i++) {
    const envUser = process.env[`PANEL_USER_${i}`];
    const envPass = process.env[`PANEL_PASS_${i}`];
    if (!envUser || !envPass) continue;
    if (envUser === username && envPass === password) return true;
  }
  return false;
}

export { COOKIE_NAME };
