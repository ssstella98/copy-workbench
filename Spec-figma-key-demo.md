# Producer Copy Workbench — Spec

> 版本：v3.0 · 日期：2026-07-12 · 状态：前端原型 / 后端待开发

---

## 1. 产品概述

面向 Digital Producer 的文案管理工作台前端原型，覆盖从 Figma 设计稿到最终文案的全流程。

**两大核心模块：**

| 模块 | 功能 | 输入 | 输出 |
|------|------|------|------|
| **Key Generator** | Figma → 自动识别 TEXT → 生成 Key | Figma URL + Token | 完整的 `Domain.Page.Module.Title.Body` Key 列表 |
| **Copywriting** | Key → 基于三层 Prompt + 文案规范 → AI 生成中/英文案 | Key 列表 + 项目背景 + User Flow + 字段提示 | 中/英/日文案 |

### 1.1 技术概况

- 单文件 HTML + Vanilla JS
- 浏览器本地存储：localStorage（项目列表）+ IndexedDB（Figma 数据 + Key 数据 + 文案数据）
- 外部 API：Figma REST API、混元 API（AI 翻译 + AI 写文案）
- 规则配置：`Key Rules/key-rules-config.json`（Key 生成）、`Copy Parking-lot/copy-rules.json`（文案规范）
- Claude Code Skills：`generate-key`、`copywriting`

---

## 2. 页面与交互流程

### 2.1 入口：项目列表页

用户打开平台后看到的第一个页面。

**展示内容：**
- 顶部 Header：`Producer Copy Workbench` + 「+ 新建项目」按钮
- 项目卡片网格：每张卡片显示项目名称、Domain、Figma 关联状态、最近更新时间
- 空状态：无项目时显示引导文案和创建按钮

**交互：**

| 操作 | 触发 | 行为 |
|------|------|------|
| 新建项目 | 点击「+ 新建项目」 | 弹出模态框，填写名称、Domain、Figma URL（可选）、Token（可选） |
| 编辑项目 | 卡片上「✏️ 编辑」 | 同上，预填已有数据 |
| 删除项目 | 卡片上「🗑 删除」 | 确认弹窗 → 从 localStorage 和 IndexedDB 中移除项目及关联数据 |
| 进入项目 | 点击卡片 | 跳转工作区，默认打开 Key Generator Tab，自动加载 IndexedDB 缓存数据 |

---

### 2.2 项目工作区

进入项目后的主操作界面。Header 中显示两个 Tab：

| Tab | 功能 | 可用条件 |
|-----|------|----------|
| 🔑 Key Generator | Figma 集成 + Key 生成 + Key 编辑 | 始终可用 |
| ✏️ Copywriting | 基于 Key 填写中/英文案 | Key Generator 已保存后方可用（否则灰色） |

---

## 3. Key Generator Tab

（保留现有 demo 全部功能，以下为摘要，详见 v2.0 spec）

### 3.1 布局

```
┌─ Toolbar ────────────────────────────────────┐
│ Figma URL | Token | [加载] [同步] | JSON CSV 导出 │
├─ 页面选择器（条件显示）─────────────────────────┤
├─ 工作区 ──────────────────────────────────────┤
│ ┌ 侧栏 ──┬─ Figma 预览 ──┬─ Key 表格 ───────┐│
│ │📁 Upsell│  (sticky)    │ #│Key│Page│Mod│Tit││
│ │  ├Frame │  [◀ 1/5 ▶]  │                   ││
│ └─────────┴──────────────┴───────────────────┘│
└──────────────────────────────────────────────┘
```

### 3.2 核心功能

- Figma 文件加载 → CANVAS/Frame 扫描 → 页面选择器 → TEXT 节点提取
- `Domain.Page.Module.Title.Body` Key 自动生成
- Module 26 个枚举值，关键词 + 位置自动检测
- Title 四级 fallback：精确匹配 → 子串匹配 → 贪心拆词 → AI 翻译
- 字段隐藏/删除、Frame 间翻页、hover 预览联动
- 导出 JSON / CSV
- 保存到 IndexedDB

### 3.3 数据过滤

- 动态数据自动排除（纯数字、日期、时间、邮箱、单符号）
- Frame 跳过规则（iPhone 设备框、封面页）

---

## 4. Copywriting Tab

### 4.1 整体架构：三层 Prompt

```
┌─ Layer 1 · 项目背景 ─────────────────────────────┐
│ 全局语境：什么产品、面向谁、什么平台、品牌调性       │
│ 位置：独占一行，Header 下方                        │
│ 作用域：整个项目                                   │
├─ Layer 2 · User Flow 描述 ────────────────────────┤
│ 流程语境：用户在当前流程中做什么、从哪来、到哪去     │
│ 位置：左侧栏，页面目录下方                          │
│ 作用域：按 Figma CANVAS（Page）级别匹配             │
│ 切换 CANVAS 时自动切换对应 Flow 描述                │
│ 可折叠收起                                        │
├─ Layer 3 · 字段级提示 ────────────────────────────┤
│ 点位语境：触发条件、交互行为、状态变化、跳转目标     │
│ 位置：文案编辑表格上方（Layer 3 bar）               │
│ 作用域：单个 Key                                    │
│ 通过每行 🤖 按钮打开弹窗填写                          │
└────────────────────────────────────────────────────┘
```

### 4.2 布局

```
┌─ Header ───────────────────────────────────────────┐
│ ← 列表 | 项目名 | [🔑 Key Gen] [✏️ Copywriting] | 💾  │
├─ Layer 1 + AI 批量 CTA ────────────────────────────┤
│ 📋 项目背景: [textarea]     [🤖 AI批量生成] [🔍 合规] │
├─ 三栏工作区 ────────────────────────────────────────┤
│ ┌ 左栏 ─────────┬─ 中栏 ────────┬─ 右栏 ─────────┐ │
│ │📁 页面目录     │ 📱 Figma 预览 │ 💬 Layer3 bar   │ │
│ │ ▼ Upsell      │  (sticky)     │ #│Key│💬│中│EN│🤖││
│ │  ├ Home       │               │  │   │  │  │  │  ││
│ │  ├ Checkout●  │               │  │   │  │  │  │  ││
│ ├───────────────┤               ├─────────────────┤ │
│ │🔄 Layer 2     │               │                 │ │
│ │ User Flow     │               │                 │ │
│ │ [textarea]    │               │                 │ │
│ │📍 当前: Upsell│               │                 │ │
│ └───────────────┴───────────────┴─────────────────┘ │
└────────────────────────────────────────────────────┘
```

### 4.3 Layer 1 — 项目背景

| 属性 | 内容 |
|------|------|
| 位置 | Header 下方，独占一行 |
| 内容 | Textarea，描述项目的整体背景 |
| 作用 | 为所有 AI 文案生成提供全局语境 |
| 保存 | 随项目保存到 IndexedDB |

### 4.4 Layer 2 — User Flow 描述

| 属性 | 内容 |
|------|------|
| 位置 | 左侧栏底部，页面目录下方 |
| 作用域 | 按 Figma CANVAS 级别（如 Upsell、Check-in）匹配 |
| 交互 | 切换页面目录中不同 CANVAS 时，Layer 2 textarea 切换为对应 Flow 描述 |
| 可折叠 | 点击标题收起/展开 |
| 保存 | 每个 CANVAS 独立保存一段 Flow 描述 |

### 4.5 Layer 3 — 字段级提示

| 属性 | 内容 |
|------|------|
| 位置 | 文案编辑表格上方（Layer 3 bar） |
| 展示 | 已填写提示的字段以 chip 形式展示（`#1 确认下单`） |
| 入口 | 点击每行末尾的 🤖 按钮，弹出 AI 写文案弹窗 |
| 弹窗内容 | Key 信息 + Module 类型 + Figma 草稿 + 提示词 textarea |
| 保存 | 每个字段独立保存其提示词 |

### 4.6 文案编辑表格

**表头：** `# | Key Name | 提示 | 🇨🇳 中文 | 🇺🇸 English | 合规 | AI`

| 列 | 编辑方式 | 说明 |
|----|---------|------|
| # | 只读 | 字段序号 |
| Key Name | 只读 | 完整 Key，等宽字体 |
| 提示 | 只读 | 💬 = 已填写 Layer 3 提示词 |
| 🇨🇳 中文 | 文本输入 | 预填 Figma 原文，可编辑。AI 生成后绿色背景 |
| 🇺🇸 English | 文本输入 | 默认空，AI 生成后绿色背景 |
| 合规 | 只读 | ✓ 通过 / ⚠ 建议 / ✗ 违规 |
| AI | 按钮 | 🤖 打开 AI 写文案弹窗 |

**筛选：** 「仅显示未完成」checkbox — 仅展示英文为空的字段

### 4.7 AI 写文案弹窗

点击每行 🤖 按钮触发。弹窗内容：

```
┌─ 🤖 AI 写文案 ──────────────────────────────┐
│ Key: Hmh.CheckOutPage.Button.Confirmation   │
│ Module: Button · Figma草稿: 确认下单         │
│                                             │
│ 💬 Layer 3 · 字段提示                        │
│ [textarea: 描述交互细节]                      │
│                                             │
│ [🪄 生成文案]                                │
│                                             │
│ 🇨🇳 中文: [确认下单]  🇺🇸 EN: [Place Order]  │
│                                             │
│ ✅ 合规检查通过 · 无广告法禁用词               │
│                                             │
│ [取消] [✅ 确认并填入表格]                    │
└─────────────────────────────────────────────┘
```

交互：
1. 填写/修改 Layer 3 提示词
2. 点击「🪄 生成文案」→ 调用 混元 API（基于 copywriting skill 规则 + 三层 prompt）
3. AI 返回中/英文案 → 展示在结果输入框（可手动修改）
4. 同步展示合规检查结果
5. 点击「✅ 确认并填入表格」→ 文案写入表格，关闭弹窗

### 4.8 AI 批量生成

顶部「🤖 AI 批量生成文案」按钮：
- 收集所有已填写 Layer 3 提示词的字段
- 逐条调用 AI 生成中/英文案
- 生成结果以绿色背景填入表格
- 完成后弹出合规审查结果

### 4.9 AI 合规审查

顶部「🔍 AI 合规审查」按钮：
- 对当前页面所有已填写文案逐条检查
- 检查项：广告法禁用词、国家/地区表述、敏感信息、句式规范、标点规范
- 结果分三级：✅ 通过 / ⚠ 建议（可一键应用）/ ✗ 违规（需手动修改）

---

## 5. Key 生成规则

### 5.1 结构

`Domain.Page.Module.Title.Body` · 驼峰格式 · `.` 分隔 · 不可中文

### 5.2 Domain

项目创建时固定。示例：`HMH`、`Refund`、`PFC`

### 5.3 Page

直接读取 Figma Frame 名称 → 去项目前缀 → 中文翻译 → CamelCase → ≤3 词

示例：`HMH Home Page` → `HomePage`

### 5.4 Module

26 个枚举值，按 UI 交互方式自动检测，不可自定义。

| 类别 | 值 |
|------|-----|
| Layer | Modal, Sheet, PoPup |
| Navigation | NavigationBar |
| Feedback | Toast, ActionBar |
| Form | Switch, RadioButton, Checkbox, TextField, Dropdown, Capsule, Calendar |
| Function | Icon, Button, Hyperlink |
| Content | Placeholder, Label, Title, Subtitle, Notes, Tooltip |
| Layout | Banner, ToDoList, KeyEntrance, Upsell, Activity, Facility, TopTips |

检测规则：关键词匹配（配置于 `key-rules-config.json`） → 位置 + 长度兜底

### 5.5 Title

四级 fallback：精确匹配 → 最长子串匹配 → 贪心拆词翻译 → AI 翻译 → 留空

≤3 英文单词，CamelCase。

### 5.6 Body

默认空，人工填写长文本。

---

## 6. 文案撰写规范

### 6.1 数据基础

基于 166,616 条已上线文案（38 个版本文件，覆盖 20+ 项目）提炼。

### 6.2 按类型的规范

| 类型 | 中文长度 | 英文长度 | 句式 | 标点 |
|------|----------|----------|------|------|
| Button | ≤6 字 | ≤3 词 | 动词短语 / Imperative | 无 |
| Error | 10-50 字 | 5-25 词 | 问题+建议 / Problem+suggestion | 句号 |
| Title | 3-20 字 | 2-8 词 | 名词短语 | 无 |
| Modal | 50-200 字 | 20-80 词 | 标题+正文+按钮 | 句号 |
| Toast | 15-50 字 | 8-25 词 | 状态+补充 | 视情况 |
| Label | 3-20 字 | 2-8 词 | 名词短语 | 无 |
| Link | 5-40 字 | 3-10 词 | 动词短语 | 无 |
| Confirm | 4-30 字 | 2-10 词 | 状态描述 | 无 |

### 6.3 通用规则

- 中文用"您"，不用"你"
- 英文用 active voice
- 统一术语表（见 `copy-rules.json`）
- 金额格式：¥1,239.00
- 变量格式：camelCase `{couponName}`
- 禁用感叹号

---

## 7. 合规规范

15 条合规规则（来源：`compliance-experience-rules.json`），按严重程度：

**HIGH（6 条）：**
- 国家/地区表述规范
- 广告法禁用词（最、第一、唯一、国家级等）
- 品牌视觉规范
- 敏感信息泄露防护
- 内容安全过滤
- 多部门审批流

**MEDIUM（6 条）：**
- 行业特殊规范（金融/医疗/教育）
- 跨境数据合规
- 版权素材检测
- 商标使用
- 地域文化适配
- 活动促销合规

**LOW（3 条）：**
- 隐私声明一致性
- 渠道格式规范
- 版本归档管理

---

## 8. 数据持久化

| 存储 | 内容 |
|------|------|
| localStorage | 项目列表（id, name, domain, figmaUrl, timestamps） |
| IndexedDB `figmaData` | Figma 原始 JSON + Frame 截图 URL + Token + AI Key |
| IndexedDB `projectKeys` | Frame 字段数据（page, module, title, body, zhCN, enUS, jaJP, hidden） + Copywriting 数据（Layer1/2/3 prompts） |

---

## 9. AI 集成

### 9.1 AI 翻译（Key Generator Tab）

- 服务：混元 API（`hunyuan-turbo`）
- 用途：批量翻译未匹配的中文 Figma 文案为英文 Title
- 触发：手动点击「🤖 AI 翻译」

### 9.2 AI 写文案（Copywriting Tab）

- 服务：混元 API（`hunyuan-turbo`）
- 用途：基于三层 Prompt + 文案规范 + 合规规则，生成中/英文案
- 触发：每行 🤖 按钮（单条）或顶部「🤖 AI 批量生成」（批量）
- 规则来源：`.claude/skills/copywriting.md` + `copy-rules.json`

### 9.3 AI 合规审查

- 服务：混元 API
- 用途：检查已填写文案是否符合 15 条合规规则
- 触发：顶部「🔍 AI 合规审查」

---

## 10. 导出

### JSON 导出

```json
{
  "domain": "HMH",
  "pages": [{
    "frameName": "Checkout",
    "fields": [{
      "figmaText": "确认下单",
      "key": "Hmh.CheckOutPage.Button.Confirmation",
      "page": "CheckOutPage", "module": "Button", "title": "Confirmation",
      "zhCN": "确认下单", "enUS": "Place Order", "jaJP": "注文を確定する"
    }]
  }]
}
```

### CSV 导出

列：`Frame | Canvas | Figma Text | Domain | Page | Module | Title | Body | zhCN | enUS | jaJP | Full Key`

已隐藏字段自动排除。

---

## 11. 文件清单

```
Producer Flow/
├── figma-key-demo.html              # 主程序
├── server.py                        # 本地开发服务器（静态文件 + AI API 代理，Python）
├── proxy.rb                         # 本地开发服务器（Ruby 等价实现，无 python3 时首选）
├── HANDOFF.md                       # 开发交接文档（运行方式 + 已知坑）
├── copywriting-proto.html           # Copywriting Tab 原型图
├── Spec-figma-key-demo.md           # 本文档
├── Tech-Brief.md                    # 技术概要
├── .claude/skills/
│   ├── generate-key.md              # Key 生成 Skill
│   └── copywriting.md               # 文案撰写 Skill
├── Key Rules/
│   ├── key-rules-config.json        # Key 生成规则配置
│   ├── Key-Rules.md                 # Key 规则文档
│   ├── Key生成规则-V1.docx           # 原始需求
│   └── Page Elements_for key-value.pptx
└── Copy Parking-lot/
    ├── 2025/                        # 38 个 Key_Library 版本文件
    ├── compliance-experience-rules.json  # 合规规则
    ├── copy-style-guide.md          # 文案撰写规范（人读）
    └── copy-rules.json              # 文案规则配置（机读）
```

---

## 12. 已知限制

| # | 限制 | 生产环境方案 |
|---|------|-------------|
| 1 | Figma Token 存浏览器 IndexedDB | 后端代理 |
| 2 | 无用户认证 | 后端 + 账号系统 |
| 3 | 数据仅限当前浏览器 | 后端数据库同步 |
| 4 | Module 检测依赖关键词 | 项目内自定义规则 |
| 5 | AI 翻译依赖 混元 API | 后端代理，支持多模型 |
| 6 | Layer 2/3 Prompt 存储在 IndexedDB | 后端持久化 + 团队共享 |

---

*End of Spec*
