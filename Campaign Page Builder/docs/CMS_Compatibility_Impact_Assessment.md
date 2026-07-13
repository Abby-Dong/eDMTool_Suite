# CMS 平台相容性影響評估 — 輸出 Code 是否影響其他頁面

## 1. 評估問題
針對目前 Campaign Builder 匯出的 HTML/CSS/JS，評估在 CMS 平台上部署時，是否可能影響同站其他頁面呈現與行為。

## 2. 結論摘要
結論是「有機率影響」，但多數屬於「同頁污染風險」，不是天然會污染整個 CMS 全站。

- 若 CMS 以整頁模板方式部署（每頁獨立 HTML）：風險較低
- 若 CMS 以內容片段嵌入既有頁面：風險中高，需做隔離處理

## 3. 風險分級

### 3.1 高風險
1. 全域樣式重設（例如 html, body）
- 會改變宿主頁面的預設間距與行為
- 在片段嵌入情境下，可能影響同頁其他模組

2. 輸出為完整 HTML 文件結構
- 若 CMS 只允許片段嵌入，包含 html/head/body 的內容容易與平台模板衝突

### 3.2 中風險
1. 固定定位與高 z-index 元件
- 固定導覽、浮動元件可能覆蓋 CMS 原生導覽或浮層
- 含大量 !important 時，衝突更難被平台樣式覆寫

2. window 層級事件（load/resize）
- 雖然目前邏輯多以專屬 class 範圍查詢，風險已降低
- 但若後續新增未加 scope 的 selector，仍可能波及宿主頁

### 3.3 低風險
1. 前綴化 class 命名（例如 test-xxxxxx-）
- 這點是正向設計，能明顯降低選擇器碰撞

2. data-style + root 容器策略
- 可把大部分樣式作用範圍限縮在單一區塊中

## 4. 建議落地策略（CMS 友善）

### 4.1 優先策略
1. 輸出 CMS Fragment 版本
- 不輸出 html/head/body
- 只輸出 root 容器 + 受 scope 約束的 style/script

2. 全域 selector 改為 root-scope
- 將 html/body reset 轉為 .project-root 範圍內控制
- 避免改動宿主頁基礎樣式

3. JS 嚴格 scope 化
- 所有 querySelector / querySelectorAll 以 root 容器為起點
- 避免直接掃描 document 全域節點

### 4.2 可選策略
1. iframe 隔離
- 最穩定，不污染宿主頁
- 代價是跨框溝通與 SEO 控制複雜度增加

2. Shadow DOM 封裝
- 可隔離大多數 CSS
- 需評估 CMS 是否允許與既有元件相容性

## 5. 上線前檢查清單
1. 不含 html/head/body（若目標是片段嵌入）
2. 不含 html/body/* 全域 selector
3. 無未加前綴的通用 class（例如 .container、.card）
4. 固定定位元件（position: fixed）與 z-index 有命名空間與可關閉開關
5. window 事件中的 DOM 查詢全部限制在 root 容器
6. 與 CMS 主題頁做同頁混排測試（含 Header、Modal、Breadcrumb、Footer）

## 6. 建議產出規格
建議在 Builder 維持雙輸出模式：

- Full Page Export：給獨立站或整頁落地
- CMS Fragment Export：給 Magnolia、Duda 或其他 CMS 內容區塊嵌入

這樣能同時保留部署彈性與平台安全性。
