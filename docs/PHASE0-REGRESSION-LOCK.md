# AcreMiles Phase 0 Regression Lock

日期：2026-07-22
基準：正式 v6.79.0，GitHub `main` commit `fb63103778831688b89bf5e4b08dbe1882c2f354`

## 目的

呢套 lock 只記錄 Phase 0 開始前嘅現行輸入、輸出、DOM、儲存 schema 同正式產品檔案。佢用嚟偵測後續 drift，**唔代表現有公式、卡數據、里數或文案已重新獲官方核實，亦唔把現行 heuristic 升格為正確答案。**

Phase 0 冇修改 `index.html`、`sw.js`、`manifest.json`、`cards/**`、`share/**`、`img/**`，亦冇重錄任何產品數字。

## 執行

```bash
node scripts/regression-lock.js
```

正常結果會逐項顯示：

```text
PASS optimizer
PASS product
PASS generated
PASS dom
PASS storage
```

只有 Founder 已批准刻意改變基準時，先可以喺該次變更 PR 用以下命令重建，並必須 review 每個 snapshot diff：

```bash
node scripts/regression-lock.js --write
```

禁止為咗令 test 轉綠而無解釋重錄 snapshot。

## Optimizer fixtures

檔案：`tests/fixtures/optimizer-v6.79.0.json`

共 22 個固定情境：

- 一人：HK$5,000、8,000、16,999、30,000、100,000、300,000、1,000,000。
- 二人家庭：同一組 7 個金額。
- 已有卡：HK$30,000＋已有 `citi-pm`。
- 排除卡：HK$30,000＋排除 `citi-pm`。
- 年費 off／on：HK$300,000，分別禁止／容許高年費卡。
- 一炮過消費：HK$100,000。
- `tiered`：只用 `sc-cathay`，HK$110,000。
- `threshold`：只用 `citi-pm`，HK$8,000。
- `feePurchase`：`citi-prestige`＋`citi-pm`，HK$8,000；固定 Prestige 管家提示唔會被當簽賬迎新加入總數。

每個輸出固定總里數、迎新里數、首年／續期年費、迎新達成率、警告、管家提示、金額守恆，同逐張卡嘅簽賬、迎新、基本里數、申請月、第二卡折扣及階梯狀態。

## Snapshots

| 檔案 | 鎖定內容 |
|---|---|
| `tests/snapshots/product-surface-v6.79.0.json` | `index.html`、`sw.js`、`manifest.json`、`cards/**`、`share/**`、`img/**` 每檔 bytes／SHA-256 |
| `tests/snapshots/generated-files-v6.79.0.json` | `cards/**`＋`share/**` 生成前後每檔 hash，同 generator stdout |
| `tests/snapshots/dom-v6.79.0.json` | `index.html` hash、移除 script／style 內容後嘅 DOM hash、209 個有 ID 元素、重要入口、bottom nav 順序 |
| `tests/snapshots/localstorage-v6.79.0.json` | 16 個 `bm_*` key、reset key、引用次數同現行 schema |

現行正式產品 tree hashes：

| Surface | 檔案數 | Tree SHA-256 |
|---|---:|---|
| `index.html` | 1 | `aabde6e9b4c8dea4fcbd5209168e689d3d40c8019b228396e1a4b7d97833fe91` |
| `sw.js` | 1 | `a6903a7496cace120ee6a7204305d00bc4140ee68c652b08083fced09d97b8f3` |
| `manifest.json` | 1 | `ed65ff54e9aa43948a43a1ba99b51e3ce8b390c41cb2de3b64f988dfa9f1c4d5` |
| `cards/**` | 10 | `71721d3918afc5f2305a894a3256504a342f81355fc4db89c98fb28f306c553e` |
| `share/**` | 23 | `cc891925c29edb2e4ec4903edf6d46b5e0c9837a691ef135fb44827a64fe03d9` |
| `img/**` | 36 | `843893948de4987b946a1be392cfebb4c7be8c12d9f9f514d09a5e32e039b152` |

Generator 會喺獨立 temp copy 執行，唔會覆寫工作樹。基準生成前後同為 33 檔，tree SHA-256 同為 `86a30ce2f23c0090dc371b75238dcc9e81fb3b6256d98d3349341cba7830c290`，drift 為 0。

## 現行 DOM／storage 基準嘅重要含義

- Bottom nav 仍係 `計算 → 規劃 → 首頁 → 優惠 → 攻略`；最新產品決定要求嘅 `點賺 → 點用 → 首頁 → 優惠 → 攻略` 尚未實作。Phase 0 將差距鎖定，唔係批准舊 IA。
- 現行 16 個 storage keys：`bm_card_overrides`、`bm_consent`、`bm_daily`、`bm_esub`、`bm_favs`、`bm_input`、`bm_ok`、`bm_ow`、`bm_rsub`、`bm_sa`、`bm_saved_plans`、`bm_saved_redeem`、`bm_sub`、`bm_theme`、`bm_welcome_ts`、`bm_zoom`。
- 後續 Phase 如改 DOM 或 schema，必須先解釋 migration／相容策略，再由 Founder 核准新 snapshot。

## 已知限制

- Snapshot 係 exact regression evidence，唔係 browser screenshot 或視覺像素測試。
- Fixture 用 v6.79.0 內建資料，資料有效期同官方核實 backlog 要另行處理。
- `BM.optimize` 仍係 heuristic；fixture 只保證同基準一致，唔證明全域最佳。
