import Logger from "../Helper/Core/Logger.js";

const ipAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; 

export function fraudDetection(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!ipAttempts.has(ip)) {
    ipAttempts.set(ip, []);
  }

  // Remove old attempts beyond WINDOW_MS
  const attempts = ipAttempts.get(ip).filter(ts => now - ts < WINDOW_MS);

  if (attempts.length >= MAX_ATTEMPTS) {
    Logger.warn(`IP ${ip} blocked due to suspected fraud.`);
    return res.status(429).json({ error: "Too many attempts. Try again later." });
  }

  attempts.push(now);
  ipAttempts.set(ip, attempts);

  Logger.info(`IP ${ip} attempt count: ${attempts.length}`);
  next();
}
