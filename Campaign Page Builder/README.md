# Campaign Page Builder

純前端（HTML + JS + localStorage）的活動著陸頁產生器。開啟 `CampaignPageBuilder.html` 即可使用，匯出為單檔 standalone HTML。

## 目錄結構

```
CampaignPageBuilder.html   ← 入口（瀏覽器開這支）
README.md                  ← 本文件

src/                       ← 手寫的程式模組（要改就改這裡）
  cpb-core.js              ← 常數 / localStorage / 共用工具
  cpb-state.js             ← CPB.state 狀態容器 / 歷史紀錄
  cpb-styles.js            ← Style 註冊表（新增 style 從這裡開始）
  cpb-sections.js          ← Section 目錄與渲染樣板
  cpb-canvas.js            ← 畫布 / 拖放 / 預覽寬度
  cpb-properties.js        ← 右側屬性面板 / 產品資料庫
  cpb-inline-edit.js       ← 行內編輯
  cpb-export.js            ← 匯出 standalone HTML
  cpb-gallery.js           ← 專案列表 / 縮圖
  cpb-upload.js            ← 圖片上傳 / 裁切
  cpb-color-picker.js      ← 色彩選擇器
  cpb-fixed-chrome.js      ← 固定 Header / Footer（不受 Style 影響）

styles-src/                ← 樣式「原料」（要改樣式就改這裡）
  cpb-style-base.css                共用基底規則
  cpb-style-clean-pro.tokens.css    Style01 變數
  cpb-style-clean-pro.tail.css      Style01 差異規則
  cpb-style-cyber-green.tokens.css  Style02 變數
  cpb-style-cyber-green.tail.css    Style02 差異規則

dist/                      ← build 產生的「成品」⚠️ 勿手改
  cpb-style-clean-pro.css           = base + tokens + tail 串接結果
  cpb-style-cyber-green.css
  cpb-style-css-data.js             成品 CSS 內嵌成 JS 字串（供匯出 / file:// fallback）
  product-database.js               產品資料庫內嵌成 JS

data/                      ← 資料來源
  product-database.json             產品資料庫（fetch fallback 用）

scripts/                   ← build 工具
  build-cpb-styles.sh               styles-src → dist（CSS + css-data.js）
  build-cpb-style-css-data.js       上者內部呼叫

docs/                      ← 規劃與技術備忘文件
```

## 工作流（重要）

> 黃金規則：**只改 `src/` 與 `styles-src/`；`dist/` 是 build 產物，永遠不要手改**（下次 build 會覆蓋）。

### 改樣式（顏色 / 間距 / 規則）
1. 編輯 `styles-src/` 對應的 `*.tokens.css`（變數）或 `*.tail.css`（規則）
2. 執行 `./scripts/build-cpb-styles.sh`
3. 它會重生 `dist/cpb-style-*.css` 與 `dist/cpb-style-css-data.js`

### 新增一個 Style
1. 在 `styles-src/` 新增 `<id>.tokens.css`（約 40 個變數）與 `<id>.tail.css`（差異規則）
2. 在 `src/cpb-styles.js` 的 `STYLES` 陣列加一筆（`cssFile` 指向 `dist/<id>.css`）
3. 在 `scripts/build-cpb-styles.sh` 加一段 `cat tokens + base + tail > dist/<id>.css`
4. 在 `CampaignPageBuilder.html` 加 `<link rel="stylesheet" href="dist/<id>.css">`
5. 執行 `./scripts/build-cpb-styles.sh`

### 產品資料庫（單一資料來源）
1. `data/product-database.json` 與 `dist/product-database.js` 為唯一有效資料來源
2. 更新時只允許從已確認的完整 JSON 同步到 JS 包裝檔
3. 禁止使用 template 重新抓取覆蓋資料庫
