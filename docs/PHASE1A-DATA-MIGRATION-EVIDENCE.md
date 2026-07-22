# Phase 1A — Card Data Migration Evidence

核對日期：2026-07-23（香港）

Repository：`lobakpei/Miles-`

Phase 1 parent baseline：`ba8f6db0b087275f63785468ccec424a9d5ad1e2`

正式版本：v6.79.0

範圍：純資料搬遷；冇更新任何卡數字、優惠狀態、UI 或 Engine 公式

Phase 0 immutable optimizer／product／DOM／storage snapshots 保留原 provenance `fb63103778831688b89bf5e4b08dbe1882c2f354`；Phase 0 只改 docs／tests，並以 `ba8f6db0…` 合併，所以兩個 commit 嘅正式產品 surface 相同。Phase 1 新增嘅三份 migration fixtures 則明確以 `ba8f6db0…` 為 parent baseline。

## 1. Data Migration

| 資料 | 搬遷前位置 | 搬遷後位置 | 數值有冇改變 | Regression |
|---|---|---|---|---|
| 9 張銀行官方卡資料 | `index.html` → `DEFAULT_CARDS`、`CARD_PUBLIC_DETAILS` | `data/cards-official.js` | 冇；legacy runtime view 逐欄完全一致 | `cardData` PASS；22／22 fixtures PASS |
| 渠道優惠 | `index.html` → 8 個 `CHANNEL_OFFERS`，另有 3 個只藏於 note 嘅渠道項目 | `data/card-channels.js#records`：11 個 machine-readable records；8 個 `runtimeOffer` records 衍生舊 UI view | 舊 8 個 runtime values 完全一致；3 個遺漏項目只新增 provenance／unknown record，唔入推薦 | `cardData` PASS；freshness 直接讀 records，0 errors |
| 官方 audit sources 及核實紀錄 | 每張 inline card 嘅 `sourceVerifiedAt`、`sourceStatus`、`sourceDocs`，另有 4 個只藏於 note 嘅官方推廣 claim | `data/source-registry.js`；產品／申請 `url` 仍跟 card runtime record | 原值只搬位置；4 個 claim 明確標 `unknown`，第三方 claim 不升格為官方證據 | registry 9／9 coverage；promotion provenance PASS |
| 非官方 `applyWeeks` | inline card 內未標示來源嘅 2／3 星期 estimate | `source-registry.js#modelAssumptions.applyWeeks`，`sourceType: none`、`status: unknown`；aggregator 兼容注入 | 冇；排序／顯示值完全一致，但不再冒充官方欄位 | `cardData`／22 fixtures PASS；official-file exclusion PASS |
| 第二張卡乘數 | AE card overrides 0／0.81＋Engine bank rules 0／0.25／0.65 | `source-registry.js#modelAssumptions`，全部 `status: unknown`；card overrides 原值注入，bank rule 只記 provenance | 冇改任何值或公式 | `cardData`／22 fixtures PASS；unknown provenance gate PASS |
| 年費豁免實務 | Citi PM／DBS／大新／HSBC VS inline `feeWaivable`／note | `source-registry.js#modelAssumptions.feeWaiver`，逐卡 `unknown`；aggregator 原值注入 | 冇；DBS 仍按 v6.79.0 舊值經過 HK$3,000 gate，Stage B 只報告、不擅改公式 | `cardData`／22 fixtures PASS；official-file exclusion PASS |
| 卡頁生成 slug／image／status | generator hardcoded card ID/file/image maps；status 隱含 | 每張卡自己嘅 `slug`、`image`、`status` | 新增生成 metadata；公開輸出值冇變 | 9 unique slugs/images/status PASS；generated 33／33 零 drift |
| Browser／Node 共用資料 view | `bm-core` 內直接建構 | `data/index.js` 驗證、hydrate，再由 `index.html` 載入 | 冇；兼容 view 同搬遷前完全一致 | direct-data/runtime equality PASS |
| 渠道文字與官方卡責任 | 5 張卡 note 內混有官方＋平台週更 presentation prose | structured channel records 已分開；mixed prose 隔離於 `card-channels.js#legacyRuntimeText`，aggregator 兼容重組 | runtime 文字冇變；legacy presentation debt 明確保留 | `cardData`、normalized index source 及可見 surface PASS |

## 2. 明確允許嘅結構差異

| 路徑 | Raw diff | 原因 | 產品 drift gate |
|---|---|---|---|
| `index.html` | 有 | 移除 inline card/channel literals；加入 4 個 data scripts；share path 由 card slug 推導 | 完整非 script 可見 surface SHA 相同；除批准 wiring 外 normalized index source SHA 相同；DOM／22 fixtures 相同 |
| `sw.js` | 有 | precache 新增 4 個 data scripts，確保 PWA 離線仍可啟動 | 移除四個批准 asset entries 後同 baseline 完全一致；版本同策略冇改 |
| `manifest.json` | 冇 | 不屬資料搬遷 | exact file PASS |
| `cards/**` | 冇 | generator 直接讀資料後輸出仍完全相同 | 10 個檔案 exact hashes PASS |
| `share/**` | 冇 | 無需改分享輸出 | 23 個檔案 exact hashes PASS |
| `img/**` | 冇 | 卡 image 改為資料欄位，但資產本身不變 | exact tree PASS |

Raw file diff 唔等於 UI drift。Stage A 刻意唔將新 raw `index.html` hash 寫入舊 product snapshot；改用兩個 immutable、以 `ba8f6db0…` 生成嘅 migration fixtures，任何超出批准 wiring 嘅 source change 都會令 Regression Lock FAIL。呢啲係靜態 parity 證據，唔等同真 browser runtime／視覺／載入時序測試。

## 3. Immutable migration evidence

| Gate | Baseline | After | 結果 |
|---|---:|---:|---|
| 可見 surface（移除全部 scripts、只 collapse whitespace） | 313,610 bytes；`e0f0ff79bd0f5af3673667abe051566247fd1f38f9f48a3956c28cb461542dd0` | 同左 | 零 drift |
| Normalized index source（只替換批准嘅 data/channel/share wiring blocks） | 624,402 bytes；`95de0695ca061c417cd10909abf578a7c0b6ad3fb4c4ae983f09a0aa49393155` | 同左 | 靜態零 drift |
| Optimizer fixtures | 22 | 22 | 逐項完全一致 |
| Generated outputs | 33 | 33 | 逐檔 bytes／SHA-256 完全一致 |
| DOM／bottom nav／critical elements | Phase 0 snapshot | semantic compare | 零 drift |
| localStorage | 16 referenced／16 reset | 同左 | 零 drift |

Fixtures：

- `tests/fixtures/card-data-v6.79.0.json`
- `tests/fixtures/index-behavior-v6.79.0.json`
- `tests/fixtures/visible-surface-v6.79.0.json`

三份均屬 immutable migration baseline；`node scripts/regression-lock.js --write` 不會覆寫。

## 4. 執行路徑

- `index.html` 依次載入 `source-registry.js` → `cards-official.js` → `card-channels.js` → `index.js`，再執行原有 `bm-core`。
- `scripts/generate-card-pages.js` 直接 `require('../data')`；已移除 generator 內 card ID/file/image maps。
- `scripts/audit-freshness.js` 直接 `require('../data')`。
- `scripts/verify.js` 同 `scripts/regression-lock.js` 直接 import data，再將同一份 view 注入原有 core。
- `scripts/smoke-http.js` 自動收集 `data/**`；`sw.js` precache 四個 runtime data assets。

## 5. Stage A 驗收

| 驗收 | 結果 |
|---|---|
| 22／22 optimizer fixtures | PASS，零 drift |
| `cards/**`＋`share/**` generated output | PASS，33／33 零 drift |
| 卡排序及推薦結果 | PASS，由 22 fixtures 逐項鎖定 |
| 靜態 UI markup／DOM parity | PASS，可見 surface／normalized index source／DOM 三重零 drift |
| 真 browser runtime flow、四個 blocking scripts 載入 | PASS；同一 headless Chromium 分別對 baseline／candidate 跑現有 `browser-qa.js`，兩邊各 59／59，五個 viewport 無 JS error，主要 bounding boxes／流程結果一致 |
| Browser screenshot parity | 11 張中 8 張 raw PNG exact；其餘 3 張 normalized RMSE 0.0012–0.0055，重跑時兩組已知 raster hashes 會互換，屬圖片／gradient capture timing；人工檢視無 layout／content drift。靜態 markup／CSS source 另由 exact normalized hash 鎖定 |
| PWA startup／offline reload | PASS；四個 data assets 精確一次列入 SW precache，HTTP 117／117；baseline／candidate 各自裝好 SW 後斷網 reload，兩邊均載入 9 cards／8 offers、0 runtime errors |
| regex 抽信用卡資料 | 已移除；只保留抽原有 core code 作 Node engine 測試，信用卡資料直接 import |
| `node scripts/regression-lock.js` | PASS，8／8 groups；optimizer 22／22 |
| `node scripts/verify.js index.html` | PASS，全部 invariants；11 個 scripts syntax PASS |
| `node scripts/test-consent-gate.js` | PASS |
| `node scripts/audit-freshness.js` | PASS；香港 2026-07-23，0 errors／16 reminders：原 7 個到期提醒＋5 個渠道 unknown＋4 個官方推廣 unknown（Stage B 待處理） |
| `node scripts/generate-card-pages.js`＋`node scripts/generate-share-pages.js` | PASS；9 cards＋22 share pages，tracked output 零 diff |
| HTTP smoke | PASS，117／117 paths（包含 4 個 data modules） |
| JS／JSON syntax | PASS；4 data modules、5 modified scripts、3 migration fixtures |

Browser QA 使用一次性 `/tmp` Chromium runtime，冇加入 repo dependency、冇修改 tracked QA snapshots。Baseline 同 candidate 都係同一 binary、同一環境、同一測試腳本。

## 6. Stage A 未處理事項

- 冇重新核實任何 2026-07-23／07-29／07-31 到期項目；留待 Stage B。
- 冇改 Citibank／HSBC／Amex 第二張卡乘數、`applyWeeks` 數值、每月最多兩張卡、12 個月籌備期、1.10 目標偏好或 HK$3,000 高年費閘值；`applyWeeks` 只改為明確 `unknown` provenance。
- 冇將第三方資料升格為銀行官方規則。
- `legacyRuntimeText` 只係隔離嘅零 drift presentation 兼容層；Stage B 會以已核實 official/channel records 取代或轉歷史，唔會把平台文案重新塞回官方檔。
- Stage A 新揭露但未改結果嘅 unknown：5 個渠道 records、4 個官方推廣 claims、`applyWeeks`、兩種第二張卡乘數同 4 張卡嘅 fee-waiver provenance。
