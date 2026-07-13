/* ══════════════════════════════════════════════════════════════════════
   Style Registry
   Each style entry maps to one CSS file under data-style on <body>.
   ══════════════════════════════════════════════════════════════════════ */
const STYLES = [
  {
    id: 'clean-pro',
    num: '01',
    name: 'Style01 (clean pro)',
    desc: 'Minimal industrial light, professional clean.',
    cssFile: 'dist/cpb-style-clean-pro.css',
    defaultMode: 'light',
    swatch: ['#ffffff', '#006EFF', '#0c0c0c'],
    seedProjectHints: ['test-065tt', '065tt'],
    defaultCardVisual: 'image',
    paletteColors: [],
  },
  {
    id: 'cyber-green',
    num: '02',
    name: 'Style02 (Cyber Green)',
    desc: 'Cyber dark visual language with neon green accents.',
    cssFile: 'dist/cpb-style-cyber-green.css',
    defaultMode: 'dark',
    swatch: ['#05070d', '#97C430', '#4DD0E1'],
    seedProjectHints: ['test-nv', 'nv'],
    defaultCardVisual: 'icon',
    heroDefaultImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/cover_NV.jpeg',
    paletteColors: [
      { hex: '#8AB625', name: 'Theme Green (Light)' },
      { hex: '#97C430', name: 'Theme Green (Dark)' },
    ],
  },
  {
    id: 'style03',
    num: '03',
    name: 'Style03 (new style draft)',
    desc: 'Starter style scaffold. Extend tokens/tail for your new visual language.',
    cssFile: 'dist/cpb-style-style03.css',
    defaultMode: 'light',
    swatch: ['#ffffff', '#006EFF', '#0c0c0c'],
    defaultCardVisual: 'image',
    heroDefaultImage: 'https://irp.cdn-website.com/56869327/dms3rep/multi/robotic.png',
    paletteColors: [],
  },
];

const STYLE_BY_ID = Object.fromEntries(STYLES.map(s => [s.id, s]));
