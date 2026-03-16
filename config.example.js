// Copy this file to config.js and fill in your real Cloudinary credentials.
// config.js is gitignored and should never be committed.
window.CLOUDINARY_CLOUD  = 'YOUR_CLOUD_NAME';
window.CLOUDINARY_PRESET = 'YOUR_UPLOAD_PRESET';

// Firebase (Spark — free plan) for collaboration features.
// 1. Go to https://console.firebase.google.com/
// 2. Create a project (or use existing)
// 3. Add a Web app → copy the config object below
// 4. Enable Firestore Database (in test mode or with rules)
window.FIREBASE_CONFIG = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT.firebaseapp.com',
  projectId:         'YOUR_PROJECT',
  storageBucket:     'YOUR_PROJECT.appspot.com',
  messagingSenderId: '000000000000',
  appId:             '1:000000000000:web:xxxxxxxxxxxx'
};
