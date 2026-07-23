# Phase 2A Shell UI Verification

核對日期：2026-07-23

範圍：Welcome、Consent／Disclaimer 第一層、Header shell、Profile Hub、Bottom Navigation

Baseline：`c2e1ffdaaa766872308fb987f9829d68ddbb2d0a`

Backup branch：`backup/pre-phase2a-shell-ui-20260723`

Feature branch：`agent/acremiles-phase2a-shell-ui-20260723`

Backup ZIP SHA-256：`39f88f4de3bf6db636710af102137c6369d2d2ef62c1b02c3d793b54d51a1bde`

## 1. Scope result

- Welcome slogan 由「畝・里／香港里數優化／誠・里」改成「每筆消費，都值得有回報」；A+ Logo 保持原本 96×96 比例。
- 正常 Welcome 流程係 900ms 後開始 260ms fade，總停留約 1.16 秒；獨立 early fallback 最遲 1.6 秒移除。只使用 fade／glow，`prefers-reduced-motion` 下快速離場。
- Consent 第一層集中工具性質、條款會變、信貸／還款風險、私隱選擇；完整法律／私隱內容保留喺展開及現有頁面。
- Consent／Profile Hub 共用 background scroll lock：保存原 `scrollY`、固定 body、overlay 自己 scroll、關閉後還原原位置；dialog 開啟時由頂開始並取得 focus。
- 接受匿名改善先載入 GA／Sentry；只限必要保持核心功能但第三方 analytics script 數量為 0。
- Header large／compact 行為保留，原問號／三點入口整合成單一通用 Profile icon；冇假姓名、假頭像、Google Login 或登入狀態。
- Profile Hub 次序固定：我的、我的信用卡、我的旅程、我的收藏、跨裝置同步、FAQ／小助手、設定。跨裝置同步只顯示即將推出、可選、資料仍存本機。
- Bottom Navigation 固定為點賺、點用、首頁、優惠、攻略，對應既有 `opt`、`redeem`、`journey`、`articles`、`guides`。

## 2. Browser QA

| 項目 | 結果 |
|---|---|
| 390×844 Welcome／Home／compact header／Profile Hub／calculator result | PASS |
| Desktop 1280×800 | PASS |
| Welcome 正常離場／refresh 不卡住 | PASS |
| Consent 背景鎖定、modal 自己 scroll、由頂開始 | PASS |
| Consent 關閉後 scroll position | PASS；963 → 963 |
| Consent focus／首次必讀 Escape | PASS；focus 入 dialog，首次必讀不可用 Escape 繞過 |
| 接受匿名改善 | PASS；GA／Sentry script 才載入 |
| 只限必要 | PASS；GA／Sentry script 0 |
| Profile Hub 開關／safe area／keyboard／focus return | PASS |
| Profile 每個入口 | PASS；信用卡 9 張、旅程、收藏、同步說明、FAQ、設定 |
| Bottom Nav | PASS；5/5 可開，active state／`aria-current=page` 正確 |
| Earn regression | PASS；HK$30,000／年薪 HK$300,000 → 65,058 里 |
| App-origin console errors／global red banner | 0／0 |

Cloud Browser extension 自身嘅 metadata 訊息不屬 app origin，已排除。產品 tree 用同一套 390×844 capture harness 保存證據；功能測試另喺 exact app runtime 執行，冇靠 screenshot freeze 判斷 Welcome timing。

## 3. Regression gates

| Gate | 結果 |
|---|---|
| `node scripts/regression-lock.js` | PASS，6/6 |
| `node scripts/verify.js index.html` | PASS |
| `node scripts/test-consent-gate.js` | PASS |
| `node scripts/test-phase2a-shell.js` | PASS |
| `node scripts/audit-freshness.js` | PASS；0 errors、17 reminders |
| `node scripts/smoke-http.js` | PASS；112/112 |
| Card／share generators | PASS；33 generated files，零 drift |
| JavaScript syntax | PASS；18/18 |
| JSON parse | PASS；9/9 |
| localStorage | PASS；16/16 reset keys，snapshot 零 drift |

第一次獨立執行 HTTP client 時冇同一個 process 內 server，112 requests 全部 `fetch failed`；按 repo 指示啟動同源 server後重跑為 112/112。只採用有效重跑結果。

## 4. Optimizer fixtures

Fixture snapshot SHA-256 保持 `959d960f2b3b43767e7b60c683b6151403eebff5c6e9bf3b60333891c1390f21`。22/22 結果同 baseline 相同，數值 drift 0：

| Fixture | Baseline | Phase 2A | Drift |
|---|---:|---:|---:|
| single-5000 | 20,625 | 20,625 | 0 |
| family-5000 | 20,625 | 20,625 | 0 |
| single-8000 | 21,625 | 21,625 | 0 |
| family-8000 | 21,625 | 21,625 | 0 |
| single-16999 | 43,558 | 43,558 | 0 |
| family-16999 | 52,749.666667 | 52,749.666667 | 0 |
| single-30000 | 65,058.333333 | 65,058.333333 | 0 |
| family-30000 | 85,783.333333 | 85,783.333333 | 0 |
| single-100000 | 105,791.666667 | 105,791.666667 | 0 |
| family-100000 | 173,916.666667 | 173,916.666667 | 0 |
| single-300000 | 163,458.333333 | 163,458.333333 | 0 |
| family-300000 | 249,250 | 249,250 | 0 |
| single-1000000 | 303,458.333333 | 303,458.333333 | 0 |
| family-1000000 | 406,916.666667 | 406,916.666667 | 0 |
| owned-card-30000 | 46,100 | 46,100 | 0 |
| excluded-card-30000 | 46,100 | 46,100 | 0 |
| annual-fee-off-300000 | 163,458.333333 | 163,458.333333 | 0 |
| annual-fee-on-300000 | 207,125 | 207,125 | 0 |
| lump-spend-100000 | 105,791.666667 | 105,791.666667 | 0 |
| tiered-sc-cathay-110000 | 58,333.333333 | 58,333.333333 | 0 |
| threshold-citi-pm-8000 | 21,000 | 21,000 | 0 |
| fee-purchase-citi-8000 | 21,000 | 21,000 | 0 |

## 5. Protected paths and snapshot explanation

- `data/**`：零 diff；9 張卡資料完整。
- `cards/**`、`share/**`：generator 前後零 drift。
- optimizer／Cost-per-Mile／22 fixture 數值：零 diff。
- `manifest.json`、`sw.js`、PWA／offline asset wiring：零 diff。
- Homepage Hero／Carousel、Greeting、Homepage sections、點賺／點用內部 UI、Card Detail、通知、Google Login／cloud sync：零修改。
- Product snapshot 只因 `index.html` shell code bytes／hash 改變。
- DOM snapshot 只記錄受批准嘅 Welcome、Consent、Header、Profile Hub、Bottom Nav nodes／文案及相應 line shifts；213 IDs 全部唯一。

## 6. Known issues and rollback

- `index.html` 仍係大型單檔；Phase 2A 為控制 scope 沿用現有架構。
- Browser automation extension 會輸出一條非 app-origin metadata 訊息；app-origin errors 為 0。
- 跨裝置同步未實作，資料保持 local-only；Profile Hub 已明示呢個限制。
- 未合併前 rollback：關閉 Draft PR；`main` 完全不變。
- 如日後獲批合併後要回復：用普通 `git revert` Phase 2A merge／commit，或由 backup branch／ZIP 重建；不可重寫 `main` 歷史。

Phase 2A 完成後必須停止，等 Founder 實際睇 HTTPS Preview 並明確回覆 `Phase 2A approved`；不得自行開始 Phase 2B。
