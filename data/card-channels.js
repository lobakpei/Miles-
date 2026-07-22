(function(root, factory){
  'use strict';
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AcreMilesCardChannels = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';

  var CHANNEL_OFFERS = {
  "sc-cathay": [
    {
      "platform": "小斯 flyformiles",
      "bonus": "7 月加碼：指定推廣碼申請，另有 HK$500 禮券（詳情及資格以平台頁為準）",
      "expiry": "2026-07-23",
      "active": true,
      "verified": true,
      "link": "https://flyformiles.hk/41446"
    },
    {
      "platform": "里先生",
      "bonus": "7 月加碼：指定推廣碼申請，另有 88 里賞金（詳情及資格以平台頁為準）",
      "expiry": "2026-07-23",
      "active": true,
      "verified": true,
      "link": "https://www.mrmiles.hk/cathay-card/"
    }
  ],
  "hsbc-everymile": [
    {
      "platform": "里先生",
      "bonus": "優惠碼 MILEFLASH：合資格新客最高約 49,000 里；每月要有簽賬並包括一次手機支付",
      "expiry": "2026-07-31",
      "active": true,
      "verified": true,
      "link": "https://www.mrmiles.hk/hsbc-everymile/"
    },
    {
      "platform": "MoneyHero",
      "bonus": "優惠碼 HEROFLASH：合資格新客最高約 49,000 里；申請前先核對平台流程",
      "expiry": "2026-07-31",
      "active": true,
      "verified": true,
      "link": "https://www.moneyhero.com.hk/zh/credit-card/blog/%E8%A7%A3%E6%A7%8B-%E6%BB%99%E8%B1%90everymile%E4%BF%A1%E7%94%A8%E5%8D%A1"
    }
  ],
  "amex-explorer": [
    {
      "platform": "里先生",
      "bonus": "7 月平台加碼：HK$50 回贈，另有 88 里賞金；迎新本體申請期至 8 月 31 日",
      "expiry": "2026-07-31",
      "active": true,
      "verified": true,
      "link": "https://www.mrmiles.hk/ae-explorer/"
    },
    {
      "platform": "小斯 flyformiles",
      "bonus": "7 月平台加碼：HK$50 手機八達通增值獎賞；迎新本體申請期至 8 月 31 日",
      "expiry": "2026-07-31",
      "active": true,
      "verified": true,
      "link": "https://flyformiles.hk/amex-explorer"
    }
  ],
  "amex-platinum": [
    {
      "platform": "里先生",
      "bonus": "獨家優惠：迎新之上再送 2,000 里",
      "expiry": null,
      "active": false,
      "verified": false,
      "link": "https://www.mrmiles.hk/ae-platinum-card-centurion-lounge/"
    },
    {
      "platform": "MoneyHero",
      "bonus": "獨家優惠：送 HK$300 Apple 禮券",
      "expiry": null,
      "active": false,
      "verified": false,
      "link": "https://www.moneyhero.com.hk/"
    }
  ]
};

  /*
   * v6.79.0 displayed a weekly channel digest inside five card notes. Keep those
   * presentation-only suffixes here so CARD_RECORDS remains bank-official data,
   * while getCards() can reproduce the legacy product output byte-for-byte.
   */
  var LEGACY_PRESENTATION = {
    "sc-cathay": {
      "field": "welcome.note",
      "suffix": "【週更2026-07-16·平台第3級】7月加碼（07-23截）：新客用平台推廣碼免簽賬+11,000里、現有客+7,000里；順手開綜合存款戶口存$5,000再+10,000里（現有客+3,000）——連迎新全食高達143,000里。小斯（碼HKRSIUC11000，07-15至23）新舊客另有$500禮券；里先生（碼HKRMRM11000）另有88里賞金。以官方T&C為準。"
    },
    "hsbc-everymile": {
      "field": "note",
      "suffix": "【週更2026-07-16·平台第3級】網上限時迎新（07-13至31）：申請時輸入對應平台優惠碼（里先生MILEFLASH／MoneyHero HEROFLASH／MoneySmart MARTFLASH，每次只可入一個），批卡60日內簽$8,000（要包至少一次手機支付）→新客額外$1,000獎賞錢（20,000里）、舊客額外$500（10,000里）；連基本迎新新客合共高達$2,450獎賞錢≈49,000里。另06-01至07-31開卡+60日簽$500自動入HSBC大抽獎（24名$50,000獎賞錢）。里先生同期填form有88里賞金。以官方T&C為準。"
    },
    "dbs-black": {
      "field": "note",
      "suffix": "【週更2026-07-16·平台第3級】MoneyHero獨家：經佢申請迎新高達32,000里（簽$60,000+做一次Flexi Shopping分期），另獨家獎賞任揀一（$800 Apple禮品卡／惠康券／Trip.com券／8,000 Max Miles／Delsey行李箱等）；07-07至10-05經MoneyHero連結行DBS Card+ app申請再多$50「一扣即享」。用MoneyHero要跟足佢流程（表格→app）先追蹤到。以官方T&C為準。"
    },
    "amex-explorer": {
      "field": "note",
      "suffix": "【週更2026-07-16·平台第3級】7月限時（07-02至31）：經平台申請迎新26,000里外，加$50獎賞（小斯報八達通增值賞／里先生報簽賬回贈）；里先生另有88里賞金。提醒：本地6X積分（HK$3/里）係全年計劃但要登記先有。MoneyHero報新一期旅遊簽賬優惠至12-31：登記後外幣低至HK$1.68/里、港幣低至HK$3/里。以官方T&C為準。"
    },
    "hsbc-visasig": {
      "field": "note",
      "suffix": "【週更2026-07-16·平台第3級】06-01至07-31開卡+60日內簽$500自動參加HSBC開卡大抽獎。以官方T&C為準。"
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function applyLegacyPresentation(card) {
    var rendered = clone(card);
    var presentation = LEGACY_PRESENTATION[rendered.id];
    if (!presentation) return rendered;
    if (presentation.field === 'welcome.note') {
      rendered.welcome.note = (rendered.welcome.note || '') + presentation.suffix;
    } else {
      rendered[presentation.field] = (rendered[presentation.field] || '') + presentation.suffix;
    }
    return rendered;
  }

  function getOffers() {
    return clone(CHANNEL_OFFERS);
  }

  return {
    schemaVersion: 1,
    CHANNEL_OFFERS: CHANNEL_OFFERS,
    LEGACY_PRESENTATION: LEGACY_PRESENTATION,
    applyLegacyPresentation: applyLegacyPresentation,
    getOffers: getOffers
  };
});
