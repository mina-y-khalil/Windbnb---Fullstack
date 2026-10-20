// backend/utils/rateLimit.js
// Request rate limits that protect the app from bots and scrapers.
const { rateLimit } = require("express-rate-limit");

// Render routes all public traffic through Cloudflare, which puts the
// visitor's real IP in CF-Connecting-IP. Use it to tell visitors apart,
// and fall back to the socket address when running locally.
const clientKey = (req) =>
  req.get("cf-connecting-ip") || req.get("true-client-ip") || req.ip;

const tooMany = (message) => (_req, res) =>
  res.status(429).json({ message, errors: { rateLimit: message } });

// Every request: page loads, static assets and API calls.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: clientKey,
  validate: { xForwardedForHeader: false },
  handler: tooMany("Too many requests. Please try again in a few minutes."),
});

// Login, demo login and sign-up: stops password guessing and fake accounts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: clientKey,
  validate: { xForwardedForHeader: false },
  handler: tooMany("Too many login or sign-up attempts. Please try again in 15 minutes."),
});

module.exports = { generalLimiter, authLimiter };
