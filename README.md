# eDM Tool Suite

A zero-dependency, browser-based toolkit for building **Salesforce Marketing Cloud (MCE)**-ready email templates — no install, no build step, no server required.

Open `index.html` in any modern browser and choose a tool to start building.

---

## Project Structure

```
eDM Tool Suite/
├── index.html                  ← Landing page — tool selector
├── ComponentCustomizer.html    ← Component Customizer (19 components)
├── NewsletterCustomizer.html   ← Newsletter Customizer (9 components)
├── firebase-config.js          ← Firebase SDK init (reads from config.js)
├── firebase-collab.js          ← Real-time collaboration module
├── firestore.rules             ← Firestore security rules
├── firebase.json               ← Firebase project config
├── config.js                   ← 🔒 Credentials (gitignored)
├── config.example.js           ← Template — copy to config.js
├── .github/workflows/deploy.yml ← GitHub Pages auto-deploy
├── .gitignore
└── README.md
```

---

## Setup

1. Clone the repo
2. Copy `config.example.js` → `config.js`
3. Fill in your **Cloudinary** cloud name and upload preset
4. *(Optional — for collaboration)* Add your **Firebase** config to `config.js`:
   ```js
   window.FIREBASE_CONFIG = {
     apiKey:            'YOUR_API_KEY',
     authDomain:        'YOUR_PROJECT.firebaseapp.com',
     projectId:         'YOUR_PROJECT',
     storageBucket:     'YOUR_PROJECT.appspot.com',
     messagingSenderId: '000000000000',
     appId:             '1:000000000000:web:xxxxxxxxxxxx'
   };
   ```
5. Open `index.html` in a browser

> **Local server:** If your browser restricts local file access, run `python3 -m http.server 8765` from the project root and open `http://localhost:8765`.

> **Collaboration features** (project gallery, real-time sync, multi-user presence) require a Firebase project with Firestore enabled. Without `FIREBASE_CONFIG`, the tool still works fully as a standalone single-user builder.

---

## Tool 1 — Component Customizer

A library of **19 reusable eDM components** with three views:

### Component Library

All 19 components displayed as thumbnail cards with live color previews. Click any card to open it in the Customizer.

### Component Customizer

Per-component editing environment:

- **Color sidebar** — every meaningful color token (background, text, CTA, badge, border…) is exposed as a swatch. Linked tokens update dependent colors automatically.
- **Inline text editing** — click any text region in the preview to edit it directly
- **Link editor** — double-click any link to set URL, Tracking Alias, Title, underline style, and Conversion Tracking flag
- **Image editor** — click any image to swap URL or upload from file; alt text field included for accessibility
- **Cloudinary upload** — drag or select a JPG/PNG (max 5 MB); uploaded with `f_auto,q_auto` optimization
- **Desktop / Mobile preview toggle** — switch between 600px and 375px viewport widths
- **Copy HTML** — outputs clean, production-ready MCE-compatible code

### eDM Builder

Full-email assembly workspace:

- Drag components into a canvas; reorder by dragging to any position
- Click any component to open its color controls in the right panel
- Click any text, link, or image directly in the canvas to edit inline
- **Theme switcher** — apply a global Blue or Orange palette across the entire stack
- **Duplicate** any component block in the stack
- **Undo / Redo** — full history stack
- **Desktop / Mobile preview toggle** — check the assembled email at mobile widths
- **View Source** — inspect the full output HTML in a side panel
- **Copy Full HTML** / **Download HTML** — exports a dated `.html` file

### The 19 Components

| # | Component | Purpose |
|---|-----------|---------|
| 01 | Header | Logo + navigation links |
| 02 | Full-Width Banner | Hero image + headline + CTA |
| 03 | Split Banner | Text left / image right hero |
| 04 | Countdown Bar | Urgency timer strip |
| 05 | Section Heading | Eyebrow + title + subtitle divider |
| 06 | Products — 2×2 Grid | 4-product showcase |
| 07 | Products — 3-Col | 3-product showcase |
| 08 | Image \| Text Split | Feature block (image left) |
| 09 | Text \| Image Split | Feature block (text left) |
| 10 | Coupon — Single | Single promo code block |
| 11 | Coupon — Dual | Two-coupon side-by-side |
| 12 | Service Benefits — 4-Col | 4-icon benefit strip |
| 13 | Other Activities — 3-Col | 3-card content section |
| 14 | Footer | Legal text + links + copyright |
| 15 | 3-Col Image + Text | 3-column visual grid |
| 16 | Button Bar — Single | Single centered CTA |
| 17 | Button Bar — Dual | Primary + secondary CTA pair |
| 18 | 4-Col Image + Text | 4-column visual grid |
| 19 | Button Bar — Triple | Three CTAs in a row |

---

## Tool 2 — Newsletter Customizer

A dedicated builder for **internal newsletter emails** with **9 components**, designed around a 750px layout:

### Builder Features

- Drag-and-drop component assembly with reorder, duplicate, and remove
- Per-component color palette editing via sidebar
- Inline text, image, and link editing directly in the preview
- **Component option toggles** — show/hide CTA buttons, images, select stat count (3–5), or switch layout variants per block
- **Image crop modal** — crop images to component-specific aspect ratios before uploading
- **Cloudinary upload** with auto-optimization
- **Desktop / Mobile preview toggle**
- **Download HTML Zip** — primary action, exports a ZIP with the project name
- **Copy HTML** — secondary action, copies output to clipboard
- **Undo / Redo** with full history

### Real-Time Collaboration (Firebase)

- **Project Gallery** — create, rename, duplicate, and delete newsletter projects stored in Firestore
- **Auto-sync** — changes are saved automatically as you edit; manual Save also available
- **Multi-user presence** — see who is currently editing the same project (Google Docs–style avatars)
- **Share link** — generate a direct URL to any project for collaborators
- **User profiles** — pick an emoji avatar and display name (stored locally)
- **Last-edit indicator** — see who last edited each project and when

### The 9 Newsletter Components

| # | Component | Purpose |
|---|-----------|---------|
| 01 | Header | Logo + contact email |
| 02 | Banner | Split hero — text left, image right, optional CTA |
| 03 | Top News | Highlight label + body with optional image/CTA |
| 04 | Stats | Metrics bar with 3 key numbers |
| 05 | Article | Stats sidebar (3–5 stats) + long-form content with background image |
| 06 | Feature (Orange) | Single feature article with optional image placement (left/right) and CTA |
| 07 | Product Cards | Card layout (3 or 4 cards) with accent bars, optional images and CTAs |
| 08 | Insight | Full-width background image section with optional image and CTA |
| 09 | Footer | Copyright and legal text |

---

## MCE Compatibility

Both tools produce MCE-compatible output:

### `mc:edit` regions

Every editable text, image, and link carries `mc:edit="..."` attributes. After importing to MCE, editors can continue to modify content inside the platform.

### Link attributes preserved on export

| Attribute | Maps to in MCE |
|-----------|----------------|
| `href` | Link URL |
| `alias` | Tracking Alias |
| `title` | Title |
| `style="text-decoration:underline"` | Include Underline |
| `conversiontracking="true"` | Conversion Tracking |

### Inline styles — layout stays locked

All color customizations are written as `style="..."` directly on each element. No `<style>` blocks are used for layout or color. The only `@media` queries present are for mobile-responsive adjustments.

### Table-based layout

HTML uses table-based structure throughout for pixel-perfect rendering in Outlook, including MSO conditional comments where needed.

### No external dependencies in exported output

Exported HTML is fully self-contained. Web font stack: `Arial → Helvetica → sans-serif`.

---

## Color System

Each component exposes a curated set of color tokens:

- **Linked tokens** — some swatches control multiple values (e.g. CTA color auto-recalculates its tinted background)
- **Derived / hidden tokens** — computed colors update silently in the background
- **Theme presets** — the Component Customizer Builder's Theme switcher (Blue / Orange) applies a coordinated palette globally
- **Per-component overrides** — each component's colors can be individually adjusted on top of the active theme

---

## Language Support

All three pages (Landing, Component Customizer, Newsletter Customizer) support language switching:

| Language | Code |
|----------|------|
| English | `en` |
| 繁體中文 | `zh-TW` |
| 한국어 | `ko` |

Switching language re-renders all UI labels, component names, sidebar controls, tooltips, and modal content instantly — no page reload.

---

## Cloudinary Image Upload

Both tools share a single `config.js` for Cloudinary credentials:

```js
// config.js (gitignored — never commit)
window.CLOUDINARY_CLOUD  = 'your_cloud_name';
window.CLOUDINARY_PRESET = 'your_upload_preset';
```

A `config.example.js` template is included in the repo. Copy it to `config.js` and fill in your values. All other features work without Cloudinary — only the image upload button requires it.

For collaboration features, also add `FIREBASE_CONFIG` to the same file (see [Setup](#setup)).

---

## How to Use

### Path A — Customize one component, finish editing in MCE

1. Open **Component Customizer** from the landing page
2. Browse the **Component Library** → click a component card
3. Adjust colors, text, images, and links in the **Customizer**
4. Click **Copy HTML**
5. In MCE, paste into a **Free Form** content block

### Path B — Build the full eDM here, then export

1. Open **Component Customizer** → click **Customize my eDM** to enter the **Builder**
2. Drag components into the canvas
3. Click any block to customize colors; click any text, link, or image to edit inline
4. Apply a global **Theme** any time
5. Click **Copy Full HTML** or **Download HTML**

### Path C — Build a newsletter

1. Open **Newsletter Customizer** from the landing page
2. Create a new project or open an existing one from the **Project Gallery**
3. Drag newsletter components into the canvas
4. Toggle component options (CTA, images, stat count, layout variants) as needed
5. Edit content inline and adjust colors
6. Click **Download HTML Zip** or **Copy HTML**
7. Changes are auto-saved to Firestore — collaborators see updates in real time

---

## What This Tool Is Not

- Not a replacement for MCE — it is a **pre-production customization and assembly layer**
- Not a general-purpose design tool — components follow a fixed brand structure

> **Note:** The Newsletter Customizer supports cloud sync and multi-user collaboration via Firebase Firestore. The Component Customizer remains a standalone single-session tool.
