// ══════════════════════════════════════
// Firebase SDK Initialization (Spark — Free Plan)
// ══════════════════════════════════════
// Uses Firebase v9 compat CDN (loaded via <script> in HTML).
// Reads credentials from config.js window.FIREBASE_CONFIG.

(function () {
  'use strict';

  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY') {
    console.warn('[Firebase] No valid FIREBASE_CONFIG found in config.js — collaboration features disabled.');
    window._fbReady = false;
    return;
  }

  // Initialize Firebase app
  firebase.initializeApp(cfg);

  // Firestore instance
  window._db = firebase.firestore();
  window._fbReady = true;

  console.log('[Firebase] Initialized ✔  (Spark / Free)');
})();
