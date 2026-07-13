#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const styleRegistryPath = path.join(projectRoot, 'src', 'cpb-styles.js');
const outputPath = path.join(projectRoot, 'dist', 'cpb-style-css-data.js');

function parseStyleRegistry(source) {
  const entries = [];
  const blockRegex = /\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?cssFile:\s*'([^']+)'[\s\S]*?\}/g;
  let match;

  while ((match = blockRegex.exec(source)) !== null) {
    entries.push({ id: match[1], cssFile: match[2] });
  }

  return entries;
}

function buildCssMap(styleEntries) {
  const cssMap = {};

  styleEntries.forEach((style) => {
    const cssPath = path.join(projectRoot, style.cssFile);
    if (!fs.existsSync(cssPath)) {
      throw new Error(`Missing CSS file for style ${style.id}: ${style.cssFile}`);
    }

    const cssText = fs.readFileSync(cssPath, 'utf8');

    // Primary key for runtime lookup.
    cssMap[style.id] = cssText;
    // Backward-compatible key for older generated bundles/runtime code.
    cssMap[style.cssFile] = cssText;
  });

  return cssMap;
}

function main() {
  const registrySource = fs.readFileSync(styleRegistryPath, 'utf8');
  const styleEntries = parseStyleRegistry(registrySource);

  if (!styleEntries.length) {
    throw new Error('No style entries found in cpb-styles.js');
  }

  const cssMap = buildCssMap(styleEntries);
  const banner = '// ⚠️ GENERATED FILE — DO NOT EDIT BY HAND.\n'
    + '// Source: styles-src/*.css  →  Rebuild: ./scripts/build-cpb-styles.sh\n';
  const output = `${banner}window.CPB_STYLE_CSS = ${JSON.stringify(cssMap, null, 2)};\n`;

  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`Regenerated cpb-style-css-data.js with ${styleEntries.length} styles`);
}

main();
