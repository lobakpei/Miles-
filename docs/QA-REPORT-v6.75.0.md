# AcreMiles v6.75.0 QA 報告

日期：2026-07-20

## 已完成

- `node scripts/verify.js index.html`：全部 release gate 通過。
- `git diff --check`：通過。
- 本地 HTTP smoke：107／107 路徑成功，包括首頁、9 張信用卡頁、23 個分享／歷史分享頁及全部引用圖片。
- 區 10 由引擎重新計算：19,496 哩、區 10、商務 230,000 里、2 停留、2 轉機、1 開口，0 個票規錯誤。
- 區 10 六段獎勵航班全部對中精確機場碼及航司，狀態為已核實。
- 過期文章測試已加入 browser QA：首屏灰化提示、正文保留、分享仍可用。
- 區 10 browser QA 已加入：新資訊封面可見，DIY 會載入 HKG、DOH、LHR、JFK、ORD、HND 六段起點。

## 環境限制

今次執行環境冇現成 Chromium binary，而安全政策拒絕以非沙箱方式下載。因此 v6.75.0 新增嘅互動 browser checks 未有喺本地真 Chromium 重跑，唔會扮成已完成。

v6.74.1 既有首頁／規劃器／文章／私隱／卡詳情／分享行程基準曾以真 Chromium 跑完 32／32，同 5 個 axe 畫面 0 violation；詳情保留喺 `QA-REPORT.md`。v6.75.0 發佈後要再以公開網站核對新區 10、過期灰化及分享預覽。
