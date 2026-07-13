(function (global) {
  'use strict';

  function renderGallery() {
    const grid = document.getElementById('projectGalleryGrid');
    // Sort by updated desc
    const sorted = [...CPB.state.projects]
      .filter(p => !(p && p.__masScoped))
      .sort((a, b) => (b.updated || 0) - (a.updated || 0));
    let html = `
    <div class="proj-gallery-card proj-gallery-card-new" onclick="openNewProjectModal()">
      <div class="proj-gallery-card-thumb">
        <div class="new-card-content">
          <span class="mi">add_circle</span>
          <span class="new-card-title">Create New Page</span>
        </div>
      </div>
      <div class="proj-gallery-card-info">
        <span class="card-name">Start from a Style</span>
        <span class="card-arrow"><span class="mi">arrow_forward</span></span>
      </div>
    </div>
  `;
    sorted.forEach(p => {
      const style = STYLE_BY_ID[p.styleId] || STYLES[0];
      const dateStr = p.updated ? new Date(p.updated).toLocaleDateString() : '';
      html += `
      <div class="proj-gallery-card" data-pid="${p.id}" onclick="openProject('${p.id}')">
        <div class="card-kebab">
          <button class="card-kebab-btn" onclick="event.stopPropagation(); toggleKebab('${p.id}')" title="More"><span class="mi">more_horiz</span></button>
          <div class="card-kebab-menu" id="kebab-${p.id}">
            <button onclick="event.stopPropagation(); openRenameModal('${p.id}','rename')"><span class="mi">edit</span>Rename</button>
            <button onclick="event.stopPropagation(); openRenameModal('${p.id}','duplicate')"><span class="mi">content_copy</span>Duplicate</button>
            <button class="menu-delete" onclick="event.stopPropagation(); deleteProject('${p.id}')"><span class="mi">delete</span>Delete</button>
          </div>
        </div>
        <div class="proj-gallery-card-thumb" data-preview-pid="${p.id}">
          <span class="thumb-empty">Loading preview...</span>
        </div>
        <div class="proj-gallery-card-info">
          <div>
            <div class="card-name">${escapeHtml(p.name)}</div>
            <div class="card-date">${dateStr} · ${escapeHtml(style.name)}</div>
          </div>
          <span class="card-arrow"><span class="mi">arrow_forward</span></span>
        </div>
      </div>
    `;
    });
    grid.innerHTML = html;
    renderGalleryThumbPreviews(sorted);
  }

  function buildGalleryPreviewSrcdoc(project) {
    const helpers = makeHelpers(project.styleId);
    const fallbackMode = getDefaultSectionModeForStyle(project.styleId);
    (project.sections || []).forEach(s => {
      if (s.mode !== 'light' && s.mode !== 'dark') s.mode = fallbackMode;
    });
    const style = STYLE_BY_ID[project.styleId] || STYLES[0];
    const styleCss = getInlineStyleCss(style.id) || '';
    const fixedCss = (typeof FIXED_CHROME_CSS === 'string') ? FIXED_CHROME_CSS : '';

    const sectionsHtml = (project.sections || []).map(item => {
      const def = SECTION_BY_ID[item.sectionType];
      if (!def) return '';
      let html = def.getHtml(item, helpers);
      if (item.anchorId) html = html.replace(/<(section|nav|footer|div)\b/, `<$1 id="${escapeAttr(item.anchorId)}"`);
      html = html.replace(/\sdata-cpb-edit="[^"]*"/g, '');
      html = html.replace(/\sdata-cpb-edit-cta="[^"]*"/g, '');
      return html;
    }).join('\n');

    const previewCss = `
html, body { margin: 0; padding: 0; overflow: hidden; background: #fff; }
.cpb-thumb-page { width: 1200px; margin: 0 auto; background: #fff; font-family: 'Inter', sans-serif; }
.cpb-thumb-page img { max-width: 100%; height: auto; display: block; }
.mi {
  font-family: 'Material Symbols Rounded','Material Symbols Outlined';
  font-weight: normal; font-style: normal; line-height: 1; display: inline-block;
  white-space: nowrap; word-wrap: normal; direction: ltr;
  -webkit-font-feature-settings: 'liga'; font-feature-settings: 'liga';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
/* Keep fixed chrome readable in tiny thumbnail. */
.cpb-fx-site-header, .cpb-fx-anchor-nav { position: static !important; top: auto !important; }
`;

    const safeSections = sectionsHtml || '<div style="padding:32px;color:#999;font-size:14px;">Empty project</div>';
    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${previewCss}\n${styleCss}\n${fixedCss}</style></head>
<body><div class="cpb-thumb-page" data-style="${style.id}">${safeSections}</div></body></html>`;
  }

  function renderGalleryThumbPreviews(list) {
    list.forEach(project => {
      const thumb = document.querySelector(`.proj-gallery-card-thumb[data-preview-pid="${project.id}"]`);
      if (!thumb) return;
      if (!project.sections || project.sections.length === 0) {
        thumb.innerHTML = '<span class="thumb-empty">Empty project</span>';
        return;
      }
      thumb.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.className = 'thumb-preview-iframe';
      iframe.setAttribute('sandbox', 'allow-same-origin');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('tabindex', '-1');
      iframe.setAttribute('loading', 'lazy');
      iframe.srcdoc = buildGalleryPreviewSrcdoc(project);
      iframe.onload = function () {
        const thumbW = thumb.offsetWidth || 280;
        const scale = (thumbW * 0.7) / 1200;
        const scaledW = 1200 * scale;
        const offsetX = (thumbW - scaledW) / 2;
        this.style.transform = 'scale(' + scale + ')';
        this.style.left = offsetX + 'px';
        this.style.height = (180 / scale) + 'px';
      };
      thumb.appendChild(iframe);
    });
  }

  function buildStyleStarterSections(styleId, maxCount = 4) {
    const defs = (SECTIONS || []).filter(def => !def.fixed).slice(0, maxCount);
    const defaultMode = getDefaultSectionModeForStyle(styleId);
    return defs.map(def => {
      const seed = getSectionSeedFromReferenceProject(styleId, def.id);
      const item = {
        uid: 'preview-' + def.id,
        sectionType: def.id,
        anchorId: '',
        mode: seed?.mode === 'light' || seed?.mode === 'dark' ? seed.mode : defaultMode,
        bg: seed?.bg || def.defaultBg || 'plain',
        layout: seed?.layout || def.defaultLayout,
        options: {},
        edits: {},
      };
      (def.optionMap || []).forEach(o => {
        item.options[o.key] = getOptionDefaultForStyle(def, o.key, styleId);
      });
      (def.editMap || []).forEach(e => {
        item.edits[e.key] = getEditDefaultForStyle(def, e.key, styleId);
      });
      if (seed?.options && typeof seed.options === 'object') {
        Object.keys(seed.options).forEach(k => {
          item.options[k] = seed.options[k];
        });
      }
      if (seed?.edits && typeof seed.edits === 'object') {
        Object.keys(seed.edits).forEach(k => {
          item.edits[k] = seed.edits[k];
        });
      }
      // Starting-style thumb should always show hero with image background.
      if (def.id === 'hero-banner') {
        item.options.heroBgType = 'image';
        if (!item.edits.bgImage) {
          item.edits.bgImage = getEditDefaultForStyle(def, 'bgImage', styleId) || '';
        }
      }
      return item;
    });
  }

  function buildStylePreviewSrcdoc(styleId) {
    const helpers = makeHelpers(styleId);
    const style = STYLE_BY_ID[styleId] || STYLES[0];
    const styleCss = getInlineStyleCss(style.id) || '';
    const fixedCss = (typeof FIXED_CHROME_CSS === 'string') ? FIXED_CHROME_CSS : '';
    const sections = buildStyleStarterSections(style.id, 4);
    const sectionsHtml = sections.map(item => {
      const def = SECTION_BY_ID[item.sectionType];
      if (!def) return '';
      let html = def.getHtml(item, helpers);
      html = html.replace(/\sdata-cpb-edit="[^"]*"/g, '');
      html = html.replace(/\sdata-cpb-edit-cta="[^"]*"/g, '');
      return html;
    }).join('\n');
    const previewCss = `
html, body { margin: 0; padding: 0; overflow: hidden; background: #fff; }
.cpb-thumb-page { width: 1200px; margin: 0 auto; background: #fff; font-family: 'Inter', sans-serif; }
.cpb-thumb-page img { max-width: 100%; height: auto; display: block; }
.mi {
  font-family: 'Material Symbols Rounded','Material Symbols Outlined';
  font-weight: normal; font-style: normal; line-height: 1; display: inline-block;
  white-space: nowrap; word-wrap: normal; direction: ltr;
  -webkit-font-feature-settings: 'liga'; font-feature-settings: 'liga';
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
`;
    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${previewCss}\n${styleCss}\n${fixedCss}</style></head>
<body><div class="cpb-thumb-page" data-style="${style.id}">${sectionsHtml}</div></body></html>`;
  }

  function renderStyleGridThumbPreviews(containerSelector) {
    document.querySelectorAll(`${containerSelector} .style-thumb[data-style-preview-sid]`).forEach(thumb => {
      const sid = thumb.getAttribute('data-style-preview-sid');
      if (!sid) return;
      thumb.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.className = 'style-thumb-preview-iframe';
      iframe.setAttribute('sandbox', 'allow-same-origin');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('tabindex', '-1');
      iframe.setAttribute('loading', 'lazy');
      iframe.srcdoc = buildStylePreviewSrcdoc(sid);
      iframe.onload = function () {
        const thumbW = thumb.offsetWidth || 180;
        const scale = (thumbW * 0.82) / 1200;
        const scaledW = 1200 * scale;
        const offsetX = (thumbW - scaledW) / 2;
        this.style.transform = 'scale(' + scale + ')';
        this.style.left = offsetX + 'px';
        this.style.height = (80 / scale) + 'px';
      };
      thumb.appendChild(iframe);
    });
  }

  function toggleKebab(pid) {
    document.querySelectorAll('.card-kebab-menu').forEach(m => {
      if (m.id === 'kebab-' + pid) m.classList.toggle('open');
      else m.classList.remove('open');
    });
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.card-kebab')) {
      document.querySelectorAll('.card-kebab-menu.open').forEach(m => m.classList.remove('open'));
    }
  });

  function openNewProjectModal() {
    const grid = document.getElementById('styleGrid');
    CPB.state.pickerSelectedStyle = null;
    document.getElementById('newProjectName').value = '';
    const _pf = document.getElementById('newProjectPrefix');
    if (_pf) { _pf.value = ''; delete _pf.dataset.userEdited; }
    const _pfPv = document.getElementById('prefixPreview');
    if (_pfPv) _pfPv.textContent = 'page';
    document.getElementById('newProjectConfirm').disabled = true;
    grid.innerHTML = STYLES.map(s => `
    <div class="style-grid-card" data-sid="${s.id}" onclick="pickStyle('${s.id}')">
      <div class="style-thumb" data-style-preview-sid="${s.id}">
        <span class="style-thumb-fallback">${s.num}</span>
      </div>
      <div class="style-name">${escapeHtml(s.name)}</div>
      <div class="style-desc">${escapeHtml(s.desc)}</div>
    </div>
  `).join('');
    renderStyleGridThumbPreviews('#styleGrid');
    document.getElementById('newProjectModal').classList.add('visible');
    setTimeout(() => document.getElementById('newProjectName').focus(), 100);
  }

  function closeNewProjectModal() {
    document.getElementById('newProjectModal').classList.remove('visible');
  }

  function pickStyle(sid) {
    CPB.state.pickerSelectedStyle = sid;
    document.querySelectorAll('.style-grid-card').forEach(c => c.classList.toggle('selected', c.dataset.sid === sid));
    validateNewProjectForm();
  }

  function openPageSettingsModal() {
    if (!CPB.state.currentProject) return;
    CPB.state.pageSettingsSelectedStyle = CPB.state.currentProject.styleId;

    const nameInput = document.getElementById('pageSettingsName');
    const prefixInput = document.getElementById('pageSettingsPrefix');
    const prefixPreview = document.getElementById('pageSettingsPrefixPreview');
    const storeSelect = document.getElementById('pageSettingsStore');
    const grid = document.getElementById('pageSettingsStyleGrid');

    if (nameInput) nameInput.value = CPB.state.currentProject.name || '';
    if (prefixInput) {
      prefixInput.value = getProjectPrefix();
      delete prefixInput.dataset.userEdited;
    }
    if (prefixPreview) prefixPreview.textContent = getProjectPrefix() || 'page';
    if (storeSelect) storeSelect.value = getCurrentStore();

    const animateInput = document.getElementById('pageSettingsAnimate');
    if (animateInput) animateInput.checked = !!CPB.state.currentProject.animateOnScroll;

    if (grid) {
      grid.innerHTML = STYLES.map(s => `
      <div class="style-grid-card${s.id === CPB.state.pageSettingsSelectedStyle ? ' selected' : ''}" data-sid="${s.id}" onclick="pickPageSettingsStyle('${s.id}')">
        <div class="style-thumb" data-style-preview-sid="${s.id}">
          <span class="style-thumb-fallback">${s.num}</span>
        </div>
        <div class="style-name">${escapeHtml(s.name)}</div>
        <div class="style-desc">${escapeHtml(s.desc)}</div>
      </div>
    `).join('');
      renderStyleGridThumbPreviews('#pageSettingsStyleGrid');
    }

    validatePageSettingsForm();
    document.getElementById('pageSettingsModal').classList.add('visible');
    setTimeout(() => document.getElementById('pageSettingsName')?.focus(), 100);
  }

  function closePageSettingsModal() {
    document.getElementById('pageSettingsModal').classList.remove('visible');
  }

  function pickPageSettingsStyle(sid) {
    CPB.state.pageSettingsSelectedStyle = sid;
    document.querySelectorAll('#pageSettingsStyleGrid .style-grid-card').forEach(c => c.classList.toggle('selected', c.dataset.sid === sid));
    validatePageSettingsForm();
  }

  function validatePageSettingsForm() {
    const name = document.getElementById('pageSettingsName')?.value.trim();
    const btn = document.getElementById('pageSettingsConfirm');
    if (btn) btn.disabled = !(name && CPB.state.pageSettingsSelectedStyle);
  }

  function confirmPageSettings() {
    if (!CPB.state.currentProject) return;
    const name = document.getElementById('pageSettingsName').value.trim();
    if (!name || !CPB.state.pageSettingsSelectedStyle) return;
    const prefixRaw = document.getElementById('pageSettingsPrefix').value.trim();
    const cssPrefix = slugifyPrefix(prefixRaw) || slugifyPrefix(name) || 'page';
    const store = normalizeStoreValue(document.getElementById('pageSettingsStore')?.value);

    CPB.state.currentProject.name = name;
    CPB.state.currentProject.styleId = CPB.state.pageSettingsSelectedStyle;
    CPB.state.currentProject.cssPrefix = cssPrefix;
    CPB.state.currentProject.store = store;
    CPB.state.currentProject.animateOnScroll = !!document.getElementById('pageSettingsAnimate')?.checked;

    document.getElementById('breadcrumbName').textContent = name;
    closePageSettingsModal();
    pushHistory();
    renderCanvas();
    saveCurrentProject(true);
    toast('Page settings updated', 'check_circle');
  }

  document.addEventListener('input', e => {
    if (e.target.id === 'newProjectName') {
      validateNewProjectForm();
      // Auto-fill the prefix preview from the name (only if user hasn't typed a custom prefix)
      const prefixInput = document.getElementById('newProjectPrefix');
      if (prefixInput && !prefixInput.dataset.userEdited) {
        const auto = slugifyPrefix(e.target.value);
        prefixInput.value = auto;
        const preview = document.getElementById('prefixPreview');
        if (preview) preview.textContent = auto || 'page';
      }
    }
    if (e.target.id === 'newProjectPrefix') {
      e.target.dataset.userEdited = '1';
      e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      const preview = document.getElementById('prefixPreview');
      if (preview) preview.textContent = e.target.value || 'page';
    }
    if (e.target.id === 'pageSettingsName') {
      validatePageSettingsForm();
      const prefixInput = document.getElementById('pageSettingsPrefix');
      if (prefixInput && !prefixInput.dataset.userEdited) {
        const auto = slugifyPrefix(e.target.value);
        prefixInput.value = auto;
        const preview = document.getElementById('pageSettingsPrefixPreview');
        if (preview) preview.textContent = auto || 'page';
      }
    }
    if (e.target.id === 'pageSettingsPrefix') {
      e.target.dataset.userEdited = '1';
      e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      const preview = document.getElementById('pageSettingsPrefixPreview');
      if (preview) preview.textContent = e.target.value || 'page';
    }
  });

  function slugifyPrefix(s) {
    let r = String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!r) return '';
    if (/^[0-9]/.test(r)) r = 'p-' + r;
    return r;
  }

  function validateNewProjectForm() {
    const name = document.getElementById('newProjectName').value.trim();
    document.getElementById('newProjectConfirm').disabled = !(name && CPB.state.pickerSelectedStyle);
  }

  function openRenameModal(pid, mode) {
    CPB.state.renameTargetId = pid;
    CPB.state.renameMode = mode;
    const proj = CPB.state.projects.find(p => p.id === pid);
    if (!proj) return;
    document.getElementById('renameIcon').textContent = mode === 'rename' ? 'edit' : 'content_copy';
    document.getElementById('renameTitle').textContent = mode === 'rename' ? 'Rename Project' : 'Duplicate Project';
    document.getElementById('renameDesc').textContent = mode === 'rename' ? 'Enter a new name.' : 'Enter a name for the duplicated project.';
    document.getElementById('renameInput').value = mode === 'rename' ? proj.name : (proj.name + ' (copy)');
    document.getElementById('renameModal').classList.add('visible');
    setTimeout(() => document.getElementById('renameInput').focus(), 100);
  }

  function closeRenameModal() {
    document.getElementById('renameModal').classList.remove('visible');
    CPB.state.renameTargetId = null;
  }

  global.renderGallery = renderGallery;
  global.toggleKebab = toggleKebab;
  global.openNewProjectModal = openNewProjectModal;
  global.closeNewProjectModal = closeNewProjectModal;
  global.pickStyle = pickStyle;
  global.openPageSettingsModal = openPageSettingsModal;
  global.closePageSettingsModal = closePageSettingsModal;
  global.pickPageSettingsStyle = pickPageSettingsStyle;
  global.validatePageSettingsForm = validatePageSettingsForm;
  global.confirmPageSettings = confirmPageSettings;
  global.slugifyPrefix = slugifyPrefix;
  global.validateNewProjectForm = validateNewProjectForm;
  global.openRenameModal = openRenameModal;
  global.closeRenameModal = closeRenameModal;
})(window);
