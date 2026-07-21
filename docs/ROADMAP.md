# AcreMiles Roadmap

最後更新：2026-07-21  
基準：正式 v6.78.0；候選 v6.79.0-draft（`feature/outcome-first-v1`）
狀態定義：`NOW`＝立即；`NEXT`＝完成 NOW 後；`LATER`＝中期；`HOLD`＝等待用戶／外部資料。

## 1. 路線圖原則

1. 資料可信度高過功能數量同視覺效果。
2. 先確保過期內容唔誤導，再加新卡、新路線或新宣傳。
3. 每次只改一個主要責任邊界，保留可比較嘅輸出快照。
4. 不一次過轉框架、拆資料、重設計同改計算公式。
5. 未有用戶明確批准，不將候選版本合併到正式網站。

## 2. NOW｜資料及發布安全

### R0. Outcome First Big Picture V1 review

狀態：`NOW — DRAFT ONLY`

- v6.79.0-draft 已按 Safety Hardened 交接完成可操作第一版。
- 等產品擁有人 review 首頁價值示範、計算分層、saved card menu、文章 tier 同 planner gateway。
- 未發布頁面嘅真瀏覽器截圖、360／390／430 Android Chrome、深淺色及 PWA mode 仍要喺可安全開啟 feature preview 嘅環境補跑。
- Review 前不得 merge／deploy；如要調整，繼續喺同一 feature branch 做。

完成條件：產品擁有人確認方向、待核實數據處理清楚、真瀏覽器 mobile QA 通過，再另行決定是否進入 release candidate。

### R1. 每週信用卡更新

狀態：`NOW`  
原因：2026-07-23、07-29、07-31 有 7 個優惠／迎新提醒。

工作：

- 每週一香港時間核對 9 張卡及平台加碼。
- 先銀行官方頁、T&C、KFS，再查比較平台。
- 交差異表畀用戶批准。
- 過期而未有新條款嘅內容轉歷史／待核實。
- 重生卡頁及分享頁，跑完整資料 gate。

完成條件：

- `audit-freshness` 對已處理項目冇 error；warning 只屬真實未來期限。
- App、卡頁、文章、分享 metadata、FAQ 同縮圖數字一致。
- 所有進入推薦嘅資料有足夠官方依據。

### R2. v6.78.0 production QA 補完

狀態：`NOW`

工作：

- PageSpeed mobile／desktop。
- 真 WhatsApp：文章、卡、計劃、RTW 行程。
- 真 Facebook 同 cache re-scrape。
- 360／768／1440、明暗模式、鍵盤、200% zoom。
- iPhone Safari／Android Chrome、PWA 安裝、service worker 更新及離線重開。

完成條件：

- 新報告明確標示 v6.78.0、測試日期及 production URL。
- 預覽圖、標題、描述正確，舊 cache 問題有處理紀錄。
- 發現問題已修正或以已知限制記錄。

## 3. COMPLETED｜區 10 正式重做

狀態：`COMPLETED`（v6.78.0）

- 正式線：`HKG→MAD→CDG ⤳ LHR→JFK→BOS→PIT→ORD→SEA ⤳ YVR→NRT→TPE→HKG`。
- 19,960 哩、區 10 商務 230,000 里、5 停留／2 轉機／2 開口。
- 10 段精確 IATA／航司已入核實庫；CSV、Demo、文章、metadata、分享頁及 QA 已同步。
- 沿用現有城市 thumbnail，冇修改圖片檔。
- 往後資料真相來源：`ZONE-10-ROUTE.csv` 及 `QA-REPORT-v6.78.0.md`。

## 4. NEXT｜私隱、品牌及營運收尾

### R3. 私隱設定閉環

狀態：`NEXT`

- 確認 GA4 管理頁已儲存：事件 2 個月、使用者 14 個月、活動時重設。
- 每季保存 GA、Sentry 設定證據。
- 實測 MailerLite 退訂／刪除／suppression 流程。
- ICO 登記加入 `AcreMiles` trading name。
- 只喺用戶提供可公開聯絡地址後更新網站；禁止使用私人住址。

完成條件：`DATA-RETENTION-SCHEDULE.md` 與實際後台設定及證據日期一致。

### R4. 社交連結及品牌改名

狀態：`HOLD`

- 等用戶提供完成改名後嘅 Instagram／Facebook 正式 URL。
- 同步 footer、設定頁、metadata、manifest／品牌文字及社交貼文模板。

完成條件：兩個 URL 可公開開啟、名稱一致、冇舊品牌殘留。

## 5. LATER｜架構及可靠性

### R5. 完整 PR CI gate

狀態：`LATER`

加入：

- `verify.js`
- consent runtime test
- freshness audit
- HTTP smoke
- share preview metadata test
- generated file drift check
- 可用時嘅 axe／Playwright 核心流程

完成條件：PR 未通過必要 gate 時不可合併；每個 gate 失敗有清楚訊息，唔自動改內容。

### R6. 先拆資料，再拆引擎及 UI

狀態：`LATER`

建議次序：

1. `data/cards.js`
2. `data/redemptions.js`
3. `data/rtw-routes.js`
4. `content/articles.js`
5. `engine/optimizer.js`
6. `engine/rtw.js`
7. `ui/` render 及 state

每一步都要先輸出現有快照，搬完後比較結果。唔改畫面、數字或產品規則先完成純搬遷。

完成條件：

- optimizer 同 RTW 可由 Node 直接 import 測試。
- 生成卡頁／分享頁毋須用 regex 從巨大 HTML 抽資料。
- 主頁輸出同遷移前快照一致。

### R7. 欄位級資料可信度

狀態：`LATER`

每個影響推薦嘅欄位逐步改為：

```text
value
sourceUrl
sourceLevel
verifiedAt
validFrom / validUntil
status = verified | unknown | expired | conflict
```

`recommendable` 由必需欄位規則推導，唔再只靠整卡 `verified: true`。

完成條件：UI 可以指出邊個數字已核實、過期、衝突或未知；未知欄位唔會被整卡綠勾掩蓋。

### R8. 真正可索引文章頁

狀態：`LATER`

- 建立 `/guides/<slug>/`、`/offers/<slug>/`、`/rtw/<slug>/` 靜態全文頁。
- 每頁輸出正文、canonical、Open Graph、Article／FAQ schema、last modified。
- 驗證內容完整後先移除 `noindex` 及加入 sitemap。
- App 內 overlay 可保留作互動體驗。

完成條件：搜尋器毋須執行 App JavaScript 都讀到完整正文；App 與靜態頁由同一內容來源產生。

### R9. 效能預算

狀態：`LATER`

- 拆走首屏未使用內容同 JS。
- 保留圖片尺寸、lazy loading 及壓縮。
- 建立 production Lighthouse budget；初步 mobile 目標至少 85，之後按真實基準提高。

完成條件：唔犧牲資料正確、無障礙、分享 metadata 或離線功能；production 指標有版本化報告。

## 6. 產品能力候選

以下未承諾版本，做之前要另行確認範圍：

- 動態結果分享圖：需要後端 OG image 服務、資料最小化、濫用防護同保存政策。
- optimizer 全域最優解：要先正式定義目標函數、約束、費用、轉分摩擦、批卡時間及風險偏好。
- 帳戶／雲端同步：會改變現時 local-only 私隱模型，必須先做完整 data mapping、security 及 retention review。
- referral／廣告／合作收入：必須先完成商業披露、FCA／金融推廣／信貸中介及平台規則審查。

## 7. 明確不做

- 唔自動申請信用卡、登入銀行或替用戶作信貸決定。
- 唔聲稱即時獎勵位、即時稅費或保證出票。
- 唔用 AI 生成假銀行卡、假航空公司標誌、假航線或不能核實嘅圖片文字。
- 唔一次過重寫全站。
- 唔因為某優惠吸引就降低來源或核實門檻。

## 8. 可能版本安排（非承諾）

| 候選版本 | 合理範圍 |
|---|---|
| v6.78.x | Zone 10 正式線＋production QA 修正 |
| v6.79.x | 到期信用卡／平台優惠更新 |
| v7.0.0 | 第一階段資料／引擎拆分；需另開遷移計劃 |

版本號只係建議；真正範圍以當次用戶批准同 diff 為準。
