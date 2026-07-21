# AcreMiles v6.79.0-draft QA Report

日期：2026-07-21（執行時香港日期 helper 為 2026-07-22）  
分支：`feature/outcome-first-v1`  
Baseline：`1c7228bcd1e0aa2b194c9c62e1fba61de6e0e049`  
狀態：Draft review only；未 merge、未 deploy

## 1. 完成範圍

- Outcome First 首頁、三個可追溯示範、個人金額入口、回訪用戶真資料區。
- 計算器 Step 1 金額入口、其餘條件 reveal、進階設定及 outcome-first 結果次序。
- 計劃同行程 compact cards、`⋯` bottom sheet、開啟／分享／改名／置頂／確認刪除。
- `pgO2` 多 tier 首屏、三層 accordion，同時完整保留原有文章及條款。
- Beginner／Advanced planner gateway；Beginner 只 matching 現有 Zone 6／8／10／11／13 templates。
- 版本、service worker、verifier、browser QA 腳本及主交接文件同步。

## 2. 自動測試結果

| Gate | 結果 |
|---|---|
| `node scripts/verify.js index.html` | PASS；全部 invariant、版本同步、HTML、資產、計算、RTW、privacy、share、saved-card checks 通過 |
| `node scripts/test-consent-gate.js` | PASS |
| `node scripts/audit-freshness.js` | PASS；0 errors、7 warnings |
| HTTP smoke | PASS；109／109 paths OK |
| `node --check` | PASS：`scripts/browser-qa.js`、`scripts/verify.js`、`sw.js` |
| `git diff --check` | PASS |

Optimizer snapshot 未改：單人 168,888／6 月／30 萬為 146,836 里；家庭 300,000／6 月／30 萬＋13 萬為 238,850 里。Zone 10 仍為 19,960 哩、5 停留／2 轉機／2 開口。

## 3. Browser／Mobile QA 狀態

`scripts/browser-qa.js` 已更新為候選版流程，涵蓋：

- 360、390、430、768、1440 px 首頁、橫向 overflow、首頁 tab。
- Showcase → HK$8,000 prefill → calculator reveal。
- Beginner gateway、目的地／活動 matching。
- `pgO2` tiers、accordion、分享及過期狀態。
- Zone 10、privacy、terms、card share、shared itinerary 舊回歸。

本輪預覽工具基於安全政策拒絕開啟未發布嘅本地網站；按用戶指示又不可 deploy，因此冇繞過限制，亦冇產生或冒充新截圖。以下仍待 reviewer 喺可安全開 feature preview 嘅環境執行：

- 360／390／430、Samsung S24 Ultra、Android Chrome。
- 明／暗模式、PWA mode、鍵盤遮擋、bottom nav、sheet close、200% zoom。
- 實際截圖同 axe 結果。

## 4. 自行作出嘅假設

1. 第一主卡使用 Safety Hardened 文件明確容許嘅 fallback：HK$8,000 iPhone → 約 20,000 里 → 台北經濟來回 14,000 里；冇使用未核實 iPhone 17 價格。
2. 「一個地方」直接進入現有單程／來回工具；「幾個地方」進入 Beginner template gateway。
3. Beginner result 以普通城市名、商務所需里數及限制呈現；matching 只按目的地及活動加權，唔聲稱 AI 或最佳路線。
4. 舊 saved item 沒有 `pinned` 時當作未置頂；只新增 optional 欄位，唔做 destructive migration。
5. v6.79.0-draft 係產品方向稿；正式 v6.78.0 資料庫、計算公式、RTW 規則及分享 URL 不作無關重寫。

## 5. 待核實／時效數據

以下係現有 repo 資料，不是本 Draft 新研究結果；正式發布前必須按最新公開條款重核：

| 項目 | 候選版顯示 | 狀態 |
|---|---|---|
| iPhone fallback | HK$8,000 → 約 20,000 里；台北經濟來回 14,000 里 | repo 既有示範，資料日 2026-07-09；正式發布前重核卡迎新及換票表 |
| EveryMile | HK$8,000 → 49,000 里；HK$25,000 → 58,500 里 | 第 3 級具名平台資料；2026-07-31 到期，優惠碼、手機支付、分期條件要重核 |
| Explorer | HK$30,000 → 26,000 里；日本經濟來回 26,000 里 | 第 3 級平台資料；2026-07-31 到期，正式發布前重核 |
| 渣打國泰渠道 | 現行兩個平台優惠 | 2026-07-23 到期，freshness 只餘 1 日 |
| AE 白金官方迎新 | 現行官方迎新 | 2026-07-29 到期 |
| 機票結果 | 只顯示里數表示範 | 獎勵位、稅費、附加費、指定日期班次一律未保證 |

Freshness 全部 7 個提醒：渣打國泰 2 個（07-23）、EveryMile 2 個（07-31）、Explorer 2 個（07-31）、AE 白金官方迎新 1 個（07-29）。

## 6. 已知問題／限制

- 今輪冇真瀏覽器截圖及裝置 QA；唔可以將 source／Node gates 當視覺驗證。
- 首頁示範會按香港日期自動隱藏已過期 item；如 2026-07-31 後仍未補新資料，首頁可能只剩 iPhone fallback，係刻意 fail-safe。
- Beginner planner 只配對五條現有 template，唔生成自由路線；冇 match 時顯示最接近方案。
- 冇後端、登入、雲端同步或動態每結果 OG 圖；呢啲全部不屬 v6.79.0-draft。

## 7. Rollback

最安全做法係唔合併 Draft PR；`main` 會繼續保持 v6.78.0。需要獨立還原時：

```bash
git switch -c restore/pre-outcome-first-v1 backup/pre-outcome-first-v1-20260721
```

或由 immutable tag 建立新分支：

```bash
git switch -c restore/pre-outcome-first-v1-tag pre-outcome-first-v1-20260721
```

離線還原：將 `AcreMiles_pre_outcome_first_v1_20260721.zip` 解壓到新資料夾；ZIP SHA-256 為 `1cd0b37fad259433cd8027041925d5cf1b2117f68910270276e89d76b3862477`。唔好對 `main` 做 destructive reset，亦唔好移動或重打 backup tag。
