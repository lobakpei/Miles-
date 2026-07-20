# AcreMiles

AcreMiles 係一個以行程目標帶動里數規劃嘅香港信用卡及飛行里數工具：先揀想去邊，再反推需要幾多里數同適合嘅儲里方案。

## 本地預覽

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

開啟 `http://127.0.0.1:4173/`。PWA 及離線功能需要經 HTTP／HTTPS 測試，唔建議直接雙擊 `index.html`。

## 發佈前檢查

```bash
node scripts/verify.js index.html
node scripts/test-consent-gate.js
node scripts/smoke-http.js http://127.0.0.1:4173/
```

信用卡或分享資料改動後，可重新產生靜態頁：

```bash
node scripts/generate-card-pages.js
node scripts/generate-share-pages.js
```

現行產品、資料核實、私隱及 QA 守則見 `AGENTS.md`。
