# AcreMiles 現況

更新：2026-07-21
正式版本：**v6.78.0**
公開網站：<https://acremiles.app/>
GitHub：v6.77.0 為 PR #3／merge commit `09d743d655baeac0e4abeaa77e4852311a6b6deb`；v6.78.0 發布紀錄以 `main` 最新 merge 為準。

完整接手入口：[`MASTER.md`](MASTER.md) → [`HANDOFF.md`](HANDOFF.md)

## v6.78.0 已發布

- Zone 10 正式路線更新為 19,960 哩、區 10 商務 230,000 里、5 停留／2 轉機／2 開口。
- 文章、規劃器 Demo、10 段核實庫、CSV、搜尋索引、分享 metadata、Open Graph wrapper 及 service worker 已同步。
- 現有 `pgW10-hero.jpg` 繼續使用，冇修改圖片檔。
- 完整路線及 QA：[`ZONE-10-ROUTE.csv`](ZONE-10-ROUTE.csv)／[`QA-REPORT-v6.78.0.md`](QA-REPORT-v6.78.0.md)。

## v6.77.0 已發布

- 計算器／規劃器已儲存清單統一為「開啟／分享／刪除」。
- Save 掣統一顯示「儲存／✓ 已儲存」，再按已儲存項目前會確認刪除。
- 收藏文章加入縮圖；過期優惠圖自動灰化及標示「已完結」。
- 賺里數／換里數分享各有專屬 1200×675 JPEG 及 Open Graph metadata。
- 發布前 HTTP 資產 109／109、主 verifier 全部通過；區 10 網站內容及圖片未改。
- 正式網站已確認顯示 v6.77.0；新分享圖已上線。

## v6.76.0 已發布

- ICO reference 確認為 `ZC174150`；控制者保留 `Mrs HAU YING OU-YANG`。
- 私隱政策補齊 GA、Sentry、MailerLite 保存安排及一個曆月權利回覆期限。
- 2026-07-20 GA4 截圖顯示事件資料保存 2 個月、使用者資料保存 14 個月，並開啟新活動時重設；如後台仍有未儲存變更，須先按「儲存」。
- 首次必讀、關於頁及使用條款補齊計算限制、信用風險、RTW 教學定位、第三方品牌、利益披露及責任範圍。
- 社交／網站發布前責任 checklist 已建立。
- 每週信用卡更新流程、到期檢查及只讀 GitHub 提醒已建立；唔會自動改檔、commit、push 或發布。
- 分享頁及卡頁真實圖片尺寸、描述、到期 metadata 已修正。
- 區 6、8、11、13 嘅教學定位已記錄；區 10 內容及圖片冇改。
- 本地 browser QA 40／40、HTTP 107／107、axe 明暗模式全部 0 violation。

## 現時要優先處理

| 日期 | 項目 |
|---|---|
| 2026-07-23 | 渣打國泰兩個平台優惠到期 |
| 2026-07-29 | AE 白金卡官方迎新到期 |
| 2026-07-31 | HSBC EveryMile 兩個平台優惠、AE Explorer 兩個平台優惠到期 |

未有新官方條款時，優惠應轉為歷史／待核實，唔可以繼續當現行推薦。

## 仍要你參與

1. **GA4 後台**：如果你張截圖影嗰刻仲未撳藍色「儲存」，請補撳一次；其他資料保存設定已記錄。
2. **ICO**：安排好公開聯絡地址後，加入 AcreMiles trading name；網站暫時唔公開私人地址。
3. **IG／Facebook**：改名完成後提供新名稱及連結。

## 發布後仍待完成

- v6.78.0 production Lighthouse mobile／desktop。
- 真 WhatsApp／Facebook app 分享文章、卡、賺／換結果及 cache 檢查。
- v6.78.0 嘅 360／768／1440 完整瀏覽器回歸、PWA 安裝及離線重開。
- 如日後有 referral、廣告、收佣或代客介紹信用卡申請，發布前重新做 FCA／金融推廣及專業法律核對。
