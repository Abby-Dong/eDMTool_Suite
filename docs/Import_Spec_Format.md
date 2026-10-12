# Import Spec Format (Component Customizer)

This document defines the JSON format accepted by **Import Spec** in the **New Project** popup.

## Accepted File Type

- `.json`
- MIME: `application/json`

## Accepted Payload Shapes

The importer accepts either:

1. Wrapped payload (`snapshot` wrapper)
2. Direct snapshot payload

### Shape A: Wrapped payload (recommended)

```json
{
  "name": "KR_AlwaysOn_Imported",
  "site": "KR",
  "theme": "light-blue",
  "snapshot": {
    "theme": "light-blue",
    "builderStack": [],
    "colorState": {},
    "_builderUid": 0
  }
}
```

### Shape B: Direct snapshot

```json
{
  "name": "Global_Imported",
  "site": "Global",
  "theme": "light-orange",
  "builderStack": [],
  "colorState": {},
  "_builderUid": 0
}
```

## Field Reference

- `name` (string, optional)
  - Project name.
  - If missing, importer uses file name (without `.json`).
- `site` (string, optional)
  - `Global`, `KR`, or `EU` are recommended.
  - If missing, defaults to `Global`.
  - If user selects Site/Region in popup Import action, popup value overrides file value.
- `theme` (string, optional)
  - One of existing themes in tool (e.g. `light-blue`, `light-orange`, `lp-green`, `lp-purple`).
  - Invalid theme falls back to `light-blue`.
- `builderStack` (array, optional)
  - Component list.
  - Unknown `compId` items are skipped.
- `colorState` (object, optional)
  - Color token state map.
- `_builderUid` (number, optional)
  - Internal uid seed.
  - If missing, importer auto-derives from stack length.

## builderStack Item Example

```json
{
  "uid": "bi_123456",
  "compId": "footer",
  "edits": {},
  "options": {
    "showSocial": true,
    "socialCount": "3",
    "showLegalLinks": true,
    "unsubscribeText": "here",
    "unsubscribeUrl": "%%unsub_center_url%%",
    "unsubscribeAlias": "external_link_unsubscribe_unsubscribe",
    "legalLinks": [
      { "text": "Privacy Policy", "url": "https://www.advantech.com/en/legal/privacy" },
      { "text": "Terms & Conditions", "url": "https://www.iotmart.com/en-en/s/terms-conditions?language=en_US" }
    ]
  },
  "colors": {}
}
```

## Normalization Rules During Import

The importer automatically:

- Fills missing option defaults from each component `optionMap`
- Fills missing color keys from theme defaults/component defaults
- Skips unknown component IDs
- Normalizes Footer 27 (`compId: "footer"`) options:
  - `unsubscribeText`, `unsubscribeUrl`, `unsubscribeAlias`
  - `legalLinks` (array of `{ text, url }`)

## Minimal Valid Example

```json
{
  "name": "My Imported Project",
  "site": "Global",
  "snapshot": {
    "theme": "light-blue",
    "builderStack": [],
    "colorState": {}
  }
}
```
