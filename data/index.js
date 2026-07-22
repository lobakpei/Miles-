(function(root, factory){
  'use strict';
  var value;
  if (typeof module !== 'undefined' && module.exports) {
    value = factory(
      require('./cards-official.js'),
      require('./card-channels.js'),
      require('./source-registry.js')
    );
    module.exports = value;
  } else {
    value = factory(
      root.ACREMILES_CARDS_OFFICIAL,
      root.ACREMILES_CARD_CHANNELS,
      root.ACREMILES_SOURCE_REGISTRY
    );
  }
  root.ACREMILES_CARD_DATA = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(cards, channels, registry){
  'use strict';

  function clone(value){
    if (Array.isArray(value)) return value.map(clone);
    if (value && typeof value === 'object') {
      var output = {};
      Object.keys(value).forEach(function(key){ output[key] = clone(value[key]); });
      return output;
    }
    return value;
  }

  if (!Array.isArray(cards) || !cards.length) throw new Error('cards-official.js 冇有效卡資料');
  if (!channels || !Array.isArray(channels.records)) throw new Error('card-channels.js 冇有效渠道 records');
  if (!registry || !registry.cards || !registry.DATA_AS_OF) throw new Error('source-registry.js 冇有效核實資料');
  var applyWeeksRecord = registry.modelAssumptions && registry.modelAssumptions.applyWeeks;
  if (!applyWeeksRecord || applyWeeksRecord.sourceType !== 'none' || applyWeeksRecord.status !== 'unknown') {
    throw new Error('source-registry.js 必須將非官方 applyWeeks 明確標示 unknown／無來源');
  }
  var cardSecondRecord = registry.modelAssumptions.cardSecondMultiplier;
  var bankSecondRecord = registry.modelAssumptions.bankSecondCardMultiplier;
  var feeWaiverRecord = registry.modelAssumptions.feeWaiver;
  if (!cardSecondRecord || cardSecondRecord.status !== 'unknown' || !bankSecondRecord || bankSecondRecord.status !== 'unknown') {
    throw new Error('source-registry.js 必須將第二張卡乘數明確標示 unknown');
  }
  if (!feeWaiverRecord || feeWaiverRecord.status !== 'unknown') throw new Error('source-registry.js 缺少 fee waiver unknown provenance');

  var ids = {};
  var slugs = {};
  var channelRecordIds = {};
  channels.records.forEach(function(record){
    if (!record || !record.id || channelRecordIds[record.id]) throw new Error('渠道 record id 缺漏或重複');
    if (!record.cardId || !record.scope || !record.sourceType || !record.status) throw new Error('渠道 record 缺少必要 provenance：' + record.id);
    channelRecordIds[record.id] = true;
  });
  var promotionIds = {};
  (registry.promotions || []).forEach(function(record){
    if (!record || !record.id || promotionIds[record.id]) throw new Error('官方 promotion record id 缺漏或重複');
    promotionIds[record.id] = true;
  });
  var DEFAULT_CARDS = cards.map(function(raw){
    if (!raw || !raw.id || ids[raw.id]) throw new Error('信用卡 id 缺漏或重複：' + ((raw && raw.id) || 'unknown'));
    if (!raw.slug || slugs[raw.slug]) throw new Error('信用卡 slug 缺漏或重複：' + (raw.slug || raw.id));
    if (!raw.image || !raw.status) throw new Error('信用卡缺少 image／status：' + raw.id);
    ids[raw.id] = true;
    slugs[raw.slug] = true;

    var source = registry.cards[raw.id];
    if (!source) throw new Error('信用卡缺少 source registry：' + raw.id);
    var card = clone(raw);
    card.applyWeeks = applyWeeksRecord.values[raw.id];
    if (!Number.isFinite(card.applyWeeks)) throw new Error('信用卡缺少 legacy applyWeeks estimate：' + raw.id);
    if (Object.prototype.hasOwnProperty.call(cardSecondRecord.values, raw.id)) card.secondCardMult = cardSecondRecord.values[raw.id];
    var feeWaiver = feeWaiverRecord.values[raw.id];
    if (feeWaiver) {
      card.feeWaivable = feeWaiver.feeWaivable;
      card.waiveNote = feeWaiver.waiveNote;
    }
    card.sourceVerifiedAt = source.sourceVerifiedAt;
    card.sourceStatus = source.sourceStatus;
    card.sourceDocs = clone(source.sourceDocs);

    var legacyText = channels.legacyRuntimeText && channels.legacyRuntimeText[raw.id];
    if (legacyText && legacyText.target === 'welcome.note') {
      card.welcome.note = (card.welcome.note || '') + legacyText.suffix;
    } else if (legacyText && legacyText.target === 'note') {
      card.note = (card.note || '') + legacyText.suffix;
    }

    var welcome = card.welcome;
    if (welcome && !welcome.expired && welcome.type !== 'feePurchase' && welcome.tiers && welcome.tiers.length) {
      var last = welcome.tiers[welcome.tiers.length - 1];
      card.welcomeSpend = last.spend;
      card.welcomeMiles = last.miles;
      card.welcomeMonths = welcome.months;
    } else {
      card.welcomeSpend = 0;
      card.welcomeMiles = 0;
      card.welcomeMonths = (welcome && welcome.months) || 0;
    }
    return card;
  });

  Object.keys(registry.cards).forEach(function(id){
    if (!ids[id]) throw new Error('source registry 有孤立 card id：' + id);
  });
  channels.records.forEach(function(record){
    if (!ids[record.cardId]) throw new Error('渠道優惠指向未知 card id：' + record.id);
  });
  Object.keys(channels.legacyRuntimeText || {}).forEach(function(id){
    if (!ids[id]) throw new Error('legacy presentation 指向未知 card id：' + id);
    (channels.legacyRuntimeText[id].recordIds || []).forEach(function(recordId){
      if (!channelRecordIds[recordId] && !promotionIds[recordId]) throw new Error('legacy presentation 指向未知 record：' + recordId);
    });
  });

  var CHANNEL_OFFERS = {};
  channels.records.filter(function(record){ return record.runtimeOffer; }).forEach(function(record){
    if (!CHANNEL_OFFERS[record.cardId]) CHANNEL_OFFERS[record.cardId] = [];
    CHANNEL_OFFERS[record.cardId].push({
      platform: record.platform,
      bonus: record.bonus,
      expiry: record.validUntil,
      active: record.status === 'active',
      verified: record.verificationStatus === 'verified',
      link: record.sourceUrl
    });
  });

  return {
    DATA_AS_OF: registry.DATA_AS_OF,
    DEFAULT_CARDS: DEFAULT_CARDS,
    CHANNEL_OFFERS: clone(CHANNEL_OFFERS),
    CHANNEL_RECORDS: clone(channels.records),
    SOURCE_REGISTRY: clone(registry),
    MODEL_ASSUMPTIONS: clone(registry.modelAssumptions)
  };
});
