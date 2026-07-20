# AcreMiles v6.76.0 QA 報告

日期：2026-07-20（英國）／2026-07-21（香港）
狀態：候選版本，尚未合併／發布

## 結論

本地 v6.76.0 嘅程式、主要互動、手機／平板／桌面版面、明暗模式、無障礙及社交 crawler 測試全部通過。剩低兩項只可以喺發布後完成：production Lighthouse 重跑，以及真 WhatsApp／Facebook app 嘅 cached preview 肉眼確認。

## 程式及資產

- `node scripts/verify.js index.html`：全部 gate 通過。
- Consent gate runtime：通過；拒絕匿名改善時 GA／Sentry 不載入。
- HTTP smoke：107／107 路徑成功。
- HTML 結構及 JavaScript 語法：通過。
- `git diff --check`：通過。
- 每週資料新鮮度：0 個錯誤、7 個限期提醒。

## 真瀏覽器及版面

測試環境：Chromium 149、Noto Sans HK。

- `browser-qa.js`：40／40。
- 首頁：360×800、768×1024、1440×1000。
- 主要流程：390×844，包括規劃器、優惠文章及過期狀態、RTW 教學提示、私隱政策、使用條款、卡詳情及分享、行程重載及分享。
- JavaScript runtime error：0。
- 區 10 只做回歸測試，路線、文章及圖片冇改。

## 無障礙

axe-core 4.12.1：

- 6 個主要流程畫面：全部 0 violation。
- Light mode 360／768／1440：全部 0 violation。
- Dark mode 360／768／1440：全部 0 violation。
- 測試期間發現淺色桌面 footer 原本只有 3.85:1 對比度；已改為 `#3F5D66` 對 `#DDE5E2`，約 5.52:1，重跑後問題消失。

## Lighthouse

### 本地 v6.76.0

| 模式 | Performance | Accessibility | Best Practices | SEO | 主要指標 |
|---|---:|---:|---:|---:|---|
| Mobile | 74 | 100 | 100 | 100 | FCP 3.9s、LCP 4.1s、TBT 120ms、CLS 0.04、SI 5.1s |
| Desktop | 98 | 100 | 100 | 100 | FCP 0.8s、LCP 0.9s、TBT 0ms、CLS 0.01、SI 0.8s |

本地係冇 gzip／CDN 嘅 Python development server，Mobile Performance 不可當 production 分數；結構、無障礙、最佳做法及 SEO 分數仍有參考價值。

### 現時公開 v6.75.0

2026-07-20 最新 PageSpeed run：Mobile Performance 94、Accessibility 100、Best Practices 100、SEO 100；同一 run Desktop Performance 97，其餘三項 100。公開頁仍未包含 v6.76.0 修正，發布後要重跑先係最終 production 結果。

公開結果：<https://pagespeed.web.dev/analysis/https-acremiles-app/4nsqqjpdnk?form_factor=mobile>

## Facebook／WhatsApp 分享

- 本地 v6.76.0 以 Facebook 同 WhatsApp crawler user-agent 測試：64 個頁面回應、32 張分享圖，全部通過。
- 每頁有 title、description、HTTPS `og:image`、canonical URL、真實圖片 width／height；圖片可下載且 Content-Type 正確。
- 舊公開 v6.75.0 有一批 1200×675 圖片被 metadata 寫成 1280×720，另有卡庫首頁缺尺寸；本地 generator 已改為讀取 JPEG 真實尺寸並重生全部頁。
- 限時優惠分享 metadata 加入實際到期日；到期後重新產生分享頁，標題／描述及頁面會轉為「歷史優惠」。

限制：crawler 測試可以證明 Facebook／WhatsApp 取得正確資料及圖片，但唔等於兩個 app 嘅最終 UI／舊 cache 一定即時更新。v6.76.0 發布後仍要用真機分享一次；Facebook Sharing Debugger 需要登入，今次冇代用戶登入。

## 發布後必做

1. 重跑 production PageSpeed mobile／desktop。
2. 用真 WhatsApp 分享一篇文章、一張卡、一條行程。
3. 用 Facebook 分享同一三類連結；如仍見舊縮圖，再用 Sharing Debugger 要求重新抓取。
4. 記錄實際預覽截圖及日期。
