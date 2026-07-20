# Code Review Checklist

## 數據與聲稱

- [ ] 每項時效資料有核實日期、到期日及來源層級。
- [ ] 未核實資料只作參考，唔會進入推薦或「已核實」聲稱。
- [ ] 「最佳／保證／全市場」等絕對字眼有證據，否則改為推薦／估算。
- [ ] 金額、里數、上限、年費及優惠期在卡庫、文章、FAQ、搜尋索引一致。

## 計算

- [ ] 簽賬金額守恆；零值、舊 ID、剔卡、家庭模式、上限溢出測試全過。
- [ ] 未核實卡、pending 卡及過期迎新不會出現在結果。
- [ ] 顯示指標名稱與公式一致。
- [ ] heuristic 有明確披露，快照差異已人工解釋。

## RTW

- [ ] 票規檢查與直航核實分開。
- [ ] 每段 carrier+route 在白名單先顯示「已核實」。
- [ ] `no direct` 與 `unverified` 有不同提示。
- [ ] demo、文章 route line、逐站內容及距離數字一致。
- [ ] 有獎勵位與否不作保證。

## 私隱與安全

- [ ] 未同意前不載入 GA、Sentry 或其他非必要第三方。
- [ ] 訂閱只在主動提交後傳 email。
- [ ] Sentry payload 不含 email、表單內容、query、headers、cookies、user。
- [ ] reset 覆蓋所有程式使用中嘅 `bm_*` key。
- [ ] 政策列出實際供應商、目的、選擇及聯絡方法。

## UI、無障礙與交付

- [ ] 頁面可縮放，有 h1，input 有 accessible name，無 duplicate attribute。
- [ ] 鍵盤、focus、dialog、200% zoom、窄屏及桌面視覺 QA。
- [ ] app/build/settings/sw 版本一致。
- [ ] `node scripts/verify.js index.html` 全綠。
- [ ] 完整 repo 資產存在，service worker 路徑全數可取得。
