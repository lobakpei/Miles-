(function(root, factory){
  'use strict';
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AcreMilesSourceRegistry = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';

  var DATA_AS_OF = "2026-07-23（9 張卡官方產品頁、KFS／T&C 逐張核對；到期優惠按香港日期）";
  var CARD_SOURCES = {
  "sc-cathay": {
    "url": "https://www.sc.com/hk/credit-cards/cathay/",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www.sc.com/hk/credit-cards/cathay/"
      },
      {
        "label": "官方 KFS／收費概要",
        "url": "https://av.sc.com/hk/content/docs/hk-cc-cathaycard-kfs.pdf"
      },
      {
        "label": "里數獎賞及年費豁免條款",
        "url": "https://av.sc.com/hk/content/docs/hk-cx-t0-tnc.pdf"
      }
    ]
  },
  "hsbc-everymile": {
    "url": "https://www.hsbc.com.hk/credit-cards/products/everymile/",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www.hsbc.com.hk/credit-cards/products/everymile/"
      },
      {
        "label": "官方 KFS／收費概要",
        "url": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/key-fact-statement.pdf"
      },
      {
        "label": "EveryMile 重要條款索引",
        "url": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/everymile/important-information.pdf"
      },
      {
        "label": "迎新條款",
        "url": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf"
      },
      {
        "label": "官方里數兌換率",
        "url": "https://www.hsbc.com.hk/credit-cards/rewards/mileage-programme/"
      },
      {
        "label": "2026 年 7 月官方 Flash 優惠頁",
        "url": "https://www.redhotoffers.hsbc.com.hk/en/latest-offers/cvp-offer/"
      },
      {
        "label": "2026 下半年海外簽賬優惠",
        "url": "https://www.redhotoffers.hsbc.com.hk/en/latest-offers/everymile-spending-offer/"
      }
    ]
  },
  "citi-pm": {
    "url": "https://www.citibank.com.hk/english/credit-cards/premiermiles-cards/index.html",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www.citibank.com.hk/english/credit-cards/premiermiles-cards/index.html"
      },
      {
        "label": "官方 KFS／收費表",
        "url": "https://www.citibank.com.hk/english/credit-cards/pdf/fee-schedule.pdf"
      },
      {
        "label": "官方迎新條款",
        "url": "https://www.citibank.com.hk/english/credit-cards/welcome-offers/tnc/"
      }
    ]
  },
  "citi-prestige": {
    "url": "https://www1.citibank.com.hk/english/credit-cards/prestige-card",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www1.citibank.com.hk/english/credit-cards/prestige-card"
      },
      {
        "label": "官方 KFS／收費表",
        "url": "https://www.citibank.com.hk/english/credit-cards/pdf/fee-schedule.pdf"
      },
      {
        "label": "官方迎新條款",
        "url": "https://www.citibank.com.hk/english/credit-cards/welcome-offers/tnc/"
      },
      {
        "label": "Prestige 禮遇條款",
        "url": "https://www.citibank.com.hk/english/credit-cards/tnc/index.html"
      }
    ]
  },
  "dbs-black": {
    "url": "https://www.dbs.com.hk/personal-zh/credit-cards/credit-cards/black-mc",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official-current-welcome-model-conflict",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www.dbs.com.hk/personal-zh/credit-cards/credit-cards/black-mc"
      },
      {
        "label": "官方 KFS／收費概要",
        "url": "https://www.dbs.com.hk/personal-zh/credit-cards/key-statement-tnc.htm"
      },
      {
        "label": "DBS$ 獎賞條款",
        "url": "https://www.dbs.com.hk/iwov-resources/pdf/creditcards/DBS-rewards-master-tnc-201709.pdf"
      },
      {
        "label": "上一期迎新條款（已於 2026-07-06 到期）",
        "url": "https://www.dbs.com.hk/iwov-resources/pdf/creditcards/welcome-tnc-zh26Q2.pdf"
      },
      {
        "label": "現行 Q3 迎新條款（2026-07-07 至 10-05）",
        "url": "https://www.dbs.com.hk/iwov-resources/pdf/creditcards/welcome-tnc-zh26Q3.pdf"
      },
      {
        "label": "2026 海外簽賬 HK$2/里推廣",
        "url": "https://www.dbs.com.hk/personal-zh/promotion/black-mc-cvp"
      }
    ]
  },
  "amex-explorer": {
    "url": "https://www.americanexpress.com/hk/en/credit-cards/explorer-credit-card/",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www.americanexpress.com/hk/en/credit-cards/explorer-credit-card/"
      },
      {
        "label": "官方 KFS／收費概要",
        "url": "https://www.americanexpress.com/content/dam/amex/hk/en/staticassets/pdf/cardmember-agreement-and-fees-and-charges/Explorer_KFS_FnC_ENG.pdf"
      },
      {
        "label": "官方迎新條款",
        "url": "https://www.americanexpress.com/content/dam/amex/hk/en/campaigns/explorer-credit-card/Explorer_BAUWelcomeOffer_TnC_EN.pdf"
      }
    ]
  },
  "dahsing-ba": {
    "url": "https://www.dahsing.com/html/en/credit_card/card_products/co_brand/british_airway_card.html",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www.dahsing.com/html/en/credit_card/card_products/co_brand/british_airway_card.html"
      },
      {
        "label": "官方 KFS／收費概要",
        "url": "https://www.dahsing.com/pdf/credit_card/credit_card_kfs_en.pdf"
      },
      {
        "label": "英航卡完整條款／迎新細則",
        "url": "https://www.dahsing.com/pdf/credit_card/cc_bacard_tnc_en.pdf"
      }
    ]
  },
  "hsbc-visasig": {
    "url": "https://www.hsbc.com.hk/credit-cards/products/visa-signature/",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official-partial-model",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www.hsbc.com.hk/credit-cards/products/visa-signature/"
      },
      {
        "label": "官方 KFS／收費概要",
        "url": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/key-fact-statement.pdf"
      },
      {
        "label": "Visa Signature 重要條款索引",
        "url": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/visa-signature/important-information.pdf"
      },
      {
        "label": "官方迎新條款",
        "url": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf"
      },
      {
        "label": "2026 最紅自主條款／上限",
        "url": "https://www.hsbc.com.hk/credit-cards/rewards/your-choice/"
      },
      {
        "label": "官方里數兌換率",
        "url": "https://www.hsbc.com.hk/credit-cards/rewards/mileage-programme/"
      }
    ]
  },
  "amex-platinum": {
    "url": "https://www.americanexpress.com/hk/en/credit-cards/platinum-card/",
    "sourceVerifiedAt": "2026-07-23",
    "sourceStatus": "official",
    "sourceDocs": [
      {
        "label": "官方產品頁",
        "url": "https://www.americanexpress.com/hk/en/credit-cards/platinum-card/"
      },
      {
        "label": "官方 KFS／收費概要",
        "url": "https://www.americanexpress.com/content/dam/amex/hk/en/staticassets/pdf/The_Platinum_KFS.pdf"
      },
      {
        "label": "官方迎新條款",
        "url": "https://www.americanexpress.com/content/dam/amex/hk/en/staticassets/pdf/cards/platinum-card/ThePlatinum_WelcomeOffer_TC_EN.pdf"
      }
    ]
  }
};

  var OFFICIAL_OFFERS = {
    "sc-cathay": [
      {
        "id": "sc-cathay-welcome-2026-05",
        "sourceUrl": "https://av.sc.com/hk/content/docs/hk-cc-tncs-downloadnow.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-05-01",
        "validUntil": "2026-07-30",
        "status": "active-expiring",
        "engineStatus": "legacy-model-conflict",
        "summary": "綠卡累積簽 HK$5,000／40,000／110,000，可得總數 10,000／20,000／40,000 里；官方總數包括正常簽賬里數。"
      },
      {
        "id": "sc-cathay-blind-box-r2",
        "sourceUrl": "https://www.sc.com/hk/credit-cards/cathay/luckydraw-r2/",
        "sourceType": "bank-official-lucky-draw",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-06-25",
        "validUntil": "2026-07-23",
        "status": "active-final-day",
        "engineStatus": "excluded-random",
        "summary": "2,000 至 364,000 里抽獎；唔係保證獎賞。"
      },
      {
        "id": "sc-cathay-referral-club-2026",
        "sourceUrl": "https://av.sc.com/hk/content/docs/hk-cc-cxam-onebank-mgm-tnc.pdf",
        "sourceType": "bank-official-channel",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-02",
        "validUntil": "2027-01-01",
        "status": "active",
        "engineStatus": "excluded-channel",
        "summary": "被推薦新客 10,000 里、現有客 5,000 里；互斥／疊加按官方條款。"
      }
    ],
    "hsbc-everymile": [
      {
        "id": "hsbc-everymile-base-new-2026",
        "sourceUrl": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-03-01",
        "validUntil": "2027-02-28",
        "status": "active",
        "engineStatus": "not-modeled-component",
        "eligibility": {"supplementaryApplicantEligible": false, "cancelledAnyHsbcPrimaryWithinMonths": 12, "customerStatusDeterminedAt": "application-processing", "clawbackIfCancelledWithinMonths": 13},
        "summary": "新客網上申請、60 日內簽 HK$25,000，得 HK$1,250 獎賞錢＝25,000 里。"
      },
      {
        "id": "hsbc-everymile-base-existing-2026",
        "sourceUrl": "https://www.redhotoffers.hsbc.com.hk/en/latest-offers/cvp-offer/",
        "sourceType": "bank-official-campaign-page",
        "verifiedAt": "2026-07-23",
        "validFrom": null,
        "validUntil": null,
        "status": "conflict",
        "engineStatus": "excluded-conflict",
        "conflictSources": [{"url": "https://www.redhotoffers.hsbc.com.hk/en/latest-offers/cvp-offer/", "claim": "現有客 HK$200 獎賞錢"}, {"url": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf", "claim": "EveryMile 現有客欄列 N/A"}],
        "summary": "官方 Red Hot campaign 頁列現有客 HK$200 獎賞錢，但相連 base T&C 表格列 N/A；正面 claim 嘅獨立有效期亦未披露，未自行選數或套用全年日期。"
      },
      {
        "id": "hsbc-everymile-july-flash-2026",
        "sourceUrl": "https://www.redhotoffers.hsbc.com.hk/media/114083727/2026-July-Flash-Offer-TC-EN_final.pdf",
        "sourceType": "bank-official-promotion-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-13",
        "validUntil": "2026-07-31",
        "status": "active-expiring",
        "engineStatus": "current-incremental-component",
        "applicationCodes": [{"value": "HSBCFLASH", "channel": "HSBC official", "status": "verified"}],
        "eligibility": {"supplementaryApplicantEligible": false, "cancelledAnyHsbcPrimaryWithinMonths": 12, "customerStatusDeterminedAt": "application-processing", "clawbackIfCancelledWithinMonths": 13},
        "cashInstalmentComponent": {"customerType": "new", "rewardCashHKD": 200, "miles": 4000, "minimumApprovedAmountHKD": 20000, "minimumTermMonths": 12, "applyWithinDaysOfIssue": 60, "engineEligible": false},
        "summary": "60 日內簽 HK$8,000 並至少一次流動電話付款；EveryMile 新客額外 20,000 里、現有客額外 10,000 里。QR 條件只適用指定銀聯卡。"
      },
      {
        "id": "hsbc-card-lucky-draw-2026",
        "sourceUrl": "https://www.redhotoffers.hsbc.com.hk/en/latest-offers/cvp-offer/",
        "sourceType": "bank-official-lucky-draw",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-06-01",
        "validUntil": "2026-07-31",
        "status": "active-expiring",
        "engineStatus": "excluded-random",
        "summary": "60 日內簽 HK$500；24 個 HK$50,000 獎賞錢大獎，其他合資格參加者保證 HK$50。"
      },
      {
        "id": "hsbc-everymile-overseas-2026-h2",
        "sourceUrl": "https://www.redhotoffers.hsbc.com.hk/en/latest-offers/everymile-spending-offer/",
        "sourceType": "bank-official-spending-promotion",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-01",
        "validUntil": "2026-12-31",
        "status": "active",
        "engineStatus": "excluded-conditional-rate",
        "registration": "HSBC Reward+ app；登記前交易不計",
        "phases": [{"validFrom": "2026-07-01", "validUntil": "2026-09-30", "minimumOverseasSpendHKD": 12000, "maxExtraRewardCashHKD": 225}, {"validFrom": "2026-10-01", "validUntil": "2026-12-31", "minimumOverseasSpendHKD": 12000, "maxExtraRewardCashHKD": 225}],
        "maxExtraRewardCashTotalHKD": 450,
        "summary": "每期合資格海外簽賬滿 HK$12,000，額外 1.5% 獎賞錢，連基本合共低至 HK$2/里；每期額外 RC 上限 HK$225，全期 HK$450。Engine 冇套用此條件式海外率。"
      }
    ],
    "citi-pm": [
      {
        "id": "citi-premiermiles-welcome-2026-q3",
        "sourceUrl": "https://www.citibank.com.hk/english/credit-cards/welcome-offers/tnc/",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-01",
        "validUntil": "2026-09-30",
        "status": "active",
        "engineStatus": "current",
        "summary": "首兩月簽 HK$5,000 得 20,000 里；每月最少一宗合資格交易。"
      }
    ],
    "citi-prestige": [
      {
        "id": "citi-prestige-welcome-2026-q3",
        "sourceUrl": "https://www.citibank.com.hk/english/credit-cards/welcome-offers/tnc/",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-01",
        "validUntil": "2026-09-30",
        "status": "active",
        "engineStatus": "miles-component-only",
        "eligibility": {"newCustomerLookbackMonths": 12, "physicalCardActivationWithinMonths": 1},
        "cashComponent": {"valueHKD": 1200, "spendHKD": 5000, "withinMonths": 2, "minimumEligibleTransactionsEachMonth": 1, "engineEligible": false},
        "summary": "新客交 HK$3,800 年費得 30,000 里；另有首兩月簽 HK$5,000、每月最少一宗合資格交易得 HK$1,200 現金回贈。須一個月內啟動實體卡；現金 component 未入 Engine。"
      }
    ],
    "dbs-black": [
      {
        "id": "dbs-black-welcome-2026-q2",
        "sourceUrl": "https://www.dbs.com.hk/iwov-resources/pdf/creditcards/welcome-tnc-zh26Q2.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-04-29",
        "validUntil": "2026-07-06",
        "status": "historical",
        "engineStatus": "historical",
        "summary": "上一期：HK$8,000／20,000／60,000 對應總里數 8,000／12,000／30,000。"
      },
      {
        "id": "dbs-black-welcome-2026-q3",
        "sourceUrl": "https://www.dbs.com.hk/iwov-resources/pdf/creditcards/welcome-tnc-zh26Q3.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-07",
        "validUntil": "2026-10-05",
        "status": "active",
        "engineStatus": "excluded-model-conflict",
        "eligibility": {"newCustomerLookbackMonths": 12, "customerStatusDeterminedAt": "application-processing", "multipleCardsInOneApplication": "first-selected-new-customer-subsequent-existing-customer"},
        "newCustomerComponents": {"milesChoice": {"tiers": [{"spendHKD": 8000, "totalMiles": 8000}, {"spendHKD": 20000, "totalMiles": 12000}, {"spendHKD": 60000, "totalMiles": 30000}], "includesBasicDbsRewards": true}, "giftAlternative": {"label": "DAYCROWN 28 吋前揭式＋中開行李箱", "minimumSpendHKD": 8000}, "flexiShopping": {"miles": 2000, "dbsDollar": 96, "independentOfSpendTier": true, "applyWithinMonthsOfIssue": 3}},
        "existingCustomerComponent": {"type": "instant-offset", "valueHKD": 50, "confirmPhysicalCardWithinMonths": 3, "singleRetailSpendHKD": 200, "status": "current"},
        "summary": "Q3 新客可揀三級總里數或簽 HK$8,000 換 DAYCROWN 行李箱；另成功做一次 Flexi Shopping 可獨立得 2,000 里。現有客確認實體卡並單一簽 HK$200 可得 HK$50 一扣即享。三級總數包括 basic DBS$，故迎新暫不計入 Result。"
      },
      {
        "id": "dbs-black-overseas-2026",
        "sourceUrl": "https://www.dbs.com.hk/personal-zh/promotion/black-mc-cvp",
        "sourceType": "bank-official-spending-promotion",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-01-01",
        "validUntil": "2026-12-31",
        "status": "active",
        "engineStatus": "excluded-conditional-rate",
        "registration": "DBS Card+ app；登記翌日起交易先計",
        "minimumMonthlyEligibleRetailSpendHKD": 20000,
        "maxExtraDbsDollarMonthly": 240,
        "maxExtraDbsDollarTotal": 2880,
        "summary": "每月總合資格零售簽賬達 HK$20,000，當月合資格海外外幣簽賬連基本合共低至 HK$2/里；額外 DBS$ 每月上限 240、全期 2,880。Engine 繼續用基本 HK$4/里。"
      }
    ],
    "amex-explorer": [
      {
        "id": "amex-explorer-welcome-2026-summer",
        "sourceUrl": "https://www.americanexpress.com/content/dam/amex/hk/en/campaigns/explorer-credit-card/Explorer_BAUWelcomeOffer_TnC_EN.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-02",
        "validUntil": "2026-08-31",
        "status": "active",
        "engineStatus": "legacy-model-conflict",
        "octopusTopupBonus": {"statementCreditHKD": 50, "singleTopupHKD": 600, "submitDocumentsWithinDays": 7, "withinMonthsOfApproval": 3, "engineEligible": false},
        "summary": "HK$8,000 本地簽賬→8,000里；HK$30,000 marketed total 26,000里要成功登記 Local Spend Bonus，而且 HK$30,000 入面至少 HK$15,000 係合資格本地港幣簽賬。總數包含簽賬獎賞，現有 Engine 保留 legacy model conflict。"
      }
    ],
    "dahsing-ba": [
      {
        "id": "dahsing-ba-welcome-2025-2026",
        "sourceUrl": "https://www.dahsing.com/pdf/credit_card/cc_bacard_tnc_en.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2025-11-23",
        "validUntil": "2026-12-31",
        "status": "active",
        "engineStatus": "current",
        "components": [{"type": "welcome-avios", "spendHKD": 12000, "withinMonths": 3, "extraAvios": 10000}, {"type": "overseas-rate", "rateHKDPerAvios": 2, "withinMonths": 6, "monthlyEligibleSpendCapHKD": 10000, "monthlyAviosCap": 5000, "engineEligible": false}, {"type": "new-banking-account", "extraAvios": 5000, "openOnlineWithinMonths": 3, "engineEligible": false}],
        "summary": "首 3 個月簽 HK$12,000 得額外 10,000 Avios。"
      }
    ],
    "hsbc-visasig": [
      {
        "id": "hsbc-visasig-base-2026",
        "sourceUrl": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-03-01",
        "validUntil": "2027-02-28",
        "status": "active-reference-only",
        "engineStatus": "reference-only",
        "summary": "新客網上 HK$8,000→HK$800 獎賞錢；現有客 HK$200。完整模型未完成，仍不進推薦。"
      },
      {
        "id": "hsbc-visasig-july-flash-2026",
        "sourceUrl": "https://www.redhotoffers.hsbc.com.hk/media/114083727/2026-July-Flash-Offer-TC-EN_final.pdf",
        "sourceType": "bank-official-promotion-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-13",
        "validUntil": "2026-07-31",
        "status": "active-reference-only",
        "engineStatus": "reference-only",
        "applicationCodes": [{"value": "HSBCFLASH", "channel": "HSBC official", "status": "verified"}],
        "cashInstalmentComponent": {"customerType": "new", "rewardCashHKD": 200, "minimumApprovedAmountHKD": 20000, "minimumTermMonths": 12, "applyWithinDaysOfIssue": 60, "engineEligible": false},
        "summary": "60 日內簽 HK$8,000、輸入合資格碼並至少一次流動電話付款；新客額外 HK$1,000 獎賞錢、現有客額外 HK$500。QR 條件只適用指定銀聯卡；Visa Signature 仍不進推薦。"
      }
    ],
    "amex-platinum": [
      {
        "id": "amex-platinum-new-2026-july",
        "sourceUrl": "https://www.americanexpress.com/content/dam/amex/hk/en/staticassets/pdf/cards/platinum-card/ThePlatinum_WelcomeOffer_TC_EN.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-15",
        "validUntil": "2026-07-29",
        "status": "active-expiring",
        "engineStatus": "current-high-fee-gated",
        "cashComponents": [{"type": "online-application-first-spend", "statementCreditHKD": 1000, "submitDocumentsWithinBusinessDays": 7, "withinMonthsOfApproval": 3, "engineEligible": false}, {"type": "mobile-octopus-topup", "statementCreditHKD": 50, "singleTopupHKD": 600, "withinMonthsOfApproval": 3, "engineEligible": false}],
        "summary": "新客 HK$15,000→22,222里、HK$50,000→55,556里。"
      },
      {
        "id": "amex-platinum-existing-2026",
        "sourceUrl": "https://www.americanexpress.com/content/dam/amex/hk/en/staticassets/pdf/cards/platinum-card/ThePlatinum_WelcomeOffer_TC_EN.pdf",
        "sourceType": "bank-official-welcome-terms",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-02-26",
        "validUntil": "2026-07-29",
        "status": "active-expiring",
        "engineStatus": "current-alt-tiers",
        "summary": "合資格現有 AE 會員 HK$15,000→45,000里。"
      }
    ]
  };

  function classifyOfficialDocument(label) {
    if (/KFS|收費/.test(label)) return 'official-kfs';
    if (/迎新/.test(label)) return 'official-welcome-terms';
    if (/獎賞|里數|最紅自主/.test(label)) return 'official-rewards-terms';
    if (/條款|細則|重要條款/.test(label)) return 'official-terms';
    return 'official-product-page';
  }

  Object.keys(CARD_SOURCES).forEach(function(cardId){
    var source = CARD_SOURCES[cardId];
    source.sourceType = 'bank-official';
    source.sourceDocs = (source.sourceDocs || []).map(function(doc){
      return {
        label: doc.label,
        url: doc.url,
        sourceType: classifyOfficialDocument(doc.label)
      };
    });
  });

  return {
    schemaVersion: 2,
    market: 'HK',
    DATA_AS_OF: DATA_AS_OF,
    CARD_SOURCES: CARD_SOURCES,
    OFFICIAL_OFFERS: OFFICIAL_OFFERS
  };
});
