# Product Card 連結 404 自動轉 Search 備忘錄

## 1. 背景
目前 Product Card 連結規則是：

- 有 SFCCSKU 時，優先導向 PDP
- SFCCSKU 為空時，導向 Search（用 Part Number）

但實務上仍可能發生：

- SFCCSKU 存在，但對應 PDP 已下架或區域不存在
- 使用者點到 PDP 後出現 404

目標是讓使用者不會卡在 404，而是自動導回可搜尋結果頁，確保導流不中斷。

## 2. 現況（程式端）
現有連結組裝邏輯已在：

- [Campaign Page Builder/CampaignPageBuilder.html](Campaign Page Builder/CampaignPageBuilder.html)
- [Campaign Page Builder/ProductImagePartNumberGallery.html](Campaign Page Builder/ProductImagePartNumberGallery.html)

資料來源在：

- [Campaign Page Builder/product-database.json](Campaign Page Builder/product-database.json)
- [Campaign Page Builder/product-database.js](Campaign Page Builder/product-database.js)

## 3. 區域 URL 規則（既定）

- Global PDP: https://buy.advantech.com/{partnumber}/p
- Global Search: https://buy.advantech.com/?text={partnumber}

- EU PDP: https://buy-esi.advantech.eu/{partnumber}/p
- EU Search: https://buy-esi.advantech.eu/?text={partnumber}

- KR PDP: https://buy-kr.advantech.com/{partnumber}/p
- KR Search: https://buy-kr.advantech.com/search?text={partnumber}

## 4. 需求定義（新增）
當使用者點擊 PDP 發生 404 時，應自動導向同區域 Search URL（帶 Part Number）。

Fallback 優先序：

1. 先嘗試 PDP（若有 SFCCSKU）
2. PDP 404 時自動轉 Search（同區域）
3. 無 SFCCSKU 時直接走 Search（維持現況）

## 5. 建議實作方式
建議採平台端 redirect，而非前端直接判斷 404：

- 新增中介連結端點（例如 /product-link）
- 輸入參數：store, partnumber, sfccsku
- 由服務端檢查 PDP 是否可用
- 可用：302 到 PDP
- 不可用或 404：302 到 Search

前端 Product Card 統一只打中介端點。

優點：

- 避免跨網域前端無法可靠判斷 404
- 規則集中管理，未來改 URL 模板只改一處
- 可加追蹤與統計（fallback 發生率）

## 6. 驗收標準（Acceptance Criteria）

- 有 SFCCSKU 且 PDP 可開：進 PDP
- 有 SFCCSKU 但 PDP 404：自動轉 Search，且帶正確 Part Number
- 無 SFCCSKU：直接 Search
- Global / EU / KR 三區皆符合各自 URL 規則
- 不出現白頁或停留 404

## 7. 監控建議
至少記錄以下欄位：

- store
- partnumber
- sfccsku
- initial_target (pdp/search)
- fallback_triggered (true/false)
- final_url
- timestamp

可用於定期清理資料庫中失效 SKU 或異常商品連結。
