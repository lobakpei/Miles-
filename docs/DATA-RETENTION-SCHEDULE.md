# AcreMiles 資料保存時間表

最後更新：2026-07-20
資料控制者：Mrs HAU YING OU-YANG（以 AcreMiles 名義營運）
ICO Reference：ZC174150

> 本文件是 AcreMiles 的內部資料管理基準，不是法律意見。保存期應按實際帳戶設定、合約、處理目的及適用法律定期覆核。

## 點樣閱讀本表

- **AcreMiles 政策**：AcreMiles 自己決定及執行的保存／刪除規則。
- **供應商上限或例外**：Google、Sentry、MailerLite 等服務按其產品設定、備份、保安、帳務或法律責任可能保留資料的時間；這不等於 AcreMiles 應主動保存資料到該上限。
- **一個曆月**與 **30 日**不是同一件事。本文件的個人資料權利回覆期限是「一個曆月」。

## 保存時間表

| 資料／系統 | AcreMiles 政策 | 供應商上限／例外 | 狀態及執行動作 |
|---|---|---|---|
| 瀏覽器 `localStorage`（設定、同意選項、計算器／規劃器本機資料） | 只儲存在使用者裝置，保存至使用者清除網站資料、重設功能或瀏覽器自行移除為止；AcreMiles 不把這些本機內容當成伺服器帳戶資料。 | 瀏覽器、私隱模式、裝置政策或使用者設定可更早移除。 | 已採用；重設／清除功能及私隱說明須保持可見。 |
| Google Analytics 4 使用者層級及事件層級資料 | **事件資料 2 個月；使用者資料 14 個月；有新使用者活動時重設保存期。** | 這些設定不等同所有彙總報表都會按相同期限定期刪除；Google 亦可能按其合約／法律責任處理服務及帳戶資料。 | 2026-07-20 提供的 GA4 管理頁截圖顯示上述設定。每季覆核及保存新截圖；如管理頁仍顯示未儲存的變更，必須先按「儲存」。 |
| Sentry 錯誤事件（目前 Developer plan） | 只在使用者同意後載入；避免傳送姓名、電郵、Cookie、完整網址查詢字串、表單內容及其他不必要個人資料。按目前方案使用 **30 日**事件查看期。 | Sentry 現行 Developer plan 公布 30 日 lookback；帳戶、用量、保安、備份或依法保留的資料可能受其他條款約束。方案或條款改變時，實際期限亦可能改變。 | 每季及轉 plan 時核對定價頁、專案區域、scrubbing 與 `sendDefaultPii` 等設定，保存截圖。 |
| MailerLite 有效訂閱者資料 | 保存至訂閱者退訂、有效刪除要求完成，或 AcreMiles 不再需要寄送通訊為止。收到退訂後立即停止推廣電郵。只保留履行退訂所必需的最少 suppression／拒收紀錄，避免再次誤加。 | MailerLite 作為處理者，刪除、備份及合約終止程序受其 DPA／私隱政策約束；備份、保安、爭議、帳務或法律所需資料未必在退訂一刻同步消失。其一般帳戶政策亦提及長期不活躍／終止後及法定帳務紀錄的不同期限，這些不應誤寫成所有訂閱者資料的單一保存日數。 | 每次退訂及刪除要求要留處理日期；每年核對 MailerLite DPA、私隱政策、帳戶設定及實際 suppression 做法。 |
| 一般支援查詢電郵 | 只保留到完成查詢及合理跟進所需；如沒有投訴、爭議、保安或法律需要，建議在個案完成後 **12 個月**刪除或匿名化。 | 電郵供應商備份、垃圾郵件／保安記錄及依法保存可能有不同期限。 | 這是建議內部期限；採用前確認實際郵箱能否執行及記錄批次清理。 |
| 個人資料權利要求及處理紀錄 | 原則上在收到有效要求後 **一個曆月內回覆**；只收集核實身分及處理要求所需資料。建議個案完成後保留最少處理紀錄 **24 個月**，再刪除或匿名化，除非有持續投訴／法律需要。 | 複雜或多項要求在符合法律條件及及時通知下，回覆期可能延長；供應商備份／法律保留亦可能較長。 | 一個曆月回覆標準已採用；24 個月是建議保存期，正式採用後記入處理紀錄及刪除日。 |
| 同意／拒絕紀錄 | 只保存證明同意選擇、撤回及系統尊重選擇所需的最少資料；本機選項跟隨 `localStorage`，如日後設伺服器紀錄須另訂期限。 | 平台保安日誌或備份可能另有期限。 | 目前以本機為主；加入帳戶或伺服器後必須重新做資料盤點。 |

## 執行優先次序

1. 每季登入 GA4 管理頁，重核事件資料 **2 個月**、使用者資料 **14 個月**及「有新使用者活動時重設」，保存設定截圖、property 名稱及確認日期。
2. 登入 Sentry，確認仍是 Developer plan、30 日 lookback、資料區域及私隱／scrubbing 設定，保存截圖。
3. 在 MailerLite 測試一次退訂及一次刪除要求流程，確認 suppression 紀錄的欄位、權限及實際刪除步驟。
4. 建立簡單處理紀錄：收到日期、身分核實日期、處理內容、回覆日期、預定刪除日期；不要在紀錄複製不必要的個人資料。
5. 每年至少覆核一次本表；更換方案、加入登入／雲端儲存、廣告追蹤或新供應商時要即時覆核。

## 個人資料要求回覆基準

- 回覆目標：收到有效要求後 **一個曆月內**。
- 如需要核實身分，只要求與風險相稱的資料；期限按適用規則由取得所需資料的時間計算。
- 可以合法延長時，要在原本一個曆月內通知申請人原因及新限期。
- 刪除要求不代表所有資料即時從每一個備份消失；回覆要說明已刪除、被隔離等待輪替，或基於哪項必要例外保留。

## 主要官方來源

- ICO：Storage limitation
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/
- ICO：Records management — Retention
  https://ico.org.uk/for-organisations/advice-and-services/audits/data-protection-audit-framework/toolkits/records-management/retention/
- ICO：Right of access — time limit and calculation
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/right-of-access/what-should-we-consider-when-responding-to-a-request/
- Google Analytics：Data retention
  https://support.google.com/analytics/answer/7667196
- Sentry：Plans and retention／lookback
  https://sentry.io/pricing/
- MailerLite：Privacy policy
  https://www.mailerlite.com/legal/privacy-policy
- MailerLite：Data Processing Agreement
  https://www.mailerlite.com/legal/data-processing-agreement
