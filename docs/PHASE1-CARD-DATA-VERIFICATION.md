# Phase 1 Card Data Verification

核對日期：2026-07-23（Asia/Hong_Kong）

正式 baseline：`ba8f6db0b087275f63785468ccec424a9d5ad1e2`（v6.79.0）

Feature branch：`agent/acremiles-phase1-card-data-20260722`

## 安全基準

- Backup branch：`backup/pre-phase1-card-data-20260722`，指向 baseline。
- 完整 ZIP：`AcreMiles_pre_phase1_card_data_20260722.zip`。
- ZIP SHA-256：`6c6ca6950b560842bfe19de10b25a6ef8cc17cb604c593685be86e6e279f3ec4`。
- 禁止 merge、deploy、force-push、Phase 2、UI 重設或 Engine 公式改動。

## 表一：Data Migration

| 資料 | 搬遷前位置 | 搬遷後位置 | 數值有冇改變 | Regression |
|---|---|---|---|---|
| 9 張銀行卡主要資料／長版條款 | `index.html`／`bm-core` 嘅 `DEFAULT_CARDS`＋`CARD_PUBLIC_DETAILS` | `data/cards-official.js` | 冇；v6.79.0 fixture 9／9 逐欄一致 | PASS |
| 銀行官方 URL／核實日／文件 | 每張 `DEFAULT_CARDS` record | `data/source-registry.js` | 舊 hydrated 介面不變；registry 新增來源／文件類型 | PASS |
| 渠道／平台優惠 | `index.html`／`bm-core` 嘅 `CHANNEL_OFFERS` | `data/card-channels.js` | 冇；平台、bonus、expiry、active、verified、link 全量一致 | PASS |
| 五段舊渠道展示文案 | 混入四張卡 `note` 及一張卡 `welcome.note` | `card-channels.js` 嘅兼容 presentation layer | 最終 UI 字串不變；銀行 raw records 不再混入第三方聲稱 | PASS |
| 卡頁 slug／image／status | generator hardcoded ID/file maps | 每張 `cards-official.js` record | 生成目標及狀態不變 | PASS；`cards/**` 零 drift |
| 卡頁 generator | regex／VM 抽取巨大 HTML | 直接 require `data/cards-official.js` | 9 張卡頁＋index 逐 byte 不變 | PASS |
| Freshness audit | regex／VM 抽取巨大 HTML | 直接 require cards／channels sources | Stage A 訊息及日期結果不變 | PASS；0 errors／7 reminders |
| Verifier／Regression Lock | 只驗 HTML 內卡庫 | 直接 load／validate 三層來源＋v6.79.0 migration fixture | optimizer 22／22 不變 | PASS |

## Stage A 快照解釋

只重錄可由搬遷解釋嘅結構快照：

- `product-surface`：加入三個 `data/**` 檔案；`index.html` loader 同 `sw.js` asset list hash 改變。
- `dom`：三個外部 script tags 導致 raw／structural hash 同後續行號改變；DOM IDs 仍 209、critical elements／bottom nav 完全一致。
- `generated-files`：只改 generator stdout，由「from bm-core」變成「from data/cards-official.js」；`cards/**`＋`share/**` before／after tree hash 不變。
- `optimizer-v6.79.0.json` 同 `localstorage-v6.79.0.json` 完全冇 diff。

## Stage A 驗收

| Gate | 結果 |
|---|---|
| Card migration fixture | PASS，9／9；渠道全量一致 |
| Optimizer fixtures | PASS，22／22 零 drift |
| Regression Lock | PASS，data／optimizer／product／generated／storage／DOM |
| `verify.js` | PASS，全部 invariant |
| Consent runtime | PASS |
| Freshness（2026-07-23 HK） | PASS，0 errors／7 reminders |
| Card／share generators | PASS；generated product files 零 diff |
| HTTP smoke | PASS，112／112 |
| Protected product output | `cards/**`、`share/**`、`img/**`、`manifest.json` 零 diff；UI／流程／推薦結果零 drift |

Stage B 必須喺 Stage A 獨立 commit 及上述 gates 通過後先開始；官方／渠道更新會另表列出。
