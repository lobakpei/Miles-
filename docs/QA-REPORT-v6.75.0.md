# AcreMiles v6.75.0 QA 報告

日期：2026-07-20

## 已完成

- `node scripts/verify.js index.html`：全部 release gate 通過。
- `git diff --check`：通過。
- 本地 HTTP smoke：107／107 路徑成功，包括首頁、9 張信用卡頁、23 個分享／歷史分享頁及全部引用圖片。
- 區 10 當時候選線曾通過引擎基本檢查；其後已由 v6.78.0 正式 19,960 哩／5／2／2 方案完整取代。
- 當時候選線嘅航段白名單只保留作其他功能需要，唔再係現行 Zone 10 Demo。
- 過期文章測試已加入 browser QA：首屏灰化提示、正文保留、分享仍可用。
- 區 10 browser QA 已由 v6.78.0 改為正式十段路線、現有封面及 CSV drift 檢查。

## 環境限制

今次執行環境冇現成 Chromium binary，而安全政策拒絕以非沙箱方式下載。因此 v6.75.0 新增嘅互動 browser checks 未有喺本地真 Chromium 重跑，唔會扮成已完成。

v6.74.1 既有首頁／規劃器／文章／私隱／卡詳情／分享行程基準曾以真 Chromium 跑完 32／32，同 5 個 axe 畫面 0 violation；詳情保留喺 `QA-REPORT.md`。v6.75.0 發佈後要再以公開網站核對新區 10、過期灰化及分享預覽。
