const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- CHANGE THIS TOKEN BEFORE DEPLOYING ---- //
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "5thr54hdre4453w5hy";

// ---- SECURITY / SESSION SETUP ---- //
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ekrrgioewy4p98t4y3wtegtgp98a3h48h2q8g535h35hw3wehwsrtj",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      secure: true, // change to true IF using HTTPS reverse proxy
    }
  })
);

// ---- TOKEN PROTECTION ---- //
app.use((req, res, next) => {
  if (req.session.authorized) {
    return next();
  }

  if (req.query.access === ACCESS_TOKEN) {
    req.session.authorized = true;
    return next();
  }

  return res.status(403).send("Access denied. Missing or invalid access token.");
});

// ---- SERVE HTML/CSS/JS ---- //
app.use(express.static(path.join(__dirname, "public")));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// === Anti-bot & secure headers middleware ===
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

app.use(express.static(path.join(__dirname, "public")));

