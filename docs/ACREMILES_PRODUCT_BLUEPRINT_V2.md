# AcreMiles Product Blueprint v2

**文件版本：** v2.0  
**建立日期：** 2026-07-21  
**產品基準：** AcreMiles v6.79.0  
**文件定位：** 長期產品藍圖／策略 Source of Truth  
**主要讀者：** Founder、ChatGPT Work、開發代理、內容製作、未來合作夥伴  
**配套文件：** `ACREMILES_PRODUCT_HANDOFF_V1_1_SAFETY_HARDENED.md`

---

# 0. 呢份文件點用

呢份 Blueprint 唔係另一份「今次改邊幾行 code」嘅交接文件。

佢負責回答：

- AcreMiles 究竟係乜
- 點解要存在
- 服務邊一類香港人
- 用戶由第一次見到 AcreMiles，到真正養成消費習慣，應該經歷乜
- 首頁、計算器、日常助手、規劃器、文章、referral 同顧問服務之間係咩關係
- 產品應該按咩次序發展
- 每次做新功能時，用咩標準判斷方向有冇走歪
- v6.79.0 已經完成咗乜，仲欠乜
- 下一個 30 日、下一階段同長期方向係乜

文件之間嘅分工：

| 文件 | 用途 |
|---|---|
| Product Blueprint v2 | 長期方向、產品架構、用戶旅程、商業模式、roadmap |
| Safety Hardened Handoff | 某一輪實作要做乜、點備份、點開 branch、點交付 |
| Release Checklist | 每次發布前後要測乜 |
| Data Register | 每個價格、迎新、里數表、路線資料嘅來源、日期、有效期 |
| Decision Log | 點解某個設計或產品決定最後咁揀 |

如有衝突：

1. 法律、安全、資料真確性規則最高優先。
2. 最新 Blueprint 決定長期方向。
3. 某一輪最新 Handoff 決定當次實作範圍。
4. 現有正式網站係運作基準，但唔代表所有舊文案同舊結構都係長期正確答案。

---

# 1. Executive Summary

## 1.1 一句定義 AcreMiles

> **AcreMiles 係一個幫香港人將本來已經會發生嘅消費，轉化成更有價值回報嘅消費回報平台。**

現階段第一個入口係：

> **飛行里數與機票。**

原因唔係因為 AcreMiles 永遠只做機票，而係機票、商務艙同旅行體驗最容易令人產生：

> **「原來我本來要使嘅錢，可以換到呢樣嘢。」**

呢個衝擊係最有效嘅第一個入口。

長期可以加入：

- 酒店住宿
- 客艙升級
- Lounge
- 商品
- 禮券
- 其他積分或 rewards

但產品永遠圍繞同一條問題：

> **我呢筆消費，可以換返啲乜？**

## 1.2 北極星信念

> **每筆消費，都值得有回報。**

呢句唔只係 slogan。

佢係：

- 品牌信念
- 產品決策標準
- 用戶習慣目標
- 內容方向
- 商業模式起點
- 將來擴展去其他 rewards 時仍然成立嘅核心

## 1.3 用戶轉變

AcreMiles 要完成嘅唔係一次計算，而係一個人嘅行為轉變：

```text
以前：
有消費
→ 求其用一張卡／拎 cashback
→ 完

之後：
有消費
→ 開 AcreMiles
→ 睇今次應該點賺
→ 用啱卡／申請啱卡
→ 見到回報進度
→ 最後換到旅行
→ 下一次消費前再開 AcreMiles
```

## 1.4 真正產品結果

AcreMiles 最理想嘅口碑唔係：

- 「呢個 app 幫我計到好多里。」
- 「呢個 app 幫我揀咗張卡。」
- 「呢個 app 有個好勁嘅 planner。」

而係：

> **「我本來買部 iPhone，最後竟然換到機票。」**

或者：

> **「我本來結婚要使嗰筆錢，最後多咗一個本來唔會擁有嘅環球商務艙蜜月。」**

旅行結果係主角。

- 里數係工具
- 信用卡係方法
- 規則引擎係幕後工作
- AI 如將來加入，都只係助手

## 1.5 商業引擎

AcreMiles 預期嘅商業循環：

```text
社交平台生活情景內容
→ 用戶見到「消費可以變成乜」
→ 入 AcreMiles 睇可信示範
→ 用自己金額計
→ 得到卡組合與行動方案
→ 經透明推薦連結申請信用卡
→ AcreMiles 獲得 referral 收入
→ 用戶第一次真正得到著數
→ 開始每次消費前使用 AcreMiles
→ 再次申請、使用、分享
```

Referral 唔應該係用戶第一眼見到嘅目的。

Referral 應該係：

> **AcreMiles 真係幫到用戶之後，自然發生嘅收入結果。**

---

# 2. AcreMiles 係乜，同唔係乜

## 2.1 AcreMiles 係

- 消費回報平台
- 消費前決策助手
- 迎新及日常簽賬規劃工具
- 「消費金額 → 可得回報 → 可換結果」翻譯器
- 新手與進階用戶之間嘅橋樑
- 旅行願望與里數規則之間嘅翻譯層
- 可以逐步發展成長期消費習慣產品

## 2.2 AcreMiles 唔係

- 純信用卡比較網站
- 只列「最高幾多萬里」嘅 affiliate list
- 純 Asia Miles 教科書
- 只畀 miles 玩家用嘅工具
- 純環球票 planner
- 純文章網站
- 旅行搜尋引擎
- 航空公司訂票平台
- 保證批卡、保證有獎勵位、保證出票嘅服務
- 為咗「有 AI」而接一個收費聊天 API 嘅產品

## 2.3 產品角色次序

所有產品文案同畫面應該維持以下次序：

1. **用戶想得到嘅生活結果**
2. **佢本來已經會發生嘅消費**
3. **AcreMiles 幫佢揀出嘅方法**
4. **信用卡、里數、規則細節**

唔可以反過來由信用卡術語開始。

---

# 3. Founder Story 與產品可信度

大約十年前，Founder 因結婚產生二十幾萬港元支出。

因為反正都要使，開始研究：

> 呢筆錢可唔可以換返一啲額外價值？

最後透過多張信用卡迎新、簽賬分配、里數規則及人手出票，儲到二十幾萬飛行里數，換成十幾程全商務艙嘅環球蜜月。

對外最有感染力嘅唔係：

- 申請咗六張卡
- 儲到某個里數數字
- 學識某套規則

而係：

> **同一筆本來要畀嘅婚禮支出，換返一段市價接近同樣金額、正常情況唔會用現金購買嘅人生體驗。**

Founder Story 對產品有三個作用：

### 1. 品牌起源

AcreMiles 唔係見到 referral 市場先作出嚟，而係由一個真實痛點開始。

### 2. 產品判斷準則

每個功能都應該令普通人更接近：

> **用一筆本來會發生嘅消費，得到一個原本唔會擁有嘅結果。**

### 3. 內容資產

Founder Story 係「真實案例」。

其他按公開條款計出嚟嘅內容，應該叫「可行示範方案」，兩者唔可以混淆。

---

# 4. 目標用戶

## 4.1 最重要嘅用戶定義

> **佢哋識旅行，但唔識里數。**

香港人普遍：

- 知道自己想去巴黎、米蘭、南非、阿根廷、北海道
- 知道自己想滑雪、Shopping、食嘢、睇北極光
- 一年去一次甚至幾次旅行
- 對旅行目的地唔陌生
- 有一定消費能力

但佢哋未必知道：

- 用邊張信用卡
- 迎新點食
- Asia Miles 同 Avios 點揀
- 機場代碼
- 航空聯盟
- 停留、轉機、開口
- 邊段有直航
- 里數區
- 點樣打電話出票

所以：

> **唔好因為用戶唔識里數，就當佢唔識旅行。**

AcreMiles 要收埋嘅係里數世界嘅複雜性，唔係用戶對旅行嘅想像。

## 4.2 用戶態度

目標用戶唔一定理解能力低。

佢可能係：

- 專業人士
- 醫生
- 律師
- 老闆
- 高收入家庭
- 普通上班族

共同點係：

> **佢冇興趣花幾十個鐘研究里數規則。**

產品要當佢係完全冇背景知識，但唔應該用居高臨下嘅語氣。

## 4.3 消費觸發層級

AcreMiles 唔應該再用「大額消費」做總稱。

對用戶嚟講，第一次入坑嘅金額可以係：

- HK$5,000
- HK$8,000
- HK$10,000
- HK$15,000
- HK$20,000
- HK$100,000 或以上

關鍵唔係金額有幾大。

關鍵係：

> **佢第一次真係食到著數。**

內部可將消費情景分成：

| 情景 | 典型用途 | 產品角色 |
|---|---|---|
| 一般計劃消費 | 手機、電視、遊戲機、相機、手袋、旅行 | 最大流量入口 |
| 中型消費 | 傢俬、保費、家庭旅行、電子產品組合 | 多卡或迎新規劃 |
| 人生事件 | 結婚、裝修、買車、長途旅行 | 高價值案例及高 referral 潛力 |
| 日常消費 | 食飯、超市、睇戲、網購、海外簽賬 | 長期習慣及留存 |
| 複雜兌換 | 多城市、商務艙、環球票 | 進階產品及顧問服務 |

## 4.4 工作假設，而唔係已驗證數據

現階段 Founder 假設：

- 約九成目標用戶需要 Beginner／guided experience
- 約一成用戶可以直接使用進階工具
- 約七成主要流量會來自一般至中型消費、單一目的地、迎新及日常簽賬
- 約三成產品吸引力或進階需求來自環球票、複雜行程及高額消費

以上要視為產品假設。

正式比例要等 analytics、實際流量及 referral 數據建立基準後再修正。

---

# 5. Jobs To Be Done

AcreMiles 唔應該用「功能清單」理解用戶，而要用佢當刻要完成嘅工作理解。

## 5.1 消費前

> 我準備使一筆錢，呢筆錢可以換到乜？

> 今次應該申請邊張卡？

> 如果我已經有幾張卡，應該點分配？

> 呢筆交易計唔計迎新？

## 5.2 日常簽賬前

> 我今晚食飯用邊張卡？

> 呢間商戶屬於咩類別？

> 本地、網上、外幣、海外簽賬分別用邊張？

> 呢張卡今個月係咪已經到上限？

## 5.3 儲里之後

> 我而家啲里數可以去邊？

> 我距離下一個更吸引嘅結果仲差幾多？

> 我應該繼續儲 Asia Miles，定保留彈性點數？

## 5.4 想旅行時

> 我只係想去東京，經濟同商務要幾多里？

> 我想去美國、英國、滑雪、睇北極光，但唔知點排。

> 我想去幾個地方，系統可唔可以先畀我一條合理方向？

## 5.5 真正出票前

> 呢條路線票規上得唔得？

> 邊啲係停留、轉機、開口？

> 有冇直航？

> 邊一段要自己買？

> 最後要準備啲咩資料打電話？

## 5.6 決策信心

> 呢啲數字幾時核實？

> 係真人案例定示範？

> 有咩條款可能令我攞唔到？

> AcreMiles 推呢張卡係咪因為收佣？

---

# 6. 用戶生命週期

## 6.1 Stage 0：完全陌生

用戶心理：

- 里數好麻煩
- Cashback 簡單啲
- 呢啲係高手先玩
- 我冇時間研究

AcreMiles 任務：

> 用一個生活化、可核實、五秒內明白嘅「消費 → 旅行結果」令佢停低。

## 6.2 Stage 1：產生好奇

用戶心理：

> 真定假？

AcreMiles 任務：

- 顯示資料日期
- 顯示係示範定真實案例
- 清楚講批核、迎新、獎勵位唔保證
- 讓用戶睇到點樣計
- 唔好立即問年薪、登入、個人資料

## 6.3 Stage 2：代入自己

用戶心理：

> 咁我自己嗰筆錢呢？

AcreMiles 任務：

- 第一層只問金額
- 即時帶入計算
- 先出 approximate result
- 之後先問可選條件

## 6.4 Stage 3：得到個人方案

用戶心理：

> 原來我真係可以做到。

AcreMiles 任務：

- 顯示可得里數
- 顯示可換結果
- 顯示下一個更高結果仲差幾多
- 顯示推薦卡組合與時間表
- 讓佢儲存計劃

## 6.5 Stage 4：採取行動

用戶心理：

> 我應該申請邊張？

AcreMiles 任務：

- 解釋點解推
- 顯示簽賬門檻
- 顯示重要限制
- 提供透明 referral link
- 不因佣金改變適合度排序

## 6.6 Stage 5：第一次真正成功

真正「入坑」唔係見到數字。

真正入坑係：

- 成功批卡
- 完成迎新
- 里數入帳
- 第一次換到機票
- 第一次發現同一筆消費真係換到有感回報

AcreMiles 任務：

- 讓用戶標記進度
- 提醒下一步
- 慶祝真實成果
- 引導佢設定下一個目標

## 6.7 Stage 6：建立日常習慣

用戶心理：

> 等等，呢餐飯用邊張卡？

AcreMiles 任務：

- 快速日常簽賬助手
- 記住佢有咩卡
- 顯示類別、上限、登記要求
- 一兩步內有答案
- 顯示今次選擇對旅行目標有咩幫助

## 6.8 Stage 7：進階與兌換

用戶心理：

> 既然真係有用，我想玩得再盡啲。

AcreMiles 任務：

- 單一目的地
- 多城市
- Beginner planner
- Advanced planner
- 顧問服務
- 出票 checklist

## 6.9 Stage 8：分享與口碑

最理想分享：

> 我本來買咗一樣嘢，最後換到一段旅行。

AcreMiles 任務：

- 可分享計劃卡
- 可分享成功結果
- 用戶案例
- referral／朋友邀請日後可再研究，但唔好搶先做

---

# 7. 成功時刻要分四層

## 7.1 第一個 Aha Moment

> 原來一筆普通消費都可以變成旅行。

由首頁示範完成。

## 7.2 第一個 Product Win

> 我入自己數字，系統真係畀到一個我明嘅結果。

由計算器完成。

## 7.3 第一個 Commitment

> 我儲低計劃、睇卡詳情、撳申請，或者設定旅行目標。

由行動流程完成。

## 7.4 第一個 Real Win

> 我真係收到迎新、里數入帳或換到機票。

呢個先係真正令用戶改變信念嘅時刻。

產品唔可以只量度「計過一次」。

長期一定要設計方法，讓用戶可以自己標記：

- 已申請
- 已批核
- 已完成簽賬
- 已收到獎賞
- 已換到結果

唔需要上載敏感文件。

只需低摩擦、自我回報進度。

---

# 8. Growth Engine：流量點樣入嚟

## 8.1 AcreMiles 唔靠用戶無端端打開網站發現

主要入口係：

- Instagram
- Facebook
- 短片
- 搜尋
- 分享連結
- 時事／產品發布／生活事件內容

## 8.2 社交內容唔應該先講信用卡

主內容公式：

```text
一個香港人熟悉嘅生活情景
+
一筆具體消費
+
一個有感旅行結果
+
一句「原來咁都得」
+
入 AcreMiles 用自己數字計
```

例如內容類型可以係：

- 新手機發布
- 遊戲機＋電視組合
- 婚禮支出
- 裝修
- 新家庭用品
- 旅行預訂
- 季節性大消費

任何例子正式發布前都必須核實。

## 8.3 社交內容嘅情緒鉤子

內容唔只係「抵」。

可以係：

- 本來老婆／老公覺得唔值得買
- 反正都要使
- 原來同一筆錢可以幫補旅行
- 原來唔使成為高手都做到
- 原來以前一直浪費緊

## 8.4 Content Funnel

```text
生活情景貼文
→ 對應 landing／文章
→ 第一屏先顯示金額、回報、旅行結果
→ 睇點做到
→ 用自己金額計
→ 儲存計劃
→ 卡詳情／申請
```

## 8.5 資訊內容嘅角色

攻略、T&C、教學並非冇用。

佢哋負責：

- 建立信任
- SEO
- 降低風險
- 幫已經有興趣嘅人完成決策

但唔應該成為主要 acquisition hero。

---

# 9. Habit Loop：點樣令人經常打開

## 9.1 Trigger

用戶遇到：

- 準備買一樣嘢
- 出街食飯
- 睇戲
- 網購
- 海外簽賬
- 收到新優惠
- 計劃旅行
- 某張卡需要登記
- 某個迎新期限接近
- 某個類別上限快用完

## 9.2 Action

最理想行動應該非常短：

> 開 AcreMiles → 揀今次消費類別／商戶 → 睇用邊張卡。

或者：

> 開 AcreMiles → 睇目前目標仲差幾多。

## 9.3 Reward

每次回報唔一定要係一張機票。

可以係：

- 今次多賺幾多里
- 避免用錯卡
- 發現快到上限
- 發現某張卡要先登記
- 旅行目標進度增加
- 發現一個新可換結果

## 9.4 Investment

用戶逐步存入：

- 自己有咩卡
- 想去邊
- 目前有幾多里
- 儲存計劃
- 每月消費模式
- 已完成嘅里程碑

資料令下一次答案更快、更個人化。

## 9.5 Return Trigger

可以使用：

- App 內 next action
- Email 訂閱
- PWA notification（之後先研究）
- 到期提醒
- 每月總結
- 目標差距提示

所有通知必須 opt-in，唔可以變成轟炸。

---

# 10. 商業模式

## 10.1 第一收入來源：信用卡 Referral／Affiliate

理想時機：

> 用戶已經見到自己嘅結果，並理解點解某張卡適合佢之後。

唔理想時機：

> 一入網站即刻見一堆「立即申請」卡片。

## 10.2 排序原則

卡片適合度必須由以下因素決定：

- 用戶消費金額
- 消費模式
- 年薪門檻
- 已有卡
- 迎新資格
- 里數偏好
- 年費
- 上限
- 風險
- 資料新鮮度

唔可以由：

- 邊張佣金最高
- 邊個平台想推
- 邊張有合作

決定。

## 10.3 披露

任何 referral CTA 附近要清楚寫：

> 此連結可能令 AcreMiles 獲得推薦收入，但唔會增加你嘅申請費用。推薦排序以適合度及公開條款為準。

## 10.4 第二收入來源：人工顧問服務

對複雜行程：

- 多城市
- 環球票
- 特殊目的地
- 多人同行
- 多套里數
- 出票前逐段準備

第一個可行方案唔一定係 AI API。

可以係：

> **用戶直接同 Founder 對話，支付顧問費，由 Founder 配合現有 AI 工具同規則引擎完成。**

優點：

- 無固定 API 成本
- 可以收費
- 可以收集真實問題
- 可以建立高價值案例
- 可以知道將來真正值得自動化嘅部分

## 10.5 暫時唔做

現階段唔應該急住：

- 收月費
- 接全站 AI chat
- 建 marketplace
- 為咗收入塞廣告
- 推一堆唔相關金融產品

---

# 11. 產品架構

AcreMiles 長期應該由九個互相連接嘅模組組成。

```text
1. Outcome Inspiration
   消費可以變成乜

2. Earn Planner
   今次消費點樣賺

3. Daily Spend Assistant
   今日用邊張卡

4. Goal & Progress
   我想換乜，仲差幾多

5. Redeem Explorer
   我啲里可以去邊

6. Beginner Journey Planner
   我講目的地同活動，系統排方向

7. Advanced Route Planner
   我自己砌航段並驗規則

8. Content & Trust
   優惠、攻略、來源、條款

9. Conversion & Service
   Referral、申請行動、顧問服務
```

九個模組唔應該各自變成孤島。

核心連接：

```text
消費示範
→ 用自己金額計
→ 得到回報
→ 設定旅行目標
→ 儲存計劃
→ 推薦卡
→ 跟進第一次成功
→ 日常用卡
→ 累積進度
→ 規劃兌換
```

---

# 12. Information Architecture

## 12.1 現階段 Bottom Navigation

v6.79.0 嘅五個主入口可以保留：

1. 計算
2. 規劃
3. 首頁
4. 優惠
5. 攻略

呢個階段唔需要為咗「更似大 app」再加更多 tab。

## 12.2 首頁唔係功能目錄

首頁唯一核心任務：

> **先證明 AcreMiles 有價值，再自然帶用戶去下一步。**

首頁唔應該只係一排功能掣。

## 12.3 New User Home

建議順序：

1. Outcome Showcase
2. 更多已核實消費示範
3. 「你都有一筆消費？」快速金額入口
4. 簡單旅行入口
5. 少量精選優惠與攻略
6. 法律、資料完整細節放後層

## 12.4 Returning User Home

如已有資料，首頁優先次序要改：

1. 下一個應做行動
2. 目前旅行目標與差距
3. 已儲存消費計劃
4. 已儲存行程
5. 今日快速用卡
6. 新示範與優惠
7. 收藏

## 12.5 Habit User Home

當日常助手成熟後，首頁可優先顯示：

> 今次準備簽乜？

快速選項用文字：

- 食飯
- 超市
- 網購
- 海外
- 旅遊
- 其他

系統根據「我的卡」即時出答案。

## 12.6 Empty State

首頁唔應顯示：

- 你未有計劃
- 你未有行程
- 你未有收藏

大段空白提醒。

冇資料就收起。

先讓用戶見到有價值嘅內容。

---

# 13. Module Blueprint

## 13.1 Outcome Inspiration

### 任務

將抽象里數翻譯成生活結果。

### 輸入

- 消費商品／情景
- 金額
- 信用卡公開條款
- 可得里數
- 兌換表
- 資料日期

### 輸出

第一層：

- 使幾多
- 大約幾多里
- 可以參考換到乜

第二層：

- 點樣做到
- 要申請邊張
- 要簽幾多
- 幾耐內完成

第三層：

- 完整條款
- 年費
- 排除交易
- 批核風險
- 稅費
- 獎勵位
- 官方連結

### 案例類型

1. 真實案例
2. 已核實可行示範
3. 用戶成功案例
4. 已過期內容檔案

### 長期要求

Outcome Engine 應該做到 reward-agnostic：

```text
消費
→ 飛行里數
→ 機票

將來：
消費
→ 點數
→ 酒店／商品／禮券
```

## 13.2 Earn Planner：今次消費

### 任務

令用戶由一個金額得到一個可執行方案。

### 最理想流程

#### Step A：快速估算

只問：

- 金額

即時出：

- 粗略可得範圍
- 幾個可換結果

#### Step B：個人化

再問：

- 年薪（可選）
- 一人／二人
- 一次過／分幾個月
- Asia Miles／Avios
- 已有卡
- 最多開卡數

#### Step C：行動方案

出：

- 推薦卡組合
- 每張簽幾多
- 迎新門檻
- 申請次序
- 時間表
- 風險
- referral CTA

### 結果畫面次序

1. 可得回報
2. 可以換到乜
3. 下一個結果仲差幾多
4. 推薦卡組合
5. 行動時間表
6. 點樣計
7. 完整規則

### 核心改變

計算器唔只係 calculator。

佢要成為：

> **由消費去旅行目標嘅導航器。**

## 13.3 Daily Spend Assistant

呢個係 AcreMiles 建立長期使用習慣嘅核心，現階段仍未完整建立。

### 用戶輸入

第一版只需：

- 今次係咩類別
- 本地／海外
- 網上／實體
- 金額
- 自己有咩卡

### 系統輸出

- 第一選擇
- 第二選擇
- 點解
- 每 HK$ 幾多里
- 有冇登記要求
- 有冇上限
- 今個月估計仲剩幾多額度
- 今次比求其用卡多賺幾多

### 長期輸出

> 今次用呢張卡，令你距離北海道目標近多 420 里。

### 第一版原則

- 一兩步有答案
- 唔要求輸入完整月支出先用
- 可以「我冇記低卡」模式
- 可以「只睇全市場」模式
- 唔好用商戶分類代碼術語嚇人

## 13.4 Goal & Progress

呢個模組係由一次計算走向長期關係嘅橋樑。

### 用戶設定

- 想去邊
- 幾多人
- 單程／來回
- 經濟／商務
- 目標日期（可選）
- 目前有幾多里
- 已計劃可賺幾多

### 首頁顯示

```text
北海道雙人經濟來回
目標：52,000 里
已有：20,000
已計劃：18,000
仲差：14,000
```

### Next Best Action

- 完成目前迎新
- 再簽幾多
- 用邊張卡完成某類消費
- 轉分前提醒
- 先唔好轉，保留彈性點數

### 原則

進度唔可以假裝係銀行實時資料。

第一版可由用戶手動輸入或由 AcreMiles 計劃估算，清楚標示：

- 已有
- 預計
- 未確認

## 13.5 Redeem Explorer：單一目的地

### 用戶問題

> 我有幾多里，可以去邊？

或者：

> 我想去某個城市，要幾多里？

### 第一版輸出

- 經濟
- 特選經濟
- 商務
- 頭等
- 單程
- 來回
- 大約 YQ／稅提醒
- 資料日期
- 是否官方核實

### 長期加入

- 多人數量
- 目前里數夠唔夠
- 差額
- 由 Earn Planner 帶入
- 收藏目標
- 官方查位連結

## 13.6 Beginner Journey Planner

### 產品承諾

> **你講想去邊、想做乜，系統幫你將旅行願望變成一條可行方向。**

### 用戶負責

- 國家／城市
- 活動
- 幾多日
- 幾多人
- 大概月份
- 艙等偏好
- 已有里數／預計消費

### 系統負責

- 航空公司
- 機場
- 航段順序
- 直航
- 轉機
- 開口
- 停留
- 里數區
- 是否近區頂
- 風險提示

### 發展階段

#### Stage 1：Template Matching

目前 v6.79.0 已有：

- 目的地 chips
- 活動 chips
- 現有五條路線模板
- 最接近配對
- 載入 Advanced Planner 修改

#### Stage 2：Template Composition

由多個已核實 route blocks 拼成更多組合。

#### Stage 3：Constraint Solver

根據：

- 目的地
- 時間
- 里數
- 停留額
- 直航
- 季節線

自動排序。

#### Stage 4：可選 AI 層

只在規則引擎已經可以驗證答案之後，AI 負責：

- 理解自然語言
- 整理偏好
- 解釋方案

AI 唔可以成為唯一正確性來源。

## 13.7 Advanced Route Planner

現有功能係重要資產，應該保留。

適合：

- 已知機場
- 已知航段
- 想自己砌
- 想貼區頂
- 想驗停留／開口／轉機
- 想載入示範再改

長期改善方向：

- 清楚分「規則通過」同「實際有位」
- 路線風險摘要
- 季節線標記
- 自費開口成本欄
- 出票 checklist export
- 顧問服務入口

## 13.8 Saved Plans／My Progress

### 原則

主要內容係：

- 我儲低咗乜
- 下一步係乜
- 最終可以換到乜

唔係：

- 大量管理按鈕

### 卡片第一層

- 名稱
- 金額／里數
- 最有感結果
- 下一步
- 最近更新

### 低頻操作

- 開啟
- 分享
- 重新命名
- 置頂
- 刪除

放入 action sheet。

### 長期

將消費 plan、旅行 goal、行程 route 串成一條 timeline。

## 13.9 Offers & Guides

### Offers

時效性：

- 迎新加碼
- 限時優惠
- 平台 code
- 轉分 bonus
- 特別登記

第一屏必須先顯示：

- 門檻
- 回報
- 可以換到乜
- 截止日期
- 資料日期

### Guides

長青：

- 里數入門
- 信用卡分工
- 標準獎勵
- 環球票
- YQ
- 新手伏位

Guides 用嚟建立信任同完成決策，唔係首頁最前主角。

## 13.10 Consultant Service

### 入口時機

- Beginner matching 冇合適方案
- 用戶揀太多條件
- 多人複雜行程
- 環球票
- 想人手核對
- 想準備打電話出票

### 服務流程

```text
填簡短需求
→ 顯示服務範圍與價格
→ 付款
→ Founder 透過對話了解
→ 使用現有工具＋AI＋人工核實
→ 交付路線、里數、風險、出票資料
```

### 必須講清楚

- 係規劃服務
- 唔保證獎勵位
- 唔代替航空公司
- 最終出票以航空公司為準

---

# 14. Content Strategy

## 14.1 三層內容

### Acquisition Content

令人停低：

- 新產品
- 生活消費
- 時事
- 節日
- 家庭情景

### Conversion Content

令人相信同採取行動：

- 點樣計
- 推薦卡
- 迎新門檻
- 申請次序

### Trust Content

令人放心：

- 完整條款
- 官方來源
- 風險
- 伏位
- 資料更新紀錄

## 14.2 消費層級要有廣度

案例庫唔可以淨係：

- 結婚
- 裝修
- 幾十萬

要有：

- HK$5,000 左右
- HK$8,000 左右
- HK$10,000–20,000
- HK$20,000–50,000
- HK$50,000–100,000
- 人生事件

等唔同人第一眼都有一個同自己有關嘅入口。

## 14.3 示範卡標準格式

```text
情景：
金額：
按邊個公開條款：
大約可得：
可參考換：
資料日期：
優惠期限：
重要限制：
CTA：
```

## 14.4 禁止內容

- 未核實就話一定換到
- 用最高里數隱藏門檻
- 將示範方案叫真人成功案例
- 「免費機票」但唔講稅費
- 未核實保險、交稅、電子錢包交易資格
- 只為吸睛自行作出錯誤航線
- 只講信用卡名，冇生活結果

## 14.5 用戶案例

將來可以收集：

- 實際消費
- 實際申請卡
- 實際收到里數
- 實際兌換結果
- 用戶同意分享嘅圖片／故事

內容要清楚標記：

> 真人案例

而唔係：

> 根據條款推算

---

# 15. Data Trust System

## 15.1 每一項公開數據要有

- 資料來源
- 核實日期
- 有效期
- 計法
- 狀態
- 最後負責人
- 風險備註

## 15.2 狀態

建議內部資料狀態：

- `verified-active`
- `verified-expiring`
- `expired-archive`
- `needs-review`
- `unverified-draft`
- `official`
- `community-reported`

正式首頁只可以出：

- verified-active
- official

## 15.3 建議更新節奏

| 資料 | 最低檢查節奏 |
|---|---|
| 限時迎新／平台 code | 每週及到期前 |
| 信用卡基本條款 | 每月或銀行更新時 |
| 里數兌換表 | 官方改表後立即；平時定期 |
| 航線／季節線 | 發布前及重大 timetable 更新時 |
| YQ／稅費示範 | 清楚標記估算日期 |
| 社交示範案例 | 發布前重新計一次 |

## 15.4 可信度語言

建議：

- 「按現時公開條款推算」
- 「技術上可行嘅示範方案」
- 「資料截至」
- 「最終以銀行／航空公司為準」
- 「規則通過唔代表指定日期有位」

避免：

- 「一定」
- 「保證」
- 「免費」
- 「穩賺」
- 「100% 批」

---

# 16. Product & UX Principles

## 16.1 先展示價值，再問資料

> **Earn trust before asking anything.**

第一秒唔問：

- 年薪
- 有幾多錢
- 身份
- 登入
- 信用卡資料

先畀一個可信結果。

## 16.2 Result First

第一層回答：

- 使幾多
- 得幾多
- 換到乜

第二層先講方法。

## 16.3 資訊唔刪，恐懼感收起

> **Never remove information. Remove intimidation.**

重要細節一定保留，但逐層展開。

## 16.4 唔好迫用戶解讀

主要意思用文字。

唔好依賴：

- emoji
- 抽象 icon
- 玩家術語
- IATA code
- 內部產品術語

## 16.5 用戶揀目標，系統處理方法

> **Users choose goals. The system chooses the path.**

## 16.6 唔好用「大額消費」限制自己

用：

- 今次消費
- 呢筆消費
- 你會簽幾多

## 16.7 美感係信任

AcreMiles 係 consumer product。

第一版已經要：

- premium
- 乾淨
- 一致
- 有留白
- 唔似廉價 template
- 唔似 AI 自動生成頁

## 16.8 有摩擦唔代表唔做

唔係：

> 複雜，所以刪。

而係：

> 點樣重新設計，令普通人都做到？

## 16.9 一個畫面一個主要動作

避免同一屏：

- 五個同等 CTA
- 大量管理掣
- 一次過問所有資料

## 16.10 Mobile First

主要驗收：

- Samsung S24 Ultra
- 360px
- 390px
- 412／430px
- Chrome Android
- PWA
- 深色／淺色

## 16.11 冇資料唔好填滿 Empty State

收起，先顯示有用內容。

## 16.12 誠實勝過表面完整

做唔到：

- 即時獎勵位
- 真 AI 生成
- 精確 YQ
- 保證出票

就清楚講。

唔好用 wording 假扮已經做到。

---

# 17. AI Strategy

## 17.1 現階段決定

> **唔接收費 AI API。**

原因：

- 未證明用戶真正常見問題
- 規則可用 deterministic engine 處理
- API 會有持續成本
- 旅遊與金融結果需要可驗證
- 用戶買嘅係結果，唔係 AI

## 17.2 第一優先

- Rule engine
- Template matching
- Constraint solver
- 清楚輸入
- 人工顧問
- 現有 AI 工具由 Founder 幕後使用

## 17.3 將來接 AI 嘅門檻

同時滿足先研究：

1. Rule／template 明顯解決唔到大量真實問題
2. 每次 API 成本有收入覆蓋
3. 答案可以由規則引擎核實
4. 有清楚 fallback
5. 有私隱及資料政策
6. 唔會將 AI 幻覺變成錯誤財務／出票建議

## 17.4 AI 最適合做

- 將自然語言變成結構化偏好
- 問少量補充問題
- 解釋已有計算結果
- 幫顧問整理方案

AI 唔適合做唯一來源：

- 最新卡條款
- 真實獎勵位
- 最終票規判定
- 批卡預測
- 保證結果

---

# 18. Metric System

## 18.1 唔應只睇 Pageviews

Pageviews 唔代表改變行為。

## 18.2 建議 North Star Operating Metric

> **Monthly Reward-Directed Actions（每月有方向嘅回報行動）**

一次合格行動可以係：

- 完成個人計算並見到結果
- 儲存消費計劃
- 設定旅行目標
- 使用日常卡助手
- 睇卡詳情並前往申請
- 標記完成迎新
- 載入／儲存行程

呢個指標代表：

> 用戶唔只睇內容，而係用 AcreMiles 改變咗一個消費決定。

## 18.3 最重要 Outcome Metric

> **Verified／Self-reported First Wins**

例如：

- 已批卡
- 已收迎新
- 已入里
- 已換機票

## 18.4 Metric Tree

### Acquisition

- 社交貼文 CTR
- Landing bounce
- Outcome card detail click
- 分享率

### Activation

- 首頁示範 → 用自己金額計
- Calculator completion
- Result viewed
- Plan saved
- Goal set

### Conversion

- Card detail viewed
- Referral click
- Application started
- Self-reported approved

### Habit

- 7／30 日回訪
- 每月使用日常助手次數
- 每月計劃消費次數
- 有儲存卡組合嘅回訪率

### Redemption

- Redeem explorer use
- Goal completed
- Route saved
- Consultant inquiry
- Self-reported ticket redeemed

### Trust

- 過期內容曝光率
- 數據更正數
- Error rate
- 申訴／誤導回報
- 資料更新準時率

### Revenue

- Referral click-to-revenue
- Revenue per qualified plan
- Consultant inquiry conversion
- Revenue per active user

## 18.5 私隱

Analytics 只可在用戶同意後載入。

唔收：

- 金額原文
- 年薪
- 完整行程
- Email
- 卡號
- 敏感身份資料

事件只記：

- 完成咗邊一個步驟
- 來源頁
- 功能類型
- 粗略 bucket（如有需要且安全）

---

# 19. v6.79.0 Current State Audit

## 19.1 已完成嘅重要基礎

### 首頁

- 預設中間 tab 已由「旅程」變成「首頁」
- Header 已用「每筆消費，都值得有回報」
- Outcome-first hero 已存在
- 先展示 iPhone 消費示範，再邀請輸入自己金額
- 已有更多已核實消費示範橫列
- 已有單一目的地／多地方入口
- Saved sections 無資料時收起

### 計算器

- 「大額消費」已改為「今次消費」
- 第一層只問金額
- 年薪標記可選
- 其他條件逐步顯示
- 進階設定收起
- 結果頁已將「可以換到乜」放到推薦卡之前

### Saved Plans

- 已改成 compact 卡
- 低頻操作集中 bottom sheet
- 有開啟、分享、重新命名、置頂、刪除
- 舊 localStorage 資料保持兼容

### Planner

- 已有「幫我規劃」／「自己砌路線」gateway
- Beginner 第一版用目的地、活動、五條 route templates 配對
- 可以載入 Advanced Planner 修改
- 冇假裝使用 AI

### Content

- 已有 outcome-first 優惠文章 pilot
- 有多 tier 顯示
- 有「點樣做到／點樣計／完整規則」accordion
- 已有資料日期與期限

### Trust／Operations

- 目前清楚披露零 referral 收入
- GA／Sentry consent gating 保留
- 核心資料仍以 localStorage 為主
- 深色模式、PWA、分享、收藏等保留

## 19.2 v6.79.0 仍然未完成嘅產品閉環

### 1. 首頁示範數量太少

目前正式 scenario data 只有少量案例，未足以覆蓋：

- HK$5,000
- HK$8,000
- HK$10,000–20,000
- 中型家庭消費
- 人生事件
- 不同目的地

### 2. Hero 結果可信，但衝擊力未必係最強

目前 iPhone → 台北來回係合理起點。

長期要準備更多已核實、對唔同觀眾更有感嘅 outcome。

### 3. 冇 Goal & Progress

用戶計完之後，未有一個長期目標：

- 想換乜
- 仲差幾多
- 下一步做乜

### 4. 冇真正 First Win Tracking

系統唔知道：

- 用戶有冇申請
- 有冇批
- 有冇完成迎新
- 有冇入里
- 有冇換票

### 5. 日常習慣功能仍弱

現有日常儲分計算偏向「每月輸入」。

仍欠：

> 今次食飯／網購／海外簽賬，即刻話我知用邊張卡。

### 6. Beginner Planner 仍只係五條複雜模板

現時配對主要係環球／多城市示範。

未處理：

- 單一城市
- 兩三個城市
- 日期
- 日數
- 人數
- 艙等
- 已有里數

### 7. Referral 未接入

商業閉環仍未開始。

### 8. About 文案仍有舊定位

目前部分「關於 AcreMiles」內容仍然以「人生大事／大額消費」作主描述，未完全同步「每筆消費」新定位。

### 9. 舊介面仍有大量 emoji

新畫面已減少依賴 emoji，但舊文章、按鈕及 planner 仍有裝飾 emoji。

需要分階段清理，唔使為清理一次過重寫全站。

### 10. First-run Time to Value 仍有風險

現有 welcome 開場動畫標示每次開 app 播放，首次免責／consent 亦較長。

呢兩樣可能令用戶未見 outcome 前已經等待或進入防備狀態。

下一輪應實測：

- 幾多秒先見到第一張 outcome card
- splash 是否只需首次／縮短
- 法律與 consent 可否用更短第一層，再提供完整內容

### 11. 單一大型 `index.html` 風險增加

功能愈來愈多，長期風險：

- 改一處整壞另一處
- 數據散落
- Work context 太重
- 手機執行及維護困難
- QA 成本增加

唔需要立即改 framework，但要開始 data-first modularisation。

---

# 20. Product Roadmap

## Phase 0：Outcome-first Foundation

**狀態：v6.79.0 已完成第一版**

- 首頁 value-first
- Calculator progressive flow
- Result outcome
- Saved card action sheet
- Planner gateway
- Beginner template matching
- Outcome-first article pilot

## Phase 1：Stabilise & Make Consistent

建議候選版本：v6.80.x

### 目標

確保新方向全站一致、快、可信、可量度。

### 工作

- 真機完整 QA
- 修正上線後 bug
- 更新 About／FAQ／舊文案
- 檢查 first-run animation 與 disclaimer friction
- 補 6–12 個已核實消費 scenario
- 建立 scenario data register
- 清理過期優惠
- 為新 funnel 加 analytics events
- 量度 time-to-first-value
- 減少首頁同核心流程主要 emoji
- 檢查 S24 Ultra 效能與崩潰

### 完成標準

- 新用戶五秒內理解產品
- 所有首頁數字可追溯
- 無主要 broken flow
- 有第一輪 analytics baseline

## Phase 2：Goal & Progress

建議候選版本：v6.81.x

### 目標

計完一次之後，有理由返嚟。

### 工作

- 設定旅行目標
- 手動輸入現有里數
- 帶入預計可賺里數
- 顯示 gap
- Next Best Action
- 首頁 progress card
- Goal save／rename／share
- 清楚分已確認與預計

### 完成標準

用戶可以由：

> 我今次使 HK$8,000

一路去到：

> 我距離雙人日本來回仲差幾多，下一步應做乜。

## Phase 3：Daily Spend Assistant

建議候選版本：v6.82.x

### 目標

由 event-based app 變成經常打開嘅消費助手。

### 工作

- My Cards
- 今日消費快速入口
- 類別、本地／海外、網上／實體
- 最佳卡＋後備卡
- 登記／上限提醒
- 今次多賺幾多
- 對旅行目標進度影響

### 完成標準

用戶出去食飯前，可以十秒內得到答案。

## Phase 4：Transparent Referral Conversion

建議候選版本：v6.83.x

### 目標

開始形成可持續收入。

### 工作

- Referral partner setup
- 卡詳情 CTA
- 清楚披露
- 適合度排序與佣金分離
- Click tracking
- 「已申請」自我標記
- 申請後 checklist

### 完成標準

收入開始來自用戶已經理解並選擇嘅方案，而唔係硬 sell。

## Phase 5：First Win Loop

建議候選版本：v6.84.x

### 目標

幫用戶真係成功一次。

### 工作

- 已批核
- 已完成簽賬
- 已收到獎賞
- 已換到機票
- 進度提醒
- 成功故事邀請
- 下一個目標

### 完成標準

AcreMiles 唔只知道「有人計過」，而係知道有人真正食到著數。

## Phase 6：Beginner Planner Expansion + Concierge

建議候選版本：v6.85+／v7 前

### 工作

- 城市級輸入
- 日數
- 月份
- 人數
- 艙等
- 里數預算
- 更多 route blocks
- Constraint solver
- 無配對時顧問服務
- 顧問交付模板

## Phase 7：Reward Platform Expansion

將來：

- 酒店
- 升級
- Lounge
- 商品
- 禮券
- 其他 points

前提：

> 航空里數入口已經建立穩定流量、留存及收入。

---

# 21. 下一個 30 日建議

## Week 1：上線版本真機 Review

只收集：

- 邊度睇唔明
- 邊度太慢
- 邊個掣冇反應
- 邊個結果唔夠有感
- 邊度仍然似高手工具
- 邊度文字太多
- 邊度 UI 同原本 design language 唔一致

唔好即時逐點叫 Work 改。

先集中成一批。

## Week 2：Data & Content Pass

- 建立最少 8 個已核實 scenario
- 覆蓋不同金額層
- 每個有 source date／expiry／formula
- 更新 About 新定位
- 更新舊 FAQ
- 清理過期內容
- 設定內容更新責任表

## Week 3：Goal & Progress Prototype

先做 big picture：

- 一個目標卡
- 已有／預計／仲差
- 一個 Next Best Action
- 首頁 returning state

唔需要一開始接銀行戶口。

## Week 4：Daily Assistant Prototype

先做 rule-based：

- 我有邊幾張卡
- 今次食飯／超市／網購／海外
- 用邊張
- 點解
- 多賺幾多

先睇實物，再決定 v6.82 詳細做法。

---

# 22. Technical Direction

## 22.1 唔好立即重寫 Framework

現階段唔建議為咗「乾淨」而全面：

- React rewrite
- Next.js rewrite
- Database rewrite
- Backend account rewrite

風險大，未直接增加用戶價值。

## 22.2 Data-first Modularisation

優先將散落資料逐步集中：

```text
/data/cards.js
/data/offers.js
/data/scenarios.js
/data/redemptions.js
/data/routes.js
/data/sources.js
```

再逐步抽出：

```text
/scripts/store.js
/scripts/calculator.js
/scripts/planner.js
/scripts/home.js
/scripts/analytics.js
```

## 22.3 保持兼容

- 舊 localStorage 必須可讀
- Schema 變更要 migration
- PWA 不可無意破壞
- 深色模式保留
- 分享連結保留
- Consent 保留
- 每輪只拆一部分

## 22.4 建議新增文件

```text
docs/PRODUCT_BLUEPRINT_V2.md
docs/DATA_REGISTER.md
docs/DECISION_LOG.md
docs/RELEASE_CHECKLIST.md
docs/CONTENT_SCENARIOS.md
docs/ANALYTICS_EVENTS.md
```

## 22.5 效能

重點測：

- 首次開啟時間
- welcome animation
- 圖片大小
- Base64 資產
- DOM 數量
- 大型 inline script
- S24 Ultra Chrome
- PWA 更新 cache
- Work 長對話改動造成嘅回歸

---

# 23. Release Operating Model

## 23.1 Founder 唔需要睇 Code

Founder 主要驗收：

- Preview URL
- 手機實際使用
- Big picture
- 文案
- 數據
- Flow
- 美感

## 23.2 標準流程

```text
現時 main 完整備份
→ backup branch＋tag＋ZIP
→ feature branch
→ Work 完成一個完整 draft
→ Preview URL
→ Founder 一次過 Review
→ 第二輪修正
→ QA
→ Merge
→ Deploy
→ 24–48 小時監察
```

## 23.3 唔好邊睇邊碎改

建議：

- 日間傾產品、記 feedback
- 夜晚一次過交 Work 跑一個 section
- 第二日睇完整結果
- 再收集下一輪

避免手機 Work 長時間 run，亦避免版本不停變。

## 23.4 每次完成必須交付

- Preview URL
- 改咗乜
- 已知限制
- 自行假設
- 待核實數據
- Mobile QA
- Rollback
- Draft PR
- 唔自動 merge／deploy，除非明確批准

---

# 24. Feature Decision Framework

每個新功能要先回答：

## 1. 幫緊邊個 Stage？

- 陌生
- 好奇
- 計算
- 行動
- First Win
- Habit
- Redeem
- Advanced

## 2. 用戶第一眼得到乜？

必須係具體結果。

## 3. 用戶要提供幾多資料？

可唔可以先少後多？

## 4. 系統可唔可以代替佢處理複雜部分？

## 5. 數據可唔可以核實？

## 6. 點樣量度成功？

## 7. 對收入有咩合理關係？

## 8. 有冇破壞信任？

## 9. 如有摩擦，點重新設計？

唔係一見複雜就刪。

## 10. 如果做錯，可唔可以 rollback？

---

# 25. Non-goals

現階段唔追求：

- 成為完整 OTA
- 即時搜尋全球獎勵位
- 保證出票
- 全自動 AI 旅行社
- 一次過支援所有 rewards
- 大型會員系統
- 自動讀銀行交易
- 每張香港信用卡全部收錄
- 為 DAU 做無意義 notification
- 為 referral 收入犧牲推薦中立
- 為咗「功能多」將首頁塞滿

---

# 26. 尚未最終決定嘅事項

## 26.1 Account／跨裝置同步

預設：

> 暫時 local-first。

只有當：

- 用戶真係需要跨裝置
- Goal／My Cards 資料有長期價值
- 有能力處理安全與私隱

先建立帳戶。

## 26.2 Notification

預設先：

- Email opt-in
- App 內提醒

PWA push 之後按需求研究。

## 26.3 顧問服務定價

未定。

應先：

- 收集 10–20 個真實 inquiry
- 記錄平均時間
- 分簡單／複雜
- 再定價

## 26.4 Referral Partner

未定。

選擇標準：

- 條款清楚
- Tracking 可靠
- 支援香港申請
- 披露容易
- 唔要求扭曲排名

## 26.5 下一個 Reward 類別

預設：

> 飛行里數及機票先做好。

之後先按用戶需求決定酒店、升級、商品或禮券。

---

# 27. Success Definition

## 27.1 近期成功

- 新用戶五秒內明白 AcreMiles
- 普通 HK$5,000–20,000 消費都有可理解入口
- 用戶完成個人計算
- 用戶儲存計劃
- 首批 referral 轉化出現
- 第一批 First Win 被記錄

## 27.2 中期成功

- 用戶每月多次打開
- 日常助手成為主要回訪原因
- 用戶有旅行目標與進度
- 用戶真係完成迎新同兌換
- 有穩定 referral 收入
- 顧問服務有付費需求

## 27.3 長期成功

當香港人有一筆消費時，第一個自然反應係：

> **開 AcreMiles 睇下先。**

而佢介紹朋友時會講：

> **我本來買咗一樣嘢，最後換到一段旅行。**

---

# 28. Product Relationship Map

```text
社交生活情景
        ↓
Outcome Scenario
        ↓
自己金額計算
        ↓
Earn Plan
        ↓
卡推薦／Referral
        ↓
申請與迎新進度
        ↓
First Real Win
        ↓
設定旅行目標
        ↓
Daily Spend Assistant
        ↓
持續增加進度
        ↓
Redeem Explorer
        ↓
Beginner／Advanced Planner
        ↓
出票／顧問服務
        ↓
成功案例與分享
        └──────────────→ 新一輪社交流量
```

呢個先係完整 AcreMiles。

唔係任何單一 Calculator、文章、Planner 或信用卡頁。

---

# 29. 下一輪最重要嘅三個產品決定

v6.79.0 上線後，唔應該再立即做另一輪大改首頁。

下一輪優先次序：

## 第一：驗證 v6.79 真實體驗

先睇新首頁、計算、planner gateway 喺手機實際好唔好用。

## 第二：建立 Goal & Progress

令一次計算變成長期關係。

## 第三：設計 Daily Spend Assistant

令 AcreMiles 真正由「有一筆消費先用」變成「經常打開」。

Referral integration 可以與第二、第三項並行準備，但唔應該喺未建立信任前搶走產品主線。

---

# 30. 一頁式 Work 摘要

Work 每次接新任務前先記住：

1. AcreMiles 北極星係「每筆消費，都值得有回報」。
2. 先顯示生活結果，後講里數、卡同規則。
3. 用戶識旅行，唔識里數。
4. 用戶揀目的地、活動同目標；系統處理航司、機場、停留、開口同里數區。
5. 唔好用「大額消費」限制入口。
6. 唔好因為功能複雜就刪；重新設計到新手用得。
7. 資訊唔刪，分層收起。
8. Emoji 唔可以做主要語意。
9. 現有 Design Language 係資產，唔好推倒。
10. 所有數字要有來源、日期、期限與風險。
11. Referral 要透明，排序唔可以由佣金決定。
12. 目前唔接 AI API。
13. 下一個核心產品唔係再加文章，而係 Goal & Progress 同 Daily Spend Assistant。
14. 所有大改先 backup，再 branch，再 preview，未批唔 merge／deploy。
15. Founder 主要睇 Preview URL，唔要求 Founder review code。

---

# 31. Blueprint 更新規則

每當以下情況出現，要更新呢份文件：

- 產品定位改變
- 新主要用戶群出現
- 商業模式改變
- Referral 正式上線
- Goal／Daily Assistant 正式上線
- AI 策略改變
- Reward 類別由機票擴展
- Analytics 證明原本 70／30、90／10 假設錯誤
- 重大法律、私隱或資料架構改變

每次更新要寫：

- 改咗乜
- 點解
- 基於咩證據
- 影響邊個 roadmap
- 邊份 handoff 要同步

---

# 32. 最終產品原則

> **AcreMiles 唔係叫用戶學識一個複雜系統。**

> **AcreMiles 係用一個簡單、可信、靚、直接見到結果嘅介面，替用戶完成複雜系統。**

而所有長期產品決定，最後都要回到同一條問題：

> **呢樣嘢有冇令一個香港人更容易將本來會發生嘅消費，變成一個佢真正在乎嘅回報？**

如果有，就研究點樣做得簡單、可信、可持續。

如果冇，就唔應該因為功能聽落厲害而做。
