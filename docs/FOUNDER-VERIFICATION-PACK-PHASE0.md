# AcreMiles Founder Verification Pack — Phase 0

日期：2026-07-22（Europe/London）

## 結論先行

Phase 0「Canonical Sync + Regression Lock」已完成候選版；只涉及文件、fixtures、snapshots 同測試工具。正式產品檔、UI、卡數字、optimizer 公式、PWA 同生成頁全部零修改。呢個 PR 只供 Founder 核實；**未 merge、未 deploy，正式網站仍係 v6.79.0。**

| 項目 | 結果 |
|---|---|
| Work Package SHA-256 | `813b51c6224bdd481bce255167ff093da828f33371e74445b758ef250df7124c`，吻合 |
| 最新 `main` baseline | `fb63103778831688b89bf5e4b08dbe1882c2f354` |
| Baseline version | v6.79.0 |
| Baseline working tree | 新 Phase 0 worktree 建立時乾淨；其他既有 dirty worktree 完全冇改 |
| Phase 0 branch | `agent/acremiles-phase0-canonical-sync-20260722` |
| Draft PR | <https://github.com/lobakpei/Miles-/pull/8>（Draft） |

## 1. 2026-07-22 核心產品決定逐項對照表

狀態解讀：

- **已寫入**：已成為 repo canonical truth；如屬現有能力，v6.79.0 亦基本一致。
- **未寫入**：決定已記錄，但正式產品／資料層未實作；Phase 0 刻意不做。
- **有衝突**：v6.79.0 現行 UI／Engine 仍有相反或舊做法；已在 docs 標為 superseded／待後續 Phase，今次冇偷改產品。

| ID | 核心決定 | 狀態 | v6.79.0／Phase 0 對照 |
|---|---|---|---|
| D-01 | 法律／安全／官方資料最高；產品方向以 2026-07-22 Decision SoT 為準 | 已寫入 | MASTER／HANDOFF／ROADMAP／ARCHITECTURE 已同步優先級 |
| D-02 | 北極星「每筆消費，都值得有回報」 | 有衝突 | `<title>` 同首頁 H1 已使用；Welcome 仍顯示「畝・里 · 香港里數優化」 |
| D-03 | 旅程：橫掂消費 → 順便賺里 → 用里換旅行 → 建立習慣 | 未寫入 | canonical docs 已記錄；現行 IA 未完整表達四步旅程 |
| D-04 | 固定 nav：點賺 → 點用 → 首頁 → 優惠 → 攻略 | 有衝突 | 現行係計算 → 規劃 → 首頁 → 優惠 → 攻略 |
| D-05 | 「大額消費」不再係全站定位；「由目的地出發」不再係產品核心 | 有衝突 | 舊 About／文章／變數仍有舊語意；docs 已清楚標 superseded |
| D-06 | Welcome 用新 slogan、移除「誠・里／香港里數優化」、0.8–1.2 秒 | 有衝突 | 現行 Welcome 仍有舊 tag，程式註解／節奏約 4 秒 |
| D-07 | Consent 修 scroll、鎖背景、縮 CTA、減黃框、secondary「只限必要」 | 未寫入 | 現有 consent／privacy gate 保留；Phase 0 冇改 UI，互動修復留 Phase 2 |
| D-08 | Header 問號＋三點合併為 Profile Hub | 有衝突 | 現行仍係兩個獨立按鈕；Google 頭像／Profile Hub 未做 |
| D-09 | 首頁暫時完全取消 Greeting | 已寫入 | 現行首頁直接進 Hero，冇個人名 greeting |
| D-10 | 首頁次序：Hero、更多示範、優惠、個人內容、廣告、今日重點 | 未寫入 | v6.79.0 Outcome Showcase 只係前身，未按新完整次序重組 |
| D-11 | Hero V1 固定 iPhone 17 Pro Max 2TB／買車／結婚，全部先核實 | 有衝突 | 現行三個情境係 generic iPhone HK$8,000、EveryMile、Explorer；不可冒充新三 Hero |
| D-12 | Hero CTA 固定「點做到？」並直接帶入點賺結果 | 有衝突 | 現行 CTA／流程字眼與新固定 contract 未完全一致 |
| D-13 | 個人內容按儲存時間、可 pin；短暫「繼續上次」有嚴格條件 | 已寫入 | saved cards／pin 基礎已存在；短暫提示完整規則仍屬後續 |
| D-14 | 點賺第一個輸入只係消費金額 | 已寫入 | 現行計算器第一層先問金額，其他條件後顯示 |
| D-15 | 金額 slider 0–300,000+、手輸至 10,000,000、非線性、即時計 | 未寫入 | 現行係文字輸入＋下一步，未有指定 slider contract |
| D-16 | Result Hero＋摘要＋卡／迎新浸＋summary＋opportunity＋timeline＋儲存分享 | 未寫入 | 現行有部分結果元件，但未依新順序／命名完整落地 |
| D-17 | 排除卡灰化留場、可恢復、即時重算 | 有衝突 | 現行有排除／加返及比較邏輯，但唔係新指定灰化留場 pattern |
| D-18 | 名稱固定「迎新利用率」，只可由 Engine 計算 | 有衝突 | 現行 label 係「迎新佔比」；fixture 已鎖現值，未改 UI |
| D-19 | Opportunity Engine 主動搵下一 threshold／第二人／年費機會 | 未寫入 | 現行 only 有局部管家／替補提示，未係新完整 opportunity layer |
| D-20 | Timeline 不承諾固定完成期；真實日期後先加 Calendar | 有衝突 | 現行用 applyWeeks、每月兩張、12 個月 prep 等 heuristic 排程 |
| D-21 | 儲存由用戶主動命名；資料更新可帶原輸入重算；保留分享圖；不做 PDF | 已寫入 | 儲存／分享基礎存在；過時重算提示仍未完整 |
| D-22 | Engine 支援 `tiered`／`threshold`／`feePurchase`，逐浸計 | 已寫入 | 現行 `bm-core` 已有三類同逐浸 hull／分配；fixtures 已鎖 |
| D-23 | 目標函數第一係每里成本最低，再考慮總里數／可用金額 | 有衝突 | 現行 heuristic 混合邊際里數、基本率同 1.10 直接計劃偏好，未重寫公式 |
| D-24 | 會改推薦嘅規則只接受官方來源；未知不推薦 | 有衝突 | 主 gate 已有，但銀行第二張卡乘數仍明標「市場整理，待官方」 |
| D-25 | 香港個人里數卡完整庫；官方卡層同渠道／Referral 層分開 | 未寫入 | 現行 9 張卡，渠道部分仍藏喺 notes／獨立簡表，未抽完整 data layer |
| D-26 | Card Detail 顯示卡面、資格、迎新、年費、期限、排除、來源、申請渠道 | 已寫入 | 現有 detail 已有大部分；field-level source 同完整渠道比較未完成 |
| D-27 | 點用第一個可編輯輸入係里數；可由點賺帶入 | 已寫入 | 現行已有 `haveMiles` 同 `fillFromOpt` |
| D-28 | 點用第一層只分一般兌換／環球票 | 有衝突 | 現行第一層係一般 Beginner／Advanced gateway，再有 ideas／oneway／rtw subtabs |
| D-29 | 一般兌換 V1 先做來回；一人／二人／家庭；只支援 Asia Miles／Avios | 未寫入 | 現行 redemption list／比較係舊結構，未完成新 plan carousel |
| D-30 | 一般兌換排序：12 月平均現金票價 → 最少剩餘里數 → 震撼度 | 未寫入 | 缺 12 個月現金票價數據來源／方法，未可實作 |
| D-31 | Beginner／Advanced 只可放「環球票」內 | 有衝突 | 現行係一般 Planner 第一層；docs 已標 superseded，Phase 0 冇搬 UI |
| D-32 | 優惠保留過期內容、灰化、預設摺起；卡層／渠道層分開 | 已寫入 | 保留／灰化基礎已存在；完整分層留 Phase 1／後續 |
| D-33 | 攻略用 Category／Tags／Entities，App IA 同 SEO IA 雙層 | 未寫入 | 現行文章內嵌 App、wrapper 多為 `noindex`，未有 CMS／全文頁 |
| D-34 | 收藏統一；Journey 可手動記申請／批核／迎新／年費日期 | 未寫入 | 收藏及 saved plan 基礎存在；Journey progress schema 未做 |
| D-35 | Wallet 放 Profile Hub，手動加卡，不收卡號／CVV／網銀資料 | 未寫入 | 未有 Wallet；現行只係 optimizer `owned` IDs |
| D-36 | 不登入都完整可用；Google Login／cloud sync 可選、另做安全審查 | 未寫入 | local-only 已符合基本模式；cloud provider 未決定，冇加 login |
| D-37 | Notification 只係個人 Assistant，不作 marketing | 未寫入 | 未有 notification system |
| D-38 | V1 不做全域 Search，只做各 module 局部 Search | 已寫入 | 決定已記錄；現有局部搜尋保留，冇新增全域 search |
| D-39 | Data Integrity 要 field-level source／日期／狀態／計算基礎 | 有衝突 | 現行多數只係整卡 `verified`；inventory 同 backlog 已記錄缺口 |
| D-40 | 後期項目不可塞入同一版；每 Phase 獨立 Draft PR／Founder gate | 已寫入 | ROADMAP 已鎖 Phase 0–6；本次停喺 Phase 0 |

## 2. 今次所有修改檔案

共 17 個：

1. `docs/ACREMILES_20260722_DECISION_SOURCE_OF_TRUTH.md`
2. `docs/ACREMILES_ARCHITECTURE_INVENTORY_V1.json`
3. `docs/ACREMILES_CURRENT_ARCHITECTURE_MAP_V1.md`
4. `docs/ACREMILES_PRODUCT_BLUEPRINT_V2.md`
5. `docs/ARCHITECTURE.md`
6. `docs/HANDOFF.md`
7. `docs/MASTER.md`
8. `docs/ROADMAP.md`
9. `docs/PHASE0-OFFICIAL-VERIFICATION-BACKLOG.md`
10. `docs/PHASE0-REGRESSION-LOCK.md`
11. `docs/FOUNDER-VERIFICATION-PACK-PHASE0.md`
12. `scripts/regression-lock.js`
13. `tests/fixtures/optimizer-v6.79.0.json`
14. `tests/snapshots/dom-v6.79.0.json`
15. `tests/snapshots/generated-files-v6.79.0.json`
16. `tests/snapshots/localstorage-v6.79.0.json`
17. `tests/snapshots/product-surface-v6.79.0.json`

## 3. 正式產品檔案修改確認

| 正式產品範圍 | 有冇修改 | 證據 |
|---|---|---|
| `index.html` | **冇** | baseline／after SHA-256 同為 `aabde6e9b4c8dea4fcbd5209168e689d3d40c8019b228396e1a4b7d97833fe91` |
| `sw.js` | **冇** | 同為 `a6903a7496cace120ee6a7204305d00bc4140ee68c652b08083fced09d97b8f3` |
| `manifest.json` | **冇** | 同為 `ed65ff54e9aa43948a43a1ba99b51e3ce8b390c41cb2de3b64f988dfa9f1c4d5` |
| `cards/` | **冇** | 10 檔 tree 同為 `71721d3918afc5f2305a894a3256504a342f81355fc4db89c98fb28f306c553e` |
| `share/` | **冇** | 23 檔 tree 同為 `cc891925c29edb2e4ec4903edf6d46b5e0c9837a691ef135fb44827a64fe03d9` |
| `img/` | **冇** | 36 檔 tree 同為 `843893948de4987b946a1be392cfebb4c7be8c12d9f9f514d09a5e32e039b152` |

`git diff origin/main -- index.html sw.js manifest.json cards share img` 為空。冇改 UI，冇改卡數字，冇改計算公式。

## 4. Optimizer fixtures 前後比較

相同 regression suite 已分別喺 detached baseline `fb631037…` 同 Phase 0 worktree 執行，22／22 完全一致：

| Fixture | Before miles | After miles | Welcome | First-year fee | Drift |
|---|---:|---:|---:|---:|---|
| single-5000 | 20,625 | 20,625 | 20,000 | 0 | 0 |
| family-5000 | 20,625 | 20,625 | 20,000 | 0 | 0 |
| single-8000 | 21,625 | 21,625 | 20,000 | 0 | 0 |
| family-8000 | 21,625 | 21,625 | 20,000 | 0 | 0 |
| single-16999 | 43,558 | 43,558 | 40,000 | 0 | 0 |
| family-16999 | 52,749.666667 | 52,749.666667 | 50,000 | 0 | 0 |
| single-30000 | 65,058.333333 | 65,058.333333 | 58,000 | 0 | 0 |
| family-30000 | 85,783.333333 | 85,783.333333 | 80,000 | 0 | 0 |
| single-100000 | 105,791.666667 | 105,791.666667 | 86,000 | 0 | 0 |
| family-100000 | 173,916.666667 | 173,916.666667 | 152,000 | 0 | 0 |
| single-300000 | 163,458.333333 | 163,458.333333 | 106,000 | 0 | 0 |
| family-300000 | 249,250 | 249,250 | 192,000 | 0 | 0 |
| single-1000000 | 303,458.333333 | 303,458.333333 | 106,000 | 0 | 0 |
| family-1000000 | 406,916.666667 | 406,916.666667 | 212,000 | 0 | 0 |
| owned-card-30000 | 46,100 | 46,100 | 38,000 | 0 | 0 |
| excluded-card-30000 | 46,100 | 46,100 | 38,000 | 0 | 0 |
| annual-fee-off-300000 | 163,458.333333 | 163,458.333333 | 106,000 | 0 | 0 |
| annual-fee-on-300000 | 207,125 | 207,125 | 151,000 | 9,500 | 0 |
| lump-spend-100000 | 105,791.666667 | 105,791.666667 | 86,000 | 0 | 0 |
| tiered-sc-cathay-110000 | 58,333.333333 | 58,333.333333 | 40,000 | 0 | 0 |
| threshold-citi-pm-8000 | 21,000 | 21,000 | 20,000 | 0 | 0 |
| fee-purchase-citi-8000 | 21,000 | 21,000 | 20,000 | 0 | 0 |

所有 fixture `spendSum` 同輸入金額守恆；完整逐卡、tier、warning、butler note 內容見 fixture JSON。

## 5. 生成卡頁及主要網站輸出 drift

- `generate-card-pages.js`：在 temp copy 生成 9 張卡頁＋卡 index。
- `generate-share-pages.js`：在 temp copy 生成 22 個 social share pages。
- `cards/**`＋`share/**` 生成前後：33 檔，tree SHA-256 同為 `86a30ce2f23c0090dc371b75238dcc9e81fb3b6256d98d3349341cba7830c290`。
- Generated-file drift：**0**。
- `index.html` 完整 hash、structural DOM hash、209 個 ID 元素、bottom nav、16 個 localStorage keys：baseline／after 全部一致。
- 主要網站輸出 drift：**冇**。

## 6. 所有測試結果

| Gate | 結果 |
|---|---|
| Work Package SHA-256／安全解壓／22 個檔案完整閱讀 | PASS |
| 13 張參考圖逐張視覺檢查 | PASS |
| Canonical docs 與上載原文 byte-for-byte `cmp` | PASS |
| 備份 ZIP integrity／獨立解壓／Git bundle／`git fsck` | PASS |
| 備份 ZIP release verifier | PASS |
| 備份 ZIP HTTP smoke | PASS，109／109 |
| `node scripts/regression-lock.js`（detached baseline） | PASS，5／5 snapshot groups |
| `node scripts/regression-lock.js`（Phase 0 after） | PASS，5／5 snapshot groups |
| Generated cards／share temp regeneration | PASS，0 drift |
| `node scripts/verify.js index.html` | PASS，全部 invariant 通過 |
| `node scripts/test-consent-gate.js` | PASS |
| `node scripts/audit-freshness.js` | PASS with warnings：0 errors／7 expiry reminders；香港日期 2026-07-23 |
| Local HTTP smoke | PASS，109／109 |
| Regression script syntax | PASS |
| 6 個 JSON parse | PASS，6／6 |
| Core docs local Markdown links | PASS |
| Protected product path git diff | PASS，空 diff |
| Staged whitespace check | WARN：3 份 canonical Markdown 原文含刻意兩空格 hard line breaks；為保持上載原文 byte-for-byte 而保留，程式／產品檔冇 whitespace issue |
| Browser／axe gate | **未能執行**：環境冇 `CHROMIUM_PATH`／Chromium binary；exit 2。因正式 HTML 完全同 baseline，冇虛報視覺 QA |
| Production social crawler standalone gate | **未計作 PASS**：sandbox 外部請求未能喺安全時限內完成；本地 verifier 已通過 OG metadata、圖片尺寸及 wrapper 檢查 |

Freshness 7 個提醒：渣打兩個渠道 2026-07-23、AE 白金官方迎新 2026-07-29、HSBC EveryMile 兩個渠道同 AE Explorer 兩個渠道 2026-07-31。Phase 0 按指示只列出，冇改數。

## 7. 所有待官方核實規則

完整逐項表見 [`PHASE0-OFFICIAL-VERIFICATION-BACKLOG.md`](PHASE0-OFFICIAL-VERIFICATION-BACKLOG.md)。最重要組別：

1. `BANK_SECOND_CARD_RULE` 精確乘數（Citibank 0、HSBC 0.25、Amex 0.65）仍明標市場整理／待官方。
2. 每張卡新客／舊客／冷河期／同銀行、年費、門檻、期限、排除交易、上限、轉分率。
3. Citi PremierMiles 續期年費旁註待官方；HSBC EveryMile HK$2/里上限；DBS 海外 HK$2/里門檻；HSBC Visa Signature incomplete model。
4. 全香港個人里數卡完整清單；官方卡層同渠道 bonus 分層；到期優惠更新。
5. Asia Miles／Avios 兌換、現金稅費、12 個月平均現金票價來源／方法。
6. RTW 24 小時界線、返回出發國家、同城機場／affiliate／指定班次規則。
7. iPhone 17 Pro Max 2TB、買車、結婚三個 Hero 數字；所有「95%」必須由 Engine 算。
8. Google cloud provider、Referral 法律／商業安排、SEO 最終 title。

另外有 7 個非官方而會影響結果嘅 heuristic：最多 6 張、每月 2 張、12 個月 prep、applyWeeks、1.10 直接計劃偏好、HK$3,000 高年費閘、cap span。已獨立列作 Founder／模型假設，唔冒充官方規則。

## 8. Draft PR link

<https://github.com/lobakpei/Miles-/pull/8>（Draft PR #8）

## 9. Merge／deploy／正式網站確認

- **冇 merge。**
- **冇 deploy。**
- **冇 force-push。**
- **冇修改 `main`。**
- **冇修改正式網站產品檔。**
- `acremiles.app` 正式網站仍由 v6.79.0 `main` 提供；Phase 0 Draft PR 不會觸發正式部署。
- Phase 0 完成後停止，等 Founder 明確回覆：`Phase 0 approved`。

## 備份資料

| 項目 | 值 |
|---|---|
| Baseline | `fb63103778831688b89bf5e4b08dbe1882c2f354` |
| Backup branch | `backup/pre-phase0-canonical-sync-20260722`（本地及 GitHub，指向 baseline） |
| Annotated tag | `pre-phase0-canonical-sync-20260722`；tag object `c819e0e19e8afd3021896b5130c56e7014f917c2` |
| ZIP | `AcreMiles_pre_phase0_canonical_sync_20260722.zip` |
| ZIP size | 17,484,872 bytes |
| ZIP SHA-256 | `34c23249b03f5aa9bbb676aa501f8f0a9fa1d499c2dbb597ec5d956010967f8a` |
| Baseline tree | `06b889151e6179b84a7bafc4ffc730e27721a82f` |

遠端 backup branch 已存在。環境冇可用 git credentials／tag mutation connector，所以 annotated tag 冇發佈到 GitHub Tags 頁；tag object、指向 baseline 嘅 ref 同完整歷史已固定保存喺 ZIP 內 `BACKUP-METADATA/repository.bundle`，並由 ZIP SHA-256 保護。呢個限制已如實披露，冇假稱 remote tag 成功。

## Rollback

Phase 0 未 merge／deploy，所以最安全 rollback 係直接關閉 Draft PR；正式網站毋須回滾。要獨立還原 baseline：

1. 解壓 `AcreMiles_pre_phase0_canonical_sync_20260722.zip`。
2. 按 `BACKUP-METADATA/RESTORE.md` 驗證 ZIP checksum 同 Git bundle。
3. 從 `BACKUP-METADATA/repository.bundle` clone，checkout `backup/pre-phase0-canonical-sync-20260722` 或 immutable tag。
4. 核對 HEAD 為 `fb63103778831688b89bf5e4b08dbe1882c2f354`，再跑 verifier／HTTP smoke。
