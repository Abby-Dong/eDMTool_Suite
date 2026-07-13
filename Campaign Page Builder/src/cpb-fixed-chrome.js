/* ══════════════════════════════════════════════════════════════════════
   Campaign Page Builder — Fixed Chrome
   The Header & Footer are FIXED:
     - Content cannot be edited
     - Style toggles do NOT affect them
     - All selectors are namespaced under `.cpb-fx-*` so they will not
       collide with the page Style CSS (cpb-*) nor be touched by the
       export-time prefix rewrite.
     - Footer has only two looks: light (default) and dark, controlled
       by `data-footer-mode="light"` or `data-footer-mode="dark"` on the
       page wrapper.
   ══════════════════════════════════════════════════════════════════════ */

const FIXED_HEADER_HTML = `
<div class="cpb-fx-site-header" id="header">
    <div class="cpb-fx-site-logo">
        <a href="https://www.iotmart.com/s/?language=en_US" style="margin-top:0px;" class="cpb-fx-site-logo">
            <img src="https://irp.cdn-website.com/56869327/dms3rep/multi/LOGO_WBG.png">
        </a>
    </div>
    <div class="cpb-fx-site-menu">
        <div class="cpb-fx-site-dropdown">
            <div class="cpb-fx-site-menu-item">Products</div>
            <div class="cpb-fx-site-dropdown-content">
                <a style="padding-left:16px;font-weight: 600;" href="https://www.iotmart.com/s/category/products/aiot-software-solutions/0ZG2y000000bmEmGAI?language=en_US&amp;c__results_layout_state=%7B%7D">AIoT Software &amp; Solutions</a>
                <a style="padding-left:16px;font-weight: 600;" href="https://www.iotmart.com/s/category/products/edge-device-products/0ZG2y000000bmEnGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Edge &amp; Device Products</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/industrial-servers-ipc/0ZG2y000000bmEoGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Industrial Servers &amp; IPC</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/network-communications/0ZG2y000000bmEpGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Network Communications</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/industrial-hmi-displays/0ZG2y000000bmEqGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Panel PC, HMI &amp; Displays</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/embedded-computers/0ZG2y000000bmErGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Embedded Computers</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/iot-gateway-edge-intelligence/0ZG2y000000bmEsGAI?language=en_US&amp;c__results_layout_state=%7B%7D">IoT Gateway &amp; Edge Intelligence</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/wireless-sensing-solutions/0ZG2y000000bmEtGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Wireless Sensing &amp; Solutions</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/remote-io-communication/0ZG2y000000bmEuGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Remote IO &amp; Communication</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/industrial-computer-boards/0ZG2y000000bmEvGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Industrial Computer Boards</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/mobile-tablets-devices/0ZG2y000000bmEwGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Mobile Tablets &amp; Devices</a>
                <a href="https://www.iotmart.com/s/category/products/edge-device-products/edge-ai-solutions/0ZG2y000000bmExGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Edge AI Solutions</a>
                <a style="padding-left:16px;font-weight: 600;" href="https://www.iotmart.com/s/category/products/peripheral-distribution/0ZG2y000000bmEyGAI?language=en_US&amp;c__results_layout_state=%7B%7D">Peripherals &amp; Modules</a>
            </div>
        </div>
        <div class="cpb-fx-site-dropdown">
            <div class="cpb-fx-site-menu-item">Thematic Hub</div>
            <div class="cpb-fx-site-dropdown-content">
                <a style="padding-left:16px;" href="https://campaign.iotmart.com/sector-hub-ipc-built-on-demand">IPC Built On Demand</a>
                <a style="padding-left:16px;" href="https://campaign.iotmart.com/nvidia-ai-developer-kit">Edge AI Solution</a>
                <a style="padding-left:16px;" href="https://www.iotmart.com/en-en/s/sector-hub-iot-automation?language=en_US">IoT Automation</a>
                <a style="padding-left:16px;" href="https://www.iotmart.com/s/sector-hub-industrial-displays?language=en_US">Industrial Display Solution</a>
                <a style="padding-left:16px;" href="https://www.iotmart.com/s/sector-hub-peripheral-and-modules?language=en_US">Peripherals &amp; Modules</a>
            </div>
        </div>
    </div>
    <a style="color:#ffffff" href="https://member.advantech.com/user/login.aspx?pass=iotmart&amp;CallBackURL=https%3a%2f%2fmember.advantech.com%2foauth2%2fauthorize_scope.aspx%3fclient_id%3d5a1a9234ee484906bff7d899e5468042%26lang%3d%26pass%3diotmart%26redirect_uri%3dhttps%253A%252F%252Fwww.iotmart.com%252Fen-en%252Fservices%252Fauthcallback%252FIotMart_OAuth%26response_type%3dcode%26scope%3dfull%2bopenid%2bemail%2bprofile%2blightning%26state%3dCAAAAZBObt-NMDAwMDAwMDAwMDAwMDAwAAAA-i4V-GtLWLOPpPI8tOPAAW_n95fyHdlcqKwNLZpKqc-YDqGAeY6nSOR37pfDxVby5PtKdedQzTtAYVjD_gkTwj-C4gxga1yGl-6B0tCdnjT5LtBLOrDwcqTgbV76jpyqJEvaC3EAMOzeuU5-Yp0-rRD2xYYbFkbu7d9rpcrR3BA2keun8hIvW4YmgxxgbINDwiF_iZIqP_G-T-fjJmBHNlMrvGM6O6Fz9IFwXidF2TJO" class="cpb-fx-site-logbutton">Log in</a>
</div>`;

const FIXED_FOOTER_HTML = `
<div class="cpb-fx-footer">
    <div class="cpb-fx-footer-container">
        <div class="cpb-fx-footer-social">
            <a href="https://www.facebook.com/AdvantechGlobal" target="_blank" class="cpb-fx-social-link"><img src="https://irp.cdn-website.com/56869327/dms3rep/multi/social+media-fb.png" width="32" height="32" alt="Facebook"></a>
            <a href="https://www.linkedin.com/company/advantech" target="_blank" class="cpb-fx-social-link"><img src="https://irp.cdn-website.com/56869327/dms3rep/multi/social+media-linkdin.png" width="32" height="32" alt="LinkedIn"></a>
            <a href="https://www.youtube.com/user/AdvantechCorp" target="_blank" class="cpb-fx-social-link"><img src="https://irp.cdn-website.com/56869327/dms3rep/multi/social+media-youtube.png" width="32" height="32" alt="YouTube"></a>
        </div>
        <div>&copy; 2026 Advantech Co., Ltd. All Rights Reserved.</div>
    </div>
</div>`;

/* CSS for the fixed Header & Footer.
   - All selectors are namespaced `.cpb-fx-*`
   - The Footer reads its colours from CSS variables defined under
     `[data-footer-mode="light"]` / `[data-footer-mode="dark"]` on the
     page wrapper, so toggling modes flips them without touching anything else. */
const FIXED_CHROME_CSS = `
/* Header */
.cpb-fx-site-header {
    width: 100%;
    background-color: #ffffff;
    padding: 8px 24px;
    height: 48px;
    position: fixed;
    top: 0; left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    flex-shrink: 0;
    box-sizing: border-box;
}
.cpb-fx-site-logo { height: 28px !important; background-color: #FFFFFF !important; }
.cpb-fx-site-logo img { height: 100%; }
.cpb-fx-site-menu {
    margin-left: 24px; margin-right: auto;
    display: flex; align-items: center;
}
.cpb-fx-site-menu-item {
    padding: 4px 8px; margin: 0 4px;
    cursor: pointer; color: #474747; text-decoration: none;
    font-size: 14px; font-weight: 400; line-height: 16px;
    border-radius: 2px; letter-spacing: 1px;
    transition: border-right 1.05s cubic-bezier(0.19, 1, 0.22, 1);
}
.cpb-fx-site-menu-item:hover { color: #E57B03; border-bottom: 3px #E57B03 solid; }
.cpb-fx-site-dropdown { position: relative; }
.cpb-fx-site-dropdown-content {
    border-radius: 2px; display: none; position: absolute;
    background-color: #F6F7F9; min-width: 280px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 100; padding-top: 8px;
}
.cpb-fx-site-dropdown-content a {
    border-radius: 2px !important; margin-top: 0 !important; color: #737B7D !important;
    padding: 8px 16px 8px 32px !important; text-decoration: none !important;
    display: block !important; font-size: 14px !important; font-weight: 400 !important; letter-spacing: 1.2px !important;
}
.cpb-fx-site-dropdown-content a:hover { background-color: #E8ECEF !important; color: #E57B03 !important; }
.cpb-fx-site-dropdown:hover .cpb-fx-site-dropdown-content,
.cpb-fx-site-dropdown:active .cpb-fx-site-dropdown-content,
.cpb-fx-site-dropdown:focus .cpb-fx-site-dropdown-content { display: block; }
.cpb-fx-site-logbutton {
    text-decoration: none !important; background-color: #004280 !important; color: #ffffff !important;
    padding: 6px 12px !important; text-align: center !important; display: inline-block !important;
    font-size: 14px !important; margin: 0 !important; cursor: pointer !important;
    border-radius: 2px !important; letter-spacing: 1px !important;
}
.cpb-fx-site-logbutton:hover { background-color: #003160 !important; color: #ffffff !important; text-decoration: none !important; }
@media screen and (max-width: 599px) {
    .cpb-fx-site-header { padding: 8px 12px; }
    .cpb-fx-site-logo { height: 20px !important; }
    .cpb-fx-site-menu { margin-left: 8px; }
    .cpb-fx-site-menu-item { padding: 4px; margin: 0 2px; font-size: 15px; letter-spacing: 0; }
    .cpb-fx-site-dropdown-content { left: -100px; }
    .cpb-fx-site-logbutton { padding: 6px 8px !important; font-size: 12px !important; margin: 0 !important; letter-spacing: 0 !important; }
}
@media screen and (max-width: 480px) {
    .cpb-fx-site-header {
        padding: 8px 8px;
        gap: 4px;
    }
    .cpb-fx-site-logo {
        height: 18px !important;
        flex: 0 0 auto;
    }
    .cpb-fx-site-menu {
        margin-left: 2px;
        margin-right: 2px;
        min-width: 0;
        flex: 1 1 auto;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
    }
    .cpb-fx-site-menu::-webkit-scrollbar { display: none; }
    .cpb-fx-site-dropdown {
        flex: 0 0 auto;
    }
    .cpb-fx-site-menu-item {
        padding: 3px 4px;
        margin: 0 1px;
        font-size: 11px;
        line-height: 1.1;
        white-space: nowrap;
        letter-spacing: 0;
    }
    .cpb-fx-site-logbutton {
        flex: 0 0 auto;
        padding: 5px 6px !important;
        font-size: 11px !important;
        white-space: nowrap;
    }
    .cpb-fx-site-dropdown-content {
        left: 0;
        min-width: 240px;
    }
}

/* Top spacer so first section clears the fixed header */
.cpb-fx-main-mt { height: 48px; flex-shrink: 0; }

/* Anchor behavior: smooth scroll + offset to avoid fixed Header/Anchor overlap. */
html { scroll-behavior: smooth; }
section[id],
nav[id],
footer[id],
div[id] {
    scroll-margin-top: 104px;
}

/* Sticky Anchor Nav — sits directly under the fixed Header */
[data-style="clean-pro"] .cpb-fx-anchor-nav {
    --edge-anchor-bg: rgba(255,255,255,0.96);
    --edge-anchor-border: rgba(0, 110, 255, 0.22);
    --edge-anchor-item: #5b6068;
    --edge-anchor-item-hover-bg: rgba(0, 110, 255, 0.10);
    --edge-anchor-item-hover: #0c0c0c;
    --edge-anchor-item-active-bg: rgba(0, 110, 255, 0.16);
    --edge-anchor-item-active: #006eff;
    --edge-anchor-item-active-line: #006eff;
    --edge-anchor-shadow: 0 4px 16px -6px rgba(0,0,0,0.22);
}
[data-style="cyber-green"] .cpb-fx-anchor-nav {
    --edge-anchor-bg: rgba(5, 7, 13, 0.92);
    --edge-anchor-border: rgba(151, 196, 48, 0.30);
    --edge-anchor-item: rgba(234, 240, 255, 0.76);
    --edge-anchor-item-hover-bg: rgba(151, 196, 48, 0.14);
    --edge-anchor-item-hover: #eaf0ff;
    --edge-anchor-item-active-bg: rgba(151, 196, 48, 0.20);
    --edge-anchor-item-active: #97c430;
    --edge-anchor-item-active-line: #97c430;
    --edge-anchor-shadow: 0 4px 20px -5px rgba(0,0,0,0.5);
}
[data-style="clean-pro"] .cpb-fx-anchor-nav[data-mode="light"] {
    --edge-anchor-bg: rgba(255,255,255,0.96);
    --edge-anchor-border: rgba(0, 110, 255, 0.22);
    --edge-anchor-item: #5b6068;
    --edge-anchor-item-hover-bg: rgba(0, 110, 255, 0.10);
    --edge-anchor-item-hover: #0c0c0c;
    --edge-anchor-item-active-bg: rgba(0, 110, 255, 0.16);
    --edge-anchor-item-active: #006eff;
    --edge-anchor-item-active-line: #006eff;
    --edge-anchor-shadow: 0 4px 16px -6px rgba(0,0,0,0.22);
}
[data-style="clean-pro"] .cpb-fx-anchor-nav[data-mode="dark"] {
    --edge-anchor-bg: rgba(7, 12, 24, 0.95);
    --edge-anchor-border: rgba(77, 140, 255, 0.35);
    --edge-anchor-item: rgba(232, 241, 255, 0.78);
    --edge-anchor-item-hover-bg: rgba(0, 110, 255, 0.16);
    --edge-anchor-item-hover: #f2f7ff;
    --edge-anchor-item-active-bg: rgba(0, 110, 255, 0.24);
    --edge-anchor-item-active: #7aa9ff;
    --edge-anchor-item-active-line: #7aa9ff;
    --edge-anchor-shadow: 0 6px 22px -8px rgba(0,0,0,0.55);
}
[data-style="cyber-green"] .cpb-fx-anchor-nav[data-mode="light"] {
    --edge-anchor-bg: rgba(247, 251, 240, 0.97);
    --edge-anchor-border: rgba(151, 196, 48, 0.35);
    --edge-anchor-item: #59624c;
    --edge-anchor-item-hover-bg: rgba(151, 196, 48, 0.16);
    --edge-anchor-item-hover: #25310f;
    --edge-anchor-item-active-bg: rgba(151, 196, 48, 0.24);
    --edge-anchor-item-active: #5f8223;
    --edge-anchor-item-active-line: #7ca628;
    --edge-anchor-shadow: 0 4px 16px -6px rgba(64,96,24,0.24);
}
[data-style="cyber-green"] .cpb-fx-anchor-nav[data-mode="dark"] {
    --edge-anchor-bg: rgba(5, 7, 13, 0.92);
    --edge-anchor-border: rgba(151, 196, 48, 0.30);
    --edge-anchor-item: rgba(234, 240, 255, 0.76);
    --edge-anchor-item-hover-bg: rgba(151, 196, 48, 0.14);
    --edge-anchor-item-hover: #eaf0ff;
    --edge-anchor-item-active-bg: rgba(151, 196, 48, 0.20);
    --edge-anchor-item-active: #97c430;
    --edge-anchor-item-active-line: #97c430;
    --edge-anchor-shadow: 0 4px 20px -5px rgba(0,0,0,0.5);
}
.cpb-fx-anchor-nav[data-mode="light"] {
    --edge-anchor-bg: rgba(255,255,255,0.96);
    --edge-anchor-border: rgba(0, 110, 255, 0.22);
    --edge-anchor-item: #5b6068;
    --edge-anchor-item-hover-bg: rgba(0, 110, 255, 0.10);
    --edge-anchor-item-hover: #0c0c0c;
    --edge-anchor-item-active-bg: rgba(0, 110, 255, 0.16);
    --edge-anchor-item-active: #006eff;
    --edge-anchor-item-active-line: #006eff;
    --edge-anchor-shadow: 0 4px 16px -6px rgba(0,0,0,0.22);
}
.cpb-fx-anchor-nav[data-mode="dark"] {
    --edge-anchor-bg: rgba(5, 7, 13, 0.92);
    --edge-anchor-border: rgba(151, 196, 48, 0.30);
    --edge-anchor-item: rgba(234, 240, 255, 0.76);
    --edge-anchor-item-hover-bg: rgba(151, 196, 48, 0.14);
    --edge-anchor-item-hover: #eaf0ff;
    --edge-anchor-item-active-bg: rgba(151, 196, 48, 0.20);
    --edge-anchor-item-active: #97c430;
    --edge-anchor-item-active-line: #97c430;
    --edge-anchor-shadow: 0 4px 20px -5px rgba(0,0,0,0.5);
}
.cpb-fx-anchor-nav {
    position: -webkit-sticky;
    position: sticky; top: 48px;
    width: 100%; height: 44px;
    z-index: 999;
    display: flex; align-items: center; justify-content: flex-start;
    background: var(--edge-anchor-bg, rgba(255,255,255,0.96));
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--edge-anchor-border, rgba(0,110,255,0.22));
    box-shadow: var(--edge-anchor-shadow, 0 4px 16px -6px rgba(0,0,0,0.22));
    overflow-x: auto; overflow-y: hidden;
    scrollbar-width: none;
}
.cpb-fx-anchor-nav::-webkit-scrollbar { display: none; }
.cpb-fx-anchor-nav-inner {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0 2rem; width: max-content; min-width: 100%;
    justify-content: center; flex-shrink: 0;
}
.cpb-fx-anchor-nav-inner::before,
.cpb-fx-anchor-nav-inner::after { content: ''; flex-shrink: 0; width: 1rem; }
.cpb-fx-anchor-item,
a.cpb-fx-anchor-item {
    padding: 0.55rem 0.95rem !important;
    margin-top: 0 !important;
    font-size: 0.8rem !important;
    font-weight: 500 !important;
    color: var(--edge-anchor-item, #5b6068) !important;
    white-space: nowrap !important;
    position: relative !important;
    transition: all 0.3s ease !important;
    border-radius: 0 !important;
    background: transparent !important;
    border: 0 !important;
    letter-spacing: 0.5px !important;
    text-decoration: none !important;
}
.cpb-fx-anchor-item:hover,
a.cpb-fx-anchor-item:hover { color: var(--edge-anchor-item-hover, #0c0c0c) !important; background: transparent !important; }
.cpb-fx-anchor-item.active,
a.cpb-fx-anchor-item.active { color: var(--edge-anchor-item-active, #006eff) !important; background: transparent !important; font-weight: 600 !important; }
.cpb-fx-anchor-item.active::after,
a.cpb-fx-anchor-item.active::after {
    content: '' !important; position: absolute !important;
    bottom: 0 !important; left: 50% !important; transform: translateX(-50%) !important;
    width: calc(100% - 12px) !important; height: 1px !important;
    background: var(--edge-anchor-item-active-line, #006eff) !important;
    box-shadow: none !important;
}
@media screen and (max-width: 1200px) {
    .cpb-fx-anchor-nav-inner { justify-content: flex-start; padding: 0 1.5rem; min-width: auto; }
    .cpb-fx-anchor-item { padding: 0.4rem 0.6rem !important; font-size: 0.75rem !important; }
}

/* Style-distinct anchor nav refinements */
[data-style="clean-pro"] .cpb-fx-anchor-nav {
    height: 42px;
    border-top: 1px solid rgba(0, 110, 255, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
[data-style="clean-pro"] .cpb-fx-anchor-nav-inner { gap: 0.2rem; }
[data-style="clean-pro"] .cpb-fx-anchor-item,
[data-style="clean-pro"] a.cpb-fx-anchor-item {
    font-weight: 600 !important;
    font-size: 0.76rem !important;
    letter-spacing: 0.04em !important;
    padding: 0.55rem 0.85rem !important;
}
[data-style="clean-pro"] .cpb-fx-anchor-item:hover,
[data-style="clean-pro"] a.cpb-fx-anchor-item:hover {
    color: #004fb8 !important;
}
[data-style="clean-pro"] .cpb-fx-anchor-item.active,
[data-style="clean-pro"] a.cpb-fx-anchor-item.active {
    color: #006eff !important;
    box-shadow: none;
}
[data-style="clean-pro"] .cpb-fx-anchor-item.active::after,
[data-style="clean-pro"] a.cpb-fx-anchor-item.active::after {
    height: 2px !important;
    width: calc(100% - 16px) !important;
    bottom: 3px !important;
    box-shadow: none !important;
    background: var(--edge-anchor-item-active-line, #006eff) !important;
}

[data-style="cyber-green"] .cpb-fx-anchor-nav {
    height: 46px;
    border-top: 1px solid rgba(151, 196, 48, 0.22);
    background:
      linear-gradient(180deg, rgba(151,196,48,0.08), rgba(151,196,48,0.00) 56%),
      var(--edge-anchor-bg, rgba(5, 7, 13, 0.92));
}
[data-style="cyber-green"] .cpb-fx-anchor-nav-inner { gap: 0.45rem; }
[data-style="cyber-green"] .cpb-fx-anchor-item,
[data-style="cyber-green"] a.cpb-fx-anchor-item {
    font-size: 0.76rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em !important;
    text-transform: none;
    padding: 0.5rem 0.8rem !important;
}
[data-style="cyber-green"] .cpb-fx-anchor-item:hover,
[data-style="cyber-green"] a.cpb-fx-anchor-item:hover {
    transform: none;
    color: #c7e67a !important;
}
[data-style="cyber-green"] .cpb-fx-anchor-item.active,
[data-style="cyber-green"] a.cpb-fx-anchor-item.active {
    color: #97c430 !important;
    box-shadow: none;
}
[data-style="cyber-green"] .cpb-fx-anchor-item.active::after,
[data-style="cyber-green"] a.cpb-fx-anchor-item.active::after {
    width: calc(100% - 10px) !important;
    height: 2px !important;
    bottom: 2px !important;
    background: var(--edge-anchor-item-active-line, #97c430) !important;
    box-shadow: 0 0 6px rgba(151, 196, 48, 0.42) !important;
}

/* Footer base */
.cpb-fx-footer {
    background: var(--nvf-bg, #ECEEF2);
    padding: 4rem 0 2rem;
    border-top: 1px solid var(--nvf-border, rgba(139, 92, 246, 0.2));
    text-align: center;
    color: var(--nvf-text, #475569);
    font-size: 0.9rem;
}
.cpb-fx-footer-container {
    margin: 0 auto;
    padding-left: 6vw; padding-right: 6vw;
}
@media (min-width: 768px) {
    .cpb-fx-footer-container { padding-left: 32px; padding-right: 32px; }
}
@media (min-width: 1025px) {
    .cpb-fx-footer-container { padding-left: 4vw; padding-right: 4vw; }
}
@media (min-width: 1400px) {
    .cpb-fx-footer-container { padding-left: 9vw; padding-right: 9vw; }
}
.cpb-fx-footer-social {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 2rem;
}
.cpb-fx-social-link {
    color: var(--nvf-text, #475569) !important;
    transition: 0.3s !important;
    display: inline-block !important;
}
.cpb-fx-social-link:hover {
    color: #8B5CF6 !important;
    transform: translateY(-3px) !important;
}
/* Light & Dark footer modes — applied directly on the footer element */
.cpb-fx-footer,
.cpb-fx-footer[data-footer-mode="light"] {
    --nvf-bg: #ECEEF2;
    --nvf-border: rgba(139, 92, 246, 0.2);
    --nvf-text: #475569;
}
.cpb-fx-footer[data-footer-mode="dark"] {
    --nvf-bg: #0a0a0a;
    --nvf-border: rgba(255, 255, 255, 0.1);
    --nvf-text: #b8b8b8;
}
`;
