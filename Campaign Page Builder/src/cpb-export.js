(function (global) {
  'use strict';

  // Shared cache used by both export and preview refresh paths.
  global._styleCssCache = global._styleCssCache || {};

  function buildFinalHtml() {
    if (!CPB.state.currentProject) return '';
    normalizeSectionModes();
    const helpers = makeHelpers();
    const sectionsHtml = CPB.state.currentProject.sections.map(item => {
      const def = SECTION_BY_ID[item.sectionType];
      if (!def) return '';
      let html = def.getHtml(item, helpers);
      // Inject anchor id at section root if present
      if (item.anchorId) {
        html = html.replace(/<(section|nav|footer|div)\b/, `<$1 id="${escapeAttr(item.anchorId)}"`);
      }
      // Strip builder-only edit attributes (data-cpb-edit and all -suffixed variants)
      html = html.replace(/\sdata-cpb-edit[\w-]*="[^"]*"/g, '');
      return html;
    }).join('\n');

    const style = STYLE_BY_ID[CPB.state.currentProject.styleId];
    const styleCss = getInlineStyleCss(style.id);
    const prefix = getProjectPrefix();
    const pageClass = (prefix && prefix !== 'cpb') ? prefix + '-page' : 'cpb-page';

    // Minimal page-scoped resets. Keep everything scoped under pageClass so
    // host site styles are not affected.
    const scopedResets =
`.${pageClass} { font-family: 'Inter', sans-serif; color: #0c0c0c; line-height: 1.5; }
.${pageClass} img { max-width: 100%; height: auto; display: block; }
.${pageClass} .mi {
  font-family: 'Material Symbols Rounded','Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  text-transform: none;
  letter-spacing: normal;
  vertical-align: middle;
  -webkit-font-feature-settings: 'liga';
  font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}`;

    // Rewrite the internal `cpb-` prefix to the project's custom prefix so the
    // exported file is single-prefixed. Fixed chrome lives in the `cpb-fx-`
    // namespace, which rewrites to `<prefix>-fx-` and stays isolated from the
    // page section classes. With the default prefix everything is left as-is.
    // Both CSS and HTML are rewritten with the same map.
    const rewritePrefixes = (s) => {
      if (!s || !prefix || prefix === 'cpb') return s || '';
      return s.replace(/cpb-/g, prefix + '-');
    };
    const prefixedStyleCss  = rewritePrefixes(styleCss);
    const prefixedSections  = rewritePrefixes(sectionsHtml);
    const prefixedChromeCss = rewritePrefixes(FIXED_CHROME_CSS);

    // Style CSS is sourced from CPB_STYLE_CSS (embedded JS strings) so the
    // inline path always succeeds. No <link> fallback — class names are
    // prefix-rewritten and would not match the original CSS file.
    const styleTag = `<style>\n${scopedResets}\n${prefixedStyleCss}\n${prefixedChromeCss}\n</style>`;
    const p3EqualizeScript = rewritePrefixes(`<script>
(function(){
  function syncP3SeriesIntroHeights(root) {
    var scope = root || document;
    var sections = scope.querySelectorAll('.cpb-product-series-section');
    sections.forEach(function(section) {
      var intros = Array.prototype.slice.call(section.querySelectorAll('.cpb-product-series-intro'));
      if (!intros.length) return;
      intros.forEach(function(el) { el.style.removeProperty('--cpb-p3-intro-equal-height'); });
      var maxHeight = 0;
      intros.forEach(function(el) {
        var h = Math.ceil(el.getBoundingClientRect().height || 0);
        if (h > maxHeight) maxHeight = h;
      });
      if (!maxHeight) return;
      intros.forEach(function(el) { el.style.setProperty('--cpb-p3-intro-equal-height', maxHeight + 'px'); });
    });
  }
  var timer = 0;
  function scheduleSync() {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(function() {
      requestAnimationFrame(function() { requestAnimationFrame(function() { syncP3SeriesIntroHeights(document); }); });
    }, 0);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
  } else {
    scheduleSync();
  }
  window.addEventListener('load', scheduleSync);
  window.addEventListener('resize', scheduleSync);
})();
<\/script>`);

    // Scroll-reveal animation — injected only when the page setting is on.
    // CMS-safe: no external library (uses IntersectionObserver), everything is
    // scoped under the page wrapper, and the hidden initial state is gated by
    // the .cpb-anim-ready class added here, so if JS is blocked the content
    // still renders. Honours prefers-reduced-motion. Re-plays on scroll back.
    const animateOnScroll = !!CPB.state.currentProject.animateOnScroll;
    const scrollRevealScript = animateOnScroll ? rewritePrefixes(`<script>
(function(){
  var root = document.querySelector('[data-style]');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof IntersectionObserver === 'undefined') return;
  var targets = root.querySelectorAll('.cpb-section, .cpb-hero');
  if (!targets.length) return;
  for (var i = 0; i < targets.length; i++) { targets[i].classList.add('cpb-reveal'); }
  root.classList.add('cpb-anim-ready');
  var io = new IntersectionObserver(function(entries){
    for (var j = 0; j < entries.length; j++) {
      var e = entries[j];
      if (e.isIntersecting) e.target.classList.add('cpb-reveal-in');
      else e.target.classList.remove('cpb-reveal-in');
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  for (var k = 0; k < targets.length; k++) { io.observe(targets[k]); }
})();
<\/script>`) : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(CPB.state.currentProject.name)}</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
${styleTag}
</head>
<body>
<div class="${pageClass}" data-style="${style.id}">
${prefixedSections}
</div>
${p3EqualizeScript}
${scrollRevealScript}
</body>
</html>`;
  }

  // Best-effort: read the active stylesheet rules and serialize. Falls back to
  // the embedded CPB_STYLE_CSS map (always present), then to live cssRules /
  // fetch. The embedded map guarantees exports are styled even on file://,
  // where link.cssRules and fetch() are blocked by CORS.
  function getInlineStyleCss(styleId) {
    if (global._styleCssCache[styleId]) return global._styleCssCache[styleId];
    const file = STYLE_BY_ID[styleId]?.cssFile;
    // Preferred: the JS-embedded copy (immune to file:// / CORS issues).
    if (typeof CPB_STYLE_CSS !== 'undefined') {
      const embedded = CPB_STYLE_CSS[styleId] || (file ? CPB_STYLE_CSS[file] : '');
      if (embedded) {
        global._styleCssCache[styleId] = embedded;
        return global._styleCssCache[styleId];
      }
    }
    if (!file) return '';
    const link = [...document.querySelectorAll('link[rel="stylesheet"]')].find(l => l.href.endsWith(file));
    if (link && link.sheet) {
      try {
        const txt = [...link.sheet.cssRules].map(r => r.cssText).join('\n');
        if (txt) {
          global._styleCssCache[styleId] = txt;
          return txt;
        }
      } catch (e) { /* CORS — fall through */ }
    }
    return '';
  }

  async function buildFinalHtmlAsync() {
    if (!CPB.state.currentProject) return '';
    const style = STYLE_BY_ID[CPB.state.currentProject.styleId];
    // Always try to refresh active style CSS before export so downloaded HTML
    // reflects the latest local edits without requiring a full page reload.
    let inline = '';
    if (style && style.cssFile) {
      try {
        const r = await fetch(style.cssFile, { cache: 'no-cache' });
        if (r.ok) inline = await r.text();
      } catch (e) { /* swallow */ }
    }
    if (!inline) inline = getInlineStyleCss(style.id);
    if (inline) global._styleCssCache[style.id] = inline;
    return buildFinalHtml();
  }

  async function downloadPageHtml() {
    if (!CPB.state.currentProject) return;
    const html = await buildFinalHtmlAsync();
    const slug = (CPB.state.currentProject.name || 'campaign-page').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    // Build zip
    const zip = new JSZip();
    zip.file(slug + '.html', html);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = slug + '.zip'; a.click();
    URL.revokeObjectURL(url);
    const btn = document.getElementById('downloadBtn');
    btn.classList.add('downloaded');
    btn.querySelector('span:last-child').textContent = 'Downloaded';
    setTimeout(() => {
      btn.classList.remove('downloaded');
      btn.querySelector('span:last-child').textContent = 'Download HTML';
    }, 2000);
  }

  global.buildFinalHtml = buildFinalHtml;
  global.getInlineStyleCss = getInlineStyleCss;
  global.buildFinalHtmlAsync = buildFinalHtmlAsync;
  global.downloadPageHtml = downloadPageHtml;
})(window);