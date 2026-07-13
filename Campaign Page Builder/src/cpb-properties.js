(function (global) {
  'use strict';

// ─── Render properties panel ──────────────────────────────────────────
function renderProperties() {
  const c = document.getElementById('builderRightContent');
  if (!CPB.state.currentProject || !CPB.state.selectedSectionUid) {
    c.innerHTML = `
      <div class="builder-right-empty">
        <span class="mi">touch_app</span>
        <p>Click a Section in the<br>canvas to edit its properties</p>
      </div>`;
    return;
  }
  const item = CPB.state.currentProject.sections.find(s => s.uid === CPB.state.selectedSectionUid);
  if (!item) { c.innerHTML = ''; return; }
  const def = SECTION_BY_ID[item.sectionType];
  if (!def) return;

  let html = '';
  // Header
  html += `
    <div class="detail-sidebar-header">
      <h3>${escapeHtml(def.name)}</h3>
      <div class="comp-id">${escapeHtml(def.desc)}</div>
    </div>
  `;

  // Anchor ID — not shown for fixed (locked-content) sections like Header/Footer.
  if (!def.fixed) {
    html += `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Anchor ID (#)</div>
        <input class="text-input" value="${escapeAttr(item.anchorId||'')}" placeholder="e.g. features"
               oninput="setSectionAnchor('${item.uid}', this.value)">
        <div class="list-editor-hint">Used for in-page navigation links. Leave empty if not needed.</div>
      </div>
    `;
  }

  // Layout variant
  if (def.layoutVariants && def.layoutVariants.length) {
    html += `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Layout</div>
        <div class="radio-group">
    `;
    def.layoutVariants.forEach(v => {
      html += `
        <label class="${item.layout === v.value ? 'active' : ''}">
          <input type="radio" name="layout-${item.uid}" ${item.layout === v.value ? 'checked' : ''}
                 onchange="setSectionLayout('${item.uid}','${v.value}')">
          ${escapeHtml(v.label)}
        </label>
      `;
    });
    html += `</div></div>`;
  }

  // Mode (light / dark only) — fixed sections are hidden except Site Footer and Sticky Anchor Nav.
  if (!def.fixed || def.id === 'site-footer' || def.id === 'site-anchor-nav') {
    html += `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Section Mode</div>
        <div class="mode-toggle">
          <button class="${item.mode !== 'dark' ? 'active' : ''}" onclick="setSectionMode('${item.uid}','light')">
            <span class="mi">light_mode</span>Light
          </button>
          <button class="${item.mode === 'dark' ? 'active' : ''}" onclick="setSectionMode('${item.uid}','dark')">
            <span class="mi">dark_mode</span>Dark
          </button>
        </div>
        <div class="list-editor-hint">Manually adjust the Section Mode. Please ensure sufficient contrast between the text and background colors for readability.</div>
      </div>
    `;
  }

  // Background variant — not shown for fixed sections.
  if (!def.fixed) {
    const heroBgType = item.options.heroBgType || 'color';
    const mask = item.options.mask || 'none';
    const bgImageDef = getEditDefaultForStyle(def, 'bgImage', CPB.state.currentProject?.styleId) || '';
    const bgImageValue = item.edits.bgImage || bgImageDef;
    const bgColorDef = getEditDefaultForStyle(def, 'bgColor', CPB.state.currentProject?.styleId) || '#ffffff';
    const bgColorValue = item.edits.bgColor || bgColorDef || '#ffffff';
    const maskColorDef = getEditDefaultForStyle(def, 'maskColor', CPB.state.currentProject?.styleId) || '#ffffff';
    const maskColorValue = item.edits.maskColor || maskColorDef || '#ffffff';
    html += `
      <div class="sidebar-section">
        <div class="sidebar-section-title">Background</div>
        <div class="pill-group" style="margin-bottom:8px;">
          <button class="${heroBgType === 'color' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','heroBgType','color')">Color</button>
          <button class="${heroBgType === 'image' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','heroBgType','image')">Image (full)</button>
        </div>
        ${heroBgType === 'color' ? `
        <div class="ctrl-stack" style="margin-bottom:8px;">
          <span class="ctrl-label">Background color</span>
          <button class="cpb-color-trigger" data-cpb-color-trigger="${item.uid}:bgColor" onclick="openCpbColorPicker('${item.uid}','bgColor',this)">
            <span class="swatch-preview" style="background:${escapeAttr(bgColorValue)}"></span>
            <span class="swatch-hex">${bgColorValue.toUpperCase()}</span>
            <span class="mi swatch-chevron">expand_more</span>
          </button>
        </div>` : ''}
        ${heroBgType === 'image' ? `
        <div class="ctrl-stack" style="margin-bottom:8px;">
          <span class="ctrl-label">Background image URL</span>
          <input class="text-input" type="url" value="${escapeAttr(bgImageValue)}" placeholder="https://..." oninput="setSectionEditValue('${item.uid}','bgImage',this.value)" style="margin-bottom:6px;">
          <button type="button" class="pop-upload-btn" style="width:100%;justify-content:center;" onclick="uploadHeroBgImage('${item.uid}')"><span class="mi">upload</span>Upload image</button>
        </div>` : ''}
        ${def.id === 'hero-banner' ? `
        <div class="ctrl-stack">
          <span class="ctrl-label">Bottom mask shape</span>
          <div class="pill-group">
            <button class="${mask === 'none' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','mask','none')">None</button>
            <button class="${mask === 'arc' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','mask','arc')">Arc</button>
            <button class="${mask === 'point-down' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','mask','point-down')">Point down</button>
          </div>
        </div>` : ''}
        ${def.id === 'hero-banner' && mask !== 'none' ? `
        <div class="ctrl-stack" style="margin-top:8px;">
          <span class="ctrl-label">Bottom mask color</span>
          <button class="cpb-color-trigger" data-cpb-color-trigger="${item.uid}:maskColor" onclick="openCpbColorPicker('${item.uid}','maskColor',this)">
            <span class="swatch-preview" style="background:${escapeAttr(maskColorValue)}"></span>
            <span class="swatch-hex">${maskColorValue.toUpperCase()}</span>
            <span class="mi swatch-chevron">expand_more</span>
          </button>
        </div>` : ''}
      </div>
    `;
  }

  // Options
  if (def.optionMap && def.optionMap.length) {
    html += `<div class="sidebar-section" id="sec-opts-${item.uid}">
      <div class="sidebar-section-header" onclick="toggleSidebarSection('sec-opts-${item.uid}')">
        <span class="sidebar-section-title">Options</span>
        <span class="mi section-arrow">expand_less</span>
      </div>
      <div class="sidebar-section-body">
    `;
    def.optionMap.forEach(o => {
      if (o.key === 'heroBgType' || o.key === 'mask') return;
      // Hide card-related options for Feature Cards (D1/D2) — iconPos/showCardCta are in Edit Card panel
      if ((def.id === 'feature-cards' || def.id === 'feature-cards-split') && 
          (o.key === 'cardFrame' || o.key === 'cardBgMode' || o.key === 'hoverFx' || o.key === 'scrollItemCount' || o.key === 'iconPos' || o.key === 'showCardCta')) return;
      // Gate: only show if condition met
      if (o.gate && o.gate.layout && !o.gate.layout.includes(item.layout)) return;
      const val = item.options[o.key] !== undefined ? item.options[o.key] : getOptionDefaultForStyle(def, o.key, CPB.state.currentProject?.styleId);
      if (o.type === 'select' && o.choices) {
        html += `<div class="ctrl-stack">
          <span class="ctrl-label">${escapeHtml(o.label)}</span>
          <div class="pill-group">
        `;
        o.choices.forEach(ch => {
          html += `<button class="${val === ch.value ? 'active' : ''}" onclick="setSectionOption('${item.uid}','${o.key}','${ch.value}')">${escapeHtml(ch.label)}</button>`;
        });
        html += `</div></div>`;
      } else if (o.type === 'number') {
        const min = o.min !== undefined ? o.min : 1;
        const max = o.max !== undefined ? o.max : 100;
        html += `<div class="ctrl-stack">
          <span class="ctrl-label">${escapeHtml(o.label)}</span>
          <input type="number" class="text-input" value="${val}" min="${min}" max="${max}" 
                 oninput="setSectionOption('${item.uid}','${o.key}',parseInt(this.value,10)||${o.default})" 
                 style="width:100%;padding:7px 10px;font-size:12px;">
        </div>`;
      } else {
        html += `<div class="sidebar-toggle-ctrl">
          <span class="ctrl-label">${escapeHtml(o.label)}</span>
          <label class="toggle-switch">
            <input type="checkbox" ${val ? 'checked' : ''} onchange="setSectionOption('${item.uid}','${o.key}',this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>`;
      }
    });
    html += `</div></div>`;
  }

  // Product Series Matrix: per-series product card count (2-5)
  if (def.id === 'product-series-matrix') {
    const seriesDef = (def.editMap || []).find(e => e.key === 'series');
    const rawSeries = (item.edits && item.edits.series) || (seriesDef && seriesDef.default) || [];
    const seriesCount = Math.max(2, Math.min(3, parseInt(item.layout || '3', 10) || 3));
    const visibleSeries = rawSeries.slice(0, seriesCount);
    html += `<div class="sidebar-section" id="sec-p3-count-${item.uid}">
      <div class="sidebar-section-header" onclick="toggleSidebarSection('sec-p3-count-${item.uid}')">
        <span class="sidebar-section-title">Product Cards Per Series</span>
        <span class="mi section-arrow">expand_less</span>
      </div>
      <div class="sidebar-section-body">`;
    visibleSeries.forEach((row, idx) => {
      const current = Math.max(2, Math.min(5, parseInt(row && row.productCount, 10) || 3));
      const seriesLabel = String((row && row.title) || '').trim() || `Series ${idx + 1}`;
      html += `<div class="ctrl-stack">
        <span class="ctrl-label">${escapeHtml(seriesLabel)}</span>
        <select class="text-input" onchange="setListField('${item.uid}','series',${idx},'productCount',this.value)">
          <option value="2" ${current === 2 ? 'selected' : ''}>2 product cards</option>
          <option value="3" ${current === 3 ? 'selected' : ''}>3 product cards</option>
          <option value="4" ${current === 4 ? 'selected' : ''}>4 product cards</option>
          <option value="5" ${current === 5 ? 'selected' : ''}>5 product cards</option>
        </select>
      </div>`;
    });
    html += `<div class="list-editor-hint">Each series supports 2 to 5 product cards.</div>`;
    html += `</div></div>`;
  }

  // Card Settings section for Feature Cards (D1/D2)
  if (def.id === 'feature-cards' || def.id === 'feature-cards-split') {
    const cardFrame = item.options.cardFrame !== undefined ? item.options.cardFrame : 'borderless';
    const cardBgMode = item.options.cardBgMode !== undefined ? item.options.cardBgMode : 'glass';
    const hoverFx = item.options.hoverFx !== undefined ? item.options.hoverFx : true;
    const iconPos = item.options.iconPos !== undefined ? item.options.iconPos : 'top';
    const scrollCount = item.options.scrollItemCount !== undefined ? item.options.scrollItemCount : 6;
    const isScroll = item.layout === 'scroll';
    
    html += `<div class="sidebar-section" id="sec-card-settings-${item.uid}">
      <div class="sidebar-section-header" onclick="toggleSidebarSection('sec-card-settings-${item.uid}')">
        <span class="sidebar-section-title">Card Settings</span>
        <span class="mi section-arrow">expand_less</span>
      </div>
      <div class="sidebar-section-body">
        <div class="ctrl-stack">
          <span class="ctrl-label">Card frame</span>
          <div class="pill-group">
            <button class="${cardFrame === 'outlined' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','cardFrame','outlined')">Outlined</button>
            <button class="${cardFrame === 'borderless' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','cardFrame','borderless')">Borderless</button>
          </div>
        </div>
        ${cardFrame === 'outlined' ? `
        <div class="ctrl-stack">
          <span class="ctrl-label">Card background mode</span>
          <div class="pill-group">
            <button class="${cardBgMode === 'glass' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','cardBgMode','glass')">Glass</button>
            <button class="${cardBgMode === 'colored' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','cardBgMode','colored')">Colored</button>
          </div>
        </div>` : ''}
        <div class="sidebar-toggle-ctrl">
          <span class="ctrl-label">Hover effect</span>
          <label class="toggle-switch">
            <input type="checkbox" ${hoverFx ? 'checked' : ''} onchange="setSectionOption('${item.uid}','hoverFx',this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="ctrl-stack">
          <span class="ctrl-label">Icon position</span>
          <div class="pill-group">
            <button class="${iconPos === 'top' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','iconPos','top')">Top</button>
            <button class="${iconPos === 'left' ? 'active' : ''}" onclick="setSectionOption('${item.uid}','iconPos','left')">Left</button>
          </div>
        </div>
        ${isScroll ? `
        <div class="ctrl-stack">
          <span class="ctrl-label">Number of cards</span>
          <input type="number" class="text-input" value="${scrollCount}" min="5" max="12" 
                 oninput="setSectionOption('${item.uid}','scrollItemCount',parseInt(this.value,10)||6)" 
                 style="width:100%;padding:7px 10px;font-size:12px;">
        </div>` : ''}
      </div>
    </div>`;
  }

  // Inline edits — list type only (text/image edits done inline in canvas)
  const listEdits = (def.editMap || []).filter(e => e.kind === 'list');
  if (listEdits.length) {
    listEdits.forEach(le => {
      // Feature Cards (D1 & D2) are fully inline-edited — no count panel needed.
      if (def.id === 'feature-cards' || def.id === 'feature-cards-split') return;
      // Feature Gallery cards are edited via floating card editor on canvas.
      if (def.id === 'feature-gallery' && le.key === 'items') return;
      // Product Anchor cards are edited via a dedicated popup panel per card.
      if (def.id === 'product-anchor' && le.key === 'items' && le.fields) {
        return;
      }
      // Product Showcase cards are edited via popup panel on canvas cards.
      if (def.id === 'product-showcase' && le.key === 'cards' && le.fields) {
        return;
      }
      // Product Series Matrix uses popup editors on canvas for series/product cards.
      if (def.id === 'product-series-matrix' && le.key === 'series' && le.fields) {
        return;
      }
      if (def.id === 'product-series-matrix' && le.key === 'products' && le.fields) {
        return;
      }
      // Product Rich Content: all card/logo list edits are handled via popup editing on canvas.
      if (def.id === 'product-rich-content' && (le.key === 'features' || le.key === 'products' || le.key === 'partnerLogos')) {
        return;
      }
      // Related Content cards are edited via popup panel on canvas cards.
      if (def.id === 'related-content-hub' && le.key === 'cards' && le.fields) {
        return;
      }
      // FAQ now uses explicit item count in Options; hide the old inline hint block.
      if (def.id === 'faq-accordion' && le.key === 'items') return;
      const list = item.edits[le.key] || le.default || [];
      if (le.fields) {
        // Field-based list editor (used by fixed sections like the anchor
        // nav). Each row exposes its declared fields as text inputs plus a
        // delete button. There is no inline canvas editing for these items.
        html += `<div class="sidebar-section">
          <div class="sidebar-section-title">${escapeHtml(le.label)} (${list.length})</div>`;
        list.forEach((row, idx) => {
          html += `<div class="list-editor-row">
            <div class="list-row-head">
              <span>${escapeHtml(le.label)} ${idx + 1}</span>
              <button title="Remove" style="background:none;border:none;color:#e74c3c;cursor:pointer;display:flex;align-items:center;" onclick="removeListItem('${item.uid}','${le.key}',${idx})"><span class="mi" style="font-size:16px;margin:0;vertical-align:0;">delete</span></button>
            </div>`;
          le.fields.forEach(f => {
            const val = (row && row[f.key]) || '';
            const inputType = f.type === 'url' ? 'url' : 'text';
            html += `<div style="margin-bottom:6px;">
              <label style="display:block;font-size:11px;color:#888;font-weight:600;margin-bottom:3px;">${escapeHtml(f.label)}</label>
              <input class="text-input" type="${inputType}" value="${escapeAttr(val)}" placeholder="${escapeAttr(f.placeholder || '')}" oninput="setListField('${item.uid}','${le.key}',${idx},'${f.key}',this.value)">
              ${f.type === 'image' ? `<button type="button" class="cpb-icon-upload-btn" style="margin-top:6px;width:100%;justify-content:center;" onclick="openSceneLibrary('${item.uid}','${le.key}',${idx},'${f.key}',this)"><span class="mi">photo_library</span>Image Library</button>` : ''}
              ${f.type === 'image' ? `<button type="button" class="pop-upload-btn" style="margin-top:6px;width:100%;justify-content:center;" onclick="uploadListFieldImage('${item.uid}','${le.key}',${idx},'${f.key}')"><span class="mi">upload</span>Upload image</button>` : ''}
            </div>`;
          });
          html += `</div>`;
        });
        html += `<button style="width:100%;padding:8px 12px;font-size:12px;font-weight:600;border:1px dashed #cfd2d5;border-radius:6px;background:#fafafa;color:#0059ff;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;font-family:inherit;" onclick="addListItem('${item.uid}','${le.key}')"><span class="mi" style="font-size:14px;margin:0;vertical-align:0;">add</span>Add ${escapeHtml(le.label.toLowerCase())}</button>`;
        html += `</div>`;
      } else {
        // Inline-edited list (canvas contenteditable). Right panel shows count only.
        html += `<div class="sidebar-section">
          <div class="sidebar-section-title">${escapeHtml(le.label)} (${list.length})</div>
          <div class="list-editor-hint">Inline-edit text / icons directly in the canvas.</div>
        </div>`;
      }
    });
  }

  // Delete button
  html += `<div class="sidebar-section">
    <button class="pill-group" style="width:100%;padding:9px 14px;font-size:12px;font-weight:600;border:1px solid #f0c4c0;border-radius:6px;background:#fff5f4;color:#e74c3c;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"
            onclick="if(confirm('Remove this section?')) removeSection('${item.uid}')">
      <span class="mi">delete</span>Delete this Section
    </button>
  </div>`;

  c.innerHTML = html;
}

function toggleSidebarSection(id) {
  document.getElementById(id)?.classList.toggle('collapsed');
}

// ─── CPB Icon Picker ────────────────────────────────────────────────
const CPB_ICONS = [
  'rocket_launch','tune','palette','devices','language','verified','extension','download',
  'bolt','star','favorite','thumb_up','check_circle','shield','lock','vpn_key',
  'cloud','cloud_upload','cloud_download','sync','autorenew','update','schedule','timer',
  'auto_awesome','auto_fix_high','psychology','memory','smart_toy','science','biotech','factory',
  'precision_manufacturing','engineering','construction','build','handyman','settings','toggle_on','tune',
  'support_agent','help','help_outline','info','tips_and_updates','lightbulb','quiz','contact_support',
  'menu_book','book','school','workspace_premium','emoji_events','military_tech','grade','workspaces',
  'play_circle','play_arrow','pause_circle','smart_display','video_library','live_tv','podcasts','headphones',
  'visibility','search','find_in_page','manage_search','filter_alt','sort','category','label',
  'group','groups','person','badge','account_circle','manage_accounts','admin_panel_settings','supervised_user_circle',
  'mail','forum','chat','sms','notifications','campaign','share','send',
  'shopping_cart','shopping_bag','sell','local_shipping','inventory','receipt_long','payments','attach_money',
  'home','apartment','business','store','location_on','map','public','travel_explore',
  'computer','smartphone','tablet','watch','headset_mic','keyboard','mouse','router',
  'analytics','bar_chart','pie_chart','show_chart','trending_up','insights','dashboard','speed',
  'cable','sensors','signal_cellular_alt','wifi','bluetooth','sd_storage','dns','hub',
  'eco','recycling','solar_power','energy_savings_leaf','water_drop','flash_on','battery_charging_full','power',
];
const CPB_ICON_METADATA_SOURCES = [
  '../Campaign%20Page%20Builder(template)/Google%20Fonts%20Metadata_json.txt',
  'https://fonts.google.com/metadata/icons',
];
let _cpbIconUid = null;
let _cpbIconKeyPath = null;
let _cpbIconCurrent = '';
let _cpbSceneTarget = null;
let _cpbProductDb = [];
let _cpbProductDbReady = false;
let _cpbProductDbLoading = null;
let _cpbIconCatalog = CPB_ICONS.map(name => ({
  name,
  categories: [],
  tags: [],
  popularity: 0,
}));
const CPB_SCENE_LIBRARY = [
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-01_smart-city.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-02_power-source.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-03_smart-factory.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-04_smart-logistic.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-05_smart-retail.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-06_smart-factory.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-07_factory-monitor.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-08_city-energy.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-09_production-line.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-10_metal.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-11_monitor.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-12_robotic-arm.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-13_smart-transportation.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-14_drilling-oil.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-15_agriculture.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-16_drone.jpeg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-17_semi.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-18_factory-monitor.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-19_medical.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-20_city-monitor.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-21_AMR.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-22_Payment-machine.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-23_Self-service-machine.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-24_medical-screen.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-25_medical-screen.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-26_Industrial-screen.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-27_Charging-pile.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-28_AI.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-29_Speed.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-30_Chip.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-31_city-node.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-32_videos.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-33_factory.jpg',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-34_entertainment.jpg',
];
const CPB_SCENE_ENTRIES = CPB_SCENE_LIBRARY.map(url => {
  const fileName = String(url.split('/').pop() || '').replace(/\.[^.]+$/, '');
  return {
    url,
    key: fileName.toLowerCase(),
    label: fileName.replace(/^solutionBG-\d+_?/i, '').replace(/[-_]+/g, ' '),
  };
});
const CPB_PRODUCT_IMAGE_LIBRARY = [
  'https://irp.cdn-website.com/56869327/dms3rep/multi/ADAM-4571.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/P_ULI-224TC_BB-485LDRC9.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_ARK-3534B-00A1.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_IDK-1110WP-50XGB2.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-PD_PPC3.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-PD_TPC02.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-PD_FPM3.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-PPC3125.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-PPC421.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-TPC312.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-TPC315.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-TPC300.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-FPM.png',
];
const CPB_PRODUCT_IMAGE_ENTRIES = CPB_PRODUCT_IMAGE_LIBRARY.map(url => {
  const fileName = String(url.split('/').pop() || '').replace(/\.[^.]+$/, '');
  return {
    url,
    key: fileName.toLowerCase(),
    label: fileName.replace(/[-_]+/g, ' '),
  };
});
function _cpbGetAllProductImageEntries() {
  const fromDbRaw = window.CPB_PRODUCT_DATABASE;
  const products = Array.isArray(fromDbRaw)
    ? fromDbRaw
    : (Array.isArray(fromDbRaw?.products) ? fromDbRaw.products : []);
  const unique = new Map();
  products.forEach(row => {
    const url = String(row?.image || '').trim();
    if (!url) return;
    if (unique.has(url)) return;
    const partNumber = String(row?.PartNumber || '').trim();
    const altName = String(row?.Name || '').trim();
    const fileName = String(url.split('/').pop() || '').replace(/\.[^.]+$/, '');
    unique.set(url, {
      url,
      key: `${partNumber} ${altName} ${fileName}`.trim().toLowerCase(),
      label: partNumber || altName || fileName.replace(/[-_]+/g, ' '),
    });
  });
  CPB_PRODUCT_IMAGE_ENTRIES.forEach(entry => {
    if (!unique.has(entry.url)) unique.set(entry.url, entry);
  });
  return [...unique.values()];
}
const CPB_PARTNER_LOGO_LIBRARY = [
  'https://irp.cdn-website.com/56869327/dms3rep/multi/AMD-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Intel-logo_white.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Hailo-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/QCOM.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/NVIDIA.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/APPRO-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/orbbec-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/intel_prestige-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/nvidia-elite-partner-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Windows-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Ubuntu-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/chrome-os-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Trellix-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Acronis-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/D3-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/innodisk-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/econ-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/orientalmotor-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/sick-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/otobrite-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Framos-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/RealSense-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/Stereolabs-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/XSENS-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/ouster-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/the-autoware-foundation-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/ROS-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/robotics-alliance-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/node-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/cogniteam-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/fixposition-logo-w.png',
  'https://irp.cdn-website.com/56869327/dms3rep/multi/muam-ai-logo-w.png',
];
function _cpbFormatPartnerLogoLabel(fileName) {
  const raw = String(fileName || '').replace(/\.[^.]+$/, '');
  const cleaned = raw
    .replace(/[_-]?logo(?:[_-]?(?:w|white))?$/i, '')
    .replace(/[_-]?white$/i, '')
    .replace(/[_-]?w$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();
  if (!cleaned) return raw;
  return cleaned
    .split(' ')
    .map(token => {
      if (/^[A-Z0-9]+$/.test(token)) return token;
      if (/^(amd|intel|nvidia|qcom|ros|xsens|framos|orbbec|ubuntu|windows)$/i.test(token)) return token.toUpperCase();
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join(' ');
}
const CPB_PARTNER_LOGO_ENTRIES = CPB_PARTNER_LOGO_LIBRARY.map(url => {
  const fileName = String(url.split('/').pop() || '').replace(/\.[^.]+$/, '');
  return {
    url,
    key: fileName.toLowerCase(),
    label: _cpbFormatPartnerLogoLabel(fileName),
  };
});
let _cpbIconCatalogReady = false;

function _parseGoogleIconMetadata(raw) {
  const clean = String(raw || '').replace(/^\)\]\}'\s*/, '');
  const data = JSON.parse(clean);
  const icons = Array.isArray(data?.icons) ? data.icons : [];
  const merged = new Map();
  icons.forEach(icon => {
    const name = String(icon?.name || '').trim();
    if (!name) return;
    const prev = merged.get(name) || { name, categories: [], tags: [], popularity: 0 };
    const categories = new Set([...(prev.categories || []), ...((icon.categories || []).map(String))]);
    const tags = new Set([...(prev.tags || []), ...((icon.tags || []).map(String))]);
    merged.set(name, {
      name,
      categories: [...categories],
      tags: [...tags],
      popularity: Math.max(Number(prev.popularity || 0), Number(icon.popularity || 0)),
    });
  });
  return [...merged.values()];
}

async function initCpbIconCatalog() {
  if (_cpbIconCatalogReady) return;
  for (const src of CPB_ICON_METADATA_SOURCES) {
    try {
      const res = await fetch(src, { cache: 'no-cache' });
      if (!res.ok) continue;
      const txt = await res.text();
      const parsed = _parseGoogleIconMetadata(txt);
      if (!parsed.length) continue;
      parsed.sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0) || a.name.localeCompare(b.name));
      _cpbIconCatalog = parsed;
      _cpbIconCatalogReady = true;
      return;
    } catch (_) {
      // Try next source.
    }
  }
  _cpbIconCatalogReady = true;
}

function openCpbIconPicker(uid, keyPath, triggerEl) {
  _cpbIconUid = uid;
  _cpbIconKeyPath = keyPath;
  const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
  _cpbIconCurrent = resolveEdit(item, keyPath) || getDefaultEdit(item, keyPath) || '';
  initCpbIconCatalog().finally(() => {
    _cpbRenderIconPopup('');
    const popup = document.getElementById('cpbIconPopup');
    popup.style.width = '';
    popup.style.maxHeight = '';
    const rect = triggerEl.getBoundingClientRect();
    popup.style.top = Math.min(rect.bottom + 8, window.innerHeight - 490) + 'px';
    popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 370)) + 'px';
    document.getElementById('cpbIconOverlay').classList.add('open');
    popup.classList.add('open');
    setTimeout(() => document.getElementById('cpbIconSearch')?.focus(), 50);
  });
}
function closeCpbIconPicker() {
  document.getElementById('cpbIconOverlay').classList.remove('open');
  document.getElementById('cpbIconPopup').classList.remove('open');
  _cpbSceneTarget = null;
}
async function initCpbProductDatabase() {
  if (_cpbProductDbReady) return _cpbProductDb;
  if (_cpbProductDbLoading) return _cpbProductDbLoading;
  const embeddedRaw = window.CPB_PRODUCT_DATABASE;
  const embedded = Array.isArray(embeddedRaw)
    ? embeddedRaw
    : (Array.isArray(embeddedRaw?.products) ? embeddedRaw.products : []);
  if (embedded.length) {
    _cpbProductDb = embedded.map(_normalizeProductDatabaseItem).filter(item => item.PartNumber);
    _cpbProductDbReady = true;
    return _cpbProductDb;
  }
  _cpbProductDbLoading = (async () => {
    const sources = ['data/product-database.json', './data/product-database.json'];
    for (const src of sources) {
      try {
        const res = await fetch(src, { cache: 'no-cache' });
        if (!res.ok) continue;
        const data = await res.json();
        const list = Array.isArray(data?.products) ? data.products : [];
        if (!list.length) continue;
        return list.map(_normalizeProductDatabaseItem).filter(item => item.PartNumber);
      } catch (_) {
        // Try next source.
      }
    }
    return [];
  })()
    .then(list => {
      _cpbProductDb = Array.isArray(list) ? list : [];
      _cpbProductDbReady = true;
      return _cpbProductDb;
    })
    .catch(err => {
      console.error('Failed to load product database:', err);
      _cpbProductDb = [];
      _cpbProductDbReady = true;
      return _cpbProductDb;
    })
    .finally(() => {
      _cpbProductDbLoading = null;
    });
  return _cpbProductDbLoading;
}
function _normalizeProductQuery(raw) {
  return String(raw || '').toLowerCase().trim().replace(/\s+/g, ' ');
}
function _extractSkuFromLegacyLink(link) {
  const value = String(link || '').trim();
  if (!value) return null;
  let match = value.match(/productSku=([^&]+)/i);
  if (match) return decodeURIComponent(match[1]);
  match = value.match(/\/s\/product\/detail\/([^/?#]+)/i);
  if (match) return decodeURIComponent(match[1]);
  match = value.match(/\/s\/product\/([^/?#]+)/i);
  if (match) return decodeURIComponent(match[1]);
  return null;
}
function _normalizeProductDatabaseItem(raw) {
  const partNumberRaw = String(raw?.PartNumber || '').trim();
  const nameRaw = String(raw?.Name || raw?.name || '').trim();
  const partNumber = partNumberRaw || nameRaw;
  const altName = partNumberRaw && nameRaw && partNumberRaw.toLowerCase() !== nameRaw.toLowerCase()
    ? nameRaw
    : '';
  const description = String(raw?.description || '').trim();
  const image = String(raw?.image || '').trim();
  const sku = String(raw?.SFCCSKU || '').trim() || _extractSkuFromLegacyLink(raw?.link);
  return {
    PartNumber: partNumber || null,
    Name: altName || null,
    description: description || null,
    image: image || null,
    SFCCSKU: sku || null,
  };
}
function _buildProductLink(product) {
  const partNumber = String(product?.PartNumber || '').trim();
  const sku = String(product?.SFCCSKU || '').trim();
  const store = getCurrentStore();
  if (sku) {
    if (store === 'KR') return `https://www.iotmart.com/ko-kr/ko/product-details?productSku=${encodeURIComponent(sku)}`;
    if (store === 'Global') return `https://www.iotmart.com/en-en/s/product/${encodeURIComponent(sku)}?language=en_US`;
    return `https://www.iotmart.com/en-eu/en/product-details?productSku=${encodeURIComponent(sku)}`;
  }
  if (!partNumber) return '#';
  if (store === 'KR') return `https://www.iotmart.com/ko-kr/ko/search?searchTerm=${encodeURIComponent(partNumber)}`;
  if (store === 'Global') return `https://www.iotmart.com/en-en/s/global-search/${encodeURIComponent(partNumber)}/?page=1&language=en_US`;
  return `https://www.iotmart.com/en-eu/en/search?searchTerm=${encodeURIComponent(partNumber)}`;
}
function _cpbSearchProductDatabase(query) {
  const q = _normalizeProductQuery(query);
  if (!q) return [];
  const terms = q.split(' ').filter(Boolean);
  return _cpbProductDb
    .map(product => {
      const haystack = [
        product.PartNumber,
        product.Name,
        product.description,
        product.SFCCSKU,
      ].filter(Boolean).join(' ').toLowerCase();
      let score = 0;
      if ((product.PartNumber || '').toLowerCase() === q) score += 1000;
      if ((product.PartNumber || '').toLowerCase().includes(q)) score += 500;
      if ((product.Name || '').toLowerCase() === q) score += 800;
      if ((product.Name || '').toLowerCase().includes(q)) score += 420;
      if ((product.description || '').toLowerCase().includes(q)) score += 220;
      if ((product.SFCCSKU || '').toLowerCase().includes(q)) score += 200;
      for (const term of terms) {
        if (haystack.includes(term)) score += Math.max(8, 40 - term.length);
      }
      return { product, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || String(a.product.PartNumber || '').localeCompare(String(b.product.PartNumber || '')))
    .slice(0, 8)
    .map(item => item.product);
}
function _cpbProductSearchLabel(product) {
  const pn = String(product?.PartNumber || '').trim();
  const name = String(product?.Name || '').trim();
  if (pn && name) return `${pn} (${name})`;
  return pn || name || 'Product';
}
function _cpbProductResultMeta(product) {
  const parts = [product.description, product.SFCCSKU].filter(Boolean);
  return parts.join(' · ');
}
function _cpbRenderSelectedProductInfo(popupType, product) {
  const key = popupType === 'showcase' ? 'showcase' : 'seriesItem';
  const el = document.getElementById(`${key}ProductSelectedInfo`);
  if (!el) return;
  if (!product) {
    el.innerHTML = `
      <div class="thumb-placeholder"><span class="mi">inventory_2</span></div>
      <div class="product-db-selected-main">
        <div class="title">No product selected</div>
        <div class="meta">Use search results to auto-fill text, image and link.</div>
        <div class="hint">If no match, expand Manual Edit.</div>
      </div>
    `;
    return;
  }
  const thumb = String(product.image || '').trim()
    ? `<img src="${escapeAttr(product.image)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid';"><div class=\"thumb-placeholder\" style=\"display:none;\"><span class=\"mi\">image</span></div>`
    : `<div class="thumb-placeholder"><span class="mi">image</span></div>`;
  el.innerHTML = `
    ${thumb}
    <div class="product-db-selected-main">
      <div class="title">${escapeHtml(_cpbProductSearchLabel(product))}</div>
      <div class="meta">${escapeHtml(_cpbProductResultMeta(product) || 'No description')}</div>
      <div class="hint">Selected from product database</div>
    </div>
  `;
}
function onProductDatabaseSearchInput(popupType, query) {
  const key = popupType === 'showcase' ? 'showcase' : 'seriesItem';
  const popup = document.getElementById(`${key}ProductPopup`);
  const hasQuery = !!String(query || '').trim();
  if (popup) popup.classList.toggle('is-searching', hasQuery);
  _cpbRenderProductSearchResults(key, query);
}
function _cpbRenderProductSearchResults(popupType, query) {
  const key = popupType === 'showcase' ? 'showcase' : 'seriesItem';
  const listEl = document.getElementById(`${key}ProductSearchResults`);
  if (!listEl) return;
  if (!_cpbProductDb.length) {
    listEl.innerHTML = '<div class="product-db-hint">Product data is currently unavailable. Click the edit icon to fill fields directly.</div>';
    return;
  }
  const results = _cpbSearchProductDatabase(query);
  if (!String(query || '').trim()) {
    listEl.innerHTML = '<div class="product-db-hint">Search by Part Number / description / SKU. Or click the edit icon to fill fields directly.</div>';
    return;
  }
  if (!results.length) {
    listEl.innerHTML = '<div class="product-db-hint">No product found. Click the edit icon to adjust fields manually.</div>';
    return;
  }
  listEl.innerHTML = results.map((product, index) => `
    <button type="button" class="product-db-result" onclick="pickProductDatabaseResult('${key}', ${index})">
      ${String(product.image || '').trim()
        ? `<img class="product-db-result-thumb" src="${escapeAttr(product.image)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=\\'product-db-result-thumb placeholder\\'><span class=\\'mi\\'>image</span></div>'">`
        : `<div class="product-db-result-thumb placeholder"><span class="mi">image</span></div>`}
      <div class="product-db-result-body">
        <div class="product-db-result-title">${escapeHtml(_cpbProductSearchLabel(product))}</div>
        <div class="product-db-result-meta">${escapeHtml(_cpbProductResultMeta(product))}</div>
      </div>
    </button>
  `).join('');
}
function _cpbSetProductPopupFields(popupType, product) {
  const prefix = popupType === 'showcase' ? 'popShowcase' : 'popSeriesItem';
  const titleEl = document.getElementById(`${prefix}Title`);
  const descEl = document.getElementById(`${prefix}Desc`);
  const ctaTextEl = document.getElementById(`${prefix}CtaText`);
  const ctaLinkEl = document.getElementById(`${prefix}CtaLink`);
  const imageUrlEl = document.getElementById(`${prefix}ImageUrl`);
  if (titleEl) titleEl.value = String(product?.PartNumber || '');
  if (descEl) descEl.value = String(product?.description || '');
  if (ctaTextEl) ctaTextEl.value = 'SHOP NOW';
  if (ctaLinkEl) ctaLinkEl.value = _buildProductLink(product);
  if (imageUrlEl) {
    imageUrlEl.value = String(product?.image || '');
    if (popupType === 'showcase') updateProductShowcaseImagePreview(imageUrlEl.value);
    else updateProductSeriesImagePreview(imageUrlEl.value, 'popSeriesItemPreview', 'popSeriesItemDims');
  }
  _cpbSetProductManualEditable(popupType, false);
}
function _cpbSetProductManualEditable(popupType, editable) {
  const key = popupType === 'showcase' ? 'showcase' : 'seriesItem';
  const body = document.getElementById(`${key}ProductManualBody`);
  const btn = document.getElementById(`${key}ProductManualToggle`);
  if (!body) return;
  const isEditable = !!editable;
  body.setAttribute('data-editable', isEditable ? 'true' : 'false');
  body.querySelectorAll('input, textarea, select').forEach(el => {
    el.disabled = !isEditable;
  });
  if (btn) {
    btn.classList.toggle('is-active', isEditable);
    btn.setAttribute('aria-pressed', isEditable ? 'true' : 'false');
    btn.title = isEditable ? 'Editing enabled' : 'Enable field editing';
  }
}
function toggleProductManualEdit(popupType) {
  const key = popupType === 'showcase' ? 'showcase' : 'seriesItem';
  const body = document.getElementById(`${key}ProductManualBody`);
  if (!body) return;
  const next = body.getAttribute('data-editable') !== 'true';
  _cpbSetProductManualEditable(key, next);
}
function pickProductDatabaseResult(popupType, index) {
  const key = popupType === 'showcase' ? 'showcase' : 'seriesItem';
  const results = _cpbSearchProductDatabase(document.getElementById(`${key}ProductSearch`)?.value || '');
  const product = results[index];
  if (!product) return;
  _cpbSetProductPopupFields(key, product);
}
function onProductDatabaseSearchKeydown(e, popupType) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const key = popupType === 'showcase' ? 'showcase' : 'seriesItem';
  const results = _cpbSearchProductDatabase(document.getElementById(`${key}ProductSearch`)?.value || '');
  if (!results.length) {
    toast('No product found', 'error');
    return;
  }
  _cpbSetProductPopupFields(key, results[0]);
  onProductDatabaseSearchInput(key, document.getElementById(`${key}ProductSearch`)?.value || '');
}
function _cpbGetSceneEntries() {
  if (_cpbIsPartnerLogoLibraryTarget()) {
    return CPB_PARTNER_LOGO_ENTRIES;
  }
  if (_cpbIsProductImageLibraryTarget()) {
    return _cpbGetAllProductImageEntries();
  }
  return CPB_SCENE_ENTRIES;
}
function _cpbGetSceneSearchPlaceholder() {
  if (_cpbIsPartnerLogoLibraryTarget()) {
    return 'Search partner logos';
  }
  if (_cpbIsProductImageLibraryTarget()) {
    return 'Search product images';
  }
  return 'Search scene images';
}
function _cpbIsPartnerLogoLibraryTarget() {
  return (_cpbSceneTarget?.mode === 'list' && _cpbSceneTarget?.key === 'partnerLogos' && _cpbSceneTarget?.fieldKey === 'image')
    || (_cpbSceneTarget?.mode === 'input' && _cpbSceneTarget?.inputId === 'popPrcPartnerImageUrl');
}
function _cpbIsProductImageLibraryTarget() {
  if (_cpbSceneTarget?.mode === 'input') {
    return ['popSeriesImageUrl', 'popAnchorImageUrl', 'popShowcaseImageUrl'].includes(String(_cpbSceneTarget.inputId || ''));
  }
  if (_cpbSceneTarget?.mode !== 'list' || _cpbSceneTarget?.fieldKey !== 'image') return false;
  if (_cpbSceneTarget.key === 'series') return true;
  if (_cpbSceneTarget.key !== 'items') return false;
  const item = CPB.state.currentProject?.sections?.find(s => s.uid === _cpbSceneTarget.uid);
  return item?.sectionType === 'product-anchor';
}
function _cpbSearchScenes(filter) {
  const entries = _cpbGetSceneEntries();
  const q = String(filter || '').trim().toLowerCase();
  if (!q) return entries;
  return entries.filter(entry => entry.key.includes(q) || entry.label.toLowerCase().includes(q));
}
function openSceneLibrary(uid, key, idx, fieldKey, triggerEl) {
  _cpbSceneTarget = { mode: 'list', uid, key, idx: Number(idx), fieldKey };
  const popup = document.getElementById('cpbIconPopup');
  const rect = triggerEl.getBoundingClientRect();
  popup.style.width = '520px';
  popup.style.maxHeight = '560px';
  popup.style.top = Math.min(rect.bottom + 8, window.innerHeight - 580) + 'px';
  popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 540)) + 'px';
  document.getElementById('cpbIconOverlay').classList.add('open');
  popup.classList.add('open');
  _cpbRenderScenePopup('');
  setTimeout(() => document.getElementById('cpbSceneSearch')?.focus(), 50);
}
function openSceneLibraryForInput(inputId, triggerEl) {
  _cpbSceneTarget = { mode: 'input', inputId };
  const popup = document.getElementById('cpbIconPopup');
  const rect = triggerEl.getBoundingClientRect();
  popup.style.width = '520px';
  popup.style.maxHeight = '560px';
  popup.style.top = Math.min(rect.bottom + 8, window.innerHeight - 580) + 'px';
  popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 540)) + 'px';
  document.getElementById('cpbIconOverlay').classList.add('open');
  popup.classList.add('open');
  _cpbRenderScenePopup('');
  setTimeout(() => document.getElementById('cpbSceneSearch')?.focus(), 50);
}
function _cpbRenderScenePopup(filter) {
  const popup = document.getElementById('cpbIconPopup');
  if (!_cpbSceneTarget) return;
  const hadFocus = document.activeElement && document.activeElement.id === 'cpbSceneSearch';
  const query = String(filter || '');
  const list = _cpbSearchScenes(filter);
  const current = _cpbSceneTarget.mode === 'input'
    ? String(document.getElementById(_cpbSceneTarget.inputId)?.value || '')
    : (() => {
        const item = CPB.state.currentProject.sections.find(s => s.uid === _cpbSceneTarget.uid);
        return item
          ? String(resolveEdit(item, `${_cpbSceneTarget.key}.${_cpbSceneTarget.idx}.${_cpbSceneTarget.fieldKey}`) || '')
          : '';
      })();
  const isPartnerLogoLibrary = _cpbIsPartnerLogoLibraryTarget();
  const isProductImageLibrary = _cpbIsProductImageLibraryTarget();
  const isSolutionLibrary = !isPartnerLogoLibrary && !isProductImageLibrary;
  const cells = list.length
    ? list.map(scene => `
      <button type="button" class="cpb-scene-cell${isPartnerLogoLibrary ? ' cpb-scene-cell-logo' : ''}${isProductImageLibrary ? ' cpb-scene-cell-product' : ''}${isSolutionLibrary ? ' cpb-scene-cell-solution' : ''}${scene.url === current ? ' active' : ''}" title="${escapeAttr(scene.label)}" onclick="pickSceneImage('${scene.url}')">
        <img class="cpb-scene-thumb" src="${scene.url}" alt="${escapeAttr(scene.label)}" loading="lazy" onerror="if(!this.dataset.retried){this.dataset.retried='1';this.src='${scene.url}' + (('${scene.url}'.includes('?'))?'&':'?') + 'cb=' + Date.now();}else{this.onerror=null;this.style.display='none';const n=this.nextElementSibling;if(n)n.textContent='Image unavailable';}">
        <span class="cpb-scene-name">${escapeHtml(scene.label)}</span>
      </button>
    `).join('')
    : `<div class="cpb-icon-empty">No images match "${escapeHtml(filter || '')}"</div>`;
  popup.innerHTML = `
    <div class="cpb-icon-search-row">
      <input id="cpbSceneSearch" type="text" value="${escapeAttr(query)}" placeholder="${escapeAttr(_cpbGetSceneSearchPlaceholder())}" oninput="_cpbRenderScenePopup(this.value)" onkeydown="onCpbSceneSearchKeydown(event, this.value)">
      <button class="cpb-icon-upload-btn" onclick="uploadSceneImageFromLibrary()"><span class="mi">upload</span>Upload</button>
    </div>
    <div class="cpb-scene-grid${isPartnerLogoLibrary ? ' cpb-scene-grid-logo' : ''}${isProductImageLibrary ? ' cpb-scene-grid-product' : ''}${isSolutionLibrary ? ' cpb-scene-grid-solution' : ''}">${cells}</div>`;
  if (hadFocus) {
    const input = document.getElementById('cpbSceneSearch');
    if (input) {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }
}
function onCpbSceneSearchKeydown(e, value) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const list = _cpbSearchScenes(value);
  if (!list.length) {
    toast('No matching image found', 'error');
    return;
  }
  pickSceneImage(list[0].url);
}
function pickSceneImage(url) {
  if (!_cpbSceneTarget) return;
  const entries = _cpbGetSceneEntries();
  const picked = entries.find(entry => entry.url === url);
  if (_cpbSceneTarget.mode === 'input') {
    const input = document.getElementById(_cpbSceneTarget.inputId);
    if (input) {
      input.value = url;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (_cpbSceneTarget.inputId === 'popPrcPartnerImageUrl') {
      const nameInput = document.getElementById('popPrcPartnerName');
      if (nameInput && !String(nameInput.value || '').trim()) {
        nameInput.value = String(picked?.label || '').trim();
      }
    }
  } else {
    const { uid, key, idx, fieldKey } = _cpbSceneTarget;
    setListField(uid, key, idx, fieldKey, url);
    renderProperties();
  }
  closeCpbIconPicker();
  _cpbSceneTarget = null;
}
function uploadSceneImageFromLibrary() {
  if (!_cpbSceneTarget) return;
  const target = { ..._cpbSceneTarget };
  closeCpbIconPicker();
  if (target.mode === 'input') {
    uploadImageToInput(target.inputId);
  } else {
    uploadListFieldImage(target.uid, target.key, target.idx, target.fieldKey);
  }
}


function _cpbIconScore(entry, normQ) {
  if (!normQ) return Number(entry.popularity || 0) * 0.001;
  const iconName = String(entry.name || '').toLowerCase();
  const nameNoUnderscore = iconName.replace(/_/g, '');
  const qNoUnderscore = normQ.replace(/_/g, '');
  const tags = (entry.tags || []).map(t => String(t).toLowerCase());
  const categories = (entry.categories || []).map(c => String(c).toLowerCase());
  let score = 0;

  if (iconName === normQ) score += 120;
  else if (iconName.startsWith(normQ)) score += 90;
  else if (iconName.includes(normQ)) score += 70;
  else if (nameNoUnderscore.includes(qNoUnderscore)) score += 60;

  if (tags.some(t => t === normQ)) score += 45;
  else if (tags.some(t => t.includes(normQ))) score += 25;

  if (categories.some(c => c === normQ)) score += 20;
  else if (categories.some(c => c.includes(normQ))) score += 10;

  score += Math.log10(Number(entry.popularity || 0) + 10);
  return score;
}

function _cpbSearchIcons(filter) {
  const q = String(filter || '').trim();
  const normQ = _normalizeIconQuery(q);
  const scored = _cpbIconCatalog
    .map(entry => ({ entry, score: _cpbIconScore(entry, normQ) }))
    .filter(x => (normQ ? x.score >= 10 : true))
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name));
  return { normQ, list: scored.map(x => x.entry) };
}

function _cpbRenderIconPopup(filter) {
  const popup = document.getElementById('cpbIconPopup');
  const hadFocus = document.activeElement && document.activeElement.id === 'cpbIconSearch';
  const query = String(filter || '');
  const { normQ, list } = _cpbSearchIcons(filter);
  const exact = list.find(x => x.name === normQ);
  const quickPick = exact
    ? `<button class="cpb-icon-upload-btn" onclick="pickCpbIcon('${exact.name}')"><span class="mi">check_circle</span>Use "${escapeHtml(exact.name)}"</button>`
    : '';
  const cells = list.length
    ? list.map(icon => `<div class="cpb-icon-cell${icon.name===_cpbIconCurrent?' active':''}" title="${icon.name}" onclick="pickCpbIcon('${icon.name}')"><div class="mi">${icon.name}</div></div>`).join('')
    : `<div class="cpb-icon-empty">No icons match "${escapeHtml(normQ)}"</div>`;
  popup.innerHTML = `
    <div class="cpb-icon-search-row">
      <input id="cpbIconSearch" type="text" value="${escapeAttr(query)}" placeholder="Search icons (e.g. rocket)" oninput="_cpbRenderIconPopup(this.value)" onkeydown="onCpbIconSearchKeydown(event, this.value)">
      ${quickPick}
      <button id="cpbIconUploadBtn" class="cpb-icon-upload-btn" onclick="uploadCpbIcon()"><span class="mi">upload</span>Upload</button>
    </div>
    <div class="cpb-icon-grid">${cells}</div>`;
  if (hadFocus) {
    const input = document.getElementById('cpbIconSearch');
    if (input) {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }
}
function _normalizeIconQuery(raw) {
  return String(raw || '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}
function onCpbIconSearchKeydown(e, value) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const { list } = _cpbSearchIcons(value);
  if (!list.length) {
    toast('No matching icon found', 'error');
    return;
  }
  pickCpbIcon(list[0].name);
}
function pickCpbIcon(name) {
  if (!_cpbIconUid || !_cpbIconKeyPath) return;
  setEditValue(_cpbIconUid, _cpbIconKeyPath, name);
  const popIconInput = document.getElementById('popCtaIcon');
  const popIconPreview = document.getElementById('popCtaIconPreview');
  const popAnchorIconPreview = document.getElementById('popAnchorIconPreview');
  const popAnchorIconName = document.getElementById('popAnchorIconName');
  if (popIconInput && /cta[12]Icon$/.test(_cpbIconKeyPath)) {
    popIconInput.value = name;
    if (popIconPreview) popIconPreview.innerHTML = _ctaIconPreviewHtml(name);
  }
  if (popAnchorIconPreview && /^items\.\d+\.icon$/.test(_cpbIconKeyPath)) {
    popAnchorIconPreview.innerHTML = _ctaIconPreviewHtml(name);
    if (popAnchorIconName) popAnchorIconName.textContent = name;
  }
  pushHistory();
  renderCanvas();
  saveCurrentProject(true);
  closeCpbIconPicker();
}

  function setSectionAnchor(uid, val) {
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    if (!item) return;
    item.anchorId = String(val).trim().replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    // Update DOM directly without full rerender to preserve focus
    const el = document.querySelector(`.builder-stack-item[data-uid="${uid}"]`);
    if (el) {
      if (item.anchorId) el.id = item.anchorId;
      else el.removeAttribute('id');
      const tag = el.querySelector('.bsi-anchor-tag');
      if (item.anchorId) {
        if (tag) tag.textContent = '#' + item.anchorId;
        else el.insertAdjacentHTML('afterbegin', `<div class="bsi-anchor-tag">#${escapeHtml(item.anchorId)}</div>`);
      } else if (tag) tag.remove();
    }
    pushHistoryDebounced();
    saveCurrentProject(true);
  }

  function setSectionLayout(uid, val) {
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    if (!item) return;
    item.layout = val;
    pushHistory();
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
  }

  function setSectionMode(uid, val) {
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    if (!item) return;
    item.mode = (val === 'dark') ? 'dark' : 'light';
    const def = SECTION_BY_ID[item.sectionType];
    applyModeBgPresetToSection(item, def, true);
    pushHistory();
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
  }

  function setSectionEditValue(uid, key, val) {
    setEditValue(uid, key, val);
    pushHistoryDebounced();
    renderCanvas();
    saveCurrentProject(true);
  }

  function setSectionOption(uid, key, val) {
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    if (!item) return;
    if (key === 'cardFrame' && val === 'borderless') {
      item.options.cardBgMode = 'glass';
    }
    item.options[key] = val;
    pushHistory();
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
  }

  function addListItem(uid, key) {
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    if (!item) return;
    const def = SECTION_BY_ID[item.sectionType];
    const editDef = (def.editMap || []).find(e => e.key === key);
    if (!editDef) return;
    const list = item.edits[key] ? [...item.edits[key]] : [...(editDef.default || [])];
    let template;
    if (editDef.fields) {
      // Field-based list (e.g. anchor nav items) — add a blank row.
      template = {};
      editDef.fields.forEach(f => { template[f.key] = ''; });
    } else {
      // Inline-edited list — clone last entry as a starter template.
      template = list.length ? JSON.parse(JSON.stringify(list[list.length - 1])) : {};
    }
    list.push(template);
    item.edits[key] = list;
    pushHistory();
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
  }

  function removeListItem(uid, key, idx) {
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    if (!item) return;
    const def = SECTION_BY_ID[item.sectionType];
    const editDef = (def.editMap || []).find(e => e.key === key);
    if (!editDef) return;
    const list = item.edits[key] ? [...item.edits[key]] : [...(editDef.default || [])];
    if (idx < 0 || idx >= list.length) return;
    list.splice(idx, 1);
    item.edits[key] = list;
    pushHistory();
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
  }

  function setListField(uid, key, idx, fieldKey, val) {
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    if (!item) return;
    const def = SECTION_BY_ID[item.sectionType];
    const editDef = (def.editMap || []).find(e => e.key === key);
    if (!editDef) return;
    const list = item.edits[key] ? JSON.parse(JSON.stringify(item.edits[key])) : JSON.parse(JSON.stringify(editDef.default || []));
    if (!list[idx]) list[idx] = {};
    list[idx][fieldKey] = val;
    item.edits[key] = list;
    pushHistoryDebounced();
    renderCanvas();
    saveCurrentProject(true);
  }

  function setListItem(uid, key, idx, nextVals) {
    const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
    if (!item) return;
    const def = SECTION_BY_ID[item.sectionType];
    const editDef = (def.editMap || []).find(e => e.key === key);
    if (!editDef) return;
    const list = item.edits[key] ? JSON.parse(JSON.stringify(item.edits[key])) : JSON.parse(JSON.stringify(editDef.default || []));
    const base = list[idx] || {};
    list[idx] = { ...base, ...nextVals };
    item.edits[key] = list;
    pushHistory();
    renderCanvas();
    saveCurrentProject(true);
  }


// ─── Edit value resolution ────────────────────────────────────────────
function _isCtaTextKeyPath(keyPath) {
  const k = String(keyPath || '').trim();
  return /(^cta1Text$|^cta2Text$|(^|\.)ctaText$)/.test(k);
}

function _normalizeCtaText(raw) {
  // Remove HTML fragments and trailing icon name tokens that can be captured
  // from icon spans during contenteditable copy/paste.
  let text = String(raw == null ? '' : raw)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const trailingIconToken = /(?:\s+)(east|arrow_forward|keyboard_arrow_right|chevron_right|arrow_right_alt)\s*$/i;
  while (trailingIconToken.test(text)) {
    text = text.replace(trailingIconToken, '').trim();
  }
  return text;
}

function setEditValue(uid, keyPath, value) {
  const item = CPB.state.currentProject.sections.find(s => s.uid === uid);
  if (!item) return;
  const nextValue = _isCtaTextKeyPath(keyPath) ? _normalizeCtaText(value) : value;
  // Path: "key" or "key.index.subkey" (for list items)
  const parts = keyPath.split('.');
  if (parts.length === 1) {
    item.edits[parts[0]] = nextValue;
  } else {
    const [listKey, idx, ...rest] = parts;
    const def = SECTION_BY_ID[item.sectionType];
    const editDef = (def.editMap || []).find(e => e.key === listKey);
    const list = item.edits[listKey] ? JSON.parse(JSON.stringify(item.edits[listKey])) : JSON.parse(JSON.stringify(editDef?.default || []));
    let cur = list[parseInt(idx, 10)];
    if (!cur) return;
    if (rest.length === 1) {
      cur[rest[0]] = nextValue;
    } else {
      // For simpler nested paths like "links.j" — treat as line in newline string
      // Currently only used by footer column links — store as joined text
      const subKey = rest[0];
      const subIdx = parseInt(rest[1], 10);
      if (typeof cur[subKey] === 'string') {
        const lines = cur[subKey].split('\n');
        lines[subIdx] = nextValue;
        cur[subKey] = lines.join('\n');
      }
    }
    item.edits[listKey] = list;
  }
}


  global.renderProperties = renderProperties;
  global.toggleSidebarSection = toggleSidebarSection;
  global.initCpbIconCatalog = initCpbIconCatalog;
  global.openCpbIconPicker = openCpbIconPicker;
  global.closeCpbIconPicker = closeCpbIconPicker;
  global.onCpbIconSearchKeydown = onCpbIconSearchKeydown;
  global.pickCpbIcon = pickCpbIcon;
  global._cpbRenderIconPopup = _cpbRenderIconPopup;
  global.onProductDatabaseSearchInput = onProductDatabaseSearchInput;
  global.toggleProductManualEdit = toggleProductManualEdit;
  global.pickProductDatabaseResult = pickProductDatabaseResult;
  global.onProductDatabaseSearchKeydown = onProductDatabaseSearchKeydown;
  global.initCpbProductDatabase = initCpbProductDatabase;
  global._cpbSetProductManualEditable = _cpbSetProductManualEditable;
  global.openSceneLibrary = openSceneLibrary;
  global.openSceneLibraryForInput = openSceneLibraryForInput;
  global._cpbRenderScenePopup = _cpbRenderScenePopup;
  global.onCpbSceneSearchKeydown = onCpbSceneSearchKeydown;
  global.pickSceneImage = pickSceneImage;
  global.uploadSceneImageFromLibrary = uploadSceneImageFromLibrary;
  global.setSectionAnchor = setSectionAnchor;
  global.setSectionLayout = setSectionLayout;
  global.setSectionMode = setSectionMode;
  global.setSectionEditValue = setSectionEditValue;
  global.setSectionOption = setSectionOption;
  global.addListItem = addListItem;
  global.removeListItem = removeListItem;
  global.setListField = setListField;
  global.setListItem = setListItem;
  global._isCtaTextKeyPath = _isCtaTextKeyPath;
  global._normalizeCtaText = _normalizeCtaText;
  global.setEditValue = setEditValue;
})(window);
