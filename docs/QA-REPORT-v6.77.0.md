# AcreMiles v6.77.0 QA 報告

日期：2026-07-21（英國）

## 結果

- `node scripts/verify.js index.html`：全部 invariant 通過。
- HTTP／資產：109／109 路徑正常。
- 兩張新分享圖：JPEG、1200×675；分享頁 OG 尺寸同實圖一致。
- Save UI：計算器／規劃器均使用開啟、分享、刪除；`✕` 不再代表刪除。
- 收藏：沿用既有 `bm_favs` 格式；文章縮圖由現有文章資料推導，過期優惠自動灰化。
- 區 10：程式路線、文章及圖片未改。

## 已知限制

GitHub Pages 係靜態網站；社交 crawler 不會執行用戶網址 fragment 內的私人資料，所以分享圖按「賺里數／換里數」分類，而非每個結果動態寫入金額或路線。實際結果仍保留在分享文字及可載入行程網址。

環境沒有可用 Chromium，因此今次不能重跑 Playwright 視覺截圖；HTML 結構、JavaScript 語法、產品 invariant、分享 metadata、圖片尺寸及完整 HTTP 資產已通過。發布後仍要用真 WhatsApp／Facebook 分享各測一次 cache 預覽。
