# AI 嵌入前資料準備指引

## 文件目的
這份文件用來定義「在接入 AI 產生內容前」必須先準備好的資料規格、驗證流程、版本策略與上線檢核。

目標是讓 AI 只需要產出合法 JSON，不需要寫 HTML，也不需要知道前端細節。

---

## 適用範圍
- Marcom 主控: `MarcomAgentStudio.html`
- Landing Page Builder: `Campaign Page Builder/CampaignPageBuilder.html`
- eDM Builder: `ComponentCustomizer.html`
- Graphic Asset Builder: `MarketingMaterialBuilder.html`

---

## 1) 先定義資料契約 (Data Contract)

建議先固定 4 個 schema:

1. `campaign` (容器)
2. `lpAsset` (`cpbProject`)
3. `edmAsset` (`snapshot`)
4. `mmAsset` (`mmbProject`)

每個 schema 都要有:
- `schemaVersion` (整數，必填)
- `type` (字串，必填，例如 `campaign`, `lpAsset`)
- `required` 欄位清單
- `additionalProperties` 策略 (建議 false，或採白名單收斂)

---

## 2) 統一欄位規範

### 2.1 ID 與時間欄位
- `id`: 字串，格式建議 `<prefix>_<uid>`，例如 `camp_xxx`, `lp_xxx`, `edm_xxx`, `mm_xxx`
- `created`, `updated`: Unix ms timestamp (number)

### 2.2 列舉欄位
- Region: `Global | KR | EU`
- LP style: `clean-pro | cyber-green | style03`
- eDM theme: `light-blue | light-orange | lp-green | lp-purple`

### 2.3 布林與陣列
- 布林欄位一律 true/false，不用 `0/1`
- 空清單用 `[]`，不要用 `null`

---

## 3) AI 輸出邊界 (必須明確)

AI 只負責產出「內容 JSON」，不負責:
- `__masScoped`
- `_builderUid`
- 歷史堆疊
- 本地儲存鍵
- 執行期旗標 (例如 embed mode)

這些欄位由應用程式在接收後補上或覆寫。

---

## 4) 建議最小資料模型

### 4.1 campaign
```json
{
  "schemaVersion": 1,
  "type": "campaign",
  "id": "camp_xxx",
  "name": "Q3 Launch",
  "region": "Global",
  "landingPages": [],
  "edms": [],
  "materials": [],
  "created": 1780000000000,
  "updated": 1780000000000
}
```

### 4.2 lpAsset (`cpbProject`)
```json
{
  "schemaVersion": 1,
  "type": "lpAsset",
  "id": "lp_xxx",
  "name": "LP Main",
  "cssPrefix": "lp-main",
  "styleId": "clean-pro",
  "store": "Global",
  "sections": [],
  "created": 1780000000000,
  "updated": 1780000000000
}
```

### 4.3 edmAsset (`snapshot`)
```json
{
  "schemaVersion": 1,
  "type": "edmAsset",
  "builderStack": [],
  "colorState": {},
  "theme": "light-blue"
}
```

### 4.4 mmAsset (`mmbProject`)
```json
{
  "schemaVersion": 1,
  "type": "mmAsset",
  "id": "mm_xxx",
  "name": "GA Set A",
  "content": {
    "eyebrow": "",
    "headline": "",
    "subheadline": "",
    "features": [],
    "backgroundImage": "",
    "productImage": "",
    "fontFamily": "Rajdhani",
    "stylePreset": "clean-pro"
  },
  "sizes": {},
  "sizeOrder": [],
  "activeSizeId": null,
  "createdAt": 1780000000000,
  "updatedAt": 1780000000000
}
```

---

## 5) 驗證與清洗策略 (建議)

在兩層做驗證:

1. Marcom 收到 AI JSON 時驗證
2. Builder 收到 `mas-asset-load` 時再次驗證

建議規則:
- 非法 enum -> fallback 預設值
- 缺 required -> 補預設值並記錄 warning
- 多餘欄位 -> 移除 (白名單策略)
- 陣列長度上限 (例如 features 最多 8)
- 字串長度上限 (例如名稱 60)

---

## 6) 版本策略 (Migration)

每個 payload 都帶 `schemaVersion`，並維護 migration map:
- `v1 -> v2`
- `v2 -> v3`

原則:
- 只做向前 migration
- 不在渲染路徑寫臨時判斷
- migration 後再進入 render

---

## 7) AI Prompt 契約範本

可給模型的固定要求:

```text
輸出必須是純 JSON，不可包含註解、Markdown、HTML。
遵守 schemaVersion=1 的資料契約。
只允許白名單欄位。
未知欄位不得輸出。
若無值，使用空字串、空陣列或 null (依 schema 定義)。
```

---

## 8) 上線前檢核清單

- [ ] 四份 schema 文件化且可機器驗證
- [ ] Marcom 載入前驗證已啟用
- [ ] 三個 builder 載入前驗證已啟用
- [ ] migration 流程可跑通
- [ ] AI 錯誤輸出有可讀錯誤訊息
- [ ] fallback 預設值與 UI 一致
- [ ] 重要 enum 已鎖定
- [ ] 有 10+ 組合法/非法範例測試

---

## 9) 權責分工建議

- PM/產品: 定義內容欄位、長度、語意
- 前端: schema 驗證、migration、白名單過濾
- AI 工程: prompt 契約、測試資料集、輸出一致性
- QA: 非法輸入、回退策略、跨 builder 行為一致性

---

## 10) 實務建議 (優先順序)

1. 先做「Warning 模式」驗證 (不擋渲染，先記錄)
2. 觀察 1~2 週後切「Strict 模式」
3. 再接 AI 自動產生流程

這樣能降低一次切換到 strict 造成的中斷風險。
