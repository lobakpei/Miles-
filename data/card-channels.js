(function(root, factory){
  'use strict';
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AcreMilesCardChannels = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';

  /*
   * Channel records only prove the channel's own application route, reward,
   * promo code and claim mechanics. issuerOfferClaim is informational and must
   * never overwrite bank-official card rules or feed the optimizer.
   */
  var CHANNEL_OFFERS = {
    "sc-cathay": [
      {
        "id": "sc-cathay-flyformiles-2026-07b",
        "platform": "小斯 flyformiles",
        "bonus": "指定碼 HKRSIUC11000；新舊客可選 HK$500 Apple Store 禮品卡或超市禮券。完整領獎流程仍待平台頁提供可核對條款。",
        "expiry": "2026-07-31",
        "active": true,
        "verified": true,
        "link": "https://flyformiles.hk/41446/%E6%B8%A3%E6%89%93%E5%9C%8B%E6%B3%B0%E8%90%AC%E4%BA%8B%E9%81%94%E5%8D%A1",
        "sourceUrl": "https://flyformiles.hk/41446/%E6%B8%A3%E6%89%93%E5%9C%8B%E6%B3%B0%E8%90%AC%E4%BA%8B%E9%81%94%E5%8D%A1",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-15",
        "validUntil": "2026-07-31",
        "status": "active-partial",
        "verificationStatus": "partial",
        "promoCode": {"value": "HKRSIUC11000", "status": "verified"},
        "fixedBonus": {"type": "choice", "valueHKD": 500, "options": ["Apple Store 禮品卡", "超市禮券"], "status": "verified"},
        "issuerOfferClaim": null,
        "randomBonus": null,
        "conditions": ["須經指定連結及推廣碼", "完整領獎／追蹤 mechanics：unknown"],
        "stackable": null
      },
      {
        "id": "sc-cathay-mrmiles-2026-07",
        "platform": "里先生",
        "bonus": "指定碼 HKRMRM11000；平台條件式賞最高 88 MM Credit（38 只限里先生新會員；50 要成功批卡及填表）。盲盒及銀行里數唔係平台保證獎賞。",
        "expiry": "2026-07-23",
        "active": true,
        "verified": true,
        "link": "https://www.mrmiles.hk/cathay-card/",
        "sourceUrl": "https://www.mrmiles.hk/cathay-card/",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-01",
        "validUntil": "2026-07-23",
        "status": "active-final-day",
        "verificationStatus": "verified",
        "promoCode": {"value": "HKRMRM11000", "status": "verified"},
        "fixedBonus": {"type": "platform-credit-components", "maxAmount": 88, "unit": "MM Credit", "components": [{"amount": 38, "eligibility": "只限里先生新會員"}, {"amount": 50, "eligibility": "成功批卡並按平台要求填表"}], "status": "verified-conditional"},
        "issuerOfferClaim": {"newCustomerMiles": 11000, "existingCustomerMiles": 5000, "status": "channel-claim-only"},
        "randomBonus": {"rangeMiles": [2000, 364000], "guaranteed": false, "provider": "issuer", "validFrom": "2026-06-25", "validUntil": "2026-07-23", "approvalDeadline": "2026-08-13", "status": "issuer-lucky-draw-active-final-day"},
        "conditions": ["須經指定連結及推廣碼", "38 MM Credit 只限里先生新會員", "50 MM Credit 要成功批卡後按平台要求填表"],
        "stackable": null
      },
      {
        "id": "sc-cathay-moneysmart-2026-07",
        "platform": "MoneySmart",
        "bonus": "全新渣打信用卡客戶免簽賬揀一份平台禮品：HK$900 Apple Store／百佳／HKTVmall 電子券，或平台標示價值 HK$3,980／2,100／1,970 嘅指定實物。銀行盲盒只到 7 月 23 日，唔係平台固定賞。",
        "expiry": "2026-07-31",
        "active": true,
        "verified": true,
        "link": "https://www.moneysmart.hk/zh-hk/credit-cards/standard-chartered-cathay-mastercard-ms",
        "sourceUrl": "https://www.moneysmart.hk/zh-hk/credit-cards/standard-chartered-cathay-mastercard-ms",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": null,
        "validUntil": "2026-07-31",
        "status": "active-partial",
        "verificationStatus": "partial",
        "promoCode": null,
        "fixedBonus": {"type": "choice", "maxClaimedValueHKD": 3980, "options": [{"label": "New Smile LED 第五代增量版納米護牙美白組合", "claimedValueHKD": 3980}, {"label": "LOJEL Alto 29 吋超輕量行李箱（黑色）", "claimedValueHKD": 2100}, {"label": "Medicube AGE-R 美容套裝", "claimedValueHKD": 1970}, {"label": "Apple Store 禮品卡", "faceValueHKD": 900}, {"label": "百佳電子禮券", "faceValueHKD": 900}, {"label": "HKTVmall 電子禮券", "faceValueHKD": 900}], "status": "verified-channel-claimed-values"},
        "issuerOfferClaim": null,
        "randomBonus": {"rangeMiles": [2000, 364000], "guaranteed": false, "provider": "issuer", "validFrom": "2026-06-25", "validUntil": "2026-07-23", "approvalDeadline": "2026-08-13", "status": "issuer-lucky-draw-active-final-day"},
        "conditions": ["只限全新渣打信用卡客戶", "須經 MoneySmart 指定連結", "登入 MoneySmart 並提交換領表格", "獎賞預計於推廣期後六個月內發出", "指定電子券收到換領電郵後十四日內兌換", "渠道頁未列明精確 validFrom"],
        "stackable": null
      },
      {
        "id": "sc-cathay-moneyhero-current-unknown",
        "platform": "MoneyHero",
        "bonus": "渠道頁顯示多款『高達』禮品，但本輪未取得足夠精確有效期及換領 T&C；暫不當現行優惠展示。",
        "expiry": null,
        "active": false,
        "verified": false,
        "link": "https://www.moneyhero.com.hk/zh/credit-card/products/standard-chartered-cathay-mastercard",
        "sourceUrl": "https://www.moneyhero.com.hk/zh/credit-card/products/standard-chartered-cathay-mastercard",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": null,
        "validUntil": null,
        "status": "unknown",
        "verificationStatus": "unknown",
        "promoCode": null,
        "fixedBonus": null,
        "issuerOfferClaim": null,
        "randomBonus": null,
        "conditions": ["精確平台期／換領 T&C：unknown"],
        "stackable": null
      },
      {
        "id": "sc-cathay-official-referral-2026",
        "platform": "渣打 Referral Club（官方）",
        "bonus": "被推薦新客 10,000 里、現有客 5,000 里；新客 base welcome 可疊，其他互斥情況按官方條款。",
        "expiry": "2027-01-01",
        "active": true,
        "verified": true,
        "link": "https://av.sc.com/hk/content/docs/hk-cc-cxam-onebank-mgm-tnc.pdf",
        "sourceUrl": "https://av.sc.com/hk/content/docs/hk-cc-cxam-onebank-mgm-tnc.pdf",
        "sourceType": "bank-official-channel",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-02",
        "validUntil": "2027-01-01",
        "status": "active",
        "verificationStatus": "verified",
        "promoCode": null,
        "fixedBonus": {"type": "miles", "newCustomerMiles": 10000, "existingCustomerMiles": 5000, "status": "verified"},
        "issuerOfferClaim": null,
        "randomBonus": null,
        "conditions": ["須經官方 referral 流程", "互斥／疊加按官方 T&C"],
        "stackable": "conditional"
      }
    ],
    "hsbc-everymile": [
      {
        "id": "hsbc-everymile-mrmiles-flash-2026-07",
        "platform": "里先生",
        "bonus": "優惠碼 MILEFLASH；平台條件式賞最高 88 MM Credit（38 只限新會員＋50 成功批卡填表）及 Gold 會員。49,000 里另要 base、flash 同分期三個銀行 component，唔係平台固定 bonus。",
        "expiry": "2026-07-31",
        "active": true,
        "verified": true,
        "link": "https://www.mrmiles.hk/hsbc-everymile/",
        "sourceUrl": "https://www.mrmiles.hk/hsbc-everymile/",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-13",
        "validUntil": "2026-07-31",
        "status": "active-expiring",
        "verificationStatus": "verified",
        "promoCode": {"value": "MILEFLASH", "status": "verified"},
        "fixedBonus": {"type": "platform-credit-components", "maxAmount": 88, "unit": "MM Credit", "components": [{"amount": 38, "eligibility": "只限里先生新會員"}, {"amount": 50, "eligibility": "成功批卡並按平台要求填表"}], "status": "verified-conditional"},
        "membershipBenefit": {"type": "platform-membership", "tier": "Gold", "status": "verified-conditional"},
        "issuerOfferClaim": {"headlineRewardCashHKD": 2450, "headlineMiles": 49000, "customerType": "new", "components": [{"type": "base-welcome", "rewardCashHKD": 1250, "miles": 25000, "spendHKD": 25000, "withinDaysOfIssue": 60, "validFrom": "2026-03-01", "validUntil": "2027-02-28"}, {"type": "july-flash", "rewardCashHKD": 1000, "miles": 20000, "spendHKD": 8000, "withinDaysOfIssue": 60, "requiresMobilePayment": true, "validFrom": "2026-07-13", "validUntil": "2026-07-31"}, {"type": "cash-instalment", "rewardCashHKD": 200, "miles": 4000, "financingHKD": 20000, "minimumTermMonths": 12, "eligibility": "new-customer"}], "existingCustomerClaim": {"headlineRewardCashHKD": 700, "headlineMiles": 14000, "components": [{"type": "base-welcome", "rewardCashHKD": 200, "miles": 4000}, {"type": "july-flash", "rewardCashHKD": 500, "miles": 10000}], "status": "channel-claim-official-base-conflict"}, "status": "channel-claim-only"},
        "randomBonus": null,
        "conditions": ["49,000 里 headline 要同時符合 base HK$25,000、flash HK$8,000＋一次流動電話付款，以及 HK$20,000／12 個月分期三組條件", "38 MM Credit 只限里先生新會員", "50 MM Credit 及 Gold 要成功批卡後按平台要求填表"],
        "stackable": "conditional"
      },
      {
        "id": "hsbc-everymile-moneyhero-flash-2026-07",
        "platform": "MoneyHero",
        "bonus": "渠道頁列最高 HK$2,450 獎賞錢／49,000 里及 7 月 31 日截止；未發現 MoneyHero 自己另派固定禮品。HEROFLASH 細節屬 field-level partial。",
        "expiry": "2026-07-31",
        "active": true,
        "verified": true,
        "link": "https://www.moneyhero.com.hk/zh/credit-card/blog/%E8%A7%A3%E6%A7%8B-%E6%BB%99%E8%B1%90everymile%E4%BF%A1%E7%94%A8%E5%8D%A1",
        "sourceUrl": "https://www.moneyhero.com.hk/zh/credit-card/blog/%E8%A7%A3%E6%A7%8B-%E6%BB%99%E8%B1%90everymile%E4%BF%A1%E7%94%A8%E5%8D%A1",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-13",
        "validUntil": "2026-07-31",
        "status": "active-partial",
        "verificationStatus": "partial",
        "promoCode": {"value": "HEROFLASH", "status": "partial"},
        "fixedBonus": null,
        "issuerOfferClaim": {"headlineRewardCashHKD": 2450, "headlineMiles": 49000, "customerType": "new", "components": [{"type": "base-welcome", "rewardCashHKD": 1250, "miles": 25000, "spendHKD": 25000, "withinDaysOfIssue": 60, "validFrom": "2026-03-01", "validUntil": "2027-02-28"}, {"type": "july-flash", "rewardCashHKD": 1000, "miles": 20000, "spendHKD": 8000, "withinDaysOfIssue": 60, "requiresMobilePayment": true, "validFrom": "2026-07-13", "validUntil": "2026-07-31"}, {"type": "cash-instalment", "rewardCashHKD": 200, "miles": 4000, "financingHKD": 20000, "minimumTermMonths": 12, "eligibility": "new-customer"}], "status": "channel-claim-only-partial-code"},
        "randomBonus": null,
        "conditions": ["49,000 里 headline 要同時符合 base HK$25,000、flash HK$8,000＋一次流動電話付款，以及 HK$20,000／12 個月分期三組條件", "HEROFLASH code 細節屬 field-level partial"],
        "stackable": "conditional"
      },
      {
        "id": "hsbc-everymile-moneysmart-flash-2026-07",
        "platform": "MoneySmart",
        "bonus": "優惠碼 MARTFLASH；渠道頁列最高 HK$2,925 獎賞錢／58,500 里，當中包括 base、flash、分期及簽賬回報，唔係單一固定平台 bonus。",
        "expiry": "2026-07-31",
        "active": true,
        "verified": true,
        "link": "https://www.moneysmart.hk/zh-hk/credit-cards/hsbc-everymile-credit-card",
        "sourceUrl": "https://www.moneysmart.hk/zh-hk/credit-cards/hsbc-everymile-credit-card",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-13",
        "validUntil": "2026-07-31",
        "status": "active-expiring",
        "verificationStatus": "verified",
        "promoCode": {"value": "MARTFLASH", "status": "verified"},
        "fixedBonus": null,
        "issuerOfferClaim": {"headlineRewardCashHKD": 2925, "headlineMiles": 58500, "customerType": "new", "deterministic": false, "components": [{"type": "base-welcome", "rewardCashHKD": 1250, "miles": 25000, "spendHKD": 25000, "withinDaysOfIssue": 60, "validFrom": "2026-03-01", "validUntil": "2027-02-28"}, {"type": "july-flash", "rewardCashHKD": 1000, "miles": 20000, "spendHKD": 8000, "withinDaysOfIssue": 60, "requiresMobilePayment": true, "validFrom": "2026-07-13", "validUntil": "2026-07-31"}, {"type": "cash-instalment", "rewardCashHKD": 200, "miles": 4000, "financingHKD": 20000, "minimumTermMonths": 12, "eligibility": "new-customer"}], "derivedUnexplainedResidual": {"rewardCashHKD": 475, "miles": 9500, "calculation": "2925-1250-1000-200", "status": "marketing-headline-residual-formula-not-disclosed"}, "status": "channel-claim-only"},
        "randomBonus": null,
        "conditions": ["base 要發卡後 60 日累積簽 HK$25,000", "flash 要 HK$8,000 並至少一次流動電話付款", "HK$200 component 另須 HK$20,000／12 個月合資格分期", "headline 餘下 HK$475 RC 係渠道所稱簽賬回報，視實際簽賬類別，唔保證"],
        "stackable": "conditional"
      }
    ],
    "dbs-black": [
      {
        "id": "dbs-black-moneyhero-cardplus-2026-q3",
        "platform": "MoneyHero",
        "bonus": "MoneyHero 頁提供 DBS Card+ 申請路徑，並轉述發卡行現有客 HK$50「一扣即享」迎新；呢 HK$50 由 DBS 提供，唔係 MoneyHero 平台額外賞。",
        "expiry": "2026-10-05",
        "active": true,
        "verified": true,
        "link": "https://www.moneyhero.com.hk/zh/credit-card/products/dbs-black-world-mastercard",
        "sourceUrl": "https://www.moneyhero.com.hk/zh/credit-card/products/dbs-black-world-mastercard",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-07",
        "validUntil": "2026-10-05",
        "status": "active",
        "verificationStatus": "verified",
        "promoCode": null,
        "fixedBonus": null,
        "issuerOfferClaim": {"type": "issuer-existing-customer-welcome", "valueHKD": 50, "label": "一扣即享", "customerType": "existing", "confirmPhysicalCardWithinMonths": 3, "singleRetailSpendHKD": 200, "officialSourceUrl": "https://www.dbs.com.hk/iwov-resources/pdf/creditcards/welcome-tnc-zh26Q3.pdf", "status": "official-q3-controls"},
        "randomBonus": null,
        "conditions": ["由 MoneyHero 手機版指定頁進入 DBS Card+ 申請路徑", "HK$50 只屬 DBS 現有客迎新，須三個月內確認實體新卡", "須以實體新卡完成單一 HK$200 或以上零售交易；官方 Q3 條款優先"],
        "stackable": null
      }
    ],
    "amex-explorer": [
      {
        "id": "amex-explorer-mrmiles-2026-07",
        "platform": "里先生",
        "bonus": "平台條件式賞最高 88 MM Credit（38 只限新會員＋50 成功批卡填表）；HK$50 手機八達通係渠道所述發卡行獎賞，唔係平台固定送。",
        "expiry": "2026-07-31",
        "active": true,
        "verified": true,
        "link": "https://www.mrmiles.hk/ae-explorer/",
        "sourceUrl": "https://www.mrmiles.hk/ae-explorer/",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-02",
        "validUntil": "2026-07-31",
        "status": "active-expiring",
        "verificationStatus": "verified",
        "promoCode": null,
        "fixedBonus": {"type": "platform-credit-components", "maxAmount": 88, "unit": "MM Credit", "components": [{"amount": 38, "eligibility": "只限里先生新會員"}, {"amount": 50, "eligibility": "成功批卡並按平台要求填表"}], "status": "verified-conditional"},
        "issuerOfferClaim": {"mobileOctopusRewardHKD": 50, "singleTopUpHKD": 600, "status": "channel-claim-only"},
        "randomBonus": null,
        "conditions": ["經指定連結", "38 MM Credit 只限里先生新會員", "50 MM Credit 要成功批卡後填 exp-form"],
        "stackable": null
      },
      {
        "id": "amex-explorer-flyformiles-2026-07",
        "platform": "小斯 flyformiles",
        "bonus": "渠道頁列 issuer-linked 26,000 里＋HK$50 手機八達通獎賞；唔當成平台固定額外 bonus，完整 claim mechanics 標 partial。",
        "expiry": "2026-07-31",
        "active": true,
        "verified": true,
        "link": "https://flyformiles.hk/34769",
        "sourceUrl": "https://flyformiles.hk/34769",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-02",
        "validUntil": "2026-07-31",
        "status": "active-partial",
        "verificationStatus": "partial",
        "promoCode": null,
        "fixedBonus": null,
        "issuerOfferClaim": {"headlineMiles": 26000, "mobileOctopusRewardHKD": 50, "status": "channel-claim-only"},
        "randomBonus": null,
        "conditions": ["經指定新客連結", "完整 HK$600／claim mechanics：partial"],
        "stackable": null
      },
      {
        "id": "amex-explorer-moneysmart-current-unknown",
        "platform": "MoneySmart",
        "bonus": "渠道頁有 issuer-linked offer，但精確渠道有效期及 claim T&C 未完整取得；暫不展示。",
        "expiry": null,
        "active": false,
        "verified": false,
        "link": "https://www.moneysmart.hk/zh-hk/credit-cards/american-express-explorer-credit-card",
        "sourceUrl": "https://www.moneysmart.hk/zh-hk/credit-cards/american-express-explorer-credit-card",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": null,
        "validUntil": null,
        "status": "unknown",
        "verificationStatus": "unknown",
        "promoCode": null,
        "fixedBonus": null,
        "issuerOfferClaim": null,
        "randomBonus": null,
        "conditions": ["精確渠道有效期／claim T&C：unknown"],
        "stackable": null
      },
      {
        "id": "amex-explorer-moneyhero-current-unknown",
        "platform": "MoneyHero",
        "bonus": "渠道頁有 issuer-linked offer，但精確渠道有效期及 claim T&C 未完整取得；暫不展示。",
        "expiry": null,
        "active": false,
        "verified": false,
        "link": "https://www.moneyhero.com.hk/zh/credit-card/products/american-express-explorer-credit-card",
        "sourceUrl": "https://www.moneyhero.com.hk/zh/credit-card/products/american-express-explorer-credit-card",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": null,
        "validUntil": null,
        "status": "unknown",
        "verificationStatus": "unknown",
        "promoCode": null,
        "fixedBonus": null,
        "issuerOfferClaim": null,
        "randomBonus": null,
        "conditions": ["精確渠道有效期／claim T&C：unknown"],
        "stackable": null
      }
    ],
    "amex-platinum": [
      {
        "id": "amex-platinum-mrmiles-historical-2000",
        "platform": "里先生",
        "bonus": "歷史記錄：舊頁曾列額外 2,000 里；無精確有效期，唔當現行。",
        "expiry": null,
        "active": false,
        "verified": false,
        "link": "https://www.mrmiles.hk/ae-platinum-card-centurion-lounge/",
        "sourceUrl": "https://www.mrmiles.hk/ae-platinum-card-centurion-lounge/",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": null,
        "validUntil": null,
        "status": "historical-unverified",
        "verificationStatus": "historical-unverified",
        "promoCode": null,
        "fixedBonus": {"type": "miles", "miles": 2000, "status": "historical-unverified"},
        "issuerOfferClaim": null,
        "randomBonus": null,
        "conditions": ["原有有效期：unknown"],
        "stackable": null
      },
      {
        "id": "amex-platinum-moneyhero-historical-300",
        "platform": "MoneyHero",
        "bonus": "歷史記錄：舊頁曾列 HK$300 Apple 禮券；無精確有效期，唔當現行。",
        "expiry": null,
        "active": false,
        "verified": false,
        "link": "https://www.moneyhero.com.hk/",
        "sourceUrl": "https://www.moneyhero.com.hk/",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": null,
        "validUntil": null,
        "status": "historical-unverified",
        "verificationStatus": "historical-unverified",
        "promoCode": null,
        "fixedBonus": {"type": "gift-card", "valueHKD": 300, "status": "historical-unverified"},
        "issuerOfferClaim": null,
        "randomBonus": null,
        "conditions": ["原有有效期：unknown"],
        "stackable": null
      },
      {
        "id": "amex-platinum-mrmiles-2026-07",
        "platform": "里先生",
        "bonus": "平台條件式賞最高 88 MM Credit（38 只限新會員＋50 成功批卡填 ap-form）。渠道頁把申請期寫至 7 月 31 日，但發卡行迎新官方死線係 7 月 29 日；銀行規則以官方為準。",
        "expiry": "2026-07-31",
        "active": true,
        "verified": true,
        "link": "https://www.mrmiles.hk/ae-platinum-card-centurion-lounge/",
        "sourceUrl": "https://www.mrmiles.hk/ae-platinum-card-centurion-lounge/",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-15",
        "validUntil": "2026-07-31",
        "status": "active-expiring",
        "verificationStatus": "verified",
        "promoCode": null,
        "fixedBonus": {"type": "platform-credit-components", "maxAmount": 88, "unit": "MM Credit", "validFrom": "2026-07-15", "validUntil": "2026-07-31", "components": [{"amount": 38, "eligibility": "只限里先生新會員"}, {"amount": 50, "eligibility": "成功批卡並按平台要求填表"}], "status": "verified-conditional"},
        "issuerOfferClaim": {"newCustomerHeadlineMiles": 55555, "existingCustomerHeadlineMiles": 46667, "validFrom": "2026-07-15", "validUntil": "2026-07-29", "officialCutoffOverridesChannelHeadline": true, "newCustomer": {"tiers": [{"spendHKD": 15000, "points": 400000, "milesApprox": 22222}, {"spendHKD": 50000, "totalPoints": 1000000, "milesApprox": 55556}]}, "existingCustomer": {"welcomePoints": 810000, "welcomeMiles": 45000, "basicSpendPointsIncludedInChannelHeadline": 30000, "basicSpendMilesApprox": 1667, "channelHeadlineMiles": 46667}, "status": "channel-date-and-headline-conflict-official-controls"},
        "randomBonus": null,
        "conditions": ["經指定連結", "38 MM Credit 只限里先生新會員", "50 MM Credit 要成功批卡後填 ap-form", "平台渠道期至 7 月 31 日唔代表官方迎新延長；issuer welcome 以 7 月 29 日官方 T&C 為準"],
        "stackable": null
      },
      {
        "id": "amex-platinum-moneyhero-2026-07",
        "platform": "MoneyHero",
        "bonus": "7 月 29 日 18:00 前申請，可揀 HK$6,000 Apple Store 禮品卡或 HK$6,000 FPS 現金；明文不可同發卡行或其他機構迎新疊加。",
        "expiry": "2026-07-29",
        "active": true,
        "verified": true,
        "link": "https://www.moneyhero.com.hk/zh/credit-card/products/the-platinum-card",
        "sourceUrl": "https://www.moneyhero.com.hk/zh/credit-card/products/the-platinum-card",
        "sourceType": "channel-offer-page",
        "verifiedAt": "2026-07-23",
        "validFrom": "2026-07-14",
        "validFromTime": "12:00",
        "startsAt": "2026-07-14T12:00:00+08:00",
        "validUntil": "2026-07-29",
        "validUntilTime": "18:00",
        "expiresAt": "2026-07-29T18:00:00+08:00",
        "status": "active-expiring",
        "verificationStatus": "verified",
        "promoCode": null,
        "fixedBonus": {"type": "choice", "valueHKD": 6000, "options": ["Apple Store 禮品卡", "FPS 現金"], "status": "verified"},
        "issuerOfferClaim": null,
        "randomBonus": null,
        "conditions": ["經指定橙色連結", "收到 email 後 7 日內交表", "2026-08-31 前批卡", "首 3 個月簽 HK$60,000", "繳付 HK$9,500 年費"],
        "stackable": false
      }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getOffers() {
    return clone(CHANNEL_OFFERS);
  }

  function hongKongDate(value) {
    var date = value instanceof Date ? value : new Date(value == null ? Date.now() : value);
    if (!isFinite(date.getTime())) return null;
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    var fields = {};
    parts.forEach(function(part){ if (part.type !== 'literal') fields[part.type] = part.value; });
    return fields.year + '-' + fields.month + '-' + fields.day;
  }

  function isPeriodCurrent(period, value) {
    if (!period || !period.validUntil) return false;
    var date = value instanceof Date ? value : new Date(value == null ? Date.now() : value);
    if (!isFinite(date.getTime())) return false;
    if (period.startsAt && date.getTime() < Date.parse(period.startsAt)) return false;
    if (period.expiresAt && date.getTime() > Date.parse(period.expiresAt)) return false;
    var today = hongKongDate(date);
    return (!period.validFrom || period.validFrom <= today) && period.validUntil >= today;
  }

  function isPeriodExpired(period, value) {
    if (!period || !period.validUntil) return false;
    var date = value instanceof Date ? value : new Date(value == null ? Date.now() : value);
    if (!isFinite(date.getTime())) return false;
    if (period.expiresAt) return date.getTime() > Date.parse(period.expiresAt);
    return period.validUntil < hongKongDate(date);
  }

  function isOfferCurrent(offer, value) {
    return !!offer && offer.active === true && offer.verified === true && isPeriodCurrent(offer, value);
  }

  function isOfferExpired(offer, value) {
    return isPeriodExpired(offer, value);
  }

  return {
    schemaVersion: 3,
    verifiedAt: '2026-07-23',
    CHANNEL_OFFERS: CHANNEL_OFFERS,
    getOffers: getOffers,
    isPeriodCurrent: isPeriodCurrent,
    isPeriodExpired: isPeriodExpired,
    isOfferCurrent: isOfferCurrent,
    isOfferExpired: isOfferExpired
  };
});
