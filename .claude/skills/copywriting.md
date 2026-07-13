---
name: copywriting
description: 基于 Key 类型和三层上下文（项目背景→User Flow→字段描述），按迪士尼文案规范自动生成中英文 UI 文案。同时检查合规性。
metadata:
  trigger: 用户提到"写文案"、"生成copy"、"copywriting"、提供 Key 需要填文案时
  inputs:
    - keyName: 完整的 Key 名称（如 Hmh.CheckOutPage.Button.Confirmation）
    - module: Module 类型（Button/Error/Title/Modal/Toast/Label/Link/Text/Confirm）
    - figmaText: Figma 中的原始中文草稿文案（可选）
    - projectContext: 项目背景描述（Layer 1，必填）
    - userFlow: 当前 User Flow 描述（Layer 2，必填）
    - fieldHint: 字段级提示（Layer 3，必填）：触发条件、交互行为、状态变化
  outputs:
    - zh-CN: 中文文案
    - en-US: 英文文案
    - compliance_check: 合规检查结果（通过/需注意/违规）
---

# UI Copywriting Skill

> 规则来源：copy-style-guide.md（基于 166,616 条已上线文案）+ compliance-experience-rules.json（15 条合规规则）

---

## 工作流程

### Layer 1：项目背景（Producer 提供）
理解项目的整体语境：是什么产品、面向什么用户、什么平台、品牌调性。

### Layer 2：User Flow 描述（Producer 提供）
理解当前文案所在的用户流程：用户在做什么、从哪来、到哪去。

### Layer 3：字段级提示（Producer 提供）
理解具体点位：什么条件下触发、什么交互类型、有哪些状态、点击后去哪里。

---

## 按 Module 类型的文案生成规范

### Button

| 维度 | 中文 | English |
|------|------|---------|
| 长度 | 2-6 字 | 1-3 词 |
| 句式 | 动词 + 名词 | Imperative verb phrase |
| 语气 | 直接、可行动 | Direct, actionable |
| 标点 | 无句号 | No period |

生成原则：
- 中文：动词开头，描述点击后发生的动作
- 英文：Verb + Noun，如 "Place Order"、"Add Guest"
- 避免：模糊词如"好的"、"知道了"（仅轻量确认场景可用）
- 示例：确认下单→Confirmation、取消订单→Cancel Order、去支付→Pay Now

### Error

| 维度 | 中文 | English |
|------|------|---------|
| 长度 | 10-50 字 | 5-25 词 |
| 句式 | 问题描述 + 建议操作 | Problem + suggested action |
| 语气 | 抱歉但不卑微 | Apologetic but professional |
| 标点 | 句号结尾 | Period |

生成原则：
- 结构：发生了什么 + 用户可以做什么
- 中文开头："抱歉，" / "很抱歉，" / 直接描述问题
- 英文开头：避免 "Error!"，用 "Sorry," 或直接描述
- 不暴露技术细节
- 示例：改期失败，请稍后再试。→ Date change failed, please try again later.

### Title

| 维度 | 中文 | English |
|------|------|---------|
| 长度 | 3-20 字 | 2-8 词 |
| 句式 | 名词短语 | Noun phrase |
| 语气 | 中性、信息性 | Neutral, informative |
| 标点 | 无 | 无 |

生成原则：
- 中文：名词短语，不加"的"/"了"/"吗"
- 英文：Title Case
- 不做完整句
- 示例：我的订单→My Orders、价格详情→Price Details

### Modal

| 维度 | 中文 | English |
|------|------|---------|
| 长度 | 50-200 字 | 20-80 词 |
| 句式 | 标题 + 正文 + 按钮 | Title + Body + Buttons |
| 语气 | 解释性、引导性 | Explanatory, guiding |

生成原则：
- 三段式：标题（一句概括）→ 正文（≤3 句，解释+影响）→ 按钮（明确选择）
- 涉及扣款/取消等敏感操作必须明确告知后果
- 金额/日期用变量：{amount}、{date}

### Toast

| 维度 | 中文 | English |
|------|------|---------|
| 长度 | 15-50 字 | 8-25 词 |
| 句式 | 状态 + 补充说明 | Status + additional info |
| 语气 | 简短友好 | Brief, friendly |

生成原则：
- 成功：简洁描述（不加"成功"，用绿色图标传达）
- 失败：告知原因 + 建议
- 中性：状态告知，不加情绪
- 示例：已添加到购物车→Added to cart、网络连接失败，请检查网络后重试→Network error, please check your connection and try again

### Label

| 维度 | 中文 | English |
|------|------|---------|
| 长度 | 3-20 字 | 2-8 词 |
| 句式 | 名词/名词短语 | Noun phrase |
| 语气 | 中性 | Neutral |

生成原则：
- 字段名 + 说明格式：`字段名：说明文字`
- 含变量用 {n} 而非 {number}

### Link

| 维度 | 中文 | English |
|------|------|---------|
| 长度 | 5-40 字 | 3-10 词 |
| 句式 | 动词短语 | Action phrase |

生成原则：
- 中文：动词 + 名词，描述跳转后的内容
- 英文：Verb + Noun
- 金额相关链接展示优惠额度
- 示例：查看条款及细则→View Terms and Conditions

### Confirm

| 维度 | 中文 | English |
|------|------|---------|
| 长度 | 4-30 字 | 2-10 词 |
| 句式 | 状态描述 | Status statement |

生成原则：
- 成功：简洁状态词 + 可选补充。如"兑换成功"
- 等待中：明确状态 + 预计时间。如"处理中，预计 5 分钟内完成"

---

## 通用写作规则

### 语气与用词
- 中文：用"您"（不用"你"），友好但专业
- 英文：Active voice, warm but professional
- 统一术语：乐园=Park、酒店=Hotel、门票=Ticket、优惠券=Coupon、订单=Order、游客=Guest、预订=Book、退款=Refund、年卡=Annual Pass

### 标点符号
- 中文：全角标点 ，。：…… 禁用感叹号
- 英文：半角标点 ,.:... Avoid exclamation marks
- 按钮/标签/标题：无句号
- 完整句/错误提示/弹窗正文：句号结尾

### 数字格式
- 金额：¥1,239.00（带 2 位小数）
- 中文日期：2024年8月16日
- 英文日期：August 16, 2024
- 电话：+86 21 XXXX XXXX

### 变量占位符
- 用 camelCase：{couponName}、{discountAmount}
- 通用变量：{n}=数量、{amount}=金额、{date}=日期
- 中文变量前后加空格：`最高优惠 ¥{discountAmount}`
- 英文变量不加空格：`save up to ¥{discountAmount}`

---

## 合规检查清单

生成文案后逐项检查：

### HIGH 优先级
- [ ] 无广告法禁用词（最、第一、唯一、国家级、顶级、极致、绝对）
- [ ] 国家/地区表述正确（下拉用"国家及地区"，台港澳前加"中国"）
- [ ] 无敏感信息泄露（身份证号、手机号、银行卡号）
- [ ] 无暴恐/色情/违禁品等不良信息内容
- [ ] 品牌视觉规范（Logo、色彩、字体使用符合规范）

### MEDIUM 优先级
- [ ] 金融/医疗/教育类无违规承诺（保本、治愈率、升学率）
- [ ] 无跨境数据传输风险
- [ ] 版权素材合规
- [ ] 商标使用正确（®/™）
- [ ] 促销规则明确、无误导
- [ ] 内容符合地域文化习俗

### LOW 优先级
- [ ] 数据使用描述与隐私政策一致
- [ ] 符合各渠道发布格式
- [ ] 版本归档管理

---

## 生成示例

### 示例 1: Button
```
输入:
  keyName: Hmh.CheckOutPage.Button.Confirmation
  module: Button
  figmaText: 确认下单
  projectContext: 酒店宾客自助服务，微信扫码访问，无需登录
  userFlow: 访客点单流程最后一步，用户已选择商品并确认金额
  fieldHint: 底部固定按钮，点击后提交订单进入支付页；disabled 态为购物车为空时

输出:
  zh-CN: 确认下单
  en-US: Place Order
  compliance_check: 通过
```

### 示例 2: Error
```
输入:
  keyName: Hmh.CheckOutPage.Error.PaymentFailed
  module: Error
  figmaText: (无)
  projectContext: 同上
  userFlow: 支付环节失败，用户已进入第三方支付页面但支付未完成
  fieldHint: 支付失败时弹出 Toast，用户需重新选择支付方式

输出:
  zh-CN: 抱歉，支付未完成。请重新选择支付方式。
  en-US: Sorry, payment was not completed. Please select another payment method.
  compliance_check: 通过
```

### 示例 3: Modal
```
输入:
  keyName: Hmh.CheckOutPage.Modal.CancelOrder
  module: Modal
  figmaText: (无)
  projectContext: 同上
  userFlow: 结算页用户点击取消订单
  fieldHint: 弹窗，标题"取消订单"，正文解释扣费规则，两个按钮"我再想想"和"确认取消"

输出:
  zh-CN:
    标题: 取消订单
    正文: 按照酒店取消规则，现在取消该订单将收取首晚房费（包含服务费和税费）。确认取消吗？
    按钮: [我再想想] [确认取消]
  en-US:
    标题: Cancel Order
    正文: Per the hotel cancellation policy, the first night's room rate (inclusive of service fee and tax) will be charged if you cancel now. Are you sure?
    按钮: [Keep Order] [Cancel Order]
  compliance_check: 通过（已明确告知扣费金额和原因）
```

### 示例 4: 广告法合规触发
```
输入:
  keyName: Hmh.HomePage.Banner.BestHotel
  module: Banner
  figmaText: 最好的酒店体验
  projectContext: 同上
  userFlow: 首页顶部 Banner
  fieldHint: 营销 Banner，宣传酒店住宿体验

输出:
  zh-CN: 奇妙酒店之旅（注：原文"最好"违反广告法，建议改为"奇妙"或"精彩"）
  en-US: A Magical Hotel Stay
  compliance_check: 违规 — 原文含"最好"，属广告法禁用词。已替换为合规表述。
```
