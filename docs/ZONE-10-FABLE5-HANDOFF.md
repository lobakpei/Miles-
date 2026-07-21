# AcreMiles Zone 10｜Fable 5 研究結案

狀態：**已完成並由 v6.78.0 正式採用**
核實日期：2026-07-21

## 最終方案

`HKG→MAD→CDG ⤳ LHR→JFK→BOS→PIT→ORD→SEA ⤳ YVR→NRT→TPE→HKG`

- 獎勵航班總距離：**19,960 哩**；距 20,000 哩上限 40 哩。
- 區 10：經濟 115,000／商務 230,000／頭等 330,000 里。
- 停留 5/5：MAD、JFK、BOS、NRT、TPE。
- 轉機 2/2：PIT、ORD；兩站都要控制喺 24 小時內。
- 開口 2/2：CDG⤳LHR、SEA⤳YVR；中間自費交通不計獎勵距離。
- 航司：CX、IB、BA、AA、JL，共 5 間；有 CX 並超過最少 3 間 oneworld 航司要求。

逐段機器可讀資料見 [`ZONE-10-ROUTE.csv`](ZONE-10-ROUTE.csv)，完整來源同 QA 見 [`QA-REPORT-v6.78.0.md`](QA-REPORT-v6.78.0.md)。

## 研究結論

Fable 5 最後提出嘅 19,918 哩修正版只有 1 個轉機，未達 2/2；再加入一個短途轉機會超過區 10。AcreMiles 因此重新排列美國段，以 PIT 同 ORD 作兩個轉機，同時保留巴黎／倫敦及西雅圖／溫哥華兩個有旅遊價值嘅開口，得到 19,960 哩正式線。

`NRT→KIX` 已排除：現行實際營運者唔係 JAL。網站不可因為見到 JL codeshare 就將聯盟外實際營運航班標成已核實。美國短途則屬另一情況：oneworld 官方將 American Eagle 列作 American Airlines regional partners，Cathay 亦明列 AA marketed／American Eagle affiliate flights；指定班次及 Asia Miles 兌換資格仍要出票前確認。

## 開口交通

1. `CDG⤳LHR`：歐洲之星（巴黎市區至倫敦）或自費直航；預留入境、轉站及行李時間。
2. `SEA⤳YVR`：Amtrak Cascades 或跨境巴士；班次、邊境手續及接駁緩衝按實際日期安排。

## 三層結論

1. **基本票規**：程式重算通過，19,960 哩、5／2／2、5 間航司，無 evaluator error。
2. **現行直航**：10 段已按指定 IATA＋航司加入 `OW_VERIFIED`；AA regional affiliate 由 oneworld／Cathay 官方資料支持。
3. **指定日期／獎勵位**：未保證；仍要逐段查班次、營運者、商務獎勵位、接駁時間、YQ、稅項及最終客服出票。
