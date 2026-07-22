(function(root, factory){
  'use strict';
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AcreMilesSourceRegistry = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';

  var DATA_AS_OF = "2026-07-20（9 張卡官方產品頁、KFS／T&C 逐張核對）";
  var CARD_SOURCES = {
  "sc-cathay": {
    "url": "https://www.sc.com/hk/credit-cards/cathay/",
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
    "url": "https://www.hsbc.com.hk/credit-cards/products/everymile/",
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
    "url": "https://www.citibank.com.hk/english/credit-cards/premiermiles-cards/index.html",
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
    "url": "https://www1.citibank.com.hk/english/credit-cards/prestige-card",
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
    "url": "https://www.dbs.com.hk/personal-zh/credit-cards/credit-cards/black-mc",
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
    "url": "https://www.americanexpress.com/hk/en/credit-cards/explorer-credit-card/",
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
    "url": "https://www.dahsing.com/html/en/credit_card/card_products/co_brand/british_airway_card.html",
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
    "url": "https://www.hsbc.com.hk/credit-cards/products/visa-signature/",
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
    "url": "https://www.americanexpress.com/hk/en/credit-cards/platinum-card/",
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
    schemaVersion: 1,
    market: 'HK',
    DATA_AS_OF: DATA_AS_OF,
    CARD_SOURCES: CARD_SOURCES
  };
});
