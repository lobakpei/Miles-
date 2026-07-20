(function(root){
  'use strict';

  var meta = {
    pgG1:  {slug:'asia-miles-101', title:'亞洲萬里通 101', description:'由零開始睇清點賺、點換、燃油費同里數過期。', image:'img/pgG1-hero.jpg', kind:'攻略'},
    pgG2:  {slug:'credit-card-combo', title:'信用卡砌卡組合', description:'重點唔係搵一張神卡，而係按消費額砌一個適合自己嘅組合。', image:'img/pgG2-cards.jpg', kind:'攻略'},
    pgG3:  {slug:'flight-awards', title:'標準獎勵換機票', description:'六個飛行距離區、艙位要求同換票前要計嘅現金費用。', image:'img/pgG3-hero.jpg', kind:'攻略'},
    pgG8:  {slug:'fuel-surcharge-yq', title:'YQ 燃油費：免費機票要俾幾多', description:'里數免票價，但燃油附加費同稅項仍要現金；出票前要一齊計。', image:'img/pgG8-hero.jpg', kind:'攻略'},
    pgG4:  {slug:'oneworld-rtw', title:'寰宇一家環球票', description:'一張多航空公司獎勵票點計里數、停留、轉機同開口。', image:'img/pgG4-hero.jpg', kind:'攻略'},
    pgR1:  {slug:'rtw-example-world', title:'路線實例①：真環球 265,000 里', description:'五大洲多城市候選路線，逐站睇玩法、距離同核實狀態。', image:'img/pgR1-hero.jpg', kind:'路線'},
    pgR2:  {slug:'rtw-example-medium', title:'路線實例②：中等線 250,000 里', description:'倫敦、巴黎、紐約、多倫多候選線，保留空間畀你自己加站。', image:'img/pgR2-hero.jpg', kind:'路線'},
    pgW0:  {slug:'rtw-routes', title:'環球票五條示範線・總覽', description:'由 120,000 至 280,000 里，按預算揀一條候選環球路線。', image:'img/pgW0-hero.jpg', kind:'路線'},
    pgW6:  {slug:'rtw-zone-6', title:'區6・日韓泰 120,000 里', description:'札幌、沖繩、東京、首爾、曼谷、吉隆坡嘅入門候選環球線。', image:'img/pgW6-hero.jpg', kind:'路線'},
    pgW8:  {slug:'rtw-zone-8', title:'區8・日澳泰 170,000 里', description:'日本、澳洲、星馬、曼谷八個城市嘅候選環球線。', image:'img/pgW8-hero.jpg', kind:'路線'},
    pgW10: {slug:'rtw-zone-10', title:'區10・歐美城市線 230,000 里', description:'多哈轉機去馬德里，開口去倫敦，再玩紐約、芝加哥，東京轉機返港；19,496 哩。', image:'img/pgW10-hero-v3.jpg', kind:'路線'},
    pgW11: {slug:'rtw-zone-11', title:'區11・遠洲探索 250,000 里', description:'馬爾代夫、多哈、開羅、紐約、洛杉磯嘅候選環球線。', image:'img/pgW11-hero.jpg', kind:'路線'},
    pgW13: {slug:'rtw-zone-13', title:'區13・終極版環遊世界 280,000 里', description:'十一個目的地、六大洲、兩個開口嘅候選終極環球線。', image:'img/pgW13-hero.jpg', kind:'路線'},
    pgG5:  {slug:'beginner-pitfalls', title:'新手最易中嘅七個伏', description:'迎新條件、取消卡、燃油費同里數過期等常見陷阱。', image:'img/pgG5-hero.jpg', kind:'攻略'},
    pgG6:  {slug:'how-to-use-acremiles', title:'點用 AcreMiles 幫你計', description:'由賺里數、換機票到環球行程，逐步教你用規劃工具。', image:'img/pgG6-hero.jpg', kind:'教學'},
    pgO1:  {slug:'standard-chartered-cathay-july-2026', title:'渣打國泰 7 月加碼：高達 143,000 里', description:'7 月 23 日截止嘅限時優惠拆解；過期後仍保留作紀錄。', image:'img/pgO1-hero.jpg', kind:'優惠'},
    pgO2:  {slug:'hsbc-everymile-july-2026', title:'EveryMile 7 月限時優惠碼', description:'比較三個平台優惠碼、申請流程同重要條件。', image:'img/pgO2-hero.jpg', kind:'優惠'},
    pgO3:  {slug:'amex-platinum-july-2026', title:'AE 白金 7 月迎新', description:'官方核實申請期、迎新門檻同 9X 優惠重點。', image:'img/pgO3-hero.jpg', kind:'優惠'},
    pgO4:  {slug:'amex-explorer-july-2026', title:'AE Explorer 7 月版', description:'迎新里數、平台加碼同批卡後要做嘅登記。', image:'img/pgO4-hero.jpg', kind:'優惠'},
    pgO5:  {slug:'comparison-platform-guide', title:'三大平台獨家獎賞點樣拎', description:'小斯、里先生同 MoneyHero 嘅申請、追蹤同領獎流程。', image:'img/pgO5-hero.jpg', kind:'教學'}
  };

  root.ACREMILES_SHARE_META = meta;
  if (typeof module !== 'undefined' && module.exports) module.exports = meta;
})(typeof window !== 'undefined' ? window : globalThis);
