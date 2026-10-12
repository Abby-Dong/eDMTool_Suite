# HTML Import Constraints (Component Customizer)

This tool currently supports project import through Spec JSON, not arbitrary HTML parsing.

## Current Support

- Supported import input:
  - Spec JSON (from docs Import_Spec_Format.md)
- Supported export outputs:
  - Final HTML
  - Spec JSON (round-trip format)

## Why direct HTML import is not supported yet

Final email HTML does not preserve enough structural metadata to reliably reconstruct:

- component boundaries
- component IDs and order certainty
- optionMap states for each component
- normalized edit keys and color token maps

Different editors also rewrite HTML, making reverse parsing unstable.

## Recommended round-trip workflow

1. Build/edit in Component Customizer.
2. Export final HTML for sending.
3. Also export Spec JSON for future re-edit.
4. Re-import that Spec JSON later from New Project popup.

## If you must import existing HTML

Current workaround is manual:

- create a new project
- add components manually
- paste/adapt text, links, and images

A dedicated HTML-to-components parser can be added later, but it must be limited to known templates to be reliable.
