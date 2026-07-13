# AI Guide — Q&A Reference

This is the full knowledge base behind the AI Guide widget (bottom-right chat icon) in `MarcomAgentStudio-AI DEMO.html`. It's not a real LLM — free-text questions are matched against these 27 entries by keyword scoring, with a graceful fallback (plus suggested questions) when nothing matches closely enough. Questions asked inside an open campaign about asset counts or empty assets are answered dynamically from that campaign's real data instead of this list.

### What is Marcom Agent Studio?
It's a campaign workspace that ties together three builders you'd otherwise use separately: Campaign Page Builder (landing pages), ComponentCustomizer (eDMs), and Marketing Material Builder (graphic ad sets). A "Campaign" groups any number of each together, and the AI Campaign Composer can draft all three at once from a short brief.

### How do I start a campaign?
Click "New Campaign" on the gallery, name it, and pick a region. Inside a campaign you can add any number of Landing Pages, eDMs, and Graphic Assets — everything lives together instead of scattered across separate files.

### What does the AI Campaign Composer do?
It turns a short brief into a full campaign draft: a Landing Page (Campaign Page Builder sections), an eDM (ComponentCustomizer builder stack), and a Graphic Asset set (Marketing Material Builder sizes) — all as structured data handed to the existing builders, never hand-written HTML. It asks a few clarifying questions first so the draft reflects what you actually said, then you fine-tune everything afterward.

### Does the AI Composer use a real AI/LLM?
No — and this AI Guide doesn't either. Both are deterministic and rule-based: the Composer parses your brief text and clarify answers with plain string logic and fills in gaps from a small template bank, and the Guide matches your question against a keyword-scored FAQ. Nothing here calls an external AI API or leaves your browser — that's intentional, this whole suite runs with zero backend.

### What are the Clarify questions for?
After you submit a brief, the Composer scans it for gaps — no named audience, no image mentioned, a very short brief, or no stated tone — and only asks about what's actually missing. If your brief already covers something, that question is skipped entirely.

### What happens if my brief is very short?
The Composer fills gaps (subheadline, body copy, one or two features) from a small language-specific filler template, but it never invents or overwrites the words you actually typed — only the parts you left blank.

### What languages are supported?
English, Traditional Chinese (繁體中文), and Korean (한국어). The Language field controls which fallback-copy template fills any gaps — your own written words are never auto-translated.

### What do the attached reference files do?
In this demo, attaching a file just adds its name as a chip and skips the "no image mentioned" clarify question — it doesn't parse the file's contents. It's a placeholder for where real document parsing would plug in.

### Landing Page vs eDM vs Graphic Asset — what's the difference?
Landing Page (Campaign Page Builder) is a full web page built from sections like Hero, Feature Cards, Product Anchor. eDM (ComponentCustomizer) is an email built from stackable components. Graphic Asset (Marketing Material Builder) is a set of ad creative sizes — banners, social posts, display ads — generated from one shared headline and image so you're not rebuilding ten sizes by hand.

### How do I export or publish?
Graphic Assets export as PNG or JPG per size, or all sizes zipped together. Landing Pages and eDMs are edited live in their own builder — use that builder's copy/export controls once the draft looks right.

### How do I edit a Landing Page?
Open it from inside a campaign — it launches Campaign Page Builder embedded in this app. Click any section to edit its text, images, or layout; add new sections from the section library; and pick a visual style that applies to the whole page.

### What sections can I add to a Landing Page?
Hero Banner, Feature Cards (and the split/gallery variants), Product Anchor, Product Series Matrix, Related Content Hub, FAQ Accordion, and a Need-Help CTA, plus the fixed Header/Footer. Sections can be reordered and each has its own light/dark mode.

### What styles are available for Landing Pages?
Each style is a full token set (colors, section backgrounds, accents) applied via a single "styleId" on the project — for example Cyber Green, which uses NVIDIA-green (#97c430) as the primary accent on a near-black background.

### How do I edit an eDM?
Open it from inside a campaign to launch ComponentCustomizer embedded in this app. You stack components top to bottom, click any text/link/image to edit it inline, and set colors either per-component or via a shared theme.

### What components can I add to an eDM?
Header, two hero banner layouts, a countdown/urgency bar, a section heading, product grids (2×2 and 3-column), coupons and promo codes, image+text splits, icon grids, button bars, a survey block, and the footer — all designed to render correctly in Outlook/Gmail/Apple Mail.

### How do I change the eDM color theme?
Pick a theme (like the Green theme) and it resets every component's color keys to that theme's palette in one click. You can still override any single component's color afterward without breaking the rest.

### What format does the eDM export as?
A self-contained XHTML document with MSO conditional comments and inlined, table-based layout — built for email client compatibility (Outlook, Gmail, Apple Mail), not a modern responsive webpage.

### What ad sizes does Graphic Asset Builder support?
IoTMart homepage banner, a square social post (FB/LinkedIn), 5 Google Display Ad sizes, 2 Google PMAX sizes, and an email signature banner — 10 sizes total, all sharing one headline/subheadline/feature/image source.

### How do I keep my Graphic Assets, Landing Page, and eDM visually consistent?
Pick the same style family across all three — e.g. Cyber Green exists as a style in Campaign Page Builder, a theme in ComponentCustomizer, and a style preset in Marketing Material Builder — so one color choice carries across every asset type in the campaign.

### How do I export Graphic Assets?
Export a single size as PNG or JPG, or export every size in the project at once as a zipped folder — both render pixel-for-pixel from the same live canvas you're editing.

### Where is my data stored? Is anything sent to a server?
Everything lives in your browser's local storage. There's no backend, no account, and no API key anywhere in this suite — nothing you create here is sent anywhere.

### Can I duplicate or delete a campaign/asset?
Yes — each campaign and each asset card has a kebab (⋮) menu with duplicate and delete. Duplicating deep-copies the underlying project data, so edits to the copy never touch the original.

### What are Regions for?
A campaign-level tag (Global, Korea, Europe) used for organization and filtering on the gallery — it doesn't change generated content, though the AI Composer's Region field is there for future locale-aware generation.

### Is there undo/redo?
Yes, inside Campaign Page Builder, ComponentCustomizer, and Marketing Material Builder each keep their own history stack while you're editing that asset.

### How do I add urgency / a countdown to my eDM?
Add the Countdown component to the eDM builder stack — it's a single-line banner meant for a deadline message (e.g. "Offer ends 08/15") and its accent color follows whatever theme you've applied.

### Can I add an FAQ section to my Landing Page?
Yes — the FAQ Accordion section holds any number of question/answer pairs and matches whatever light/dark mode you set for that section.

### Where do product images and info come from?
From a shared product database file used across the builders, plus a curated image library for cases where a specific product photo isn't needed (e.g. generic backgrounds for Graphic Assets).

---

### Dynamic (campaign-data) answers, not part of the static list above

These only trigger while a campaign is open, and read that campaign's live data instead of a canned answer:

- **"How many assets do I have?" / "What's in this campaign?"** → reports actual counts of Landing Pages, eDMs, and Graphic Assets in the open campaign.
- **"Which assets are empty?" / "What's missing content?"** → lists any Landing Page with no sections, eDM with no builder stack, or Graphic Asset with no project set up — or confirms everything has content.
