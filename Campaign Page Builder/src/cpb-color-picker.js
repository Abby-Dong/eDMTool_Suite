(function (global) {
  'use strict';

  const CPB_BRAND_COLORS = [
    { group: 'Primary', colors: [
      { hex: '#F39800', name: 'Primary' }, { hex: '#e57b03', name: 'Primary Dark' },
      { hex: '#f7c265', name: 'Primary Light 70' }, { hex: '#fbe0b2', name: 'Primary Light 50' },
      { hex: '#fdeacc', name: 'Primary Light 30' }, { hex: '#faf3e6', name: 'Primary Light 10' },
    ]},
    { group: 'Brand', colors: [
      { hex: '#004280', name: 'Brand' }, { hex: '#003160', name: 'Brand Dark' },
      { hex: '#336899', name: 'Brand Light 75' }, { hex: '#80a0bf', name: 'Brand Light 50' },
      { hex: '#dfebf7', name: 'Brand Light 30' },
    ]},
    { group: 'Link / Blue', colors: [
      { hex: '#006EFF', name: 'Link' }, { hex: '#0052cc', name: 'Link Dark' },
      { hex: '#4d8cff', name: 'Link Light' },
    ]},
    { group: 'Gray', colors: [
      { hex: '#0c0c0c', name: 'Gray 90' }, { hex: '#434447', name: 'Gray 80' },
      { hex: '#737b7d', name: 'Gray 70' }, { hex: '#b6bfc1', name: 'Gray 60' },
      { hex: '#cfd2d5', name: 'Gray 50' }, { hex: '#e8ecef', name: 'Gray 40' },
      { hex: '#f6f7f9', name: 'Gray 30' }, { hex: '#ffffff', name: 'White' },
    ]},
  ];
  let _cpbPickerUid = null;
  let _cpbPickerKey = null;
  let _cpbPickerColor = '#ffffff';

  function openCpbColorPicker(uid, key, triggerEl) {
    _cpbPickerUid = uid;
    _cpbPickerKey = key;
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    const def = SECTION_BY_ID[item.sectionType];
    const editDef = (def.editMap || []).find(e => e.key === key);
    _cpbPickerColor = item.edits[key] || editDef?.default || '#ffffff';
    _cpbRenderPopup();
    const rect = triggerEl.getBoundingClientRect();
    const popup = document.getElementById('cpbColorPopup');
    popup.style.top = Math.min(rect.bottom + 6, window.innerHeight - 480 - 8) + 'px';
    popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 310)) + 'px';
    document.getElementById('cpbColorOverlay').classList.add('open');
    popup.classList.add('open');
  }

  function closeCpbColorPicker() {
    document.getElementById('cpbColorOverlay').classList.remove('open');
    document.getElementById('cpbColorPopup').classList.remove('open');
  }

  function _cpbRenderPopup() {
    const popup = document.getElementById('cpbColorPopup');
    popup.innerHTML = `<div class="cpb-popup-panel active" id="cpbBrandPanel">${_cpbBrandHtml()}</div>`
                    + `<div class="cpb-popup-panel" id="cpbRgbPanel">${_cpbRgbHtml(_cpbPickerColor)}</div>`;
  }

  function _cpbBrandHtml() {
    let h = '';
    CPB_BRAND_COLORS.forEach(g => {
      h += `<div class="cpb-brand-group"><div class="cpb-brand-group-label">${g.group}</div><div class="cpb-brand-swatches">`;
      g.colors.forEach(c => {
        const active = _cpbPickerColor.toLowerCase() === c.hex.toLowerCase() ? ' active' : '';
        h += `<div class="cpb-brand-swatch${active}" style="background:${c.hex}" data-hex="${c.hex}" onclick="pickCpbBrandColor('${c.hex}')" title="${c.hex}"><span class="cpb-brand-swatch-tip">${c.name} ${c.hex}</span></div>`;
      });
      h += `</div></div>`;
    });
    const styleId = CPB.state.currentProject?.styleId || '';
    const stylePalette = (typeof STYLE_BY_ID !== 'undefined' && Array.isArray(STYLE_BY_ID[styleId]?.paletteColors))
      ? STYLE_BY_ID[styleId].paletteColors
      : [];
    if (stylePalette.length) {
      const styleName = (STYLE_BY_ID[styleId]?.name || 'Current Style').replace(/^Style\d+\s*\((.*)\)$/i, '$1');
      h += `<div class="cpb-brand-group"><div class="cpb-brand-group-label">Style Palette · ${escapeHtml(styleName)}</div><div class="cpb-brand-swatches">`;
      stylePalette.forEach(c => {
        const active = _cpbPickerColor.toLowerCase() === c.hex.toLowerCase() ? ' active' : '';
        h += `<div class="cpb-brand-swatch${active}" style="background:${c.hex}" data-hex="${c.hex}" onclick="pickCpbBrandColor('${c.hex}')" title="${c.hex}"><span class="cpb-brand-swatch-tip">${c.name} ${c.hex}</span></div>`;
      });
      h += `</div></div>`;
    }
    h += `<hr class="cpb-popup-divider"><button class="cpb-other-color-btn" onclick="cpbShowRgb()"><span class="mi">palette</span> Pick other color</button>`;
    return h;
  }

  function _cpbRgbHtml(hex) {
    const r = parseInt((hex||'#ffffff').slice(1,3),16)||0;
    const g = parseInt((hex||'#ffffff').slice(3,5),16)||0;
    const b = parseInt((hex||'#ffffff').slice(5,7),16)||0;
    return `<button class="cpb-rgb-back-btn" onclick="cpbShowBrand()"><span class="mi">arrow_back</span>Brand Colors</button>
<div class="cpb-rgb-preview" id="cpbRgbPreview" style="background:${hex}"></div>
<div class="cpb-rgb-group"><div class="cpb-rgb-label"><span>R</span><span class="cpb-rgb-val" id="cpbRVal">${r}</span></div><input type="range" min="0" max="255" value="${r}" class="cpb-rgb-slider r" id="cpbR" oninput="cpbOnSlider()"></div>
<div class="cpb-rgb-group"><div class="cpb-rgb-label"><span>G</span><span class="cpb-rgb-val" id="cpbGVal">${g}</span></div><input type="range" min="0" max="255" value="${g}" class="cpb-rgb-slider g" id="cpbG" oninput="cpbOnSlider()"></div>
<div class="cpb-rgb-group"><div class="cpb-rgb-label"><span>B</span><span class="cpb-rgb-val" id="cpbBVal">${b}</span></div><input type="range" min="0" max="255" value="${b}" class="cpb-rgb-slider b" id="cpbB" oninput="cpbOnSlider()"></div>
<div class="cpb-hex-row"><input type="text" id="cpbHexInput" value="${hex}" oninput="cpbOnHex()" onkeydown="if(event.key==='Enter')cpbApplyRgb()"><button class="cpb-hex-apply" onclick="cpbApplyRgb()">Apply</button></div>`;
  }

  function cpbShowRgb() {
    document.getElementById('cpbRgbPanel').innerHTML = _cpbRgbHtml(_cpbPickerColor);
    document.getElementById('cpbBrandPanel').classList.remove('active');
    document.getElementById('cpbRgbPanel').classList.add('active');
  }

  function cpbShowBrand() {
    document.getElementById('cpbBrandPanel').classList.remove('active');
    document.getElementById('cpbBrandPanel').innerHTML = _cpbBrandHtml();
    document.getElementById('cpbBrandPanel').classList.add('active');
    document.getElementById('cpbRgbPanel').classList.remove('active');
  }

  function cpbOnSlider() {
    const r = parseInt(document.getElementById('cpbR').value);
    const g = parseInt(document.getElementById('cpbG').value);
    const b = parseInt(document.getElementById('cpbB').value);
    document.getElementById('cpbRVal').textContent = r;
    document.getElementById('cpbGVal').textContent = g;
    document.getElementById('cpbBVal').textContent = b;
    const hex = '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
    document.getElementById('cpbRgbPreview').style.background = hex;
    document.getElementById('cpbHexInput').value = hex.toUpperCase();
  }

  function cpbOnHex() {
    const v = document.getElementById('cpbHexInput').value.trim();
    const hex = v.startsWith('#') ? v : '#' + v;
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    document.getElementById('cpbR').value = r; document.getElementById('cpbRVal').textContent = r;
    document.getElementById('cpbG').value = g; document.getElementById('cpbGVal').textContent = g;
    document.getElementById('cpbB').value = b; document.getElementById('cpbBVal').textContent = b;
    document.getElementById('cpbRgbPreview').style.background = hex;
  }

  function cpbApplyRgb() {
    let hex = document.getElementById('cpbHexInput').value.trim();
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    pickCpbBrandColor(hex);
  }

  function pickCpbBrandColor(hex) {
    _cpbPickerColor = hex;
    setSectionEditValue(_cpbPickerUid, _cpbPickerKey, hex);
    // Update trigger swatch + hex text without full re-render
    const trigger = document.querySelector(`[data-cpb-color-trigger="${_cpbPickerUid}:${_cpbPickerKey}"]`);
    if (trigger) {
      trigger.querySelector('.swatch-preview').style.background = hex;
      trigger.querySelector('.swatch-hex').textContent = hex.toUpperCase();
    }
    closeCpbColorPicker();
  }

  global.openCpbColorPicker = openCpbColorPicker;
  global.closeCpbColorPicker = closeCpbColorPicker;
  global.cpbShowRgb = cpbShowRgb;
  global.cpbShowBrand = cpbShowBrand;
  global.cpbOnSlider = cpbOnSlider;
  global.cpbOnHex = cpbOnHex;
  global.cpbApplyRgb = cpbApplyRgb;
  global.pickCpbBrandColor = pickCpbBrandColor;
})(window);