# SEM 與 CDP Segment 功能可行性評估

> 評估對象：Marcom Agent Studio（`MarcomAgentStudio.html`）新增 SEM、CDP Segment 兩項功能
> 評估時間：2026/07/13
> 參考資料：`MarcomAgentStudio.html` 原始碼、`01_CDP現況.md` / `cdp_all_in_one_tabs.html`（IoTMart Salesforce Data Cloud 盤點）、使用者提供之 SEM 執行框架

---

## 一、先釐清現況：Marcom Agent Studio 現在實際做了什麼

在談新功能之前，必須先誠實盤點現有基礎，因為新功能的可行性完全取決於它。

**現況**：`MarcomAgentStudio.html` 是一個真正運作的「Campaign 專案管理殼層」，不是 Demo 或純 UI Mockup：

- 有真實的資料模型（`localStorage` key `mas_campaigns_v1`），每個 Campaign 物件包含 `landingPages[] / edms[] / materials[]`，CRUD（新增/改名/複製/刪除）全部是真邏輯。
- 透過 `iframe + postMessage` 真正串接三個既有工具：`edm → ComponentCustomizer.html`、`lp → Campaign Page Builder`、`mm → MarketingMaterialBuilder.html`，資料格式（`cpbProject` / `snapshot` / `mmbProject`）雙向存取皆已驗證可用，甚至做了即時縮圖預覽（hidden iframe + `mas-thumb-load`）。
- **完全沒有 AI / Agent 邏輯**：沒有任何 LLM API 呼叫、沒有對話式輸入、沒有 RAG、沒有 DAM。新建一個 Landing Page / eDM / 平面廣告，產生的都是「空白專案殼」，內容仍要人工進到對應工具裡手刻。
- 建立 Campaign 時只填「名稱」與「Region（Global / KR / EU）」兩個欄位，遠比競賽文件描述的 `campaign_brief`（目標、受眾、產品線、通道）單薄。

**這決定了一件事**：目前整個工具箱是「**純前端、零依賴、無後端、無憑證**」的架構（`README.md` 明文寫「zero-dependency, no server required」）。這個原則在評估 SEM、CDP 兩個新功能時會反覆出現，因為它們天生比 LP/eDM/平面廣告更依賴外部系統。

---

## 二、SEM 功能可行性評估

把你提供的 SEM 四階段流程，逐項對照「這是不是一個前端工具能做的內容產出物」：

| 階段 | 內容 | 能否放進 Marcom Agent Studio？ | 原因 |
|---|---|---|---|
| 1. 追蹤設定（GTM/GA4、轉換定義） | 在**真實網站**上埋代碼、設定轉換事件 | ❌ 不行，這不是內容產出，是網站工程任務 | 這件事發生在 IoTMart 官網/Duda/Magnolia 後台，Marcom Agent Studio 連不到那裡，也不該連（沒有網站佈署權限的架構設計）。最多只能「產出一份追蹤需求文件」給工程團隊，不是「執行」追蹤設定。 |
| 2. 關鍵字清單與架構（核心字、負面字、分組） | 純文字/表格規劃產出物 | ✅ 可行，且與現有工具邏輯高度相似 | 本質上是一份結構化清單（像 `product-database.json` 那樣的資料），沒有跨系統依賴，適合做成新工具。 |
| 3. 廣告文案與額外資訊（標題/描述/Sitelinks/Callouts） | 純文字產出物，有嚴格字數限制 | ✅ 可行，且完全符合這個工具箱的既有 DNA | 這個工具箱最擅長的就是「在嚴格規格限制下產生內容」（例如 MarketingMaterialBuilder 的 10 種像素尺寸）。Google RSA 的標題 30 字×15、描述 90 字×4 限制，是同一種問題。 |
| 4. 承接頁（Landing Page） | 高轉換 Landing Page | ✅ **不用新工具，直接用 Campaign Page Builder** | 這正是 CPB 已經在做的事。真正該做的不是「蓋一個新的 SEM 專用 Landing Page 工具」，而是替 CPB 增加「SEM 模式檢查清單」（訊息一致性、載入速度提醒、避免導去首頁）。 |

**結論：「SEM 功能」不是單一功能，應該拆成三塊各自獨立評估：**

1. **Keyword Planner（新工具，可行）** — 核心字/分組/負面字清單產生器，格式類似 CSV/表格，匯出可貼進 Google Ads Editor 或 Keyword Planner。技術複雜度低（比 MarketingMaterialBuilder 簡單，沒有畫布/圖層問題），可視為「表格編輯器 + 匯出」。
2. **Search Ad Copy Builder（新工具，可行，優先度最高）** — Headline / Description / Sitelink / Callout / Structured Snippet 編輯器，即時字數計數與超字警示，多組 RSA（Responsive Search Ads）變體管理。架構上可以完全比照 `MarketingMaterialBuilder.html` 的模式：一個專案、多組「尺寸」換成多組「Ad Group / RSA 變體」，一樣走 `postMessage` 掛進 Marcom Agent Studio 的 `ASSET_CFG`。
3. **SEM Landing Page 檢查清單（不是新工具，是既有 CPB 的加值功能）** — 在 CPB 建立頁面時，若標記「用途 = SEM Landing Page」，跳出一個檢查清單面板（提醒：訊息與廣告文案一致、產品工程圖不可被裁切、報價與明細分開、避免共用首頁）。

**明確不做（超出這個工具箱的架構邊界）：**

- ❌ **不做**追蹤代碼（GTM/GA4）真的寫進網站——這是網站工程/IT 的工作，不是行銷素材工具的工作。
- ❌ **不做**一鍵發布到 Google Ads——這需要 Google Ads API（OAuth、帳戶授權、預算/出價操作），一旦工具能「真的花錢下廣告」，風險等級和目前「只是產生素材」完全不同，需要獨立的後端服務與權限審查，不建議放進這個零依賴前端工具裡。工具最多做到「產生可複製貼上 / 可匯出 CSV 的文案與關鍵字清單」，由人工貼進 Google Ads Editor。

---

## 三、CDP Segment 功能可行性評估

先說明我從 `01_CDP現況.md` 與 `cdp_all_in_one_tabs.html` 看到的關鍵事實，這決定了整個可行性判斷：

**這兩份檔案是「靜態快照」，不是活的 API 連線。** `cdp_all_in_one_tabs.html` 的資料來源標註「CSV 11」，也就是從 Salesforce Data Cloud 手動匯出 11 份 CSV 後，用 JS 渲染成分頁儀表板——它不會即時查詢 Data Cloud，裡面也沒有任何 API 呼叫的程式碼。目前 IoTMart CDP 有 77 個 Segment（60 已發布、更新頻率從 12h 到手動不等）、5 個 Calculated Insight（RFM 等）、跨 4 個來源系統的身份合併。

這件事對可行性評估至關重要，因為「CDP Segment 功能」實際上有兩種完全不同量級的做法：

### 做法 A：即時串接 Salesforce Data Cloud API（重量級，目前不建議）

真正「連上」CDP，即時查詢 Segment 成員數、觸發 Segment 更新、或把新 Segment 寫回 Data Cloud，需要：

- Salesforce Data Cloud REST/GraphQL API 的 OAuth 憑證
- 一個**後端服務**來安全保存這組憑證（憑證絕對不能放進純前端 HTML，任何人打開瀏覽器 View Source 就看得到）
- IT/資安審查（這個工具現在是「無登入、無憑證、任何人打開網頁就能用」的定位，一旦要串 CDP，等於要接入公司核心客戶資料系統，安全等級整個不同）

**這已經不是「Marcom Agent Studio 加一個功能」的規模，而是「重新設計一部分架構、引進後端」的獨立專案**，不建議現階段做。

### 做法 B：靜態快照整合（輕量級，可行，建議先做這個）

完全比照 Campaign Page Builder 已經在用的模式——它的產品資料庫（607 筆 SKU）就是把 `product-database.json` 整包內嵌進工具裡，不需要即時 API。CDP Segment 可以用同樣手法：

- 由 CDP 團隊定期（例如每月，或有重大異動時）手動匯出 Segment 清單為一份 `segment-library.json`（Segment 名稱、用途說明、所屬站點、更新頻率、參考成員數、上次更新時間）
- Marcom Agent Studio 內嵌這份快照，新增一個「**目標受眾（Segment）選擇器**」——比照 Campaign Page Builder 的 Scene/Product Image Library picker 那種「搜尋 + 縮圖網格」互動模式，改成「搜尋 + 清單」
- 使用情境：建立 Campaign 或個別素材時，可以選一個 Segment 貼標（例如「GLO_ITMEX_Purchased_No Purchase in Over 3M — 購買後3個月無回購」），這個標籤可以：
  - 讓 Campaign Gallery 一眼看出這檔素材是做給誰的
  - 提供「文案語氣提示」——例如選到棄單/沉睡類 Segment，可以在 Search Ad Copy Builder 或 eDM 編輯器旁跳出建議語氣（「喚醒／回購」），選到週年慶購買者感謝類 Segment 則建議感謝語氣。這是「提示」不是「自動生成」，最終文案仍由人工撰寫確認。

**這個做法的邊界很清楚，必須講明白：**

- ✅ 可以：瀏覽/搜尋/選擇 Segment 作為受眾標籤；用 Segment 的「用途說明」給文案語氣建議；在專案裡留存「這份素材是給哪個 Segment」的紀錄。
- ❌ 不行：即時查詢某個 Segment 現在實際有幾人（快照數字一定是舊的，需要在 UI 上明確標示「資料快照時間」，避免被誤認為即時數字）。
- ❌ 不行：在這個工具裡新增/修改 CDP 的 Segment 定義或篩選條件——Segment 邏輯（DMO 欄位、RFM 門檻等）仍必須在 Salesforce Data Cloud 原生介面設定。
- ❌ 不行：從這個工具「觸發」把 Segment 推送去 SFMC 啟動 Journey/發送——這是 Data Cloud → SFMC 既有的 Activation 流程，本來就在 CDP 平台內完成，不需要、也不應該讓一個素材產生工具越權去觸發。

---

## 四、整體功能邊界結論

用一句話講清楚 Marcom Agent Studio 的能力邊界：**它是一個「內容產出與專案管理」工具，不是「投放/發送/資料查詢」工具。** 任何新功能只要符合「產出可交付的素材/文件」都適合放進來；只要牽涉「真的去操作外部系統（發廣告、查即時資料、寫回 CDP、佈署追蹤碼）」，就應該視為獨立專案，而不是這個工具的自然延伸。

| 功能 | 建議做法 | 複雜度 | 是否需要新後端/憑證 |
|---|---|---|---|
| Search Ad Copy Builder | 新工具，比照 MarketingMaterialBuilder 架構掛進 ASSET_CFG | 中 | 否 |
| Keyword Planner（含負面字） | 新工具，表格編輯器 + CSV 匯出 | 低 | 否 |
| SEM Landing Page 檢查清單 | Campaign Page Builder 既有流程加一個提醒面板 | 低 | 否 |
| 追蹤設定（GTM/GA4） | **不做**，產出需求文件轉交工程團隊 | — | — |
| 一鍵發布 Google Ads | **不做**（若未來要做，是獨立的 Google Ads API 專案） | 高 | 是 |
| CDP Segment 選擇器（靜態快照） | 新增受眾標籤功能，比照 Product Image Library 模式 | 低～中 | 否 |
| CDP 即時查詢/寫回/觸發 Activation | **不做**（若未來要做，是獨立的後端 + OAuth + 資安審查專案） | 高 | 是 |

---

## 五、建議分期路徑

1. **Phase A（最快見效）**：Search Ad Copy Builder。與既有 MarketingMaterialBuilder 架構相似度最高，字數限制驗證邏輯直接複用「精確規格」的既有經驗。
2. **Phase B**：Keyword Planner。技術難度低於 Phase A（純表格，無畫布/圖層），可與 Phase A 共用「SEM Campaign」概念。
3. **Phase C**：CDP Segment 靜態快照選擇器。需要 CDP 團隊先產出一份 `segment-library.json` 匯出流程（人工或簡單腳本，非即時 API），工具端開發量不大。
4. **Phase D（觀察，非現階段）**：若組織未來評估要做「真即時 CDP 查詢」或「Google Ads 一鍵發布」，建議另立專案評估後端服務與資安需求，不要塞進現有零依賴前端工具的既定架構裡。

---

## 六、風險提醒

- **靜態快照的「新鮮度」風險**：CDP Segment 快照若沒有固定更新機制，時間一久會嚴重過期（77 個 Segment 中有 12h/24h 更新頻率的，快照卻可能是上個月的），UI 上必須清楚標示快照時間，避免被誤用於即時決策。
- **範圍蔓延風險**：SEM／CDP 涉及的系統（Google Ads、Salesforce Data Cloud、SFMC）都有自己的原生介面與 API。若這個工具嘗試「重做」這些平台已經有的功能（尤其是即時查詢、發布、Activation），會演變成重複造輪子且維護成本失控。建議聚焦在「這些平台之間的空白」——也就是「內容產出」與「跨資產一致性管理」，而不是取代任何一個平台本身。
