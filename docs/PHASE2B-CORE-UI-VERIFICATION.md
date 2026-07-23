# Phase 2B Core UI Verification

文件狀態：`AUTOMATED VERIFICATION COMPLETE — BROWSER EVIDENCE BLOCKED`

最後更新：2026-07-23

工作分支：`agent/acremiles-phase2a-shell-ui-20260723`

Pull Request：`#10 — OPEN DRAFT`

Founder 狀態：`未批准；等待完整 combined Phase 2A＋Phase 2B Preview review`

本文件記錄 Phase 2B core UI、資料邊界及 exact source automated verification。佢唔係批准紀錄，亦唔代表已 merge 或已部署 production。Cloud Browser 控制層持續 timeout，所以本輪冇新 screenshots，亦唔會把 Phase 2A 舊圖冒充 Phase 2B 證據。

## 1. 交付狀態

| 項目 | 狀態 |
|---|---|
| Phase 2A 最後 Header correction | `d6329f682a1f19fb655872e303c912938b41063d` |
| Phase 2B core UI implementation | 已完成；exact source automated gates通過 |
| Draft PR #10 | 必須保持 Open Draft |
| Merge | 未做；未獲授權 |
| Production deploy | 未做；未獲授權 |
| Founder approval | 未有；不得聲稱批准 |
| Phase 2B commit／final PR head | 由 immutable PR #10 delivery report列出，避免文件自我引用改變 commit SHA |
| Exact tree SHA | 由 immutable PR #10 delivery report列出 |
| Founder HTTPS Preview | `https://acremiles-phase2a-preview.lobakpei.chatgpt.site`；只可在 exact final tree checkpoint成功後作 review |
| Phase 2B changed files | 13個；見 6.1 |

## 2. 已實作範圍

### 2.1 Phase 2A shell preservation

- Welcome、Consent、Profile Hub、五個 Bottom Nav tabs、large-to-compact Header、analytics consent gate、localStorage reset 同共用 scroll／focus helper沿用 Phase 2A。
- Header 唔再有 legacy travel-first runtime copy；Header 保留 logo、Profile icon 同 large-to-compact transition。
- Phase 2B 冇加入 Google Login、真正 cloud sync、notifications 或 production deployment wiring。

### 2.2 Homepage

目前 `tab-journey` 次序為：

1. 三個情境 Hero Carousel
2. 「更多消費示範」
3. 「優惠」
4. 「我的內容」：已儲存計劃、行程、收藏
5. 現有精選消息／廣告 carousel
6. `今日重點`，使用原生 `<details>`，預設收起

舊 Greeting、單一 full-background iPhone article feature、重複 iPhone scenario card及 Homepage planner prompt已不再構成新首頁第一層。冇加入 Featured Guides。

### 2.3 Hero Carousel

- V1 只包含 iPhone、買車、Wedding／結婚。
- 使用 native horizontal scrolling 支援 swipe；另有 dot indicators、上一個／下一個按鈕。
- 正常 motion 下每 5.2 秒自動轉頁；頁面隱藏或離開首頁時唔推進；`prefers-reduced-motion` 下唔啟動自動播放。
- 每張 CTA 文字固定為 `點做到？`。
- CTA 直接將情境輸入帶入點賺、呼叫現有 `BM.optimize()`、顯示完成結果，再畀使用者直接修改；唔先開文章，亦唔要求重新輸入金額。
- Hero 顯示係 Engine output，唔保存另一份 marketing 手填里數。

### 2.4 更多消費示範

目前有七個額外例子：裝修、傢俬、電器、機票／酒店、學費、醫療／牙科、大型網購。佢哋冇重複 iPhone、買車或 Wedding。

- Mobile：native swipe。
- Desktop：箭嘴、mouse drag、wheel-to-horizontal。
- 每個例子用同一 `phase2bDemoInput()`＋`BM.optimize()` path。
- 金額係產品示範輸入，唔係市場平均價格；商戶收卡、分卡、交易類別及手續費仍要另行確認。

### 2.5 點賺

- 第一個可編輯輸入只有消費金額；有有效金額後自動計算。
- 其他條件放入 `調整條件及偏好`，結果可以先睇再 refine。
- Summary 明示 `新申請 X 張` 同 `預計可賺 X 里`，使用整里顯示，冇再製造 ±10% 範圍。
- 已加入年費卡 checkbox；預設關閉，年費分開顯示。
- 被排除卡保持灰色可見，可恢復並即時重新計算。
- Opportunity UI 使用現有 Engine output／comparison run 呈現：
  - 下一個消費門檻
  - 第二位申請人／配偶
  - 高年費卡機會
  - 回報遞減
- 冇 confidence score。

### 2.6 點用

- 第一個輸入係可用里數；可以由點賺完成結果直接帶入。
- 第一層只分 `一般兌換` 同 `環球票`。
- Beginner／Advanced 只留喺環球票內。
- 一般兌換 V1 只顯示來回機票，支援 Asia Miles／Avios及一人、兩人、家庭四人。
- 單程、酒店同其他兌換清楚標示 `即將推出`。
- 第一層用人類目的地名；IATA 只放展開細節。
- 冇顯示或排序平均現金票價。

### 2.7 Card Detail

- 保持 overlay；使用共用 scroll lock、focus entry／return及 backdrop／close button。
- 有效 render 只包含：卡片解釋／教育、官方資格、迎新、年費、期限、排除、官方來源、獨立申請渠道、收藏 heart及主 CTA `立即申請`。
- 銀行官方資料同第三方渠道資料以獨立 `data-source-scope` section 分開。
- 關閉 overlay唔重新計算，原結果 DOM及 `lastRes` 保持。
- 冇 related cards、related articles或 confidence score。

## 3. Hero exact inputs and Engine outputs

三個 Hero 共用以下固定輸入：

- `income: 300000`
- `months: 6`
- `goal: "am"`
- `owned: []`
- `family: false`
- `income2: 0`
- `owned2: []`
- `maxNewCards: 2`
- `allowHighFee: false`

三個 scenario另有共用展示 metadata：`asOf: "2026-07-23"`、`verifiedUntil: "2026-07-31"`；呢兩個欄位唔會傳入 Engine。

以下係 exact source由 Phase 2B regression test直接呼叫同一 `BM.optimize()` 抽取及核對嘅值：

| Hero | Exact amount／pattern | Exact exclusions | Engine total | UI整里 | Welcome total | 新卡 | Engine allocation | 首年／續期年費 | UI CPM |
|---|---|---|---:|---:|---:|---:|---|---:|---:|
| iPhone 17・512GB | HK$8,599／`lump` | `sc-cathay`, `amex-explorer`, `citi-pm` | 21,719.8 | 21,720 | 20,000 | 1 | EveryMile HK$8,599 | HK$0／HK$2,000 | HK$0.40／里 |
| 買車 | HK$100,000／`spread` | `sc-cathay`, `amex-explorer` | 59,625 | 59,625 | 40,000 | 2 | Citi PremierMiles HK$5,000＋EveryMile HK$95,000 | HK$0／HK$3,800 | HK$1.68／里 |
| Wedding／結婚 | HK$150,000／`spread` | `sc-cathay`, `amex-explorer` | 69,625 | 69,625 | 40,000 | 2 | Citi PremierMiles HK$5,000＋EveryMile HK$145,000 | HK$0／HK$3,800 | HK$2.15／里 |

iPhone metadata在目前實作記錄：

- 型號／容量：iPhone 17・512GB
- Apple 香港官方售價輸入：HK$8,599
- `sourceURL`: `https://www.apple.com/hk-zh/shop/buy-iphone/iphone-17`
- `paymentURL`: `https://www.apple.com/hk-zh/shop/help/payments`
- `asOf`: 2026-07-23
- 單一 Apple Pay 信用卡交易；發卡行服務費未建模

買車同 Wedding 金額係明確 authored demonstration input，唔係市場價格。兩者只喺商戶確認可直接碌卡／分卡、交易屬合資格零售簽賬及手續費可接受時成立。

## 4. Engine integrity and explicit gates

### 4.1 Formula unchanged

Phase 2B UI冇改 `BM.optimize()` 核心公式。現行：

```text
costPerMile = amount / totalMiles
```

首年／續期年費仍然分開返回，**唔會加入 CPM 分母或分子**。年費 checkbox只控制既有 `allowHighFee` gate；UI唔可以將呢個 CPM描述成已計年費嘅「真實總成本」。

### 4.2 CPM priority conflict

產品要求嘅展示優先次序係最低 cost per mile → total value → practical constraints；現有 Engine則係既有 heuristic，冇一個可證明完全等同呢個三層排序嘅 comparator。

今次處理方式：

- 唔改 Engine公式或偷偷重排。
- 結果頁清楚寫只比較現有收錄／通過資料門檻嘅卡。
- 清楚寫排序沿用既有 Cost-per-Mile Engine，而且唔係全市場絕對最優。
- `total value` 未有獨立、可追溯貨幣估值模型，因此唔顯示虛構價值分數。

呢個係已 gate、未解決嘅 Engine／產品規格 conflict；後續若要正式改排序，必須獨立定義目標函數、fixtures及批准範圍。

### 4.3 SC／AE model conflicts

`sc-cathay` 同 `amex-explorer` 目前有已記錄嘅迎新／基本里數重複計算風險：

- 預設加入 `excludedCards`。
- 結果仍以灰色卡片保留，唔會消失。
- 使用者可以手動恢復。
- 恢復後即時重算，並顯示結果可能包含已知重複計算、只供測試比較嘅警告。

iPhone Demo另有 scenario-specific `citi-pm` exclusion；呢項唔應被誤寫成全域 model conflict。

### 4.4 Opportunity numbers

- 下一門檻只使用 Engine row嘅 `nextTier`。
- 配偶增幅只有存在第二位申請人輸入時先重算；冇資料就唔顯示數字。
- 年費卡機會以 `allowHighFee` true／false comparison run計差額，年費獨立列出。
- 回報遞減以同一 Engine增加一個明示 step後嘅 marginal miles／marginal CPM計算。
- 冇輸入或冇正數差額時會明講冇可顯示數字，唔補估值。

## 5. Redemption limitations

### 5.1 Avios

Avios目前只係現有可追溯 row-level資料，**未完成逐航線、逐艙等官方覆核**。UI會清楚標示 `待官方逐格覆核`；未完成前不可將 Avios結果描述成與已核實 Asia Miles表同級。

### 5.2 Cash fares

Repository冇可支持「一年平均現金票價」嘅 dataset、採樣方法、日期窗、航線／艙等 mapping或多人計價規則。現有 `REDEMPTIONS.cashCost`唔符合呢個要求；Phase 2B一般兌換唔讀取佢作價值排名，亦唔顯示 fabricated cash value。

### 5.3 Hidden legacy planner

舊單程／來回工具同舊 `redeemSub` markup仍保留作向後兼容，但唔係一般兌換 V1第一層入口。任何之後清理都要另行保護 RTW state、deep links同舊 `bm_*`資料。

## 6. Protected boundaries

相對 Phase 2A corrective tree：

- `data/**`、`cards/**`、`share/**`、`img/**`、`manifest.json`：零 diff。
- `BM.optimize()`公式：零改動；22/22 optimizer fixtures零數值 drift。
- Welcome、Consent、Profile Hub、五個 Bottom Nav、Header collapse、analytics gate及共用 scroll lock：Phase 2A regression全數通過。
- `sw.js`只有刻意嘅 cache namespace整合改動：`acremiles-v6.79.0` → `acremiles-v6.80.0`，確保既有 PWA client唔會繼續供應舊 Phase 2A shell；precache路徑同 offline fallback邏輯冇改。
- `bm_input`只加入兩個向後兼容 optional fields：`allowAnnualFee: boolean`同 `restoredConflictCards: string[]`。16個既有 storage keys及16/16 reset coverage保持。

### 6.1 Phase 2B changed files

1. `docs/ARCHITECTURE.md`
2. `docs/HANDOFF.md`
3. `docs/MASTER.md`
4. `docs/PHASE2B-CORE-UI-VERIFICATION.md`
5. `docs/ROADMAP.md`
6. `index.html`
7. `scripts/regression-lock.js`
8. `scripts/test-phase2b-ui.js`
9. `scripts/verify.js`
10. `sw.js`
11. `tests/snapshots/dom-v6.79.0.json`
12. `tests/snapshots/localstorage-v6.79.0.json`
13. `tests/snapshots/product-surface-v6.79.0.json`

## 7. Verification matrix

| Gate | Final result |
|---|---|
| `node scripts/regression-lock.js` | PASS，6/6 |
| `node scripts/verify.js index.html` | PASS |
| `node scripts/test-consent-gate.js` | PASS |
| `node scripts/test-phase2a-shell.js` | PASS |
| `node scripts/test-phase2b-ui.js` | PASS，217 assertions |
| `node scripts/audit-freshness.js` | PASS，0 errors／17 reminders |
| `node scripts/smoke-http.js` | PASS，111/111 paths |
| Generated-file drift | PASS，33 files零 drift |
| JavaScript syntax | PASS，19/19 |
| JSON parse | PASS，9/9 |
| localStorage reset | PASS，16/16 |
| 22 optimizer fixtures | PASS，零數值 drift；fixture SHA-256 `959d960f2b3b43767e7b60c683b6151403eebff5c6e9bf3b60333891c1390f21` |
| Mobile 390×844 browser QA | NOT RUN：Cloud Browser CDP連線持續 timeout |
| Desktop 1280×800 browser QA | NOT RUN：同一 browser-control blocker |
| App-origin console errors | NOT RUN：未能建立可控制 browser session，唔作零錯誤聲稱 |
| Global red error banner | NOT RUN：未能建立可控制 browser session |
| Refresh／PWA／offline | Static wiring、cache version、manifest及HTTP PASS；interactive browser refresh／offline NOT RUN |
| Full-project six-phrase legacy search | PASS；canonical tree連同 Sites mirror／Welcome QA copy全部0 matches |

Browser recovery已依照 Browser同 Sites preview troubleshooting做一次有界流程：識別唯一 Chrome CDP browser、列 tabs、新建 fresh tab、只導航 agent Preview URL；每次讀取／導航均於控制層 timeout。冇開 live Sites URL、冇轉用 standalone Playwright，亦冇觀察到 app-origin產品錯誤。

## 8. Screenshot evidence

| Required evidence | File／link |
|---|---|
| Welcome | 未能擷取：Cloud Browser CDP timeout |
| Header without legacy slogan | 未能擷取；repository-wide literal search及runtime regression均PASS |
| Hero：iPhone | 未能擷取；exact metadata／Engine assertion PASS |
| Hero：買車 | 未能擷取；exact metadata／Engine assertion PASS |
| Hero：Wedding／結婚 | 未能擷取；exact metadata／Engine assertion PASS |
| 更多消費示範 | 未能擷取；七個非重複情境 assertion PASS |
| 點賺 initial result | 未能擷取；amount-first／auto result assertion PASS |
| 點賺 refined result | 未能擷取；annual-fee／excluded-card restore assertion PASS |
| 點用 initial screen | 未能擷取；miles-first／two-mode assertion PASS |
| Card Detail | 未能擷取；active overlay scope／unchanged-result close assertion PASS |

本輪冇建立新 evidence image。舊 Phase 2A screenshots唔代表 Phase 2B exact tree，因此冇重用。

## 9. Known limitations

1. Engine仍係 heuristic，未證明符合完整三層推薦排序或全市場最優。
2. CPM公式冇包含年費；年費只可分開呈現。
3. SC Cathay／AE Explorer model conflict以預設排除＋可恢復警告 gate處理，未修 Engine。
4. Avios未完成逐格官方覆核。
5. 冇一年平均現金票價 dataset；因此冇 cash-value ranking。
6. 買車、Wedding及額外消費例子係明示產品輸入；商戶收卡、手續費及交易資格唔可由 App保證。
7. 主程式仍係大型單一 `index.html`；同名 legacy helper／hidden markup增加回歸風險。
8. 今次冇 Google Login、真正 cloud sync、notifications或新 backend。
9. Cloud Browser控制層 timeout令本輪未能提供 fresh screenshots、390×844／1280×800互動結果、console或red-banner檢查；呢個係未完成證據，唔係產品 PASS，亦唔係已觀察到嘅 app failure。

## 10. Review and rollback

- PR #10保持 Open Draft；唔標 Ready、唔 merge、唔部署 production。
- 未合併前 rollback係關閉 Draft PR／停止使用 preview；`main`保持不變。
- 如日後獲批准合併後需要撤回，使用普通 `git revert`；exact Phase 2B commit由 immutable final delivery report列出。
- 停喺 Founder review，唔可以將本文件當批准證明。
