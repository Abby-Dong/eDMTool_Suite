# MCAE Text Ver 規格（27 種元件，排除 Survey）

目的：定義 eDM Builder 內每個元件在 MCAE Text Version 的輸出格式。

**欄位命名規則**：括號內為該欄位對應的 `mc:edit` key，是實作時的直接取值來源。
**`[optional]`** = 對應元件有 option toggle，關閉時整行略過，不輸出空白。

---

## 0. 全域輸出規則

1. 元件順序：依 `builderStack` 排序，逐一輸出。
2. 分隔：
  - 主分隔線固定：`----------------------------------------------------------------------`
  - 次分隔線固定：`------------------------------------------------`
  - 元件與元件之間保留 1 空行。
3. 連結格式：
   - 導覽連結（header nav）：`LABEL: URL`
   - 主要 CTA：`Label -> URL`
   - 社群 / 法規連結：`* Label: URL`
4. 條列格式：`* ` 開頭，子行縮排 2 格。
5. 圖片欄位（key 含 `_image`, `_icon`, `_img`）：Text ver 一律略過。
6. 固定前置段：
   ```
   View Online: {{View_Online}}
   ```
7. 固定後置段（footer 元件輸出；若無 footer 則全域補齊）：
   ```
   To unsubscribe, click here: {{Unsubscribe}}
   {{{Organization.Address}}}
   * Privacy Policy: <url>
   * Terms & Conditions: <url>
   * Shopping FAQ: <url>
   ```
8. 不可省略固定字串（依 Checkout eDM.txt）：
  - 開頭品牌行固定輸出：`Advantech IoTMart`
  - Footer 地址段前固定輸出：`Advantech IoTMart`
  - Footer 版權固定輸出：`Copyright © 1983 - 2025 Advantech Co., Ltd.`、`All Rights Reserved`

---

## 1) header（Header）

mc:edit 欄位：`header_link1`（DEALS & OFFERS）、`header_link2`（CONTACT US）

```
Advantech IoTMart

DEALS & OFFERS: [header_link1 href]
CONTACT US: [header_link2 href]

----------------------------------------------------------------------
```

---

## 2) banner-v1（Hero — Full Width）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `hero_eyebrow` | showEyebrow | 上方小標（大寫細字） |
| `hero_title` | 永遠顯示 | 主標題 H1 |
| `hero_subtitle` | showSubtitle | 主文，含 `<strong>` 重點字 |
| `hero_cta` | showCta | CTA 按鈕文字，綁在 `<a href>` |

```
[hero_eyebrow]                              [optional]

[hero_title]
[hero_subtitle]                             [optional]

[hero_cta label] -> [hero_cta href]         [optional]
```

---

## 3) banner-v2（Hero — Split）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `hero_eyebrow` | showEyebrow | 上方小標 |
| `hero_title` | 永遠顯示 | 主標題 H1 |
| `hero_subtitle2` | showBanner2Sub | 副標題（編輯器標籤 "Subtitle"，較大粗體） |
| `hero_subtitle` | showSubtitle | 主文（編輯器標籤 "Content"），可含 `<strong>` |
| `hero_cta` | showCta | CTA |
| `hero_image` | — | 圖片，略過 |

```
[hero_eyebrow]                              [optional]

[hero_title]
[hero_subtitle2]                            [optional]
[hero_subtitle]                             [optional]

[hero_cta label] -> [hero_cta href]         [optional]
```

---

## 4) countdown（Heading — Countdown）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `countdown_text` | 永遠顯示 | 整行文字（前綴 + `<strong>` 日期 + 後綴） |
| `countdown_icon` | showIcon | 圖示圖片，略過 |

```
[countdown_text 全文，如：⏰ Offer Ends: 2026/03/07 23:59 — Don't Miss Out!]
```

備註：`countdown_text` 是單一 mc:edit 區塊，裡面的 `<strong>` 日期 MCAE 自動轉純文字。

---

## 5) section-heading（Heading — Section）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `section_eyebrow` | showEyebrow | 小標 |
| `section_title` | showTitle | 區塊標題 H2 |
| `section_subtitle` | showSubtitle | 說明文字 |

```
[section_eyebrow]                           [optional]
[section_title]                             [optional]
[section_subtitle]                          [optional]
```

---

## 6) products-v1（Product Grid — 2×2）

每個產品 n = 1–4：

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `product{n}_badge1` | showBadges | 徽章 1（如 SALE） |
| `product{n}_badge2` | showBadges | 徽章 2（如 NEW） |
| `product{n}_name` | 永遠顯示 | 產品名稱 |
| `product{n}_desc` | 永遠顯示 | 產品說明 |
| `product{n}_price` | showPrice | 售價 |
| `product{n}_original_price` | showOrigPrice | 原價 |
| `product{n}_cta` | 永遠顯示 | CTA 文字+連結 |
| `product{n}_image` | — | 圖片，略過 |

```
* [product1_badge1] [product1_badge2]       [optional]
  [product1_name]
  [product1_desc]
  [product1_price] (was [product1_original_price])    [optional]
  [product1_cta label] -> [product1_cta href]

（以上重複 4 次，n=1~4；rowCount=1 時只輸出 n=1,2）
```

---

## 7) products-v2（Product Grid — 3-Col）

mc:edit 欄位結構同 products-v1，但只有 n = 1–3（product1、product2、product3）。

```
* [product1_badge1] [product1_badge2]       [optional]
  [product1_name]
  [product1_desc]
  [product1_price] (was [product1_original_price])    [optional]
  [product1_cta label] -> [product1_cta href]

（重複 3 次）
```

---

## 8) image-text-split（Split — Image Left）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `split_eyebrow` | showEyebrow | 小標 |
| `split_title` | showTitle | 標題 H2 |
| `split_subtitle` | showSubtitle | 副標（粗體） |
| `split_body` | showBody | 主文 |
| `split_cta` | showCta | CTA |
| `split_image` | — | 圖片，略過 |

```
[split_eyebrow]                             [optional]
[split_title]                               [optional]
[split_subtitle]                            [optional]
[split_body]                                [optional]

[split_cta label] -> [split_cta href]       [optional]
```

---

## 9) text-image-split（Split — Image Right）

mc:edit 欄位結構同 image-text-split，key 前綴為 `split2_`：
`split2_eyebrow`、`split2_title`、`split2_subtitle`、`split2_body`、`split2_cta`、`split2_image`（略過）

```
[split2_eyebrow]                            [optional]
[split2_title]                              [optional]
[split2_subtitle]                           [optional]
[split2_body]                               [optional]

[split2_cta label] -> [split2_cta href]     [optional]
```

---

## 10) coupon-v1（Promo Code — Single）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `coupon_eyebrow` | showEyebrow | 小標 |
| `coupon_headline` | 永遠顯示 | 主文，折扣金額在 `<span>` 內 |
| `coupon_code` | 永遠顯示 | 優惠碼（等寬大字） |
| `coupon_terms` | showTerms | 使用條款小字 |

⚠️ 此元件**沒有 CTA 按鈕**。

```
[coupon_eyebrow]                            [optional]
[coupon_headline]

Promo Code: [coupon_code]

[coupon_terms]                              [optional]
```

---

## 11) coupon-single（Coupon — Single）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `cpn1_eyebrow` | showEyebrow | 小標 |
| `cpn1_title` | 永遠顯示 | 標題 H2 |
| `cpn1_subtitle` | 永遠顯示 | 說明文字 |
| `cpn1_imgLabel` | showImgText | 圖片區上方小字（如 LIMITED TIME OFFER） |
| `cpn1_imgTitle` | showImgText | 圖片區大字（如 $50 OFF） |
| `cpn1_headline` | 永遠顯示 | 優惠描述（all caps） |
| `cpn1_amount` | 永遠顯示 | 優惠金額（如 $50.00） |
| `cpn1_validity` | showValidity | 有效期限 |
| `cpn1_cta` | showCta | CTA |

```
[cpn1_eyebrow]                              [optional]
[cpn1_title]
[cpn1_subtitle]

[cpn1_imgLabel]: [cpn1_imgTitle]            [optional]
[cpn1_headline]
Amount: [cpn1_amount]
[cpn1_validity]                             [optional]

[cpn1_cta label] -> [cpn1_cta href]         [optional]
```

---

## 12) coupon-v2（Coupon — Dual）

共用 header + 兩張卡：

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `coupon_eyebrow` | showEyebrow | 區塊小標 |
| `coupon_title` | 永遠顯示 | 區塊標題 H2 |
| `coupon_subtitle` | 永遠顯示 | 區塊說明 |
| `coupon1_imgLabel` | showImgText | Card 1 圖片區上方小字 |
| `coupon1_imgTitle` | showImgText | Card 1 圖片區大字 |
| `coupon1_headline` | 永遠顯示 | Card 1 優惠描述 |
| `coupon1_amount` | showAmount | Card 1 金額 |
| `coupon1_validity` | showValidity | Card 1 有效期 |
| `coupon1_cta` | showCta | Card 1 CTA |
| `coupon2_imgLabel` | showImgText | Card 2 圖片區上方小字 |
| `coupon2_imgTitle` | showImgText | Card 2 圖片區大字 |
| `coupon2_headline` | 永遠顯示 | Card 2 優惠描述 |
| `coupon2_amount` | showAmount | Card 2 金額 |
| `coupon2_validity` | showValidity | Card 2 有效期 |
| `coupon2_cta` | showCta | Card 2 CTA |

```
[coupon_eyebrow]                            [optional]
[coupon_title]
[coupon_subtitle]

* [coupon1_imgLabel]: [coupon1_imgTitle]    [optional]
  [coupon1_headline]
  Amount: [coupon1_amount]                  [optional]
  [coupon1_validity]                        [optional]
  [coupon1_cta label] -> [coupon1_cta href] [optional]

* [coupon2_imgLabel]: [coupon2_imgTitle]    [optional]
  [coupon2_headline]
  Amount: [coupon2_amount]                  [optional]
  [coupon2_validity]                        [optional]
  [coupon2_cta label] -> [coupon2_cta href] [optional]
```

---

## 13) promo-code-dual（Promo Code — Dual）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `promo_eyebrow` | showEyebrow | 區塊小標 |
| `promo1_headline` | 永遠顯示 | Card 1 標題 |
| `promo1_tag` | 永遠顯示 | Card 1 標籤（如 BEST DEAL） |
| `promo1_code` | 永遠顯示 | Card 1 優惠碼 |
| `promo1_cta` | 永遠顯示 | Card 1 CTA |
| `promo2_headline` | 永遠顯示 | Card 2 標題 |
| `promo2_tag` | 永遠顯示 | Card 2 標籤 |
| `promo2_code` | 永遠顯示 | Card 2 優惠碼 |
| `promo2_cta` | 永遠顯示 | Card 2 CTA |

```
[promo_eyebrow]                             [optional]

* [promo1_tag] [promo1_headline]
  Code: [promo1_code]
  [promo1_cta label] -> [promo1_cta href]

* [promo2_tag] [promo2_headline]
  Code: [promo2_code]
  [promo2_cta label] -> [promo2_cta href]
```

---

## 14) service-benefits（Icon Grid — 4-Col）

n = 1–4：

| mc:edit key | 說明 |
|---|---|
| `svc{n}_title` | 標題 |
| `svc{n}_desc` | 說明 |
| `svc{n}_icon` | 圖示，略過 |

⚠️ 此元件**沒有獨立 section title** 的 mc:edit 欄位。

```
* [svc1_title]: [svc1_desc]
* [svc2_title]: [svc2_desc]
* [svc3_title]: [svc3_desc]
* [svc4_title]: [svc4_desc]
```

---

## 15) other-activities（Card Grid — 3-Col）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `other_eyebrow` | showEyebrow | 區塊小標 |
| `other_headline` | showEyebrow | 區塊標題（與 showEyebrow 同一 toggle） |
| `activity1_label` | 永遠顯示 | Card 1 分類標籤 |
| `activity1_title` | 永遠顯示 | Card 1 標題 |
| `activity1_desc` | 永遠顯示 | Card 1 說明 |
| `activity1_cta` | showCta | Card 1 CTA |
| `activity2_...` | 同上 | Card 2 |
| `activity3_...` | 同上 | Card 3 |

```
[other_eyebrow]                             [optional]
[other_headline]                            [optional]

* [activity1_label] - [activity1_title]
  [activity1_desc]
  [activity1_cta label] -> [activity1_cta href]       [optional]

* [activity2_label] - [activity2_title]
  [activity2_desc]
  [activity2_cta label] -> [activity2_cta href]       [optional]

* [activity3_label] - [activity3_title]
  [activity3_desc]
  [activity3_cta label] -> [activity3_cta href]       [optional]
```

---

## 16) footer（Footer）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `footer_social{n}_img` | showSocial | 社群圖示（圖片），URL 從 socialIcons 陣列取 |
| `footer_unsubscribe` | 永遠顯示 | 退訂連結行，含 `{{Unsubscribe}}` token |
| `footer_legal_links` | showLegalLinks | Privacy / T&C / FAQ 連結段 |
| `footer_copyright` | 永遠顯示 | 版權文字 |

社群連結 URL 硬碼在元件 `socialIcons` 陣列，依 `socialCount`（1–5）輸出。

```
------------------------------------------------

CONNECT WITH US:
* Facebook: https://www.facebook.com/Advantech.Corp         [依 socialCount]
* YouTube: https://www.youtube.com/@AdvantechCorp
* LinkedIn: https://www.linkedin.com/company/advantech/
* X: https://x.com/Aboredtech                               [optional]
* Instagram: https://www.instagram.com/advantech_corp/      [optional]

------------------------------------------------

To unsubscribe, click here: {{Unsubscribe}}

Advantech IoTMart
{{{Organization.Address}}}

* Privacy Policy: https://www.advantech.com/en/legal/privacy        [showLegalLinks]
* Terms & Conditions: https://www.iotmart.com/.../terms-conditions   [showLegalLinks]
* Shopping FAQ: https://www.iotmart.com/.../faq                      [showLegalLinks]

Copyright © 1983 - 2025 Advantech Co., Ltd.
All Rights Reserved
```

---

## 17) three-col-image-text（Feature Grid — 3-Col）

n = 1–3：

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `col{n}_badge` | showBadges | 徽章（如 NEW, SALE, HOT） |
| `col{n}_title` | 永遠顯示 | 標題 |
| `col{n}_desc` | showDesc | 說明 |
| `col{n}_image` | — | 圖片，略過 |

⚠️ 此元件**沒有 section title** 的 mc:edit 欄位。

```
* [col1_badge] [col1_title]                 [badge optional]
  [col1_desc]                               [optional]

* [col2_badge] [col2_title]
  [col2_desc]                               [optional]

* [col3_badge] [col3_title]
  [col3_desc]                               [optional]
```

---

## 18) single-button-bar（Button Bar — Single）

mc:edit 欄位：`single_btn_cta`（CTA 文字 + `<a href>`）

⚠️ 此元件**只有按鈕，無獨立文字欄位**。

```
[single_btn_cta label] -> [single_btn_cta href]
```

---

## 19) dual-button-bar（Button Bar — Dual）

mc:edit 欄位：`dual_btn1_cta`、`dual_btn2_cta`

`buttonCount=1` 時只有 `dual_btn1_cta`。

```
[dual_btn1_cta label] -> [dual_btn1_cta href]
[dual_btn2_cta label] -> [dual_btn2_cta href]           [buttonCount=2]
```

---

## 20) four-col-image-text（Feature Grid — 4-Col）

n = 1–4，mc:edit 欄位結構同 three-col-image-text（含 `col4_badge`、`col4_title`、`col4_desc`）。

⚠️ 此元件**沒有 section title**。

```
* [col1_badge] [col1_title]: [col1_desc]    [badge/desc optional]
* [col2_badge] [col2_title]: [col2_desc]
* [col3_badge] [col3_title]: [col3_desc]
* [col4_badge] [col4_title]: [col4_desc]
```

---

## 21) three-button-bar（Button Bar — Triple）

mc:edit 欄位：`btn3_cta1`、`btn3_cta2`、`btn3_cta3`

`buttonCount=2` 時略過 `btn3_cta3`。

```
[btn3_cta1 label] -> [btn3_cta1 href]
[btn3_cta2 label] -> [btn3_cta2 href]
[btn3_cta3 label] -> [btn3_cta3 href]                   [buttonCount=3]
```

---

## 22) product-spotlight（Article — Spotlight）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `spot_eyebrow` | 永遠顯示 | 左欄小標（如 Spotlight） |
| `spot_title` | 永遠顯示 | 左欄標題 H2 |
| `spot_body` | 永遠顯示 | 右欄主文（富文字，含 `<br>`、`<strong>`） |
| `spot_image` | showImage | 圖片，略過 |
| `spot_cta` | showCta | CTA |

```
[spot_eyebrow]
[spot_title]

[spot_body（HTML tag 轉純文字）]

[spot_cta label] -> [spot_cta href]                     [optional]
```

---

## 23) product-cards（Card Grid — 2-Col）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `pcards_eyebrow` | 永遠顯示 | 區塊小標 |
| `pcard1_title` | 永遠顯示 | Card 1 標題 H3 |
| `pcard1_body` | 永遠顯示 | Card 1 說明 |
| `pcard1_cta` | showCta | Card 1 CTA |
| `pcard1_image` | showImages | 圖片，略過 |
| `pcard2_...` | 同上 | Card 2 |

```
[pcards_eyebrow]

* [pcard1_title]
  [pcard1_body]
  [pcard1_cta label] -> [pcard1_cta href]               [optional]

* [pcard2_title]
  [pcard2_body]
  [pcard2_cta label] -> [pcard2_cta href]               [optional]
```

---

## 24) product-showcase（Article — Stats）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `showcase_eyebrow` | 永遠顯示 | 小標 |
| `showcase_title` | 永遠顯示 | 標題 H2 |
| `showcase_body` | 永遠顯示 | 主文（富文字） |
| `showcase_num{n}` | 永遠顯示 | 第 n 個數字統計（n = 1 到 specCount） |
| `showcase_label{n}` | 永遠顯示 | 第 n 個統計描述 |

`specCount` 可為 3、4、5（optionMap）。

```
[showcase_eyebrow]
[showcase_title]
[showcase_body（HTML tag 轉純文字）]

Stats:
* [showcase_num1] [showcase_label1]
* [showcase_num2] [showcase_label2]
* [showcase_num3] [showcase_label3]
（specCount=4/5 時繼續追加）
```

---

## 25) grid-2x2-image-text（Icon Grid — 2×2）

n = 1–4：

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `grid2x2_item{n}_title` | 永遠顯示 | 標題 |
| `grid2x2_item{n}_desc` | showDesc | 說明 |
| `grid2x2_img{n}` | — | 圖示，略過 |

```
* [grid2x2_item1_title]: [grid2x2_item1_desc]           [desc optional]
* [grid2x2_item2_title]: [grid2x2_item2_desc]
* [grid2x2_item3_title]: [grid2x2_item3_desc]
* [grid2x2_item4_title]: [grid2x2_item4_desc]
```

---

## 26) grid-3col-image-text（Icon Grid — 3-Col）

n = 1–3：

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `grid3col_item{n}_title` | 永遠顯示 | 標題 |
| `grid3col_item{n}_desc` | showDesc | 說明 |
| `grid3col_img{n}` | — | 圖示，略過 |

```
* [grid3col_item1_title]: [grid3col_item1_desc]          [desc optional]
* [grid3col_item2_title]: [grid3col_item2_desc]
* [grid3col_item3_title]: [grid3col_item3_desc]
```

---

## 27) full-width-image（Full Width Image）

| mc:edit key | optionMap | 說明 |
|---|---|---|
| `fwimg_image` | — | 圖片，略過 |
| `fwimg_link` | showLink | 圖片點擊連結 `<a href>` |

⚠️ 此元件**沒有任何文字欄位**，只輸出連結 URL。

```
[fwimg_link href]                                        [optional]
```

若 `showLink=false`，此元件 Text ver 完全略過。

---

## 附：全元件 mc:edit key 對照表

| # | 元件 id | 文字 mc:edit keys | 略過的圖片 keys |
|---|---|---|---|
| 01 | header | header_link1, header_link2 | header_logo |
| 02 | banner-v1 | hero_eyebrow, hero_title, hero_subtitle, hero_cta | — |
| 03 | banner-v2 | hero_eyebrow, hero_title, hero_subtitle2, hero_subtitle, hero_cta | hero_image |
| 04 | countdown | countdown_text | countdown_icon |
| 05 | section-heading | section_eyebrow, section_title, section_subtitle | — |
| 06 | products-v1 | product{1-4}_badge1/badge2/name/desc/price/original_price/cta | product{1-4}_image |
| 07 | products-v2 | product{1-3}_ (同上) | product{1-3}_image |
| 08 | image-text-split | split_eyebrow, split_title, split_subtitle, split_body, split_cta | split_image |
| 09 | text-image-split | split2_eyebrow, split2_title, split2_subtitle, split2_body, split2_cta | split2_image |
| 10 | coupon-v1 | coupon_eyebrow, coupon_headline, coupon_code, coupon_terms | — |
| 11 | coupon-single | cpn1_eyebrow/title/subtitle/imgLabel/imgTitle/headline/amount/validity/cta | — |
| 12 | coupon-v2 | coupon_eyebrow/title/subtitle, coupon{1-2}_imgLabel/imgTitle/headline/amount/validity/cta | — |
| 13 | promo-code-dual | promo_eyebrow, promo{1-2}_headline/tag/code/cta | — |
| 14 | service-benefits | svc{1-4}_title, svc{1-4}_desc | svc{1-4}_icon |
| 15 | other-activities | other_eyebrow/headline, activity{1-3}_label/title/desc/cta | activity{1-3}_image |
| 16 | footer | footer_unsubscribe, footer_legal_links, footer_copyright | footer_social{n}_img |
| 17 | three-col-image-text | col{1-3}_badge/title/desc | col{1-3}_image |
| 18 | single-button-bar | single_btn_cta | — |
| 19 | dual-button-bar | dual_btn1_cta, dual_btn2_cta | — |
| 20 | four-col-image-text | col{1-4}_badge/title/desc | col{1-4}_image |
| 21 | three-button-bar | btn3_cta1, btn3_cta2, btn3_cta3 | — |
| 22 | product-spotlight | spot_eyebrow, spot_title, spot_body, spot_cta | spot_image |
| 23 | product-cards | pcards_eyebrow, pcard{1-2}_title/body/cta | pcard{1-2}_image |
| 24 | product-showcase | showcase_eyebrow/title/body, showcase_num{1-5}, showcase_label{1-5} | — |
| 25 | grid-2x2-image-text | grid2x2_item{1-4}_title, grid2x2_item{1-4}_desc | grid2x2_img{1-4} |
| 26 | grid-3col-image-text | grid3col_item{1-3}_title, grid3col_item{1-3}_desc | grid3col_img{1-3} |
| 27 | full-width-image | fwimg_link | fwimg_image |
