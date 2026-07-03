---
name: generate-key
description: 根据 Figma 文案内容，按 Domain.Page.Module.Title.Body 规则自动生成 Copy Key。提供文案位置或交互类型时检测精度更高。
metadata:
  trigger: 用户提到"生成key"、"命名规范"、"copy key"、"文案key"、或提供中文文案需要转key时
  inputs:
    - text: Figma中的中文文案内容（必填）
    - frameName: 所在Figma Frame名称（可选，用于Page段）
    - domain: 项目前缀（可选，默认HMH）
    - hint: 交互方式/位置的额外描述（可选，帮助Module判断）
    - relY: 在页面中的相对Y位置 0-1（可选）
  outputs:
    - key: 完整Key
    - segments: 各段分解说明
---

# Copy Key 生成规则

## 格式

```
Domain.Page.Module.Title.Body
```

- 驼峰格式（CamelCase）
- `.` 分隔
- 不可出现中文
- Body 可为空

---

## 各段规则

### Domain — 项目前缀

项目创建时固定。从用户提供的项目名推断，默认 `Hmh`。

常用值：`Hmh`, `Refund`, `PFC`

### Page — 页面名

根据 Figma Frame 名称生成。规则：
1. 去掉项目前缀（如 `HMH `、`PFC `）
2. 中文 → 翻译为英文
3. 英文 → 空格/连字符分隔 → 每词首字母大写
4. 取前 3 个单词

枚举参考：`HomePage`, `ListPage`, `CheckOutPage`, `PaymentPage`, `OrderConfirmPage`, `LandingPage`

### Module — 功能模块（26个枚举值）

按文案的交互方式/位置判断：

| 类别 | 枚举值 | 判断依据 |
|------|--------|----------|
| **Layer 容器** | `Modal` | 弹窗中的确认/取消/关闭按钮 |
| | `Sheet` | 底部/侧边抽屉面板中的文字 |
| | `PoPup` | 气泡浮层、轻量提示 |
| **Navigation 导航** | `NavigationBar` | 底部/顶部导航栏，短词（门票、餐饮、房间、交通、我的） |
| **Feedback 反馈** | `Toast` | 成功/失败/轻提示，短暂出现 |
| | `ActionBar` | 底部固定操作栏，CTA按钮区域 |
| **Form 表单** | `Switch` | 开关控件旁的文字 |
| | `RadioButton` | 单选框标签 |
| | `Checkbox` | 复选框标签 |
| | `TextField` | 文本输入框标签/占位 |
| | `Dropdown` | 下拉选择器标签 |
| | `Capsule` | 胶囊选择器 |
| | `Calendar` | 日期选择器 |
| **Function 功能** | `Icon` | 图标 |
| | `Button` | 按钮上的文字（支付、下单、预订、提交、取消） |
| | `Hyperlink` | 超链接（了解更多、查看详情、查看全部） |
| **Content 内容** | `Placeholder` | 输入框占位文字（请输入...） |
| | `Label` | 输入框旁标签，含冒号 |
| | `Title` | 页面/区块标题 |
| | `Subtitle` | 副标题、解释性文字 |
| | `Notes` | 长文本正文（>40字符）：政策、条款、说明 |
| | `Tooltip` | 悬停提示 |
| **Layout 布局** | `Banner` | 顶部横幅/头图区域文案 |
| | `ToDoList` | 待办/任务清单项 |
| | `KeyEntrance` | 核心入口/CTA |
| | `Upsell` | 追加销售/推荐（云闪付、银联、优惠、折扣） |
| | `Activity` | 活动模块（演出、巡游、庆典） |
| | `Facility` | 设施模块（行李寄存、健身房、泳池、餐厅） |
| | `TopTips` | 顶部提示条（须知、提示、注意、公告） |

### Title — 文案标题

从 Figma 中文文案翻译为英文 CamelCase。
- **最多 3 个英文单词**
- 可人工修改

常用翻译参考：
- 确认下单 → Confirmation
- 确认订单 → OrderConfirm
- 房间号 → RoomNum
- 订单号 → OrderNum
- 房型 → RoomType
- 总计 → TotalPrice
- 微信支付 → WeChatPay
- 行李寄存 → LuggageStorage
- 乐园半日票 → HalfDayTicket
- 常见问题 → FAQ
- 交通 → Transport
- 餐饮 → FNB

### Body — 补充说明

默认空。用于弹窗文案、政策条款等长文本。人工填写。

---

## 生成流程

1. 解析用户输入 → 提取：文案内容、Frame名、位置、交互类型
2. Domain：默认 `Hmh`，或从上下文推断
3. Page：从 Frame 名翻译，限 3 词
4. Module：按交互类型判断 → 匹配枚举表 → 不确定时优先 `Button`/`Label`/`Notes`
5. Title：中文翻译为英文 CamelCase，限 3 词
6. Body：留空

---

## 示例

### 示例 1
- 输入：文案="确认下单", Frame="HMH Check Out Page", 位置=底部, 交互=CTA按钮
- Domain: `Hmh`
- Page: `CheckOutPage`
- Module: `Button`（按钮上的文字）
- Title: `Confirmation`
- Body: _(空)_
- → **`Hmh.CheckOutPage.Button.Confirmation`**

### 示例 2
- 输入：文案="行李寄存服务：酒店前台提供行李寄存，了解更多", Frame="HMH Home Page", 位置=顶部
- Domain: `Hmh`
- Page: `HomePage`
- Module: `Banner`（顶部横幅长文案）
- Title: `LuggageStorage`
- Body: _(空)_
- → **`Hmh.HomePage.Banner.LuggageStorage`**

### 示例 3
- 输入：文案="房间号", Frame="HMH Home Page", 位置=底部, 交互=导航栏
- Domain: `Hmh`
- Page: `HomePage`
- Module: `NavigationBar`（底部导航栏短词）
- Title: `RoomNum`
- Body: _(空)_
- → **`Hmh.HomePage.NavigationBar.RoomNum`**

### 示例 4
- 输入：文案="每间客房最多可入住2位成人及2位11周岁以下儿童", Frame="HMH Check Out Page", 交互=政策说明
- Domain: `Hmh`
- Page: `CheckOutPage`
- Module: `Notes`（长文本政策说明）
- Title: `MaxGuestPerRoom`
- Body: _(可填完整政策原文)_
- → **`Hmh.CheckOutPage.Notes.MaxGuestPerRoom`**

### 示例 5
- 输入：文案="请在 14:45 内完成支付，否则订单将失效", Frame="Payment Page", 位置=顶部
- Domain: `Hmh`
- Page: `PaymentPage`
- Module: `TopTips`（顶部提示条）
- Title: `PaymentTimeout`
- Body: _(空)_
- → **`Hmh.PaymentPage.TopTips.PaymentTimeout`**
