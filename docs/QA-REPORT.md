# AcreMiles v6.74.1 QA 報告

日期：2026-07-20

## 結論

- 程式 release gate：全部通過。
- 本地 HTTP：107／107 路徑成功。
- 真 Chromium：32／32 互動檢查成功。
- axe：5 個主要畫面 0 個 WCAG 違規，serious／critical 為 0。
- Lighthouse：Performance 76、Accessibility 100、Best Practices 100、SEO 100。

## 1. 程式及資料 gate

指令：

```bash
node scripts/verify.js index.html
```

已檢查：

- 7 個 script block 語法及 HTML 結構。
- optimizer 金額守恆、家庭模式、剔卡、舊 ID、卡上限。
- 未核實卡不入推薦；HSBC Visa Signature 只供參考。
- 9 張卡都有官方產品頁及 KFS／T&C；卡頁由單一卡庫產生。
- 渣打 HK$96,000 年薪資料修正有防回歸測試。
- build、App、設定及 service worker 版本一致。
- GA／Sentry 未同意前不載入，撤回同意會停止。
- 私隱政策顯示英國個人／sole trader 資料控制者、ICO 登記、一個曆月權利回覆期限及正確客服 email。
- 精確 RTW 機場配對：HND→GMP、HND→SYD 可通過；舊 NRT→ICN、NRT→SYD 不會誤標綠。
- BKK→SIN／CX 修正及 LAX→HEL 季節線提示。
- 文章、信用卡、計算及行程分享頁／資產存在。
- 正確 `pgO1-hero.jpg` 可解碼並已加入離線快取。

## 2. HTTP 路徑

```bash
node scripts/smoke-http.js http://127.0.0.1:4173/
```

結果：107／107，包括首頁、manifest、service worker、robots、sitemap、所有引用圖片、10 個卡頁及 22 個分享頁。

## 3. 真 Chromium 畫面及互動

測試尺寸：360×800、768×1024、1440×1000，另以 390×844 測規劃器、文章、私隱政策、卡詳情及分享行程。

32／32 通過項目包括：

- 三個尺寸都見到突出嘅行程規劃器主入口，主要按鈕尺寸足夠。
- 主入口可以打開 RTW 規劃器。
- `?open=pgO1` 直開文章，正確封面成功解碼。
- 文章分享使用獨立 Open Graph 頁。
- 更多選單可以打開私隱政策；營運者、ICO、回覆期限、email 及 ICO 投訴連結正確。
- 私隱政策固定頁完整覆蓋首頁操作；截圖只擷取真實 viewport，避免 full-page 拼圖造成假 overlay。
- 卡詳情有分享掣、獨立卡頁及銀行官方原文。
- HND→SYD 行程分享可重新載入，載入後會清走網址中嘅 payload。
- 舊 NRT→SYD 不會誤標為已核實。
- 所有測試流程無 JavaScript runtime error。

axe 實測畫面：首頁、規劃器、pgO1 文章、私隱政策、分享行程；五頁均 0 violation。

## 4. Lighthouse

最新 mobile run：

| 項目 | 分數／結果 |
|---|---:|
| Performance | 76 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| First Contentful Paint | 3.8 秒 |
| Largest Contentful Paint | 4.1 秒 |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0.024 |
| 傳輸量（本地無壓縮 server） | 784 KiB |

Performance 主要扣分係 584KB 單一 HTML 入面有約 124KB 首屏未用 JavaScript；本地測試 server 亦冇 gzip／Brotli。下一個較安全嘅改善係逐步拆出 JS／文章資料及部署壓縮，唔建議喺今次可信度修正入面一次過重寫整個架構。

## 5. 截圖及原始報告

- `qa/screenshots/mobile-360-home.png`
- `qa/screenshots/tablet-768-home.png`
- `qa/screenshots/desktop-1440-home.png`
- `qa/screenshots/mobile-390-pgO1.png`
- `qa/screenshots/mobile-390-privacy.png`
- `qa/screenshots/mobile-390-shared-itinerary.png`
- `qa/browser-qa.json`
- `qa/lighthouse-mobile.json`

## 正式發布前仍建議

- 真 iPhone Safari／Android Chrome。
- VoiceOver／TalkBack、瀏覽器 200% zoom。
- 安裝 PWA、service worker 更新及真正斷網重開。
- 正式 hosting 嘅壓縮、cache 及安全 headers。
