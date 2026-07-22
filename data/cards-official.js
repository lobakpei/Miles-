(function(root, factory){
  'use strict';
  var registry = typeof module !== 'undefined' && module.exports
    ? require('./source-registry.js')
    : root.AcreMilesSourceRegistry;
  var api = factory(registry);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AcreMilesCardsOfficial = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(registry){
  'use strict';

  if (!registry || !registry.CARD_SOURCES || !registry.DATA_AS_OF) {
    throw new Error('AcreMiles official source registry is required before cards-official.js');
  }
  var CARD_RECORDS = [
  {
    "id": "sc-cathay",
    "name": "渣打國泰Mastercard",
    "bank": "渣打",
    "program": "am",
    "minIncome": 96000,
    "incomeVerified": true,
    "welcome": {
      "type": "tiered",
      "months": 2,
      "validFrom": "2026-05-01",
      "deadline": "2026-07-30",
      "status": "active-expiring",
      "offerRef": "sc-cathay-welcome-2026-05",
      "modelStatus": "legacy-model-conflict",
      "tiers": [
        {
          "spend": 5000,
          "miles": 10000
        },
        {
          "spend": 40000,
          "miles": 20000
        },
        {
          "spend": 110000,
          "miles": 40000
        }
      ],
      "prereq": "網上申請；新客＝現時冇持有渣打／MANHATTAN 主卡，而且申請前 6 個月冇取消；每人只可一份迎新；最遲 2026-10-31 發卡",
      "note": "呢個係綠卡（主打）階梯。官方 T&C 列明 10,000／20,000／40,000 里總數包括正常簽賬里數；現有 Engine 沿用 v6.79.0 語義，相關 double-count 留待獨立 Engine Phase 修正。優先理財（藍）／優先私人理財（黑）係另一產品級別。"
    },
    "rateLocal": 6,
    "rateOnline": 6,
    "rateOverseas": 4,
    "cat": {
      "dining": 4
    },
    "annualFeeFirst": 0,
    "feeRenewal": 2000,
    "feeWaivable": true,
    "waiveNote": "首年免；其後如屬合資格優先理財／Premium 理財或出糧戶口客戶可豁免（官方條款；HK$96,000 係年薪門檻，唔係簽賬門檻）",
    "convertFee": 0,
    "applyWeeks": 3,
    "note": "全城唯一國泰聯營卡，Asia Miles 每月自動入賬免手續費。食肆＋酒店 HK$4/里、其他港幣 $6、海外 $4、國泰／香港快運 $2（官方產品頁，2026-07-23 再核）。渣打推廣多數要預先登記；DCC 港幣結算海外簽賬唔計指定獎賞，亦可能另收 1%。驚喜盲盒申請期至 7 月 23 日，只屬抽獎，唔會計入 Result。官方最低年薪 HK$96,000。",
    "verified": true,
    "publicDetails": {
      "eligibility": [
        "新客＝申請時冇持有渣打／MANHATTAN 主卡，而且申請前 6 個月冇取消同類主卡。",
        "每人只可一份迎新；現行申請期至 2026-07-30，最遲 2026-10-31 發卡。",
        "主庫係大眾綠卡；優先理財藍卡、優先私人理財黑卡嘅迎新及海外率不同，申請前要按自己戶口級別核對。"
      ],
      "registration": [
        "迎新窗口只有批卡後 2 個月。",
        "渣打部分加碼要預先登記或輸入指定推廣碼；任何大額簽賬前先開當期條款確認。"
      ],
      "fees": [
        "外幣交易費 1.95%。",
        "海外以港幣結算或非香港註冊商戶港幣交易可另收 1%；DCC 揀港幣通常亦失去海外獎賞。",
        "電子轉賬類交易每月累計超過 HK$25,000 嘅部分可收 3.5% 手續費。"
      ],
      "exclusions": [
        "已核實：DCC 港幣結算海外簽賬唔計指定推廣；其他排除項目要以申請當期迎新 T&C 為準。"
      ],
      "crediting": [
        "Asia Miles 按月自動存入會員戶口，毋須手動兌換，亦冇兌換手續費。"
      ],
      "benefits": [
        "國泰／香港快運簽賬可達 HK$2/里；食肆及酒店 HK$4/里。",
        "藍卡及黑卡屬較高資產級別，海外率可較綠卡高。"
      ]
    },
    "slug": "scb-cathay-mastercard",
    "image": "img/pgO1-hero.jpg",
    "status": "active",
    "sourceRef": "sc-cathay"
  },
  {
    "id": "hsbc-everymile",
    "name": "滙豐 EveryMile",
    "bank": "滙豐",
    "program": "flex",
    "minIncome": 240000,
    "incomeVerified": true,
    "welcome": {
      "type": "threshold",
      "months": 2,
      "validFrom": "2026-07-13",
      "deadline": "2026-07-31",
      "status": "active-expiring",
      "offerRef": "hsbc-everymile-july-flash-2026",
      "modelStatus": "partial-components",
      "tiers": [
        {
          "spend": 8000,
          "miles": 20000
        }
      ],
      "prereq": "申請時輸入合資格 flash 推廣碼（官方直申碼 HSBCFLASH 或所選渠道碼）；發卡後 60 日內累積簽 HK$8,000，並至少有一次流動電話付款；附屬卡申請人及過去 12 個月取消任何滙豐主卡者不合資格",
      "note": "呢 20,000 里只係 7 月 flash 額外 component。全年新客 base 為 60 日簽 HK$25,000 得 25,000 里；現有 schema 未能安全疊加 base＋flash＋分期，所以 Result 暫只計有清晰門檻嘅 20,000 里 flash，屬保守 partial model。"
    },
    "rateLocal": 5,
    "rateOnline": 5,
    "rateOverseas": 5,
    "cat": {
      "transport": 2
    },
    "annualFeeFirst": 0,
    "feeRenewal": 2000,
    "feeWaivable": true,
    "waiveNote": "首年免；次年簽夠 HK$80,000 自動豁免（繳費／繳稅唔計入門檻）",
    "convertFee": 0,
    "applyWeeks": 2,
    "note": "指定日常／旅遊商戶 HK$2/里＝2.5% 獎賞錢 × $1RC=20里；官方產品頁列呢類指定商戶優惠為 unlimited。餐飲只限咖啡店及輕便美食名單，一般餐廳酒樓未必計；交通包括巴士／港鐵／的士／油站。另一路 2026 海外 HK$2/里推廣有每期門檻及 RC 上限，Engine 冇用嗰個限時海外率。獎賞錢要喺 Reward+ App 兌換。",
    "verified": true,
    "publicDetails": {
      "eligibility": [
        "最低年薪 HK$240,000。",
        "現行 7 月 flash 要網上申請並輸入合資格推廣碼；新客 base 同 flash 係兩個 component。",
        "附屬卡申請人不合資格；過去 12 個月取消任何滙豐主卡亦不合資格。新客／現有客按批核處理時有冇持有滙豐主卡判定。",
        "官方 Red Hot campaign 頁列現有客 base HK$200 獎賞錢，但相連 base T&C 表格列 N/A，而且正面 claim 冇獨立有效期；已標 conflict，冇自行揀數或套用全年日期。"
      ],
      "registration": [
        "官方直申 flash 碼係 HSBCFLASH；第三方渠道碼要按所選渠道頁核對，每次申請只可用一個碼。",
        "里數優惠兌換要喺 Reward+ App 進行；網上理財兌換未必享相同兌換率。",
        "指定商戶名單可隨時改，簽之前要喺滙豐最新名單查一次。"
      ],
      "fees": [
        "外幣交易費 1.95%。",
        "海外港幣交易或非香港註冊商戶港幣交易可另收 1%。"
      ],
      "exclusions": [
        "官方重要條款索引有列例外交易；現有資料未足以將完整排除清單逐項寫死，所以申請及湊迎新前必須再開官方 T&C。"
      ],
      "crediting": [
        "HK$1「獎賞錢」按優惠兌換率可換 20 里；要用 Reward+ App。"
      ],
      "clawback": [
        "發卡後 13 個月內取消相關主卡，滙豐可按條款扣回迎新。"
      ],
      "benefits": [
        "指定交通、咖啡店、輕便美食及旅遊商戶可達 HK$2/里；一般餐廳酒樓未必屬指定名單。",
        "指定商戶 HK$2/里產品優惠列為 unlimited；另一路限時海外 HK$2/里係不同推廣，須每期海外簽 HK$12,000，額外 RC 每期上限 HK$225。",
        "其他一般本地及海外簽賬以 HK$5/里作保守比較。"
      ]
    },
    "slug": "hsbc-everymile",
    "image": "img/pgO2-hero.jpg",
    "status": "active",
    "sourceRef": "hsbc-everymile"
  },
  {
    "id": "citi-pm",
    "name": "Citi PremierMiles",
    "bank": "Citibank",
    "program": "flex",
    "minIncome": 120000,
    "incomeVerified": true,
    "welcome": {
      "type": "threshold",
      "months": 2,
      "validFrom": "2026-07-01",
      "deadline": "2026-09-30",
      "status": "active",
      "offerRef": "citi-premiermiles-welcome-2026-q3",
      "tiers": [
        {
          "spend": 5000,
          "miles": 20000
        }
      ],
      "prereq": "首 2 個月內每月最少簽 1 次（唔好一個月簽晒就停手）；發卡 1 個月內啟動實體卡"
    },
    "rateLocal": 8,
    "rateOnline": 8,
    "rateOverseas": 4,
    "annualFeeFirst": 0,
    "feeRenewal": 1800,
    "feeWaivable": true,
    "waiveNote": "次年打 2860 0360 試 waive（年費 $1,800 待官方收費表）",
    "convertFee": 200,
    "applyWeeks": 3,
    "note": "迎新 $5,000 → 20,000 里（$0.25/里，全場最平浸之一；官方 T&C 至 9 月 30 日）。交稅、繳費、PayAll、八達通增值全部唔計迎新門檻——湊門檻要簽真消費。外幣基本 $4/里，簽賬達 $20,000 先去 $3（官網有門檻，穩陣用 $4 計）。本地 $8/里較弱。積分達標後 5 個月先入賬，換機票預足時間。PayAll 手續費 4%。",
    "verified": true,
    "publicDetails": {
      "eligibility": [
        "18 歲或以上；最低年薪 HK$120,000。",
        "新客＝過去 12 個月冇持有或取消任何 Citi 主卡；發卡後 1 個月內要啟動實體卡。"
      ],
      "registration": [
        "迎新期內每個月最少要有一次合資格簽賬，唔可以第一個月簽晒之後完全停手。"
      ],
      "fees": [
        "Citi PayAll 手續費 4%。",
        "DCC 額外費 1%；年費及其他收費以官方收費表為準。"
      ],
      "exclusions": [
        "FPS、八達通增值、現金透支、結餘轉賬、Quick Cash、FlexiBill／PayLite、繳稅、網上繳費／公用事業、保險、慈善／非牟利、PayAll、基金、銀行費用、DCC 費、賭場、取消或退款交易均不計迎新門檻。"
      ],
      "crediting": [
        "迎新積分可於達標月份後 5 個曆月內存入；換機票要預足時間。",
        "積分可轉 11 個航空／酒店計劃，包括 Asia Miles、British Airways Club、Qatar、KrisFlyer、Qantas、Flying Blue 及 IHG 等。"
      ],
      "clawback": [
        "發卡後 12 個月內取消主卡，銀行可扣回迎新。"
      ]
    },
    "slug": "citi-premiermiles",
    "image": "img/pgG2-cards.jpg",
    "status": "active",
    "sourceRef": "citi-pm"
  },
  {
    "id": "citi-prestige",
    "name": "Citi Prestige",
    "bank": "Citibank",
    "program": "flex",
    "minIncome": 600000,
    "incomeVerified": true,
    "welcome": {
      "type": "feePurchase",
      "fee": 3800,
      "miles": 30000,
      "months": 0,
      "validFrom": "2026-07-01",
      "deadline": "2026-09-30",
      "status": "active",
      "offerRef": "citi-prestige-welcome-2026-q3",
      "note": "交首年年費 HK$3,800 → 30,000 里（每里現金成本 $0.127）。唔使簽賬、唔佔簽賬額度；年費任何情況唔退唔 waive。第二年起每年再獲 30,000 里（年度獻禮）——長線「買里機器」。12 個月內 cut 卡會扣返。"
    },
    "rateLocal": 6,
    "rateOnline": 6,
    "rateOverseas": 4,
    "annualFeeFirst": 3800,
    "feeRenewal": 3800,
    "feeWaivable": false,
    "waiveNote": "年費 HK$3,800 硬收（官方KFS核實），唔 waive——係迎新前提",
    "convertFee": 200,
    "applyWeeks": 3,
    "note": "年薪門檻 HK$60萬（官方申請資格）、年費 $3,800 硬收兼要交咗先有迎新。價值喺「年年 30,000 里＋禮遇」（Priority Pass、酒店住4送1），唔喺簽賬賺里（本地 $6/里普通）——啱長線持有嘅高收入用戶，唔啱一次性迎新獵人。產品決策：墊底推介，計算器唔硬推。",
    "verified": true,
    "publicDetails": {
      "eligibility": [
        "18 歲或以上；官方最低年薪 HK$600,000。",
        "新客＝申請時冇持有 Citi 主卡，而且由申請月份起計過去 12 個月冇持有或取消 Citi 主卡；發卡後 1 個月內要啟動實體卡。",
        "迎新屬「交年費換積分」，唔係免費迎新，亦唔佔簽賬額度。"
      ],
      "registration": [
        "首年年費要全數入賬及繳清先符合 30,000 里迎新條件。",
        "另一路 HK$1,200 現金回贈要首兩月累積簽 HK$5,000，並且每個月最少一宗合資格交易；現金 component 冇計入 Engine。"
      ],
      "fees": [
        "年費 HK$3,800，硬收、不可豁免及不設退款。",
        "里數兌換手續費按現有收費資料為 HK$200。"
      ],
      "exclusions": [
        "日常優惠排除 FPS、八達通增值、繳稅、PayAll、保險、分期、慈善及取消退款等交易；細節以 Citi 共用條款為準。"
      ],
      "crediting": [
        "交妥年費後，迎新積分可於 2 個曆月內存入。",
        "第二年起每年交年費可獲年度 30,000 里獻禮；每年續卡前仍要核對當期條款。"
      ],
      "clawback": [
        "12 個月內取消主卡，銀行可扣回迎新。"
      ],
      "benefits": [
        "包括 Priority Pass、指定酒店第 4 晚免費、餐飲、機場接送及高球等禮遇；每項均有各自預約、次數及地區限制。"
      ]
    },
    "slug": "citi-prestige",
    "image": "img/pgG2-cards.jpg",
    "status": "active",
    "sourceRef": "citi-prestige"
  },
  {
    "id": "dbs-black",
    "name": "DBS Black World Mastercard",
    "bank": "DBS",
    "program": "flex",
    "minIncome": 240000,
    "incomeVerified": true,
    "welcome": {
      "type": "tiered",
      "months": 3,
      "validFrom": "2026-07-07",
      "deadline": "2026-10-05",
      "status": "active-model-conflict",
      "offerRef": "dbs-black-welcome-2026-q3",
      "engineEligible": false,
      "modelStatus": "conflict",
      "tiers": [
        {
          "spend": 8000,
          "miles": 8000
        },
        {
          "spend": 20000,
          "miles": 12000
        },
        {
          "spend": 60000,
          "miles": 30000
        }
      ],
      "prereq": "新客須經 DBS Card+ 登記、啟動及確認實體卡；可揀三級里數或簽 HK$8,000 換 DAYCROWN 行李箱。一次 Flexi Shopping 額外 2,000 里係獨立條件；現有客另按實體卡確認＋單一 HK$200 交易領 HK$50 一扣即享",
      "note": "Q3 已於 2026-07-07 接續生效。新客／現有客用 12 個月 lookback，批核時已有申請／持卡亦算現有客；同一申請多卡只把第一張視為新客，其後視為現有客。官方 clause 16 列明 8,000／12,000／30,000 總里數包括 basic DBS$；現有 Engine 會 double-count，所以今次只更新及展示官方 offer，迎新暫不計入 Result。",
      "history": [
        {
          "validFrom": "2026-04-29",
          "validUntil": "2026-07-06",
          "status": "historical",
          "offerRef": "dbs-black-welcome-2026-q2",
          "tiers": [
            {"spend": 8000, "miles": 8000},
            {"spend": 20000, "miles": 12000},
            {"spend": 60000, "miles": 30000}
          ]
        }
      ]
    },
    "rateLocal": 6,
    "rateOnline": 6,
    "rateOverseas": 4,
    "annualFeeFirst": 0,
    "feeRenewal": 3600,
    "feeWaivable": true,
    "waiveNote": "首年免年費（官方產品頁）；次年 HK$3,600（官方KFS），多數要打電話試 waive",
    "convertFee": 0,
    "applyWeeks": 2,
    "note": "本地 HK$6/里。海外基本 HK$4/里；2026 海外 HK$2/里要先用 Card+ 登記、每月總合資格簽賬 HK$20,000，優惠約只覆蓋每月首 HK$20,000 海外簽賬，所以 Engine 保守用 HK$4。Q3 迎新已接續至 10 月 5 日，但因 marketed total 包 basic DBS$ 嘅模型衝突，暫不計入 Result。儲里要揀『DBS$ 自選換領』。",
    "verified": true,
    "publicDetails": {
      "eligibility": [
        "18 歲或以上香港居民；最低年薪 HK$240,000。",
        "新客＝批核時冇申請／持有 DBS 主卡，且申請前 12 個月冇持有或取消；否則按現有客處理。同一申請多卡只把第一張視為新客。",
        "Q2 已於 2026-07-06 完結並保留歷史；Q3 由 2026-07-07 至 10-05，數值相同。",
        "Q3 總里數包括 basic DBS$；未完成『included base miles』模型前，迎新唔計入推薦 Result。"
      ],
      "registration": [
        "批卡後要下載、登記及啟動 DBS Card+。",
        "要選擇「DBS$ 自選換領」先可以按計劃兌換里數。",
        "新客可揀里數 tier 或 DAYCROWN 28 吋行李箱；Flexi Shopping 2,000 里係獨立額外 component。現有客要三個月內確認實體卡，並以實體卡單一簽 HK$200 或以上先見到 HK$50 一扣即享。",
        "海外 HK$2/里推廣要先登記，而且該月總合資格零售簽賬達 HK$20,000。"
      ],
      "fees": [
        "首年免年費；其後年費 HK$3,600。",
        "其他外幣及跨境收費以 DBS 最新 KFS 為準。"
      ],
      "exclusions": [
        "迎新同海外推廣口徑不同；共通排除包括繳稅、繳費、保險、基金、現金透支、分期供款、取消及退款。Q3 精確口徑以現行官方 T&C 為準。"
      ],
      "crediting": [
        "Q3 迎新入賬時間及實體卡確認要求以 2026 Q3 T&C 為準。"
      ],
      "clawback": [
        "Q3 條款列明 12 個月內取消主卡可扣回迎新。"
      ],
      "benefits": [
        "海外優惠率 HK$2/里只適用每月首 HK$20,000 海外簽賬，而且要同月總簽賬達標；未達標或超額以 HK$4/里計。"
      ]
    },
    "slug": "dbs-black-world-mastercard",
    "image": "img/pgG2-cards.jpg",
    "status": "active",
    "sourceRef": "dbs-black"
  },
  {
    "id": "amex-explorer",
    "name": "AE Explorer",
    "bank": "美國運通",
    "program": "flex",
    "minIncome": 120000,
    "incomeVerified": true,
    "welcome": {
      "type": "tiered",
      "months": 3,
      "validFrom": "2026-07-02",
      "deadline": "2026-08-31",
      "status": "active",
      "offerRef": "amex-explorer-welcome-2026-summer",
      "modelStatus": "legacy-model-conflict",
      "tiers": [
        {
          "spend": 8000,
          "miles": 8000
        },
        {
          "spend": 30000,
          "miles": 26000
        }
      ],
      "prereq": "指定連結網上申請；新客＝過去 12 個月冇任何 AE 香港基本卡。要取 marketed total 26,000 里，HK$30,000 入面至少 HK$15,000 必須係合資格本地港幣簽賬，並成功登記「本地簽賬賞」；否則唔會有齊該 total",
      "note": "官方 26,000 里係 welcome points 加 Local Spend Bonus 嘅 marketed total，唔係單一迎新 component；現有 Engine 沿用 v6.79.0 語義，相關 double-count 留待獨立 Engine Phase 修正。"
    },
    "rateLocal": 3,
    "rateOnline": 3,
    "rateOverseas": 4.8,
    "cat": {
      "overseas": {
        "rate": 1.68,
        "capMonthly": 3333,
        "excessRate": 4.8
      }
    },
    "capQuarterly": 15000,
    "excessRate": 6,
    "secondCardMult": 0,
    "annualFeeFirst": 0,
    "feeRenewal": 2200,
    "feeWaivable": true,
    "waiveNote": "首年免（迎新）；其後年簽 HK$150,000 自動豁免下年度（官方）",
    "convertFee": 0,
    "applyWeeks": 2,
    "note": "官方T&C核實（18分=1里，2026-07基準）。HK$8,000 本地簽賬→8,000里；marketed HK$30,000→26,000里要至少 HK$15,000 合資格本地港幣簽賬並登記 Local Spend Bonus，總數包含簽賬獎賞，現有 Engine 保留 legacy conflict。申請至 8 月 31 日；過去 12 個月有任何 AE 卡＝唔合資格。本地 $3/里要登記，額外部分每季首 $15,000，超過跌 $6/里。外幣 $1.68/里要登記，每季首 $10,000，另有 2% 外幣手續費。",
    "verified": true,
    "publicDetails": {
      "eligibility": [
        "最低年薪 HK$120,000。",
        "新客＝過去 12 個月冇持有或取消任何 AE 香港基本卡。"
      ],
      "registration": [
        "批卡後立即分別登記本地、外幣及指定網上商戶賺分計劃；marketed 26,000 里要 HK$30,000 入面至少 HK$15,000 係合資格本地港幣簽賬，冇登記 Local Spend Bonus 就唔會有齊宣傳總數。"
      ],
      "fees": [
        "外幣交易費 2%。",
        "基本卡連首 2 張附屬卡；第 3 張附屬卡起按官方 KFS 收費。"
      ],
      "exclusions": [
        "電子錢包增值、本地拍賣行港幣交易、年費、結餘轉戶、旅行支票／禮券、財務費、逾期費、海外退稅、繳稅及經 AE 賬戶繳交部分公用事業費不賺分。"
      ],
      "crediting": [
        "Membership Rewards 以 18 分兌 1 里作目前比較基準；兌換率及夥伴名單可改。"
      ],
      "clawback": [
        "12 個月內取消卡，AE 可扣回迎新。"
      ],
      "benefits": [
        "本地優惠率每季首 HK$15,000；超過後回落至 HK$6/里。",
        "外幣優惠率每季首 HK$10,000，另計 2% 外幣費；部分商戶不接受 AMEX。"
      ]
    },
    "slug": "ae-explorer",
    "image": "img/pgO4-hero.jpg",
    "status": "active",
    "sourceRef": "amex-explorer"
  },
  {
    "id": "dahsing-ba",
    "name": "大新英國航空白金卡",
    "bank": "大新銀行",
    "program": "avios",
    "minIncome": 150000,
    "incomeVerified": true,
    "welcome": {
      "type": "threshold",
      "months": 3,
      "validFrom": "2025-11-23",
      "deadline": "2026-12-31",
      "status": "active",
      "offerRef": "dahsing-ba-welcome-2025-2026",
      "tiers": [
        {
          "spend": 12000,
          "miles": 10000
        }
      ],
      "prereq": "新客＝發卡前 12 個月冇任何大新主卡或附屬卡",
      "note": "額外 10,000 Avios（連呢 $12,000 嘅基本約 2,000 ＝共約 12,000）。仲有兩個可疊加嘅條件獎：①首 6 個月海外 $2/里（每月首 $10,000、月上限 5,000 Avios）②申請時或發卡 3 個月內網上開優易／VIP i-Account ＋5,000——都係有條件先有，入 note 唔入引擎。"
    },
    "rateLocal": 6,
    "rateOnline": 6,
    "rateOverseas": 4,
    "cat": {},
    "annualFeeFirst": 0,
    "feeRenewal": 1800,
    "feeWaivable": true,
    "waiveNote": "首2年免年費（網上），第3年起致電 2828 8168 多數 waive 到；年費 $1,800 官方KFS",
    "convertFee": 0,
    "applyWeeks": 3,
    "note": "Avios 每月自動直入 BA Club、費用全免——全庫最省手續嘅 Avios 卡。官方核實：本地 $6/里、海外 $4/里（BA 機票唔算海外）、生日當日 $3/里、BA 官網買 BA 機票 $3/里另有 9 折 code（CARDOFFERH，至 2027-02-28）。⚠️ 13 個月內 cut 主卡罰 HK$1,200（比一般 12 個月長）；Avios 36 個月無動用會歸零。官方產品頁寫明最低年薪 HK$150,000。",
    "verified": true,
    "publicDetails": {
      "eligibility": [
        "最低年薪 HK$150,000。",
        "新客＝發卡前 12 個月冇持有任何大新主卡或附屬卡。"
      ],
      "registration": [
        "申請時或發卡後 3 個月內網上開指定新理財戶口，先符合額外開戶 Avios 條件；已有戶口或分行開戶唔計。"
      ],
      "fees": [
        "白金卡年費 HK$1,800；外幣交易費 1.95%，跨境港幣交易費 1%。"
      ],
      "exclusions": [
        "迎新排除八達通增值、PayMe／TNG／WeChat Pay／Alipay 等電子錢包增值、繳稅繳費、分期供款、年費等。",
        "BA 機票簽賬唔當一般海外簽賬；取消或退款交易會扣回相應 Avios。"
      ],
      "crediting": [
        "Avios 會按月自動兌換並存入 British Airways Club，毋須手動轉換；迎新額外 Avios 可於簽賬期完結後約 6–8 星期入賬。"
      ],
      "clawback": [
        "13 個月內取消主卡可收 HK$1,200 手續費，比一般 12 個月更長。"
      ],
      "benefits": [
        "生日當日及指定 BA 機票簽賬可達 HK$3/Avios。",
        "指定香港出發 BA 機票 9 折碼 CARDOFFERH 有效期至 2027-02-28，使用前要核對班次及條款。"
      ]
    },
    "slug": "dahsing-ba-platinum",
    "image": "img/pgG2-cards.jpg",
    "status": "active",
    "sourceRef": "dahsing-ba"
  },
  {
    "id": "hsbc-visasig",
    "name": "滙豐 Visa Signature",
    "bank": "滙豐",
    "program": "flex",
    "minIncome": 240000,
    "incomeVerified": true,
    "welcome": {
      "type": "threshold",
      "months": 2,
      "validFrom": "2026-03-01",
      "deadline": "2027-02-28",
      "status": "active-reference-only",
      "offerRef": "hsbc-visasig-base-2026",
      "modelStatus": "reference-only",
      "tiers": [
        {
          "spend": 8000,
          "miles": 8000
        }
      ],
      "altTiers": [{"spend": 8000, "miles": 2000}],
      "altNote": "現有客 base：HK$200 獎賞錢≈2,000里；7 月 flash 另有新客約10,000／現有客約5,000里，但完整 stacked model 未完成。",
      "prereq": "網上申請並輸入合資格碼；7 月 flash 要發卡後 60 日內簽 HK$8,000，當中至少一次流動電話付款。附屬卡申請人及過去 12 個月取消任何滙豐主卡者不合資格"
    },
    "rateLocal": 25,
    "rateOnline": 25,
    "rateOverseas": 25,
    "cat": {
      "dining": 2.78
    },
    "capTotal": 100000,
    "excessRate": 25,
    "annualFeeFirst": 0,
    "feeRenewal": 2000,
    "feeWaivable": true,
    "waiveNote": "官方資料顯示首兩年免年費；其後年費 HK$2,000，續期前向滙豐確認最新豁免安排",
    "convertFee": 0,
    "applyWeeks": 2,
    "note": "「平民黑卡」。官方資料確認：基本 0.4% 獎賞錢＝兌 Cathay 時 HK$25/里；登記最紅自主並將額外倍數放入指定類別，加埋 Visa Signature 自動額外 1.2%，指定類別最高 3.6%＝約 HK$2.78/里。2026 計劃上限係指定類別首 HK$100,000。年薪 HK$240,000、年費 HK$2,000、首兩年免年費均有官方頁／KFS。仍暫停加入推薦，因為迎新各層同例外交易未完全轉成引擎欄位；唔係因為冇官方文件。",
    "verified": false,
    "publicDetails": {
      "eligibility": [
        "最低年薪 HK$240,000。",
        "附屬卡申請人不合資格；過去 12 個月取消任何滙豐主卡亦不合資格。新客／現有客按批核處理時有冇持有滙豐主卡判定。",
        "卡資料已有官方文件，但迎新各層及例外交易仍未完全轉入推薦器，所以暫時只供比較。"
      ],
      "registration": [
        "官方直申 flash 碼係 HSBCFLASH；申請後 60 日內簽 HK$8,000，並至少一次流動電話付款。",
        "要登記「最紅自主獎賞」並將額外倍數分配到指定類別；類別及上限按每期條款重新設定。"
      ],
      "fees": [
        "官方資料顯示首兩年免年費；其後年費 HK$2,000。",
        "外幣及跨境港幣費用以滙豐最新 KFS 為準。"
      ],
      "exclusions": [
        "例外交易清單尚未完整轉成引擎欄位；未完成前唔會將 HK$2.78/里當成任何簽賬都適用。"
      ],
      "crediting": [
        "基本 0.4% 獎賞錢；兌 Cathay 時按現行官方兌換率比較。"
      ],
      "clawback": [
        "發卡後 13 個月內取消相關主卡，滙豐可按條款扣回迎新。"
      ],
      "benefits": [
        "指定「最紅自主」類別連 Visa Signature 額外獎賞最高約 3.6% 獎賞錢，即約 HK$2.78/里；2026 年指定類別上限為首 HK$100,000。"
      ]
    },
    "slug": "hsbc-visa-signature",
    "image": "img/pgG2-cards.jpg",
    "status": "reference-only",
    "sourceRef": "hsbc-visasig"
  },
  {
    "id": "amex-platinum",
    "name": "AE 白金卡（細頭）",
    "bank": "美國運通",
    "program": "flex",
    "minIncome": 120000,
    "incomeVerified": true,
    "welcome": {
      "type": "tiered",
      "months": 3,
      "validFrom": "2026-07-15",
      "deadline": "2026-07-29",
      "status": "active-expiring",
      "offerRef": "amex-platinum-new-2026-july",
      "tiers": [
        {
          "spend": 15000,
          "miles": 22222
        },
        {
          "spend": 50000,
          "miles": 55556
        }
      ],
      "altTiers": [
        {
          "spend": 15000,
          "miles": 45000
        }
      ],
      "altNote": "現有 AE 會員（過去12個月冇白金／半島白金）：簽 $15,000 → 810,000 分＝45,000 里（申請期 02-26 至 07-29，16 星期入分）",
      "condNote": "另有兩浸現金回贈（唔係里數，冇計入上面）：①網上申請＋7 個工作天內交齊文件，批卡後 3 個月內完成首次簽賬 → HK$1,000 回贈；②手機八達通增值單一簽 $600+ → HK$50 回贈。",
      "prereq": "新客＝過去 12 個月冇任何 AE 香港批核嘅基本卡；官方 T&C（07-15 至 07-29 收件並批核）；批卡即重新登記 9X"
    },
    "rateLocal": 9,
    "rateOnline": 9,
    "rateOverseas": 4.5,
    "cat": {
      "overseas": {
        "rate": 2,
        "capMonthly": 5000,
        "excessRate": 4.5
      },
      "groceries": {
        "rate": 2,
        "capMonthly": 5000,
        "excessRate": 9
      }
    },
    "capTotal": 160000,
    "excessRate": 18,
    "secondCardMult": 0.81,
    "annualFeeFirst": 9500,
    "feeRenewal": 9500,
    "feeWaivable": false,
    "waiveNote": "年費 HK$9,500 硬收（官方T&C），唔 waive。官方年薪門檻 $120,000，市場公認實際審批睇資產",
    "convertFee": 300,
    "applyWeeks": 2,
    "note": "【官方T&C 2026-07-23核實】申請期 07-15 至 07-29：新客簽 $15,000→400,000 分（22,222里）、簽 $50,000→合共 1,000,000 分（55,556里）；現有 AE 會員簽 $15,000→810,000 分（45,000里）。另有網上申請首次簽賬 $1,000 回贈＋手機八達通增值 $50（現金，冇計入引擎）。日常本地 $9/里（Turbo 每年度首 $160,000，超過 $18/里）；外幣／指定超市 $2/里要登記 9X，每類每季首 $15,000。Alipay／WeChat 唔計分，Apple Pay 計。取消退款、儲值增值、年費同稅項唔計簽賬；兌換迎新後 12 個月內取消，AE 有權扣返 $9,500 年費。9X 延續到 2027-12-31，分六階段並要逐階段重新登記。高年費卡只留作候選，唔自動加入推薦。",
    "verified": true,
    "publicDetails": {
      "eligibility": [
        "官方最低年薪 HK$120,000；實際審批仍由 AE 按整體財務狀況決定。",
        "新客＝過去 12 個月冇任何 AE 香港批核基本卡；現有 AE 會員有另一套迎新。"
      ],
      "registration": [
        "9X 分階段運作，每個階段都要重新登記；舊階段登記唔會自動延續。"
      ],
      "fees": [
        "年費 HK$9,500，硬收及不可豁免。",
        "外幣交易費 2%；里數兌換費按現有資料為 HK$300。"
      ],
      "exclusions": [
        "Alipay／WeChat Pay、取消退款、儲值增值、年費及稅項不計指定獎賞；Apple Pay 可按合資格交易計。"
      ],
      "crediting": [
        "現有 AE 會員迎新可於約 16 星期內入分；其他迎新按當期 T&C。"
      ],
      "clawback": [
        "兌換迎新後 12 個月內取消，AE 可扣回 HK$9,500 年費。"
      ],
      "benefits": [
        "Turbo 每計劃年度首 HK$160,000；超過後回落至約 HK$18/里。",
        "外幣及指定商戶 9X 分類各有獨立上限；9X 計劃現列至 2027-12-31。",
        "旅遊保險、機場貴賓室及白金秘書安排曾有改動，使用前必須再開官方禮遇頁確認。"
      ]
    },
    "slug": "ae-platinum-card",
    "image": "img/pgO3-hero.jpg",
    "status": "active",
    "sourceRef": "amex-platinum"
  }
];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function hydrate(record) {
    var source = registry.CARD_SOURCES[record.sourceRef];
    if (!source) throw new Error('Missing official source record for card: ' + record.id);
    var card = clone(record);
    card.url = source.url;
    card.sourceVerifiedAt = source.sourceVerifiedAt;
    card.sourceStatus = source.sourceStatus;
    card.sourceDocs = (source.sourceDocs || []).map(function(doc){
      return { label: doc.label, url: doc.url };
    });
    card.officialOffers = clone((registry.OFFICIAL_OFFERS || {})[record.id] || []);
    return card;
  }

  function getCards() {
    return CARD_RECORDS.map(hydrate);
  }

  return {
    schemaVersion: 1,
    DATA_AS_OF: registry.DATA_AS_OF,
    CARD_RECORDS: CARD_RECORDS,
    DEFAULT_CARDS: getCards(),
    getCards: getCards
  };
});
