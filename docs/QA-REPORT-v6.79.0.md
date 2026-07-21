# AcreMiles v6.79.0 QA Report

日期：2026-07-21（Europe/London）  
範圍：Outcome First Big Picture V1、公開 UK Postbox 地址、按鈕／非按鈕視覺層級、既有功能回歸。

## 1. 發布決定

- 產品擁有人已透過獨立 Preview 網站完成 big-picture review，確認大致方向可以先上線，小型問題之後逐步調整。
- v6.79.0 保留 v6.78.0 Design Language、資料模型、計算公式、RTW 規則、分享格式、PWA shell 及 consent gate。
- 正式發布來源為 `feature/outcome-first-v1`／PR #7；不可 force-push 或改寫備份 branch／tag。

## 2. 今次收尾修改

- 首次提示「優惠受條款及細則約束，資料只供參考」由圓角框改為普通分隔文字，畫面只剩兩個真正 consent 按鈕。
- 靜態狀態標籤、示範數字卡、文章提示、設定說明及結果 tier 採平面標籤、左邊線或細方角；移除容易令人以為可撳嘅陰影及完整按鈕邊框。
- 真正控制項保留實色／outline、箭嘴、hover、focus 及按壓回饋。
- 私隱政策加入用戶確認可公開嘅 UK Postbox 地址：郵件／通訊使用 PO Box；包裹／快遞使用 Courier Point，兩者用途清楚分開。
- 版本同步為 `v6.79.0`：build marker、設定頁、`APP_VERSION` 及 service worker cache 一致。

## 3. 自動檢查

| 檢查 | 結果 |
|---|---|
| `node scripts/verify.js index.html` | PASS；版本、HTML／JS、consent、optimizer、RTW、privacy、分享、資產、Outcome First invariants 全數通過 |
| `node scripts/test-consent-gate.js` | PASS |
| `node scripts/audit-freshness.js` | PASS；0 errors、7 個到期提醒 |
| HTTP smoke | PASS；109／109 頁面及主要資源正常 |
| Sites production build | PASS |
| Sites rendered HTML test | PASS |
| Sites artifact validation | PASS；ESM Worker `default.fetch` 同 hosting manifest 存在 |

Freshness 提醒：渣打國泰兩個平台優惠於 2026-07-23 到期；AE 白金官方迎新於 2026-07-29 到期；HSBC EveryMile 及 AE Explorer 平台優惠於 2026-07-31 到期。未有新條款時要按既有規則轉歷史／待核實。

## 4. 視覺及互動核對

- Agent Preview 桌面 viewport 1363×936 成功開啟，首頁 Outcome First、兩個主行動、更多消費示範、快速計算入口及底部導覽正常。
- 靜態示範卡已取消按鈕式陰影／完整邊框；卡內「用呢個金額計／睇計法」仍有明確控制項樣式。
- DOM accessibility tree 將首頁行動正確暴露為 `button`；靜態標籤、數字及提示為普通文字／generic content。
- 首次提示 HTML 只包含兩個 consent 控制項：`接受匿名改善並開始` 同 `只限必要`；免責句為普通 paragraph。
- 雲端瀏覽器完成桌面畫面後，喺重設測試狀態時出現環境層 timeout；冇改用其他未核准瀏覽器途徑，亦冇假裝已完成全套裝置截圖。

## 5. 已知限制及發布後 QA

- 完整 360／390／430／768／1440、深淺色、200% zoom、iPhone Safari、Android Chrome、PWA 安裝及離線重開仍要喺 production 補跑。
- WhatsApp／Facebook 真分享預覽及 cache re-scrape 仍需真人裝置核對。
- 7 個即將到期優惠屬資料新鮮度提醒，唔係今次 Outcome First UI 回歸錯誤。
- v6.79.0 仍然冇後端、登入、雲端同步、外部 AI API 或每個結果動態 OG 圖。

## 6. Rollback

如正式發布後出現重大問題：

1. 以 v6.78.0 baseline `1c7228bcd1e0aa2b194c9c62e1fba61de6e0e049` 建立正常 rollback PR。
2. 不可移動或改寫 `backup/pre-outcome-first-v1-20260721` 同 `pre-outcome-first-v1-20260721` tag。
3. 合併 rollback PR 後，核對 `index.html`、`sw.js` cache、版本顯示及 `acremiles.app`。
4. 使用既有備份 `AcreMiles_pre_outcome_first_v1_20260721.zip`／Git bundle 作獨立完整還原來源。
