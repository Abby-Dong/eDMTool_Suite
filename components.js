// ══════════════════════════════════════
// components.js — Component Library Data
// Extracted from ComponentCustomizer.html
// Contains: COMPONENTS, THEMES, RESPONSIVE_CSS
// ══════════════════════════════════════

// ══════════════════════════════════════
// Component Registry — 25 Components
// Each defines: id, name, html (raw email HTML fragment), colorMap
// colorMap: array of { label, targets: [{selector, attr}], default }
// ══════════════════════════════════════

var COMPONENTS = [
  // ─── 01 Header ───
  {
    id: 'header',
    num: '01',
    name: 'Header',
    getHtml: () => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="split-table" style="width: 600px;">
  <tr>
    <td width="600" align="center" valign="middle"
        style="width: 600px; background-color: #ffffff; padding: 20px 30px 20px 30px;" data-color="headerBg">
      <table border="0" cellpadding="0" cellspacing="0" width="540" class="split-table" style="width: 540px;">
        <tr>
          <td align="left" valign="middle" width="200" class="logo-td" style="width: 200px;">
            <img mc:edit="header_logo" src="https://irp.cdn-website.com/56869327/dms3rep/multi/ADVANTECH+IoTMart+LOGO.png"
                 width="180" alt="Advantech IoTMart" data-crop="free"
                 style="display: block; width: 180px; max-width: 180px; height: auto;" />
          </td>
          <td width="340" align="right" valign="middle" class="nav-links" style="width: 340px;">
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td class="hide-sm" style="padding: 0 8px;">
                  <a href="https://www.iotmart.com/s/campaigns?language=en_US" mc:edit="header_link1" style="font-size: 12px; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="headerLinkColor">DEALS &amp; OFFERS</a>
                </td>
                <td style="padding: 0 8px;">
                  <a href="mailto:Service.iotmart@advantech.com" mc:edit="header_link2" style="font-size: 12px; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="headerLinkColor">CONTACT US</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
    colorMap: [
      { label: 'Background', key: 'headerBg', type: 'bg', default: '#ffffff' },
      { label: 'Link Color', key: 'headerLinkColor', type: 'color', default: '#444444' }
    ]
  },

  // ─── 02 Banner v1 ───
  {
    id: 'banner-v1',
    num: '02',
    name: 'Hero — Full Width',
    optionMap: [
      { key: 'showEyebrow', label: 'Eyebrow', default: true },
      { key: 'showSubtitle', label: 'Subtitle', default: true },
      { key: 'showCta', label: 'CTA Button', default: true }
    ],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="split-table" style="width: 600px;">
  <tr>
    <td width="600" colspan="3" align="center" valign="middle" class="hero-v1-td"
        style="width: 600px; padding: 48px 40px 32px 40px;" data-color="bannerBg">
      ${opts.showEyebrow !== false ? `<p mc:edit="hero_eyebrow"
         style="margin: 0 0 8px 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 4px; text-transform: uppercase;" data-color="bannerEyebrow">
        Exclusive Offer 2026
      </p>` : ''}
      <h1 mc:edit="hero_title" class="hero-v1-title"
          style="margin: 0 0 14px 0; font-size: 46px; font-weight: 900; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.1;" data-color="bannerTitle">
        Industrial IoT<br/>Sale Is On
      </h1>
      ${opts.showSubtitle !== false ? `<p mc:edit="hero_subtitle"
         style="margin: 0; font-size: 16px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="bannerSubtitle">
        Top-rated IIoT hardware <strong data-color="bannerStrong">up to 50% OFF</strong> \u2014 72 hours only
      </p>` : ''}
    </td>
  </tr>
  ${opts.showCta !== false ? `<tr>
    <td width="180" class="banner-side" style="width: 180px; padding: 24px 0; font-size: 0; line-height: 0;" data-color="bannerBg"></td>
    <td width="240" align="center" valign="middle" class="banner-cta-cell"
        style="width: 240px; padding: 18px 24px;" data-color="bannerCtaBg">
      <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="hero_cta"
         style="font-size: 16px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="bannerCtaText">
        Shop Now &rarr;
      </a>
    </td>
    <td width="180" class="banner-side" style="width: 180px; padding: 24px 0; font-size: 0; line-height: 0;" data-color="bannerBg"></td>
  </tr>` : ''}
  <tr>
    <td width="600" height="28" colspan="3"
        style="width: 600px; height: 28px; mso-line-height-rule: exactly; font-size: 0; line-height: 0;" data-color="bannerBg">&nbsp;</td>
  </tr>
</table>`,
    colorMap: [
      { label: 'Section BG', key: 'bannerBg', type: 'bg', default: '#0050e0' },
      { label: 'Eyebrow', key: 'bannerEyebrow', type: 'color', default: '#99d6ff', optionGate: 'showEyebrow' },
      { label: 'Title', key: 'bannerTitle', type: 'color', default: '#ffffff' },
      { label: 'Subtitle', key: 'bannerSubtitle', type: 'color', default: '#99d6ff', optionGate: 'showSubtitle' },
      { label: 'Strong Text', key: 'bannerStrong', type: 'color', default: '#ffffff', optionGate: 'showSubtitle' },
      { label: 'CTA BG', key: 'bannerCtaBg', type: 'bg', default: '#ffffff', optionGate: 'showCta' },
      { label: 'CTA Text', key: 'bannerCtaText', type: 'color', default: '#0050e0', optionGate: 'showCta' }
    ]
  },

  // ─── 03 Banner v2 ───
  {
    id: 'banner-v2',
    num: '03',
    name: 'Hero — Split',
    optionMap: [
      { key: 'showEyebrow', label: 'Eyebrow', default: true },
      { key: 'showBanner2Sub', label: 'Subtitle', default: true },
      { key: 'showSubtitle', label: 'Content', default: true },
      { key: 'showCta', label: 'CTA Button', default: true }
    ],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="bv2-split-table" style="width: 600px;">
  <tr valign="middle">
    <td width="300" align="left" valign="middle" class="bv2-hero-td"
        style="width: 300px; padding: 40px 28px;" data-color="banner2Bg">
      ${opts.showEyebrow !== false ? `<p mc:edit="hero_eyebrow"
         style="margin: 0 0 10px 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 4px; text-transform: uppercase;" data-color="banner2Eyebrow">
        Exclusive Offer 2026
      </p>` : ''}
      <h1 mc:edit="hero_title" class="bv2-hero-title"
          style="margin: 0 0 14px 0; font-size: 34px; font-weight: 900; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.1;" data-color="banner2Title">
        Industrial IoT<br/>Sale Is On
      </h1>
      ${opts.showBanner2Sub !== false ? `<p mc:edit="hero_subtitle2" class="bv2-subtitle2"
         style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="banner2Sub">
        Your Subtitle Here
      </p>` : ''}
      ${opts.showSubtitle !== false ? `<p mc:edit="hero_subtitle"
         style="margin: 0 0 24px 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="banner2Subtitle">
        Top-rated IIoT hardware <strong data-color="banner2Strong">up to 50% OFF</strong> \u2014 72 hours only
      </p>` : ''}
      ${opts.showCta !== false ? `<table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 12px 24px;" data-color="banner2CtaBg">
            <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="hero_cta"
               style="font-size: 14px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="banner2CtaText">
              Shop Now &rarr;
            </a>
          </td>
        </tr>
      </table>` : ''}
    </td>
    <td width="300" align="left" valign="top" class="bv2-col-img"
        style="width: 300px; padding: 0; font-size: 0; line-height: 0;" data-color="banner2ImgBg">
      <img mc:edit="hero_image"
           src="https://irp.cdn-website.com/56869327/dms3rep/multi/test-b73f2a4f.png"
           width="300" alt="Industrial IoT Hardware" class="bv2-img" data-crop="free"
           style="display: block; width: 300px; max-width: 100%; height: auto;" />
    </td>
  </tr>
</table>`,
    colorMap: [
      { label: 'Text Area BG', key: 'banner2Bg', type: 'bg', default: '#0059ff' },
      { label: 'Image BG', key: 'banner2ImgBg', type: 'bg', default: '#ffffff' },
      { label: 'Eyebrow', key: 'banner2Eyebrow', type: 'color', default: '#99d6ff', optionGate: 'showEyebrow' },
      { label: 'Title', key: 'banner2Title', type: 'color', default: '#ffffff' },
      { label: 'Subtitle', key: 'banner2Sub', type: 'color', default: '#e0f0ff', optionGate: 'showBanner2Sub' },
      { label: 'Content', key: 'banner2Subtitle', type: 'color', default: '#99d6ff', optionGate: 'showSubtitle' },
      { label: 'Strong Text', key: 'banner2Strong', type: 'color', default: '#ffffff', optionGate: 'showSubtitle' },
      { label: 'CTA BG', key: 'banner2CtaBg', type: 'bg', default: '#ffffff', optionGate: 'showCta' },
      { label: 'CTA Text', key: 'banner2CtaText', type: 'color', default: '#0059ff', optionGate: 'showCta' }
    ]
  },

  // ─── 04 Countdown ───
  {
    id: 'countdown',
    num: '04',
    name: 'Heading — Countdown',
    optionMap: [
      { key: 'showIcon', label: 'Left Icon', default: true }
    ],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="width: 600px;">
  <tr>
    <td width="600" align="center" valign="middle" class="countdown-td"
        style="width: 600px; padding: 14px 40px;" data-color="countdownBg">
      ${opts.showIcon !== false ? `<table border="0" cellpadding="0" cellspacing="0" width="100%" class="countdown-icon-tbl" style="width: 100%;">
        <tr valign="middle">
          <td width="48" align="center" valign="middle" style="width: 48px; padding-right: 12px; line-height: 0; font-size: 0;">
            <img mc:edit="countdown_icon"
                 src="https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773742518/eDM/assets/wbjhvlemyofuxqo4onlv.png"
                 width="48" height="48" alt="Icon" data-crop="48:48"
                 style="display: block; width: 48px; height: 48px; border: 0;" />
          </td>
          <td align="center" valign="middle">
            <p mc:edit="countdown_text" style="margin: 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="countdownText">
              ⏰ &nbsp;Offer Ends:
              <strong style="font-size: 15px;" data-color="countdownAccent">2026 / 03 / 07 &nbsp;23:59</strong>
              &nbsp;— Don't Miss Out!
            </p>
          </td>
        </tr>
      </table>` : `<p mc:edit="countdown_text" style="margin: 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="countdownText">
        ⏰ &nbsp;Offer Ends:
        <strong style="font-size: 15px;" data-color="countdownAccent">2026 / 03 / 07 &nbsp;23:59</strong>
        &nbsp;— Don't Miss Out!
      </p>`}
    </td>
  </tr>
</table>`,
    colorMap: [
      { label: 'Background', key: 'countdownBg', type: 'bg', default: '#07071a' },
      { label: 'Text', key: 'countdownText', type: 'color', default: '#ffffff' },
      { label: 'Accent Text', key: 'countdownAccent', type: 'color', default: '#e02020' }
    ]
  },

  // ─── 05 Section Heading ───
  {
    id: 'section-heading',
    num: '05',
    name: 'Heading — Section',
    optionMap: [
      { key: 'showEyebrow', label: 'Eyebrow', default: true },
      { key: 'showTitle', label: 'Title', default: true },
      { key: 'showSubtitle', label: 'Subtitle', default: true },
      { key: 'textAlign', label: 'Text Align', type: 'select', default: 'center', choices: [{label: 'Left', value: 'left'}, {label: 'Center', value: 'center'}, {label: 'Right', value: 'right'}] }
    ],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="width: 600px;">
  <tr>
    <td width="600" align="${opts.textAlign || 'center'}" valign="top"
        style="width: 600px; padding: 36px 30px 10px 30px; text-align: ${opts.textAlign || 'center'};" data-color="sectionBg">
      ${opts.showEyebrow !== false ? `<p mc:edit="section_eyebrow" style="margin: 0 0 4px 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 3px; text-transform: uppercase;" data-color="sectionEyebrow">
        Featured Products
      </p>` : ''}
      ${opts.showTitle !== false ? `<h2 mc:edit="section_title" style="margin: 0 0 6px 0; font-size: 24px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="sectionTitle">
        Top Industrial IoT Hardware Picks
      </h2>` : ''}
      ${opts.showSubtitle !== false ? `<p mc:edit="section_subtitle" style="margin: 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="sectionSubtitle">
        Editor's selection — must-have IIoT devices for your smart factory
      </p>` : ''}
    </td>
  </tr>
</table>`,
    colorMap: [
      { label: 'Background', key: 'sectionBg', type: 'bg', default: '#eef1f6' },
      { label: 'Eyebrow', key: 'sectionEyebrow', type: 'color', default: '#0050e0', optionGate: 'showEyebrow' },
      { label: 'Title', key: 'sectionTitle', type: 'color', default: '#1a1a2e', optionGate: 'showTitle' },
      { label: 'Subtitle', key: 'sectionSubtitle', type: 'color', default: '#888888', optionGate: 'showSubtitle' }
    ]
  },

  // ─── 06 Products v1 ───
  {
    id: 'products-v1',
    num: '06',
    name: 'Product Grid — 2×2',
    optionMap: [
      { key: 'rowCount', label: 'Rows', type: 'select', default: '2', choices: [{label: '1', value: '1'}, {label: '2', value: '2'}] },
      { key: 'imgRatio', label: 'Image Ratio', type: 'select', default: '1:1', choices: [{label: '1:1', value: '1:1'}, {label: '9:16', value: '9:16'}] },
      { key: 'titleFontSize', label: 'Title Font Size', type: 'select', default: '14', choices: [{label: 'S', value: '12'}, {label: 'M', value: '14'}, {label: 'L', value: '16'}] },
      { key: 'bodyFontSize', label: 'Body Font Size', type: 'select', default: '12', choices: [{label: 'S', value: '8'}, {label: 'M', value: '10'}, {label: 'L', value: '12'}] },
      { key: 'showBadges', label: 'Show Badges', type: 'boolean', default: true },
      { key: 'showOrigPrice', label: 'Show Original Price', type: 'boolean', default: true }
    ],
    getHtml: (opts = {}) => {
      const imgH = opts.imgRatio === '9:16' ? 147 : 180;
      const cropRatio = opts.imgRatio === '9:16' ? '16:9' : '1:1';
      const titleSize = opts.titleFontSize || '14';
      const bodySize = opts.bodyFontSize || '12';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="width: 600px;">
  <!-- Row 1: Products 1 & 2 -->
  <tr>
    <td width="600" align="center" valign="top"
        style="width: 600px; padding: 20px 20px 10px 20px;" data-color="prodBg">
      <table border="0" cellpadding="0" cellspacing="0" width="560" class="product-grid" style="width: 560px;">
        <tr valign="top">
          <td width="269" align="center" valign="top" class="col-2" style="padding: 0 6px 0 0; width: 269px;">
            <table border="0" cellpadding="0" cellspacing="0" width="263" class="product-card"
                   style="width: 263px; border: 0; overflow: hidden;">
              <tr>
                <td width="261" align="center" height="${imgH}" class="card-img" style="width: 261px; height: ${imgH}px; padding: 0;" data-color="prodImgBg">
                  <img mc:edit="product1_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_AIR-030-B90A1.png"
                       width="261" height="${imgH}" alt="Product 1" class="mobile-img" data-crop="${cropRatio}"
                       style="display: block; width: 261px; max-width: 261px; height: ${imgH}px; object-fit: contain;" />
                </td>
              </tr>
              <tr>
                <td width="261" align="center" class="card-body" style="width: 261px; padding: 16px 12px 12px 12px;">
                  ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 8px;">
                    <tr>
                      <td data-color="prodBadgeBg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;">
                        <span mc:edit="product1_badge1" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="prodBadgeText">SALE</span>
                      </td>
                      <td width="6" style="width: 6px;"></td>
                      <td data-color="prodBadge2Bg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;" data-border-color="prodBadgeBorder">
                        <span mc:edit="product1_badge2" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold;" data-color="prodBadge2Text">10% OFF</span>
                      </td>
                    </tr>
                  </table>` : ''}
                  <p mc:edit="product1_name" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodName">AIR-030-B90A1</p>
                  <p mc:edit="product1_desc" style="margin: 0 0 10px 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodDesc">NVIDIA® Jetson AGX Orin™ AI Inference System</p>
                  <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 12px;">
                    <tr>
                      <td style="padding-right: 8px;"><span mc:edit="product1_price" style="font-size: 18px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="prodPrice">$299</span></td>
                      ${opts.showOrigPrice !== false ? `<td><span mc:edit="product1_original_price" style="font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodOrigPrice"><s>$599</s></span></td>` : ''}
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td width="261" align="center" class="card-cta" style="width: 261px; padding: 14px 0;" data-color="prodCtaBg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="product1_cta"
                     style="display: block; font-size: 13px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodCtaText">
                    <span data-color="prodCtaText">Shop Now &rarr;</span>
                  </a>
                </td>
              </tr>
            </table>
          </td>
          <td width="22" class="col-gap" style="width: 22px;"></td>
          <td width="269" align="center" valign="top" class="col-2" style="padding: 0 0 0 6px; width: 269px;">
            <table border="0" cellpadding="0" cellspacing="0" width="263" class="product-card"
                   style="width: 263px; border: 0; overflow: hidden;">
              <tr>
                <td width="261" align="center" height="${imgH}" class="card-img" style="width: 261px; height: ${imgH}px; padding: 0;" data-color="prodImgBg">
                  <img mc:edit="product2_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_AIR-030-S30A1.png"
                       width="261" height="${imgH}" alt="Product 2" class="mobile-img" data-crop="${cropRatio}"
                       style="display: block; width: 261px; max-width: 261px; height: ${imgH}px; object-fit: contain;" />
                </td>
              </tr>
              <tr>
                <td width="261" align="center" class="card-body" style="width: 261px; padding: 16px 12px 12px 12px;">
                  ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 8px;">
                    <tr>
                      <td data-color="prodBadgeBg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;">
                        <span mc:edit="product2_badge1" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="prodBadgeText">SALE</span>
                      </td>
                      <td width="6" style="width: 6px;"></td>
                      <td data-color="prodBadge2Bg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;" data-border-color="prodBadgeBorder">
                        <span mc:edit="product2_badge2" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold;" data-color="prodBadge2Text">10% OFF</span>
                      </td>
                    </tr>
                  </table>` : ''}
                  <p mc:edit="product2_name" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodName">AIR-030-S30A1</p>
                  <p mc:edit="product2_desc" style="margin: 0 0 10px 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodDesc">NVIDIA® Jetson AGX Orin™ AI Inference System</p>
                  <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 12px;">
                    <tr>
                      <td style="padding-right: 8px;"><span mc:edit="product2_price" style="font-size: 18px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="prodPrice">$420</span></td>
                      ${opts.showOrigPrice !== false ? `<td><span mc:edit="product2_original_price" style="font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodOrigPrice"><s>$599</s></span></td>` : ''}
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td width="261" align="center" class="card-cta" style="width: 261px; padding: 14px 0;" data-color="prodCtaBg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="product2_cta"
                     style="display: block; font-size: 13px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodCtaText">
                    <span data-color="prodCtaText">Shop Now &rarr;</span>
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${opts.rowCount !== '1' ? `<!-- Row 2: Products 3 & 4 -->
  <tr>
    <td width="600" align="center" valign="top"
        style="width: 600px; padding: 10px 20px 20px 20px;" data-color="prodBg">
      <table border="0" cellpadding="0" cellspacing="0" width="560" class="product-grid" style="width: 560px;">
        <tr valign="top">
          <td width="269" align="center" valign="top" class="col-2" style="padding: 0 6px 0 0; width: 269px;">
            <table border="0" cellpadding="0" cellspacing="0" width="263" class="product-card"
                   style="width: 263px; border: 0; overflow: hidden;">
              <tr>
                <td width="261" align="center" height="${imgH}" class="card-img" style="width: 261px; height: ${imgH}px; padding: 0;" data-color="prodImgBg">
                  <img mc:edit="product3_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_AIR-020X-S9A1.png"
                       width="261" height="${imgH}" alt="Product 3" class="mobile-img" data-crop="${cropRatio}"
                       style="display: block; width: 261px; max-width: 261px; height: ${imgH}px; object-fit: contain;" />
                </td>
              </tr>
              <tr>
                <td width="261" align="center" class="card-body" style="width: 261px; padding: 16px 12px 12px 12px;">
                  ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 8px;">
                    <tr>
                      <td data-color="prodBadgeBg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;">
                        <span mc:edit="product3_badge1" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="prodBadgeText">SALE</span>
                      </td>
                      <td width="6" style="width: 6px;"></td>
                      <td data-color="prodBadge2Bg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;" data-border-color="prodBadgeBorder">
                        <span mc:edit="product3_badge2" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold;" data-color="prodBadge2Text">10% OFF</span>
                      </td>
                    </tr>
                  </table>` : ''}
                  <p mc:edit="product3_name" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodName">AIR-020X-S9A1</p>
                  <p mc:edit="product3_desc" style="margin: 0 0 10px 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodDesc">NVIDIA® Jetson™ Xavier NX AI Inference System</p>
                  <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 12px;">
                    <tr>
                      <td style="padding-right: 8px;"><span mc:edit="product3_price" style="font-size: 18px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="prodPrice">$359</span></td>
                      ${opts.showOrigPrice !== false ? `<td><span mc:edit="product3_original_price" style="font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodOrigPrice"><s>$599</s></span></td>` : ''}
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td width="261" align="center" class="card-cta" style="width: 261px; padding: 14px 0;" data-color="prodCtaBg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="product3_cta"
                     style="display: block; font-size: 13px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodCtaText">
                    <span data-color="prodCtaText">Shop Now &rarr;</span>
                  </a>
                </td>
              </tr>
            </table>
          </td>
          <td width="22" class="col-gap" style="width: 22px;"></td>
          <td width="269" align="center" valign="top" class="col-2" style="padding: 0 0 0 6px; width: 269px;">
            <table border="0" cellpadding="0" cellspacing="0" width="263" class="product-card"
                   style="width: 263px; border: 0; overflow: hidden;">
              <tr>
                <td width="261" align="center" height="${imgH}" class="card-img" style="width: 261px; height: ${imgH}px; padding: 0;" data-color="prodImgBg">
                  <img mc:edit="product4_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_ARK-1124C-S1A3.png"
                       width="261" height="${imgH}" alt="Product 4" class="mobile-img" data-crop="${cropRatio}"
                       style="display: block; width: 261px; max-width: 261px; height: ${imgH}px; object-fit: contain;" />
                </td>
              </tr>
              <tr>
                <td width="261" align="center" class="card-body" style="width: 261px; padding: 16px 12px 12px 12px;">
                  ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 8px;">
                    <tr>
                      <td data-color="prodBadgeBg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;">
                        <span mc:edit="product4_badge1" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="prodBadgeText">SALE</span>
                      </td>
                      <td width="6" style="width: 6px;"></td>
                      <td data-color="prodBadge2Bg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;" data-border-color="prodBadgeBorder">
                        <span mc:edit="product4_badge2" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold;" data-color="prodBadge2Text">10% OFF</span>
                      </td>
                    </tr>
                  </table>` : ''}
                  <p mc:edit="product4_name" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodName">ARK-1124C-S1A3</p>
                  <p mc:edit="product4_desc" style="margin: 0 0 10px 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodDesc">Intel® Celeron™ Fanless Edge Computer System</p>
                  <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 12px;">
                    <tr>
                      <td style="padding-right: 8px;"><span mc:edit="product4_price" style="font-size: 18px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="prodPrice">$390</span></td>
                      ${opts.showOrigPrice !== false ? `<td><span mc:edit="product4_original_price" style="font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodOrigPrice"><s>$599</s></span></td>` : ''}
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td width="261" align="center" class="card-cta" style="width: 261px; padding: 14px 0;" data-color="prodCtaBg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="product4_cta"
                     style="display: block; font-size: 13px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prodCtaText">
                    <span data-color="prodCtaText">Shop Now &rarr;</span>
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ''}
</table>`;
    },
    colorMap: [
      { label: 'Section BG', key: 'prodBg', type: 'bg', default: '#eef1f6' },
      { label: 'Image BG', key: 'prodImgBg', type: 'bg', default: '#ffffff' },
      { label: 'Badge Accent', key: 'prodBadgeBg', type: 'bg', default: '#f39c12', linked: ['prodBadge2Text','prodBadgeBorder'], linkedAlpha: { 'prodBadge2Bg': 0.15 } },
      { key: 'prodBadgeText', type: 'color', default: '#ffffff', hidden: true },
      { key: 'prodBadge2Bg', type: 'bg', default: '#feeed9', hidden: true },
      { key: 'prodBadge2Text', type: 'color', default: '#f39c12', hidden: true },
      { key: 'prodBadgeBorder', type: 'border', default: '#f39c12', hidden: true },
      { label: 'Product Name', key: 'prodName', type: 'color', default: '#1a1a2e' },
      { label: 'Product Desc', key: 'prodDesc', type: 'color', default: '#888888' },
      { label: 'Sale Price', key: 'prodPrice', type: 'color', default: '#e02020' },
      { label: 'Original Price', key: 'prodOrigPrice', type: 'color', default: '#bbbbbb' },
      { label: 'CTA BG', key: 'prodCtaBg', type: 'bg', default: '#07071a' },
      { label: 'CTA Text', key: 'prodCtaText', type: 'color', default: '#ffffff' }
    ]
  },

  // ─── 07 Products v2 ───
  {
    id: 'products-v2',
    num: '07',
    name: 'Product Grid — 3-Col',
    optionMap: [
      { key: 'imgRatio', label: 'Image Ratio', type: 'select', default: '1:1', choices: [{label: '1:1', value: '1:1'}, {label: '9:16', value: '9:16'}] },
      { key: 'titleFontSize', label: 'Title Font Size', type: 'select', default: '13', choices: [{label: 'S', value: '12'}, {label: 'M', value: '13'}, {label: 'L', value: '16'}] },
      { key: 'bodyFontSize', label: 'Body Font Size', type: 'select', default: '10', choices: [{label: 'S', value: '8'}, {label: 'M', value: '10'}, {label: 'L', value: '12'}] },
      { key: 'showBadges', label: 'Badges', default: true },
      { key: 'showOrigPrice', label: 'Original Price', default: true }
    ],
    getHtml: (opts = {}) => {
      const imgH = opts.imgRatio === '9:16' ? 98 : 160;
      const cropRatio = opts.imgRatio === '9:16' ? '16:9' : '1:1';
      const titleSize = opts.titleFontSize || '13';
      const bodySize = opts.bodyFontSize || '10';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="width: 600px;">
  <tr>
    <td width="600" align="center" valign="top"
        style="width: 600px; padding: 20px 20px 20px 20px;" data-color="prod2Bg">
      <table border="0" cellpadding="0" cellspacing="0" width="560" class="product-grid" style="width: 560px;">
        <tr valign="top">
          <td width="180" align="center" valign="top" class="col-3" style="padding: 0 4px 0 0; width: 180px;">
            <table border="0" cellpadding="0" cellspacing="0" width="176" class="product-card"
                   style="width: 176px; border: 0; overflow: hidden;">
              <tr><td width="174" align="center" height="${imgH}" class="card-img" style="width: 174px; height: ${imgH}px; padding: 0;" data-color="prod2ImgBg">
                <img mc:edit="product1_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_AIR-020X-S9A1.png" width="174" height="${imgH}" alt="Product 1" class="mobile-img" data-crop="${cropRatio}" style="display: block; width: 174px; max-width: 174px; height: ${imgH}px; object-fit: contain;" />
              </td></tr>
              <tr><td width="174" align="center" class="card-body" style="width: 174px; padding: 12px 8px 8px 8px;">
                ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 8px;">
                  <tr>
                    <td data-color="prod2BadgeBg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;">
                      <span mc:edit="product1_badge1" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="prod2BadgeText">SALE</span>
                    </td>
                    <td width="4" style="width: 4px;"></td>
                    <td data-color="prod2Badge2Bg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;" data-border-color="prod2BadgeBorder">
                      <span mc:edit="product1_badge2" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold;" data-color="prod2Badge2Text">10% OFF</span>
                    </td>
                  </tr>
                </table>` : ''}
                <p mc:edit="product1_name" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Name">AIR-020X-S9A1</p>
                <p mc:edit="product1_desc" style="margin: 0 0 8px 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Desc">NVIDIA® Jetson™ Xavier NX AI Inference System</p>
                <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 10px;">
                  <tr>
                    <td style="padding-right: 6px;"><span mc:edit="product1_price" style="font-size: 16px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Price">$359</span></td>
                    ${opts.showOrigPrice !== false ? `<td><span mc:edit="product1_original_price" style="font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2OrigPrice"><s>$599</s></span></td>` : ''}
                  </tr>
                </table>
              </td></tr>
              <tr><td width="174" align="center" class="card-cta" style="width: 174px; padding: 12px 0;" data-color="prod2CtaBg">
                <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="product1_cta" style="display: block; font-size: 12px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2CtaText"><span data-color="prod2CtaText">Shop Now &rarr;</span></a>
              </td></tr>
            </table>
          </td>
          <td width="10" class="col-gap" style="width: 10px;"></td>
          <td width="180" align="center" valign="top" class="col-3" style="padding: 0 2px; width: 180px;">
            <table border="0" cellpadding="0" cellspacing="0" width="176" class="product-card"
                   style="width: 176px; border: 0; overflow: hidden;">
              <tr><td width="174" align="center" height="${imgH}" class="card-img" style="width: 174px; height: ${imgH}px; padding: 0;" data-color="prod2ImgBg">
                <img mc:edit="product2_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_ARK-1124C-S1A3.png" width="174" height="${imgH}" alt="Product 2" class="mobile-img" data-crop="${cropRatio}" style="display: block; width: 174px; max-width: 174px; height: ${imgH}px; object-fit: contain;" />
              </td></tr>
              <tr><td width="174" align="center" class="card-body" style="width: 174px; padding: 12px 8px 8px 8px;">
                ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 8px;">
                  <tr>
                    <td data-color="prod2BadgeBg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;">
                      <span mc:edit="product2_badge1" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="prod2BadgeText">SALE</span>
                    </td>
                    <td width="4" style="width: 4px;"></td>
                    <td data-color="prod2Badge2Bg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;" data-border-color="prod2BadgeBorder">
                      <span mc:edit="product2_badge2" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold;" data-color="prod2Badge2Text">10% OFF</span>
                    </td>
                  </tr>
                </table>` : ''}
                <p mc:edit="product2_name" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Name">ARK-1124C-S1A3</p>
                <p mc:edit="product2_desc" style="margin: 0 0 8px 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Desc">Intel® Celeron™ Fanless Edge Computer System</p>
                <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 10px;">
                  <tr>
                    <td style="padding-right: 6px;"><span mc:edit="product2_price" style="font-size: 16px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Price">$390</span></td>
                    ${opts.showOrigPrice !== false ? `<td><span mc:edit="product2_original_price" style="font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2OrigPrice"><s>$599</s></span></td>` : ''}
                  </tr>
                </table>
              </td></tr>
              <tr><td width="174" align="center" class="card-cta" style="width: 174px; padding: 12px 0;" data-color="prod2CtaBg">
                <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="product2_cta" style="display: block; font-size: 12px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2CtaText"><span data-color="prod2CtaText">Shop Now &rarr;</span></a>
              </td></tr>
            </table>
          </td>
          <td width="10" class="col-gap" style="width: 10px;"></td>
          <td width="180" align="center" valign="top" class="col-3" style="padding: 0 0 0 4px; width: 180px;">
            <table border="0" cellpadding="0" cellspacing="0" width="176" class="product-card"
                   style="width: 176px; border: 0; overflow: hidden;">
              <tr><td width="174" align="center" height="${imgH}" class="card-img" style="width: 174px; height: ${imgH}px; padding: 0;" data-color="prod2ImgBg">
                <img mc:edit="product3_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/Edge-ai_P_AIR-030-B90A1.png" width="174" height="${imgH}" alt="Product 3" class="mobile-img" data-crop="${cropRatio}" style="display: block; width: 174px; max-width: 174px; height: ${imgH}px; object-fit: contain;" />
              </td></tr>
              <tr><td width="174" align="center" class="card-body" style="width: 174px; padding: 12px 8px 8px 8px;">
                ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 8px;">
                  <tr>
                    <td data-color="prod2BadgeBg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;">
                      <span mc:edit="product3_badge1" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="prod2BadgeText">SALE</span>
                    </td>
                    <td width="4" style="width: 4px;"></td>
                    <td data-color="prod2Badge2Bg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;" data-border-color="prod2BadgeBorder">
                      <span mc:edit="product3_badge2" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold;" data-color="prod2Badge2Text">10% OFF</span>
                    </td>
                  </tr>
                </table>` : ''}
                <p mc:edit="product3_name" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Name">AIR-030-B90A1</p>
                <p mc:edit="product3_desc" style="margin: 0 0 8px 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Desc">NVIDIA® Jetson AGX Orin™ AI Inference System</p>
                <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 10px;">
                  <tr>
                    <td style="padding-right: 6px;"><span mc:edit="product3_price" style="font-size: 16px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2Price">$299</span></td>
                    ${opts.showOrigPrice !== false ? `<td><span mc:edit="product3_original_price" style="font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2OrigPrice"><s>$599</s></span></td>` : ''}
                  </tr>
                </table>
              </td></tr>
              <tr><td width="174" align="center" class="card-cta" style="width: 174px; padding: 12px 0;" data-color="prod2CtaBg">
                <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="product3_cta" style="display: block; font-size: 12px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="prod2CtaText"><span data-color="prod2CtaText">Shop Now &rarr;</span></a>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
    },
    colorMap: [
      { label: 'Section BG', key: 'prod2Bg', type: 'bg', default: '#eef1f6' },
      { label: 'Image BG', key: 'prod2ImgBg', type: 'bg', default: '#ffffff' },
      { label: 'Badge Accent', key: 'prod2BadgeBg', type: 'bg', default: '#f39c12', linked: ['prod2Badge2Text','prod2BadgeBorder'], linkedAlpha: { 'prod2Badge2Bg': 0.15 } },
      { key: 'prod2BadgeText', type: 'color', default: '#ffffff', hidden: true },
      { key: 'prod2Badge2Bg', type: 'bg', default: '#feeed9', hidden: true },
      { key: 'prod2Badge2Text', type: 'color', default: '#f39c12', hidden: true },
      { key: 'prod2BadgeBorder', type: 'border', default: '#f39c12', hidden: true },
      { label: 'Product Name', key: 'prod2Name', type: 'color', default: '#1a1a2e' },
      { label: 'Product Desc', key: 'prod2Desc', type: 'color', default: '#888888' },
      { label: 'Sale Price', key: 'prod2Price', type: 'color', default: '#e02020' },
      { label: 'Original Price', key: 'prod2OrigPrice', type: 'color', default: '#bbbbbb' },
      { label: 'CTA BG', key: 'prod2CtaBg', type: 'bg', default: '#07071a' },
      { label: 'CTA Text', key: 'prod2CtaText', type: 'color', default: '#ffffff' }
    ]
  },

  // ─── 11 Image Text Split ───
  {
    id: 'image-text-split',
    num: '12',
    name: 'Split — Image Left',
    optionMap: [
      { key: 'imgRatio', label: 'Image Ratio', type: 'select', default: 'free', choices: [{label: '9:16', value: '9:16'}, {label: '1:1', value: '1:1'}, {label: 'Free', value: 'free'}] },
      { key: 'showEyebrow', label: 'Eyebrow', default: true },
      { key: 'showTitle', label: 'Title', default: true },
      { key: 'showSubtitle', label: 'Subtitle', default: true },
      { key: 'showBody', label: 'Body Text', default: true },
      { key: 'showCta', label: 'CTA Button', default: true }
    ],
    getHtml: (opts = {}) => {
      const cropRatio = opts.imgRatio || 'free';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="its-split-table" style="width: 600px;">
  <tr valign="middle">
    <td width="300" align="center" valign="middle" class="its-col-img" style="padding: 0; width: 300px;" data-color="splitImgBg">
      <img mc:edit="split_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/test-b73f2a4f.png"
           width="300" alt="Industrial Utilities" class="its-img" data-crop="${cropRatio}"
           style="display: block; width: 300px; max-width: 100%; height: auto;" />
    </td>
    <td width="300" align="left" valign="middle" class="its-col-text"
        style="padding: 16px 32px; width: 300px;" data-color="splitBg">
      ${opts.showEyebrow !== false ? `<p mc:edit="split_eyebrow" style="margin: 0 0 8px 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 3px; text-transform: uppercase;" data-color="splitEyebrow">Feature</p>` : ''}
      ${opts.showTitle !== false ? `<h2 mc:edit="split_title" style="margin: 0 0 10px 0; font-size: 22px; font-weight: 900; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="splitTitle">Explore Industrial IoT Solutions</h2>` : ''}
      ${opts.showSubtitle !== false ? `<p mc:edit="split_subtitle" style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="splitSubtitle">Power up your smart factory this season</p>` : ''}
      ${opts.showBody !== false ? `<p mc:edit="split_body" style="margin: 0 0 22px 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="splitBody">Discover our curated range of IIoT utilities, accessories and connectivity solutions.</p>` : ''}
      ${opts.showCta !== false ? `<table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 12px 28px;" data-color="splitCtaBg">
            <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="split_cta" style="font-size: 14px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="splitCtaText">Learn More &rarr;</a>
          </td>
        </tr>
      </table>` : ''}
    </td>
  </tr>
</table>`;
    },
    colorMap: [
      { label: 'Text Area BG', key: 'splitBg', type: 'bg', default: '#ffffff' },
      { label: 'Image BG', key: 'splitImgBg', type: 'bg', default: '#f0f0f0' },
      { label: 'Eyebrow', key: 'splitEyebrow', type: 'color', default: '#0050e0', optionGate: 'showEyebrow' },
      { label: 'Title', key: 'splitTitle', type: 'color', default: '#1a1a2e', optionGate: 'showTitle' },
      { label: 'Subtitle', key: 'splitSubtitle', type: 'color', default: '#444444', optionGate: 'showSubtitle' },
      { label: 'Body Text', key: 'splitBody', type: 'color', default: '#666666', optionGate: 'showBody' },
      { label: 'CTA BG', key: 'splitCtaBg', type: 'bg', default: '#0050e0', optionGate: 'showCta' },
      { label: 'CTA Text', key: 'splitCtaText', type: 'color', default: '#ffffff', optionGate: 'showCta' }
    ]
  },

  // ─── 12 Text Image Split ───
  {
    id: 'text-image-split',
    num: '13',
    name: 'Split — Image Right',
    optionMap: [
      { key: 'imgRatio', label: 'Image Ratio', type: 'select', default: 'free', choices: [{label: '9:16', value: '9:16'}, {label: '1:1', value: '1:1'}, {label: 'Free', value: 'free'}] },
      { key: 'showEyebrow', label: 'Eyebrow', default: true },
      { key: 'showTitle', label: 'Title', default: true },
      { key: 'showSubtitle', label: 'Subtitle', default: true },
      { key: 'showBody', label: 'Body Text', default: true },
      { key: 'showCta', label: 'CTA Button', default: true }
    ],
    getHtml: (opts = {}) => {
      const cropRatio = opts.imgRatio || 'free';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="tis-split-table" style="width: 600px;">
  <tr valign="middle">
    <td width="300" align="left" valign="middle" class="tis-col-text"
        style="padding: 16px 32px; width: 300px;" data-color="split2ContainerBg">
      ${opts.showEyebrow !== false ? `<p mc:edit="split2_eyebrow" style="margin: 0 0 8px 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 3px; text-transform: uppercase;" data-color="split2Eyebrow">Why IoTMart</p>` : ''}
      ${opts.showTitle !== false ? `<h2 mc:edit="split2_title" style="margin: 0 0 10px 0; font-size: 22px; font-weight: 900; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="split2Title">Trusted by Industry Leaders Worldwide</h2>` : ''}
      ${opts.showSubtitle !== false ? `<p mc:edit="split2_subtitle" style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="split2Subtitle">Your one-stop IIoT procurement platform</p>` : ''}
      ${opts.showBody !== false ? `<p mc:edit="split2_body" style="margin: 0 0 22px 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="split2Body">Access thousands of certified industrial products, expert support and fast global shipping \u2014 all in one place.</p>` : ''}
      ${opts.showCta !== false ? `<table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 12px 28px;" data-color="split2CtaBg">
            <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="split2_cta" style="font-size: 14px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="split2CtaText">Learn More &rarr;</a>
          </td>
        </tr>
      </table>` : ''}
    </td>
    <td width="300" align="center" valign="middle" class="tis-col-img" style="padding: 0; width: 300px;" data-color="split2ImgBg">
      <img mc:edit="split2_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/%E6%88%AA%E5%9C%96+2026-03-05+%E4%B8%8A%E5%8D%8811.21.23.png"
           width="300" alt="IoTMart Platform" class="tis-img" data-crop="${cropRatio}"
           style="display: block; width: 300px; max-width: 100%; height: auto;" />
    </td>
  </tr>
</table>`;
    },
    colorMap: [
      { label: 'Text Area BG', key: 'split2ContainerBg', type: 'bg', default: '#eef1f6' },
      { label: 'Image BG', key: 'split2ImgBg', type: 'bg', default: '#f0f0f0' },
      { label: 'Eyebrow', key: 'split2Eyebrow', type: 'color', default: '#0050e0', optionGate: 'showEyebrow' },
      { label: 'Title', key: 'split2Title', type: 'color', default: '#1a1a2e', optionGate: 'showTitle' },
      { label: 'Subtitle', key: 'split2Subtitle', type: 'color', default: '#444444', optionGate: 'showSubtitle' },
      { label: 'Body Text', key: 'split2Body', type: 'color', default: '#666666', optionGate: 'showBody' },
      { label: 'CTA BG', key: 'split2CtaBg', type: 'bg', default: '#0050e0', optionGate: 'showCta' },
      { label: 'CTA Text', key: 'split2CtaText', type: 'color', default: '#ffffff', optionGate: 'showCta' }
    ]
  },

  // ─── 17 Promo Code Single ───
  {
    id: 'coupon-v1',
    num: '21',
    name: 'Promo Code — Single',
    optionMap: [
      { key: 'showEyebrow', label: 'Eyebrow', default: true },
      { key: 'showTerms', label: 'Terms', default: true }
    ],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="split-table"
       style="width: 600px;" data-color="couponBg">
  <tr>
    <td width="600" align="center" valign="middle" style="width: 600px; padding: 32px 30px;">
      ${opts.showEyebrow !== false ? `<p mc:edit="coupon_eyebrow" style="margin: 0 0 6px 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase;" data-color="couponEyebrow">Exclusive Promo Code</p>` : ''}
      <p mc:edit="coupon_headline" style="margin: 0 0 16px 0; font-size: 20px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="couponHeadline">Save <span data-color="couponAccent">$50</span> on Your Order</p>
      <table border="0" cellpadding="0" cellspacing="0" align="center">
        <tr>
          <td align="center" style="padding: 10px 30px;" data-border-color="couponCodeBorder">
            <span mc:edit="coupon_code" style="font-size: 32px; font-weight: bold; font-family: 'Courier New', Courier, monospace; letter-spacing: 6px;" data-color="couponCode">IIOT50</span>
          </td>
        </tr>
      </table>
      ${opts.showTerms !== false ? `<p mc:edit="coupon_terms" style="margin: 12px 0 0 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="couponTerms">* Valid on orders over $300. Single use per account. Cannot be combined with other offers.</p>` : ''}
    </td>
  </tr>
</table>`,
    colorMap: [
      { label: 'Background', key: 'couponBg', type: 'bg', default: '#07071a' },
      { label: 'Eyebrow', key: 'couponEyebrow', type: 'color', default: '#888888', optionGate: 'showEyebrow' },
      { label: 'Headline', key: 'couponHeadline', type: 'color', default: '#ffffff' },
      { label: 'Accent', key: 'couponAccent', type: 'color', default: '#00aaff' },
      { label: 'Code Text', key: 'couponCode', type: 'color', default: '#00aaff' },
      { label: 'Code Border', key: 'couponCodeBorder', type: 'border', default: '#00aaff' },
      { label: 'Terms Text', key: 'couponTerms', type: 'color', default: '#666666', optionGate: 'showTerms' }
    ]
  },

  // ─── 15 Coupon Single ───
  {
    id: 'coupon-single',
    num: '19',
    name: 'Coupon — Single',
    optionMap: [
      { key: 'showImage', label: 'Image', default: true },
      { key: 'pattern', label: 'Pattern', type: 'select', default: '1', optionGate: 'showImage', choices: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' }
      ]},
      { key: 'showImgText', label: 'Image Text', default: true, optionGate: 'showImage' },
      { key: 'showEyebrow', label: 'Eyebrow', default: true },
      { key: 'showValidity', label: 'Valid Date', default: true },
      { key: 'showCta', label: 'CTA Button', default: true }
    ],
    getHtml: (opts = {}) => { const _cpat = { '1': 'https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773778546/pattern-1_size2_f3ypx1.png', '2': 'https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773778546/pattern-2_size2_bv6jn9.png', '3': 'https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773778546/pattern-3_size2_z4zkdp.png' }; const _cimg = _cpat[opts.pattern] || _cpat['1']; return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="cs-outer" style="width: 600px;" data-color="cpn1OuterBg">
  ${opts.showEyebrow !== false ? `<tr><td align="center" style="padding: 28px 20px 4px 20px;">
    <p mc:edit="cpn1_eyebrow" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 3px; text-transform: uppercase;" data-color="cpn1Eyebrow">Limited Time Offer</p>
  </td></tr>` : ''}
  <tr><td align="center" style="padding: ${opts.showEyebrow !== false ? '0' : '28px'} 20px 6px 20px;">
    <h2 mc:edit="cpn1_title" style="margin: 0; font-size: 24px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="cpn1Title">Exclusive Savings Await</h2>
  </td></tr>
  <tr><td align="center" style="padding: 0 20px 20px 20px;">
    <p mc:edit="cpn1_subtitle" style="margin: 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="cpn1Subtitle">Save big on your next purchase with this special coupon</p>
  </td></tr>
  <tr><td align="center" style="padding: 0 20px 28px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="560" class="cs-card" style="width: 560px; border-collapse: collapse;">
      <tr>
        ${opts.showImage !== false ? `<td class="cs-img" width="200" valign="middle" align="center" style="width: 200px; height: 200px; background-image: url('${_cimg}'); background-size: cover; background-position: center; text-align: center;" data-color="cpn1ImgBg">
          ${opts.showImgText !== false ? `<p mc:edit="cpn1_imgLabel" style="margin: 0 0 6px 0; font-size: 11px; font-weight: 400; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; text-align: center;">LIMITED TIME OFFER</p>
          <p mc:edit="cpn1_imgTitle" style="margin: 0; font-size: 48px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.1; color: #ffffff; text-align: center;">$50 OFF</p>` : ''}
        </td>` : ''}
        <td class="cs-text" width="${opts.showImage !== false ? '360' : '560'}" valign="top" style="width: ${opts.showImage !== false ? 360 : 560}px; background-color: #ffffff;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; border-collapse: collapse;">
            <tr><td align="left" class="cs-text-cell" style="padding: 20px 20px 16px 20px; background-color: #ffffff;">
              <p mc:edit="cpn1_headline" style="margin: 0; font-size: 11px; font-weight: 400; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase;" data-color="cpn1Headline">GET $50.00 OFF YOUR NEXT FULL PRICE PURCHASE!</p>
            </td></tr>
            <tr><td style="padding: 0 20px; background-color: #ffffff;"><div style="border-bottom: 2px dashed #d0d0d0;"></div></td></tr>
            <tr><td align="left" class="cs-text-cell" style="padding: 16px 20px ${opts.showCta !== false ? '6px' : '20px'} 20px; background-color: #ffffff;">
              <p mc:edit="cpn1_amount" style="margin: 0 0 4px 0; font-size: 28px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.15;" data-color="cpn1Amount">$50.00</p>
              ${opts.showValidity !== false ? `<p mc:edit="cpn1_validity" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="cpn1Validity">Valid through 2026/7/31</p>` : ''}
            </td></tr>
            ${opts.showCta !== false ? `<tr><td align="right" class="cs-cta-cell" style="padding: 8px 20px 20px 20px; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" align="right" class="cs-cta-table">
                <tr><td align="center" style="padding: 10px 20px;" data-color="cpn1CtaBg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="cpn1_cta" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 13px; font-weight: bold; text-decoration: none; white-space: nowrap; color: #ffffff;">Save Pass</a>
                </td></tr>
              </table>
            </td></tr>` : ''}
          </table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`; },
    colorMap: [
      { label: 'Outer BG', key: 'cpn1OuterBg', type: 'bg', default: '#f5f7fa' },
      { label: 'Eyebrow', key: 'cpn1Eyebrow', type: 'color', default: '#006eff', optionGate: 'showEyebrow' },
      { label: 'Title', key: 'cpn1Title', type: 'color', default: '#07071a' },
      { label: 'Subtitle', key: 'cpn1Subtitle', type: 'color', default: '#666666' },
      { label: 'Image BG', key: 'cpn1ImgBg', type: 'bg', default: '#0059ff', optionGate: 'showImage' },
      { label: 'Headline', key: 'cpn1Headline', type: 'color', default: '#1a1a2e' },
      { label: 'Amount', key: 'cpn1Amount', type: 'color', default: '#07071a' },
      { label: 'Validity', key: 'cpn1Validity', type: 'color', default: '#888888', optionGate: 'showValidity' },
      { label: 'CTA BG', key: 'cpn1CtaBg', type: 'bg', default: '#0059ff', optionGate: 'showCta' }
    ]
  },

  // ─── 16 Coupon v2 ───
  {
    id: 'coupon-v2',
    num: '20',
    name: 'Coupon — Dual',
    optionMap: [
      { key: 'showImage', label: 'Image', default: true },
      { key: 'pattern', label: 'Pattern', type: 'select', default: '1', optionGate: 'showImage', choices: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' }
      ]},
      { key: 'showImgText', label: 'Image Text', default: true, optionGate: 'showImage' },
      { key: 'showEyebrow', label: 'Eyebrow', default: true },
      { key: 'showValidity', label: 'Valid Date', default: true },
      { key: 'showCta', label: 'CTA Button', default: true }
    ],
    getHtml: (opts = {}) => { const _cpat = { '1': 'https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773778546/pattern-1_size1_br97mt.png', '2': 'https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773778546/pattern-2_size1_phrcnp.png', '3': 'https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773778547/pattern-3_size1_nkmwch.png' }; const _cimg = _cpat[opts.pattern] || _cpat['1']; return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="cd-outer" style="width: 600px;" data-color="coupon2OuterBg">
  ${opts.showEyebrow !== false ? `<tr><td align="center" style="padding: 28px 20px 4px 20px;">
    <p mc:edit="coupon_eyebrow" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 3px; text-transform: uppercase;" data-color="coupon2Eyebrow">Limited Time Offer</p>
  </td></tr>` : ''}
  <tr><td align="center" style="padding: ${opts.showEyebrow !== false ? '0' : '28px'} 20px 6px 20px;">
    <h2 mc:edit="coupon_title" style="margin: 0; font-size: 24px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="coupon2Title">Exclusive Savings Await</h2>
  </td></tr>
  <tr><td align="center" style="padding: 0 20px 20px 20px;">
    <p mc:edit="coupon_subtitle" style="margin: 0; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="coupon2Subtitle">Save big on your next purchase with these special coupons</p>
  </td></tr>
  <tr><td align="center" style="padding: 0 20px 28px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="560" class="cd-grid" style="width: 560px;">
      <tr>
        <!-- Card 1 -->
        <td class="cd-col" width="269" valign="top" align="center" style="width: 269px; vertical-align: top;">
          <table border="0" cellpadding="0" cellspacing="0" width="269" class="cd-card" style="width: 269px; border-collapse: collapse;">
            <tr><td align="center" valign="middle" class="cd-card-img" height="202" style="height: 202px;${opts.showImage !== false ? ` background-image: url('${_cimg}'); background-size: cover; background-position: center;` : ''}" data-color="coupon2Card1ImgBg">
              ${opts.showImgText !== false ? `<p mc:edit="coupon1_imgLabel" style="margin: 0 0 6px 0; font-size: 11px; font-weight: 400; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">LIMITED TIME OFFER</p>
              <p mc:edit="coupon1_imgTitle" style="margin: 0; font-size: 48px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.1; color: #ffffff;">$50 OFF</p>` : ''}
            </td></tr>
            <tr><td align="center" style="padding: 20px 20px 16px 20px; background-color: #ffffff;">
              <p mc:edit="coupon1_headline" style="margin: 0; font-size: 11px; font-weight: 400; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase;" data-color="coupon2Headline">GET $50.00 OFF YOUR NEXT FULL PRICE PURCHASE!</p>
            </td></tr>
            <tr><td style="padding: 0; height: 24px; font-size: 0; line-height: 0; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td width="14" style="width: 14px; height: 24px; border-radius: 0 14px 14px 0;" data-color="coupon2OuterBg"></td>
                  <td style="border-bottom: 2px dashed #d0d0d0;"></td>
                  <td width="14" style="width: 14px; height: 24px; border-radius: 14px 0 0 14px;" data-color="coupon2OuterBg"></td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding: 16px 20px ${opts.showCta !== false ? '6px' : '20px'} 20px; background-color: #ffffff;">
              <p mc:edit="coupon1_amount" style="margin: 0 0 4px 0; font-size: 28px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.15;" data-color="coupon2Amount">$50.00</p>
              ${opts.showValidity !== false ? `<p mc:edit="coupon1_validity" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="coupon2Validity">Valid through 2026/7/31</p>` : ''}
            </td></tr>
            ${opts.showCta !== false ? `<tr><td align="right" style="padding: 8px 20px 20px 20px; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" align="right">
                <tr><td align="center" style="padding: 10px 20px;" data-color="coupon2CtaBg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="coupon1_cta" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 13px; font-weight: bold; text-decoration: none; white-space: nowrap; color: #ffffff;">Save Pass</a>
                </td></tr>
              </table>
            </td></tr>` : ''}
          </table>
        </td>
        <td class="cd-gap" width="22" style="width: 22px;">&nbsp;</td>
        <!-- Card 2 -->
        <td class="cd-col" width="269" valign="top" align="center" style="width: 269px; vertical-align: top;">
          <table border="0" cellpadding="0" cellspacing="0" width="269" class="cd-card" style="width: 269px; border-collapse: collapse;">
            <tr><td align="center" valign="middle" class="cd-card-img" height="202" style="height: 202px;${opts.showImage !== false ? ` background-image: url('${_cimg}'); background-size: cover; background-position: center;` : ''}" data-color="coupon2Card2ImgBg">
              ${opts.showImgText !== false ? `<p mc:edit="coupon2_imgLabel" style="margin: 0 0 6px 0; font-size: 11px; font-weight: 400; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase; color: #ffffff;">SPECIAL DEAL</p>
              <p mc:edit="coupon2_imgTitle" style="margin: 0; font-size: 48px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.1; color: #ffffff;">$30 OFF</p>` : ''}
            </td></tr>
            <tr><td align="center" style="padding: 20px 20px 16px 20px; background-color: #ffffff;">
              <p mc:edit="coupon2_headline" style="margin: 0; font-size: 11px; font-weight: 400; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase;" data-color="coupon2Headline">GET $30.00 OFF YOUR NEXT FULL PRICE PURCHASE!</p>
            </td></tr>
            <tr><td style="padding: 0; height: 24px; font-size: 0; line-height: 0; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td width="14" style="width: 14px; height: 24px; border-radius: 0 14px 14px 0;" data-color="coupon2OuterBg"></td>
                  <td style="border-bottom: 2px dashed #d0d0d0;"></td>
                  <td width="14" style="width: 14px; height: 24px; border-radius: 14px 0 0 14px;" data-color="coupon2OuterBg"></td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding: 16px 20px ${opts.showCta !== false ? '6px' : '20px'} 20px; background-color: #ffffff;">
              <p mc:edit="coupon2_amount" style="margin: 0 0 4px 0; font-size: 28px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.15;" data-color="coupon2Amount">$30.00</p>
              ${opts.showValidity !== false ? `<p mc:edit="coupon2_validity" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="coupon2Validity">Valid through 2026/7/31</p>` : ''}
            </td></tr>
            ${opts.showCta !== false ? `<tr><td align="right" style="padding: 8px 20px 20px 20px; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" align="right">
                <tr><td align="center" style="padding: 10px 20px;" data-color="coupon2CtaBg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="coupon2_cta" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 13px; font-weight: bold; text-decoration: none; white-space: nowrap; color: #ffffff;">Save Pass</a>
                </td></tr>
              </table>
            </td></tr>` : ''}
          </table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`; },
    colorMap: [
      { label: 'Outer BG', key: 'coupon2OuterBg', type: 'bg', default: '#f5f7fa' },
      { label: 'Eyebrow', key: 'coupon2Eyebrow', type: 'color', default: '#006eff', optionGate: 'showEyebrow' },
      { label: 'Title', key: 'coupon2Title', type: 'color', default: '#07071a' },
      { label: 'Subtitle', key: 'coupon2Subtitle', type: 'color', default: '#666666' },
      { label: 'Card 1 Image BG', key: 'coupon2Card1ImgBg', type: 'bg', default: '#0059ff', optionGate: 'showImage' },
      { label: 'Card 2 Image BG', key: 'coupon2Card2ImgBg', type: 'bg', default: '#0059ff', optionGate: 'showImage' },
      { label: 'Headline', key: 'coupon2Headline', type: 'color', default: '#1a1a2e' },
      { label: 'Amount', key: 'coupon2Amount', type: 'color', default: '#07071a' },
      { label: 'Validity', key: 'coupon2Validity', type: 'color', default: '#888888', optionGate: 'showValidity' },
      { label: 'CTA BG', key: 'coupon2CtaBg', type: 'bg', default: '#0059ff', optionGate: 'showCta' }
    ]
  },

  // ─── 18 Promo Code Dual ───
  {
    id: 'promo-code-dual',
    num: '22',
    name: 'Promo Code — Dual',
    optionMap: [
      { key: 'showEyebrow', label: 'Eyebrow', default: true }
    ],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="product-grid" style="width: 600px;" data-color="promo2OuterBg">
  ${opts.showEyebrow !== false ? `<tr><td align="center" style="padding: 28px 20px 16px 20px;">
    <p mc:edit="promo_eyebrow" style="margin: 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase;" data-color="promo2Eyebrow">Exclusive Promo Codes</p>
  </td></tr>` : ''}
  <tr><td align="center" style="padding: 0 20px 28px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="560" class="product-grid" style="width: 560px;">
      <tr>
        <td class="col-2" width="269" valign="top" align="left" style="width: 269px; vertical-align: top;" data-border-color="promo2Color1Border">
          <table border="0" cellpadding="0" cellspacing="0" width="267" class="product-grid promo-card" style="width: 267px; border-collapse: collapse;">
            <tr><td align="center" style="padding: 10px 16px;" data-color="promo2Color1Bg">
              <p mc:edit="promo1_tag" style="margin: 0; font-size: 10px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; color: #ffffff;">New Customer Offer</p>
            </td></tr>
            <tr><td align="center" style="padding: 16px;" data-color="promo2Color1BodyBg">
              <p mc:edit="promo1_headline" style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; color: #ffffff;">Save <span data-color="promo2Color1Text">$50</span> on First Order</p>
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr><td align="center" style="padding: 6px 14px;" data-border-color="promo2Color1Border">
                  <span mc:edit="promo1_code" style="font-size: 18px; font-weight: bold; font-family: 'Courier New', Courier, monospace; letter-spacing: 4px;" data-color="promo2Color1Text">NEW50</span>
                </td></tr>
              </table>
            </td></tr>
            <tr><td align="center" style="padding: 12px 16px;">
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr><td align="center" style="padding: 8px 20px;" data-color="promo2Color1Bg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="promo1_cta" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 12px; font-weight: bold; text-decoration: none; color: #ffffff;">Shop Now</a>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td>
        <td class="col-gap" width="22" style="width: 22px;">&nbsp;</td>
        <td class="col-2" width="269" valign="top" align="left" style="width: 269px; vertical-align: top;" data-border-color="promo2Color2Border">
          <table border="0" cellpadding="0" cellspacing="0" width="267" class="product-grid promo-card" style="width: 267px; border-collapse: collapse;">
            <tr><td align="center" style="padding: 10px 16px;" data-color="promo2Color2Bg">
              <p mc:edit="promo2_tag" style="margin: 0; font-size: 10px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; color: #ffffff;">Returning Member Deal</p>
            </td></tr>
            <tr><td align="center" style="padding: 16px;" data-color="promo2Color2BodyBg">
              <p mc:edit="promo2_headline" style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; color: #ffffff;">Save <span data-color="promo2Color2Text">$30</span> on Next Order</p>
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr><td align="center" style="padding: 6px 14px;" data-border-color="promo2Color2Border">
                  <span mc:edit="promo2_code" style="font-size: 18px; font-weight: bold; font-family: 'Courier New', Courier, monospace; letter-spacing: 4px;" data-color="promo2Color2Text">BACK30</span>
                </td></tr>
              </table>
            </td></tr>
            <tr><td align="center" style="padding: 12px 16px;">
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr><td align="center" style="padding: 8px 20px;" data-color="promo2Color2Bg">
                  <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="promo2_cta" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 12px; font-weight: bold; text-decoration: none; color: #ffffff;">Shop Now</a>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`,
    colorMap: [
      { label: 'Outer BG', key: 'promo2OuterBg', type: 'bg', default: '#07071a' },
      { label: 'Eyebrow', key: 'promo2Eyebrow', type: 'color', default: '#888888', optionGate: 'showEyebrow' },
      { label: 'Card 1 Accent', key: 'promo2Color1Bg', type: 'bg', default: '#0059ff', linked: ['promo2Color1Text','promo2Color1Border'], linkedAlpha: { 'promo2Color1BodyBg': 0.2 } },
      { key: 'promo2Color1Text', type: 'color', default: '#0059ff', hidden: true },
      { key: 'promo2Color1Border', type: 'border', default: '#0059ff', hidden: true },
      { key: 'promo2Color1BodyBg', type: 'bg', default: 'rgba(0,89,255,0.2)', hidden: true },
      { label: 'Card 2 Accent', key: 'promo2Color2Bg', type: 'bg', default: '#00aaff', linked: ['promo2Color2Text','promo2Color2Border'], linkedAlpha: { 'promo2Color2BodyBg': 0.2 } },
      { key: 'promo2Color2Text', type: 'color', default: '#00aaff', hidden: true },
      { key: 'promo2Color2Border', type: 'border', default: '#00aaff', hidden: true },
      { key: 'promo2Color2BodyBg', type: 'bg', default: 'rgba(0,170,255,0.2)', hidden: true }
    ]
  },

  // ─── 19 Service Benefits ───
  {
    id: 'service-benefits',
    num: '18',
    name: 'Icon Grid — 4-Col',
    optionMap: [{ key: 'showDesc', label: 'Description', default: true }],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="split-table"
       style="width: 600px;" data-color="svcBg">
  <tr><td align="center" style="padding: 28px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="560" class="service-grid" style="width: 560px;">
      <tr>
        <td class="col-service" width="140" align="center" valign="top" style="width: 140px; padding: 0 8px; text-align: center; vertical-align: top;">
          <p style="margin: 0 0 8px 0; font-size: 0; line-height: 0;"><img mc:edit="svc1_icon" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="40" height="40" alt="Multiple Payment" data-crop="1:1" style="display: block; margin: 0 auto; width: 40px; height: 40px;" /></p>
          <p mc:edit="svc1_title" style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; text-align: center;" data-color="svcTitle">Multiple Payment</p>
          ${opts.showDesc !== false ? `<p mc:edit="svc1_desc" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; text-align: center;" data-color="svcDesc">Flexible options<br/>for every buyer</p>` : ''}
        </td>
        <td class="col-service" width="140" align="center" valign="top" style="width: 140px; padding: 0 8px; text-align: center; vertical-align: top;">
          <p style="margin: 0 0 8px 0; font-size: 0; line-height: 0;"><img mc:edit="svc2_icon" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="40" height="40" alt="Dispatch in 24 Hrs" data-crop="1:1" style="display: block; margin: 0 auto; width: 40px; height: 40px;" /></p>
          <p mc:edit="svc2_title" style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; text-align: center;" data-color="svcTitle">Dispatch in 24 Hrs</p>
          ${opts.showDesc !== false ? `<p mc:edit="svc2_desc" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; text-align: center;" data-color="svcDesc">Fast fulfilment<br/>on all orders</p>` : ''}
        </td>
        <td class="col-service" width="140" align="center" valign="top" style="width: 140px; padding: 0 8px; text-align: center; vertical-align: top;">
          <p style="margin: 0 0 8px 0; font-size: 0; line-height: 0;"><img mc:edit="svc3_icon" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="40" height="40" alt="Cross-Border" data-crop="1:1" style="display: block; margin: 0 auto; width: 40px; height: 40px;" /></p>
          <p mc:edit="svc3_title" style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; text-align: center;" data-color="svcTitle">Cross-Border</p>
          ${opts.showDesc !== false ? `<p mc:edit="svc3_desc" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; text-align: center;" data-color="svcDesc">Shipping to<br/>global destinations</p>` : ''}
        </td>
        <td class="col-service" width="140" align="center" valign="top" style="width: 140px; padding: 0 8px; text-align: center; vertical-align: top;">
          <p style="margin: 0 0 8px 0; font-size: 0; line-height: 0;"><img mc:edit="svc4_icon" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="40" height="40" alt="24/7 Support" data-crop="1:1" style="display: block; margin: 0 auto; width: 40px; height: 40px;" /></p>
          <p mc:edit="svc4_title" style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; text-align: center;" data-color="svcTitle">24/7 Online Support</p>
          ${opts.showDesc !== false ? `<p mc:edit="svc4_desc" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; text-align: center;" data-color="svcDesc">Always here<br/>when you need us</p>` : ''}
        </td>
      </tr>
    </table>
  </td></tr>
</table>`,
    colorMap: [
      { label: 'Background', key: 'svcBg', type: 'bg', default: '#ffffff' },
      { label: 'Title', key: 'svcTitle', type: 'color', default: '#1a1a2e' },
      { label: 'Description', key: 'svcDesc', type: 'color', default: '#888888', optionGate: 'showDesc' }
    ]
  },

  // ─── 20 Other Activities ───
  {
    id: 'other-activities',
    num: '10',
    name: 'Card Grid — 3-Col',
    optionMap: [
      { key: 'showEyebrow', label: 'Eyebrow + Headline', default: true },
      { key: 'showCta', label: 'CTA Buttons', default: true },
      { key: 'imgRatio', label: 'Image Ratio', type: 'select', default: 'free', choices: [
        { label: '16:9', value: '16:9' }, { label: '1:1', value: '1:1' }, { label: 'Free', value: 'free' }
      ]}
    ],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="width: 600px;">
  <tr>
    <td width="600" align="center" valign="top" style="width: 600px; padding: 36px 20px;" data-color="actBg">
      ${opts.showEyebrow !== false ? `<table border="0" cellpadding="0" cellspacing="0" width="560" class="split-table" style="width: 560px;">
        <tr><td align="center" style="width: 560px; padding: 0 0 24px 0;" width="560">
          <p mc:edit="other_eyebrow" style="margin: 0 0 4px 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;" data-color="actEyebrow">More Promotions</p>
          <p mc:edit="other_headline" style="margin: 0; font-size: 22px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="actHeadline">Other Activities</p>
        </td></tr>
      </table>` : ''}
      <table border="0" cellpadding="0" cellspacing="0" width="560" class="activity-grid" style="width: 560px;">
        <tr valign="top">
          <td align="left" valign="top" class="col-3" style="width: 180px; padding: 0 4px 0 0;" width="180">
            <table border="0" cellpadding="0" cellspacing="0" width="176" class="activity-card" style="width: 176px; border: 1px solid #e0e6f0;" data-color="actCardBg">
              <tr><td align="center" class="card-img" style="width: 176px; padding: 0; font-size: 0; line-height: 0;" width="176">
                <img mc:edit="activity1_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/%E6%88%AA%E5%9C%96+2026-03-05+%E4%B8%8A%E5%8D%8811.52.32+1.png" width="174" alt="Campaign" class="mobile-img" data-crop="${opts.imgRatio || 'free'}" style="display: block; width: 174px; height: auto;" />
              </td></tr>
              <tr><td align="left" class="card-body" style="width: 176px; padding: 16px 16px 14px 16px;" width="176">
                <p mc:edit="activity1_label" style="margin: 0 0 5px 0; font-size: 10px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1; letter-spacing: 2px; text-transform: uppercase;" data-color="actLabel">Campaign</p>
                <p mc:edit="activity1_title" style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actTitle">Edge AI System</p>
                <p mc:edit="activity1_desc" style="margin: 0 0 14px 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actDesc">Get <strong>10% off</strong> on selected Edge AI Systems. Accelerate your AI at the edge deployment today.</p>
                ${opts.showCta !== false ? `<table border="0" cellpadding="0" cellspacing="0">
                  <tr><td style="padding: 8px 16px;" data-color="actCtaBg">
                    <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="activity1_cta" style="font-size: 11px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actCtaText">Shop Now &rarr;</a>
                  </td></tr>
                </table>` : ''}
              </td></tr>
            </table>
          </td>
          <td class="col-gap" style="width: 10px;" width="10"></td>
          <td align="left" valign="top" class="col-3" style="width: 180px; padding: 0 2px;" width="180">
            <table border="0" cellpadding="0" cellspacing="0" width="176" class="activity-card" style="width: 176px; border: 1px solid #e0e6f0;" data-color="actCardBg">
              <tr><td align="center" class="card-img" style="width: 176px; padding: 0; font-size: 0; line-height: 0;" width="176">
                <img mc:edit="activity2_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/%E6%88%AA%E5%9C%96+2026-03-05+%E4%B8%8A%E5%8D%8811.53.07+1.png" width="174" alt="Cyber Sale" class="mobile-img" data-crop="${opts.imgRatio || 'free'}" style="display: block; width: 174px; height: auto;" />
              </td></tr>
              <tr><td align="left" class="card-body" style="width: 176px; padding: 16px 16px 14px 16px;" width="176">
                <p mc:edit="activity2_label" style="margin: 0 0 5px 0; font-size: 10px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1; letter-spacing: 2px; text-transform: uppercase;" data-color="actLabel">Limited Time</p>
                <p mc:edit="activity2_title" style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actTitle">Cyber Sale</p>
                <p mc:edit="activity2_desc" style="margin: 0 0 14px 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actDesc">Exclusive online deals on IoT gateways, sensors &amp; networking gear. Limited stock &mdash; don't miss out.</p>
                ${opts.showCta !== false ? `<table border="0" cellpadding="0" cellspacing="0">
                  <tr><td style="padding: 8px 16px;" data-color="actCtaBg">
                    <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="activity2_cta" style="font-size: 11px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actCtaText">Shop Now &rarr;</a>
                  </td></tr>
                </table>` : ''}
              </td></tr>
            </table>
          </td>
          <td class="col-gap" style="width: 10px;" width="10"></td>
          <td align="left" valign="top" class="col-3" style="width: 180px; padding: 0 0 0 4px;" width="180">
            <table border="0" cellpadding="0" cellspacing="0" width="176" class="activity-card" style="width: 176px; border: 1px solid #e0e6f0;" data-color="actCardBg">
              <tr><td align="center" class="card-img" style="width: 176px; padding: 0; font-size: 0; line-height: 0;" width="176">
                <img mc:edit="activity3_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/%E6%88%AA%E5%9C%96+2026-03-05+%E4%B8%8A%E5%8D%8811.57.47+1.png" width="174" alt="AMAX Series" class="mobile-img" data-crop="${opts.imgRatio || 'free'}" style="display: block; width: 174px; height: auto;" />
              </td></tr>
              <tr><td align="left" class="card-body" style="width: 176px; padding: 16px 16px 14px 16px;" width="176">
                <p mc:edit="activity3_label" style="margin: 0 0 5px 0; font-size: 10px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1; letter-spacing: 2px; text-transform: uppercase;" data-color="actLabel">New Series</p>
                <p mc:edit="activity3_title" style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actTitle">AMAX Series</p>
                <p mc:edit="activity3_desc" style="margin: 0 0 14px 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actDesc">High-performance IIoT computing platforms built for demanding industrial environments.</p>
                ${opts.showCta !== false ? `<table border="0" cellpadding="0" cellspacing="0">
                  <tr><td style="padding: 8px 16px;" data-color="actCtaBg">
                    <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="activity3_cta" style="font-size: 11px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="actCtaText">Learn More &rarr;</a>
                  </td></tr>
                </table>` : ''}
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
    colorMap: [
      { label: 'Section BG', key: 'actBg', type: 'bg', default: '#f5f7fa' },
      { label: 'Eyebrow', key: 'actEyebrow', type: 'color', default: '#0059ff', optionGate: 'showEyebrow' },
      { label: 'Headline', key: 'actHeadline', type: 'color', default: '#07071a', optionGate: 'showEyebrow' },
      { label: 'Card BG', key: 'actCardBg', type: 'bg', default: '#ffffff' },
      { label: 'Card Label', key: 'actLabel', type: 'color', default: '#0059ff' },
      { label: 'Card Title', key: 'actTitle', type: 'color', default: '#07071a' },
      { label: 'Card Desc', key: 'actDesc', type: 'color', default: '#666666' },
      { label: 'CTA BG', key: 'actCtaBg', type: 'bg', default: '#0059ff', optionGate: 'showCta' },
      { label: 'CTA Text', key: 'actCtaText', type: 'color', default: '#ffffff', optionGate: 'showCta' }
    ]
  },

  // ─── 24 Footer ───
  {
    id: 'footer',
    num: '27',
    name: 'Footer',
    optionMap: [
      { key: 'showSocial', label: 'Social Icons', default: true },
      { key: 'socialCount', label: 'Social Count', type: 'select', default: '3', optionGate: 'showSocial', choices: [
        { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' }
      ]},
      { key: 'showLegalLinks', label: 'Legal Links', default: true }
    ],
    getHtml: (opts = {}) => {
      const socialCount = parseInt(opts.socialCount) || 3;
      const socialIcons = [
        { name: 'Facebook', url: 'https://www.facebook.com/Advantech.Corp', img: 'https://irp.cdn-website.com/56869327/dms3rep/multi/social+media-fb.png' },
        { name: 'YouTube', url: 'https://www.youtube.com/@AdvantechCorp', img: 'https://irp.cdn-website.com/56869327/dms3rep/multi/social+media-youtube.png' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/company/advantech/', img: 'https://irp.cdn-website.com/56869327/dms3rep/multi/social+media-linkdin.png' },
        { name: 'X', url: 'https://x.com/Aboredtech', img: 'https://irp.cdn-website.com/56869327/dms3rep/multi/social+media-x.png' },
        { name: 'Instagram', url: 'https://www.instagram.com/advantech_corp/', img: 'https://irp.cdn-website.com/56869327/dms3rep/multi/social+media-ig.png' }
      ];
      let socialHtml = '';
      for (let i = 0; i < socialCount; i++) {
        const s = socialIcons[i];
        socialHtml += `<td style="padding: 0 5px;"><a mc:edit="footer_social${i+1}_link" href="${s.url}" style="text-decoration: none;"><img mc:edit="footer_social${i+1}_img" src="${s.img}" width="24" height="24" alt="${s.name}" data-crop="free" style="display: block; width: 24px; height: 24px;" /></a></td>`;
      }
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="split-table"
       style="width: 600px;" data-color="footerBg">
  <tr><td align="center" style="padding: 24px 30px 14px 30px;">
    <img src="https://irp.cdn-website.com/56869327/dms3rep/multi/ADVANTECH+IoTMart+LOGO.png" width="160" alt="Advantech IoTMart" style="display: block; margin: 0 auto; width: 160px; max-width: 160px; height: auto;" />
  </td></tr>
  ${opts.showSocial !== false ? `<tr><td align="center" style="padding: 0 30px 14px 30px;">
    <table border="0" cellpadding="0" cellspacing="0" align="center">
      <tr>${socialHtml}</tr>
    </table>
  </td></tr>` : ''}
  <tr><td align="center" style="padding: 0 30px;">
    <table border="0" cellpadding="0" cellspacing="0" width="540" class="split-table" style="width: 540px;">
      <tr><td height="14" style="height: 14px; font-size: 14px; line-height: 14px;">&nbsp;</td></tr>
      <tr><td height="1" style="height: 1px; font-size: 1px; line-height: 1px;" data-color="footerDivider">&nbsp;</td></tr>
      <tr><td height="14" style="height: 14px; font-size: 14px; line-height: 14px;">&nbsp;</td></tr>
    </table>
  </td></tr>
  <tr><td align="center" style="padding: 0 30px 6px 30px;">
    <p mc:edit="footer_email" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;">
      <a href="mailto:Service.iotmart@advantech.com" style="text-decoration: none;" data-color="footerLink">Service.iotmart@advantech.com</a>
    </p>
  </td></tr>
  ${opts.showLegalLinks !== false ? `<tr><td align="center" style="padding: 4px 30px 8px 30px;">
    <p mc:edit="footer_legal_links" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;">
      <a href="https://www.advantech.com/en/legal/privacy" style="text-decoration: none;" data-color="footerLink">Privacy Policy</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <a href="https://www.iotmart.com/en-en/s/terms-conditions?language=en_US" style="text-decoration: none;" data-color="footerLink">Terms &amp; Conditions</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <a href="https://www.iotmart.com/en-en/s/faq?language=en_US" style="text-decoration: none;" data-color="footerLink">Shopping FAQ</a>
    </p>
  </td></tr>` : ''}
  <tr><td align="center" style="padding: 4px 30px 24px 30px;">
    <p mc:edit="footer_copyright" style="margin: 0; font-size: 10px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1;" data-color="footerCopyright">Copyright &copy; 1983 - 2025 Advantech Co., Ltd.<br/>All Rights Reserved</p>
  </td></tr>
</table>`;
    },
    colorMap: [
      { label: 'Background', key: 'footerBg', type: 'bg', default: '#f0f0f0' },
      { label: 'Divider', key: 'footerDivider', type: 'bg', default: '#dddddd' },
      { label: 'Link Color', key: 'footerLink', type: 'color', default: '#888888' },
      { label: 'Copyright', key: 'footerCopyright', type: 'color', default: '#aaaaaa' }
    ]
  },

  // ─── 13 Three Col Image Text ───
  {
    id: 'three-col-image-text',
    num: '14',
    name: 'Feature Grid — 3-Col',
    optionMap: [
      { key: 'imgRatio', label: 'Image Ratio', type: 'select', default: 'free', choices: [{label: '1:1', value: '1:1'}, {label: '16:9', value: '16:9'}, {label: 'Free', value: 'free'}] },
      { key: 'showBadges', label: 'Badges', default: true },
      { key: 'showDesc', label: 'Description', default: true }
    ],
    getHtml: (opts = {}) => {
      const cropRatio = opts.imgRatio || 'free';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
       style="width: 600px;" data-color="col3Bg">
  <tr><td align="center" style="padding: 32px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="560" class="three-col" style="width: 560px;">
      <tr>
        <td class="col-3" width="173" valign="top" align="center" style="width: 173px; vertical-align: top;">
          <img mc:edit="col1_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/membership-004.png" width="160" alt="Free Shipping" class="col-img" data-crop="${cropRatio}" style="display: block; width: 160px; height: auto; margin: 0 auto;" />
          ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top: 10px;">
            <tr>
              <td data-color="col3BadgeBg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;">
                <span mc:edit="col1_badge" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="col3BadgeText">NEW</span>
              </td>
            </tr>
          </table>` : ''}
          <p mc:edit="col1_title" style="margin: ${opts.showBadges !== false ? '6px' : '12px'} 0 4px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col3Title">Free Shipping</p>
          ${opts.showDesc !== false ? `<p mc:edit="col1_desc" style="margin: 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col3Desc">Short description text goes here.</p>` : ''}
        </td>
        <td class="col-gap-3" width="20" style="width: 20px;">&nbsp;</td>
        <td class="col-3" width="174" valign="top" align="center" style="width: 174px; vertical-align: top;">
          <img mc:edit="col2_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/membership-011.png" width="160" alt="Sale" class="col-img" data-crop="${cropRatio}" style="display: block; width: 160px; height: auto; margin: 0 auto;" />
          ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top: 10px;">
            <tr>
              <td data-color="col3BadgeBg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;">
                <span mc:edit="col2_badge" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="col3BadgeText">SALE</span>
              </td>
            </tr>
          </table>` : ''}
          <p mc:edit="col2_title" style="margin: ${opts.showBadges !== false ? '6px' : '12px'} 0 4px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col3Title">Sale</p>
          ${opts.showDesc !== false ? `<p mc:edit="col2_desc" style="margin: 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col3Desc">Short description text goes here.</p>` : ''}
        </td>
        <td class="col-gap-3" width="20" style="width: 20px;">&nbsp;</td>
        <td class="col-3" width="173" valign="top" align="center" style="width: 173px; vertical-align: top;">
          <img mc:edit="col3_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/membership-010.png" width="160" alt="ePoints" class="col-img" data-crop="${cropRatio}" style="display: block; width: 160px; height: auto; margin: 0 auto;" />
          ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top: 10px;">
            <tr>
              <td data-color="col3BadgeBg" style="padding: 3px 8px; mso-line-height-rule: exactly; line-height: 1.3;">
                <span mc:edit="col3_badge" style="font-size: 10px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 1px;" data-color="col3BadgeText">HOT</span>
              </td>
            </tr>
          </table>` : ''}
          <p mc:edit="col3_title" style="margin: ${opts.showBadges !== false ? '6px' : '12px'} 0 4px 0; font-size: 14px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col3Title">ePoints</p>
          ${opts.showDesc !== false ? `<p mc:edit="col3_desc" style="margin: 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col3Desc">Short description text goes here.</p>` : ''}
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;
    },
    colorMap: [
      { label: 'Background', key: 'col3Bg', type: 'bg', default: '#ffffff' },
      { label: 'Badge BG', key: 'col3BadgeBg', type: 'bg', default: '#F39800', optionGate: 'showBadges' },
      { label: 'Badge Text', key: 'col3BadgeText', type: 'color', default: '#ffffff', optionGate: 'showBadges' },
      { label: 'Title', key: 'col3Title', type: 'color', default: '#07071a' },
      { label: 'Description', key: 'col3Desc', type: 'color', default: '#666666', optionGate: 'showDesc' }
    ]
  },

  // ─── 21 Single Button Bar ───
  {
    id: 'single-button-bar',
    num: '23',
    name: 'Button Bar — Single',
    getHtml: () => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
       style="width: 600px;" data-color="singleBtnBg">
  <tr><td align="center" style="padding: 24px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" align="center">
      <tr>
        <td align="center" style="padding: 12px 36px;" data-color="singleBtnCtaBg">
          <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="single_btn_cta" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 14px; font-weight: bold; text-decoration: none;" data-color="singleBtnCtaText">Button Text &rarr;</a>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`,
    colorMap: [
      { label: 'Section BG', key: 'singleBtnBg', type: 'bg', default: '#ffffff' },
      { label: 'Button BG', key: 'singleBtnCtaBg', type: 'bg', default: '#0059ff' },
      { label: 'Button Text', key: 'singleBtnCtaText', type: 'color', default: '#ffffff' }
    ]
  },

  // ─── 22 Dual Button Bar ───
  {
    id: 'dual-button-bar',
    num: '24',
    name: 'Button Bar — Dual',
    optionMap: [{ key: 'buttonCount', label: 'Buttons', type: 'select', default: '2', choices: [{label: '1', value: '1'}, {label: '2', value: '2'}] }],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
       style="width: 600px;" data-color="dualBtnBg">
  <tr><td align="center" style="padding: 24px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" align="center">
      <tr>
        <td class="btn-col" align="center" valign="middle">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 12px 32px;" data-color="dualBtn1Bg">
                <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="dual_btn1_cta" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 14px; font-weight: bold; text-decoration: none;" data-color="dualBtn1Text"><span data-color="dualBtn1Text">Primary &rarr;</span></a>
              </td>
            </tr>
          </table>
        </td>
        ${opts.buttonCount !== '1' ? `<td class="btn-gap" width="16" style="width: 16px;">&nbsp;</td>
        <td class="btn-col" align="center" valign="middle">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 10px 30px;" data-border-color="dualBtn2Border" data-color="dualBtn2Bg">
                <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="dual_btn2_cta" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 14px; font-weight: bold; text-decoration: none;" data-color="dualBtn2Text"><span data-color="dualBtn2Text">Secondary &rarr;</span></a>
              </td>
            </tr>
          </table>
        </td>` : ''}
      </tr>
    </table>
  </td></tr>
</table>`,
    colorMap: [
      { label: 'Section BG', key: 'dualBtnBg', type: 'bg', default: '#ffffff' },
      { label: 'Primary Btn BG', key: 'dualBtn1Bg', type: 'bg', default: '#0059ff' },
      { label: 'Primary Btn Text', key: 'dualBtn1Text', type: 'color', default: '#ffffff' },
      { label: 'Secondary Btn BG', key: 'dualBtn2Bg', type: 'bg', default: '#ffffff' },
      { label: 'Secondary Btn Border', key: 'dualBtn2Border', type: 'border', default: '#0059ff' },
      { label: 'Secondary Btn Text', key: 'dualBtn2Text', type: 'color', default: '#0059ff' }
    ]
  },

  // ─── 14 Four Col Image Text ───
  {
    id: 'four-col-image-text',
    num: '15',
    name: 'Feature Grid — 4-Col',
    optionMap: [
      { key: 'imgRatio', label: 'Image Ratio', type: 'select', default: 'free', choices: [{label: '1:1', value: '1:1'}, {label: '16:9', value: '16:9'}, {label: 'Free', value: 'free'}] },
      { key: 'showBadges', label: 'Badges', default: true },
      { key: 'showDesc', label: 'Description', default: true }
    ],
    getHtml: (opts = {}) => {
      const cropRatio = opts.imgRatio || 'free';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
       style="width: 600px;" data-color="col4Bg">
  <tr><td align="center" style="padding: 32px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="560" class="four-col" style="width: 560px;">
      <tr>
        <td class="col-4" width="128" valign="top" align="center" style="width: 128px; vertical-align: top;">
          <img mc:edit="col1_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/membership-004.png" width="120" alt="Free Shipping" class="col4-img" data-crop="${cropRatio}" style="display: block; width: 120px; height: auto; margin: 0 auto;" />
          ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top: 8px;">
            <tr>
              <td data-color="col4BadgeBg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;">
                <span mc:edit="col1_badge" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 0.5px;" data-color="col4BadgeText">NEW</span>
              </td>
            </tr>
          </table>` : ''}
          <p mc:edit="col1_title" style="margin: ${opts.showBadges !== false ? '5px' : '10px'} 0 4px 0; font-size: 13px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col4Title">Free Shipping</p>
          ${opts.showDesc !== false ? `<p mc:edit="col1_desc" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col4Desc">Description text here.</p>` : ''}
        </td>
        <td class="col-gap-4" width="12" style="width: 12px;">&nbsp;</td>
        <td class="col-4" width="128" valign="top" align="center" style="width: 128px; vertical-align: top;">
          <img mc:edit="col2_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/membership-011.png" width="120" alt="Sale" class="col4-img" data-crop="${cropRatio}" style="display: block; width: 120px; height: auto; margin: 0 auto;" />
          ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top: 8px;">
            <tr>
              <td data-color="col4BadgeBg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;">
                <span mc:edit="col2_badge" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 0.5px;" data-color="col4BadgeText">SALE</span>
              </td>
            </tr>
          </table>` : ''}
          <p mc:edit="col2_title" style="margin: ${opts.showBadges !== false ? '5px' : '10px'} 0 4px 0; font-size: 13px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col4Title">Sale</p>
          ${opts.showDesc !== false ? `<p mc:edit="col2_desc" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col4Desc">Description text here.</p>` : ''}
        </td>
        <td class="col-gap-4" width="12" style="width: 12px;">&nbsp;</td>
        <td class="col-4" width="128" valign="top" align="center" style="width: 128px; vertical-align: top;">
          <img mc:edit="col3_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/membership-010.png" width="120" alt="ePoints" class="col4-img" data-crop="${cropRatio}" style="display: block; width: 120px; height: auto; margin: 0 auto;" />
          ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top: 8px;">
            <tr>
              <td data-color="col4BadgeBg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;">
                <span mc:edit="col3_badge" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 0.5px;" data-color="col4BadgeText">HOT</span>
              </td>
            </tr>
          </table>` : ''}
          <p mc:edit="col3_title" style="margin: ${opts.showBadges !== false ? '5px' : '10px'} 0 4px 0; font-size: 13px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col4Title">ePoints</p>
          ${opts.showDesc !== false ? `<p mc:edit="col3_desc" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col4Desc">Description text here.</p>` : ''}
        </td>
        <td class="col-gap-4" width="12" style="width: 12px;">&nbsp;</td>
        <td class="col-4" width="128" valign="top" align="center" style="width: 128px; vertical-align: top;">
          <img mc:edit="col4_image" src="https://irp.cdn-website.com/56869327/dms3rep/multi/membership-009.png" width="120" alt="Add to Cart" class="col4-img" data-crop="${cropRatio}" style="display: block; width: 120px; height: auto; margin: 0 auto;" />
          ${opts.showBadges !== false ? `<table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top: 8px;">
            <tr>
              <td data-color="col4BadgeBg" style="padding: 3px 6px; mso-line-height-rule: exactly; line-height: 1.3;">
                <span mc:edit="col4_badge" style="font-size: 9px; mso-line-height-rule: exactly; line-height: 1; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; font-weight: bold; letter-spacing: 0.5px;" data-color="col4BadgeText">TOP</span>
              </td>
            </tr>
          </table>` : ''}
          <p mc:edit="col4_title" style="margin: ${opts.showBadges !== false ? '5px' : '10px'} 0 4px 0; font-size: 13px; font-weight: bold; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col4Title">Add to Cart</p>
          ${opts.showDesc !== false ? `<p mc:edit="col4_desc" style="margin: 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="col4Desc">Description text here.</p>` : ''}
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;
    },
    colorMap: [
      { label: 'Background', key: 'col4Bg', type: 'bg', default: '#ffffff' },
      { label: 'Badge BG', key: 'col4BadgeBg', type: 'bg', default: '#F39800', optionGate: 'showBadges' },
      { label: 'Badge Text', key: 'col4BadgeText', type: 'color', default: '#ffffff', optionGate: 'showBadges' },
      { label: 'Title', key: 'col4Title', type: 'color', default: '#07071a' },
      { label: 'Description', key: 'col4Desc', type: 'color', default: '#666666', optionGate: 'showDesc' }
    ]
  },

  // ─── 23 Three Button Bar ───
  {
    id: 'three-button-bar',
    num: '25',
    name: 'Button Bar — Triple',
    optionMap: [{ key: 'buttonCount', label: 'Buttons', type: 'select', default: '3', choices: [{label: '2', value: '2'}, {label: '3', value: '3'}] }],
    getHtml: (opts = {}) => `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container"
       style="width: 600px;" data-color="btn3Bg">
  <tr><td align="center" style="padding: 24px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" align="center">
      <tr>
        <td class="btn3-col" align="center" valign="middle">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding: 10px 28px;" data-color="btn3CtaBg">
              <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="btn3_cta1" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 13px; font-weight: bold; text-decoration: none;" data-color="btn3CtaText"><span data-color="btn3CtaText">Button One</span></a>
            </td></tr>
          </table>
        </td>
        <td class="btn3-gap" width="12" style="width: 12px;">&nbsp;</td>
        <td class="btn3-col" align="center" valign="middle">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding: 10px 28px;" data-color="btn3CtaBg">
              <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="btn3_cta2" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 13px; font-weight: bold; text-decoration: none;" data-color="btn3CtaText"><span data-color="btn3CtaText">Button Two</span></a>
            </td></tr>
          </table>
        </td>
        ${opts.buttonCount !== '2' ? `<td class="btn3-gap" width="12" style="width: 12px;">&nbsp;</td>
        <td class="btn3-col" align="center" valign="middle">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding: 10px 28px;" data-color="btn3CtaBg">
              <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="btn3_cta3" style="font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3; font-size: 13px; font-weight: bold; text-decoration: none;" data-color="btn3CtaText"><span data-color="btn3CtaText">Button Three</span></a>
            </td></tr>
          </table>
        </td>` : ''}
      </tr>
    </table>
  </td></tr>
</table>`,
    colorMap: [
      { label: 'Section BG', key: 'btn3Bg', type: 'bg', default: '#ffffff' },
      { label: 'Button BG', key: 'btn3CtaBg', type: 'bg', default: '#0059ff' },
      { label: 'Button Text', key: 'btn3CtaText', type: 'color', default: '#ffffff' }
    ]
  },

  // ─── 08 Product Spotlight ───
  {
    id: 'product-spotlight',
    num: '08',
    name: 'Article — Spotlight',
    optionMap: [
      { key: 'showImage', label: 'Image', default: false },
      { key: 'showCta', label: 'CTA Button', default: false },
      { key: 'bodyFontSize', label: 'Body Text Size', type: 'select', default: '14', choices: [
        { label: 'S', value: '12' }, { label: 'M', value: '14' }, { label: 'L', value: '16' }
      ]}
    ],
    getHtml: (opts = {}) => {
      const bodyFontSize = opts.bodyFontSize || '14';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="split-table" style="width: 600px;">
  <tr valign="top">
    <td width="150" align="left" valign="top" class="spot-label-td"
        style="width: 150px; padding: 28px 20px 28px 24px;" data-color="spotBg">
      <p mc:edit="spot_eyebrow"
         style="margin: 0 0 10px 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 3px; text-transform: uppercase; font-weight: 700;" data-color="spotEyebrow">
        Spotlight
      </p>
      <h2 mc:edit="spot_title"
          style="margin: 0; font-size: 22px; font-weight: 900; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="spotTitle">
        Featured Product Pick
      </h2>
    </td>
    <td width="450" align="left" valign="top" class="spot-body-td"
        style="width: 450px; padding: 28px 24px${(opts.showCta || opts.showImage) ? ' 20px' : ' 28px'} 24px; border-left: 1px solid #eeeeee;" data-color="spotBodyBg">
      <p mc:edit="spot_body"
         style="margin: 0${(opts.showImage || opts.showCta) ? ' 0 16px 0' : ''}; font-size: ${bodyFontSize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3;" data-color="spotBody">
        Discover our top pick this season &#8212; the <strong style="font-weight: 700;">ADAM-6700 Series Intelligent I/O Gateway</strong>. Designed for smart factory and edge computing applications, it features built-in Node-RED for rapid logic deployment, OPC UA &amp; MQTT support, and a rugged industrial-grade enclosure.<br><br>
        Ideal for production line monitoring, energy management, and predictive maintenance. With IoTMart&#8217;s global fast delivery, you can get started in days, not weeks.
      </p>
      ${opts.showImage ? `<img mc:edit="spot_image" src="https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773640818/Top_News-BG_fzfwht.png" width="402" height="80" alt="Product Image" class="spot-img" data-crop="402:80"
           style="display: block; width: 402px; height: 80px; max-width: 100%; object-fit: cover;${opts.showCta ? ' margin-bottom: 16px;' : ''}" />` : ''}
      ${opts.showCta ? `<table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 10px 24px;" data-color="spotCtaBg">
            <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="spot_cta"
               style="font-size: 13px; font-weight: bold; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="spotCtaText">
              View Product &rarr;
            </a>
          </td>
        </tr>
      </table>` : ''}
    </td>
  </tr>
</table>`;
    },
    colorMap: [
      { label: 'Label Area BG', key: 'spotBg', type: 'bg', default: '#0c0c0c' },
      { label: 'Eyebrow', key: 'spotEyebrow', type: 'color', default: '#0059ff' },
      { label: 'Title', key: 'spotTitle', type: 'color', default: '#ffffff' },
      { label: 'Body Area BG', key: 'spotBodyBg', type: 'bg', default: '#ffffff' },
      { label: 'Body Text', key: 'spotBody', type: 'color', default: '#434447' },
      { label: 'CTA BG', key: 'spotCtaBg', type: 'bg', default: '#0059ff', optionGate: 'showCta' },
      { label: 'CTA Text', key: 'spotCtaText', type: 'color', default: '#ffffff', optionGate: 'showCta' }
    ]
  },

  // ─── 09 Product Cards ───
  {
    id: 'product-cards',
    num: '09',
    name: 'Card Grid — 2-Col',
    optionMap: [
      { key: 'imgRatio', label: 'Image Ratio', type: 'select', default: '16:9', choices: [{label: '1:1', value: '1:1'}, {label: '16:9', value: '16:9'}] },
      { key: 'showImages', label: 'Images', default: false },
      { key: 'showCta', label: 'CTA Button', default: false }
    ],
    getHtml: (opts = {}) => {
      const cropRatio = opts.imgRatio || '16:9';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="cards-table" style="width: 600px; border-collapse: collapse; border-spacing: 0;">
  <tr>
    <td align="center" valign="top" class="pcards-outer-td" bgcolor="#e8ecef"
        style="padding: 28px;" data-color="pcardsBg">
      <p mc:edit="pcards_eyebrow" align="center"
         style="margin: 0 0 20px 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; text-align: center;" data-color="pcardsEyebrow">
        PRODUCT PICKS
      </p>
      <table border="0" cellpadding="0" cellspacing="0" width="544" class="pcards-grid" style="width: 544px;">
        <tr valign="top">
          <td width="262" valign="top" class="pcard-col-td" bgcolor="#ffffff"
              style="width: 262px;" data-color="pcardsCardBg">
            <table border="0" cellpadding="0" cellspacing="0" width="262" style="width: 262px;">
              <tr>
                <td style="padding: 18px 18px 14px 0;">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr valign="top">
                      <td width="6" bgcolor="#0059ff" data-color="pcardsAccent"
                          style="width: 6px; font-size: 0; line-height: 0;"></td>
                      <td style="padding: 2px 0 2px 10px;">
                        <h3 mc:edit="pcard1_title"
                            style="margin: 0; font-size: 18px; font-weight: 900; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="pcardsTitle">
                          ADAM-6700 Series
                        </h3>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ${opts.showImages ? `<tr><td align="center" style="padding: 0 18px 14px 18px; font-size: 0; line-height: 0; overflow: hidden;"><img mc:edit="pcard1_image"
                   src="https://res.cloudinary.com/dhj1ztoeu/image/upload/f_auto,q_auto/v1773385887/eDM/assets/hv6vwlzex66kdhlolq0o.jpg"
                   width="226" height="136" alt="Product 1" class="pcard-img" data-crop="${cropRatio}"
                   style="display: block; width: 226px; height: 136px; max-width: 100%; object-fit: cover;" /></td></tr>` : ''}
              <tr><td style="padding: 0 18px 14px 18px;">
                <p mc:edit="pcard1_body"
                   style="margin: 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="pcardsBody">
                  Intelligent I/O gateway with built-in Node-RED for rapid edge logic deployment and OPC UA / MQTT connectivity.
                </p>
              </td></tr>
              ${opts.showCta ? `<tr><td style="padding: 0 18px 18px 18px;">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 7px 18px;" data-color="pcardsCtaBg">
                      <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="pcard1_cta"
                         style="font-size: 12px; font-weight: 700; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="pcardsCtaText">
                        Shop Now &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td></tr>` : ''}
            </table>
          </td>
          <td width="20" class="pcard-gap-td" style="width: 20px; font-size: 0; line-height: 0;"></td>
          <td width="262" valign="top" class="pcard-col-td" bgcolor="#ffffff"
              style="width: 262px;" data-color="pcardsCardBg">
            <table border="0" cellpadding="0" cellspacing="0" width="262" style="width: 262px;">
              <tr>
                <td style="padding: 18px 18px 14px 0;">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr valign="top">
                      <td width="6" bgcolor="#0059ff" data-color="pcardsAccent"
                          style="width: 6px; font-size: 0; line-height: 0;"></td>
                      <td style="padding: 2px 0 2px 10px;">
                        <h3 mc:edit="pcard2_title"
                            style="margin: 0; font-size: 18px; font-weight: 900; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="pcardsTitle">
                          EKI-6333AC Series
                        </h3>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ${opts.showImages ? `<tr><td align="center" style="padding: 0 18px 14px 18px; font-size: 0; line-height: 0; overflow: hidden;"><img mc:edit="pcard2_image"
                   src="https://res.cloudinary.com/dhj1ztoeu/image/upload/f_auto,q_auto/v1773385887/eDM/assets/hv6vwlzex66kdhlolq0o.jpg"
                   width="226" height="136" alt="Product 2" class="pcard-img" data-crop="${cropRatio}"
                   style="display: block; width: 226px; height: 136px; max-width: 100%; object-fit: cover;" /></td></tr>` : ''}
              <tr><td style="padding: 0 18px 14px 18px;">
                <p mc:edit="pcard2_body"
                   style="margin: 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="pcardsBody">
                  Industrial-grade Wi-Fi access point with seamless roaming, ideal for AGV and mobile robot applications in smart warehouses.
                </p>
              </td></tr>
              ${opts.showCta ? `<tr><td style="padding: 0 18px 18px 18px;">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 7px 18px;" data-color="pcardsCtaBg">
                      <a href="https://www.iotmart.com/s/?language=en_US" mc:edit="pcard2_cta"
                         style="font-size: 12px; font-weight: 700; text-decoration: none; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="pcardsCtaText">
                        Shop Now &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td></tr>` : ''}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
    },
    colorMap: [
      { label: 'Section BG',  key: 'pcardsBg',       type: 'bg',    default: '#e8ecef' },
      { label: 'Eyebrow',     key: 'pcardsEyebrow',  type: 'color', default: '#0059ff' },
      { label: 'Card BG',     key: 'pcardsCardBg',   type: 'bg',    default: '#ffffff' },
      { label: 'Accent Bar',  key: 'pcardsAccent',   type: 'bg',    default: '#0059ff' },
      { label: 'Card Title',  key: 'pcardsTitle',    type: 'color', default: '#0c0c0c' },
      { label: 'Card Body',   key: 'pcardsBody',     type: 'color', default: '#434447' },
      { label: 'CTA BG',      key: 'pcardsCtaBg',    type: 'bg',    default: '#0059ff', optionGate: 'showCta' },
      { label: 'CTA Text',    key: 'pcardsCtaText',  type: 'color', default: '#ffffff', optionGate: 'showCta' }
    ]
  },

  // ─── 10 Product Showcase ───
  {
    id: 'product-showcase',
    num: '11',
    name: 'Article — Stats',
    optionMap: [
      { key: 'specCount', label: 'Spec Count', type: 'select', default: '3', choices: [
        { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' }
      ]},
      { key: 'bodyFontSize', label: 'Body Text Size', type: 'select', default: '13', choices: [
        { label: 'S', value: '12' }, { label: 'M', value: '14' }, { label: 'L', value: '16' }
      ]}
    ],
    getHtml: (opts = {}) => {
      var count = parseInt(opts.specCount) || 3;
      if (count < 3) count = 3;
      if (count > 5) count = 5;
      const bodyFontSize = opts.bodyFontSize || '13';
      var defaultSpecs = [
        { num: '50+', label: 'Products Available' },
        { num: '24hr', label: 'Fast Shipping' },
        { num: '99.9%', label: 'Uptime SLA' },
        { num: '3yr', label: 'Standard Warranty' },
        { num: '150+', label: 'Global Partners' }
      ];
      var specsHtml = '';
      for (var i = 0; i < count; i++) {
        var s = defaultSpecs[i];
        var isLast = (i === count - 1);
        specsHtml += '<p mc:edit="showcase_num' + (i+1) + '"\n               style="margin: 0 0 6px 0; font-size: 24px; font-weight: 300; font-family: Arial, \'Malgun Gothic\', \'Apple SD Gothic Neo\', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="showcaseNumber">\n              ' + s.num + '\n            </p>\n';
        specsHtml += '<p mc:edit="showcase_label' + (i+1) + '"\n               style="margin: 0' + (isLast ? '' : ' 0 20px 0') + '; font-size: 11px; font-family: Arial, \'Malgun Gothic\', \'Apple SD Gothic Neo\', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="showcaseSpecLabel">\n              ' + s.label + '\n            </p>\n';
      }
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="split-table" style="width: 600px;">
  <tr>
    <td align="center" valign="top" class="showcase-outer-td" bgcolor="#f6f7f9"
        style="background-image: url('https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773367982/BIBG_fxzalt.png'); background-size: cover; background-position: center top; padding: 28px 24px;" data-color="showcaseOuterBg">
      <table border="0" cellpadding="0" cellspacing="0" width="552" class="showcase-inner" style="width: 552px;">
        <tr valign="top">
          <td width="170" align="left" valign="top" class="showcase-specs-td" bgcolor="#0059ff"
              style="width: 170px; padding: 28px 20px;" data-color="showcaseSpecsBg">
            ${specsHtml}
          </td>
          <td width="382" align="left" valign="top" class="showcase-body-td" bgcolor="#ffffff"
              style="width: 382px; padding: 22px 20px;" data-color="showcaseBodyBg">
            <p mc:edit="showcase_eyebrow"
               style="margin: 0 0 10px 0; font-size: 11px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 3px; text-transform: uppercase; font-weight: 700;" data-color="showcaseEyebrow">
              PRODUCT CATALOG
            </p>
            <h2 mc:edit="showcase_title"
                style="margin: 0 0 10px 0; font-size: 22px; font-weight: 900; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="showcaseTitle">
              Industrial IoT Solutions:<br/>Edge-to-Cloud Ready Hardware
            </h2>
            <p mc:edit="showcase_body"
               style="margin: 0; font-size: ${bodyFontSize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.3;" data-color="showcaseBody">
              Explore our curated catalog of industrial-grade IoT hardware. From intelligent gateways and edge AI platforms to wireless connectivity modules, every product is selected for reliability, interoperability, and rapid deployment.<br><br>
              <strong style="font-weight: 700;">Why choose IoTMart?</strong><br>
              &bull;&nbsp;<strong style="font-weight: 700;">Direct Shipping:</strong> Factory-to-door delivery across 40+ countries with real-time tracking.<br>
              &bull;&nbsp;<strong style="font-weight: 700;">Verified Compatibility:</strong> All products tested for cross-platform integration with major cloud and SCADA systems.<br>
              &bull;&nbsp;<strong style="font-weight: 700;">Volume Discounts:</strong> Tiered pricing for bulk orders &#8212; request a quote for 10+ units.<br><br>
              Browse by category or search by model number on IoTMart to find the right solution for your next project.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
    },
    colorMap: [
      { label: 'Outer BG', key: 'showcaseOuterBg', type: 'bg', default: '#f6f7f9' },
      { label: 'Specs BG', key: 'showcaseSpecsBg', type: 'bg', default: 'rgba(0,89,255,0.85)' },
      { label: 'Number', key: 'showcaseNumber', type: 'color', default: '#ffffff' },
      { label: 'Spec Label', key: 'showcaseSpecLabel', type: 'color', default: '#c5daff' },
      { label: 'Body Area BG', key: 'showcaseBodyBg', type: 'bg', default: 'rgba(255,255,255,0.85)' },
      { label: 'Eyebrow', key: 'showcaseEyebrow', type: 'color', default: '#0059ff' },
      { label: 'Title', key: 'showcaseTitle', type: 'color', default: '#0c0c0c' },
      { label: 'Body Text', key: 'showcaseBody', type: 'color', default: '#434447' }
    ]
  },

  // ─── 25 Survey ───
  {
    id: 'survey',
    num: '26',
    name: 'Survey',
    isSurvey: true,
    optionMap: [],
    getHtml: (opts = {}) => {
      const qCount = parseInt(opts.questionCount) || 3;
      const edmTitle = opts.edmTitle || 'Share Your Feedback';
      const eyebrowText = opts.eyebrowText || 'Help Us Serve You Better';
      const cloudPageUrl = opts.cloudPageUrl || '#';
      const submitText = opts.submitText || 'Submit';

      // Build question blocks for non-Outlook (each Q in white card)
      let questionBlocks = '';
      for (let i = 1; i <= qCount; i++) {
        const qLabel = opts['q' + i + 'Label'] || 'Question ' + i;
        const qType = opts['q' + i + 'Type'] || 'radio';
        const qOpts = opts['q' + i + 'Options'] || '';
        const optArr = qOpts ? qOpts.split('|||').map(s => s.trim()).filter(Boolean) : [];
        let fieldHtml = '';

        if (qType === 'radio' && optArr.length) {
          optArr.forEach((opt, idx) => {
            fieldHtml += `<tr><td style="padding: 6px 0;"><label style="font-size: 13px; color: #07071a; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; cursor: pointer; display: block;"><input type="radio" name="q${i}" value="${opt.replace(/"/g, '&quot;')}" style="margin-right: 10px; accent-color: #0059ff; vertical-align: middle;" />${opt}</label></td></tr>`;
          });
        } else if (qType === 'checkbox' && optArr.length) {
          optArr.forEach((opt, idx) => {
            fieldHtml += `<tr><td style="padding: 6px 0;"><label style="font-size: 13px; color: #07071a; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; cursor: pointer; display: block;"><input type="checkbox" name="q${i}_${idx + 1}" value="${opt.replace(/"/g, '&quot;')}" style="margin-right: 10px; accent-color: #0059ff; vertical-align: middle;" />${opt}</label></td></tr>`;
          });
        } else if (qType === 'dropdown' && optArr.length) {
          let selectOptions = '';
          optArr.forEach(opt => {
            selectOptions += `<option value="${opt.replace(/"/g, '&quot;')}">${opt}</option>`;
          });
          fieldHtml += `<tr><td style="padding: 4px 0;"><select name="q${i}" style="width: 100%; padding: 10px 12px; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; border: 1px solid #d0d5dd; border-radius: 0; background: #fff; color: #07071a; box-sizing: border-box;"><option value="">Select...</option>${selectOptions}</select></td></tr>`;
        } else if (qType === 'text') {
          const phText = opts['q' + i + 'Placeholder'] || 'Type your answer...';
          fieldHtml += `<tr><td style="padding: 4px 0;"><input type="text" name="q${i}" placeholder="${phText.replace(/"/g, '&quot;')}" style="width: 100%; padding: 12px 14px; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; border: 1px solid #d0d5dd; border-radius: 0; background: #fff; color: #07071a; box-sizing: border-box;" /></td></tr>`;
        } else if (qType === 'textarea') {
          const phArea = opts['q' + i + 'Placeholder'] || 'Type your answer...';
          fieldHtml += `<tr><td style="padding: 4px 0;"><textarea name="q${i}" placeholder="${phArea.replace(/"/g, '&quot;')}" rows="3" style="width: 100%; padding: 12px 14px; font-size: 13px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; border: 1px solid #d0d5dd; border-radius: 0; background: #fff; color: #07071a; box-sizing: border-box; resize: vertical;"></textarea></td></tr>`;
        } else if (qType === 'star') {
          fieldHtml += `<tr><td style="padding: 8px 0;"><table border="0" cellpadding="0" cellspacing="0"><tr>`;
          for (let s = 1; s <= 5; s++) {
            fieldHtml += `<td style="padding: 0 2px;"><input type="radio" name="q${i}" value="${s}" id="q${i}_star${s}" class="star-input" /><label for="q${i}_star${s}" class="star-label"><img src="https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773830223/star_24dp_E3E3E3_FILL1_wght200_GRAD0_opsz24_wz6mjl.svg" width="28" height="28" style="display: block;" alt="★" /></label></td>`;
          }
          fieldHtml += '</tr></table></td></tr>';
        }

        questionBlocks += `
      <table border="0" cellpadding="0" cellspacing="0" width="600" class="survey-outer" style="width: 600px; max-width: 600px;" data-color="surveyOuterBg">
        <tr><td align="center" style="padding: ${i === 1 ? '24px' : '0'} 20px 12px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="560" class="survey-card" style="width: 560px; max-width: 560px; background-color: #ffffff;" data-color="surveyCardBg">
            <tr><td align="left" style="padding: 20px 24px;">
              <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; color: #07071a;" data-color="surveyQuestion">Q${i}. ${qLabel}</p>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">${fieldHtml}</table>
            </td></tr>
          </table>
        </td></tr>
      </table>`;
      }

      return `<style type="text/css">
  .star-input { position: absolute; opacity: 0; width: 0; height: 0; }
  .star-label { cursor: pointer; display: inline-block; }
  .star-input:checked + .star-label img { filter: brightness(0) saturate(100%) invert(79%) sepia(65%) saturate(1000%) hue-rotate(359deg) brightness(103%) contrast(104%); }
  @media only screen and (max-width: 480px) {
    .survey-outer { width: 100% !important; }
    .survey-card { width: 100% !important; max-width: 100% !important; }
    td.survey-pad { padding-left: 16px !important; padding-right: 16px !important; }
  }
</style>
<!--[if mso]>
<table border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px; background-color:#f5f7fa;" data-color="surveyOuterBg">
  <tr><td align="center" style="padding: 28px 20px 16px 20px;">
    <p style="margin: 0 0 6px 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase; color:#0059ff;" data-color="surveyEyebrow">${eyebrowText}</p>
    <p style="margin: 0; font-size: 22px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2; color:#07071a;" data-color="surveyTitle">${edmTitle}</p>
  </td></tr>
  <tr><td align="center" style="padding: 16px 20px 28px 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="560" align="center" style="width:560px; background-color:#ffffff;" data-color="surveyCardBg">
      <tr><td align="center" style="padding: 28px;">
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
          href="${cloudPageUrl}" style="height:44px;v-text-anchor:middle;width:140px;" arcsize="0%" strokecolor="#0059ff" fillcolor="#0059ff">
          <w:anchorlock/>
          <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${submitText} &rarr;</center>
        </v:roundrect>
      </td></tr>
    </table>
  </td></tr>
</table>
<![endif]-->
<!--[if !mso]><!-->
<form method="POST" action="${cloudPageUrl}" style="margin:0;padding:0;">
<input type="hidden" name="submitted" value="1" />

<table border="0" cellpadding="0" cellspacing="0" width="600" class="survey-outer" style="width: 600px; max-width: 600px;" data-color="surveyOuterBg">
  <tr><td align="center" style="padding: 28px 20px 16px 20px;" class="survey-pad">
    <p style="margin: 0 0 6px 0; font-size: 12px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase;" data-color="surveyEyebrow">${eyebrowText}</p>
    <p style="margin: 0; font-size: 22px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.2;" data-color="surveyTitle">${edmTitle}</p>
  </td></tr>
</table>
${questionBlocks}
<table border="0" cellpadding="0" cellspacing="0" width="600" class="survey-outer" style="width: 600px; max-width: 600px;" data-color="surveyOuterBg">
  <tr><td align="center" style="padding: 16px 20px 28px 20px;">
    <button type="submit" style="padding: 12px 40px; background-color: #0059ff; color: #ffffff; font-size: 14px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4; border: none; cursor: pointer;">${submitText} →</button>
  </td></tr>
</table>
</form>
<table border="0" cellpadding="0" cellspacing="0" width="600" class="survey-outer" style="width: 600px; max-width: 600px; border-top: 1px solid #e0e6f0;" data-color="surveyOuterBg">
  <tr><td align="center" style="padding: 12px 20px;">
    <p style="margin: 0; font-size: 12px; color: #999999; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;">Can't submit? <a href="${cloudPageUrl}" style="color: #0059ff; text-decoration: underline;">Click here</a></p>
  </td></tr>
</table>
<!--<![endif]-->`;
    },
    colorMap: [
      { label: 'Outer BG', key: 'surveyOuterBg', type: 'bg', default: '#f5f7fa' },
      { label: 'Eyebrow', key: 'surveyEyebrow', type: 'color', default: '#0059ff' },
      { label: 'Title', key: 'surveyTitle', type: 'color', default: '#07071a' },
      { label: 'Card BG', key: 'surveyCardBg', type: 'bg', default: '#ffffff' },
      { label: 'Question', key: 'surveyQuestion', type: 'color', default: '#07071a' }
    ]
  },

  // ─── 26 2x2 Image Text Grid ───
  {
    id: 'grid-2x2-image-text',
    num: '16',
    name: 'Icon Grid — 2×2',
    optionMap: [
      { key: 'showDesc', label: 'Description', default: true },
      { key: 'titleFontSize', label: 'Title Font Size', type: 'select', default: '14', choices: [{label: 'S', value: '12'}, {label: 'M', value: '14'}, {label: 'L', value: '16'}] },
      { key: 'bodyFontSize', label: 'Body Font Size', type: 'select', default: '12', choices: [{label: 'S', value: '8'}, {label: 'M', value: '10'}, {label: 'L', value: '12'}], optionGate: 'showDesc' }
    ],
    getHtml: (opts = {}) => {
      const titleSize = opts.titleFontSize || '14';
      const bodySize = opts.bodyFontSize || '12';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="width: 600px;">
  <tr><td align="center" style="padding: 16px 20px;" data-color="grid2x2Bg">
    <table border="0" cellpadding="0" cellspacing="0" width="560" class="grid-2x2" style="width: 560px;">
      <!-- Row 1 -->
      <tr>
        <td class="grid-cell" width="270" valign="middle" style="width: 270px; padding: 12px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="64" align="center" valign="middle" style="width: 64px;">
                <img mc:edit="grid2x2_img1" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="64" alt="Icon 1" data-crop="1:1" style="display: block; width: 64px; height: 64px;" />
              </td>
              <td align="left" valign="middle" style="padding-left: 12px;">
                <p mc:edit="grid2x2_item1_title" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid2x2ItemTitle">Feature One</p>
                ${opts.showDesc !== false ? `<p mc:edit="grid2x2_item1_desc" style="margin: 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid2x2ItemDesc">Brief description of this feature.</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
        <td width="20" style="width: 20px;">&nbsp;</td>
        <td class="grid-cell" width="270" valign="middle" style="width: 270px; padding: 12px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="64" align="center" valign="middle" style="width: 64px;">
                <img mc:edit="grid2x2_img2" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="64" alt="Icon 2" data-crop="1:1" style="display: block; width: 64px; height: 64px;" />
              </td>
              <td align="left" valign="middle" style="padding-left: 12px;">
                <p mc:edit="grid2x2_item2_title" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid2x2ItemTitle">Feature Two</p>
                ${opts.showDesc !== false ? `<p mc:edit="grid2x2_item2_desc" style="margin: 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid2x2ItemDesc">Brief description of this feature.</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Row 2 -->
      <tr>
        <td class="grid-cell" width="270" valign="middle" style="width: 270px; padding: 12px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="64" align="center" valign="middle" style="width: 64px;">
                <img mc:edit="grid2x2_img3" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="64" alt="Icon 3" data-crop="1:1" style="display: block; width: 64px; height: 64px;" />
              </td>
              <td align="left" valign="middle" style="padding-left: 12px;">
                <p mc:edit="grid2x2_item3_title" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid2x2ItemTitle">Feature Three</p>
                ${opts.showDesc !== false ? `<p mc:edit="grid2x2_item3_desc" style="margin: 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid2x2ItemDesc">Brief description of this feature.</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
        <td width="20" style="width: 20px;">&nbsp;</td>
        <td class="grid-cell" width="270" valign="middle" style="width: 270px; padding: 12px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="64" align="center" valign="middle" style="width: 64px;">
                <img mc:edit="grid2x2_img4" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="64" alt="Icon 4" data-crop="1:1" style="display: block; width: 64px; height: 64px;" />
              </td>
              <td align="left" valign="middle" style="padding-left: 12px;">
                <p mc:edit="grid2x2_item4_title" style="margin: 0 0 4px 0; font-size: ${titleSize}px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid2x2ItemTitle">Feature Four</p>
                ${opts.showDesc !== false ? `<p mc:edit="grid2x2_item4_desc" style="margin: 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid2x2ItemDesc">Brief description of this feature.</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;
    },
    colorMap: [
      { label: 'Background', key: 'grid2x2Bg', type: 'bg', default: '#ffffff' },
      { label: 'Item Title', key: 'grid2x2ItemTitle', type: 'color', default: '#1a1a2e' },
      { label: 'Description', key: 'grid2x2ItemDesc', type: 'color', default: '#666666', optionGate: 'showDesc' }
    ]
  },

  // ─── 27 3-Col Image Text Grid ───
  {
    id: 'grid-3col-image-text',
    num: '17',
    name: 'Icon Grid — 3-Col',
    optionMap: [
      { key: 'showDesc', label: 'Description', default: true },
      { key: 'titleFontSize', label: 'Title Font Size', type: 'select', default: '13', choices: [{label: 'S', value: '12'}, {label: 'M', value: '13'}, {label: 'L', value: '16'}] },
      { key: 'bodyFontSize', label: 'Body Font Size', type: 'select', default: '10', choices: [{label: 'S', value: '8'}, {label: 'M', value: '10'}, {label: 'L', value: '12'}], optionGate: 'showDesc' }
    ],
    getHtml: (opts = {}) => {
      const vAlign = opts.showDesc !== false ? 'top' : 'middle';
      const iconPadding = opts.showDesc !== false ? 'padding-top: 2px;' : '';
      const titleMargin = opts.showDesc !== false ? 'margin: 0 0 4px 0;' : 'margin: 0;';
      const titleSize = opts.titleFontSize || '13';
      const bodySize = opts.bodyFontSize || '10';
      return `<table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="width: 600px;">
  <tr><td align="center" style="padding: 20px;" data-color="grid3colBg">
    <table border="0" cellpadding="0" cellspacing="0" width="560" class="grid-3col" style="width: 560px;">
      <tr valign="${vAlign}">
        <td class="col-3" width="173" valign="${vAlign}" style="width: 173px; padding: 0 5px 0 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="48" align="center" valign="${vAlign}" style="width: 48px; ${iconPadding}">
                <img mc:edit="grid3col_img1" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="48" height="48" alt="Icon 1" data-crop="1:1" style="display: block; width: 48px; height: 48px;" />
              </td>
              <td align="left" valign="${vAlign}" style="padding-left: 10px;">
                <p mc:edit="grid3col_item1_title" style="${titleMargin} font-size: ${titleSize}px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid3colItemTitle">Feature One</p>
                ${opts.showDesc !== false ? `<p mc:edit="grid3col_item1_desc" style="margin: 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid3colItemDesc">Brief description here.</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
        <td class="col-gap" width="20" style="width: 20px;">&nbsp;</td>
        <td class="col-3" width="173" valign="${vAlign}" style="width: 173px; padding: 0 5px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="48" align="center" valign="${vAlign}" style="width: 48px; ${iconPadding}">
                <img mc:edit="grid3col_img2" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="48" height="48" alt="Icon 2" data-crop="1:1" style="display: block; width: 48px; height: 48px;" />
              </td>
              <td align="left" valign="${vAlign}" style="padding-left: 10px;">
                <p mc:edit="grid3col_item2_title" style="${titleMargin} font-size: ${titleSize}px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid3colItemTitle">Feature Two</p>
                ${opts.showDesc !== false ? `<p mc:edit="grid3col_item2_desc" style="margin: 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid3colItemDesc">Brief description here.</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
        <td class="col-gap" width="20" style="width: 20px;">&nbsp;</td>
        <td class="col-3" width="173" valign="${vAlign}" style="width: 173px; padding: 0 0 0 5px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="48" align="center" valign="${vAlign}" style="width: 48px; ${iconPadding}">
                <img mc:edit="grid3col_img3" src="https://irp.cdn-website.com/56869327/dms3rep/multi/remote-io-icon1-1.png" width="48" height="48" alt="Icon 3" data-crop="1:1" style="display: block; width: 48px; height: 48px;" />
              </td>
              <td align="left" valign="${vAlign}" style="padding-left: 10px;">
                <p mc:edit="grid3col_item3_title" style="${titleMargin} font-size: ${titleSize}px; font-weight: 700; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid3colItemTitle">Feature Three</p>
                ${opts.showDesc !== false ? `<p mc:edit="grid3col_item3_desc" style="margin: 0; font-size: ${bodySize}px; font-family: Arial, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; mso-line-height-rule: exactly; line-height: 1.4;" data-color="grid3colItemDesc">Brief description here.</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;
    },
    colorMap: [
      { label: 'Background', key: 'grid3colBg', type: 'bg', default: '#ffffff' },
      { label: 'Item Title', key: 'grid3colItemTitle', type: 'color', default: '#1a1a2e' },
      { label: 'Description', key: 'grid3colItemDesc', type: 'color', default: '#666666', optionGate: 'showDesc' }
    ]
  }
];

// Sort components by display order
COMPONENTS.sort((a, b) => a.num.localeCompare(b.num));

// ══════════════════════════════════════
var currentBuilderTheme = 'light-blue';

var THEMES = {
  'light-blue': {
    name: 'Blue',
    swatches: ['#ffffff', '#0059ff', '#07071a', '#1a1a2e'],
    overrides: null  // null = use component defaults
  },
  'light-orange': {
    name: 'Orange',
    swatches: ['#ffffff', '#f39800', '#07071a', '#1a1a2e'],
    overrides: {
      // Banner v1
      bannerBg: '#e57b03', bannerEyebrow: '#f7c265', bannerSubtitle: '#f7c265',
      bannerCtaText: '#e57b03',
      // Banner v2
      banner2Bg: '#f39800', banner2Eyebrow: '#f7c265', banner2Subtitle: '#f7c265',
      banner2CtaText: '#f39800',
      // Section Heading
      sectionEyebrow: '#e57b03',
      // Image-Text Split
      splitEyebrow: '#e57b03', splitCtaBg: '#f39800',
      // Text-Image Split
      split2Eyebrow: '#e57b03', split2CtaBg: '#f39800',
      // Promo Code Single
      couponAccent: '#f39800', couponCode: '#f39800', couponCodeBorder: '#f39800',
      // Coupon Single
      cpn1Eyebrow: '#f39800', cpn1ImgBg: '#f39800', cpn1CtaBg: '#f39800',
      // Coupon Dual
      coupon2Eyebrow: '#f39800', coupon2Card1ImgBg: '#f39800', coupon2Card2ImgBg: '#ff6b35', coupon2CtaBg: '#f39800',
      // Promo Code Dual — Card 1
      promo2Color1Bg: '#f39800', promo2Color1Text: '#f39800', promo2Color1Border: '#f39800',
      // Promo Code Dual — Card 2
      promo2Color2Bg: '#ff6b35', promo2Color2Text: '#ff6b35', promo2Color2Border: '#ff6b35',
      // Activities
      actEyebrow: '#f39800', actLabel: '#f39800', actCtaBg: '#f39800',
      // Button Bars
      singleBtnCtaBg: '#f39800',
      dualBtn1Bg: '#f39800', dualBtn2Border: '#f39800', dualBtn2Text: '#f39800',
      btn3CtaBg: '#f39800',
      // Products v1
      prodCtaBg: '#f39800',
      // Products v2
      prod2CtaBg: '#f39800',
      // Product Spotlight
      spotEyebrow: '#f39800', spotCtaBg: '#f39800',
      // Product Cards
      pcardsEyebrow: '#f39800', pcardsAccent: '#f39800', pcardsCtaBg: '#f39800',
      // Product Showcase
      showcaseSpecsBg: 'rgba(243,152,0,0.85)', showcaseEyebrow: '#f39800',
      // Survey
      surveyEyebrow: '#f39800', surveyCtaBg: '#f39800'
    }
  }
};

// ══════════════════════════════════════
// Responsive CSS per component (for full-doc export)
// ══════════════════════════════════════
var RESPONSIVE_CSS = {
  'header': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.split-table { width: 100% !important; }
      td.hide-sm { display: none !important; }
      img.mobile-img { width: 100% !important; max-width: 100% !important; height: auto !important; }`,
  'banner-v1': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.hero-v1-td { padding: 28px 20px !important; }
      h1.hero-v1-title { font-size: 28px !important; mso-line-height-rule: exactly; line-height: 1.2 !important; }
      table.split-table { width: 100% !important; }
      td.banner-side { width: 15% !important; }
      td.banner-cta-cell { width: 70% !important; }
      img.mobile-img { width: 100% !important; max-width: 100% !important; height: auto !important; }`,
  'banner-v2': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.bv2-split-table { width: 100% !important; }
      td.bv2-col-img { display: block !important; width: 100% !important; box-sizing: border-box; padding: 0 !important; }
      img.bv2-img { width: 100% !important; max-width: 100% !important; height: auto !important; }
      td.bv2-hero-td { display: block !important; width: 100% !important; box-sizing: border-box; padding: 28px 20px !important; }
      h1.bv2-hero-title { font-size: 26px !important; mso-line-height-rule: exactly; line-height: 1.2 !important; }
      p.bv2-subtitle2 { font-size: 15px !important; }`,
  'countdown': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.countdown-td { width: 100% !important; box-sizing: border-box !important; padding: 12px 16px !important; }
      table.countdown-icon-tbl { width: 100% !important; }`,
  'section-heading': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }`,
  'products-v1': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.col-2 { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; box-sizing: border-box; }
      td.col-gap { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }
      img.mobile-img { width: 100% !important; max-width: 100% !important; height: auto !important; }
      table.product-grid { width: 100% !important; }
      table.product-card { width: 100% !important; }
      td.card-img { width: 100% !important; height: auto !important; }
      td.card-img img { max-width: 240px !important; }
      td.card-body { width: 100% !important; padding: 16px 16px 12px 16px !important; }
      td.card-cta { width: 100% !important; padding: 14px 0 !important; }`,
  'products-v2': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.col-3 { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; box-sizing: border-box; }
      td.col-gap { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }
      img.mobile-img { width: 100% !important; max-width: 100% !important; height: auto !important; }
      table.product-grid { width: 100% !important; }
      table.product-card { width: 100% !important; }
      td.card-img { width: 100% !important; height: auto !important; }
      td.card-img img { max-width: 240px !important; }
      td.card-body { width: 100% !important; padding: 16px 16px 12px 16px !important; }
      td.card-cta { width: 100% !important; padding: 14px 0 !important; }`,
  'image-text-split': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.its-split-table { width: 100% !important; }
      td.its-col-img { display: block !important; width: 100% !important; box-sizing: border-box; padding: 0 !important; }
      img.its-img { width: 100% !important; max-width: 100% !important; height: auto !important; }
      td.its-col-text { display: block !important; width: 100% !important; box-sizing: border-box; padding: 16px 32px !important; }`,
  'text-image-split': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.tis-split-table { width: 100% !important; }
      td.tis-col-img { display: block !important; width: 100% !important; box-sizing: border-box; padding: 0 !important; }
      img.tis-img { width: 100% !important; max-width: 100% !important; height: auto !important; }
      td.tis-col-text { display: block !important; width: 100% !important; box-sizing: border-box; padding: 16px 32px !important; }`,
  'coupon-v1': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.split-table { width: 100% !important; }`,
  'coupon-single': `
      table.cs-outer { width: 100% !important; max-width: 100% !important; }
      table.cs-card { width: 100% !important; max-width: 100% !important; }
      td.cs-img { display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; width: 100% !important; height: 200px !important; background-size: cover !important; background-position: center !important; }
      td.cs-text { display: block !important; width: 100% !important; }`,
  'coupon-v2': `
      table.cd-outer { width: 100% !important; max-width: 100% !important; }
      table.cd-grid { width: 100% !important; max-width: 100% !important; }
      td.cd-col { display: block !important; width: 100% !important; padding: 0 0 16px 0 !important; box-sizing: border-box; }
      td.cd-col:last-child { padding-bottom: 0 !important; }
      td.cd-gap { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }
      table.cd-card { width: 100% !important; max-width: 100% !important; }
      td.cd-card-img { height: 180px !important; background-size: cover !important; background-position: center !important; }`,
  'promo-code-dual': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.product-grid { width: 100% !important; }
      td.col-2 { display: inline-block !important; width: 48% !important; padding: 0 !important; box-sizing: border-box; vertical-align: top !important; }
      td.col-gap { display: inline-block !important; width: 3% !important; font-size: 0 !important; }
      table.promo-card { width: 100% !important; }
      p[mc\\:edit*="promo1_tag"], p[mc\\:edit*="promo2_tag"] { font-size: 8px !important; letter-spacing: 0.5px !important; }
      p[mc\\:edit*="promo1_headline"], p[mc\\:edit*="promo2_headline"] { font-size: 12px !important; }
      span[mc\\:edit*="promo1_code"], span[mc\\:edit*="promo2_code"] { font-size: 14px !important; letter-spacing: 2px !important; }`,
  'service-benefits': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.col-service { display: inline-block !important; width: 46% !important; padding: 12px 2% !important; vertical-align: top; }
      table.service-grid { width: 100% !important; }
      table.split-table { width: 100% !important; }`,
  'other-activities': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.col-3 { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; box-sizing: border-box; }
      td.col-gap { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }
      img.mobile-img { width: 100% !important; max-width: 100% !important; height: auto !important; }
      table.activity-grid { width: 100% !important; }
      table.activity-card { width: 100% !important; }
      table.split-table { width: 100% !important; }
      td.card-img { width: 100% !important; height: auto !important; }
      td.card-img img { width: 100% !important; max-width: 100% !important; }
      td.card-body { width: 100% !important; padding: 16px 16px 14px 16px !important; }`,
  'footer': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.split-table { width: 100% !important; }`,
  'three-col-image-text': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.col-3 { display: block !important; width: 100% !important; padding: 0 0 20px 0 !important; box-sizing: border-box; }
      td.col-gap-3 { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }
      table.three-col { width: 100% !important; }
      img.col-img { width: 160px !important; max-width: 160px !important; height: auto !important; }`,
  'grid-3col-image-text': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.grid-3col { width: 100% !important; }
      td.col-3 { display: block !important; width: 100% !important; padding: 0 0 16px 0 !important; box-sizing: border-box; }
      td.col-3:last-child { padding-bottom: 0 !important; }
      td.col-gap { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }`,
  'single-button-bar': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }`,
  'dual-button-bar': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.btn-col { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; box-sizing: border-box; text-align: center !important; }
      td.btn-col table { margin: 0 auto !important; }
      td.btn-gap { display: none !important; width: 0 !important; }`,
  'four-col-image-text': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.col-4 { display: inline-block !important; width: 48% !important; padding: 0 0 20px 0 !important; box-sizing: border-box; vertical-align: top !important; }
      td.col-gap-4 { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }
      table.four-col { width: 100% !important; }
      img.col4-img { width: 120px !important; max-width: 120px !important; height: auto !important; }`,
  'three-button-bar': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      td.btn3-col { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; box-sizing: border-box; text-align: center !important; }
      td.btn3-col table { margin: 0 auto !important; }
      td.btn3-gap { display: none !important; width: 0 !important; }`,
  'product-spotlight': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.split-table { width: 100% !important; }
      td.spot-label-td { display: block !important; width: 100% !important; box-sizing: border-box; padding: 24px 20px 16px 20px !important; }
      td.spot-body-td { display: block !important; width: 100% !important; box-sizing: border-box; padding: 16px 20px 24px 20px !important; border-left: none !important; border-top: 1px solid #eee !important; }
      img.spot-img { width: 100% !important; max-width: 100% !important; height: auto !important; }`,
  'product-cards': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.cards-table { width: 100% !important; }
      table.pcards-grid { width: 100% !important; }
      td.pcard-col-td { display: block !important; width: 100% !important; box-sizing: border-box; margin-bottom: 16px; }
      td.pcard-gap-td { display: none !important; width: 0 !important; max-height: 0 !important; overflow: hidden !important; }
      img.pcard-img { width: 100% !important; max-width: 100% !important; height: auto !important; }`,
  'product-showcase': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.split-table { width: 100% !important; }
      table.showcase-inner { width: 100% !important; }
      td.showcase-specs-td { display: block !important; width: 100% !important; box-sizing: border-box; padding: 20px !important; }
      td.showcase-body-td { display: block !important; width: 100% !important; box-sizing: border-box; padding: 20px !important; }`,
  'survey': `
      table.survey-outer { width: 100% !important; }
      table.survey-card { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }`,
  'grid-2x2-image-text': `
      table.email-container { width: 100% !important; }
      td.outer-pad { padding: 0 !important; }
      table.grid-2x2 { width: 100% !important; }
      td.grid-cell { display: block !important; width: 100% !important; padding: 10px 0 !important; box-sizing: border-box; }`
};
