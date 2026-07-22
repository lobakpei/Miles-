# AcreMiles Master Context

最後核對：2026-07-22（Europe/London）
用途：AcreMiles 專案嘅最高層入口。法律、安全及官方資料真確性規則最高；產品方向以 [`ACREMILES_20260722_DECISION_SOURCE_OF_TRUTH.md`](ACREMILES_20260722_DECISION_SOURCE_OF_TRUTH.md) 為準，再讀 [`ACREMILES_PRODUCT_BLUEPRINT_V2.md`](ACREMILES_PRODUCT_BLUEPRINT_V2.md)、[`ACREMILES_CURRENT_ARCHITECTURE_MAP_V1.md`](ACREMILES_CURRENT_ARCHITECTURE_MAP_V1.md) 同 [`ACREMILES_PRODUCT_HANDOFF_V1_1_SAFETY_HARDENED.md`](ACREMILES_PRODUCT_HANDOFF_V1_1_SAFETY_HARDENED.md)。舊文件只可描述現況，不可推翻 2026-07-22 決定。

## 0. 目前版本

| 項目 | 現況 |
|---|---|
| 正式版本 | **v6.79.0 — Outcome First Big Picture V1** |
| 發布分支 | `feature/outcome-first-v1` → PR #7 → `main` |
| 最新 `main` 基準 commit | `fb63103778831688b89bf5e4b08dbe1882c2f354` |
| Phase 0 狀態 | Canonical Sync + Regression Lock 候選；只新增／更新文件、fixtures、snapshots 同測試，不代表 2026-07-22 新 IA／UI 已實作 |
| 正式產品狀態 | v6.79.0 仍然上線；Phase 0 不改 `index.html`、計算公式、PWA 或生成產品頁 |

本節記錄 v6.79.0 發布狀態；舊 v6.79.0-draft QA 只屬歷史候選紀錄。

## 1. 現時正式狀態

| 項目 | 現況 |
|---|---|
| 正式網站 | <https://acremiles.app/> |
| GitHub | `lobakpei/Miles-`（public） |
| 正式分支 | `main` |
| 正式版本 | **v6.79.0** |
| 發布日期 | 2026-07-21 |
| 上一產品發布 merge | v6.78.0：PR #6，commit `1c7228bcd1e0aa2b194c9c62e1fba61de6e0e049` |
| 部署方式 | GitHub Pages；合併到 `main` 後自動部署 |
| 主程式 | 單一 `index.html`，Vanilla HTML／CSS／JavaScript |
| 資料日期 | 卡庫 `DATA_AS_OF = 2026-07-20` |
| 語言／市場 | 香港繁體中文、香港信用卡及飛行里數 |

重要：部分本地工作目錄嘅 `origin/main` 可能停留喺舊 commit。判斷正式版本時，要以 GitHub `main`、正式網站 build marker 同本表三者核對，唔可以單靠本地 remote ref。

## 2. 產品定位

北極星係：**「每筆消費，都值得有回報。」**完整旅程係：**橫掂消費 → 順便賺里 → 用里換旅行 → 建立習慣。**產品分工固定為：

1. 「點賺」回答一筆／每筆消費點樣賺里；第一個輸入係金額。
2. 「點用」回答手上里數可以換到乜；第一個輸入係里數。
3. 首頁負責連接點賺、點用、個人內容同今日重點。
4. 優惠負責所有會影響點賺／點用結果嘅限時資訊。
5. 攻略負責教育、SEO 同內部連結。

**已取代（superseded）：**「大額消費」唔再係全站定位，只係現行計算器其中一種使用情境；「由目的地出發」唔再係產品核心；Beginner／Advanced 唔可以做一般 Planner 第一層，只可放喺「點用 → 環球票」入面。現行 v6.79.0 仍有舊導覽字眼同 planner gateway，屬待後續 Phase 實作嘅已知差距，Phase 0 不改 UI。

AcreMiles **唔係**：

- 銀行、航空公司、旅行社或出票服務。
- 財務、信貸、法律或個人化投資建議。
- 保證批卡、保證迎新、保證獎勵入帳或保證有獎勵位嘅工具。
- 可以數學上證明「全市場最抵」嘅 optimizer。
- 幫使用者作最終決定嘅 decision engine。

產品語言要用「估算」、「候選」、「推薦組合」、「教學示例」、「待官方／客服確認」；除非有完整證據，禁止用「最佳」、「保證」、「一定」、「全市場最抵」。

## 3. 已上線功能

### 3.1 現行 v6.79.0 規劃及計算（屬基準，不代表新 IA）

- 大額消費賺里數計算器：金額、時間、收入、現有卡、剔除卡、目標計劃、家庭模式等。
- 日常簽賬分類工具。
- 單程里數兌換參考。
- oneworld RTW 規劃器：距離、艙等、停留、轉機、開口、航司組合及逐段航線核實。
- 已儲存計劃同行程；v6.77.0 已統一為「開啟／分享／刪除」。

### 3.2 資料及內容

- 9 張信用卡公開資料頁；其中 8 張可以按現有模型進入推薦，HSBC Visa Signature 只供參考。
- DBS Black 嘅上一期迎新已完結；卡仍可按基本賺里率參與，但迎新按 0 計。
- 20 個文章／路線／優惠分享 metadata 項目。
- 5 條 RTW 教學示例：區 6、8、10、11、13。
- 過期優惠不刪除，會轉灰及標示「歷史優惠／已完結」。

### 3.3 分享、PWA 及個人資料

- 文章有獨立 Open Graph wrapper；信用卡有可索引靜態頁。
- 賺里數／換里數各有一張 1200×675 專屬分享圖。
- 行程可把已清理資料編碼喺 URL fragment，打開後重新載入。
- 計算資料、收藏及設定主要儲存在使用者裝置嘅 `localStorage`。
- 可安裝 PWA；service worker 採同源 network-first，離線時才使用 cache。
- GA4 及 Sentry 只可喺使用者同意後載入；MailerLite 只喺主動提交訂閱後接收 email。

## 4. 產品及內容底線

### 4.1 信用卡資料

來源優先次序：銀行官方產品頁 → 最新迎新 T&C → KFS／收費表 → 獎賞條款 → 第三方比較平台。

- 第三方平台只可以核對額外平台獎賞，唔可以取代銀行官方條款。
- 每項時效資料要有來源、核實日、有效期及狀態。
- 未核實、衝突或過期資料不可繼續當現行優惠；重要欄位未建模嘅卡不可入推薦。
- 「高達」必須拆清銀行迎新、平台加碼、優惠碼、抽獎及附帶條件。
- 所有香港優惠日期以 `Asia/Hong_Kong` 判定。

完整流程見 [`WEEKLY-CARD-UPDATE.md`](WEEKLY-CARD-UPDATE.md)；官方來源基準見 [`CARD-SOURCE-AUDIT.md`](CARD-SOURCE-AUDIT.md)。

### 4.2 RTW 路線

每條路線必須分三層講：

1. 基本票規有冇通過。
2. 指定 IATA 機場配對及指定 oneworld 航司有冇現行直航依據。
3. 指定日期班次、獎勵位、艙等、稅項、YQ 同最終客服出票仍要另行確認。

區 6、8、11、13 已獲產品決定接受為「有已知限制嘅教學示例」：

- 區 6：GMP→ICN 自行接駁可保留作同城轉機場示例。
- 區 8：兩個自費開口係刻意教學選項。
- 區 11：QR 班次變化快，但可保留作示例。
- 區 13：LAX→HEL 季節線可保留，但要明示季節性。

區 10 已於 v6.78.0 正式更新：`HKG→MAD→CDG ⤳ LHR→JFK→BOS→PIT→ORD→SEA ⤳ YVR→NRT→TPE→HKG`，19,960 哩、5 停留／2 轉機／2 開口、商務 230,000 里。10 段精確 IATA／航司已入核實庫；美國短途可由 American Eagle regional partner 營運，指定班次嘅 affiliate／獎勵資格仍要出票前確認。機器可讀基準見 [`ZONE-10-ROUTE.csv`](ZONE-10-ROUTE.csv)，來源同 QA 見 [`QA-REPORT-v6.78.0.md`](QA-REPORT-v6.78.0.md)。

### 4.3 法律、免責及社交內容

- ICO 公開 reference 已確認：`ZC174150`。
- 資料控制者：`Mrs HAU YING OU-YANG`，以 AcreMiles 名義營運。
- 公開客服 email：`support@acremiles.app`。
- 私人住宅地址不可加入 public repo、網站或交接文件。
- 私隱政策已加入用戶明確確認可公開嘅 UK Postbox 通訊地址及 Courier Point 地址，並清楚分開郵件／小型郵件同包裹／快遞用途。
- 仍要在 ICO 登記加入 `AcreMiles` trading name；如 ICO 公開地址需要同步，只可使用同一組已確認服務地址。
- 現時冇 referral 收益。若日後有推薦費、廣告、收佣、代客介紹申請或個人化信貸建議，發布前必須重新做 FCA／金融推廣及專業法律核對。
- 社交平台主要負責吸引流量，App 主要負責資訊；但 eye-catching 文案同縮圖本身仍要清晰、公平、不誤導，免責聲明不可補救一篇本身有問題嘅廣告。

發布 checklist 見 [`SOCIAL-CONTENT-COMPLIANCE.md`](SOCIAL-CONTENT-COMPLIANCE.md)；保存期見 [`DATA-RETENTION-SCHEDULE.md`](DATA-RETENTION-SCHEDULE.md)。

## 5. 立即要留意嘅狀態

以下日期係以 2026-07-21 香港資料狀態計。新 AI 接手時如日期已過，第一件事係重新查官方資料，唔可以沿用舊優惠：

| 日期 | 項目 | 到期後預設處理 |
|---|---|---|
| 2026-07-23 | 渣打國泰：小斯、里先生平台優惠 | 轉歷史／下架現行加碼，除非有新條款 |
| 2026-07-29 | AE 白金卡官方迎新 | 未有新官方 T&C 時停止計迎新 |
| 2026-07-31 | HSBC EveryMile：里先生、MoneyHero | 轉歷史／下架現行加碼 |
| 2026-07-31 | AE Explorer：里先生、小斯 | 轉歷史／下架現行加碼 |

系統會按日期變灰及每週提示，但**唔會自動上網搵新優惠、改資料或發布**。

## 6. 當前未完成事項

1. Phase 0 Draft PR 經 Founder 明確回覆「Phase 0 approved」前，停止；不可進 Phase 1。
2. 獲批後先按獨立 PR 做 Card Data Source Extraction；不可同 UI 或公式修改混埋。
3. 每週信用卡及平台優惠核實；近期 7 個到期提醒優先。
4. v6.79.0 發布後 production QA：最新 PageSpeed、真 WhatsApp／Facebook 分享預覽、手機／平板／桌面回歸。
5. 核實 GA4 管理頁設定已真正按「儲存」；現有截圖顯示事件 2 個月、使用者 14 個月、活動時重設。
6. ICO 加 trading name，並按需要同步已確認 UK Postbox 公開服務地址。
7. 用戶改名完成後先更新 Instagram／Facebook；程式目前 IG 為 `@acremiles`，Facebook URL 留空。
8. 中期拆分巨大 `index.html`、加 CI release gates、把文章 wrapper 升級成可索引全文頁。

## 7. 新 AI 建議閱讀次序

1. [`ACREMILES_20260722_DECISION_SOURCE_OF_TRUTH.md`](ACREMILES_20260722_DECISION_SOURCE_OF_TRUTH.md)：最新產品決定；法律、安全、官方資料真確性規則仍然更高。
2. [`ACREMILES_PRODUCT_BLUEPRINT_V2.md`](ACREMILES_PRODUCT_BLUEPRINT_V2.md)：完整產品藍圖。
3. [`ACREMILES_CURRENT_ARCHITECTURE_MAP_V1.md`](ACREMILES_CURRENT_ARCHITECTURE_MAP_V1.md)：現況、風險同目標分層。
4. [`ACREMILES_PRODUCT_HANDOFF_V1_1_SAFETY_HARDENED.md`](ACREMILES_PRODUCT_HANDOFF_V1_1_SAFETY_HARDENED.md)：既有安全邊界。
5. 本文件同 [`HANDOFF.md`](HANDOFF.md)。
6. [`ROADMAP.md`](ROADMAP.md) 同 [`ARCHITECTURE.md`](ARCHITECTURE.md)。
7. 根據任務再讀專題文件：
   - 信用卡：`WEEKLY-CARD-UPDATE.md`、`CARD-SOURCE-AUDIT.md`
   - RTW：`RTW-AUDIT.md`、`RTW-ROUTE-VERIFICATION-20260720.md`
   - 區 10：`ZONE-10-ROUTE.csv`、`ZONE-10-FABLE5-HANDOFF.md`
   - QA：最新版本 `QA-REPORT-v6.79.0.md`
   - 私隱／合規：`DATA-RETENTION-SCHEDULE.md`、`SOCIAL-CONTENT-COMPLIANCE.md`
8. `AGENTS.md`：所有程式及內容改動都必須遵守嘅 repo 級守則。

## 8. 最低交付及發布規則

任何程式、資料或內容改動，至少要：

```bash
node scripts/verify.js index.html
node scripts/test-consent-gate.js
node scripts/regression-lock.js
```

信用卡或分享 metadata 改動後，再做：

```bash
node scripts/generate-card-pages.js
node scripts/generate-share-pages.js
node scripts/audit-freshness.js
```

有本地 HTTP server 時：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
node scripts/smoke-http.js http://127.0.0.1:4173/
```

版本發布要同步：`index.html` 第一行 build marker、`APP_VERSION`、設定頁版本及 `sw.js` cache 名。未經用戶明確批准，不可自行 merge／發布。
