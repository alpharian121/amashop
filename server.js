const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- CHANGE THIS TOKEN BEFORE DEPLOYING ---- //
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "5thr54hdre4453w5hy";


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

// ---- SERVE HTML/CSS/JS ---- //
app.use(express.static(path.join(__dirname, "public")));

// ---- START SERVER ---- //
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


