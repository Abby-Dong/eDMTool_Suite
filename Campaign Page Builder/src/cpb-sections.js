/* ══════════════════════════════════════════════════════════════════════
   Section Registry
   Each Section is universal — same HTML structure across ALL Styles.
   The Style CSS hooks classes (.cpb-hero, .cpb-card, etc) to render look.

   Each entry shape:
   {
     id, num, group, name, desc,
     defaultBg: 'plain' | 'alt',
     layoutVariants: [{ value, label }],
     defaultLayout,
     optionMap: [{ key, label, type: 'toggle'|'select', default, choices?, gate? }],
     editMap: [{ key, label, kind: 'text'|'image'|'list', default }],
     getHtml(item, helpers) -> string
   }

   `helpers` provides:
     editAttr(item, key)        -> data-cpb-edit="<uid>:<key>"  (used in template)
     editText(item, key, fb)    -> resolved text value (or default)
     editImg(item, key, fb)     -> resolved image url
     editList(item, key, fb)    -> array of items (each with sub-keys)
     iconHtml(name)             -> material icon span
     opt(item, key)             -> resolved option value
   ══════════════════════════════════════════════════════════════════════ */

/* Shared heading group — eyebrow / headline / subtitle / divider / body.
   Every section renders the SAME structure & classes through this helper;
   only the Hero opts out. `opts` remaps edit keys / toggles for the few
   sections that use different field names (e.g. P2 uses `tag`, G1/E2 use
   `headline`/`title`). The divider is a semantic <hr>, not an empty <div>. */
function renderHeadingGroup(item, h, opts) {
  const o = opts || {};
  const eyebrowKey  = o.eyebrowKey  || 'eyebrow';
  const headlineKey = o.headlineKey || 'sectionTitle';
  const subtitleKey = o.subtitleKey || 'sectionSubtitle';
  const bodyKey     = o.bodyKey     || 'sectionBody';
  const eyebrowTog  = o.eyebrowToggle  || 'showEyebrow';
  const headlineTog = o.headlineToggle || 'showHeadline';
  const subtitleTog = o.subtitleToggle || 'showSubtitle';
  const dividerTog  = o.dividerToggle  || 'showDivider';
  const bodyTog     = o.bodyToggle     || 'showBody';
  return [
    h.opt(item, eyebrowTog)  ? `<div class="cpb-eyebrow" ${h.editAttr(item, eyebrowKey)}>${h.editText(item, eyebrowKey)}</div>` : '',
    h.opt(item, headlineTog) ? `<div class="cpb-feature-headline" ${h.editAttr(item, headlineKey)}>${h.editText(item, headlineKey)}</div>` : '',
    h.opt(item, subtitleTog) ? `<div class="cpb-feature-subtitle" ${h.editAttr(item, subtitleKey)}>${h.editText(item, subtitleKey)}</div>` : '',
    h.opt(item, dividerTog)  ? `<hr class="cpb-feature-divider">` : '',
    h.opt(item, bodyTog)     ? `<div class="cpb-feature-body" ${h.editAttr(item, bodyKey)}>${h.editText(item, bodyKey)}</div>` : '',
  ].filter(Boolean).join('\n      ');
}

const SECTIONS = [

/* ──────────────────────────────────────────────────────────────────────
   B1 — Hero Banner
   The entry point for every campaign page.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'hero-banner', num: 'B1', group: 'B', name: 'Hero Banner',
  desc: 'Top-of-page headline + CTA. Left-text/right-image or full text.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#eef3ff"/><rect x="8" y="9" width="90" height="8" rx="2" fill="#0059ff" opacity=".6"/><rect x="8" y="22" width="130" height="5" rx="2" fill="#b0b8c8"/><rect x="8" y="31" width="110" height="5" rx="2" fill="#b0b8c8"/><rect x="8" y="40" width="36" height="6" rx="3" fill="#0059ff" opacity=".7"/><rect x="50" y="40" width="36" height="6" rx="3" fill="none" stroke="#0059ff" stroke-width="1" opacity=".5"/><rect x="164" y="4" width="108" height="40" rx="5" fill="#c5d4ff" opacity=".5"/><text x="218" y="27" font-size="9" fill="#0059ff" opacity=".5" text-anchor="middle" font-family="sans-serif">image</text></svg>`,

  defaultBg: 'plain',
  layoutVariants: [
    { value: 'split',     label: 'Left text / Right image' },
    { value: 'full-text', label: 'Full text' },
  ],
  defaultLayout: 'split',
  optionMap: [
    { key: 'showEyebrow',      label: 'Show eyebrow',        type: 'toggle', default: true },
    { key: 'showSubtitle',     label: 'Show subtitle',       type: 'toggle', default: true },
    { key: 'showBody',         label: 'Show body',           type: 'toggle', default: true },
    { key: 'showFirstCta',     label: 'Show 1st CTA',        type: 'toggle', default: true },
    { key: 'showSecondCta',    label: 'Show 2nd CTA',        type: 'toggle', default: true },
    { key: 'heroBgType',       label: 'Background type',     type: 'select', default: 'color',
      choices: [
        { value: 'color', label: 'Color' },
        { value: 'image', label: 'Image (full)' },
      ] },
    { key: 'mask',             label: 'Bottom mask shape',   type: 'select', default: 'none',
      choices: [
        { value: 'none',       label: 'None' },
        { value: 'arc',        label: 'Arc' },
        { value: 'point-down', label: 'Point down' },
      ] },
  ],
  editMap: [
    { key: 'eyebrow',   label: 'Eyebrow',    kind: 'text',  default: '#Lorem | #Ipsum | #Placeholder' },
    { key: 'headline',  label: 'Headline',   kind: 'text',  default: 'Lorem Ipsum' },
    { key: 'subtitle',  label: 'Subtitle',   kind: 'text',  default: 'Neque porro quisquam est qui dolorem ipsum quia dolor' },
    { key: 'body',      label: 'Body',       kind: 'text',  default: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { key: 'cta1Text',  label: 'CTA 1 text', kind: 'text',  default: 'Learn More' },
    { key: 'cta1Url',   label: 'CTA 1 link', kind: 'text',  default: '#' },
    { key: 'cta1Style', label: 'CTA 1 style',kind: 'text',  default: 'solid' },
    { key: 'cta1HasIcon', label: 'CTA 1 icon', kind: 'text', default: 'false' },
    { key: 'cta1Icon', label: 'CTA 1 icon name', kind: 'text', default: 'arrow_forward' },
    { key: 'cta1IconPos', label: 'CTA 1 icon position', kind: 'text', default: 'right' },
    { key: 'cta2Text',  label: 'CTA 2 text', kind: 'text',  default: 'Contact Us' },
    { key: 'cta2Url',   label: 'CTA 2 link', kind: 'text',  default: '#' },
    { key: 'cta2Style', label: 'CTA 2 style',kind: 'text',  default: 'line' },
    { key: 'cta2HasIcon', label: 'CTA 2 icon', kind: 'text', default: 'false' },
    { key: 'cta2Icon', label: 'CTA 2 icon name', kind: 'text', default: 'arrow_forward' },
    { key: 'cta2IconPos', label: 'CTA 2 icon position', kind: 'text', default: 'right' },
    { key: 'image',     label: 'Hero image', kind: 'image', default: 'https://irp.cdn-website.com/56869327/dms3rep/multi/IDS-25-Product.png' },
    { key: 'bgImage',   label: 'Bg image (full)', kind: 'image', default: 'https://irp.cdn-website.com/56869327/dms3rep/multi/IDS-25-KV.png' },
    { key: 'bgColor',   label: 'Bg color', kind: 'text', default: '#ffffff' },
    { key: 'maskColor', label: 'Bottom mask color', kind: 'text', default: '#ffffff' },
  ],
  getHtml(item, h) {
    const layout = item.layout || 'split';
    const bgType = h.opt(item,'heroBgType') || 'color';
    const isImageBg = bgType === 'image';
    const bgColor = h.editText(item, 'bgColor', '#ffffff');
    const maskColor = h.editText(item, 'maskColor', '#ffffff');
    const wrapperStyle = `--cpb-hero-mask-color:${maskColor};`;
    const bgStyle = isImageBg
      ? `background-image:url('${h.editImg(item, 'bgImage')}');--cpb-hero-mask-color:${maskColor};`
      : `background-color:${bgColor};--cpb-hero-mask-color:${maskColor};`;
    const cta1Style = String(h.editText(item, 'cta1Style', 'solid')) === 'line' ? 'line' : 'solid';
    const cta2Style = String(h.editText(item, 'cta2Style', 'line')) === 'solid' ? 'solid' : 'line';
    const cta1HasIcon = String(h.editText(item, 'cta1HasIcon', 'false')) === 'true';
    const cta2HasIcon = String(h.editText(item, 'cta2HasIcon', 'false')) === 'true';
    const cta1Icon = String(h.editText(item, 'cta1Icon', 'arrow_forward') || 'arrow_forward');
    const cta2Icon = String(h.editText(item, 'cta2Icon', 'arrow_forward') || 'arrow_forward');
    const cta1IconPos = String(h.editText(item, 'cta1IconPos', 'right')) === 'left' ? 'left' : 'right';
    const cta2IconPos = String(h.editText(item, 'cta2IconPos', 'right')) === 'left' ? 'left' : 'right';
    const renderCtaIcon = (name) => {
      if (/^(https?:|data:|\/)/.test(name)) return `<img class="cpb-cta-icon-img" src="${name}" alt="">`;
      return `<span class="mi cpb-cta-icon">${name}</span>`;
    };
    return `
<div class="cpb-hero-mask-wrap" style="${wrapperStyle}">
<div class="cpb-section cpb-hero" data-layout="${layout}" data-bgtype="${isImageBg ? 'image' : 'color'}" data-mask="${h.opt(item,'mask')}" data-bg="${item.bg||'plain'}" data-mode="${item.mode || ''}" style="${bgStyle}">
  <div class="cpb-hero-inner">
    <div class="cpb-hero-text">
      ${h.opt(item,'showEyebrow') ? `<div class="cpb-eyebrow" ${h.editAttr(item,'eyebrow')}>${h.editText(item,'eyebrow')}</div>` : ''}
      <div class="cpb-headline" ${h.editAttr(item,'headline')}>${h.editText(item,'headline')}</div>
      ${h.opt(item,'showSubtitle') ? `<div class="cpb-subtitle" ${h.editAttr(item,'subtitle')}>${h.editText(item,'subtitle')}</div>` : ''}
      ${h.opt(item,'showBody') ? `<div class="cpb-body cpb-hero-body" ${h.editAttr(item,'body')}>${h.editText(item,'body')}</div>` : ''}
      <div class="cpb-hero-cta-group">
        ${h.opt(item,'showFirstCta') ? `<a class="${cta1Style === 'line' ? 'cpb-btn-secondary' : 'cpb-btn-primary'}" href="${h.editText(item,'cta1Url')}" data-cpb-edit-cta="${item.uid}:cta1">${cta1HasIcon && cta1IconPos === 'left' ? renderCtaIcon(cta1Icon) : ''}<span class="cpb-btn-label">${h.editText(item,'cta1Text')}</span>${cta1HasIcon && cta1IconPos === 'right' ? renderCtaIcon(cta1Icon) : ''}</a>` : ''}
        ${h.opt(item,'showSecondCta') ? `<a class="${cta2Style === 'solid' ? 'cpb-btn-primary' : 'cpb-btn-secondary'}" href="${h.editText(item,'cta2Url')}" data-cpb-edit-cta="${item.uid}:cta2">${cta2HasIcon && cta2IconPos === 'left' ? renderCtaIcon(cta2Icon) : ''}<span class="cpb-btn-label">${h.editText(item,'cta2Text')}</span>${cta2HasIcon && cta2IconPos === 'right' ? renderCtaIcon(cta2Icon) : ''}</a>` : ''}
      </div>
    </div>
    ${(layout==='split') ? `
    <div class="cpb-hero-media">
      <img class="cpb-hero-image" src="${h.editImg(item,'image')}" ${h.editAttr(item,'image')} alt="hero">
    </div>` : ''}
  </div>
</div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   D1 — Feature Cards Grid
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'feature-cards', num: 'D1', group: 'D', name: 'Feature Cards',
  desc: 'Grid of feature/icon cards. 2-8 columns or horizontal scroll.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f8f9fb"/><rect x="4" y="3" width="83" height="42" rx="4" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="10" y="8" width="22" height="18" rx="3" fill="#eef3ff"/><rect x="36" y="10" width="44" height="5" rx="2" fill="#c5d4ff"/><rect x="36" y="19" width="34" height="4" rx="1" fill="#e5e7eb"/><rect x="10" y="36" width="34" height="5" rx="2" fill="#0059ff" opacity=".5"/><rect x="98" y="3" width="83" height="42" rx="4" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="104" y="8" width="22" height="18" rx="3" fill="#eef3ff"/><rect x="130" y="10" width="44" height="5" rx="2" fill="#c5d4ff"/><rect x="130" y="19" width="34" height="4" rx="1" fill="#e5e7eb"/><rect x="104" y="36" width="34" height="5" rx="2" fill="#0059ff" opacity=".5"/><rect x="192" y="3" width="84" height="42" rx="4" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="198" y="8" width="22" height="18" rx="3" fill="#eef3ff"/><rect x="224" y="10" width="44" height="5" rx="2" fill="#c5d4ff"/><rect x="224" y="19" width="34" height="4" rx="1" fill="#e5e7eb"/><rect x="198" y="36" width="34" height="5" rx="2" fill="#0059ff" opacity=".5"/></svg>`,

  defaultBg: 'alt',
  layoutVariants: [
    { value: '2',      label: '2 columns' },
    { value: '3',      label: '3 columns' },
    { value: '4',      label: '4 columns' },
    { value: '6',      label: '6 items (3 col)' },
    { value: '8',      label: '8 items (4 col)' },
    { value: 'scroll', label: 'Horizontal scroll' },
  ],
  defaultLayout: '3',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'headerAlign', label: 'Header alignment', type: 'select', default: 'left',
      choices: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
    { key: 'showEyebrow',  label: 'Show eyebrow',     type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline',    type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle',    type: 'toggle', default: true },
    { key: 'showDivider',  label: 'Show divider line', type: 'toggle', default: true },
    { key: 'showBody',     label: 'Show body text',   type: 'toggle', default: true },
    { key: 'cardFrame', label: 'Card frame', type: 'select', default: 'borderless',
      choices: [
        { value: 'outlined',   label: 'Outlined' },
        { value: 'borderless', label: 'Borderless' },
      ] },
    { key: 'cardBgMode', label: 'Card background mode', type: 'select', default: 'glass',
      choices: [
        { value: 'glass',   label: 'Glass' },
        { value: 'colored', label: 'Colored' },
      ] },
    { key: 'hoverFx', label: 'Hover effect', type: 'toggle', default: true },
    { key: 'iconPos', label: 'Icon position', type: 'select', default: 'top',
      choices: [
        { value: 'top',  label: 'Top' },
        { value: 'left', label: 'Left' },
      ] },
    { key: 'showCardCta', label: 'Show card CTA link', type: 'toggle', default: false },
    { key: 'scrollItemCount', label: 'Number of cards (scroll)', type: 'number', default: 6, min: 5, max: 12,
      gate: { layout: ['scroll'] } },
  ],
  editMap: [
    { key: 'bgColor',         label: 'Bg color',         kind: 'text',  default: '' },
    { key: 'bgImage',         label: 'Bg image',         kind: 'image', default: '' },
    { key: 'eyebrow',         label: 'Eyebrow',          kind: 'text', default: '#Lorem | #Ipsum' },
    { key: 'sectionTitle',    label: 'Headline',         kind: 'text', default: 'Lorem Ipsum' },
    { key: 'sectionSubtitle', label: 'Subtitle',         kind: 'text', default: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...' },
    { key: 'sectionBody',     label: 'Body text',        kind: 'text', default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { key: 'cards', label: 'Cards', kind: 'list', itemCount: 8, default: [
      { icon: 'rocket_launch',  title: 'Lorem ipsum',          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',    ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'tune',           title: 'Neque porro quisquam', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.',  ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'palette',        title: 'Lorem ipsum',          desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'devices',        title: 'Neque porro quisquam', desc: 'Duis aute irure dolor in reprehenderit in voluptate velit.',  ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'language',       title: 'Lorem ipsum',          desc: 'Excepteur sint occaecat cupidatat non proident deserunt.',    ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'verified',       title: 'Neque porro quisquam', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',    ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'extension',      title: 'Lorem ipsum',          desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.',  ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'download',       title: 'Neque porro quisquam', desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', ctaText: 'Learn more', ctaUrl: '#' },
    ]},
  ],
  getHtml(item, h) {
    const cards = h.editList(item, 'cards');
    const cols = item.layout || '3';
    const scrollCount = parseInt(h.opt(item, 'scrollItemCount'), 10) || 6;
    const visibleCount = (cols === 'scroll') ? scrollCount :
                         (cols === '6') ? 6 :
                         (cols === '8') ? 8 :
                         parseInt(cols, 10) || cards.length;
    const sliced = cards.slice(0, visibleCount);
    const frame = h.opt(item,'cardFrame');
    const cardBgMode = h.opt(item,'cardBgMode') === 'colored' ? 'colored' : 'glass';
    const effectiveCardBgMode = frame === 'borderless' ? 'glass' : cardBgMode;
    const frameClass = frame==='borderless' ? ' cpb-card--borderless' : '';
    const hover = h.opt(item,'hoverFx') ? 'true' : 'false';
    const iconPos = h.opt(item,'iconPos') || 'top';
    const legacyShowCta = h.opt(item,'showCardCta');
    const align = h.opt(item,'headerAlign') || 'center';
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background:${bgColor};background-image:none;` : '';
    const showHead = h.opt(item,'showEyebrow') || h.opt(item,'showHeadline') ||
                     h.opt(item,'showSubtitle') || h.opt(item,'showDivider') || h.opt(item,'showBody');

    return `
<div class="cpb-section cpb-feature-section" data-bg="${item.bg||'alt'}" data-mode="${item.mode || ''}" data-card-bg-mode="${effectiveCardBgMode}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  ${showHead ? `
  <div class="cpb-feature-head" data-align="${align}">
      ${renderHeadingGroup(item, h)}
  </div>` : ''}
  <div class="cpb-feature-cards" data-cols="${cols}">
    ${sliced.map((c, i) => {
      const ctaEnabled = String(c.ctaEnabled ?? (legacyShowCta ? 'true' : 'false')) === 'true';
      return `
    <a class="cpb-card${frameClass}" href="${c.ctaUrl||'#'}" data-cpb-edit-cta="${item.uid}:cards.${i}" data-icon-pos="${iconPos}" data-hover="${hover}" data-card-cta-enabled="${ctaEnabled ? 'true' : 'false'}">
      <div class="cpb-card-icon" data-cpb-edit-icon="${item.uid}:cards.${i}.icon">${h.iconHtml(c.icon)}</div>
      <div>
        <div class="cpb-card-title" ${h.editAttr(item,'cards.'+i+'.title')}>${c.title||''}</div>
        <div class="cpb-card-desc" ${h.editAttr(item,'cards.'+i+'.desc')}>${c.desc||''}</div>
        ${ctaEnabled ? `<span class="cpb-card-cta">${c.ctaText||'Learn more'}${String(c.ctaHasIcon ?? 'true') !== 'false' ? '<span class="mi">arrow_forward</span>' : ''}</span>` : ''}
      </div>
    </a>`;
    }).join('')}
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   D2 — Feature Cards Split (sticky left text + 2-col right cards)
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'feature-cards-split', num: 'D2', group: 'D', name: 'Feature Cards (Split)',
  desc: 'Sticky left text block, right-side 2-column cards (4/6/8 items).',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f8f9fb"/><rect x="6" y="8" width="60" height="5" rx="2" fill="#0059ff" opacity=".5"/><rect x="6" y="17" width="78" height="6" rx="2" fill="#b0b8c8"/><rect x="6" y="28" width="40" height="3" rx="1" fill="#0059ff" opacity=".7"/><rect x="6" y="35" width="80" height="3" rx="1" fill="#e5e7eb"/><rect x="100" y="4" width="84" height="20" rx="3" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="106" y="9" width="40" height="3" rx="1" fill="#c5d4ff"/><rect x="106" y="15" width="60" height="3" rx="1" fill="#e5e7eb"/><rect x="190" y="4" width="84" height="20" rx="3" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="196" y="9" width="40" height="3" rx="1" fill="#c5d4ff"/><rect x="196" y="15" width="60" height="3" rx="1" fill="#e5e7eb"/><rect x="100" y="28" width="84" height="16" rx="3" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="106" y="32" width="40" height="3" rx="1" fill="#c5d4ff"/><rect x="106" y="38" width="60" height="3" rx="1" fill="#e5e7eb"/><rect x="190" y="28" width="84" height="16" rx="3" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="196" y="32" width="40" height="3" rx="1" fill="#c5d4ff"/><rect x="196" y="38" width="60" height="3" rx="1" fill="#e5e7eb"/></svg>`,

  defaultBg: 'alt',
  layoutVariants: [
    { value: '4', label: '4 cards (2×2)' },
    { value: '6', label: '6 cards (2×3)' },
    { value: '8', label: '8 cards (2×4)' },
  ],
  defaultLayout: '4',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'showEyebrow',  label: 'Show eyebrow',     type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline',    type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle',    type: 'toggle', default: true },
    { key: 'showDivider',  label: 'Show divider line', type: 'toggle', default: true },
    { key: 'showBody',     label: 'Show body text',   type: 'toggle', default: true },
    { key: 'cardFrame', label: 'Card frame', type: 'select', default: 'outlined',
      choices: [
        { value: 'outlined',   label: 'Outlined' },
        { value: 'borderless', label: 'Borderless' },
      ] },
    { key: 'cardBgMode', label: 'Card background mode', type: 'select', default: 'glass',
      choices: [
        { value: 'glass',   label: 'Glass' },
        { value: 'colored', label: 'Colored' },
      ] },
    { key: 'hoverFx', label: 'Hover effect', type: 'toggle', default: true },
    { key: 'iconPos', label: 'Icon position', type: 'select', default: 'top',
      choices: [
        { value: 'top',  label: 'Top' },
        { value: 'left', label: 'Left' },
      ] },
    { key: 'showCardCta', label: 'Show card CTA link', type: 'toggle', default: false },
  ],
  editMap: [
    { key: 'bgColor',         label: 'Bg color',         kind: 'text',  default: '' },
    { key: 'bgImage',         label: 'Bg image',         kind: 'image', default: '' },
    { key: 'eyebrow',         label: 'Eyebrow',          kind: 'text', default: '#Lorem | #Ipsum' },
    { key: 'sectionTitle',    label: 'Headline',         kind: 'text', default: 'Lorem Ipsum' },
    { key: 'sectionSubtitle', label: 'Subtitle',         kind: 'text', default: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...' },
    { key: 'sectionBody',     label: 'Body text',        kind: 'text', default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { key: 'cards', label: 'Cards', kind: 'list', itemCount: 8, default: [
      { icon: 'rocket_launch',  title: 'Lorem ipsum',          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',    ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'tune',           title: 'Neque porro quisquam', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.',  ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'palette',        title: 'Lorem ipsum',          desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'devices',        title: 'Neque porro quisquam', desc: 'Duis aute irure dolor in reprehenderit in voluptate velit.',  ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'language',       title: 'Lorem ipsum',          desc: 'Excepteur sint occaecat cupidatat non proident deserunt.',    ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'verified',       title: 'Neque porro quisquam', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',    ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'extension',      title: 'Lorem ipsum',          desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.',  ctaText: 'Learn more', ctaUrl: '#' },
      { icon: 'download',       title: 'Neque porro quisquam', desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', ctaText: 'Learn more', ctaUrl: '#' },
    ]},
  ],
  getHtml(item, h) {
    const cards = h.editList(item, 'cards');
    const cols = item.layout || '4';
    const visibleCount = parseInt(cols, 10) || cards.length;
    const sliced = cards.slice(0, visibleCount);
    const frame = h.opt(item,'cardFrame');
    const cardBgMode = h.opt(item,'cardBgMode') === 'colored' ? 'colored' : 'glass';
    const effectiveCardBgMode = frame === 'borderless' ? 'glass' : cardBgMode;
    const frameClass = frame==='borderless' ? ' cpb-card--borderless' : '';
    const hover = h.opt(item,'hoverFx') ? 'true' : 'false';
    const iconPos = h.opt(item,'iconPos') || 'top';
    const legacyShowCta = h.opt(item,'showCardCta');
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background:${bgColor};background-image:none;` : '';
    const showHead = h.opt(item,'showEyebrow') || h.opt(item,'showHeadline') ||
                     h.opt(item,'showSubtitle') || h.opt(item,'showDivider') || h.opt(item,'showBody');

    return `
<div class="cpb-section cpb-feature-section cpb-feature-split-section" data-bg="${item.bg||'alt'}" data-mode="${item.mode || ''}" data-card-bg-mode="${effectiveCardBgMode}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  <div class="cpb-feature-split">
    ${showHead ? `
    <div class="cpb-feature-head" data-align="left">
      ${renderHeadingGroup(item, h)}
    </div>` : '<div></div>'}
    <div class="cpb-feature-split-cards">
      ${sliced.map((c, i) => {
        const ctaEnabled = String(c.ctaEnabled ?? (legacyShowCta ? 'true' : 'false')) === 'true';
        return `
      <a class="cpb-card${frameClass}" href="${c.ctaUrl||'#'}" data-cpb-edit-cta="${item.uid}:cards.${i}" data-icon-pos="${iconPos}" data-hover="${hover}" data-card-cta-enabled="${ctaEnabled ? 'true' : 'false'}">
        <div class="cpb-card-icon" data-cpb-edit-icon="${item.uid}:cards.${i}.icon">${h.iconHtml(c.icon)}</div>
        <div>
          <div class="cpb-card-title" ${h.editAttr(item,'cards.'+i+'.title')}>${c.title||''}</div>
          <div class="cpb-card-desc" ${h.editAttr(item,'cards.'+i+'.desc')}>${c.desc||''}</div>
          ${ctaEnabled ? `<span class="cpb-card-cta">${c.ctaText||'Learn more'}${String(c.ctaHasIcon ?? 'true') !== 'false' ? '<span class="mi">arrow_forward</span>' : ''}</span>` : ''}
        </div>
      </a>`;
      }).join('')}
    </div>
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   D3 — Feature Gallery
   Image-first gallery cards with hover reveal (IDS-08 inspired).
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'feature-gallery', num: 'D3', group: 'D', name: 'Feature Gallery',
  desc: 'Image gallery cards with category label and hover-reveal description.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f6f7f9"/><rect x="4" y="3" width="64" height="42" fill="#9fb9d9"/><rect x="72" y="3" width="64" height="42" fill="#6f8fb4"/><rect x="140" y="3" width="64" height="42" fill="#8aa3c0"/><rect x="208" y="3" width="68" height="42" fill="#5a7b9f"/><rect x="8" y="31" width="48" height="10" fill="rgba(0,0,0,.45)"/><rect x="76" y="31" width="48" height="10" fill="rgba(0,0,0,.45)"/><rect x="144" y="31" width="48" height="10" fill="rgba(0,0,0,.45)"/><rect x="212" y="31" width="52" height="10" fill="rgba(0,0,0,.45)"/></svg>`,

  defaultBg: 'alt',
  layoutVariants: [
    { value: '4', label: '4 cards' },
    { value: '8', label: '8 cards' },
  ],
  defaultLayout: '8',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'headerAlign', label: 'Header alignment', type: 'select', default: 'left',
      choices: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
    { key: 'showEyebrow',  label: 'Show eyebrow',      type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline',     type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle',     type: 'toggle', default: true },
    { key: 'showDivider',  label: 'Show divider line', type: 'toggle', default: true },
    { key: 'showBody',     label: 'Show body text',    type: 'toggle', default: true },
  ],
  editMap: [
    { key: 'bgColor',      label: 'Bg color', kind: 'text',  default: '' },
    { key: 'bgImage',      label: 'Bg image', kind: 'image', default: '' },
    { key: 'eyebrow',      label: 'Eyebrow',  kind: 'text', default: '#Lorem | #Ipsum' },
    { key: 'sectionTitle', label: 'Headline', kind: 'text', default: 'Lorem Ipsum Dolor Sit Amet' },
    { key: 'sectionSubtitle', label: 'Subtitle', kind: 'text', default: 'Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.' },
    { key: 'sectionBody',  label: 'Body text', kind: 'text', default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { key: 'itemDefaultImage', label: 'Card image fallback', kind: 'image', default: '' },
    { key: 'items', label: 'Gallery items', kind: 'list', itemCount: 8, default: [
      { tag: '# Lorem',               title: 'Lorem Ipsum Dolor',                        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/C-IDS-25-Arc-01.png', ctaEnabled: false, ctaText: 'Learn more', ctaLink: '#' },
      { tag: '# Ipsum',               title: 'Sit Amet Consectetur',                     desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/IDS-25-Arc-02.png', ctaEnabled: false, ctaText: 'Learn more', ctaLink: '#' },
      { tag: '# Dolor',               title: 'Adipiscing Elit Nunc',                     desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/C-IDS-25-Arc-03.png', ctaEnabled: false, ctaText: 'Learn more', ctaLink: '#' },
      { tag: '# Amet',                title: 'Tempor Incididunt Ut',                     desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/C-IDS-25-Arc-04.png', ctaEnabled: false, ctaText: 'Learn more', ctaLink: '#' },
      { tag: '# Lorem',               title: 'Labore Et Dolore',                         desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/IDS-25-Arc-05.png', ctaEnabled: false, ctaText: 'Learn more', ctaLink: '#' },
      { tag: '# Ipsum',               title: 'Magna Aliqua Enim',                        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/C-IDS-25-Arc-06.png', ctaEnabled: false, ctaText: 'Learn more', ctaLink: '#' },
      { tag: '# Dolor',               title: 'Minim Veniam Quis',                        desc: 'Tempor incididunt ut labore et dolore magna aliqua ut enim ad minim.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/IDS-25-Arc-07.png', ctaEnabled: false, ctaText: 'Learn more', ctaLink: '#' },
      { tag: '# Amet',                title: 'Nostrud Exercitation',                     desc: 'Consectetur adipiscing elit sed do eiusmod tempor incididunt.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/IDS-25-Arc-08.png', ctaEnabled: false, ctaText: 'Learn more', ctaLink: '#' },
    ], fields: [
      { key: 'tag', label: 'Tag', placeholder: '# Category' },
      { key: 'title', label: 'Title', placeholder: 'Card title' },
      { key: 'desc', label: 'Description', placeholder: 'Card description' },
      { key: 'ctaEnabled', label: 'Show CTA', type: 'toggle' },
      { key: 'ctaText', label: 'CTA text', placeholder: 'Learn more' },
      { key: 'image', label: 'Background image URL', type: 'image', placeholder: 'https://...' },
      { key: 'ctaLink', label: 'CTA Link', type: 'url', placeholder: 'https://...' },
    ]},
  ],
  getHtml(item, h) {
    const cards = h.editList(item, 'items');
    const visibleCount = parseInt(item.layout || '8', 10) || 8;
    const sliced = cards.slice(0, visibleCount);
    const defaultCardImage = h.editImg(item, 'itemDefaultImage', '');
    const align = h.opt(item,'headerAlign') || 'left';
    const showHead = h.opt(item,'showEyebrow') || h.opt(item,'showHeadline') || h.opt(item,'showSubtitle') || h.opt(item,'showDivider') || h.opt(item,'showBody');
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background-color:${bgColor};` : '';

    return `
<div class="cpb-section cpb-feature-gallery-section" data-bg="${item.bg||'alt'}" data-mode="${item.mode || ''}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  ${showHead ? `
  <div class="cpb-feature-head" data-align="${align}">
      ${renderHeadingGroup(item, h)}
  </div>` : ''}

  <div class="cpb-feature-gallery-grid" data-cols="${item.layout || '8'}">
    ${sliced.map((c, i) => {
      const showCta = String(c.ctaEnabled ?? ((c.ctaLink && c.ctaLink !== '#') ? 'true' : 'false')) === 'true';
      const cardTag = showCta ? 'a' : 'div';
      const hrefAttr = showCta ? ` href="${c.ctaLink || '#'}"` : '';
      return `
    <${cardTag} class="cpb-feature-gallery-card"${hrefAttr} data-cpb-edit-gallery-card="${item.uid}:items.${i}">
      <img class="cpb-feature-gallery-img" src="${c.image || defaultCardImage || ''}" alt="gallery item ${i+1}">
      <div class="cpb-feature-gallery-label">${c.tag||''}</div>
      <div class="cpb-feature-gallery-content">
        <div class="cpb-feature-gallery-title">${c.title||''}</div>
        <div class="cpb-feature-gallery-desc">${c.desc||''}</div>
        ${showCta ? `<span class="cpb-card-cta">${c.ctaText||'Learn more'}<span class="mi">arrow_forward</span></span>` : ''}
      </div>
    </${cardTag}>`;
    }).join('')}
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   P1 — Product Anchor
   Anchor cards linking to downstream product sections.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'product-anchor', num: 'P1', group: 'P', name: 'Product Anchor',
  desc: 'Anchor card strip for product ranges or vertical solutions.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f4f6fa"/><rect x="6" y="4" width="84" height="40" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="12" y="9" width="72" height="18" rx="3" fill="#b8c9dc"/><rect x="12" y="31" width="46" height="5" rx="2" fill="#4c6a8f"/><rect x="96" y="4" width="84" height="40" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="102" y="9" width="72" height="18" rx="3" fill="#9fb7d1"/><rect x="102" y="31" width="46" height="5" rx="2" fill="#4c6a8f"/><rect x="186" y="4" width="88" height="40" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="192" y="9" width="76" height="18" rx="3" fill="#86a8cc"/><rect x="192" y="31" width="46" height="5" rx="2" fill="#4c6a8f"/></svg>`,

  defaultBg: 'alt',
  layoutVariants: [
    { value: '3', label: '3 cards' },
    { value: '4', label: '4 cards' },
  ],
  defaultLayout: '3',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'cardVisual', label: 'Card visual', type: 'select', default: 'image',
      choices: [
        { value: 'icon', label: 'Icon' },
        { value: 'image', label: 'Product image' },
      ] },
    { key: 'headerAlign', label: 'Header alignment', type: 'select', default: 'center',
      choices: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
    { key: 'showEyebrow',  label: 'Show eyebrow',      type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline',     type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle',     type: 'toggle', default: true },
    { key: 'showDivider',  label: 'Show divider line', type: 'toggle', default: true },
    { key: 'showBody',     label: 'Show body text',    type: 'toggle', default: true },
  ],
  editMap: [
    { key: 'bgColor',         label: 'Bg color',   kind: 'text',  default: '' },
    { key: 'bgImage',         label: 'Bg image',   kind: 'image', default: '' },
    { key: 'eyebrow',         label: 'Eyebrow',    kind: 'text', default: '#Lorem | #Ipsum' },
    { key: 'sectionTitle',    label: 'Headline',   kind: 'text', default: 'Lorem Ipsum Dolor Sit Amet' },
    { key: 'sectionSubtitle', label: 'Subtitle',   kind: 'text', default: 'Consectetur adipiscing elit sed do eiusmod tempor' },
    { key: 'sectionBody',     label: 'Body text',  kind: 'text', default: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { key: 'items', label: 'Anchor cards', kind: 'list', itemCount: 4, default: [
      {
        number: '01',
        title: 'Lorem Ipsum Dolor',
        subtitle: 'Sit Amet Consectetur',
        anchor: 'product01',
        image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/ADAM-4571.png',
        bgImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-01_smart-city.jpeg',
        icon: 'touch_app',
      },
      {
        number: '02',
        title: 'Adipiscing Elit Sed',
        subtitle: 'Do Eiusmod Tempor',
        anchor: 'product02',
        image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/P_ULI-224TC_BB-485LDRC9.png',
        bgImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-02_power-source.jpeg',
        icon: 'precision_manufacturing',
      },
      {
        number: '03',
        title: 'Incididunt Ut Labore',
        subtitle: 'Et Dolore Magna',
        anchor: 'product03',
        image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_ARK-3534B-00A1.png',
        bgImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-03_smart-factory.jpeg',
        icon: 'factory',
      },
      {
        number: '04',
        title: 'Aliqua Ut Enim',
        subtitle: 'Minim Veniam Quis',
        anchor: 'product04',
        image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_IDK-1110WP-50XGB2.png',
        bgImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-04_smart-logistic.jpeg',
        icon: 'psychology',
      },
    ], fields: [
      { key: 'number', label: 'No.', placeholder: '01' },
      { key: 'title', label: 'Title', placeholder: 'Card title' },
      { key: 'subtitle', label: 'Subtitle', placeholder: 'Card subtitle' },
      { key: 'anchor', label: 'Anchor ID', placeholder: 'product01' },
      { key: 'image', label: 'Product image URL', type: 'image', placeholder: 'https://...' },
      { key: 'bgImage', label: 'Background image URL (Style2)', type: 'image', placeholder: 'https://...' },
      { key: 'icon', label: 'Icon name', placeholder: 'smart_toy' },
    ]},
  ],
  getHtml(item, h) {
    const cards = h.editList(item, 'items') || [];
    const visibleCount = parseInt(item.layout || '3', 10) || 3;
    const sliced = cards.slice(0, visibleCount);
    const align = h.opt(item,'headerAlign') || 'center';
    const showHead = h.opt(item,'showEyebrow') || h.opt(item,'showHeadline') ||
                     h.opt(item,'showSubtitle') || h.opt(item,'showDivider') || h.opt(item,'showBody');
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const visualMode = (item.options && item.options.cardVisual) || 'auto';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background-color:${bgColor};` : '';

    return `
<div class="cpb-section cpb-product-anchor-section" data-bg="${item.bg||'alt'}" data-mode="${item.mode || ''}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  ${showHead ? `
  <div class="cpb-feature-head" data-align="${align}">
      ${renderHeadingGroup(item, h)}
  </div>` : ''}

  <div class="cpb-product-anchor-grid" data-cols="${item.layout || '3'}">
    ${sliced.map((c, i) => {
      const anchor = String(c.anchor || '').trim().replace(/^#/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
      const num = String(c.number || String(i + 1).padStart(2, '0'));
      const icon = String(c.icon || 'arrow_downward');
      const image = String(c.image || '').trim();
      const bgImage = String(c.bgImage || '').trim();
      const mediaStyle = visualMode === 'icon'
        ? 'display:none;'
        : visualMode === 'image'
          ? 'display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:4 / 3;box-sizing:border-box;'
          : '';
      const iconStyle = visualMode === 'image'
        ? 'display:none;'
        : visualMode === 'icon'
          ? 'display:inline-flex;'
          : '';
      const imageStyle = visualMode === 'image'
        ? 'width:100%;max-width:320px;max-height:220px;object-fit:contain;display:block;margin:0 auto;'
        : '';
      return `
    <a class="cpb-product-anchor-card" data-cpb-edit-product-anchor-card="${item.uid}:items.${i}" data-visual="${visualMode}" href="#${anchor || 'section'}" style="${bgImage ? `--cpb-anchor-bg:url('${bgImage}');` : ''}">
      <div class="cpb-product-anchor-media"${mediaStyle ? ` style="${mediaStyle}"` : ''}>${image ? `<img src="${image}" alt=""${imageStyle ? ` style="${imageStyle}"` : ''}>` : ''}</div>
      <div class="cpb-product-anchor-content">
        <div class="cpb-product-anchor-icon"${iconStyle ? ` style="${iconStyle}"` : ''}><span class="mi">${icon}</span></div>
        <div class="cpb-product-anchor-num" ${h.editAttr(item,'items.'+i+'.number')}>${num}</div>
        <div class="cpb-product-anchor-title" ${h.editAttr(item,'items.'+i+'.title')}>${c.title||''}</div>
        <div class="cpb-product-anchor-sub" ${h.editAttr(item,'items.'+i+'.subtitle')}>${c.subtitle||''}</div>
        <div class="cpb-product-anchor-arrow"><span class="mi">arrow_downward</span></div>
      </div>
    </a>`;
    }).join('')}
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   P2 — Product Showcase
   Left intro + horizontal product cards (IDS-04 inspired).
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'product-showcase', num: 'P2', group: 'P', name: 'Product Showcase',
  desc: 'Left intro column with horizontal product cards.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f6f7fa"/><rect x="6" y="7" width="70" height="6" rx="2" fill="#7da2cf"/><rect x="6" y="18" width="86" height="6" rx="2" fill="#4b5a6a"/><rect x="6" y="30" width="64" height="4" rx="2" fill="#9aa8b8"/><rect x="100" y="6" width="52" height="36" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="107" y="10" width="38" height="12" rx="2" fill="#c8d7eb"/><rect x="107" y="26" width="30" height="4" rx="1" fill="#62748b"/><rect x="158" y="6" width="52" height="36" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="165" y="10" width="38" height="12" rx="2" fill="#b8cce5"/><rect x="165" y="26" width="30" height="4" rx="1" fill="#62748b"/><rect x="216" y="6" width="58" height="36" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="223" y="10" width="44" height="12" rx="2" fill="#abc2de"/><rect x="223" y="26" width="32" height="4" rx="1" fill="#62748b"/></svg>`,

  defaultBg: 'plain',
  layoutVariants: [
    { value: '8', label: '8 cards' },
    { value: '6', label: '6 cards' },
    { value: '4', label: '4 cards' },
  ],
  defaultLayout: '8',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'showTag',      label: 'Show tag',      type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline', type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle', type: 'toggle', default: true },
    { key: 'showDivider',  label: 'Show divider',  type: 'toggle', default: true },
    { key: 'showBody',     label: 'Show body',     type: 'toggle', default: true },
  ],
  editMap: [
    { key: 'bgColor',      label: 'Bg color', kind: 'text',  default: '#000000' },
    { key: 'bgImage',      label: 'Bg image', kind: 'image', default: '' },
    { key: 'tag',          label: 'Tag',      kind: 'text',  default: 'IDK / VUE Series' },
    { key: 'sectionTitle', label: 'Title',    kind: 'text',  default: 'Lorem Ipsum Product Solutions' },
    { key: 'sectionSubtitle', label: 'Subtitle', kind: 'text', default: 'Explore the complete lineup tailored for your deployment needs.' },
    { key: 'sectionBody',  label: 'Body',     kind: 'text',  default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { key: 'cards', label: 'Product cards', kind: 'list', itemCount: 8, default: [
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/ADAM-4571.png', title: 'Lorem Model 01', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', ctaText: 'SHOP NOW', ctaLink: '#' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/P_ULI-224TC_BB-485LDRC9.png', title: 'Lorem Model 02', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.', ctaText: 'SHOP NOW', ctaLink: '#' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_ARK-3534B-00A1.png', title: 'Lorem Model 03', desc: 'Ut enim ad minim veniam quis nostrud exercitation ullamco.', ctaText: 'SHOP NOW', ctaLink: '#' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_IDK-1110WP-50XGB2.png', title: 'Lorem Model 04', desc: 'Duis aute irure dolor in reprehenderit in voluptate velit.', ctaText: 'SHOP NOW', ctaLink: '#' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/ADAM-4571.png', title: 'Lorem Model 05', desc: 'Excepteur sint occaecat cupidatat non proident sunt culpa.', ctaText: 'SHOP NOW', ctaLink: '#' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/P_ULI-224TC_BB-485LDRC9.png', title: 'Lorem Model 06', desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.', ctaText: 'SHOP NOW', ctaLink: '#' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_ARK-3534B-00A1.png', title: 'Lorem Model 07', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore.', ctaText: 'SHOP NOW', ctaLink: '#' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_IDK-1110WP-50XGB2.png', title: 'Lorem Model 08', desc: 'Ut enim ad minim veniam quis nostrud exercitation ullamco.', ctaText: 'SHOP NOW', ctaLink: '#' },
    ], fields: [
      { key: 'image', label: 'Image URL', type: 'image', placeholder: 'https://...' },
      { key: 'title', label: 'Title', placeholder: 'Card title' },
      { key: 'desc', label: 'Description', placeholder: 'Card description' },
      { key: 'ctaText', label: 'CTA text', placeholder: 'SHOP NOW' },
      { key: 'ctaLink', label: 'CTA link', type: 'url', placeholder: 'https://...' },
    ]},
  ],
  getHtml(item, h) {
    const cards = h.editList(item, 'cards') || [];
    const count = parseInt(item.layout || '8', 10) || cards.length;
    const sliced = cards.slice(0, count);
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background:${bgColor};background-image:none;` : '';

    return `
<div class="cpb-section cpb-product-showcase-section" data-bg="${item.bg||'plain'}" data-mode="${item.mode || ''}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  <div class="cpb-product-showcase-wrap">
    <div class="cpb-product-showcase-left cpb-feature-head" data-align="left">
      ${renderHeadingGroup(item, h, { eyebrowKey: 'tag', eyebrowToggle: 'showTag' })}
    </div>
    <div class="cpb-product-showcase-slider-wrapper">
      <div class="cpb-product-showcase-slider" data-count="${count}">
        ${sliced.map((c, i) => `
        <a class="cpb-product-showcase-card" data-cpb-edit-product-showcase-card="${item.uid}:cards.${i}" href="${c.ctaLink || '#'}" target="_blank" rel="noopener noreferrer">
          <div class="cpb-product-showcase-card-img">${c.image ? `<img src="${c.image}" alt="" ${h.editAttr(item,'cards.'+i+'.image')}>` : ''}</div>
          <div class="cpb-product-showcase-card-title" ${h.editAttr(item,'cards.'+i+'.title')}>${c.title || ''}</div>
          <div class="cpb-product-showcase-card-desc" ${h.editAttr(item,'cards.'+i+'.desc')}>${c.desc || ''}</div>
          <div class="cpb-product-showcase-card-cta"><span ${h.editAttr(item,'cards.'+i+'.ctaText')}>${c.ctaText || 'SHOP NOW'}</span> <span class="mi" aria-hidden="true">east</span></div>
        </a>`).join('')}
      </div>
    </div>
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   P3 — Product Series Matrix
   Multi-series product block (2/3 series). Each series has intro + 2-5 products.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'product-series-matrix', num: 'P3', group: 'P', name: 'Product Series Matrix',
  desc: '2/3 product series columns. Each series supports 2-5 product cards.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f6f7fa"/><rect x="4" y="6" width="84" height="36" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="10" y="10" width="72" height="8" rx="2" fill="#b8c9dc"/><rect x="10" y="22" width="72" height="5" rx="1" fill="#6a7d93"/><rect x="10" y="30" width="72" height="5" rx="1" fill="#6a7d93"/><rect x="98" y="6" width="84" height="36" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="104" y="10" width="72" height="8" rx="2" fill="#a9c0da"/><rect x="104" y="22" width="72" height="5" rx="1" fill="#6a7d93"/><rect x="104" y="30" width="72" height="5" rx="1" fill="#6a7d93"/><rect x="192" y="6" width="84" height="36" rx="4" fill="#fff" stroke="#d7dde8"/><rect x="198" y="10" width="72" height="8" rx="2" fill="#9ab6d6"/><rect x="198" y="22" width="72" height="5" rx="1" fill="#6a7d93"/><rect x="198" y="30" width="72" height="5" rx="1" fill="#6a7d93"/></svg>`,

  defaultBg: 'plain',
  layoutVariants: [
    { value: '2', label: '2 series' },
    { value: '3', label: '3 series' },
  ],
  defaultLayout: '3',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'headerAlign', label: 'Header alignment', type: 'select', default: 'left',
      choices: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
    { key: 'showEyebrow', label: 'Show eyebrow', type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline', type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle', type: 'toggle', default: true },
    { key: 'showDivider', label: 'Show divider', type: 'toggle', default: true },
    { key: 'showBody', label: 'Show body', type: 'toggle', default: true },
  ],
  editMap: [
    { key: 'bgColor', label: 'Bg color', kind: 'text', default: '#000000' },
    { key: 'bgImage', label: 'Bg image', kind: 'image', default: '' },
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text', default: '#Lorem | #Ipsum' },
    { key: 'sectionTitle', label: 'Title', kind: 'text', default: 'Lorem Ipsum Dolor Sit' },
    { key: 'sectionSubtitle', label: 'Subtitle', kind: 'text', default: 'Consectetur adipiscing elit sed do eiusmod tempor.' },
    { key: 'sectionBody', label: 'Body', kind: 'text', default: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
    { key: 'series', label: 'Series', kind: 'list', itemCount: 3, default: [
      {
        key: '1',
        tag: 'Lorem',
        title: 'Alpha',
        subtitle: 'Dolor sit amet consectetur',
        bullets: 'Lorem ipsum dolor;Sit amet consectetur;Adipiscing elit sed',
        image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-PD_PPC3.png',
        introBgImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-01_smart-city.jpeg',
        productCount: '3',
      },
      {
        key: '2',
        tag: 'Ipsum',
        title: 'Beta',
        subtitle: 'Tempor incididunt ut labore',
        bullets: 'Eiusmod tempor incididunt;Ut labore et dolore;Magna aliqua enim',
        image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-PD_TPC02.png',
        introBgImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-02_power-source.jpeg',
        productCount: '3',
      },
      {
        key: '3',
        tag: 'Dolor',
        title: 'Gamma',
        subtitle: 'Ut aliquip ex ea commodo',
        bullets: 'Quis nostrud exercitation;Ullamco laboris nisi;Ut aliquip commodo',
        image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-PD_FPM3.png',
        introBgImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/solutionBG-03_smart-factory.jpeg',
        productCount: '3',
      },
    ], fields: [
      { key: 'tag', label: 'Series tag', placeholder: 'Panel PC' },
      { key: 'title', label: 'Series title', placeholder: 'PPC' },
      { key: 'subtitle', label: 'Series subtitle', placeholder: 'Series subtitle' },
      { key: 'bullets', label: 'Bullets (; separated)', placeholder: 'Bullet A;Bullet B;Bullet C' },
      { key: 'image', label: 'Series image URL', type: 'image', placeholder: 'https://...' },
      { key: 'introBgImage', label: 'Series intro bg URL', type: 'image', placeholder: 'https://...' },
      { key: 'productCount', label: 'Products shown (2-5)', placeholder: '3' },
    ]},
    { key: 'products', label: 'Products', kind: 'list', itemCount: 15, default: [
      { seriesKey: '1', name: 'LOREM-101', desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-PPC3125.png', ctaText: 'LOREM CTA', ctaLink: '#' },
      { seriesKey: '1', name: 'LOREM-102', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-PPC3125.png', ctaText: 'LOREM CTA', ctaLink: '#' },
      { seriesKey: '1', name: 'LOREM-103', desc: 'Ut enim ad minim veniam quis nostrud exercitation.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-PPC421.png', ctaText: 'LOREM CTA', ctaLink: '#' },
      { seriesKey: '2', name: 'IPSUM-201', desc: 'Ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-TPC312.png', ctaText: 'LOREM CTA', ctaLink: '#' },
      { seriesKey: '2', name: 'IPSUM-202', desc: 'Duis aute irure dolor in reprehenderit in voluptate velit.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-TPC315.png', ctaText: 'LOREM CTA', ctaLink: '#' },
      { seriesKey: '2', name: 'IPSUM-203', desc: 'Esse cillum dolore eu fugiat nulla pariatur excepteur.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-TPC300.png', ctaText: 'LOREM CTA', ctaLink: '#' },
      { seriesKey: '3', name: 'DOLOR-301', desc: 'Sint occaecat cupidatat non proident sunt in culpa.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-FPM.png', ctaText: 'LOREM CTA', ctaLink: '#' },
      { seriesKey: '3', name: 'DOLOR-302', desc: 'Qui officia deserunt mollit anim id est laborum lorem.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-FPM.png', ctaText: 'LOREM CTA', ctaLink: '#' },
      { seriesKey: '3', name: 'DOLOR-303', desc: 'Integer posuere erat a ante venenatis dapibus posuere.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/monitor-ProductCard-FPM.png', ctaText: 'LOREM CTA', ctaLink: '#' },
    ], fields: [
      { key: 'name', label: 'Product name', placeholder: 'Model name' },
      { key: 'desc', label: 'Product desc', placeholder: 'Product description' },
      { key: 'image', label: 'Product image URL', type: 'image', placeholder: 'https://...' },
      { key: 'ctaText', label: 'CTA text', placeholder: 'Configure' },
      { key: 'ctaLink', label: 'CTA link', type: 'url', placeholder: 'https://...' },
    ]},
  ],
  getHtml(item, h) {
    const rawSeries = h.editList(item, 'series') || [];
    const rawProducts = h.editList(item, 'products') || [];
    const seriesCount = Math.max(2, Math.min(3, parseInt(item.layout || '3', 10) || 3));
    const seriesList = rawSeries.slice(0, seriesCount);
    const align = h.opt(item,'headerAlign') || 'left';
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background:${bgColor};background-image:none;` : '';
    const showHead = h.opt(item,'showEyebrow') || h.opt(item,'showHeadline') || h.opt(item,'showSubtitle') || h.opt(item,'showDivider') || h.opt(item,'showBody');

    const normalizeSeriesKey = (v, fallback) => {
      const s = String(v == null ? '' : v).trim();
      return s || String(fallback);
    };
    const splitBullets = (txt) => String(txt || '')
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);
    const clampPerSeriesCount = (v) => Math.max(2, Math.min(5, parseInt(v, 10) || 3));

    const seriesHtml = seriesList.map((s, i) => {
      const skey = normalizeSeriesKey(s.key, i + 1);
      const perSeriesCount = clampPerSeriesCount(s.productCount);
      const bullets = splitBullets(s.bullets);
      const seriesProducts = rawProducts
        .map((p, idx) => ({ row: p, idx }))
        .filter(({ row }) => normalizeSeriesKey(row.seriesKey, '') === skey)
        .slice(0, perSeriesCount);
      const introStyle = s.introBgImage
        ? `--cpb-p3-intro-bg-image:url('${s.introBgImage}');`
        : '';
      return `
    <div class="cpb-product-series-col" data-series-key="${skey}">
      <div class="cpb-product-series-intro" data-cpb-edit-product-series-card="${item.uid}:series.${i}"${introStyle ? ` style="${introStyle}"` : ''}>
        <div class="cpb-product-series-tag" data-cpb-edit="${item.uid}:series.${i}.tag">${s.tag || ''}</div>
        ${s.image ? `<img class="cpb-product-series-image" src="${s.image}" alt="">` : ''}
        <div class="cpb-product-series-title" data-cpb-edit="${item.uid}:series.${i}.title">${s.title || ''}</div>
        <div class="cpb-product-series-subtitle" data-cpb-edit="${item.uid}:series.${i}.subtitle">${s.subtitle || ''}</div>
        ${bullets.length ? `<ul class="cpb-product-series-bullets" data-cpb-edit="${item.uid}:series.${i}.bullets">${bullets.map(line => `<li>${line}</li>`).join('')}</ul>` : ''}
      </div>
      <div class="cpb-product-series-products">
        ${seriesProducts.map(({ row: p, idx: sourceIndex }) => {
          return `
        <a class="cpb-product-series-item" data-cpb-edit-product-series-item="${item.uid}:products.${sourceIndex}" href="${p.ctaLink || '#'}" target="_blank" rel="noopener noreferrer">
          ${p.image ? `<img class="cpb-product-series-item-image" src="${p.image}" alt="">` : ''}
          <div class="cpb-product-series-item-content">
            <div class="cpb-product-series-item-name" data-cpb-edit="${item.uid}:products.${sourceIndex}.name">${p.name || ''}</div>
            <div class="cpb-product-series-item-desc" data-cpb-edit="${item.uid}:products.${sourceIndex}.desc">${p.desc || ''}</div>
            <div class="cpb-product-series-item-cta" data-cpb-edit="${item.uid}:products.${sourceIndex}.ctaText">${p.ctaText || 'SHOP NOW'}</div>
          </div>
        </a>`;
        }).join('')}
      </div>
    </div>`;
    }).join('');

    return `
<div class="cpb-section cpb-product-series-section" data-bg="${item.bg||'plain'}" data-mode="${item.mode || ''}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  ${showHead ? `
  <div class="cpb-feature-head cpb-product-series-head" data-align="${align}">
      ${renderHeadingGroup(item, h)}
  </div>` : ''}
  <div class="cpb-product-series-grid" data-cols="${seriesCount}">
    ${seriesHtml}
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   P4 — Product Rich Content
   Top split media/text + icon feature cards + rich product slider cards.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'product-rich-content', num: 'P4', group: 'P', name: 'Product Rich Content',
  desc: 'Top split visual/text, icon features, and rich horizontal product cards.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f4f7fd"/><rect x="6" y="5" width="128" height="18" rx="3" fill="#ffffff" stroke="#d6deec"/><rect x="12" y="9" width="56" height="4" rx="2" fill="#7ea5d7"/><rect x="12" y="16" width="94" height="3" rx="1.5" fill="#a8b8cc"/><rect x="144" y="5" width="130" height="18" rx="3" fill="#c7d8ee"/><rect x="6" y="28" width="84" height="14" rx="3" fill="#ffffff" stroke="#d6deec"/><rect x="12" y="32" width="8" height="8" rx="2" fill="#7ea5d7"/><rect x="24" y="34" width="54" height="4" rx="2" fill="#8ea0b9"/><rect x="96" y="28" width="84" height="14" rx="3" fill="#ffffff" stroke="#d6deec"/><rect x="102" y="32" width="8" height="8" rx="2" fill="#7ea5d7"/><rect x="114" y="34" width="54" height="4" rx="2" fill="#8ea0b9"/><rect x="186" y="25" width="88" height="17" rx="4" fill="#ffffff" stroke="#d6deec"/><rect x="193" y="28" width="74" height="7" rx="2" fill="#d9e6f7"/><rect x="193" y="37" width="36" height="3" rx="1.5" fill="#7ea5d7"/></svg>`,

  defaultBg: 'plain',
  layoutVariants: [
    { value: 'media-right', label: 'Left text / Right image' },
    { value: 'media-left', label: 'Left image / Right text' },
  ],
  defaultLayout: 'media-right',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'showEyebrow', label: 'Show eyebrow', type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline', type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle', type: 'toggle', default: true },
    { key: 'showDivider', label: 'Show divider', type: 'toggle', default: true },
    { key: 'showBody', label: 'Show body', type: 'toggle', default: true },
    { key: 'showPartners', label: 'Show partner logos', type: 'toggle', default: true },
    { key: 'partnerLogoCount', label: 'Partner logo count', type: 'number', default: 6, min: 1, max: 12 },
    { key: 'showFeatures', label: 'Show feature', type: 'toggle', default: true },
    { key: 'showProducts', label: 'Show product', type: 'toggle', default: true },
    { key: 'featureCols', label: 'Feature layout', type: 'select', default: '4',
      choices: [
        { value: '2', label: '2 cards' },
        { value: '3', label: '3 cards' },
        { value: '4', label: '4 cards' },
        { value: '6', label: '6 cards' },
        { value: '8', label: '8 cards' },
      ] },
  ],
  editMap: [
    { key: 'bgColor', label: 'Bg color', kind: 'text', default: '#030923' },
    { key: 'bgImage', label: 'Bg image', kind: 'image', default: '' },
    { key: 'eyebrow', label: 'Eyebrow', kind: 'text', default: '# LOREM | IPSUM' },
    { key: 'sectionTitle', label: 'Title', kind: 'text', default: 'Lorem Ipsum Dolor Sit' },
    { key: 'sectionSubtitle', label: 'Subtitle', kind: 'text', default: 'Consectetur Adipiscing Elit' },
    { key: 'sectionBody', label: 'Body', kind: 'text', default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.' },
    { key: 'mainImage', label: 'Main image', kind: 'image', default: 'https://irp.cdn-website.com/56869327/dms3rep/multi/P_AnchorBG-Edge+AI+Solutions.png' },
    { key: 'productsTitle', label: 'Products title', kind: 'text', default: 'Product Highlights' },
    { key: 'partnersTitle', label: 'Partners title', kind: 'text', default: 'Technology Partners' },
    { key: 'partnerLogos', label: 'Partner Logos', kind: 'list', itemCount: 12, default: [
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/AMD-logo-w.png', name: 'AMD' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Intel-logo_white.png', name: 'Intel' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/QCOM.png', name: 'Qualcomm' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/NVIDIA.png', name: 'NVIDIA' },
    ], fields: [
      { key: 'name', label: 'Logo name', placeholder: 'Partner name' },
      { key: 'image', label: 'Logo image URL', type: 'image', placeholder: 'https://...' },
    ]},
    { key: 'features', label: 'Features', kind: 'list', itemCount: 8, default: [
      { icon: 'memory', title: 'Lorem ipsum', desc: 'Dolor sit amet, consectetur adipiscing elit.', ctaText: 'Lorem ipsum', ctaUrl: '#' },
      { icon: 'developer_board', title: 'Consectetur elit', desc: 'Sed do eiusmod tempor incididunt ut labore.', ctaText: 'Lorem ipsum', ctaUrl: '#' },
      { icon: 'precision_manufacturing', title: 'Integer posuere', desc: 'Ut enim ad minim veniam quis nostrud.', ctaText: 'Lorem ipsum', ctaUrl: '#' },
      { icon: 'verified', title: 'Aenean lacinia', desc: 'Duis aute irure dolor in reprehenderit.', ctaText: 'Lorem ipsum', ctaUrl: '#' },
      { icon: 'bolt', title: 'Mauris blandit', desc: 'Excepteur sint occaecat cupidatat non proident.', ctaText: 'Lorem ipsum', ctaUrl: '#' },
      { icon: 'hub', title: 'Vestibulum ante', desc: 'Sunt in culpa qui officia deserunt mollit.', ctaText: 'Lorem ipsum', ctaUrl: '#' },
      { icon: 'shield', title: 'Curabitur risus', desc: 'Pellentesque habitant morbi tristique senectus.', ctaText: 'Lorem ipsum', ctaUrl: '#' },
      { icon: 'settings_suggest', title: 'Nullam dictum', desc: 'Etiam porta sem malesuada magna mollis.', ctaText: 'Lorem ipsum', ctaUrl: '#' },
    ], fields: [
      { key: 'icon', label: 'Icon', placeholder: 'memory' },
      { key: 'title', label: 'Title', placeholder: 'Feature title' },
      { key: 'desc', label: 'Description', placeholder: 'Feature description' },
      { key: 'ctaText', label: 'CTA text', placeholder: 'Learn more' },
      { key: 'ctaUrl', label: 'CTA link', type: 'url', placeholder: 'https://...' },
    ]},
    { key: 'products', label: 'Products', kind: 'list', itemCount: 12, default: [
      { category: 'Lorem', model: 'LI-100', name: 'Lorem ipsum dolor sit amet consectetur adipiscing.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/ADAM-4571.png', ctaText: 'Lorem ipsum', ctaLink: '#' },
      { category: 'Ipsum', model: 'IP-200', name: 'Sed do eiusmod tempor incididunt ut labore et.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/P_ULI-224TC_BB-485LDRC9.png', ctaText: 'Lorem ipsum', ctaLink: '#' },
      { category: 'Dolor', model: 'DO-300', name: 'Ut enim ad minim veniam quis nostrud exercitation.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_ARK-3534B-00A1.png', ctaText: 'Lorem ipsum', ctaLink: '#' },
      { category: 'Sit', model: 'SI-400', name: 'Duis aute irure dolor in reprehenderit voluptate.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_IDK-1110WP-50XGB2.png', ctaText: 'Lorem ipsum', ctaLink: '#' },
      { category: 'Amet', model: 'AM-500', name: 'Excepteur sint occaecat cupidatat non proident.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/ADAM-4571.png', ctaText: 'Lorem ipsum', ctaLink: '#' },
      { category: 'Elit', model: 'EL-600', name: 'Sunt in culpa qui officia deserunt mollit anim.', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/P_ULI-224TC_BB-485LDRC9.png', ctaText: 'Lorem ipsum', ctaLink: '#' },
    ], fields: [
      { key: 'category', label: 'Category', placeholder: 'Edge AI' },
      { key: 'model', label: 'Model', placeholder: 'AIR-310' },
      { key: 'name', label: 'Description', placeholder: 'Product short description' },
      { key: 'image', label: 'Product image URL', type: 'image', placeholder: 'https://...' },
      { key: 'ctaText', label: 'CTA text', placeholder: 'View Details' },
      { key: 'ctaLink', label: 'CTA link', type: 'url', placeholder: 'https://...' },
    ]},
  ],
  getHtml(item, h) {
    const layout = item.layout || 'media-right';
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background:${bgColor};background-image:none;` : '';

    const featureCols = String(h.opt(item, 'featureCols') || '4');
    const featureCount = Math.max(2, Math.min(8, parseInt(featureCols, 10) || 4));
    const features = (h.editList(item, 'features') || []).slice(0, featureCount);
    const partnerLogoCount = Math.max(1, Math.min(12, parseInt(h.opt(item, 'partnerLogoCount') || '6', 10) || 6));
    const partnerSource = h.editList(item, 'partnerLogos') || [];
    const partnerFallbacks = [
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/AMD-logo-w.png', name: 'AMD' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Intel-logo_white.png', name: 'Intel' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Hailo-logo-w.png', name: 'Hailo' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/QCOM.png', name: 'Qualcomm' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/NVIDIA.png', name: 'NVIDIA' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/APPRO-logo-w.png', name: 'APPRO' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/orbbec-logo-w.png', name: 'Orbbec' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/intel_prestige-logo-w.png', name: 'Intel Prestige' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/nvidia-elite-partner-logo-w.png', name: 'NVIDIA Elite Partner' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Windows-logo-w.png', name: 'Windows' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/Ubuntu-logo-w.png', name: 'Ubuntu' },
      { image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/chrome-os-logo-w.png', name: 'ChromeOS' },
    ];
    const partners = Array.from({ length: partnerLogoCount }, (_, i) => {
      const row = partnerSource[i] || {};
      const fallback = partnerFallbacks[i] || partnerFallbacks[0];
      const image = String(row.image || '').trim() || fallback.image;
      const name = String(row.name || '').trim() || fallback.name;
      return {
        name,
        image,
      };
    });
    const products = h.editList(item, 'products') || [];

    return `
<div class="cpb-section cpb-prc-section" data-layout="${layout}" data-bg="${item.bg||'plain'}" data-mode="${item.mode || ''}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  <div class="cpb-prc-top">
    <div class="cpb-prc-copy cpb-feature-head" data-align="left">
      ${renderHeadingGroup(item, h)}
      ${h.opt(item,'showPartners') && partners.length ? `
      <div class="cpb-prc-partners">
        <div class="cpb-prc-partners-title" ${h.editAttr(item,'partnersTitle')}>${h.editText(item,'partnersTitle')}</div>
        <div class="cpb-prc-partners-grid">
          ${partners.map((p, i) => {
            const name = String(p?.name || '').trim();
            const alt = name || `partner ${i + 1}`;
            const esc = (v) => String(v || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const titleAttr = name ? ` title="${esc(name)}"` : '';
            return `<div class="cpb-prc-partner-tile" data-cpb-edit-prc-partner="${item.uid}:partnerLogos.${i}"${titleAttr}><img src="${p.image}" alt="${esc(alt)}"></div>`;
          }).join('')}
        </div>
      </div>` : ''}
    </div>
    <div class="cpb-prc-media">
      <img src="${h.editImg(item,'mainImage')}" ${h.editAttr(item,'mainImage')} alt="rich content visual">
    </div>
  </div>

  ${h.opt(item,'showFeatures') ? `<div class="cpb-prc-features-wrap cpb-feature-section" data-mode="${item.mode || ''}" data-card-bg-mode="glass">
  <div class="cpb-prc-features cpb-feature-cards" data-cols="${featureCols}">
    ${features.map((f, i) => `
    <a class="cpb-prc-feature-item cpb-card cpb-card--borderless" href="${f.ctaUrl || '#'}" data-icon-pos="left" data-hover="true">
      <div class="cpb-prc-feature-icon cpb-card-icon" data-cpb-edit-icon="${item.uid}:features.${i}.icon">${h.iconHtml(f.icon || 'memory')}</div>
      <div class="cpb-prc-feature-copy">
        <div class="cpb-prc-feature-title cpb-card-title" ${h.editAttr(item,'features.'+i+'.title')}>${f.title || ''}</div>
        <div class="cpb-prc-feature-desc cpb-card-desc" ${h.editAttr(item,'features.'+i+'.desc')}>${f.desc || ''}</div>
      </div>
    </a>`).join('')}
  </div>
  </div>` : ''}

  ${h.opt(item,'showProducts') ? `<div class="cpb-prc-products">
    <div class="cpb-prc-products-title" ${h.editAttr(item,'productsTitle')}>${h.editText(item,'productsTitle')}</div>
    <div class="cpb-prc-products-slider">
      ${products.map((p, i) => `
      <a class="cpb-prc-product-card" href="${p.ctaLink || '#'}" data-cpb-edit-product-showcase-card="${item.uid}:products.${i}" target="_blank" rel="noopener noreferrer">
        <div class="cpb-prc-product-img-box">
          <div class="cpb-prc-product-badge" ${h.editAttr(item,'products.'+i+'.category')}>${p.category || 'Category'}</div>
          <img class="cpb-prc-product-img" src="${p.image || ''}" alt="${p.model || 'product'}">
        </div>
        <div class="cpb-prc-product-content">
          <div class="cpb-prc-product-name" ${h.editAttr(item,'products.'+i+'.model')}>${p.model || ''}</div>
          <div class="cpb-prc-product-desc" ${h.editAttr(item,'products.'+i+'.name')}>${p.name || ''}</div>
          <span class="cpb-prc-product-btn"><span ${h.editAttr(item,'products.'+i+'.ctaText')}>${p.ctaText || 'View Details'}</span><span class="mi" aria-hidden="true">arrow_forward</span></span>
        </div>
      </a>`).join('')}
    </div>
  </div>` : ''}
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   E1 — Related Content Hub
   Article/video recommendation cards under a section header.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'related-content-hub', num: 'E1', group: 'E', name: 'Related Content Hub',
  desc: 'Related articles/videos cards with image, title, summary, and CTA.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f7f9fc"/><rect x="6" y="6" width="120" height="5" rx="2" fill="#7fa0cd"/><rect x="6" y="14" width="84" height="4" rx="2" fill="#9aa8b8"/><rect x="6" y="21" width="40" height="3" rx="1.5" fill="#7fa0cd"/><rect x="6" y="27" width="84" height="15" rx="3" fill="#ffffff" stroke="#d6deec"/><rect x="94" y="27" width="84" height="15" rx="3" fill="#ffffff" stroke="#d6deec"/><rect x="182" y="27" width="92" height="15" rx="3" fill="#ffffff" stroke="#d6deec"/><rect x="10" y="30" width="20" height="9" rx="2" fill="#c7d8ee"/><rect x="34" y="31" width="48" height="3" rx="1.5" fill="#8ea0b9"/><rect x="34" y="36" width="24" height="2" rx="1" fill="#7fa0cd"/><rect x="98" y="30" width="20" height="9" rx="2" fill="#c7d8ee"/><rect x="122" y="31" width="48" height="3" rx="1.5" fill="#8ea0b9"/><rect x="122" y="36" width="24" height="2" rx="1" fill="#7fa0cd"/><rect x="186" y="30" width="20" height="9" rx="2" fill="#c7d8ee"/><rect x="210" y="31" width="56" height="3" rx="1.5" fill="#8ea0b9"/><rect x="210" y="36" width="28" height="2" rx="1" fill="#7fa0cd"/></svg>`,

  defaultBg: 'alt',
  layoutVariants: [
    { value: '2', label: '2 cards' },
    { value: '3', label: '3 cards' },
    { value: '4', label: '4 cards' },
  ],
  defaultLayout: '3',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'headerAlign', label: 'Header alignment', type: 'select', default: 'left',
      choices: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }] },
    { key: 'showEyebrow',  label: 'Show eyebrow',      type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline',     type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle',     type: 'toggle', default: true },
    { key: 'showDivider',  label: 'Show divider line', type: 'toggle', default: true },
    { key: 'showBody',     label: 'Show body text',    type: 'toggle', default: true },
  ],
  editMap: [
    { key: 'bgColor',         label: 'Bg color',      kind: 'text',  default: '' },
    { key: 'bgImage',         label: 'Bg image',      kind: 'image', default: '' },
    { key: 'eyebrow',         label: 'Eyebrow',       kind: 'text',  default: '# LOREM IPSUM' },
    { key: 'sectionTitle',    label: 'Headline',      kind: 'text',  default: 'Lorem Ipsum Dolor Sit Amet' },
    { key: 'sectionSubtitle', label: 'Subtitle',      kind: 'text',  default: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt.' },
    { key: 'sectionBody',     label: 'Body text',     kind: 'text',  default: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    { key: 'cards', label: 'Content cards', kind: 'list', itemCount: 4, default: [
      { type: 'Lorem', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/C-IDS-25-Arc-01.png', title: 'Lorem Ipsum Dolor Sit', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', ctaText: 'Lorem Ipsum', ctaLink: '#' },
      { type: 'Ipsum', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/C-IDS-25-Arc-03.png', title: 'Consectetur Adipiscing Elit', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', ctaText: 'Lorem Ipsum', ctaLink: '#' },
      { type: 'Dolor', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/C-IDS-25-Arc-06.png', title: 'Ut Enim Ad Minim', desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', ctaText: 'Lorem Ipsum', ctaLink: '#' },
      { type: 'Amet', image: 'https://irp.cdn-website.com/56869327/dms3rep/multi/C-IDS-25-Arc-04.png', title: 'Duis Aute Irure Dolor', desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.', ctaText: 'Lorem Ipsum', ctaLink: '#' },
    ], fields: [
      { key: 'type', label: 'Type label', placeholder: 'Article or Video' },
      { key: 'image', label: 'Image URL', type: 'image', placeholder: 'https://...' },
      { key: 'title', label: 'Title', placeholder: 'Card title' },
      { key: 'desc', label: 'Description', placeholder: 'Card description' },
      { key: 'ctaText', label: 'CTA text', placeholder: 'Read Article' },
      { key: 'ctaLink', label: 'CTA link', type: 'url', placeholder: 'https://...' },
    ]},
  ],
  getHtml(item, h) {
    const cards = h.editList(item, 'cards') || [];
    const count = Math.max(2, Math.min(4, parseInt(item.layout || '3', 10) || 3));
    const sliced = cards.slice(0, count);
    const align = h.opt(item, 'headerAlign') || 'left';
    const showHead = h.opt(item,'showEyebrow') || h.opt(item,'showHeadline') ||
                     h.opt(item,'showSubtitle') || h.opt(item,'showDivider') || h.opt(item,'showBody');
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background-color:${bgColor};` : '';

    return `
<div class="cpb-section cpb-related-content-section" data-bg="${item.bg||'alt'}" data-mode="${item.mode || ''}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  ${showHead ? `
  <div class="cpb-feature-head" data-align="${align}">
      ${renderHeadingGroup(item, h)}
  </div>` : ''}

  <div class="cpb-related-content-grid" data-cols="${count}">
    ${sliced.map((c, i) => `
    <a class="cpb-related-content-card" href="${c.ctaLink || '#'}" data-cpb-edit-related-content-card="${item.uid}:cards.${i}" target="_blank" rel="noopener noreferrer">
      <div class="cpb-related-content-media">${c.image ? `<img src="${c.image}" alt="related content ${i + 1}" ${h.editAttr(item,'cards.'+i+'.image')}>` : ''}</div>
      <div class="cpb-related-content-content">
        <div class="cpb-related-content-type" ${h.editAttr(item,'cards.'+i+'.type')}>${c.type || ''}</div>
        <div class="cpb-related-content-title" ${h.editAttr(item,'cards.'+i+'.title')}>${c.title || ''}</div>
        <div class="cpb-related-content-desc" ${h.editAttr(item,'cards.'+i+'.desc')}>${c.desc || ''}</div>
        <div class="cpb-related-content-cta"><span ${h.editAttr(item,'cards.'+i+'.ctaText')}>${c.ctaText || 'Read More'}</span><span class="mi" aria-hidden="true">arrow_forward</span></div>
      </div>
    </a>`).join('')}
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   E2 — Need Help CTA
   Bottom support/consultation CTA section.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'related-need-help-cta', num: 'E2', group: 'E', name: 'Need Help CTA',
  desc: 'Bottom CTA block for service request or consultation contact.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f4f7fb"/><rect x="8" y="6" width="86" height="4" rx="2" fill="#8faad0"/><rect x="8" y="14" width="168" height="7" rx="3.5" fill="#6c88b4"/><rect x="8" y="24" width="238" height="4" rx="2" fill="#9fb1c9"/><rect x="8" y="34" width="110" height="8" rx="4" fill="#4f79b6"/><rect x="122" y="34" width="22" height="8" rx="4" fill="#eef4ff"/></svg>`,

  defaultBg: 'alt',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'showEyebrow', label: 'Show eyebrow', type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline', type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle', type: 'toggle', default: true },
    { key: 'showDivider', label: 'Show divider line', type: 'toggle', default: true },
    { key: 'showBody', label: 'Show body', type: 'toggle', default: true },
    { key: 'showFirstCta', label: 'Show 1st CTA', type: 'toggle', default: true },
    { key: 'showSecondCta', label: 'Show 2nd CTA', type: 'toggle', default: false },
    { key: 'primaryCta', label: 'Primary CTA', type: 'select', default: 'cta1',
      choices: [{ value: 'cta1', label: '1st CTA' }, { value: 'cta2', label: '2nd CTA' }] },
  ],
  editMap: [
    { key: 'bgColor',   label: 'Bg color',      kind: 'text',  default: '' },
    { key: 'bgImage',   label: 'Bg image',      kind: 'image', default: '' },
    { key: 'eyebrow',   label: 'Eyebrow',       kind: 'text',  default: 'Need Support' },
    { key: 'title',     label: 'Headline',      kind: 'text',  default: 'Need Help?' },
    { key: 'subtitle',  label: 'Subtitle',      kind: 'text',  default: 'Submit a service request and our team will help you find the right configuration for your deployment.' },
    { key: 'body',      label: 'Body',          kind: 'text',  default: 'Tell us your application needs and expected timeline, and our specialists will suggest suitable products and deployment options.' },
    { key: 'cta1Text',  label: 'CTA 1 text',    kind: 'text',  default: 'Service Request Form' },
    { key: 'cta1Link',  label: 'CTA 1 link',    kind: 'url',   default: 'https://www.iotmart.com/en-en/s/service-request?language=en_US' },
    { key: 'cta2Text',  label: 'CTA 2 text',    kind: 'text',  default: 'Contact Sales' },
    { key: 'cta2Link',  label: 'CTA 2 link',    kind: 'url',   default: '#' },
  ],
  getHtml(item, h) {
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background-color:${bgColor};` : '';
    const legacyCtaText = h.editText(item, 'ctaText', 'Service Request Form');
    const legacyCtaLink = h.editText(item, 'ctaLink', '#');
    const cta1Text = h.editText(item, 'cta1Text', legacyCtaText || 'Service Request Form');
    const cta1Link = h.editText(item, 'cta1Link', legacyCtaLink || '#') || '#';
    const cta2Text = h.editText(item, 'cta2Text', 'Contact Sales');
    const cta2Link = h.editText(item, 'cta2Link', '#') || '#';
    const primaryCta = String((item.options && item.options.primaryCta) || 'cta1') === 'cta2' ? 'cta2' : 'cta1';
    const cta1Class = primaryCta === 'cta1' ? 'cpb-btn-primary' : 'cpb-btn-secondary';
    const cta2Class = primaryCta === 'cta2' ? 'cpb-btn-primary' : 'cpb-btn-secondary';

    return `
<div class="cpb-section cpb-need-help-section" data-bg="${item.bg||'alt'}" data-mode="${item.mode || ''}" data-bgtype="${bgType}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  <div class="cpb-need-help-inner">
    <div class="cpb-feature-head" data-align="center">
      ${renderHeadingGroup(item, h, { headlineKey: 'title', subtitleKey: 'subtitle', bodyKey: 'body' })}
    </div>
    <div class="cpb-need-help-cta-group">
      ${h.opt(item,'showFirstCta') ? `<a class="cpb-need-help-btn ${cta1Class}" href="${cta1Link}" target="_blank" rel="noopener noreferrer"><span class="cpb-btn-label" ${h.editAttr(item,'cta1Text')}>${cta1Text}</span><span class="mi cpb-cta-icon" aria-hidden="true">arrow_forward</span></a>` : ''}
      ${h.opt(item,'showSecondCta') ? `<a class="cpb-need-help-btn ${cta2Class}" href="${cta2Link}" target="_blank" rel="noopener noreferrer"><span class="cpb-btn-label" ${h.editAttr(item,'cta2Text')}>${cta2Text}</span><span class="mi cpb-cta-icon" aria-hidden="true">arrow_forward</span></a>` : ''}
    </div>
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   G1 — FAQ Accordion
   Uses pure CSS checkbox trick — works inside Magnolia HTML.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'faq-accordion', num: 'G1', group: 'G', name: 'FAQ Accordion',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f8f9fb"/><rect x="4" y="3" width="272" height="12" rx="2" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="10" y="7" width="110" height="4" rx="1" fill="#b0b8c8"/><rect x="266" y="5" width="6" height="6" rx="1" fill="#c5d4ff"/><rect x="4" y="18" width="272" height="12" rx="2" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="10" y="22" width="80" height="4" rx="1" fill="#b0b8c8"/><rect x="266" y="20" width="6" height="6" rx="1" fill="#c5d4ff"/><rect x="4" y="33" width="272" height="12" rx="2" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="10" y="37" width="130" height="4" rx="1" fill="#b0b8c8"/><rect x="266" y="35" width="6" height="6" rx="1" fill="#c5d4ff"/></svg>`,

  desc: 'Expandable FAQ. CSS-only, no JS dependency.',
  defaultBg: 'plain',
  layoutVariants: [
    { value: 'single-open', label: 'Single open' },
    { value: 'multi-open',  label: 'Multi open' },
  ],
  defaultLayout: 'multi-open',
  optionMap: [
    { key: 'heroBgType', label: 'Background type', type: 'select', default: 'color',
      choices: [{ value: 'color', label: 'Color' }, { value: 'image', label: 'Image (full)' }] },
    { key: 'showEyebrow',  label: 'Show eyebrow',      type: 'toggle', default: true },
    { key: 'showHeadline', label: 'Show headline',     type: 'toggle', default: true },
    { key: 'showSubtitle', label: 'Show subtitle',     type: 'toggle', default: true },
    { key: 'showDivider',  label: 'Show divider line', type: 'toggle', default: true },
    { key: 'showBody',     label: 'Show body text',    type: 'toggle', default: true },
    { key: 'faqItemCount', label: 'FAQ items',         type: 'number', default: 6, min: 3, max: 20 },
  ],
  editMap: [
    { key: 'bgColor',         label: 'Bg color',         kind: 'text',  default: '' },
    { key: 'bgImage',         label: 'Bg image',         kind: 'image', default: '' },
    { key: 'eyebrow',         label: 'Eyebrow',          kind: 'text', default: '#Lorem | #Ipsum' },
    { key: 'headline',        label: 'Headline',         kind: 'text', default: 'Lorem Ipsum' },
    { key: 'subtitle',        label: 'Subtitle',         kind: 'text', default: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...' },
    { key: 'body',            label: 'Body text',        kind: 'text', default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { key: 'items', label: 'FAQ items', kind: 'list', itemCount: 6, default: [
      { q: 'Lorem ipsum dolor sit amet?',                a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { q: 'Neque porro quisquam est qui dolorem?',      a: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { q: 'Lorem ipsum dolor sit amet consectetur?',   a: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { q: 'Sed do eiusmod tempor incididunt?',          a: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { q: 'Ut enim ad minim veniam quis nostrud?',      a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { q: 'Excepteur sint occaecat cupidatat?',         a: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...' },
    ]},
  ],
  getHtml(item, h) {
    // Backward compatibility: older FAQ schema used sectionTitle/sectionSubtitle.
    if (item.edits) {
      if (item.edits.headline == null && item.edits.sectionTitle != null) item.edits.headline = item.edits.sectionTitle;
      if (item.edits.subtitle == null && item.edits.sectionSubtitle != null) item.edits.subtitle = item.edits.sectionSubtitle;
    }
    const rawList = h.editList(item, 'items') || [];
    const faqItemCount = Math.max(3, Math.min(20, parseInt(h.opt(item, 'faqItemCount'), 10) || 6));
    const list = Array.from({ length: faqItemCount }, (_, i) => {
      if (rawList[i]) return rawList[i];
      return {
        q: `Question ${i + 1}`,
        a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      };
    });
    const showHead = h.opt(item,'showEyebrow') || h.opt(item,'showHeadline') ||
                     h.opt(item,'showSubtitle') || h.opt(item,'showDivider') || h.opt(item,'showBody');
    const single = (item.layout || 'multi-open') === 'single-open';
    const groupName = single ? `cpb-faq-${item.uid}` : null;
    const bgType = (item.options && item.options.heroBgType) || 'color';
    const bgColor = (item.edits && item.edits.bgColor) || '';
    const bgImage = (item.edits && item.edits.bgImage) || '';
    const bgStyle = bgType === 'image' && bgImage
      ? `background-image:url('${bgImage}');background-size:cover;background-position:center;`
      : bgColor ? `background-color:${bgColor};` : '';
    return `
<div class="cpb-section" data-bg="${item.bg||'plain'}" data-mode="${item.mode || ''}"${bgStyle ? ` style="${bgStyle}"` : ''}>
  ${showHead ? `
  <div class="cpb-feature-head" data-align="center">
      ${renderHeadingGroup(item, h, { headlineKey: 'headline', subtitleKey: 'subtitle', bodyKey: 'body' })}
  </div>` : ''}
  <div class="cpb-faq">
    ${list.map((it, i) => {
      const inputId = `cpb-faq-${item.uid}-${i}`;
      const inputAttrs = single
        ? `type="radio" name="${groupName}"`
        : `type="checkbox"`;
      return `
    <div class="cpb-faq-item">
      <input id="${inputId}" ${inputAttrs} />
      <label class="cpb-faq-question" for="${inputId}">
        <div ${h.editAttr(item,'items.'+i+'.q')}>${it.q||''}</div>
        <div class="mi cpb-faq-arrow">expand_more</div>
      </label>
      <div class="cpb-faq-answer">
        <div ${h.editAttr(item,'items.'+i+'.a')}>${it.a||''}</div>
      </div>
    </div>`;
    }).join('')}
  </div>
</div>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   J1 — Site Header (FIXED)
   Content is locked. Style toggles do NOT affect this Section.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'site-header', num: 'J1', group: 'J', name: 'Site Header',
  desc: 'Fixed Advantech IoTMart top header. Content cannot be edited.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="8" y="14" width="44" height="18" rx="2" fill="#0059ff" opacity=".6"/><rect x="140" y="20" width="22" height="6" rx="2" fill="#cfd2d5"/><rect x="168" y="20" width="22" height="6" rx="2" fill="#cfd2d5"/><rect x="196" y="20" width="22" height="6" rx="2" fill="#cfd2d5"/><rect x="224" y="20" width="22" height="6" rx="2" fill="#cfd2d5"/><rect x="254" y="17" width="18" height="12" rx="2" fill="#0059ff" opacity=".7"/></svg>`,

  fixed: true,
  layoutVariants: [],
  optionMap: [],
  editMap: [],
  getHtml(item, h) {
    if (typeof FIXED_HEADER_HTML !== 'string') return '';
    // The header itself is position:fixed in the export, so we append a
    // 48px spacer that takes its place in normal flow. The builder hides
    // the spacer via a builder-only override.
    return FIXED_HEADER_HTML + '\n<div class="cpb-fx-main-mt"></div>';
  },
},

/* ──────────────────────────────────────────────────────────────────────
   J2 — Sticky Anchor Nav (FIXED structure, user-defined items)
   Sits directly under the Header. Sticky on scroll. The user fills in
   any number of {label, anchor} pairs — only those are rendered.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'site-anchor-nav', num: 'J2', group: 'J', name: 'Sticky Anchor Nav',
  desc: 'Sticky in-page navigation under the Header. Add any label + anchor pairs.',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#f8f9fb"/><rect x="0" y="15" width="280" height="16" fill="#fff" stroke="#e5e7eb" stroke-width="1"/><rect x="16" y="19" width="30" height="8" rx="4" fill="#0059ff" opacity=".7"/><rect x="54" y="20" width="28" height="6" rx="3" fill="#e5e7eb"/><rect x="90" y="20" width="28" height="6" rx="3" fill="#e5e7eb"/><rect x="126" y="20" width="28" height="6" rx="3" fill="#e5e7eb"/></svg>`,

  fixed: true,
  layoutVariants: [],
  optionMap: [],
  editMap: [
    { key: 'items', label: 'Anchor Items', kind: 'list',
      fields: [
        { key: 'label',  label: 'Label',     placeholder: 'e.g. Overview' },
        { key: 'anchor', label: 'Anchor ID', placeholder: 'e.g. overview' },
      ],
      default: [
        { label: 'Overview', anchor: 'overview' },
        { label: 'Features', anchor: 'features' },
        { label: 'Pricing',  anchor: 'pricing'  },
      ],
    },
  ],
  getHtml(item, h) {
    const list = h.editList(item, 'items') || [];
    const mode = item.mode === 'dark' ? 'dark' : (item.mode === 'light' ? 'light' : '');
    const links = list.map(it => {
      const lbl = String(it && it.label || '').trim();
      const anc = String(it && it.anchor || '').trim().replace(/^#/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
      if (!lbl || !anc) return '';
      return `<a href="#${anc}" class="cpb-fx-anchor-item" data-anchor="${anc}">${lbl}</a>`;
    }).join('');
    return `\n<nav class="cpb-fx-anchor-nav"${mode ? ` data-mode="${mode}"` : ''}><div class="cpb-fx-anchor-nav-inner">${links}</div></nav>`;
  },
},

/* ──────────────────────────────────────────────────────────────────────
   J3 — Site Footer (FIXED)
   Content is locked. Light / Dark is controlled by Section Mode.
   ────────────────────────────────────────────────────────────────────── */
{
  id: 'site-footer', num: 'J3', group: 'JF', name: 'Site Footer',
  desc: 'Fixed Advantech footer with social + copyright. Uses Section Mode (Light / Dark).',
  thumb: `<svg viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg"><rect width="280" height="48" fill="#1a1c2e"/><rect x="8" y="6" width="44" height="8" rx="2" fill="rgba(255,255,255,.45)"/><rect x="8" y="20" width="60" height="4" rx="1" fill="rgba(255,255,255,.2)"/><rect x="8" y="28" width="50" height="4" rx="1" fill="rgba(255,255,255,.15)"/><rect x="100" y="6" width="50" height="6" rx="2" fill="rgba(255,255,255,.3)"/><rect x="100" y="18" width="44" height="4" rx="1" fill="rgba(255,255,255,.15)"/><rect x="100" y="26" width="48" height="4" rx="1" fill="rgba(255,255,255,.12)"/><rect x="200" y="6" width="50" height="6" rx="2" fill="rgba(255,255,255,.3)"/><rect x="200" y="18" width="44" height="4" rx="1" fill="rgba(255,255,255,.15)"/><rect x="200" y="26" width="36" height="4" rx="1" fill="rgba(255,255,255,.12)"/><rect x="8" y="40" width="264" height="1" fill="rgba(255,255,255,.1)"/></svg>`,

  fixed: true,
  layoutVariants: [],
  optionMap: [],
  editMap: [],
  getHtml(item, h) {
    if (typeof FIXED_FOOTER_HTML !== 'string') return '';
    // Backward compatibility: older projects stored footer mode in options.footerMode.
    if (item.options && item.options.footerMode) {
      item.mode = item.options.footerMode === 'dark' ? 'dark' : 'light';
      delete item.options.footerMode;
    }
    const mode = item.mode === 'dark' ? 'dark' : 'light';
    return FIXED_FOOTER_HTML.replace(
      /<div class="cpb-fx-footer"/,
      `<div class="cpb-fx-footer" data-footer-mode="${mode}"`
    );
  },
},

];

const SECTION_BY_ID = Object.fromEntries(SECTIONS.map(s => [s.id, s]));

/* Group ordering for left panel */
const SECTION_GROUPS = [
  { id: 'J',  name: 'Header' },
  { id: 'B',  name: 'Hero' },
  { id: 'D',  name: 'Feature Cards' },
  { id: 'P',  name: 'Product' },
  { id: 'E',  name: 'Related' },
  { id: 'G',  name: 'FAQ' },
  { id: 'JF', name: 'Footer' },
];
