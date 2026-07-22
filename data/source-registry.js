(function(root, factory){
  'use strict';
  var value = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = value;
  root.ACREMILES_SOURCE_REGISTRY = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';
  return {
  "schemaVersion": 1,
  "DATA_AS_OF": "2026-07-20（9 張卡官方產品頁、KFS／T&C 逐張核對）",
  "modelAssumptions": {
    "applyWeeks": {
      "sourceType": "none",
      "status": "unknown",
      "verifiedAt": null,
      "validFrom": null,
      "validUntil": null,
      "note": "v6.79.0 legacy timeline estimate；唔係銀行承諾，未有官方審批時限證據。Phase 1 純搬遷保留數值，唔升格為官方卡資料。",
      "values": {
        "sc-cathay": 3,
        "hsbc-everymile": 2,
        "citi-pm": 3,
        "citi-prestige": 3,
        "dbs-black": 2,
        "amex-explorer": 2,
        "dahsing-ba": 3,
        "hsbc-visasig": 2,
        "amex-platinum": 2
      }
    },
    "cardSecondMultiplier": {
      "sourceType": "incomplete-official-model",
      "status": "unknown",
      "verifiedAt": null,
      "validFrom": null,
      "validUntil": null,
      "note": "v6.79.0 card-level override；Explorer 0 及 Platinum 0.81 會影響結果，但 Phase 0 已指出資格／窗口未完整官方化。Phase 1A 只搬遷，不改值或公式。",
      "values": {
        "amex-explorer": 0,
        "amex-platinum": 0.81
      }
    },
    "bankSecondCardMultiplier": {
      "sourceType": "none",
      "status": "unknown",
      "verifiedAt": null,
      "validFrom": null,
      "validUntil": null,
      "note": "現行 Engine 市場整理／待官方常數；只記錄 provenance，Phase 1A／1B 不改 Engine 公式。",
      "values": {
        "Citibank": 0,
        "滙豐": 0.25,
        "美國運通": 0.65
      }
    },
    "feeWaiver": {
      "sourceType": "mixed",
      "status": "unknown",
      "verifiedAt": null,
      "validFrom": null,
      "validUntil": null,
      "note": "以下 feeWaivable／豁免實務未有逐欄官方證據；數值會影響 HK$3,000 高年費 gate。Phase 1A 只隔離 provenance，同 runtime 值保持一致。",
      "values": {
        "citi-pm": {
          "feeWaivable": true,
          "waiveNote": "次年打 2860 0360 試 waive（年費 $1,800 待官方收費表）",
          "sourceType": "none",
          "status": "unknown"
        },
        "dbs-black": {
          "feeWaivable": true,
          "waiveNote": "首年免年費（官方產品頁）；次年 HK$3,600（官方KFS），多數要打電話試 waive",
          "sourceType": "mixed",
          "status": "unknown"
        },
        "dahsing-ba": {
          "feeWaivable": true,
          "waiveNote": "首2年免年費（網上），第3年起致電 2828 8168 多數 waive 到；年費 $1,800 官方KFS",
          "sourceType": "mixed",
          "status": "unknown"
        },
        "hsbc-visasig": {
          "feeWaivable": true,
          "waiveNote": "官方資料顯示首兩年免年費；其後年費 HK$2,000，續期前向滙豐確認最新豁免安排",
          "sourceType": "mixed",
          "status": "unknown"
        }
      }
    }
  },
  "promotions": [
    {
      "id": "sc-cathay-bank-code-202607-legacy",
      "cardIds": ["sc-cathay"],
      "scope": "bank-official-claim",
      "summary": "舊 presentation：平台碼申請之銀行加碼 11,000／7,000 里；另開綜合存款戶口存 HK$5,000 再加 10,000／3,000 里",
      "sourceUrl": null,
      "sourceType": "legacy-summary-no-official-url",
      "verifiedAt": "2026-07-16",
      "validFrom": "2026-07-15",
      "validUntil": "2026-07-23",
      "status": "unknown"
    },
    {
      "id": "hsbc-flash-code-202607-legacy",
      "cardIds": ["hsbc-everymile"],
      "scope": "bank-official-claim",
      "summary": "舊 presentation：指定渠道碼、60 日內 HK$8,000 包手機支付；新客額外 HK$1,000 獎賞錢、舊客 HK$500",
      "sourceUrl": "https://www.hsbc.com.hk/content/dam/hsbc/hk/docs/credit-cards/offers/welcome-terms-and-conditions.pdf",
      "sourceType": "legacy-official-document-reference",
      "verifiedAt": "2026-07-16",
      "validFrom": "2026-07-13",
      "validUntil": "2026-07-31",
      "status": "unknown"
    },
    {
      "id": "hsbc-card-draw-202607-legacy",
      "cardIds": ["hsbc-everymile", "hsbc-visasig"],
      "scope": "bank-official-claim",
      "summary": "舊 presentation：開卡後 60 日內簽 HK$500 自動參加 HSBC 開卡大抽獎",
      "sourceUrl": null,
      "sourceType": "legacy-summary-no-official-url",
      "verifiedAt": "2026-07-16",
      "validFrom": "2026-06-01",
      "validUntil": "2026-07-31",
      "status": "unknown"
    },
    {
      "id": "amex-explorer-travel-rate-202612-legacy",
      "cardIds": ["amex-explorer"],
      "scope": "bank-official-claim",
      "summary": "MoneyHero 舊 presentation 聲稱旅遊簽賬登記後外幣低至 HK$1.68/里、港幣低至 HK$3/里",
      "sourceUrl": "https://www.moneyhero.com.hk/",
      "sourceType": "third-party-claim-not-official-proof",
      "verifiedAt": "2026-07-16",
      "validFrom": null,
      "validUntil": "2026-12-31",
      "status": "unknown"
    }
  ],
  "cards": {
    "sc-cathay": {
      "sourceVerifiedAt": "2026-07-20",
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
      "sourceVerifiedAt": "2026-07-20",
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
        }
      ]
    },
    "citi-pm": {
      "sourceVerifiedAt": "2026-07-20",
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
      "sourceVerifiedAt": "2026-07-20",
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
      "sourceVerifiedAt": "2026-07-20",
      "sourceStatus": "official-expired-welcome",
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
        }
      ]
    },
    "amex-explorer": {
      "sourceVerifiedAt": "2026-07-20",
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
      "sourceVerifiedAt": "2026-07-20",
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
      "sourceVerifiedAt": "2026-07-20",
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
      "sourceVerifiedAt": "2026-07-20",
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
  }
};
});
