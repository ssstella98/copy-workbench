# Producer Copy Key — 生成规则 V1

## 1. 总则

| 项目 | 规则 |
|------|------|
| 格式 | 驼峰（CamelCase），4-5 段式 |
| 结构 | `Domain.Page.Module.Title.Body` |
| 语言 | **不可出现中文**，全文英文 |
| 分隔符 | `.`（英文句号） |

### 范例

```
HMH.ListPage.Banner.HotelShop
HMH.CheckOut.KeyEntrance.Confirmation
HMH.Homepage.NavigationBar.RoomNum
HMH.Payment.Button.WeChatPay
```

---

## 2. Domain

| 属性 | 内容 |
|------|------|
| 定义 | 哪一个业务/项目 |
| 生成规则 | 项目创建时固定，同一个项目所有 Key 共用同一个 Domain |
| 是否可修改 | 否（项目级别固定） |

### 枚举值示例

| Domain | 项目 |
|--------|------|
| `HMH` | Hotel Magic Hub |
| `Refund` | 退款系统 |
| `PFC` | Pass & Food & Commodity |

---

## 3. Page

| 属性 | 内容 |
|------|------|
| 定义 | 具体哪一个页面 |
| 生成规则 | 直接读取 Figma Frame 名称，英文直接用（CamelCase），中文翻译为英文 |
| 是否可修改 | 是（可人工调整） |
| 字数限制 | 最多 3 个英文单词 |

### 生成规则

1. 提取 Figma Frame 的原始名称
2. 去除项目前缀（如 HMH、PFC、Refund 等）
3. 去除空格、连字符、下划线
4. 如果是中文 → 使用翻译表翻译为英文（参考 Title 翻译表）
5. 如果是英文 → 保留，转为 CamelCase
6. 截取前 3 个单词

### 范例

| Figma Frame 名称 | → Page |
|------------------|--------|
| `HMH Home Page` | `HomePage` |
| `HMH Check Out Page` | `CheckOutPage` |
| `Payment Page` | `PaymentPage` |
| `HMH Product List Page` | `ProductListPage` |
| `首页` | `HomePage` |
| `结算页` | `CheckOutPage` |
| `Shopping cart` | `ShoppingCart` |

---

## 4. Module

| 属性 | 内容 |
|------|------|
| 定义 | 具体页面上的功能模块或独立的文案点位。功能模块帮助快速定位含多个元素的聚合组件；独立文案点位用于不构成功能模块的单体文案 |
| 生成规则 | 根据 Text 点位所处的 UI 交互方式自动判断，参考下方枚举值映射表 |
| 是否可修改 | 否（仅可选枚举值，不可自定义） |

### 枚举值（共 26 个，按类别分组）

#### Layer — 容器/层级

| 值 | 说明 |
|----|------|
| `Modal` | 模态框，浮层弹窗需用户操作才能关闭 |
| `Sheet` | 抽屉，从底部/右侧/左侧拉出的面板 |
| `PoPup` | 气泡弹窗，轻量级浮层，点击其他区域可关闭 |

#### Navigation — 导航

| 值 | 说明 |
|----|------|
| `NavigationBar` | 导航栏，顶部或底部的页面间导航 |

#### Feedback — 反馈

| 值 | 说明 |
|----|------|
| `Toast` | 轻提示，短暂出现后自动消失的通知 |
| `ActionBar` | 操作栏，底部固定的 CTA / 操作按钮区域 |

#### Form — 表单控件

| 值 | 说明 |
|----|------|
| `Switch` | 开关 |
| `RadioButton` | 单选框 |
| `Checkbox` | 复选框 |
| `TextField` | 文本输入框 |
| `Dropdown` | 下拉框 |
| `Capsule` | 胶囊选择器 |
| `Calendar` | 日历/日期选择器 |

#### Function — 功能入口

| 值 | 说明 |
|----|------|
| `Icon` | 图标 |
| `Button` | 按钮 |
| `Hyperlink` | 超链接 |

#### Content — 文本内容

| 值 | 说明 |
|----|------|
| `Placeholder` | 占位文本，输入框内提示文字，输入后消失 |
| `Label` | 标签，输入框旁的说明文字，不随输入消失 |
| `Title` | 标题，可在任一层级承载标题作用 |
| `Subtitle` | 副标题，位于 Title 下方的解释性文字，较少使用 |
| `Notes` | 普通文案/正文 |
| `Tooltip` | 鼠标悬停注释/提示气泡 |

#### Layout — 布局/业务模块

| 值 | 说明 |
|----|------|
| `Banner` | 横幅/头图区域 |
| `ToDoList` | 待办/任务清单 |
| `KeyEntrance` | 核心入口 / CTA 区域 |
| `Upsell` | 追加销售/推荐模块 |
| `Activity` | 活动模块 |
| `Facility` | 设施介绍模块 |
| `TopTips` | 顶部提示条 |

---

## 5. Title

| 属性 | 内容 |
|------|------|
| 定义 | 文案标题/字段简称 |
| 生成规则 | 根据 Figma 中 Text 点位的中文内容，自动翻译为英文，**不超过 3 个单词** |
| 是否可修改 | 是（可人工调整） |

### 范例

| Figma 文案 | → Title |
|------------|---------|
| 房间号 | `RoomNum` |
| 订单号 | `OrderNum` |
| 房型 | `RoomType` |
| 乐园门票 | `Ticket` |
| 餐饮 | `FNB` |
| 优惠券 | `Coupon` |
| 交通 | `Transport` |
| 权益 | `Benefit` |
| 常见问题 | `FAQ` |
| 设施 | `Amenities` |
| 确认下单 | `Confirmation` |
| 行李寄存 | `LuggageStorage` |
| 酒店商城 | `HotelShop` |

---

## 6. Body

| 属性 | 内容 |
|------|------|
| 定义 | 具体描述/补充说明，如弹窗文案等长文本 |
| 生成规则 | 默认留空 |
| 是否可修改 | 是（可人工填写） |
| 是否必填 | 否 |

---

## 7. 完整示例

### 示例 1：酒店首页房间号标签

```
HMH.HomePage.NavigationBar.RoomNum
```

| 段 | 值 | 来源 |
|----|-----|------|
| Domain | `HMH` | 项目固定 |
| Page | `HomePage` | Figma Frame "HMH Home Page" → 去前缀 → HomePage |
| Module | `NavigationBar` | 底部导航栏中的文字 |
| Title | `RoomNum` | Figma 文案"房间号" → 英文翻译 |
| Body | _(空)_ | 非长文本，留空 |

### 示例 2：结算页确认按钮

```
HMH.CheckOutPage.KeyEntrance.Confirmation
```

| 段 | 值 | 来源 |
|----|-----|------|
| Domain | `HMH` | 项目固定 |
| Page | `CheckOutPage` | Figma Frame "HMH Check Out Page" → 去前缀 → CheckOutPage |
| Module | `KeyEntrance` | 核心 CTA 按钮区域 |
| Title | `Confirmation` | Figma 文案"确认下单" → 英文 |
| Body | _(空)_ | — |

### 示例 3：支付页微信支付入口

```
HMH.PaymentPage.Button.WeChatPay
```

| 段 | 值 | 来源 |
|----|-----|------|
| Domain | `HMH` | 项目固定 |
| Page | `PaymentPage` | Figma Frame "Payment Page" → 去前缀 → PaymentPage |
| Module | `Button` | 按钮交互 |
| Title | `WeChatPay` | Figma 文案"微信支付" → 英文 |
| Body | _(空)_ | — |
