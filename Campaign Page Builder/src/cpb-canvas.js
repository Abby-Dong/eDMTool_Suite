(function (global) {
  'use strict';

  // ─── Style picker (in builder) ────────────────────────────────────────
  function renderStyleSelect() {
    // Style and prefix are now edited through the Page Setting modal.
  }

  // ─── Section catalog (left) ───────────────────────────────────────────
  function renderSectionCatalog() {
    const list = document.getElementById('builderCompList');
    let html = '';
    const groups = [...SECTION_GROUPS];
    groups.forEach(g => {
      const items = SECTIONS.filter(s => s.group === g.id);
      if (!items.length) return;
      html += `<div class="builder-comp-group">${g.name}</div>`;
      items.forEach(s => {
        html += `
        <div class="builder-comp-item" draggable="true" data-sid="${s.id}">
          ${s.thumb ? `<div class="bci-thumb">${s.thumb}</div>` : '<div class="bci-thumb"></div>'}
          <div class="bci-meta">
            <span class="bci-name">${escapeHtml(s.name)}</span>
          </div>
          <button class="bci-add" title="Add" onclick="addSection('${s.id}')"><span class="mi">add</span></button>
        </div>
      `;
      });
    });
    list.innerHTML = html;
    initDragFromCatalog();
  }

  // ─── Section instance management ──────────────────────────────────────
  // Singletons that are pinned in the page order:
  //   site-header     — always index 0
  //   site-anchor-nav — always directly after Header (or 0 if Header absent)
  //   site-footer     — always last
  const SINGLETON_SECTION_IDS = ['site-header', 'site-anchor-nav', 'site-footer'];

  function isSingletonSid(sid) {
    return SINGLETON_SECTION_IDS.includes(sid);
  }

  function isPinnedItem(it) {
    return it && SINGLETON_SECTION_IDS.includes(it.sectionType);
  }

  function hasSectionType(sid) {
    return CPB.state.currentProject ? CPB.state.currentProject.sections.some(s => s.sectionType === sid) : false;
  }

  function getFooterIdx() {
    return CPB.state.currentProject ? CPB.state.currentProject.sections.findIndex(s => s.sectionType === 'site-footer') : -1;
  }

  function clampInsertIndex(idx, sid) {
    if (!CPB.state.currentProject) return 0;
    const arr = CPB.state.currentProject.sections;
    if (sid === 'site-header') return 0;
    if (sid === 'site-footer') return arr.length;
    if (sid === 'site-anchor-nav') return hasSectionType('site-header') ? 1 : 0;
    // Regular sections: bounded above by Header + Anchor Nav, below by Footer.
    let lo = 0;
    if (hasSectionType('site-header')) lo++;
    if (hasSectionType('site-anchor-nav')) lo++;
    const fIdx = getFooterIdx();
    const hi = fIdx >= 0 ? fIdx : arr.length;
    if (idx == null) idx = hi;
    return Math.max(lo, Math.min(hi, idx));
  }

  function addSection(sid, atIndex) {
    const def = SECTION_BY_ID[sid];
    if (!def || !CPB.state.currentProject) return;
    // Singleton fixed sections — ignore a second add.
    if (isSingletonSid(sid) && hasSectionType(sid)) return;
    const item = newSectionInstance(def);
    const target = clampInsertIndex(typeof atIndex === 'number' ? atIndex : CPB.state.currentProject.sections.length, sid);
    CPB.state.currentProject.sections.splice(target, 0, item);
    CPB.state.selectedSectionUid = item.uid;
    pushHistory();
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
  }

  function getDefaultSectionModeForStyle(styleId) {
    return (typeof STYLE_BY_ID !== 'undefined' && STYLE_BY_ID[styleId]?.defaultMode) || 'light';
  }

  function findDefaultSourceProject(styleId) {
    if (!Array.isArray(CPB.state.projects) || !CPB.state.projects.length) return null;
    const hints = (typeof STYLE_BY_ID !== 'undefined' && Array.isArray(STYLE_BY_ID[styleId]?.seedProjectHints))
      ? STYLE_BY_ID[styleId].seedProjectHints
      : [];
    if (!hints.length) return null;
    const byStyle = CPB.state.projects.filter(p => p && p.styleId === styleId && p.name);
    if (!byStyle.length) return null;
    const matched = byStyle.find(p => {
      const name = String(p.name || '').toLowerCase();
      return hints.some(h => name.includes(String(h).toLowerCase()));
    });
    if (matched) return matched;
    return byStyle.sort((a, b) => (b.updated || 0) - (a.updated || 0))[0] || null;
  }

  function getSectionSeedFromReferenceProject(styleId, sectionType) {
    const proj = findDefaultSourceProject(styleId);
    if (!proj || !Array.isArray(proj.sections)) return null;
    const src = proj.sections.find(s => s && s.sectionType === sectionType);
    if (!src) return null;
    return {
      mode: src.mode,
      bg: src.bg,
      layout: src.layout,
      options: src.options ? JSON.parse(JSON.stringify(src.options)) : null,
      edits: src.edits ? JSON.parse(JSON.stringify(src.edits)) : null,
    };
  }

  function getOptionDefaultForStyle(def, optionKey, styleId) {
    if (!def || !optionKey) return undefined;
    if (def.id === 'product-anchor' && optionKey === 'cardVisual') {
      const styleCardVisual = (typeof STYLE_BY_ID !== 'undefined' && STYLE_BY_ID[styleId]?.defaultCardVisual)
        ? STYLE_BY_ID[styleId].defaultCardVisual
        : undefined;
      if (styleCardVisual) return styleCardVisual;
    }
    const o = (def.optionMap || []).find(x => x.key === optionKey);
    return o?.default;
  }

  function getEditDefaultForStyle(def, editKey, styleId) {
    if (!def || !editKey) return undefined;
    if (def.id === 'hero-banner' && editKey === 'bgImage') {
      const styleHeroDefault = (typeof STYLE_BY_ID !== 'undefined' && STYLE_BY_ID[styleId]?.heroDefaultImage)
        ? STYLE_BY_ID[styleId].heroDefaultImage
        : '';
      if (styleHeroDefault) return styleHeroDefault;
    }
    const e = (def.editMap || []).find(x => x.key === editKey);
    return e?.default;
  }

  const MODE_BG_PRESETS = {
    dark: '#0C0C0C',
    lightPlain: '#F6F7F9',
    lightAlt: '#F6F7F9',
  };

  function sectionSupportsBgColor(def) {
    return !!((def?.editMap || []).find(e => e.key === 'bgColor'));
  }

  function getModeBgPreset(mode, bgVariant) {
    if (mode === 'dark') return MODE_BG_PRESETS.dark;
    return (bgVariant === 'alt') ? MODE_BG_PRESETS.lightAlt : MODE_BG_PRESETS.lightPlain;
  }

  function applyModeBgPresetToSection(item, def, overwrite = false) {
    if (!item || !def || !sectionSupportsBgColor(def)) return;
    if (def.id === 'related-need-help-cta') return;
    item.edits = item.edits && typeof item.edits === 'object' ? item.edits : {};
    const current = String(item.edits.bgColor || '').trim();
    if (overwrite || !current) {
      item.edits.bgColor = getModeBgPreset(item.mode, item.bg);
    }
  }

  function enforceDefaultHeaderVisibilityOptions(item, def) {
    if (!item || !def || !item.options) return;
    const keys = ['showEyebrow', 'showHeadline', 'showSubtitle', 'showDivider', 'showBody'];
    const available = new Set((def.optionMap || []).map(o => o.key));
    keys.forEach(k => {
      if (available.has(k)) item.options[k] = true;
    });
  }

  function normalizeSectionModes() {
    if (!CPB.state.currentProject || !Array.isArray(CPB.state.currentProject.sections)) return;
    const fallback = getDefaultSectionModeForStyle(CPB.state.currentProject.styleId);
    CPB.state.currentProject.sections.forEach(s => {
      if (s.mode !== 'light' && s.mode !== 'dark') s.mode = fallback;
    });
  }

  function newSectionInstance(def) {
    const styleId = CPB.state.currentProject?.styleId;
    const defaultMode = getDefaultSectionModeForStyle(styleId);
    const seed = getSectionSeedFromReferenceProject(styleId, def.id);
    const item = {
      uid: newUid(),
      sectionType: def.id,
      anchorId: '',
      mode: seed?.mode === 'light' || seed?.mode === 'dark' ? seed.mode : defaultMode,
      bg: seed?.bg || def.defaultBg || 'plain',
      layout: seed?.layout || def.defaultLayout,
      options: {},
      edits: {},
    };
    (def.optionMap || []).forEach(o => { item.options[o.key] = getOptionDefaultForStyle(def, o.key, styleId); });
    if (seed?.options && typeof seed.options === 'object') {
      Object.keys(seed.options).forEach(k => {
        item.options[k] = seed.options[k];
      });
    }
    if (seed?.edits && typeof seed.edits === 'object') {
      item.edits = seed.edits;
    }
    if (def.id === 'product-showcase' || def.id === 'product-series-matrix') {
      item.mode = 'dark';
      item.options.heroBgType = 'color';
      item.edits = item.edits && typeof item.edits === 'object' ? item.edits : {};
      item.edits.bgColor = '#000000';
    }
    enforceDefaultHeaderVisibilityOptions(item, def);
    applyModeBgPresetToSection(item, def, false);
    return item;
  }

  function removeSection(uid) {
    if (!CPB.state.currentProject) return;
    CPB.state.currentProject.sections = CPB.state.currentProject.sections.filter(s => s.uid !== uid);
    if (CPB.state.selectedSectionUid === uid) CPB.state.selectedSectionUid = null;
    pushHistory();
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
  }

  function moveSection(uid, dir) {
    if (!CPB.state.currentProject) return;
    const arr = CPB.state.currentProject.sections;
    const i = arr.findIndex(s => s.uid === uid);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    // Pinned singletons (Header / Anchor Nav / Footer) cannot be reordered,
    // and no other section may swap across them.
    if (isPinnedItem(arr[i]) || isPinnedItem(arr[j])) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    pushHistory();
    renderCanvas();
    saveCurrentProject(true);
  }

  function duplicateSection(uid) {
    if (!CPB.state.currentProject) return;
    const idx = CPB.state.currentProject.sections.findIndex(s => s.uid === uid);
    if (idx < 0) return;
    const copy = JSON.parse(JSON.stringify(CPB.state.currentProject.sections[idx]));
    copy.uid = newUid();
    copy.anchorId = ''; // anchor must be unique
    CPB.state.currentProject.sections.splice(idx + 1, 0, copy);
    CPB.state.selectedSectionUid = copy.uid;
    pushHistory();
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
  }

  function selectSection(uid) {
    CPB.state.selectedSectionUid = uid;
    document.querySelectorAll('.builder-stack-item').forEach(el => el.classList.toggle('selected', el.dataset.uid === uid));
    renderProperties();
  }

  // ─── Render Canvas ────────────────────────────────────────────────────
  function renderCanvas() {
    const canvas = document.getElementById('builderCanvas');
    if (!CPB.state.currentProject) {
      canvas.innerHTML = '';
      return;
    }
    normalizeSectionModes();

    if (!CPB.state.currentProject.sections.length) {
      canvas.innerHTML = `
      <div class="builder-empty">
        <span class="mi">view_module</span>
        <h4>Empty page</h4>
        <p>Drag a Section from the left panel, or click the + button.</p>
      </div>
    `;
      initCanvasDropZone();
      return;
    }

    const helpers = makeHelpers();
    const sectionsHtml = CPB.state.currentProject.sections.map(item => {
      const def = SECTION_BY_ID[item.sectionType];
      if (!def) return '';
      const inner = def.getHtml(item, helpers);
      const anchorTag = item.anchorId ? `<div class="bsi-anchor-tag">#${escapeHtml(item.anchorId)}</div>` : '';
      return `
      <div class="builder-stack-item ${item.uid === CPB.state.selectedSectionUid ? 'selected' : ''}" data-uid="${item.uid}" ${item.anchorId ? 'id="'+escapeAttr(item.anchorId)+'"' : ''}>
        ${anchorTag}
        <div class="bsi-toolbar">
          <button class="bsi-btn-move" title="Move up" onclick="event.stopPropagation(); moveSection('${item.uid}', -1)"><span class="mi">arrow_upward</span></button>
          <button class="bsi-btn-move" title="Move down" onclick="event.stopPropagation(); moveSection('${item.uid}', 1)"><span class="mi">arrow_downward</span></button>
          <button class="bsi-btn-dup" title="Duplicate" onclick="event.stopPropagation(); duplicateSection('${item.uid}')"><span class="mi">content_copy</span></button>
          <button class="bsi-btn-del" title="Delete" onclick="event.stopPropagation(); removeSection('${item.uid}')"><span class="mi">delete</span></button>
        </div>
        <div class="bsi-content">${inner}</div>
      </div>
    `;
    }).join('');

    canvas.innerHTML = `
    <div class="builder-drop-line" id="dropLine"></div>
    <div class="cpb-page-stage">
      <div class="cpb-page" data-style="${CPB.state.currentProject.styleId}">
        ${sectionsHtml}
      </div>
    </div>
  `;
    applyPreviewScale();
    // Wire selection
    canvas.querySelectorAll('.builder-stack-item').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('[contenteditable]') || e.target.closest('img[data-cpb-edit]')) return;
        selectSection(el.dataset.uid);
      });
    });
    setupInlineEditing();
    scheduleP3SeriesIntroHeightSync(canvas);
    initCanvasDropZone();
  }

  // ─── Helpers passed to section getHtml ────────────────────────────────
  function makeHelpers(styleIdOverride) {
    const styleIdCtx = styleIdOverride || CPB.state.currentProject?.styleId;
    return {
      editAttr: (item, keyPath) => `data-cpb-edit="${item.uid}:${keyPath}"`,
      editText: (item, keyPath, fb) => {
        const val = resolveEdit(item, keyPath);
        if (val !== undefined) return _isCtaTextKeyPath(keyPath) ? _normalizeCtaText(val) : val;
        const defVal = getDefaultEdit(item, keyPath, styleIdCtx) ?? (fb || '');
        return _isCtaTextKeyPath(keyPath) ? _normalizeCtaText(defVal) : defVal;
      },
      editImg: (item, keyPath, fb) => {
        const val = resolveEdit(item, keyPath);
        if (val !== undefined) return val;
        return getDefaultEdit(item, keyPath, styleIdCtx) ?? (fb || '');
      },
      editList: (item, key) => {
        const val = item.edits[key];
        if (Array.isArray(val)) return val;
        const def = SECTION_BY_ID[item.sectionType];
        const editDef = (def.editMap || []).find(e => e.key === key);
        return editDef?.default || [];
      },
      iconHtml: (name) => {
        const v = String(name || '').trim();
        if (/^(https?:|data:|\/)/.test(v)) return `<img src="${v}" alt="">`;
        return `<div class="mi">${v}</div>`;
      },
      opt: (item, key) => {
        if (item.options[key] !== undefined) return item.options[key];
        const def = SECTION_BY_ID[item.sectionType];
        return getOptionDefaultForStyle(def, key, styleIdCtx);
      },
    };
  }

  function resolveEdit(item, keyPath) {
    const parts = keyPath.split('.');
    if (parts.length === 1) return item.edits[parts[0]];
    // Nested into list — resolve from item.edits[listKey][idx][subKey]
    const list = item.edits[parts[0]];
    if (!list) return undefined;
    const cur = list[parseInt(parts[1], 10)];
    if (!cur) return undefined;
    if (parts.length === 2) return cur;
    if (parts.length === 3) return cur[parts[2]];
    return undefined;
  }

  function getDefaultEdit(item, keyPath, styleIdOverride) {
    const def = SECTION_BY_ID[item.sectionType];
    const parts = keyPath.split('.');
    const baseDefault = getEditDefaultForStyle(def, parts[0], styleIdOverride || CPB.state.currentProject?.styleId);
    if (baseDefault === undefined) return undefined;
    if (parts.length === 1) return baseDefault;
    const list = baseDefault || [];
    const cur = list[parseInt(parts[1], 10)];
    if (!cur) return undefined;
    if (parts.length === 2) return cur;
    if (parts.length === 3) return cur[parts[2]];
    return undefined;
  }

  // ─── Drag & drop ──────────────────────────────────────────────────────
  let dragSourceSid = null;
  let dragSourceUid = null;

  function initDragFromCatalog() {
    document.querySelectorAll('.builder-comp-item[draggable="true"]').forEach(el => {
      el.addEventListener('dragstart', e => {
        dragSourceSid = el.dataset.sid;
        dragSourceUid = null;
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', dragSourceSid);
      });
      el.addEventListener('dragend', () => {
        dragSourceSid = null;
        hideDropLine();
        document.getElementById('builderCanvas').classList.remove('drag-over');
      });
    });
  }

  function initCanvasDropZone() {
    const canvas = document.getElementById('builderCanvas');
    canvas.ondragover = e => {
      if (!dragSourceSid && !dragSourceUid) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = dragSourceSid ? 'copy' : 'move';
      canvas.classList.add('drag-over');
      showDropLine(e.clientY);
    };
    canvas.ondragleave = e => {
      if (!canvas.contains(e.relatedTarget)) {
        canvas.classList.remove('drag-over');
        hideDropLine();
      }
    };
    canvas.ondrop = e => {
      e.preventDefault();
      canvas.classList.remove('drag-over');
      const idx = computeDropIndex(e.clientY);
      if (dragSourceSid) {
        addSection(dragSourceSid, idx);
      } else if (dragSourceUid) {
        moveSectionToIndex(dragSourceUid, idx);
      }
      hideDropLine();
      dragSourceSid = null;
      dragSourceUid = null;
    };
  }

  function computeDropIndex(y) {
    if (!CPB.state.currentProject) return 0;
    const items = [...document.querySelectorAll('.builder-stack-item')];
    for (let i = 0; i < items.length; i++) {
      const r = items[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) return i;
    }
    return items.length;
  }

  function showDropLine(y) {
    const line = document.getElementById('dropLine');
    if (!line) return;
    const idx = computeDropIndex(y);
    const items = [...document.querySelectorAll('.builder-stack-item')];
    const canvas = document.getElementById('builderCanvas');
    const canvasRect = canvas.getBoundingClientRect();
    let top;
    if (items.length === 0) {
      top = 24;
    } else if (idx >= items.length) {
      const last = items[items.length - 1].getBoundingClientRect();
      top = last.bottom - canvasRect.top + canvas.scrollTop;
    } else {
      const r = items[idx].getBoundingClientRect();
      top = r.top - canvasRect.top + canvas.scrollTop;
    }
    // Move drop line into builder canvas at correct position
    const page = canvas.querySelector('.cpb-page');
    if (page) {
      page.style.position = 'relative';
      line.style.position = 'absolute';
      line.style.top = (top - 2) + 'px';
      line.style.left = '50%';
      line.style.transform = 'translateX(-50%)';
      line.classList.add('visible');
    }
  }

  function hideDropLine() {
    const line = document.getElementById('dropLine');
    if (line) line.classList.remove('visible');
  }

  function moveSectionToIndex(uid, newIdx) {
    const arr = CPB.state.currentProject.sections;
    const i = arr.findIndex(s => s.uid === uid);
    if (i < 0) return;
    // Pinned singletons cannot be repositioned by drag.
    if (isPinnedItem(arr[i])) return;
    const [item] = arr.splice(i, 1);
    let target = newIdx > i ? newIdx - 1 : newIdx;
    target = clampInsertIndex(target, item.sectionType);
    arr.splice(target, 0, item);
    pushHistory();
    renderCanvas();
    saveCurrentProject(true);
  }

  // ─── Preview width (1600 / 1200 / 800 / 480) ──────────────────────────
  let currentPreviewWidth = 1600;

  function setPreviewWidth(w) {
    currentPreviewWidth = w;
    document.querySelectorAll('#builderDeviceToggle button').forEach(b => {
      b.classList.toggle('active', String(b.dataset.w) === String(w));
    });
    applyPreviewScale();
  }

  function applyPreviewScale() {
    const canvas = document.getElementById('builderCanvas');
    if (!canvas) return;
    const cs = getComputedStyle(canvas);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const avail = Math.max(320, canvas.clientWidth - padL - padR);
    const scale = Math.min(1, avail / currentPreviewWidth);
    canvas.style.setProperty('--preview-width', currentPreviewWidth + 'px');
    canvas.style.setProperty('--preview-scale', scale.toFixed(4));

    // Compute section left/right padding from the *preview* width using the
    // same breakpoints the exported Style CSS uses, so the builder doesn't
    // leak the host browser's vw into the preview.
    const w = currentPreviewWidth;
    let padX;
    if (w >= 1400) padX = (w * 0.09) + 'px';
    else if (w >= 1025) padX = (w * 0.04) + 'px';
    else if (w >= 768) padX = '32px';
    else padX = (w * 0.06) + 'px';
    canvas.style.setProperty('--preview-pad-x', padX);
    refreshBuilderResponsiveStyle();
  }

  // ─── Builder preview RWD resolver ─────────────────────────────────────
  // In the editor canvas we must preview responsive behavior against the chosen
  // preview width (1600/1200/800/480), not the host browser viewport.
  // We resolve @media blocks in the style CSS using currentPreviewWidth and
  // convert vw units to use --preview-width so the preview is deterministic.
  function mediaMatchesPreviewWidth(cond, width) {
    const groups = String(cond || '').split(',');
    return groups.some(group => {
      const q = group.toLowerCase();
      const mins = [...q.matchAll(/\(\s*min-width\s*:\s*([0-9.]+)px\s*\)/g)].map(m => parseFloat(m[1]));
      const maxs = [...q.matchAll(/\(\s*max-width\s*:\s*([0-9.]+)px\s*\)/g)].map(m => parseFloat(m[1]));
      let ok = true;
      mins.forEach(v => {
        if (width < v) ok = false;
      });
      maxs.forEach(v => {
        if (width > v) ok = false;
      });
      // If no width constraints exist, treat as matched in builder preview.
      return ok;
    });
  }

  function resolveCssForPreviewWidth(css, width) {
    if (!css) return '';
    let out = '';
    let i = 0;
    while (i < css.length) {
      const at = css.indexOf('@media', i);
      if (at === -1) {
        out += css.slice(i);
        break;
      }
      out += css.slice(i, at);
      const open = css.indexOf('{', at);
      if (open === -1) {
        out += css.slice(at);
        break;
      }
      const cond = css.slice(at + 6, open).trim();
      let depth = 1;
      let j = open + 1;
      while (j < css.length && depth > 0) {
        const ch = css[j];
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        j++;
      }
      const body = css.slice(open + 1, j - 1);
      if (mediaMatchesPreviewWidth(cond, width)) out += body;
      i = j;
    }
    // Make vw units depend on preview width instead of host viewport width.
    return out.replace(/(-?\d*\.?\d+)vw\b/g, 'calc(var(--preview-width, 1200px) * $1 / 100)');
  }

  function refreshBuilderResponsiveStyle() {
    let tag = document.getElementById('cpbPreviewResolvedStyle');
    if (!tag) {
      tag = document.createElement('style');
      tag.id = 'cpbPreviewResolvedStyle';
      document.head.appendChild(tag);
    }
    if (!CPB.state.currentProject) {
      tag.textContent = '';
      return;
    }
    const raw = getInlineStyleCss(CPB.state.currentProject.styleId);
    const fixed = (typeof FIXED_CHROME_CSS === 'string') ? FIXED_CHROME_CSS : '';
    tag.textContent = resolveCssForPreviewWidth(raw + '\n' + fixed, currentPreviewWidth);
  }

  // Get the active CSS prefix for the current project (with fallback for older CPB.state.projects).
  function getProjectPrefix() {
    if (!CPB.state.currentProject) return 'cpb';
    if (!CPB.state.currentProject.cssPrefix) {
      // Backward-compat: derive on the fly the first time we see an old project.
      CPB.state.currentProject.cssPrefix = slugifyPrefix(CPB.state.currentProject.name) || 'page';
      saveProjects();
    }
    return CPB.state.currentProject.cssPrefix;
  }

  window.addEventListener('resize', () => applyPreviewScale());

  global.renderStyleSelect = renderStyleSelect;
  global.renderSectionCatalog = renderSectionCatalog;

  global.SINGLETON_SECTION_IDS = SINGLETON_SECTION_IDS;
  global.isSingletonSid = isSingletonSid;
  global.isPinnedItem = isPinnedItem;
  global.hasSectionType = hasSectionType;
  global.getFooterIdx = getFooterIdx;
  global.clampInsertIndex = clampInsertIndex;
  global.addSection = addSection;

  global.getDefaultSectionModeForStyle = getDefaultSectionModeForStyle;
  global.findDefaultSourceProject = findDefaultSourceProject;
  global.getSectionSeedFromReferenceProject = getSectionSeedFromReferenceProject;
  global.getOptionDefaultForStyle = getOptionDefaultForStyle;
  global.getEditDefaultForStyle = getEditDefaultForStyle;

  global.sectionSupportsBgColor = sectionSupportsBgColor;
  global.getModeBgPreset = getModeBgPreset;
  global.applyModeBgPresetToSection = applyModeBgPresetToSection;
  global.normalizeSectionModes = normalizeSectionModes;
  global.newSectionInstance = newSectionInstance;

  global.removeSection = removeSection;
  global.moveSection = moveSection;
  global.duplicateSection = duplicateSection;
  global.selectSection = selectSection;
  global.renderCanvas = renderCanvas;
  global.makeHelpers = makeHelpers;
  global.resolveEdit = resolveEdit;
  global.getDefaultEdit = getDefaultEdit;

  global.initDragFromCatalog = initDragFromCatalog;
  global.initCanvasDropZone = initCanvasDropZone;
  global.computeDropIndex = computeDropIndex;
  global.showDropLine = showDropLine;
  global.hideDropLine = hideDropLine;
  global.moveSectionToIndex = moveSectionToIndex;

  global.setPreviewWidth = setPreviewWidth;
  global.applyPreviewScale = applyPreviewScale;
  global.mediaMatchesPreviewWidth = mediaMatchesPreviewWidth;
  global.resolveCssForPreviewWidth = resolveCssForPreviewWidth;
  global.refreshBuilderResponsiveStyle = refreshBuilderResponsiveStyle;

  global.getProjectPrefix = getProjectPrefix;
})(window);
