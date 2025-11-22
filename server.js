const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- CHANGE THIS TOKEN BEFORE DEPLOYING ---- //
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "5thr54hdre4453w5hy";

// ---- SESSION MIDDLEWARE ---- //
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,  // set true if using HTTPS
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);

// ---- ANTI-BOT & SECURE HEADERS MIDDLEWARE ---- //
app.use((req, res, next) => {
  const ua = req.headers['user-agent']?.toLowerCase() || "";
  if (/bot|crawler|spider|facebookexternalhit|bingpreview|headless|wget|curl/i.test(ua)) {
    return res.redirect("https://facebook.com");
  }
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

// ---- TOKEN PROTECTION MIDDLEWARE ---- //
app.use((req, res, next) => {
  try {
    if (req.session.authorized) return next();
    if (req.query.access === ACCESS_TOKEN) {
      req.session.authorized = true;
      return next();
    }
    return res.status(403).send("Access denied. Missing or invalid access token.");
  } catch (err) {
    console.error("Session error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// ---- SERVE HTML/CSS/JS ---- //
app.use(express.static(path.join(__dirname, "public")));

// ---- START SERVER ---- //
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
