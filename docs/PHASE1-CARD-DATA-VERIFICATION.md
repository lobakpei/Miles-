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

Stage A published commit：`0127d89613a88fa8a50b8b7dda5173f3b889a206`（`Phase 1A — Extract card data sources with zero product drift`；tree SHA `7d2b3d1fa15fd08aacb4d9ff369c7af2a60fae2e`）。Stage B 只喺以上零 drift gates 全部通過後開始。

## 表二：Official／Channel Update

以下「Result」只指 optimizer；渠道固定賞、抽獎、現金／禮券同未安全建模 component 均不會偷偷換算成里數。`verifiedAt` 全部為 `2026-07-23`（香港日期）。

| 卡／優惠 | 舊資料 | 最新資料 | 生效／到期日 | 官方來源 | 渠道來源 | 對 Result／Hero／文章／卡頁影響 |
|---|---|---|---|---|---|---|
| 渣打國泰 base welcome | 10k／20k／40k，冇完整有效期 metadata | 數值不變；補 `2026-05-01→07-30`、最遲 10-31 發卡；官方總數包括 basic miles，標 `legacy-model-conflict` | 05-01／07-30；`active-expiring` | [迎新 T&C](https://av.sc.com/hk/content/docs/hk-cc-tncs-downloadnow.pdf)（`bank-official-welcome-terms`） | — | optimizer 保持 v6.79.0，22 fixtures 無 drift；文章／卡頁補期限及衝突披露 |
| 渣打 blind box | note 只寫 07-23 截 | 2,000–364,000 里為隨機抽獎，非保證獎賞，獨立記錄 | 06-25／07-23；`active-final-day` | [官方活動頁](https://www.sc.com/hk/credit-cards/cathay/luckydraw-r2/)（`bank-official-lucky-draw`） | — | `excluded-random`；文章移除把抽獎疊入固定「高達」結果嘅表述 |
| 渣打 Referral Club | 未獨立記錄 | 被推薦新客 10,000 里、現有客 5,000 里；互斥／疊加跟官方條款 | 07-02／2027-01-01；`active` | [官方 Referral T&C](https://av.sc.com/hk/content/docs/hk-cc-cxam-onebank-mgm-tnc.pdf)（`bank-official-channel`） | 同左 | `excluded-channel`；只供渠道比較，唔自動加進 Result |
| 渣打／小斯 | HK$500、07-23 截 | code `HKRSIUC11000`；HK$500 Apple Store／超市禮券；完整領獎 mechanics 標 partial | 07-15／07-31；`active-partial` | — | [小斯卡頁](https://flyformiles.hk/41446/%E6%B8%A3%E6%89%93%E5%9C%8B%E6%B3%B0%E8%90%AC%E4%BA%8B%E9%81%94%E5%8D%A1)（`channel-offer-page`） | 渠道顯示延至 07-31；optimizer 無影響 |
| 渣打／里先生 | 88 里賞金、舊文混入高達里數 | code `HKRMRM11000`；平台賞**最高** 88 MM Credit，拆成 38（只限里先生新會員）＋50（成功批卡並按要求填表）；11k／5k 只標 issuer claim，盲盒另列 random | 07-01／07-23；`active-final-day` | — | [里先生卡頁](https://www.mrmiles.hk/cathay-card/)（`channel-offer-page`） | 條件式平台上限、銀行 claim、抽獎完全拆開；optimizer 無影響 |
| 渣打／MoneySmart | 未收錄 | 新客免簽賬可揀 HK$900 Apple Store／百佳／HKTVmall 電子券，或平台標示價值 HK$3,980／2,100／1,970 嘅指定實物；parent 平台禮品到 07-31，但 nested issuer blind-box 只到 07-23；`validFrom` 未列清，標 partial | 平台 `validFrom: unknown`／07-31；blind-box 06-25／07-23；`active-partial` | [blind-box 官方頁](https://www.sc.com/hk/credit-cards/cathay/luckydraw-r2/)（`bank-official-lucky-draw`） | [MoneySmart 卡頁](https://www.moneysmart.hk/zh-hk/credit-cards/standard-chartered-cathay-mastercard-ms)（`channel-offer-page`） | 平台禮品 07-24 仍可顯示；nested 抽獎 badge 由 07-24 起標已完結，兩者均唔計 Result |
| 渣打／MoneyHero | 舊文章連結存在但未有可靠 record | 頁面有「高達」禮品，但精確平台期及領獎 T&C 未完整取得 | dates unknown；`unknown` | — | [MoneyHero 卡頁](https://www.moneyhero.com.hk/zh/credit-card/products/standard-chartered-cathay-mastercard)（`channel-offer-page`） | `active:false`，唔展示／唔計 Result |
| HSBC EveryMile base | `$8k→20k` 被當全年 base | 全年新客 base 為 `$25k→25k`；舊 `$8k→20k` 其實係 7 月 flash 額外 component | base 03-01／2027-02-28；`active` | [base T&C](https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf)（`bank-official-welcome-terms`） | — | Engine 暫只保留有清晰單一門檻嘅 20k flash，22 fixtures 無 drift；Hero `58,500→45,000`（base＋flash，未計分期／日常簽賬）；文章／卡頁重寫 |
| HSBC EveryMile July flash | 混在 card welcome，渠道文案曾錯寫每月門檻 | `$8k→額外20k`；60 日累積、至少一次**流動電話付款**、申請時入合資格碼；官方直申碼 `HSBCFLASH`。QR 條件只適用 Pulse／UnionPay，唔適用 EveryMile | 07-13／07-31；`active-expiring` | [官方 Flash T&C](https://www.redhotoffers.hsbc.com.hk/media/114083727/2026-July-Flash-Offer-TC-EN_final.pdf)（`bank-official-promotion-terms`） | 見下三行 | Engine 數值不變但語義改為 partial component；文章及卡頁補正 |
| HSBC EveryMile 現有客 base | 未獨立披露 | 官方 Red Hot campaign 頁列 HK$200 RC，但相連 base PDF 表格列 N/A；正面 claim 冇獨立有效期 | dates unknown；`conflict` | [官方 Red Hot campaign 頁](https://www.redhotoffers.hsbc.com.hk/en/latest-offers/cvp-offer/)（`bank-official-campaign-page`）＋[base T&C](https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf) | — | `excluded-conflict`；`validFrom`／`validUntil` 保持 `null`，冇自行套用全年日期或揀較吸引數字 |
| HSBC lucky draw | note 提及但未結構化 | 60 日簽 HK$500；大獎隨機，其他合資格參加者保證 HK$50 RC | 06-01／07-31；`active-expiring` | [官方活動頁](https://www.redhotoffers.hsbc.com.hk/en/latest-offers/cvp-offer/)（`bank-official-lucky-draw`） | — | 抽獎不入 Result；文章分開披露 |
| HSBC EveryMile 海外簽賬 | 未獨立記錄 | Reward+ 登記後分兩期；每期海外簽 HK$12,000，額外 1.5% RC，連基本低至 HK$2/里；每期額外 RC 上限 HK$225，全期 HK$450 | 07-01／12-31；`active` | [官方海外簽賬優惠頁](https://www.redhotoffers.hsbc.com.hk/en/latest-offers/everymile-spending-offer/)（`bank-official-spending-promotion`） | — | `excluded-conditional-rate`；Engine 保持基本 HK$5/里，唔把有登記／門檻／上限嘅限時率套入 Result |
| EveryMile／里先生 | headline 49k；錯寫每月要有簽賬 | code `MILEFLASH`；60 日累積 `$8k`＋至少一次流動電話付款；平台賞**最高** 88 MM Credit＝38 新會員＋50 成功批卡填表，49k 只係 issuer components headline | 07-13／07-31；`active-expiring` | — | [里先生卡頁](https://www.mrmiles.hk/hsbc-everymile/)（`channel-offer-page`） | 修條件；條件式平台賞唔入 Result |
| EveryMile／MoneyHero | headline 49k、code、07-31 | 49k／HK$2,450 可核；未見平台固定禮品；`HEROFLASH` 細節標 partial | 07-13／07-31；`active-partial` | — | [MoneyHero 文章](https://www.moneyhero.com.hk/zh/credit-card/blog/%E8%A7%A3%E6%A7%8B-%E6%BB%99%E8%B1%90everymile%E4%BF%A1%E7%94%A8%E5%8D%A1)（`channel-offer-page`） | 保留 active 但唔將 headline 當固定平台賞；optimizer 無影響 |
| EveryMile／MoneySmart | 未收錄 | code `MARTFLASH`；58.5k headline 包 base、flash、分期及簽賬回報，拆出可核 components 後仍有 9,500 里／HK$475 RC marketing residual，實際取決於簽賬類別，唔係固定 bonus | 07-13／07-31；`active-expiring` | — | [MoneySmart 卡頁](https://www.moneysmart.hk/zh-hk/credit-cards/hsbc-everymile-credit-card)（`channel-offer-page`） | 新增渠道比較；Hero 只用官方可同時成立嘅 45k，冇照抄 58.5k 或補估 residual |
| Citi PremierMiles | `$5k→20k`、09-30 | 數值／期限不變；補 12 個月新客冷河及每月合資格交易條件 | 07-01／09-30；`active` | [官方迎新 T&C](https://www.citibank.com.hk/english/credit-cards/welcome-offers/tnc/)（`bank-official-welcome-terms`） | — | Result 無 drift；卡頁核實日更新 |
| Citi Prestige | 交 `$3,800→30k里` | 新客 12 個月 lookback、1 個月內啟動實體卡；里數不變。另有首兩月 `$5k→HK$1,200` 現金 component，而且每月最少一宗合資格交易，未換算里數 | 07-01／09-30；`active` | [官方迎新 T&C](https://www.citibank.com.hk/english/credit-cards/welcome-offers/tnc/)（`bank-official-welcome-terms`） | — | Engine 只保留 30k miles component；現金 component `engineEligible:false`，Result 無 drift |
| DBS Black Q2／Q3 | Q2 至 07-06，整張 welcome 標 expired | Q2 保留 historical；Q3 07-07 接續。新客／現有客用 12 個月 lookback，同一申請多卡只首張按新客；新客可揀三級 8k／12k／30k 總里數或 HK$8k DAYCROWN 行李箱，另一次 Flexi Shopping 獨立 2k；現有客確認實體卡＋單一 HK$200 可領 HK$50。三級總數包括 basic DBS$ | Q2 04-29／07-06 `historical`；Q3 07-07／10-05 `active` | [Q2 T&C](https://www.dbs.com.hk/iwov-resources/pdf/creditcards/welcome-tnc-zh26Q2.pdf)／[Q3 T&C](https://www.dbs.com.hk/iwov-resources/pdf/creditcards/welcome-tnc-zh26Q3.pdf)（`bank-official-welcome-terms`） | — | 新 offer 保存但 `engineEligible:false`／`excluded-model-conflict`，避免 double-count；DAYCROWN／Flexi／HK$50 分 component；22 fixtures 零 drift |
| DBS／MoneyHero Card+ | 未收錄 | MoneyHero 只提供指定 Card+ 申請路徑；HK$50「一扣即享」係 DBS 發卡行現有客迎新（確認實體卡＋單一 HK$200），**唔係平台固定賞** | 07-07／10-05；`active` | [DBS Q3 T&C](https://www.dbs.com.hk/iwov-resources/pdf/creditcards/welcome-tnc-zh26Q3.pdf)（`bank-official-welcome-terms`） | [MoneyHero 卡頁](https://www.moneyhero.com.hk/zh/credit-card/products/dbs-black-world-mastercard)（`channel-offer-page`） | `fixedBonus:null`；只保存 `issuerOfferClaim` 同申請路徑，不換算里數、不入 Result |
| DBS Black 海外簽賬 | 未獨立記錄 | Card+ 登記翌日起計；每月總合資格零售簽 HK$20,000，海外外幣簽賬連基本低至 HK$2/里；額外 DBS$ 每月上限 240、全期 2,880 | 01-01／12-31；`active` | [官方海外優惠頁](https://www.dbs.com.hk/personal-zh/promotion/black-mc-cvp)（`bank-official-spending-promotion`） | — | `excluded-conditional-rate`；Engine 繼續用基本 HK$4/里 |
| AE Explorer 官方迎新 | `$8k→8k`、`$30k→26k`，舊渠道文案誤混 07-31 | 數值不變；官方申請期至 08-31；26k marketed total 要成功登記 Local Spend Bonus，而且 HK$30k 當中至少 HK$15k 係合資格本地港幣簽賬；總數包括簽賬獎賞，標 model conflict | 07-02／08-31；`active` | [官方迎新 T&C](https://www.americanexpress.com/content/dam/amex/hk/en/campaigns/explorer-credit-card/Explorer_BAUWelcomeOffer_TnC_EN.pdf)（`bank-official-welcome-terms`） | — | optimizer 沿用 v6.79.0，22 fixtures 無 drift；Hero／卡頁改用官方 08-31 並披露登記／本地簽賬條件 |
| AE Explorer／里先生 | HK$50＋88 混成「平台加碼」 | 平台賞**最高** 88 MM Credit＝38 新會員＋50 成功批卡填表；HK$50 手機八達通係 issuer claim | 07-02／07-31；`active-expiring` | — | [里先生卡頁](https://www.mrmiles.hk/ae-explorer/)（`channel-offer-page`） | 文章／卡頁拆來源及條件；Result 無影響 |
| AE Explorer／小斯 | HK$50 被寫成平台額外賞 | 26k＋HK$50 只作 issuer-linked claim；完整 HK$600／claim mechanics 標 partial | 07-02／07-31；`active-partial` | — | [小斯卡頁](https://flyformiles.hk/34769)（`channel-offer-page`） | 修正分類；Result 無影響 |
| AE Explorer／MoneySmart、MoneyHero | 有連結但未有可靠現行 record | 兩個渠道嘅精確有效期／claim T&C 未完整取得 | dates unknown；`unknown` | — | [MoneySmart](https://www.moneysmart.hk/zh-hk/credit-cards/american-express-explorer-credit-card)／[MoneyHero](https://www.moneyhero.com.hk/zh/credit-card/products/american-express-explorer-credit-card)（`channel-offer-page`） | 兩項均 `active:false`，唔展示／唔計 Result |
| 大新 BA | `$12k→10k Avios`、12-31 | 數值／期限不變；補 12 個月新客冷河及 clawback 記錄 | 2025-11-23／2026-12-31；`active` | [官方 T&C](https://www.dahsing.com/pdf/credit_card/cc_bacard_tnc_en.pdf)（`bank-official-welcome-terms`） | — | Result 無 drift；只更新核實 metadata |
| HSBC Visa Signature | `$8k→2k`、reference-only | 新客 base `$8k→約8k里`；現有客約2k；July flash 另列；完整模型未完成 | base 03-01／2027-02-28；flash 07-13／07-31；`active-reference-only` | [base T&C](https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf)／[flash T&C](https://www.redhotoffers.hsbc.com.hk/media/114083727/2026-July-Flash-Offer-TC-EN_final.pdf) | — | 仍 `verified:false`，完全不入推薦及 22 fixtures |
| AE Platinum 官方新／現有客 | 22,222／55,556；現有客45k；07-29 | 數值／期限不變；新客及現有會員 offer 分開記錄 | 新客 07-15／07-29；現有客 02-26／07-29；`active-expiring` | [官方迎新 T&C](https://www.americanexpress.com/content/dam/amex/hk/en/staticassets/pdf/cards/platinum-card/ThePlatinum_WelcomeOffer_TC_EN.pdf)（`bank-official-welcome-terms`） | — | 高年費 gate 原樣；Result 無 drift；文章／卡頁更新核實日 |
| AE Platinum／里先生 | 舊 2,000 里、無日期 | 舊 record 保留 `historical-unverified`；另新增平台賞**最高** 88 MM Credit＝38 新會員＋50 成功批卡填表 | 07-15／07-31；`active-expiring` | — | [里先生卡頁](https://www.mrmiles.hk/ae-platinum-card-centurion-lounge/)（`channel-offer-page`） | 新增條件式現行渠道顯示；唔入 Result |
| AE Platinum／MoneyHero | 舊 HK$300 Apple 禮券、無日期 | 舊 record 保留 `historical-unverified`；新增 HK$6,000 Apple Store 禮品卡或 FPS 現金，明文不可同 issuer／其他迎新疊加 | 07-14 12:00／07-29 18:00（HKT）；`active-expiring` | — | [MoneyHero 卡頁](https://www.moneyhero.com.hk/zh/credit-card/products/the-platinum-card)（`channel-offer-page`） | `startsAt`／`expiresAt` 鎖定精確時分、`stackable:false`；文章明示 alternative，絕不加進 Result |

## Stage B source record contract

- `data/source-registry.js` schema 2 保存 19 個官方 offer records（17 個 status 以 `active` 開頭，其中 2 個係 reference-only；另有 1 historical、1 conflict）；每項有 `id`、`sourceUrl`、`sourceType`、`verifiedAt`、`validFrom`、`validUntil`、`status`、`engineStatus` 同摘要。HSBC／DBS 海外條件式優惠亦係獨立官方 records。
- `data/card-channels.js` schema 3 保存 17 個渠道 records（12 active、3 unknown、2 `historical-unverified`）；每項另有 `promoCode`、`fixedBonus`、`issuerOfferClaim`、`randomBonus`、`conditions`、`stackable`，唔再用一條「高達」字串當全部獎賞。日期預設以香港日曆日包尾；有實際時分嘅 MoneyHero AE Platinum 另存 `startsAt`／`expiresAt`（`+08:00`）並按精確 timestamp 截止。
- parent channel offer 同 nested issuer／random component 各自用 period helper 判定；SC MoneySmart 於 07-31 前可保持平台禮品 active，但 blind-box 只到 07-23。Verifier 以 2026-07-23 23:59／07-24 00:01 HKT assertion 鎖定 nested badge 轉為已完結嘅邊界。
- `audit-freshness.js` 同 `verify.js` 直接驗證上述 schema；unknown／conflict 係披露狀態，唔會當 active verified offer。
- `tests/fixtures/card-data-phase1b-20260723.json` 鎖定 Stage B source hashes；`tests/fixtures/card-data-v6.79.0.json` 繼續保留 Stage A 搬遷前值作歷史 parity 證據。

## Known unknown／conflict（未改 Engine 公式）

| 類別 | 狀態 | 今次處理 |
|---|---|---|
| SC／DBS／AE Explorer marketed welcome totals 包 basic miles | `conflict` | SC／AE 沿用 v6.79.0 semantics並披露；DBS Q3 `engineEligible:false`，避免新 offer 被 double-count |
| HSBC EveryMile existing base | 官方 Red Hot campaign 頁列 HK$200 RC；相連 base PDF 表格列 N/A，而且正面 claim 冇獨立日期 | `excluded-conflict`，日期保持 unknown，冇自行套全年日期或揀數 |
| HSBC／Citi／Amex 第二張卡乘數 | 只得部分 offer-specific 證據，不能概括成銀行統一比例 | 保留現有公式；另開 Engine Phase 先處理 |
| HSBC EveryMile HK$2/里 | 指定商戶產品優惠列 unlimited；另一路海外 HK$2 推廣有門檻／上限 | 兩者分開記錄；Engine 冇套海外 promo rate |
| DBS 海外 HK$2/里 | 要 Card+ 登記、每月總簽 HK$20k，優惠約只覆蓋首 HK$20k 海外 | Engine 繼續用基本 HK$4/里 |
| MoneySmart EveryMile 58.5k headline | 可核 base＋flash＋分期後仍有 9.5k／HK$475 RC residual；實際受簽賬類別影響 | 標 `deterministic:false`／marketing residual，唔當固定賞或補入 Result |
| HSBC Visa Signature | base／flash 有證據，但完整 categories／stacking／exclusions 未建模 | 保持 reference-only／`verified:false` |
| SC MoneyHero；AE Explorer MoneySmart／MoneyHero | 精確渠道期或 claim T&C 不完整 | `unknown`＋`active:false`，唔展示、唔補估 |
| `applyWeeks`、每月最多兩張卡、12 個月籌備期、1.10 preference、HK$3,000 高年費閘值 | 本輪官方資料唔證明呢啲產品／Engine heuristic | 全部不改；列入後續獨立 Engine 核實 |

## Stage B 差異邊界

- optimizer：22／22 預期保持完全一致；任何新官方數值有模型衝突時先 gate，唔為咗「更新」而靜默改公式。
- Result：DBS Q3 offer record 由 expired 變 active，但因 marketed total double-count conflict，迎新仍不進 Result；其餘 optimizer 數值不變。
- Hero：EveryMile 示範由渠道 headline `58,500` 改為官方可同時成立而不含分期／日常回報嘅 `45,000`；Explorer 到期日改為官方 `2026-08-31`。
- 文章／分享：`pgO1`、`pgO2`、`pgO3`、`pgO4`、`pgO5` 按來源拆分；分享 metadata／wrappers 只更新有變更嘅限時頁。
- 卡頁：9 張卡由同一 source 重新生成；數值未改嘅卡只更新核實日，相關卡另外顯示期限、reference-only 或 model-conflict 提示。
- UI 架構／流程：Welcome、Consent、Profile、Bottom Nav、點賺／點用互動結構均不改；冇 Phase 2 工作。

## 22 個 optimizer fixtures：Stage A＝Stage B

`tests/fixtures/optimizer-v6.79.0.json` 喺 Stage B 前後逐 byte 一致（SHA-256 `959d960f2b3b43767e7b60c683b6151403eebff5c6e9bf3b60333891c1390f21`）。

| Fixture | Amount | Stage A total miles | Stage B total miles | Drift |
|---|---:|---:|---:|---:|
| single-5000 | 5,000 | 20,625 | 20,625 | 0 |
| family-5000 | 5,000 | 20,625 | 20,625 | 0 |
| single-8000 | 8,000 | 21,625 | 21,625 | 0 |
| family-8000 | 8,000 | 21,625 | 21,625 | 0 |
| single-16999 | 16,999 | 43,558 | 43,558 | 0 |
| family-16999 | 16,999 | 52,749.666667 | 52,749.666667 | 0 |
| single-30000 | 30,000 | 65,058.333333 | 65,058.333333 | 0 |
| family-30000 | 30,000 | 85,783.333333 | 85,783.333333 | 0 |
| single-100000 | 100,000 | 105,791.666667 | 105,791.666667 | 0 |
| family-100000 | 100,000 | 173,916.666667 | 173,916.666667 | 0 |
| single-300000 | 300,000 | 163,458.333333 | 163,458.333333 | 0 |
| family-300000 | 300,000 | 249,250 | 249,250 | 0 |
| single-1000000 | 1,000,000 | 303,458.333333 | 303,458.333333 | 0 |
| family-1000000 | 1,000,000 | 406,916.666667 | 406,916.666667 | 0 |
| owned-card-30000 | 30,000 | 46,100 | 46,100 | 0 |
| excluded-card-30000 | 30,000 | 46,100 | 46,100 | 0 |
| annual-fee-off-300000 | 300,000 | 163,458.333333 | 163,458.333333 | 0 |
| annual-fee-on-300000 | 300,000 | 207,125 | 207,125 | 0 |
| lump-spend-100000 | 100,000 | 105,791.666667 | 105,791.666667 | 0 |
| tiered-sc-cathay-110000 | 110,000 | 58,333.333333 | 58,333.333333 | 0 |
| threshold-citi-pm-8000 | 8,000 | 21,000 | 21,000 | 0 |
| fee-purchase-citi-8000 | 8,000 | 21,000 | 21,000 | 0 |

## Stage B 驗收

| Gate | 結果 |
|---|---|
| Optimizer fixtures | PASS，22／22；fixture byte-identical，零 drift |
| Regression Lock | PASS：data／optimizer／product／generated／DOM／storage |
| `verify.js` | PASS，全部 invariant |
| Consent runtime | PASS |
| Freshness（2026-07-23 HK） | PASS；9 張卡、17 active official（19 official records）、12 active channel；0 errors／17 真實到期提醒 |
| Card／share generators | PASS；9 張卡＋index、22 個 generated share pages（連保留歷史頁合計 33 files）；Regression snapshot before／after tree hash `eb1ddf8750b68d9af7f305451ddb8d6aaae9f901f73f1159c708af18ab6feb64`，`drift: []` |
| HTTP smoke | PASS，112／112 |
| JS／JSON syntax | PASS，JS 17／17；JSON 9／9 |
| DOM／storage | DOM IDs 209→209、duplicate 0、bottom nav／critical elements exact；localStorage snapshot byte-identical（16 keys／16 reset keys） |
| Browser／axe | BLOCKED：環境冇可用 Chromium，`browser-qa.js` 明確要求 `CHROMIUM_PATH`；冇虛報 PASS |
| Stage A protected output | `cards/**`、`share/**`、`img/**`、`manifest.json` 全部零檔案 drift；`index.html`／`sw.js` 只改 data loader／離線 asset wiring，DOM 209 IDs、UI／流程／推薦結果零 drift |
| Stage B product diff | `sw.js`、`manifest.json`、`img/**` 零 diff；`index.html`、`cards/**`、4 個 share wrappers 只包含上表官方／渠道更新及 DBS safety gate |

Stage B published commit：`39eaa17ae8c70338fec1fb8d316404a3a93c47fc`（`Phase 1B — Refresh expiring official and channel offers`；tree SHA `1107fb66d600130eca3e6504ff16fb9563d37383`）。
