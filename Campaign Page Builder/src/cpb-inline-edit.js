(function (global) {
  'use strict';

// ─── Inline editing setup ─────────────────────────────────────────────
function _lockInlineCtaIcons(editableEl) {
  if (!editableEl) return;
  const path = editableEl.getAttribute('data-cpb-edit') || '';
  if (!_isCtaTextKeyPath(path)) return;
  editableEl.querySelectorAll('.mi').forEach(icon => {
    icon.setAttribute('contenteditable', 'false');
    icon.setAttribute('draggable', 'false');
    icon.setAttribute('data-cpb-locked-icon', 'true');
    icon.setAttribute('aria-hidden', 'true');
  });
}

function setupInlineEditing() {
  // Text edits
  document.querySelectorAll('[data-cpb-edit]').forEach(el => {
    if (el.tagName === 'IMG') return;
    el.setAttribute('contenteditable', 'true');
    _lockInlineCtaIcons(el);
    el.addEventListener('click', e => {
      if (e.currentTarget.closest('a')) e.preventDefault();
      e.stopPropagation();
    });
    el.addEventListener('input', onInlineEdit);
    el.addEventListener('blur', onInlineEditBlur);
    el.addEventListener('keydown', onInlineEditKey);
    el.addEventListener('mouseup', onInlineSelection);
    el.addEventListener('keyup', onInlineSelection);
  });
  // Image edits
  document.querySelectorAll('img[data-cpb-edit]').forEach(img => {
    img.addEventListener('click', onImageEditClick);
  });
  // Icon edits — click an icon container to open the icon picker
  document.querySelectorAll('[data-cpb-edit-icon]').forEach(el => {
    el.addEventListener('click', onIconEditClick);
  });
  // Hero CTA edits — click button to open CTA editor panel
  document.querySelectorAll('[data-cpb-edit-cta]').forEach(el => {
    el.addEventListener('click', onCtaEditClick);
  });
  // Feature Gallery card edits — click card to open floating card editor.
  document.querySelectorAll('[data-cpb-edit-gallery-card]').forEach(el => {
    el.addEventListener('click', onGalleryCardEditClick);
  });
  // Product Anchor card edits — click card to open floating card editor.
  document.querySelectorAll('[data-cpb-edit-product-anchor-card]').forEach(el => {
    el.addEventListener('click', onProductAnchorCardEditClick);
  });
  // Product Showcase card edits — click card to open floating card editor.
  document.querySelectorAll('[data-cpb-edit-product-showcase-card]').forEach(el => {
    el.addEventListener('click', onProductShowcaseCardEditClick);
  });
  // Related Content card edits — click card to open floating card editor.
  document.querySelectorAll('[data-cpb-edit-related-content-card]').forEach(el => {
    el.addEventListener('click', onRelatedContentCardEditClick);
  });
  // Product Series Matrix edits — click series intro or product card.
  document.querySelectorAll('[data-cpb-edit-product-series-card]').forEach(el => {
    el.addEventListener('click', onProductSeriesMatrixSeriesEditClick);
  });
  document.querySelectorAll('[data-cpb-edit-product-series-item]').forEach(el => {
    el.addEventListener('click', onProductSeriesMatrixItemEditClick);
  });
  // Product Rich Content partner logos are edited via popup.
  document.querySelectorAll('[data-cpb-edit-prc-partner]').forEach(el => {
    el.addEventListener('click', onPrcPartnerLogoEditClick);
  });
}
let _p3SeriesHeightSyncTimer = 0;
function _setEditPopoverOverlayOpen(open) {
  const overlay = document.getElementById('editPopoverOverlay');
  if (!overlay) return;
  overlay.classList.toggle('open', !!open);
}
function syncP3SeriesIntroHeights(root = document) {
  const sections = root.querySelectorAll('.cpb-product-series-section');
  sections.forEach(section => {
    const intros = [...section.querySelectorAll('.cpb-product-series-intro')];
    if (!intros.length) return;
    intros.forEach(el => el.style.removeProperty('--cpb-p3-intro-equal-height'));
    let maxHeight = 0;
    intros.forEach(el => {
      const h = Math.ceil(el.getBoundingClientRect().height || 0);
      if (h > maxHeight) maxHeight = h;
    });
    if (!maxHeight) return;
    intros.forEach(el => el.style.setProperty('--cpb-p3-intro-equal-height', `${maxHeight}px`));
  });
}
function scheduleP3SeriesIntroHeightSync(root = document) {
  if (_p3SeriesHeightSyncTimer) window.clearTimeout(_p3SeriesHeightSyncTimer);
  _p3SeriesHeightSyncTimer = window.setTimeout(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => syncP3SeriesIntroHeights(root)));
  }, 0);
}
function onIconEditClick(e) {
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-icon');
  if (!path) return;
  const [uid, keyPath] = path.split(':');
  openCpbIconPicker(uid, keyPath, el);
}
function _heroCtaFieldMap(slot) {
  if (slot === 'cta1') return { textKey: 'cta1Text', urlKey: 'cta1Url', styleKey: 'cta1Style', iconKey: 'cta1HasIcon', iconNameKey: 'cta1Icon', iconPosKey: 'cta1IconPos' };
  if (slot === 'cta2') return { textKey: 'cta2Text', urlKey: 'cta2Url', styleKey: 'cta2Style', iconKey: 'cta2HasIcon', iconNameKey: 'cta2Icon', iconPosKey: 'cta2IconPos' };
  return null;
}
function _cardCtaFieldMap(index) {
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0) return null;
  return { textKey: `cards.${i}.ctaText`, urlKey: `cards.${i}.ctaUrl`, iconKey: `cards.${i}.ctaHasIcon`, enabledKey: `cards.${i}.ctaEnabled`, index: i };
}
function _ctaIconPreviewHtml(iconVal) {
  const icon = String(iconVal || '').trim();
  if (!icon) return '<span class="mi">arrow_forward</span>';
  if (/^(https?:|data:|\/)/.test(icon)) return `<img src="${escapeAttr(icon)}" alt="">`;
  return `<span class="mi">${escapeHtml(icon)}</span>`;
}
function _positionEditPopoverNearTarget(pop, targetEl, opts = {}) {
  if (!pop || !targetEl) return;
  const viewportPadding = Number(opts.viewportPadding ?? 8);
  const anchorGap = Number(opts.anchorGap ?? 6);

  const r = targetEl.getBoundingClientRect();
  const popRect = pop.getBoundingClientRect();
  const popWidth = Math.max(0, popRect.width || 0);
  const popHeight = Math.max(0, popRect.height || 0);

  // Default: attach tightly below the clicked object.
  let top = r.bottom + anchorGap;
  const belowBottom = top + popHeight;
  const viewportBottom = window.innerHeight - viewportPadding;

  // If clipped below, flip above only when needed.
  if (belowBottom > viewportBottom) {
    const aboveTop = r.top - popHeight - anchorGap;
    if (aboveTop >= viewportPadding) {
      top = aboveTop;
    } else {
      top = Math.max(viewportPadding, viewportBottom - popHeight);
    }
  }

  const minLeft = viewportPadding;
  const maxLeft = Math.max(viewportPadding, window.innerWidth - popWidth - viewportPadding);
  const left = Math.min(maxLeft, Math.max(minLeft, r.left));

  pop.style.top = `${Math.round(top)}px`;
  pop.style.left = `${Math.round(left)}px`;
}
function onGalleryCardEditClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-gallery-card');
  if (!path) return;
  const [uid, slot] = path.split(':');
  const match = /^items\.(\d+)$/.exec(slot || '');
  if (!match) return;
  const idx = Number(match[1]);
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;

  const row = resolveEdit(item, `items.${idx}`) || getDefaultEdit(item, `items.${idx}`) || {};
  const tag = String(row.tag || '');
  const title = String(row.title || '');
  const desc = String(row.desc || '');
  const image = String(row.image || '');
  const showCta = String(row.ctaEnabled ?? ((row.ctaLink && row.ctaLink !== '#') ? 'true' : 'false')) === 'true';
  const ctaText = _normalizeCtaText(String(row.ctaText || 'Learn more')) || 'Learn more';
  const ctaLink = String(row.ctaLink || '#');
  const pop = document.getElementById('editPopover');
  pop.style.maxWidth = '700px';
  pop.style.width = 'min(88vw, 700px)';
  pop.style.top = '50%';
  pop.style.left = '50%';
  pop.style.transform = 'translate(-50%, -50%)';
  pop.innerHTML = `
    <div class="gallery-edit-popup">
    <div class="edit-popover-title">Edit Gallery Card</div>
    <div class="gallery-card-editor-layout">
      <div>
        <div class="edit-popover-row">
          <label>Tag</label>
          <input type="text" id="popGalleryTag" value="${escapeAttr(tag)}" maxlength="60" />
        </div>
        <div class="edit-popover-row">
          <label>Title</label>
          <input type="text" id="popGalleryTitle" value="${escapeAttr(title)}" maxlength="120" />
        </div>
        <div class="edit-popover-row">
          <label>Description</label>
          <textarea id="popGalleryDesc" rows="5" style="width:100%;resize:vertical;border:1px solid #d5dae0;border-radius:6px;padding:8px 10px;font-family:inherit;font-size:12px;line-height:1.45;color:#333;">${escapeHtml(desc)}</textarea>
        </div>
        <div class="sidebar-toggle-ctrl" style="margin-top:8px;">
          <span class="ctrl-label">Show CTA</span>
          <label class="toggle-switch">
            <input type="checkbox" id="popGalleryShowCta" ${showCta ? 'checked' : ''} onchange="toggleGalleryCtaPopupFields(this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div id="popGalleryCtaControls" style="${showCta ? '' : 'display:none;'}">
          <div style="border-top:1px solid #e5e7eb;margin:12px 0;"></div>
          <div class="edit-popover-row">
            <label>CTA Text</label>
            <input type="text" id="popGalleryCtaText" value="${escapeAttr(ctaText)}" maxlength="80" />
          </div>
          <div class="edit-popover-row">
            <label>CTA Link</label>
            <input type="url" id="popGalleryCtaLink" value="${escapeAttr(ctaLink)}" placeholder="https://..." />
          </div>
        </div>
      </div>
      <div>
        <div class="gallery-card-editor-preview is-background" id="popGalleryPreview">
          ${image ? `<img src="${escapeAttr(image)}" alt="" onload="showGalleryPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popGalleryImgDims');if(d)d.textContent='';">` : `<span class="preview-placeholder">No image selected</span>`}
        </div>
        <div class="gallery-card-editor-meta" id="popGalleryImgDims"></div>
        <div class="edit-popover-row" style="margin-top:10px;">
          <label>Background image URL</label>
          <input type="url" id="popGalleryImageUrl" value="${escapeAttr(image)}" placeholder="https://..." oninput="updateGalleryImagePreview(this.value)" />
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button type="button" class="cpb-icon-upload-btn" style="flex:1;justify-content:center;" onclick="openSceneLibraryForInput('popGalleryImageUrl', this)"><span class="mi">photo_library</span>Image Library</button>
            <button type="button" class="pop-upload-btn" style="flex:1;justify-content:center;" onclick="uploadImageToInput('popGalleryImageUrl')"><span class="mi">upload</span>Upload</button>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-popover-actions">
      <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
      <button class="pop-save" onclick="commitGalleryCardEdit('${uid}',${idx})">Save</button>
    </div>
    </div>
  `;

  pop.classList.add('visible');
  _setEditPopoverOverlayOpen(true);
}
function onProductAnchorCardEditClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-product-anchor-card');
  if (!path) return;
  const [uid, slot] = path.split(':');
  const match = /^items\.(\d+)$/.exec(slot || '');
  if (!match) return;
  openProductAnchorCardEdit(uid, Number(match[1]));
  _setEditPopoverOverlayOpen(true);
}
function onProductShowcaseCardEditClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-product-showcase-card');
  if (!path) return;
  const [uid, slot] = path.split(':');
  const match = /^((?:cards|products))\.(\d+)$/.exec(slot || '');
  if (!match) return;
  openProductShowcaseCardEdit(uid, Number(match[2]), match[1]);
  _setEditPopoverOverlayOpen(true);
}
function onRelatedContentCardEditClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-related-content-card');
  if (!path) return;
  const [uid, slot] = path.split(':');
  const match = /^cards\.(\d+)$/.exec(slot || '');
  if (!match) return;
  openRelatedContentCardEdit(uid, Number(match[1]));
  _setEditPopoverOverlayOpen(true);
}
function onProductSeriesMatrixSeriesEditClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-product-series-card');
  if (!path) return;
  const [uid, slot] = path.split(':');
  const match = /^series\.(\d+)$/.exec(slot || '');
  if (!match) return;
  openProductSeriesMatrixSeriesEdit(uid, Number(match[1]));
  _setEditPopoverOverlayOpen(true);
}
function onProductSeriesMatrixItemEditClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-product-series-item');
  if (!path) return;
  const [uid, slot] = path.split(':');
  const match = /^products\.(\d+)$/.exec(slot || '');
  if (!match) return;
  openProductSeriesMatrixItemEdit(uid, Number(match[1]));
  _setEditPopoverOverlayOpen(true);
}
function onPrcPartnerLogoEditClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-prc-partner');
  if (!path) return;
  const [uid, slot] = path.split(':');
  const match = /^partnerLogos\.(\d+)$/.exec(slot || '');
  if (!match) return;
  openPrcPartnerLogoEdit(uid, Number(match[1]));
  _setEditPopoverOverlayOpen(true);
}
function showPrcPartnerPreviewDimensions(img) {
  const dims = document.getElementById('popPrcPartnerImgDims');
  if (dims) dims.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
  _setEditPopoverOverlayOpen(true);
}
function updatePrcPartnerImagePreview(url) {
  const box = document.getElementById('popPrcPartnerPreview');
  const dims = document.getElementById('popPrcPartnerImgDims');
  if (!box) return;
  const next = String(url || '').trim();
  if (!next) {
    box.innerHTML = '<span class="preview-placeholder">No image selected</span>';
    if (dims) dims.textContent = '';
    return;
  }
  box.innerHTML = `<img src="${escapeAttr(next)}" alt="" onload="showPrcPartnerPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popPrcPartnerImgDims');if(d)d.textContent='';">`;
  _setEditPopoverOverlayOpen(true);
}
function openPrcPartnerLogoEdit(uid, index) {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const idx = Number(index);
  if (!Number.isInteger(idx) || idx < 0) return;
  const row = resolveEdit(item, `partnerLogos.${idx}`) || getDefaultEdit(item, `partnerLogos.${idx}`) || {};
  const name = String(row.name || '');
  const image = String(row.image || '');

  const pop = document.getElementById('editPopover');
  pop.style.maxWidth = '640px';
  pop.style.width = 'min(86vw, 640px)';
  pop.style.top = '50%';
  pop.style.left = '50%';
  pop.style.transform = 'translate(-50%, -50%)';
  pop.innerHTML = `
    <div class="gallery-edit-popup">
    <div class="edit-popover-title">Edit Partner Logo</div>
    <div class="gallery-card-editor-layout">
      <div>
        <div class="edit-popover-row">
          <label>Logo name</label>
          <input type="text" id="popPrcPartnerName" value="${escapeAttr(name)}" placeholder="e.g. NVIDIA" />
        </div>
        <div class="edit-popover-row">
          <label>Partner logo image URL</label>
          <input type="url" id="popPrcPartnerImageUrl" value="${escapeAttr(image)}" placeholder="https://..." oninput="updatePrcPartnerImagePreview(this.value)" />
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button type="button" class="cpb-icon-upload-btn" style="flex:1;justify-content:center;" onclick="openSceneLibraryForInput('popPrcPartnerImageUrl', this)"><span class="mi">photo_library</span>Image Library</button>
            <button type="button" class="pop-upload-btn" style="flex:1;justify-content:center;" onclick="uploadImageToInput('popPrcPartnerImageUrl')"><span class="mi">upload</span>Upload</button>
          </div>
        </div>
      </div>
      <div>
        <div class="gallery-card-editor-preview is-fit-content" id="popPrcPartnerPreview">
          ${image ? `<img src="${escapeAttr(image)}" alt="" onload="showPrcPartnerPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popPrcPartnerImgDims');if(d)d.textContent='';">` : `<span class="preview-placeholder">No image selected</span>`}
        </div>
        <div class="gallery-card-editor-meta" id="popPrcPartnerImgDims"></div>
      </div>
    </div>
    <div class="edit-popover-actions">
      <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
      <button class="pop-save" onclick="commitPrcPartnerLogoEdit('${uid}',${idx})">Save</button>
    </div>
    </div>
  `;
  pop.classList.add('visible');
  _setEditPopoverOverlayOpen(true);
}
function commitPrcPartnerLogoEdit(uid, index) {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const prev = resolveEdit(item, `partnerLogos.${index}`) || getDefaultEdit(item, `partnerLogos.${index}`) || {};
  const next = {
    ...prev,
    name: (document.getElementById('popPrcPartnerName')?.value || '').trim(),
    image: (document.getElementById('popPrcPartnerImageUrl')?.value || '').trim(),
  };
  setListItem(uid, 'partnerLogos', index, next);
  hideEditPopover();
}
function showGalleryPreviewDimensions(img) {
  const dims = document.getElementById('popGalleryImgDims');
  if (dims) dims.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
}
function updateGalleryImagePreview(url) {
  const box = document.getElementById('popGalleryPreview');
  const dims = document.getElementById('popGalleryImgDims');
  if (!box) return;
  const next = String(url || '').trim();
  if (!next) {
    box.innerHTML = '<span class="preview-placeholder">No image selected</span>';
    if (dims) dims.textContent = '';
    return;
  }
  box.innerHTML = `<img src="${escapeAttr(next)}" alt="" onload="showGalleryPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popGalleryImgDims');if(d)d.textContent='';">`;
}
function openProductAnchorCardEdit(uid, index) {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const idx = Number(index);
  if (!Number.isInteger(idx) || idx < 0) return;
  const row = resolveEdit(item, `items.${idx}`) || getDefaultEdit(item, `items.${idx}`) || {};
  const anchor = String(row.anchor || `product${String(idx + 1).padStart(2, '0')}`);
  const icon = String(row.icon || 'smart_toy');
  const image = String(row.image || '');
  const bgImage = String(row.bgImage || '');
  const iconPreview = _ctaIconPreviewHtml(icon);
  const visualMode = String((item.options && item.options.cardVisual) || 'image');
  const showIconPicker = visualMode === 'icon';
  const showProductImagePicker = visualMode !== 'icon';

  const pop = document.getElementById('editPopover');
  pop.style.maxWidth = showIconPicker ? '400px' : '700px';
  pop.style.width = showIconPicker ? 'min(92vw, 400px)' : 'min(88vw, 700px)';
  pop.style.top = '50%';
  pop.style.left = '50%';
  pop.style.transform = 'translate(-50%, -50%)';
  pop.innerHTML = `
    <div class="anchor-edit-popup">
    <div class="edit-popover-title">Edit Anchor Card</div>
    <div class="anchor-edit-head">
      <div class="edit-popover-row">
        <label>Anchor ID</label>
        <input type="text" id="popAnchorId" value="${escapeAttr(anchor)}" maxlength="80" placeholder="product01" />
      </div>
    </div>
    ${showIconPicker ? `
      <div class="edit-popover-row">
        <label>Icon</label>
        <button type="button" class="anchor-icon-picker-btn" onclick="openCpbIconPicker('${uid}','items.${idx}.icon',this)">
          <span class="left">
            <span id="popAnchorIconPreview">${iconPreview}</span>
            <span id="popAnchorIconName" class="name">${escapeHtml(icon)}</span>
          </span>
          <span class="mi">expand_more</span>
        </button>
      </div>
      ` : ''}
    <div class="p3-series-media-grid${showIconPicker ? ' icon-only' : ''}">
      ${showProductImagePicker ? `
      <div class="p3-series-media-card">
        <div class="p3-series-media-title">Product Image</div>
        <div class="gallery-card-editor-preview is-fit-content" id="popAnchorPreview">
          ${image ? `<img src="${escapeAttr(image)}" alt="" onload="showProductAnchorPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popAnchorImgDims');if(d)d.textContent='';">` : `<span class="preview-placeholder">No image</span>`}
        </div>
        <div class="gallery-card-editor-meta" id="popAnchorImgDims" style="font-size:10px;"></div>
        <div class="edit-popover-row" style="margin-top:10px;">
          <label>Product image URL</label>
          <input type="url" id="popAnchorImageUrl" value="${escapeAttr(image)}" placeholder="https://..." oninput="updateProductAnchorImagePreview(this.value)" />
          <div class="p3-series-media-actions">
            <button type="button" class="cpb-icon-upload-btn" onclick="openSceneLibraryForInput('popAnchorImageUrl', this)"><span class="mi">photo_library</span>Image Library</button>
            <button type="button" class="pop-upload-btn" onclick="uploadImageToInput('popAnchorImageUrl')"><span class="mi">upload</span>Upload</button>
          </div>
        </div>
      </div>
      ` : ''}
      <div class="p3-series-media-card">
        <div class="p3-series-media-title">Background Image</div>
        <div class="gallery-card-editor-preview is-background" id="popAnchorBgPreview">
          ${bgImage ? `<img src="${escapeAttr(bgImage)}" alt="" onload="showProductAnchorBgPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popAnchorBgImgDims');if(d)d.textContent='';">` : `<span class="preview-placeholder">No image</span>`}
        </div>
        <div class="gallery-card-editor-meta" id="popAnchorBgImgDims" style="font-size:10px;"></div>
        <div class="edit-popover-row" style="margin-top:10px;">
          <label>Background image URL (Style2)</label>
          <input type="url" id="popAnchorBgImageUrl" value="${escapeAttr(bgImage)}" placeholder="https://..." oninput="updateProductAnchorBgImagePreview(this.value)" />
          <div class="p3-series-media-actions">
            <button type="button" class="cpb-icon-upload-btn" onclick="openSceneLibraryForInput('popAnchorBgImageUrl', this)"><span class="mi">photo_library</span>Image Library</button>
            <button type="button" class="pop-upload-btn" onclick="uploadImageToInput('popAnchorBgImageUrl')"><span class="mi">upload</span>Upload</button>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-popover-actions">
      <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
      <button class="pop-save" onclick="commitProductAnchorCardEdit('${uid}',${idx})">Save</button>
    </div>
    </div>
  `;
  pop.classList.add('visible');
}
function showProductAnchorPreviewDimensions(img) {
  const dims = document.getElementById('popAnchorImgDims');
  if (dims) dims.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
}
function updateProductAnchorImagePreview(url) {
  const box = document.getElementById('popAnchorPreview');
  const dims = document.getElementById('popAnchorImgDims');
  if (!box) return;
  const next = String(url || '').trim();
  if (!next) {
    box.innerHTML = '<span class="preview-placeholder">No image selected</span>';
    if (dims) dims.textContent = '';
    return;
  }
  box.innerHTML = `<img src="${escapeAttr(next)}" alt="" onload="showProductAnchorPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popAnchorImgDims');if(d)d.textContent='';">`;
}
function showProductAnchorBgPreviewDimensions(img) {
  const dims = document.getElementById('popAnchorBgImgDims');
  if (dims) dims.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
}
function updateProductAnchorBgImagePreview(url) {
  const box = document.getElementById('popAnchorBgPreview');
  const dims = document.getElementById('popAnchorBgImgDims');
  if (!box) return;
  const next = String(url || '').trim();
  if (!next) {
    box.innerHTML = '<span class="preview-placeholder">No image</span>';
    if (dims) dims.textContent = '';
    return;
  }
  box.innerHTML = `<img src="${escapeAttr(next)}" alt="" onload="showProductAnchorBgPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popAnchorBgImgDims');if(d)d.textContent='';">`;
}
function openProductShowcaseCardEdit(uid, index, listKey = 'cards') {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const idx = Number(index);
  if (!Number.isInteger(idx) || idx < 0) return;
  const row = resolveEdit(item, `${listKey}.${idx}`) || getDefaultEdit(item, `${listKey}.${idx}`) || {};
  const image = String(row.image || '');
  const title = String(listKey === 'products' ? (row.model || '') : (row.title || ''));
  const desc = String(listKey === 'products' ? (row.name || '') : (row.desc || ''));
  const ctaText = String(row.ctaText || 'SHOP NOW');
  const ctaLink = String(row.ctaLink || '#');

  const pop = document.getElementById('editPopover');
  pop.style.maxWidth = '800px';
  pop.style.width = 'min(92vw, 800px)';
  pop.style.top = '50%';
  pop.style.left = '50%';
  pop.style.transform = 'translate(-50%, -50%)';
  pop.innerHTML = `
    <div class="edit-popover-title">Edit Product Card</div>
    <div class="p3-series-popup product-db-popup" id="showcaseProductPopup">
      <div class="product-db-layout product-db-layout-showcase">
      <div class="product-db-search-pane">
        <div class="product-db-search-row">
          <input type="text" id="showcaseProductSearch" placeholder="Search from Product data base" oninput="onProductDatabaseSearchInput('showcase', this.value)" onkeydown="onProductDatabaseSearchKeydown(event, 'showcase')" />
        </div>
        <div id="showcaseProductSearchResults" class="product-db-results"></div>
      </div>
      <div class="product-db-edit-pane">
      <div class="product-db-manual" id="showcaseProductManual">
        <div class="product-db-edit-header">
          <span class="product-db-edit-title">Product Fields</span>
          <button type="button" id="showcaseProductManualToggle" class="product-db-edit-toggle" onclick="toggleProductManualEdit('showcase')" aria-pressed="false" title="Enable field editing"><span class="mi">edit</span></button>
        </div>
        <div class="product-db-manual-body" id="showcaseProductManualBody" data-editable="false">
          <div class="product-db-field">
            <label>Product title</label>
            <input type="text" id="popShowcaseTitle" value="${escapeAttr(title)}" maxlength="120" placeholder="Card title" />
          </div>
          <div class="product-db-field">
            <label>Description</label>
            <textarea id="popShowcaseDesc" rows="4" placeholder="Product description">${escapeHtml(desc)}</textarea>
          </div>
          <div class="product-db-field">
            <label>CTA text</label>
            <input type="text" id="popShowcaseCtaText" value="${escapeAttr(ctaText)}" maxlength="40" placeholder="SHOP NOW" />
          </div>
          <div class="product-db-field">
            <label>CTA link</label>
            <input type="url" id="popShowcaseCtaLink" value="${escapeAttr(ctaLink)}" placeholder="https://..." />
          </div>
        </div>
      </div>
      </div>
      <div class="product-db-image-pane">
      <div class="p3-series-media-card">
        <div class="p3-series-media-title">Product Image</div>
        <div class="gallery-card-editor-preview" id="popShowcasePreview">
          ${image ? `<img src="${escapeAttr(image)}" alt="" onload="showProductShowcasePreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popShowcaseImgDims');if(d)d.textContent='';">` : `<span class="preview-placeholder">No image selected</span>`}
        </div>
        <div class="gallery-card-editor-meta" id="popShowcaseImgDims"></div>
        <div class="edit-popover-row" style="margin-top:10px;">
          <label>Image URL</label>
          <input type="url" id="popShowcaseImageUrl" value="${escapeAttr(image)}" placeholder="https://..." oninput="updateProductShowcaseImagePreview(this.value)" />
          <div class="p3-series-media-actions">
            <button type="button" class="pop-upload-btn" onclick="uploadImageToInput('popShowcaseImageUrl')"><span class="mi">upload</span>Upload</button>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
    <div class="edit-popover-actions">
      <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
      <button class="pop-save" onclick="commitProductShowcaseCardEdit('${uid}',${idx},'${listKey}')">Save</button>
    </div>
  `;
  pop.classList.add('visible');
  initCpbProductDatabase().finally(() => {
    onProductDatabaseSearchInput('showcase', document.getElementById('showcaseProductSearch')?.value || '');
    _cpbSetProductManualEditable('showcase', false);
    setTimeout(() => document.getElementById('showcaseProductSearch')?.focus(), 50);
  });
}
function showProductShowcasePreviewDimensions(img) {
  const dims = document.getElementById('popShowcaseImgDims');
  if (dims) dims.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
}
function updateProductShowcaseImagePreview(url) {
  const box = document.getElementById('popShowcasePreview');
  const dims = document.getElementById('popShowcaseImgDims');
  if (!box) return;
  const next = String(url || '').trim();
  if (!next) {
    box.innerHTML = '<span class="preview-placeholder">No image selected</span>';
    if (dims) dims.textContent = '';
    return;
  }
  box.innerHTML = `<img src="${escapeAttr(next)}" alt="" onload="showProductShowcasePreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popShowcaseImgDims');if(d)d.textContent='';">`;
}
function commitProductShowcaseCardEdit(uid, index, listKey = 'cards') {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const prev = resolveEdit(item, `${listKey}.${index}`) || getDefaultEdit(item, `${listKey}.${index}`) || {};
  const nextTitle = (document.getElementById('popShowcaseTitle')?.value || '').trim();
  const nextDesc = (document.getElementById('popShowcaseDesc')?.value || '').trim();
  const next = {
    ...prev,
    image: (document.getElementById('popShowcaseImageUrl')?.value || '').trim(),
    ctaText: _normalizeCtaText(document.getElementById('popShowcaseCtaText')?.value || '') || 'SHOP NOW',
    ctaLink: (document.getElementById('popShowcaseCtaLink')?.value || '').trim() || '#',
  };
  if (listKey === 'products') {
    next.model = nextTitle;
    next.name = nextDesc;
  } else {
    next.title = nextTitle;
    next.desc = nextDesc;
  }
  setListItem(uid, listKey, index, next);
  hideEditPopover();
}
function openRelatedContentCardEdit(uid, index) {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const idx = Number(index);
  if (!Number.isInteger(idx) || idx < 0) return;
  const row = resolveEdit(item, `cards.${idx}`) || getDefaultEdit(item, `cards.${idx}`) || {};
  const type = String(row.type || 'Article');
  const image = String(row.image || '');
  const title = String(row.title || '');
  const desc = String(row.desc || '');
  const ctaText = String(row.ctaText || 'Read More');
  const ctaLink = String(row.ctaLink || '#');

  const pop = document.getElementById('editPopover');
  pop.style.maxWidth = '720px';
  pop.style.width = 'min(90vw, 720px)';
  pop.style.top = '50%';
  pop.style.left = '50%';
  pop.style.transform = 'translate(-50%, -50%)';
  pop.innerHTML = `
    <div class="gallery-edit-popup">
    <div class="edit-popover-title">Edit Related Content Card</div>
    <div class="gallery-card-editor-layout">
      <div>
        <div class="edit-popover-row">
          <label>Type</label>
          <input type="text" id="popRelatedType" value="${escapeAttr(type)}" maxlength="40" placeholder="Article or Video" />
        </div>
        <div class="edit-popover-row">
          <label>Title</label>
          <input type="text" id="popRelatedTitle" value="${escapeAttr(title)}" maxlength="120" placeholder="Card title" />
        </div>
        <div class="edit-popover-row">
          <label>Description</label>
          <textarea id="popRelatedDesc" rows="5" style="width:100%;resize:vertical;border:1px solid #d5dae0;border-radius:6px;padding:8px 10px;font-family:inherit;font-size:12px;line-height:1.45;color:#333;">${escapeHtml(desc)}</textarea>
        </div>
        <div class="edit-popover-row">
          <label>CTA Text</label>
          <input type="text" id="popRelatedCtaText" value="${escapeAttr(ctaText)}" maxlength="40" placeholder="Read Article" />
        </div>
        <div class="edit-popover-row">
          <label>CTA Link</label>
          <input type="url" id="popRelatedCtaLink" value="${escapeAttr(ctaLink)}" placeholder="https://..." />
        </div>
      </div>
      <div>
        <div class="gallery-card-editor-preview is-background" id="popRelatedPreview">
          ${image ? `<img src="${escapeAttr(image)}" alt="" onload="showRelatedContentPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popRelatedImgDims');if(d)d.textContent='';">` : `<span class="preview-placeholder">No image selected</span>`}
        </div>
        <div class="gallery-card-editor-meta" id="popRelatedImgDims"></div>
        <div class="edit-popover-row" style="margin-top:10px;">
          <label>Image URL</label>
          <input type="url" id="popRelatedImageUrl" value="${escapeAttr(image)}" placeholder="https://..." oninput="updateRelatedContentImagePreview(this.value)" />
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button type="button" class="cpb-icon-upload-btn" style="flex:1;justify-content:center;" onclick="openSceneLibraryForInput('popRelatedImageUrl', this)"><span class="mi">photo_library</span>Image Library</button>
            <button type="button" class="pop-upload-btn" style="flex:1;justify-content:center;" onclick="uploadImageToInput('popRelatedImageUrl')"><span class="mi">upload</span>Upload</button>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-popover-actions">
      <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
      <button class="pop-save" onclick="commitRelatedContentCardEdit('${uid}',${idx})">Save</button>
    </div>
    </div>
  `;
  pop.classList.add('visible');
}
function showRelatedContentPreviewDimensions(img) {
  const dims = document.getElementById('popRelatedImgDims');
  if (dims) dims.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
}
function updateRelatedContentImagePreview(url) {
  const box = document.getElementById('popRelatedPreview');
  const dims = document.getElementById('popRelatedImgDims');
  if (!box) return;
  const next = String(url || '').trim();
  if (!next) {
    box.innerHTML = '<span class="preview-placeholder">No image selected</span>';
    if (dims) dims.textContent = '';
    return;
  }
  box.innerHTML = `<img src="${escapeAttr(next)}" alt="" onload="showRelatedContentPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popRelatedImgDims');if(d)d.textContent='';">`;
}
function commitRelatedContentCardEdit(uid, index) {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const prev = resolveEdit(item, `cards.${index}`) || getDefaultEdit(item, `cards.${index}`) || {};
  const next = {
    ...prev,
    type: (document.getElementById('popRelatedType')?.value || '').trim() || 'Article',
    image: (document.getElementById('popRelatedImageUrl')?.value || '').trim(),
    title: (document.getElementById('popRelatedTitle')?.value || '').trim(),
    desc: (document.getElementById('popRelatedDesc')?.value || '').trim(),
    ctaText: _normalizeCtaText(document.getElementById('popRelatedCtaText')?.value || '') || 'Read More',
    ctaLink: (document.getElementById('popRelatedCtaLink')?.value || '').trim() || '#',
  };
  setListItem(uid, 'cards', index, next);
  hideEditPopover();
}
function openProductSeriesMatrixSeriesEdit(uid, index) {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const idx = Number(index);
  if (!Number.isInteger(idx) || idx < 0) return;
  const row = resolveEdit(item, `series.${idx}`) || getDefaultEdit(item, `series.${idx}`) || {};
  const image = String(row.image || '');
  const introBgImage = String(row.introBgImage || '');

  const pop = document.getElementById('editPopover');
  pop.style.maxWidth = '760px';
  pop.style.width = 'min(92vw, 760px)';
  pop.style.top = '50%';
  pop.style.left = '50%';
  pop.style.transform = 'translate(-50%, -50%)';
  pop.innerHTML = `
    <div class="edit-popover-title">Edit Series Card</div>
    <div class="p3-series-popup">
      <div class="p3-series-media-grid">
        <div class="p3-series-media-card">
          <div class="p3-series-media-title">Series Image</div>
          <div class="gallery-card-editor-preview" id="popSeriesImagePreview">
            ${image ? `<img src="${escapeAttr(image)}" alt="" onload="showProductSeriesPreviewDimensions(this,'popSeriesImageDims')" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popSeriesImageDims');if(d)d.textContent='';">` : `<span class="preview-placeholder">No image</span>`}
          </div>
          <div class="gallery-card-editor-meta" id="popSeriesImageDims"></div>
          <div class="edit-popover-row">
            <label>Series image URL</label>
            <input type="url" id="popSeriesImageUrl" value="${escapeAttr(image)}" placeholder="https://..." oninput="updateProductSeriesImagePreview(this.value,'popSeriesImagePreview','popSeriesImageDims')" />
            <div class="p3-series-media-actions">
              <button type="button" class="cpb-icon-upload-btn" onclick="openSceneLibraryForInput('popSeriesImageUrl', this)"><span class="mi">photo_library</span>Image Library</button>
              <button type="button" class="pop-upload-btn" onclick="uploadImageToInput('popSeriesImageUrl')"><span class="mi">upload</span>Upload</button>
            </div>
          </div>
        </div>
        <div class="p3-series-media-card">
          <div class="p3-series-media-title">Intro Background</div>
          <div class="gallery-card-editor-preview" id="popSeriesBgPreview">
            ${introBgImage ? `<img src="${escapeAttr(introBgImage)}" alt="" onload="showProductSeriesPreviewDimensions(this,'popSeriesBgDims')" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('popSeriesBgDims');if(d)d.textContent='';">` : `<span class="preview-placeholder">No image</span>`}
          </div>
          <div class="gallery-card-editor-meta" id="popSeriesBgDims"></div>
          <div class="edit-popover-row">
            <label>Intro bg image URL</label>
            <input type="url" id="popSeriesBgUrl" value="${escapeAttr(introBgImage)}" placeholder="https://..." oninput="updateProductSeriesImagePreview(this.value,'popSeriesBgPreview','popSeriesBgDims')" />
            <div class="p3-series-media-actions">
              <button type="button" class="cpb-icon-upload-btn" onclick="openSceneLibraryForInput('popSeriesBgUrl', this)"><span class="mi">photo_library</span>Image Library</button>
              <button type="button" class="pop-upload-btn" onclick="uploadImageToInput('popSeriesBgUrl')"><span class="mi">upload</span>Upload</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-popover-actions">
      <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
      <button class="pop-save" onclick="commitProductSeriesMatrixSeriesEdit('${uid}',${idx})">Save</button>
    </div>
  `;
  pop.classList.add('visible');
}
function openProductSeriesMatrixItemEdit(uid, index) {
  const idx = Number(index);
  if (!Number.isInteger(idx) || idx < 0) return;
  openProductShowcaseCardEdit(uid, idx, 'products');
}
function showProductSeriesPreviewDimensions(img, dimsId) {
  const dims = document.getElementById(dimsId);
  if (dims) dims.textContent = img.naturalWidth + ' x ' + img.naturalHeight + ' px';
}
function updateProductSeriesImagePreview(url, previewId, dimsId) {
  const box = document.getElementById(previewId);
  const dims = document.getElementById(dimsId);
  if (!box) return;
  const next = String(url || '').trim();
  if (!next) {
    box.innerHTML = '<span class="preview-placeholder">No image selected</span>';
    if (dims) dims.textContent = '';
    return;
  }
  box.innerHTML = `<img src="${escapeAttr(next)}" alt="" onload="showProductSeriesPreviewDimensions(this,'${dimsId}')" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';const d=document.getElementById('${dimsId}');if(d)d.textContent='';">`;
}
function commitProductSeriesMatrixSeriesEdit(uid, index) {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const prev = resolveEdit(item, `series.${index}`) || getDefaultEdit(item, `series.${index}`) || {};
  const next = {
    ...prev,
    image: (document.getElementById('popSeriesImageUrl')?.value || '').trim(),
    introBgImage: (document.getElementById('popSeriesBgUrl')?.value || '').trim(),
  };
  setListItem(uid, 'series', index, next);
  hideEditPopover();
}
function onCtaEditClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit-cta');
  if (!path) return;
  
  const [uid, slot] = path.split(':');
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;

  const cardMatch = /^cards\.(\d+)$/.exec(slot || '');
  if (cardMatch) {
    const cardMap = _cardCtaFieldMap(cardMatch[1]);
    if (!cardMap) return;
    const txt = _normalizeCtaText(resolveEdit(item, cardMap.textKey) ?? getDefaultEdit(item, cardMap.textKey) ?? 'Learn more');
    const url = String(resolveEdit(item, cardMap.urlKey) ?? getDefaultEdit(item, cardMap.urlKey) ?? '#');
    const hasIcon = String(resolveEdit(item, cardMap.iconKey) ?? getDefaultEdit(item, cardMap.iconKey) ?? 'true') !== 'false';
    const showCardCta = String(resolveEdit(item, cardMap.enabledKey) ?? (item.options?.showCardCta ? 'true' : 'false')) === 'true';

    const pop = document.getElementById('editPopover');
    pop.style.width = '';
    pop.style.maxWidth = '';
    pop.style.top = '';
    pop.style.left = '';
    pop.style.transform = '';
    pop.innerHTML = `
      <div class="edit-popover-title">Edit Card</div>
      <div class="sidebar-toggle-ctrl">
        <span class="ctrl-label">Show card CTA link</span>
        <label class="toggle-switch">
          <input type="checkbox" id="popShowCardCta" ${showCardCta ? 'checked' : ''} onchange="toggleCardCtaPopupFields(this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div id="popCardCtaControls" style="${showCardCta ? '' : 'display:none;'}">
        <div style="border-top:1px solid #e5e7eb;margin:12px 0;"></div>
        <div class="edit-popover-row">
          <label>Button text</label>
          <input type="text" id="popCardCtaText" value="${escapeAttr(txt)}" maxlength="80" />
        </div>
        <div class="edit-popover-row">
          <label>Link URL</label>
          <input type="url" id="popCardCtaUrl" value="${escapeAttr(url)}" placeholder="https://..." />
        </div>
        <div class="edit-popover-row">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;">
            <input type="checkbox" id="popCardCtaHasIcon" ${hasIcon ? 'checked' : ''}>
            Show icon (fixed arrow)
          </label>
        </div>
      </div>
      <div class="edit-popover-actions">
        <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
        <button class="pop-save" onclick="commitCardCtaEdit('${uid}',${cardMap.index})">Save</button>
      </div>
    `;
    pop.classList.add('visible');
    _positionEditPopoverNearTarget(pop, el, { viewportPadding: 8, anchorGap: 6 });
    return;
  }

  const map = _heroCtaFieldMap(slot);
  if (!map) return;

  const txt = _normalizeCtaText(resolveEdit(item, map.textKey) ?? getDefaultEdit(item, map.textKey) ?? '');
  const url = String(resolveEdit(item, map.urlKey) ?? getDefaultEdit(item, map.urlKey) ?? '#');
  const style = String(resolveEdit(item, map.styleKey) ?? getDefaultEdit(item, map.styleKey) ?? (slot === 'cta1' ? 'solid' : 'line')) === 'line' ? 'line' : 'solid';
  const hasIcon = String(resolveEdit(item, map.iconKey) ?? getDefaultEdit(item, map.iconKey) ?? 'false') === 'true';
  const iconName = String(resolveEdit(item, map.iconNameKey) ?? getDefaultEdit(item, map.iconNameKey) ?? 'arrow_forward') || 'arrow_forward';
  const iconPos = String(resolveEdit(item, map.iconPosKey) ?? getDefaultEdit(item, map.iconPosKey) ?? 'right') === 'left' ? 'left' : 'right';

  const pop = document.getElementById('editPopover');
  pop.style.width = '';
  pop.style.maxWidth = '';
  pop.style.top = '';
  pop.style.left = '';
  pop.style.transform = '';
  pop.innerHTML = `
    <div class="edit-popover-title">Edit CTA</div>
    <div class="edit-popover-row">
      <label>Button text</label>
      <input type="text" id="popCtaText" value="${escapeAttr(txt)}" maxlength="80" />
    </div>
    <div class="edit-popover-row">
      <label>Link URL</label>
      <input type="url" id="popCtaUrl" value="${escapeAttr(url)}" placeholder="https://..." />
    </div>
    <div class="edit-popover-row">
      <label>Style</label>
      <input type="hidden" id="popCtaStyle" value="${style}">
      <div class="pill-group" id="popCtaStyleGroup">
        <button type="button" class="${style === 'solid' ? 'active' : ''}" onclick="setPopCtaStyle('solid')">Solid</button>
        <button type="button" class="${style === 'line' ? 'active' : ''}" onclick="setPopCtaStyle('line')">Line</button>
      </div>
    </div>
    <div class="edit-popover-row">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;">
        <input type="checkbox" id="popCtaHasIcon" ${hasIcon ? 'checked' : ''} onchange="togglePopCtaIconControls(this.checked)">
        Show icon
      </label>
    </div>
    <div class="edit-popover-row" id="popCtaIconControls" style="${hasIcon ? '' : 'display:none;'}">
      <label>Icon</label>
      <input type="hidden" id="popCtaIcon" value="${escapeAttr(iconName)}">
      <input type="hidden" id="popCtaIconPos" value="${iconPos}">
      <div class="cta-row-inline" style="margin-bottom:8px;">
        <span class="cta-icon-preview" id="popCtaIconPreview">${_ctaIconPreviewHtml(iconName)}</span>
        <button type="button" class="cta-icon-btn" onclick="openCtaIconPicker('${uid}','${slot}',this)"><span class="mi">apps</span>Choose icon</button>
      </div>
      <div class="pill-group" id="popCtaIconPosGroup">
        <button type="button" class="${iconPos === 'left' ? 'active' : ''}" onclick="setPopCtaIconPos('left')">Icon left</button>
        <button type="button" class="${iconPos === 'right' ? 'active' : ''}" onclick="setPopCtaIconPos('right')">Icon right</button>
      </div>
    </div>
    <div class="edit-popover-actions">
      <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
      <button class="pop-save" onclick="commitCtaEdit('${uid}','${slot}')">Save</button>
    </div>
  `;
  pop.classList.add('visible');
  _positionEditPopoverNearTarget(pop, el, { viewportPadding: 8, anchorGap: 6 });
}
function setPopCtaStyle(style) {
  const normalized = style === 'line' ? 'line' : 'solid';
  const input = document.getElementById('popCtaStyle');
  if (input) input.value = normalized;
  const group = document.getElementById('popCtaStyleGroup');
  if (!group) return;
  group.querySelectorAll('button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === normalized);
  });
}
function togglePopCtaIconControls(show) {
  const box = document.getElementById('popCtaIconControls');
  if (box) box.style.display = show ? '' : 'none';
}
function setPopCtaIconPos(pos) {
  const normalized = pos === 'left' ? 'left' : 'right';
  const input = document.getElementById('popCtaIconPos');
  if (input) input.value = normalized;
  const group = document.getElementById('popCtaIconPosGroup');
  if (!group) return;
  const buttons = group.querySelectorAll('button');
  if (buttons[0]) buttons[0].classList.toggle('active', normalized === 'left');
  if (buttons[1]) buttons[1].classList.toggle('active', normalized === 'right');
}
function openCtaIconPicker(uid, slot, triggerEl) {
  const map = _heroCtaFieldMap(slot);
  if (!map) return;
  openCpbIconPicker(uid, map.iconNameKey, triggerEl);
}
function commitCtaEdit(uid, slot) {
  const map = _heroCtaFieldMap(slot);
  if (!map) return;
  const txt = _normalizeCtaText(document.getElementById('popCtaText')?.value || '');
  const url = (document.getElementById('popCtaUrl')?.value || '').trim() || '#';
  const style = (document.getElementById('popCtaStyle')?.value || '').trim() === 'line' ? 'line' : 'solid';
  const hasIcon = !!document.getElementById('popCtaHasIcon')?.checked;
  const iconName = (document.getElementById('popCtaIcon')?.value || 'arrow_forward').trim() || 'arrow_forward';
  const iconPos = (document.getElementById('popCtaIconPos')?.value || 'right').trim() === 'left' ? 'left' : 'right';

  setEditValue(uid, map.textKey, txt || (slot === 'cta1' ? 'Learn More' : 'Contact Us'));
  setEditValue(uid, map.urlKey, url);
  setEditValue(uid, map.styleKey, style);
  setEditValue(uid, map.iconKey, hasIcon ? 'true' : 'false');
  setEditValue(uid, map.iconNameKey, iconName);
  setEditValue(uid, map.iconPosKey, iconPos);
  hideEditPopover();
  pushHistory();
  renderCanvas();
  renderProperties();
  saveCurrentProject(true);
}
function commitCardCtaEdit(uid, index) {
  const map = _cardCtaFieldMap(index);
  if (!map) return;
  const txt = _normalizeCtaText(document.getElementById('popCardCtaText')?.value || '');
  const url = (document.getElementById('popCardCtaUrl')?.value || '').trim() || '#';
  const hasIcon = !!document.getElementById('popCardCtaHasIcon')?.checked;
  const showCardCta = !!document.getElementById('popShowCardCta')?.checked;

  setEditValue(uid, map.textKey, txt || 'Learn more');
  setEditValue(uid, map.urlKey, url);
  setEditValue(uid, map.iconKey, hasIcon ? 'true' : 'false');
  setEditValue(uid, map.enabledKey, showCardCta ? 'true' : 'false');
  
  hideEditPopover();
  pushHistory();
  renderCanvas();
  renderProperties();
  saveCurrentProject(true);
}
function toggleCardCtaPopupFields(enabled) {
  const controls = document.getElementById('popCardCtaControls');
  if (!controls) return;
  controls.style.display = enabled ? '' : 'none';
}

function commitGalleryCardEdit(uid, index) {
  const next = {
    tag: (document.getElementById('popGalleryTag')?.value || '').trim(),
    title: (document.getElementById('popGalleryTitle')?.value || '').trim(),
    desc: (document.getElementById('popGalleryDesc')?.value || '').trim(),
    image: (document.getElementById('popGalleryImageUrl')?.value || '').trim(),
    ctaEnabled: !!document.getElementById('popGalleryShowCta')?.checked,
    ctaText: _normalizeCtaText(document.getElementById('popGalleryCtaText')?.value || '') || 'Learn more',
    ctaLink: (document.getElementById('popGalleryCtaLink')?.value || '').trim() || '#',
  };
  setListItem(uid, 'items', index, next);
  hideEditPopover();
}
function toggleGalleryCtaPopupFields(enabled) {
  const controls = document.getElementById('popGalleryCtaControls');
  if (!controls) return;
  controls.style.display = enabled ? '' : 'none';
}
function commitProductAnchorCardEdit(uid, index) {
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === uid);
  if (!item) return;
  const prev = resolveEdit(item, `items.${index}`) || getDefaultEdit(item, `items.${index}`) || {};
  const rawAnchor = (document.getElementById('popAnchorId')?.value || '').trim();
  const normalizedAnchor = rawAnchor.replace(/^#/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  const imageInput = document.getElementById('popAnchorImageUrl');
  const next = {
    ...prev,
    anchor: normalizedAnchor,
    image: imageInput ? (imageInput.value || '').trim() : String(prev.image || ''),
    bgImage: (document.getElementById('popAnchorBgImageUrl')?.value || '').trim(),
  };
  setListItem(uid, 'items', index, next);
  hideEditPopover();
  renderProperties();
}
function onInlineEditKey(e) {
  const path = this.getAttribute('data-cpb-edit') || '';
  const isSeriesBullets = /\.bullets$/.test(path);
  if (e.key === 'Enter' && isSeriesBullets) {
    e.preventDefault();
    document.execCommand('insertLineBreak');
    return;
  }
  if (e.key === 'Enter' && !isSeriesBullets && !e.shiftKey && this.tagName !== 'DIV') {
    e.preventDefault(); this.blur();
  }
  if (e.key === 'Escape') { e.preventDefault(); this.blur(); }
}
function onInlineEdit(e) {
  // No-op during input; commit on blur
}
function onInlineEditBlur(e) {
  const el = e.currentTarget;
  const path = el.getAttribute('data-cpb-edit'); // "<uid>:<keyPath>"
  if (!path) return;
  const [uid, keyPath] = path.split(':');
  let value = el.innerHTML;
  if (/\.bullets$/.test(keyPath)) {
    const bullets = [...el.querySelectorAll('li')].map(li => li.textContent.trim()).filter(Boolean);
    const fallback = String(el.innerText || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    value = (bullets.length ? bullets : fallback).join(';');
  }
  setEditValue(uid, keyPath, value);
  hideFormatBar();
  pushHistory();
  saveCurrentProject(true);
  scheduleP3SeriesIntroHeightSync();
}
function onInlineSelection(e) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { hideFormatBar(); return; }
  const range = sel.getRangeAt(0);
  if (!e.currentTarget.contains(range.commonAncestorContainer)) { hideFormatBar(); return; }
  const rect = range.getBoundingClientRect();
  showFormatBar(rect);
}
function showFormatBar(rect) {
  const bar = document.getElementById('formatBar');
  bar.classList.add('visible');
  const top = rect.top + window.scrollY - bar.offsetHeight - 8;
  const left = rect.left + (rect.width - bar.offsetWidth) / 2 + window.scrollX;
  bar.style.top = Math.max(8, top) + 'px';
  bar.style.left = Math.max(8, left) + 'px';
}
function hideFormatBar() {
  document.getElementById('formatBar').classList.remove('visible');
}
function execFormat(cmd) { document.execCommand(cmd, false); }
function execLink() {
  const url = prompt('Link URL:');
  if (url) document.execCommand('createLink', false, url);
}

// ─── Image edit popover ───────────────────────────────────────────────
let popoverTargetImg = null;
let popoverTargetPath = null;

function onImageEditClick(e) {
  if (e.currentTarget.closest('a')) e.preventDefault();
  e.stopPropagation();
  const relatedCard = e.currentTarget.closest('[data-cpb-edit-related-content-card]');
  if (relatedCard) {
    const relatedPath = relatedCard.getAttribute('data-cpb-edit-related-content-card') || '';
    const [uid, slot] = relatedPath.split(':');
    const match = /^cards\.(\d+)$/.exec(slot || '');
    if (uid && match) {
      openRelatedContentCardEdit(uid, Number(match[1]));
      return;
    }
  }
  const showcaseCard = e.currentTarget.closest('[data-cpb-edit-product-showcase-card]');
  if (showcaseCard) {
    const showcasePath = showcaseCard.getAttribute('data-cpb-edit-product-showcase-card') || '';
    const [uid, slot] = showcasePath.split(':');
    const match = /^((?:cards|products))\.(\d+)$/.exec(slot || '');
    if (uid && match) {
      openProductShowcaseCardEdit(uid, Number(match[2]), match[1]);
      return;
    }
  }
  popoverTargetImg = e.currentTarget;
  const path = popoverTargetImg.getAttribute('data-cpb-edit');
  popoverTargetPath = path;
  const [uid, keyPath] = path.split(':');
  const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
  if (!item) return;
  const currentSrc = resolveEdit(item, keyPath) || popoverTargetImg.src;
  const pop = document.getElementById('editPopover');
  pop.style.width = '';
  pop.style.maxWidth = '';
  pop.style.top = '';
  pop.style.left = '';
  pop.style.transform = '';
  pop.innerHTML = `
    <div class="edit-popover-title">Edit image</div>
    <div class="edit-popover-preview" id="pop-img-preview">
      ${currentSrc ? `<img src="${escapeAttr(currentSrc)}" alt="" onload="showPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';document.getElementById('pop-img-dims').textContent=''">` : `<span class="preview-placeholder">No image URL</span>`}
    </div>
    <div class="preview-dimensions" id="pop-img-dims"></div>
    <div class="pop-upload-row">
      <label class="pop-upload-btn" id="pop-upload-btn" title="Upload to Cloudinary">
        <span class="mi">upload</span>Upload Image
        <input type="file" id="pop-upload-input" accept="image/jpg,image/jpeg,image/png" style="display:none" onchange="uploadToCloudinary(this)">
      </label>
      <span class="pop-upload-divider">or paste URL below</span>
    </div>
    <div class="pop-upload-error" id="pop-upload-error"></div>
    <div class="edit-popover-row">
      <label>Image URL</label>
      <input type="url" id="popImageUrl" value="${escapeAttr(currentSrc)}" placeholder="https://..." />
    </div>
    <div class="edit-popover-actions">
      <button class="pop-cancel" onclick="hideEditPopover()">Cancel</button>
      <button class="pop-save" onclick="commitImageEdit('${uid}','${keyPath}')">Save</button>
    </div>
  `;
  pop.classList.add('visible');
  _setEditPopoverOverlayOpen(true);
  _positionEditPopoverNearTarget(pop, popoverTargetImg, { viewportPadding: 8, anchorGap: 6 });
  // Live preview
  document.getElementById('popImageUrl').addEventListener('input', e => {
    updateImagePreview(e.target.value);
  });
}

function commitImageEdit(uid, keyPath) {
  const url = document.getElementById('popImageUrl').value.trim();
  if (!url) return;
  setEditValue(uid, keyPath, url);
  hideEditPopover();
  pushHistory();
  renderCanvas();
  saveCurrentProject(true);
}
function hideEditPopover() {
  const pop = document.getElementById('editPopover');
  pop.classList.remove('visible');
  _setEditPopoverOverlayOpen(false);
  pop.style.width = '';
  pop.style.maxWidth = '';
  pop.style.top = '';
  pop.style.left = '';
  pop.style.transform = '';
  popoverTargetImg = null;
  popoverTargetPath = null;
}


  global._lockInlineCtaIcons = _lockInlineCtaIcons;
  global.setupInlineEditing = setupInlineEditing;
  global.syncP3SeriesIntroHeights = syncP3SeriesIntroHeights;
  global.scheduleP3SeriesIntroHeightSync = scheduleP3SeriesIntroHeightSync;
  global.onIconEditClick = onIconEditClick;
  global._heroCtaFieldMap = _heroCtaFieldMap;
  global._cardCtaFieldMap = _cardCtaFieldMap;
  global._ctaIconPreviewHtml = _ctaIconPreviewHtml;
  global.onGalleryCardEditClick = onGalleryCardEditClick;
  global.onProductAnchorCardEditClick = onProductAnchorCardEditClick;
  global.onProductShowcaseCardEditClick = onProductShowcaseCardEditClick;
  global.onRelatedContentCardEditClick = onRelatedContentCardEditClick;
  global.onProductSeriesMatrixSeriesEditClick = onProductSeriesMatrixSeriesEditClick;
  global.onProductSeriesMatrixItemEditClick = onProductSeriesMatrixItemEditClick;
  global.onPrcPartnerLogoEditClick = onPrcPartnerLogoEditClick;
  global.showPrcPartnerPreviewDimensions = showPrcPartnerPreviewDimensions;
  global.updatePrcPartnerImagePreview = updatePrcPartnerImagePreview;
  global.openPrcPartnerLogoEdit = openPrcPartnerLogoEdit;
  global.commitPrcPartnerLogoEdit = commitPrcPartnerLogoEdit;
  global.showGalleryPreviewDimensions = showGalleryPreviewDimensions;
  global.updateGalleryImagePreview = updateGalleryImagePreview;
  global.openProductAnchorCardEdit = openProductAnchorCardEdit;
  global.showProductAnchorPreviewDimensions = showProductAnchorPreviewDimensions;
  global.updateProductAnchorImagePreview = updateProductAnchorImagePreview;
  global.showProductAnchorBgPreviewDimensions = showProductAnchorBgPreviewDimensions;
  global.updateProductAnchorBgImagePreview = updateProductAnchorBgImagePreview;
  global.openProductShowcaseCardEdit = openProductShowcaseCardEdit;
  global.showProductShowcasePreviewDimensions = showProductShowcasePreviewDimensions;
  global.updateProductShowcaseImagePreview = updateProductShowcaseImagePreview;
  global.commitProductShowcaseCardEdit = commitProductShowcaseCardEdit;
  global.openRelatedContentCardEdit = openRelatedContentCardEdit;
  global.showRelatedContentPreviewDimensions = showRelatedContentPreviewDimensions;
  global.updateRelatedContentImagePreview = updateRelatedContentImagePreview;
  global.commitRelatedContentCardEdit = commitRelatedContentCardEdit;
  global.openProductSeriesMatrixSeriesEdit = openProductSeriesMatrixSeriesEdit;
  global.openProductSeriesMatrixItemEdit = openProductSeriesMatrixItemEdit;
  global.showProductSeriesPreviewDimensions = showProductSeriesPreviewDimensions;
  global.updateProductSeriesImagePreview = updateProductSeriesImagePreview;
  global.commitProductSeriesMatrixSeriesEdit = commitProductSeriesMatrixSeriesEdit;
  global.onCtaEditClick = onCtaEditClick;
  global.setPopCtaStyle = setPopCtaStyle;
  global.togglePopCtaIconControls = togglePopCtaIconControls;
  global.setPopCtaIconPos = setPopCtaIconPos;
  global.openCtaIconPicker = openCtaIconPicker;
  global.commitCtaEdit = commitCtaEdit;
  global.commitCardCtaEdit = commitCardCtaEdit;
  global.toggleCardCtaPopupFields = toggleCardCtaPopupFields;
  global.commitGalleryCardEdit = commitGalleryCardEdit;
  global.toggleGalleryCtaPopupFields = toggleGalleryCtaPopupFields;
  global.commitProductAnchorCardEdit = commitProductAnchorCardEdit;
  global.onInlineEditKey = onInlineEditKey;
  global.onInlineEdit = onInlineEdit;
  global.onInlineEditBlur = onInlineEditBlur;
  global.onInlineSelection = onInlineSelection;
  global.showFormatBar = showFormatBar;
  global.hideFormatBar = hideFormatBar;
  global.execFormat = execFormat;
  global.execLink = execLink;
  global.onImageEditClick = onImageEditClick;
  global.commitImageEdit = commitImageEdit;
  global.hideEditPopover = hideEditPopover;
})(window);
