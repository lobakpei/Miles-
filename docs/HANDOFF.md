# AcreMiles 新對話交接

交接時間：2026-07-23
適用版本：正式網站 v6.79.0
接手目標：新 AI 喺冇舊對話內容嘅情況下，能夠安全判斷現況、繼續開發及避免重做已完成工作。

## 0. v6.79.0／Phase 2A 當前交接

- 法律、安全及官方資料真確性規則最高；最新產品方向以 [`ACREMILES_20260722_DECISION_SOURCE_OF_TRUTH.md`](ACREMILES_20260722_DECISION_SOURCE_OF_TRUTH.md) 為準，其後係 [`ACREMILES_PRODUCT_BLUEPRINT_V2.md`](ACREMILES_PRODUCT_BLUEPRINT_V2.md)、[`ACREMILES_CURRENT_ARCHITECTURE_MAP_V1.md`](ACREMILES_CURRENT_ARCHITECTURE_MAP_V1.md) 同 Safety Hardened。
- Phase 0 同 Phase 1 已獲 Founder 批准並合併；Phase 2A `main` baseline 精確係 `c2e1ffdaaa766872308fb987f9829d68ddbb2d0a`。
- Phase 2A backup branch：`backup/pre-phase2a-shell-ui-20260723`；feature branch：`agent/acremiles-phase2a-shell-ui-20260723`。
- Phase 1 銀行卡、渠道優惠及來源 registry 已正式由 `data/cards-official.js`、`data/card-channels.js`、`data/source-registry.js` 提供；Phase 2A 對三者、Engine、22 fixtures、卡頁及分享頁零修改。
- 已合併資料嘅 `source-registry` schema 2 有 19 個官方 records（17 active*），`card-channels` schema 3 有 17 個渠道 records（12 active、3 unknown、2 historical-unverified）；精確時間優惠用帶 `+08:00` 嘅 `startsAt`／`expiresAt`，其餘按香港日曆日判定。
- Phase 2A 候選只修改 Welcome、Consent 第一層、Header shell、Profile Hub、Bottom Navigation 同必要 scroll／focus helpers；完整證據見 [`PHASE2A-SHELL-UI-VERIFICATION.md`](PHASE2A-SHELL-UI-VERIFICATION.md)。
- 未經 Founder Preview 批准只可保持 Draft PR；不可 merge、production deploy、開始 Phase 2B、Google Login 或真正 cloud sync。
- v6.79.0 歷史發布來源：`feature/outcome-first-v1`／PR #7；當時 baseline：`1c7228bcd1e0aa2b194c9c62e1fba61de6e0e049`。
- 已完成 Outcome First 首頁、分層計算入口、compact saved cards、優惠文章首屏、Beginner／Advanced planner gateway，同時保留現有計算及 RTW 引擎。
- 新示範只使用 repo 內可追溯資料；未接 AI API，Beginner planner 係現有 template 嘅 rule-based matching。
- 產品擁有人已完成 Preview review並批准發布 v6.79.0；正式狀態及剩餘限制見 [`QA-REPORT-v6.79.0.md`](QA-REPORT-v6.79.0.md)。
- 首次提示、靜態狀態標籤、示範數字卡及提示框已改為平面資料樣式；真正控制項先保留按壓／hover／箭嘴等互動提示。
- 私隱政策已加入 UK Postbox 公開通訊地址及 Courier Point 地址，兩者用途不可互換。

## 1. 接手後頭五分鐘

1. 先依次讀 Decision Source of Truth、Product Blueprint v2、Current Architecture Map、Safety Hardened，再讀 [`MASTER.md`](MASTER.md) 同根目錄 `AGENTS.md`。
2. 執行 `git status --short --branch`，保留所有現有變更；唔好 reset、checkout 或覆蓋不明檔案。
3. 用 GitHub 實際 `main` 核對正式版本及最新 merge commit；本地 `origin/main` 可能過時。
4. 正式 `main` 四處版本必須一致為 v6.79.0。
5. 執行：

   ```bash
   node scripts/verify.js index.html
   node scripts/test-consent-gate.js
   node scripts/audit-freshness.js
   node scripts/regression-lock.js
   ```

6. 再按用戶今次新指示選擇專題文件，唔好因為交接清單有待辦就擅自全部開工。

## 2. 已完成，不要重做

### v6.78.0（已發布）

- Zone 10 正式線為 `HKG→MAD→CDG ⤳ LHR→JFK→BOS→PIT→ORD→SEA ⤳ YVR→NRT→TPE→HKG`。
- 規劃器重算 19,960 哩、區 10 商務 230,000 里、5 停留／2 轉機／2 開口，距頂 40 哩。
- 10 段精確 IATA／航司已加入 `OW_VERIFIED`；PIT 已加入機場庫。
- 文章、RTW Demo、`ZONE-10-ROUTE.csv`、搜尋索引、分享 metadata、Open Graph wrapper、service worker 及測試已同步。
- 圖片檔冇修改；現行文章同分享頁沿用 `img/pgW10-hero.jpg`。
- 來源、逐段距離及 QA 見 [`QA-REPORT-v6.78.0.md`](QA-REPORT-v6.78.0.md)。

### v6.77.0（已發布）

- 計算器／RTW 規劃器儲存 UI 已統一。
- `儲存／✓ 已儲存` 狀態及確認刪除已完成。
- 收藏文章已有 thumbnail；過期優惠會灰化。
- 賺里數／換里數各有獨立 1200×675 Open Graph 圖。
- 舊 `bm_favs`、已儲存計劃同行程資料格式保持兼容。
- 區 10 網站內容及圖片未改，只新增咗 Fable 5 研究 brief。
- PR #3 已合併並已確認正式網站顯示 v6.77.0。

### v6.76.0（已發布）

- 首次提示、使用條款、私隱政策及 RTW 免責已加強。
- GA4／Sentry／MailerLite 保存安排已寫入政策。
- 每週信用卡 freshness script 同只讀 GitHub Action 已建立。
- 分享頁真實圖片尺寸、crawler metadata 及 footer 對比已修正。
- v6.76.0 真 Chromium 40／40、107／107 資產、axe 明暗模式 0 violation；v6.77.0 另通過 verifier、consent gate、109／109 資產及分享圖檢查。

### v6.75.0 及之前

- 9 張卡已補官方產品頁、KFS／T&C 同長版條款。
- 取消卡已移出公開卡庫；過期內容保留為歷史。
- RTW 改用精確 IATA 機場配對同三態核實。
- 文章／卡／計算／行程分享基礎已完成。

詳情見 [`CHANGELOG.md`](CHANGELOG.md)。

## 3. 現時工作面

### P0：Phase 2A Welcome + Consent + Header + Profile Hub + Bottom Navigation

狀態：`FOUNDER REVIEW — DRAFT ONLY`

- Welcome 使用「每筆消費，都值得有回報」；2240ms 後開始 260ms fade，正常約 2.5 秒離場，另有獨立 3000ms 安全 fallback；只用 fade／glow，reduced motion 即時離場。
- Consent 第一層只保留四項重要資訊；原有法律、私隱及 analytics gating 不削弱。共用 modal scroll lock 會保存及還原原頁位置，dialog 由頂開始並取得 focus。
- Header 保留 large→compact 行為，以單一通用 Profile icon 取代兩個右上角入口；冇假登入或假頭像。
- Profile Hub 依 canonical 次序提供我的信用卡、旅程、收藏、本機同步說明、FAQ 同完整設定入口；跨裝置同步只標「即將推出／可選／資料仍存本機」。
- Bottom Navigation 固定為「點賺／點用／首頁／優惠／攻略」；只改 shell label／入口，內部 tab IDs、首頁 Hero、點賺／點用內容及 Engine 不變。
- 必須保持 Open Draft，等 Founder 實際睇 HTTPS Preview 後明確回覆 `Phase 2A approved`；不得自行開始 Phase 2B。

Phase 2B acceptance requirement（只記錄，Phase 2A 不實作）：

- Hero Carousel 必須只包含：iPhone、買車、Wedding。
- 「更多消費示範」必須使用另外一組例子，不可重複以上三個 Hero scenarios。
- Phase 2A correction 不可修改 Homepage Hero、carousel、scenario cards 或 Homepage section order。

### 營運 P0：信用卡資料新鮮度

Phase 1B 已合併資料於 2026-07-23 執行 `audit-freshness`：9 張卡、19 個官方 records（17 active*）、17 個渠道 records（12 active），0 errors、17 reminders。提醒包括 7 月 23、29、30、31 日及之後獨立期限；若接手日期已過：

1. 先查銀行官方產品頁、最新 T&C、KFS／收費表。
2. 再查平台加碼；唔好用平台文案取代銀行條款。
3. 先交新舊差異表畀用戶，未獲確認前唔改網站。
4. 冇新官方條款就將舊優惠轉歷史／待核實，唔估新數。

完整 SOP：[`WEEKLY-CARD-UPDATE.md`](WEEKLY-CARD-UPDATE.md)。

### Zone 10 後續維護

研究及正式更新已完成。往後修改時以 [`ZONE-10-ROUTE.csv`](ZONE-10-ROUTE.csv) 為機器可讀基準，並同步文章、`OW_VERIFIED`、`OW_ZONE_DEMOS.z10`、分享 metadata 同 QA。特別留意：

- 兩個開口係 `CDG⤳LHR` 同 `SEA⤳YVR`，自費段唔計總距離。
- 兩個轉機係 PIT 同 ORD，必須控制喺 24 小時內。
- 五個停留係 MAD、JFK、BOS、NRT、TPE。
- AA 美國短途可能由 American Eagle regional partner 營運；oneworld 官方把 American Eagle 列入 AA regional network，但指定班次同 Asia Miles 兌換資格仍要出票前確認。
- 唔可以重新加入已排除嘅 `NRT→KIX`，亦唔可以只靠 codeshare 航班號判定實際營運者合格。

### P1：發布後 QA

v6.79.0 尚欠：

- production PageSpeed mobile／desktop 新報告。
- 真 WhatsApp 分享文章、卡、賺里數計劃、RTW 行程嘅預覽。
- 真 Facebook 分享及舊 cache 處理。
- v6.79.0 版本嘅完整 360／390／430／768／1440 瀏覽器回歸。
- 真 iPhone Safari／Android Chrome、PWA 安裝及離線重開測試。

注意：AcreMiles 係 GitHub Pages 靜態網站。WhatsApp crawler 睇唔到 URL `#fragment` 內嘅私人行程，所以 v6.77.0 係按「賺／換」分類用固定縮圖；實際金額、里數或路線放喺分享文字／fragment。除非增加後端圖片服務，唔可以聲稱每個結果縮圖會動態顯示數字。

### P1：用戶或外部資料依賴

- GA4：截圖顯示事件資料 2 個月、使用者資料 14 個月、活動時重設；仍要確認當時已按藍色「儲存」。
- ICO：加入 AcreMiles trading name；公開聯絡地址已由用戶提供，只可使用網站私隱政策內列明嘅 UK Postbox／Courier Point 服務地址。
- IG／Facebook：用戶正改名；未提供正式 URL 前不要估。程式內 Facebook 仍為空。

### P2：技術債

- 622KB／6,886 行 `index.html` 同時包含資料、內容、樣式、引擎同 UI。
- 推薦器係 heuristic，未有最優性證明。
- 文章分享 wrapper 係 `noindex,follow` redirect，唔係真正 SEO 文章頁。
- GitHub 只有每週 freshness workflow，未有完整 PR CI gate。
- 卡資料仍主要以整卡 `verified` 控制，未完全做到欄位級來源及狀態。

方向見 [`ROADMAP.md`](ROADMAP.md) 同 [`ARCHITECTURE.md`](ARCHITECTURE.md)。

## 4. 已確認產品決定

| 題目 | 決定 |
|---|---|
| 北極星 | 「每筆消費，都值得有回報。」完整旅程：橫掂消費 → 順便賺里 → 用里換旅行 → 建立習慣 |
| 固定 Bottom Nav | 點賺 → 點用 → 首頁 → 優惠 → 攻略；首頁置中 |
| 點賺 | 第一個輸入係金額；先顯示結果，再逐步調整；唔再用「大額消費」做全站定位 |
| 點用 | 第一個輸入係里數；第一層只分「一般兌換／環球票」 |
| 環球票模式 | Beginner／Advanced 只屬環球票內部分流，不可做一般 Planner 第一層 |
| 首頁 | 連接點賺、點用、個人內容、今日重點；唔再以「由目的地出發」做產品核心 |
| 資料規則 | 影響推薦嘅資格、迎新、冷河期、年費、兌換等必須 official-only；未知就標 unknown／不入推薦，唔估 |
| 雲端同步 | local-only 係基本模式；Google Login／cloud sync 屬後期獨立 Phase，不可混入今次 |
| 推薦器 | 輔助估算；唔宣稱最佳、保證或全市場最抵 |
| RTW | 全部係教學示例；最終以官方條款、班表、獎勵位及客服出票為準 |
| 區 6 | 接受 GMP→ICN 自行接駁，保留風險提示 |
| 區 8 | 接受兩個自費開口作教學選項 |
| 區 11 | 接受 QR 班次較易變，指定日期再查 |
| 區 13 | 接受季節航線示例，必須標明季節性 |
| 區 10 | v6.78.0 正式線 19,960 哩、5／2／2；維護時 CSV、Demo、文章、metadata 同測試必須同步 |
| 過期優惠 | 保留歷史，不刪除；灰化並停止當現行推薦 |
| 社交內容 | 主要吸流量、App 提供資訊；兩邊都不可誤導，免責要足 |
| 分享圖 | v6.77 用固定「賺／換」分類圖；每結果動態圖需要後端，未有 |
| 私隱地址 | 不公開私人住址；網站只使用用戶確認嘅 UK Postbox 通訊地址及 Courier Point 快遞地址，兩種用途分開標示 |
| IG／FB | 等用戶改名完成後先更新 |

## 5. 同用戶合作方式

- 用戶主要用廣東話；回覆應用清楚、直接嘅繁體廣東話。
- 先講結果同用戶要做乜，再講技術細節。
- 內部工具問題要先嘗試安全替代方案；如果真係需要用戶做嘢，要用一步一步明確指示，唔好只講「缺少某指令／權限」。
- 路線、圖片、合規文案同公開聯絡資料屬需要實質判斷嘅內容，先畀用戶比較／確認，唔好默認。
- 每週卡更新先出差異表；未確認前唔直接發布。
- 未獲明確指示，不要 merge／發布；如用戶直接批准發布，完成後要實際核對正式網站，唔好只確認 GitHub 已更新。
- 唔好將「我做過測試」寫成籠統句；要列明測咗邊個版本、邊種環境、結果同未測範圍。

## 6. 每次修改嘅安全邊界

### 改信用卡或優惠

- 先研究、列來源同差異。
- 更新 `data/cards-official.js`／`data/source-registry.js` 銀行官方資料，同 `data/card-channels.js` 渠道資料；`index.html` 只調整直接消費呢啲來源嘅展示邏輯。
- 重新產生 `cards/` 同 `share/`。
- 跑 freshness、verifier、consent、HTTP、分享 crawler。
- 檢查文章標題、縮圖、FAQ、搜尋及過期狀態同步。

### 改 RTW

- 票規、距離、IATA、營運航司、直航狀態分開核對。
- 同步 `OW_VERIFIED`／`OW_NO_DIRECT`、demo、文章、share metadata、圖片文字及文件。
- 未核實段不可標綠；季節線要獨立提示。

### 改版本／發布

- 同步 build marker、`APP_VERSION`、設定頁版本、`sw.js` cache。
- `node scripts/verify.js index.html` 必須全綠。
- 檢查冇私人地址、token、密碼或不必要個人資料。
- 開 PR、核對 diff／head、經用戶批准先 merge。
- 部署後打開 production 核對版本及改動。

## 7. 文件維護規則

每次完成一個實質版本或產品決定後，同步：

- `MASTER.md`：只更新最高層真相、版本、產品決定及現時風險。
- `HANDOFF.md`：更新下一個 AI 真正需要接住嘅工作。
- `CHANGELOG.md`：記錄已完成改動；未發布文件改動放 `Unreleased`。
- `ROADMAP.md`：移動優先級、依賴及完成條件。
- `ARCHITECTURE.md`：只有結構、資料流、接口或部署改變先更新。
- `PROJECT-STATUS.md`：保持短，唔可以同正式版本狀態互相矛盾。

任何舊報告都只代表當時版本。若內容衝突，優先次序係：法律／安全／官方資料真確性 → `ACREMILES_20260722_DECISION_SOURCE_OF_TRUTH.md` → `ACREMILES_PRODUCT_BLUEPRINT_V2.md` → `ACREMILES_CURRENT_ARCHITECTURE_MAP_V1.md` → Safety Hardened → 最新 GitHub `main`／正式網站（只證明現行實作）→ `MASTER.md`／`HANDOFF.md` → 歷史文件。現行程式同最新產品方向唔一致時，要記錄為待實作，唔可以倒過來用舊程式推翻新決定。
