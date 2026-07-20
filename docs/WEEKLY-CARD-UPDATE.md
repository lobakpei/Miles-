# 每週信用卡優惠更新流程

目的：每星期固定核實一次，避免過期迎新、平台加碼或者舊條款繼續當成現行資料。所有日期用香港時間（`Asia/Hong_Kong`）。

## 最省事安排

- 建議固定每週一香港早上處理；GitHub 只讀排程會先提示即將到期或過期項目。
- 你每星期只要同 Codex 講：`做本週 AcreMiles 信用卡更新，先畀我睇差異表，唔好直接發布。`
- Codex 會先研究同列出差異；你確認後先改網站、產生卡頁、測試，再開草稿 PR。唔會自動合併或發布。

## 來源次序

每張卡都先查銀行官方資料，第三方平台只用嚟核對額外申請獎賞，唔可以用第三方文章取代銀行條款。

1. 銀行官方產品頁。
2. 最新迎新條款（T&C）及推廣期。
3. KFS／收費表、獎賞及里數兌換條款。
4. 五個比較平台：MoneyHero、小斯 flyformiles、里先生、HongKongCard、PickCardRebate。

平台寫「高達」時要拆清楚銀行迎新、平台加碼、優惠碼、開戶條件同抽獎；唔可以全部當成人人一定攞到。

## 每週步驟

1. 執行本地檢查：

   ```bash
   node scripts/audit-freshness.js
   ```

2. 逐張開 `docs/CARD-SOURCE-AUDIT.md` 所列官方連結，先核對：申請期、簽賬期、門檻、里數、年費、新客定義、登記要求、簽賬上限及排除交易。
3. 再查五個比較平台，確認額外獎賞、優惠碼、申請流程、截止日期及平台追蹤條件。
4. 未改檔前先交以下差異表畀你確認：

   | 卡／優惠 | 現有資料 | 新資料 | 生效／到期日 | 官方來源 | 平台來源 | 建議處理 |
   |---|---|---|---|---|---|---|
   | 例：某卡迎新 | 20,000 里 | 25,000 里 | 2026-08-31 | 官方 T&C | MoneyHero | 更新並保留舊紀錄 |

5. 只有確認過嘅內容先改。未搵到新官方條款時，標示「未核實」或暫停進入推薦，唔估數。
6. 過期內容保留做歷史紀錄，但要自動下架或清楚變灰、標示「已完結」；唔好刪走舊資料冒充從未出現。
7. 改完重新產生靜態頁及測試：

   ```bash
   node scripts/generate-card-pages.js
   node scripts/generate-share-pages.js
   node scripts/audit-freshness.js
   node scripts/verify.js index.html
   node scripts/test-consent-gate.js
   ```

8. 最後再交「改咗乜、來源、測試結果、仍待核實項目」；你批准先合併發布。

## 日期同資料規則

- `CHANNEL_OFFERS` 內任何 `active: true` 優惠，必須同時有 `verified: true`、實際 `expiry: 'YYYY-MM-DD'` 同可開啟來源連結。
- 限時官方迎新用 `welcome.deadline`；到期又未有新官方條款時，用 `welcome.expired: true`，不可繼續計入推薦。
- 每次重新開官方文件核實後，先更新該卡 `sourceVerifiedAt`；唔可以只改日期而冇真正核對。
- `scripts/audit-freshness.js` 預設提前 14 日提醒優惠到期，卡資料超過 35 日未核實亦會提醒。
- 自動檢查只會指出日期風險，唔識判斷銀行 PDF 入面嘅條款有冇改；人工逐份核對仍然係必要步驟。

## GitHub 每週提示

`.github/workflows/weekly-card-audit.yml` 會逢星期一香港時間 08:00 做一次只讀檢查，亦可以手動執行。佢唔會改檔、commit、push 或發布。

排程用 `--strict`：只要有 14 日內到期或 35 日未核實提醒，都會顯示為需要處理嘅失敗紀錄，目的係唔畀通知靜靜漏走；核實並更新資料後重跑就會恢復正常。
