# CSS 分層規範 — base 共通結構 / tail 視覺差異

## 1. 目的
讓多個 style（如 `clean-pro`、`cyber-green`）共用同一套版面結構，避免「同一條規則維護兩份、改一邊漏另一邊」。
原則一句話：**結構放 base、視覺差異放 tail**。

## 2. 檔案與建置順序
原始碼位於 `styles-src/`，建置產物位於 `dist/`（由腳本生成，**不可手改**）。

每個 style 的最終 CSS 由以下三段依序串接（見 `scripts/build-cpb-styles.sh`）：

```
<style>.tokens.css   → 變數（顏色、半徑、字型等 design token）
cpb-style-base.css   → 共通結構（所有 style 共用）
<style>.tail.css     → 該 style 專屬視覺差異
```

實際輸出：

- `dist/cpb-style-clean-pro.css`  = `cpb-style-clean-pro.tokens.css` + `cpb-style-base.css` + `cpb-style-clean-pro.tail.css`
- `dist/cpb-style-cyber-green.css` = `cpb-style-cyber-green.tokens.css` + `cpb-style-base.css` + `cpb-style-cyber-green.tail.css`

建置指令（需在 `Campaign Page Builder/` 目錄下執行）：

```bash
./scripts/build-cpb-styles.sh
```

會重生 `dist/*.css` 與 `dist/cpb-style-css-data.js`。

## 3. 選擇器與覆寫規則（為什麼安全）
- base 一律使用**不帶 style 名稱**的屬性選擇器：`[data-style] .cpb-xxx`
- tail 一律使用**帶 style 名稱**的屬性選擇器：`[data-style="cyber-green"] .cpb-xxx`
- 兩者特異性相同，但 tail 在串接順序中排在 base 之後 → **平手時 tail 勝出**。

因此「共通規則放 base、視覺差異放 tail 覆寫」可正確生效，不會被蓋不掉，也不需要 `!important` 來搶權重。

## 4. 什麼放 base、什麼放 tail

### 4.1 放 base（共通結構）
凡是兩個（含以上）style **逐字相同**的規則，一律放 base：
- 版面 layout：grid / flex 結構、欄位比例、`gap`、對齊
- 內容寬度、定位（`position` / `z-index` / `overflow`）
- 元件結構：CTA group、圖片區塊、文字尺寸與間距（字級、`margin`）
- 響應式 `@media`：斷點收合、順序對調
- 形狀幾何：mask 形狀（`border-radius`、`clip-path`、`padding`）

### 4.2 放 tail（視覺差異）
凡是各 style **不同**的視覺表現，留在 tail：
- overlay / 遮罩底色（`::before` / `::after` 疊層）
- gradient（漸層背景、漸層文字 `background-clip: text`）
- 特效色系、neon glow、網格光暈
- 主題色相關的 mode 覆寫（light / dark 專屬色）

### 4.3 灰色地帶處理
- **顏色不同但結構相同**：結構放 base，顏色改用 CSS 變數（如 `var(--cpb-hero-mask-color, fallback)`），各 style 在 tail/tokens 指定變數值。
- **多數相同、僅一兩個屬性不同**（如 headline 字級相同、僅顏色不同）：相同屬性放 base，差異屬性在 tail 覆寫即可。

## 5. 範例：Hero Banner（B1）
此規範已套用於 Hero 區塊。

放在 `cpb-style-base.css`（`[data-style]`）：
- `.cpb-hero` 定位、`.cpb-hero-inner` grid、split / full-text 欄位
- subtitle / headline 的字級與 `margin`
- `.cpb-hero-body`、`.cpb-hero-cta-group`、`.cpb-hero-image`
- 響應式（≤1024 收單欄、≤767 順序對調）
- mask 形狀（arc、point-down）

留在各 `*.tail.css`：
- `clean-pro`：mask-wrap 底色、白色 image overlay `::after`、dark 模式 `content:none`
- `cyber-green`：mask-wrap 底色、headline gradient 變數、light 模式變數、`::before` 網格光暈、neon image overlay（含 dark 變體）、`@supports` 漸層文字

## 6. 新增 / 修改規則的 SOP
1. 判斷該規則是「結構」還是「視覺差異」（用第 4 節準則）。
2. 結構 → 寫在 `cpb-style-base.css`，選擇器用 `[data-style] .cpb-xxx`。
3. 視覺差異 → 寫在對應 `*.tail.css`，選擇器用 `[data-style="<style>"] .cpb-xxx`。
4. 改既有結構時，**只改 base 一處**即可同步套用到所有 style。
5. 執行 `./scripts/build-cpb-styles.sh` 重生 `dist/`。
6. 驗證：對三個原始碼檔跑 lint（無錯誤）；確認 tail 已無結構殘留、base 規則在各 `dist/*.css` 中存在。

## 7. 區塊對照清單（base vs tail 規則矩陣）

> 範圍：`Banner(B1)` / `D1` / `D2` / `D3` / `P2` / `P3`。
> 判讀方式：base 放共通骨架；tail 只放 style-specific 視覺或行為差異。

| 區塊 | base（共通結構，必須抽離） | clean-pro tail（只留差異） | cyber-green tail（只留差異） |
|---|---|---|---|
| Banner（B1 Hero） | `cpb-hero` 容器定位、`cpb-hero-inner` grid、split/full-text 版型、`cpb-hero-text` 字級與間距、`cpb-hero-cta-group` 佈局、`cpb-hero-image` 響應式、`data-mask="arc/point-down"` 幾何、split 在 `<=1024/<=767` 的結構切換 | `cpb-hero-mask-wrap` 背景色、`data-bgtype="image"::after` 白色柔光、dark 下取消該 overlay | `cpb-hero-mask-wrap` 背景色、headline 漸層文字與 `@supports`、`::before` 網格光暈、image neon overlay（含 dark 變體） |
| D1 Feature Cards Grid | `cpb-feature-head` 共通排版、`cpb-feature-cards[data-cols]` 欄位規則（2/3/4/6/8/scroll）、scroll-snap 結構、`<=1024` 收斂為 2 欄、`<=600` 收斂為 1 欄 | `cpb-feature-divider` 寬度/顏色（80px 實色） | `cpb-feature-divider` 寬度/漸層/glow（120px） |
| D2 Feature Cards Split | `cpb-feature-split` 主 grid、desktop sticky head、`cpb-feature-split-cards` 欄位與 gap 斷點、split dark 共通字色 | 無 D2 專屬規則（維持空白是正確狀態） | `<=1024` 轉單欄 + head 改 static + order 重排、card hover 邊框與 glow |
| D3 Feature Gallery | `cpb-feature-gallery-grid` 4/2/1 欄、`card/img/content` 定位骨架、共通 hover 機制（非 hover 灰階、hover 圖片縮放、內容展開）、mobile 展開策略、dark headline/body 共通色 | card 高度策略（340/220/240）、img 色調、`::before` 深色遮罩、content 背景、title/desc/label 字體視覺、hover 色調微調、dark label | card 高度策略（320/190/180）、**grid gap: 24px**、邊框/圓角/陰影/浮起、`::before` 漸層、content 背景、title/desc/label 視覺、hover glow 與 desc 動態、dark subtitle |
| P2 Product Showcase | `wrap/left/slider-wrapper/slider` 結構、card 基礎尺寸與排版、`card-img/title/desc/cta` 共通骨架、tablet/mobile 版型切換、scrollbar 顯示骨架（非色彩） | card 背景與 hover 反轉、text/CTA 色彩、mode 下顏色覆寫、desktop 節奏（section/left/slider padding）、tablet scrollbar 顏色 | section 背景與 mode 變體、`--cpb-p2-*` 視覺變數、card 邊框/圓角/陰影與 hover glow、desktop 節奏（section/left padding）、tablet scrollbar 顏色 |
| P3 Product Series Matrix | `head/grid/col` 版面骨架、`intro` 容器定位與層級結構（含 `::before/::after` 框架）、`tag/image/title/subtitle/bullets` 共通排版、`item` 列表結構（image/content/name/desc/cta）、`<=1024/<=767` 共通收斂規則 | `--cpb-p3-*` 視覺變數、intro 視覺語言（藍系漸層/overlay、2px 直角）、light mode 色系覆寫、subtitle/bullets 色彩、item-name/cta 字重、cta hover 藍色策略、`<=1024` 的 `grid-template-rows: clamp(...)` 特化 | `--cpb-p3-*` 視覺變數、intro 視覺語言（綠系漸層/邊框/14px 圓角）、tag 膠囊風格、subtitle/bullets 色彩、item-name/cta 字重、cta hover neon 綠策略、`<=1024` 的 `min-height: 0` 特化 |

### 7.1 元件級處理清單（實作時逐項勾）
- `Layout`: `display / grid / flex / width / min-width / order / position` 在兩個 style 相同時，放 base。
- `Responsive`: 同斷點且同規則才抽 base；斷點不同（例如 600 vs 720）或策略不同時留 tail。
- `Typography`: 字級/行高/margin 若兩邊一致可進 base；字重、字色、字體風格通常留 tail。
- `Visual`: 背景、漸層、陰影、border、radius、glow、overlay 一律留 tail。
- `State`: `:hover/:focus/:active` 若只影響視覺（顏色/陰影）留 tail；若屬共通交互機制可放 base。
- `Mode`: `data-mode` 顏色覆寫與主題變數預設留 tail；僅共通文字可讀性規則可放 base。

### 7.2 快速檢查點
- 若某規則同時存在兩個 tail 且內容相同，優先評估抽回 base。
- 若規則涉及 `position / grid / flex / media` 結構，預設應在 base。
- 若規則主要是色彩、陰影、漸層、特效或風格字重，預設留在 tail。
- D2 在 clean-pro 沒有 style-specific 規則屬正常狀態，不需為了對稱而新增空規則。
- D3 的 `cyber-green` 需保留 `cpb-feature-gallery-grid { gap: 24px; }` 於 tail，不可誤抽到共通值 0。

## 8. 反面案例（要避免）
- ❌ 在每個 tail 各複製一份相同的 layout / responsive / mask 規則 → 改一次會漏另一份。
- ❌ 直接編輯 `dist/*.css` 或 `dist/cpb-style-css-data.js` → 下次 build 會被覆蓋。
- ❌ 用 `!important` 硬搶權重來模擬覆寫 → 串接順序已保證 tail 勝出，不需要。
