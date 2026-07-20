# 架構與 SEO 改造方向

## 現況判斷

`index.html` 同時包含資料、optimizer、RTW 引擎、內容、CSS、UI 同狀態管理。優點係部署簡單；缺點係任何小改動都有全站回歸風險，資料同展示亦難獨立測試。

文章主內容目前仍係 hidden overlay。v6.74.0 已為 20 篇內容建立獨立分享 wrapper、canonical、Open Graph 圖及深連結，所以 WhatsApp／社交預覽已解決；但 wrapper 刻意 `noindex,follow`，未算真正可獨立收錄嘅文章頁。9 張信用卡就已經有靜態 URL、canonical、Open Graph 及官方來源。

## 建議次序

### Phase 1 — 先拆資料，唔改畫面

1. `data/cards.js`：卡、迎新、核實欄位、來源。
2. `data/redemptions.js`：兌換表。
3. `data/rtw-routes.js`：機場、航司、route status、來源日期。
4. `engine/optimizer.js`、`engine/rtw.js`：純函數，可由 Node 直接測。
5. 保留現有 HTML render，逐步改 import；每一步比較 optimizer 快照。

### Phase 2 — 欄位級資料模型

每個會影響推薦嘅欄位至少要有：

- `value`
- `sourceUrl`
- `sourceLevel`
- `verifiedAt`
- `validFrom`／`validUntil`
- `status: verified | unknown | expired | conflict`

整張卡嘅 `recommendable` 應由必需欄位規則推導，唔再人手寫單一 `verified: true`。

### Phase 3 — 將分享 wrapper 升級成真正文章 URL

建議 URL：

- `/guides/<slug>/`
- `/cards/<slug>/`
- `/offers/<slug>/`
- `/rtw/<slug>/`

每頁要輸出完整文章正文、title、description、canonical、OG image、Article／FAQ schema、last modified，之後先移除 `noindex` 並加入 sitemap。App 內可以繼續用 overlay 體驗；v6.74.0 已做到 refresh／share 深連結，下一步係令搜尋器毋須執行 App 都讀到正文。

### Phase 4 — 發佈 gate

- unit tests：純 engine／資料期限／route status。
- integration：核心使用流程、localStorage migration、consent。
- accessibility：axe＋鍵盤（v6.74.0 已有第一輪 0 violation 基準）。
- visual：360、768、1440 screenshot diff（v6.74.0 已留基準圖）。
- performance：Lighthouse budget（目前 mobile 76，下一階段目標先升至 85）。
- content：broken links、過期優惠、source freshness。

## 唔建議一次過重寫

一次過轉框架、拆資料兼改設計，會令「數字錯咗」同「UI 壞咗」難分。最安全係先有今版 verifier，再逐層搬；每次只改一個責任邊界。
