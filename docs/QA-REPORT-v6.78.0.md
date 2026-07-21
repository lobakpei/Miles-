# AcreMiles v6.78.0 Zone 10 QA

日期：2026-07-21
範圍：Zone 10 文章、RTW Demo、CSV、核實庫、分享 metadata、版本及正式網站
正式路線：`HKG→MAD→CDG ⤳ LHR→JFK→BOS→PIT→ORD→SEA ⤳ YVR→NRT→TPE→HKG`

## 計算基準

距離使用 AcreMiles 規劃器同一個 WGS84 大圓近似算法（地球半徑 3,958.8 statute miles，每段四捨五入後相加）。自費開口段不計入總距離。

| # | 獎勵航段 | 航司 | 到達後用途 | 哩 |
|---:|---|---|---|---:|
| 1 | HKG→MAD | CX | 停留 MAD | 6,529 |
| 2 | MAD→CDG | IB | 開口 CDG⤳LHR | 661 |
| 3 | LHR→JFK | BA | 停留 JFK | 3,442 |
| 4 | JFK→BOS | AA | 停留 BOS | 186 |
| 5 | BOS→PIT | AA | 轉機 PIT | 495 |
| 6 | PIT→ORD | AA | 轉機 ORD | 412 |
| 7 | ORD→SEA | AA | 開口 SEA⤳YVR | 1,716 |
| 8 | YVR→NRT | JL | 停留 NRT | 4,662 |
| 9 | NRT→TPE | JL | 停留 TPE | 1,356 |
| 10 | TPE→HKG | CX | 終點 | 501 |
|  | **合計** |  | **5 停／2 轉／2 開** | **19,960** |

距 20,000 哩上限：**40 哩**。規劃器分區：Zone 10；商務所需：**230,000 里**。

## 航線及營運者來源

| 航段 | 核實結果 | 主要來源 |
|---|---|---|
| HKG→MAD / CX | 國泰現行直航 | [Cathay HKG–MAD](https://flights.cathaypacific.com/destinations/en_HK/flights-from-hong-kong-to-madrid) |
| MAD→CDG / IB | Iberia 現行馬德里至巴黎航線 | [Iberia MAD–Paris](https://www.iberia.com/us/cheap-flights/Madrid-Paris/) |
| LHR→JFK / BA | BA London–New York 直航 | [British Airways Reward Flights](https://hotline.britishairways.com/content/en/gr/the-british-airways-club/avios/spending-avios/reward-flights) |
| JFK→BOS / AA | AA 現行紐約至波士頓航線；正式規劃用 JFK | [American Airlines New York–Boston](https://www.aa.com/en-us/flights-from-new-york-to-boston) |
| BOS→PIT / AA | AA 現行航線 | [American Airlines Boston–Pittsburgh](https://www.aa.com/en-us/flights-from-boston-to-pittsburgh) |
| PIT→ORD / AA | AA 官方頁明列 PIT→ORD | [American Airlines Pittsburgh–Chicago](https://www.aa.com/en-us/flights-from-pittsburgh-to-chicago) |
| ORD→SEA / AA | AA 官方頁明列 ORD→SEA、多班次 | [American Airlines Chicago–Seattle](https://www.aa.com/en-us/flights-from-chicago-to-seattle) |
| YVR→NRT / JL | JL17 每日 YVR→NRT | [JAL U.S.／Canada schedule](https://www.jal.co.jp/flights/en-us/flight-resumption) |
| NRT→TPE / JL | FY2026 表列 JL809／JL802 每日 | [JAL FY2026 schedule PDF](https://press.jal.co.jp/en/items/uploads/JALJTA%20Announces%20FY2026%20Schedule%20on%20International%20Network-3.pdf) |
| TPE→HKG / CX | 國泰現行直航 | [Cathay TPE–HKG](https://flights.cathaypacific.com/destinations/en_TW/flights-from-taipei-to-hong-kong) |

美國短途部分班次可能由 American Eagle regional partner 實際營運。[oneworld 官方 American Airlines 頁](https://www.oneworld.com/members/american-airlines)將 American Eagle 列為 AA regional partners；[Cathay partner 頁](https://www.cathaypacific.com/cx/en_JP/our-partners/american-airlines.html)亦明列由 American Eagle affiliate 營運嘅 AA marketed flights。呢個同聯盟外 codeshare 不同，但指定班次及兌換資格仍要出票前確認。

## 同步檢查範圍

- `index.html`：文章、五線總覽、搜尋索引、PIT 機場、`OW_EXTRA_ROUTES`、`OW_VERIFIED`、`OW_ZONE_DEMOS.z10`、版本 marker。
- `docs/ZONE-10-ROUTE.csv`：10 航段、2 開口、逐段距離及用途。
- `share-meta.js`／`share/rtw-zone-10/index.html`：標題、描述、圖片及 OG metadata。
- `sw.js`：v6.78.0 cache 及現行 Zone 10 thumbnail。
- `scripts/verify.js`／`scripts/browser-qa.js`：19,960、10 段、5／2／2、CSV drift、現行封面。
- 主交接、roadmap、RTW 審計及 changelog。

## 測試結果

| Gate | 結果 |
|---|---|
| `node scripts/verify.js index.html` | 全部 invariant 通過；包括 10 段白名單、19,960、Zone 10／230,000、5／2／2、CSV drift、版本同步及舊距離掃描 |
| `node scripts/test-consent-gate.js` | 通過 |
| `node scripts/audit-freshness.js` | 0 errors；7 個既有到期提醒，同 Zone 10 無關 |
| `node scripts/smoke-http.js` | 109／109 paths OK |
| `node scripts/test-social-previews.js` | 64 個 crawler page responses、32 張預覽圖，全部通過 |
| 舊 Zone 10 數字掃描 | 現行程式、分享 metadata 及正式路線資料冇殘留 19,793／被取代嘅候選距離；研究紀錄只保留淘汰原因 |
| GitHub 發布 | PR #5 已合併；merge commit `8494c7342be35d4a43d6519519104f532781e775` |
| GitHub Pages 文章 | v6.78.0、19,960 哩、完整路線、5／2／2、現有封面全部實際顯示；封面成功解碼 |
| GitHub Pages 規劃器 | 10 段 IATA、CX／IB／BA／AA／JL、逐段距離、10／10 已核實狀態、總距離、Zone 10 同 230,000 里全部一致 |
| Production 舊資料掃描 | 現行 DOM 冇 19,793、19,496 或 `NRT→KIX`；冇 `acremiles.app` 來源 JavaScript error |

本地環境冇可執行 Chromium，所以未重跑完整 360／768／1440 screenshot／axe suite；呢項仍列入發布後跨 viewport 回歸。發布後已用公開 Chromium 實際打開文章、載入 DIY 規劃器、核對每段 IATA／航司／距離／狀態及封面，核心 Zone 10 production 流程通過。
