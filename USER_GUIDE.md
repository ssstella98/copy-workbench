# Producer Copy Workbench — 用户手册

> 面向迪士尼 Digital Producer 团队的文案管理工作台。从 Figma 设计稿一键提取文案 → 自动生成 Key → AI 写中英文案。

---

## 目录
1. [环境准备](#1-环境准备)
2. [获取代码并启动](#2-获取代码并启动)
3. [获取 API Keys](#3-获取-api-keys)
4. [快速上手：完整工作流](#4-快速上手完整工作流)
5. [Key Generator Tab](#5-key-generator-tab)
6. [Copywriting Tab](#6-copywriting-tab)
7. [视觉文档导出](#7-视觉文档导出)
8. [云端模式（可选）](#8-云端模式可选)
9. [常见问题](#9-常见问题)

---

## 1. 环境准备

### 你不需要装任何东西

工作台的启动方式有两种，选择其一即可：

**方式一：直接打开（最简单）**
- 双击 `figma-key-demo.html`，浏览器直接打开
- ✅ 无需安装任何软件
- ⚠️ 数据只保存在当前浏览器的本地存储中，换电脑无法同步

**方式二：本地 HTTP 服务（macOS 自带 Ruby）**
```bash
cd "/path/to/Producer Flow"
ruby proxy.rb
# 浏览器打开 http://localhost:8080/figma-key-demo.html
```
- ✅ 数据仍存本地
- ✅ 解决某些网络环境下混元 API 的 CORS 跨域问题
- ⚠️ 换电脑后需重新操作

**方式三：云端模式（推荐，支持跨设备）**
- 在工具栏「Worker URL」输入框填入 `https://copy-workbench-api.ssstella98.workers.dev`
- ✅ 数据存云端 D1 数据库，换电脑登录同一个 Worker URL 数据自动同步
- ✅ AI API 调用走云端代理，绕过公司网络限制
- ✅ 团队多人可用同一个 Worker URL 协作

### 浏览器要求
- Chrome / Edge / Safari 最新版本
- **不要用 IE 或旧版浏览器**

---

## 2. 获取代码并启动

### 首次获取代码
```bash
git clone https://github.com/ssstella98/copy-workbench.git
cd copy-workbench
```

### 后续更新
```bash
git pull origin main
```

### 启动
打开 `figma-key-demo.html` 即可（双击或拖到浏览器窗口）。

---

## 3. 获取 API Keys

你需要两个 API Key：

### 3.1 Figma Personal Access Token

1. 登录 [Figma](https://www.figma.com)
2. 点击右上角头像 → **Settings** → **Personal Access Tokens**
3. 点击 **Generate new token**，命名后复制（格式：`figd_xxxxxxxxxxxx`）
4. 粘贴到工作台 Key Generator 工具栏的 **Token** 输入框

### 3.2 DeepSeek API Key（推荐）

1. 注册 [DeepSeek 开放平台](https://platform.deepseek.com)
2. 进入 **API Keys** 页面，点击 **创建 API Key**
3. 复制 Key（格式：`sk-xxxxxxxx`）
4. 粘贴到工作台工具栏的 **AI API Key** 输入框

> 如果你想改用腾讯混元，在代码顶部把 `AI_PROVIDER` 从 `'deepseek'` 改为 `'hunyuan'`，Key 在 [混元控制台](https://console.cloud.tencent.com/hunyuan) 创建（选择 **OpenAI 兼容接口** 类型）。

---

## 4. 快速上手：完整工作流

以下是从零到完成一个项目文案的完整步骤：

### Step 1：新建项目
- 打开工作台 → 点击「**+ 新建项目**」
- 填写项目名称（如 `HMH 酒店宾客服务`）和 Domain（如 `HMH`）
- 可选：填入 Figma 设计稿 URL
- 点击「创建项目」

### Step 2：加载 Figma 设计稿
- 进入项目后，在 Key Generator 工具栏填入 **Figma URL** 和 **Token**
- 点击「**加载 Figma**」
- 等待 Frame 扫描完成 → 点击「**管理页面**」
- 勾选需要提取文案的 Frame → 点击「添加选中页面」

### Step 3：生成和编辑 Key
- 系统会自动为每个 TEXT 节点生成 `Domain.Page.Module.Title.Body` 格式的 Key
- 检查自动检测的 **Module** 是否准确（可下拉选择修改）
- 检查和修改 **Page**、**Title**（点击直接编辑）
- 如有不需要的字段，点击操作列的「**隐藏**」

### Step 4：AI 批量生成 Title 翻译（可选）
- 点击工具栏的「🤖 **AI 翻译**」
- 系统自动翻译所有未填写 Title 的中文文案

### Step 5：填写文案
- 点击「💾 **保存项目**」
- 切换到「✏️ **Copywriting**」Tab
- 「📋 Layer 1 · 项目背景」：填写项目背景描述
- 「🔄 Layer 2 · User Flow」：每个 Figma Canvas 写一段用户流程描述
- 点击「🤖 **批量生成本页**」自动为当前页面所有字段生成中英文案
- 或点击每行的 🤖 按钮单独生成某一条

### Step 6：导出
- 点击「📄 **视觉文档**」导出带截图的 HTML 文档（左图右表，可打印 PDF）
- 点击「📥 **JSON**」或「📥 **CSV**」导出结构化数据

---

## 5. Key Generator Tab

### 5.1 界面布局

```
┌─ 工具栏 ───────────────────────────────────────────┐
│ Figma URL | Token | [加载] [同步] | JSON CSV 视觉文档 │
│ Worker URL | AI API Key | [🤖 AI翻译]              │
├─ 页面选择器 ────────────────────────────────────────┤
├─ 三栏工作区 ────────────────────────────────────────┤
│ ┌ 侧栏 ──┬─ Figma 预览 ──┬─ Key 表格 ────────────┐│
│ │📁 Page1│  (截图)       │ #│草稿│Domain│Page│... ││
│ │  ├Frame│  [◀ 1/5 ▶]   │ 编辑区               ││
│ └────────┴──────────────┴───────────────────────┘│
```

### 5.2 Key 结构说明

格式：`Domain.Page.Module.Title.Body`（驼峰格式，`.` 分隔）

| 段位 | 说明 | 示例 | 是否可编辑 |
|------|------|------|:--:|
| Domain | 项目前缀，创建项目时设定 | `HMH` | 项目级固定 |
| Page | 从 Frame 名称自动翻译为英文 | `CheckInPage` | ✅ |
| Module | 26 个枚举值，自动检测 UI 交互类型 | `Button`、`Modal` | ✅（下拉） |
| Title | Figma 原文翻译为英文 CamelCase | `Confirmation` | ✅ |
| Body | 可选附加段，手动填写 | `Terms` | ✅ |

### 5.3 Module 枚举值

| 类别 | 可选值 |
|------|------|
| **Layer** | Modal, Sheet, PoPup |
| **Navigation** | NavigationBar |
| **Feedback** | Toast, ActionBar |
| **Form** | Switch, RadioButton, Checkbox, TextField, Dropdown, Capsule, Calendar |
| **Function** | Icon, Button, Hyperlink |
| **Content** | Placeholder, Label, Title, Subtitle, Notes, Tooltip |
| **Layout** | Banner, ToDoList, KeyEntrance, Upsell, Activity, Facility, TopTips |

### 5.4 Key 表格操作

| 操作 | 方式 |
|------|------|
| 编辑 Page/Module/Title/Body | 直接在表格中输入或选择 |
| 隐藏某条 Key | 点击操作列「**隐藏**」 |
| 恢复已隐藏 Key | 勾选「显示已隐藏」→ 点击「**恢复**」 |
| 批量隐藏 | 点击「全选字段」→ 勾选多行 → 点击「隐藏选中(N)」 |
| 复制 Key | 点击操作列「**复制**」（同位置多 Key 场景） |
| 新建 Key | 点击「**新建key**」→ 截图上框选位置 → 填表创建 |
| 删除已隐藏 | 点击「删除已隐藏」→ 确认 |

### 5.5 Figma 预览联动

- 鼠标 **hover** 表格中任意行 → 左侧截图上对应位置出现**红色虚线框**
- 红色框上显示该字段的序号
- 复制产生的 Key 共享同一位置，序号显示为 `3,4,5`

### 5.6 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `←` | 上一个 Frame |
| `→` | 下一个 Frame |

> 弹窗打开时键盘导航自动禁用，防止误操作。

---

## 6. Copywriting Tab

### 6.1 三层 Prompt 架构

```
┌─ Layer 1 · 项目背景 ───────────────────────────────┐
│ 全局描述：什么产品、面向谁、什么平台、品牌调性         │
│ 作用域：整个项目                                     │
├─ Layer 2 · User Flow ──────────────────────────────┤
│ 流程描述：用户当前在做什么、从哪来、到哪去             │
│ 作用域：按 Figma CANVAS 级别匹配                     │
│ 位置：左侧栏，切换页面自动切换                        │
├─ Layer 3 · 字段级提示 ──────────────────────────────┤
│ 点位描述：触发条件、交互行为、状态变化                 │
│ 作用域：单个 Key                                     │
│ 通过每行 🤖 按钮弹窗填写（可选，增强生成质量）          │
└─────────────────────────────────────────────────────┘
```

### 6.2 文案编辑表格

| 列 | 说明 |
|------|------|
| # | 字段序号 |
| Key Name | 完整的 Key 字符串（只读） |
| 💬 | Layer 3 提示词已填写标识 |
| 🇨🇳 中文 | 中文文案（可编辑） |
| 🇺🇸 English | 英文文案（可编辑） |
| ✓ | 合规检查结果（✅/⚠/✗） |
| 🤖 | AI 生成按钮 |

### 6.3 AI 生成文案

**单条生成：**
1. 点击某行的 🤖 按钮
2. 弹窗中填写 Layer 3 提示词（可选）
3. 点击「🪄 生成文案」
4. 预览中英文结果 + 合规检查
5. 点击「✅ 确认并填入表格」

**批量生成：**
1. 确保 Layer 1 已填写
2. 切换到目标页面
3. 点击表格上方的「🤖 批量生成本页」
4. 等待进度完成

> 批量生成只处理**当前页面**的未完成字段。

### 6.4 AI 合规审查

- 点击「🔍 合规审查」检查当前页面所有文案
- 检查项：广告法禁用词、国家/地区表述、感叹号、句式规范
- 结果分级：✅ 通过 / ⚠ 建议 / ✗ 违规

### 6.5 文案规范速查

| 类型 | 中文长度 | 英文长度 | 句式 |
|------|----------|----------|------|
| Button | ≤6 字 | ≤3 词 | 动词短语 / Imperative |
| Error | 10-50 字 | 5-25 词 | 问题+建议 |
| Title | 3-20 字 | 2-8 词 | 名词短语 |
| Modal | 50-200 字 | 20-80 词 | 标题+正文+按钮 |
| Toast | 15-50 字 | 8-25 词 | 状态+补充 |
| Label | 3-20 字 | 2-8 词 | 名词短语 |
| Link | 5-40 字 | 3-10 词 | 动词短语 |
| Confirm | 4-30 字 | 2-10 词 | 状态描述 |

通用规则：
- 中文用「您」，不用「你」
- 禁用感叹号（Button/Title/Label 无句号）
- 英文用 Active Voice
- 金额格式：¥1,239.00
- 变量用 camelCase：`{couponName}`

---

## 7. 视觉文档导出

### 7.1 导出流程

1. 确保已完成 Key 生成（至少一个 Frame 有截图）
2. 点击工具栏「📄 **视觉文档**」
3. 在弹出的选择器中勾选需要导出的 Frame
4. 系统自动生成包含截图 + overlay 定位框 + 文案表格的 HTML 文件
5. 浏览器自动下载，可用浏览器打开后打印为 PDF

### 7.2 导出内容

每个页面分为左右两部分：
- **左侧 30%**：Figma 截图，文字位置叠加**蓝色虚线框 + 红色序号圆点**
- **右侧 70%**：Key 列表 + 中英文文案表格

---

## 8. 云端模式（可选）

云端模式使用 Cloudflare Workers + D1 数据库。由管理员（stella98）完成部署后，团队成员只需填写 Worker URL 即可。

### 8.1 启用云端模式

在 Key Generator 工具栏的「**Worker URL**」输入框中填入：
```
https://copy-workbench-api.ssstella98.workers.dev
```

### 8.2 云端模式特性

| 特性 | 本地模式 | 云端模式 |
|------|:--:|:--:|
| 数据存储 | 浏览器本地 | D1 云端数据库 |
| 跨设备同步 | ❌ | ✅ |
| 换电脑 | 数据丢失 | 登录同一 URL 自动恢复 |
| AI 调用 | 浏览器直连 | Worker 代理转发 |
| 公司网络限制 | ❌ DeepSeek 被拦截 | ✅ 不受限制 |

### 8.3 数据安全

- Worker 不上传你的 Figma Token 和 API Key 到任何第三方
- Key 存储在 Worker 的 `vars` 环境变量中
- D1 数据库仅你和团队成员可访问

---

## 9. 常见问题

### Q1：打开 HTML 后页面是空白的？
**A：** 浏览器控制台（F12）查看是否有报错。确保用 Chrome/Edge/Safari 最新版，不要用 IE。

### Q2：Figma 加载报 429 错误？
**A：** Figma API 有速率限制。工作台已内置自动重试（最多 5 次，指数退避），耐心等待即可。不要连续刷新。

### Q3：AI 翻译/文案生成报 "Failed to fetch"？
**A：** 
1. 检查 AI API Key 是否正确填入
2. 如果使用混元，确保用 `ruby proxy.rb` 启动 HTTP 服务（混元 API 有 CORS 限制）
3. 如果使用 DeepSeek + 公司网络，启用云端模式（填 Worker URL）

### Q4：保存的项目数据丢了？
**A：**
- 本地模式：检查是否清过浏览器缓存。数据存储在浏览器 localStorage + IndexedDB 中。
- 云端模式：数据存云端，不会因清缓存丢失。确保 Worker URL 已填入后再保存。

### Q5：视觉文档导出后图片不显示？
**A：** Figma 图片 URL 有时效性（约 2 周），过期后需点击「🔄 同步 Figma」重新获取。

### Q6：如何在两台电脑上同步工作？
**A：** 两台电脑都填同一个 Worker URL，保存后数据自动同步到云端，另一台进入项目即可看到最新数据。

### Q7：Key 的 Module 检测不准确怎么办？
**A：** Module 可以直接在表格中下拉重新选择。如果枚举值没有你需要的，可以输入自定义值。系统会记住你的选择。

### Q8：如何批量修改多个 Key？
**A：** 使用批量隐藏功能选中 → 隐藏不需要的 Key。如需批量修改 Page/Module，目前需逐条编辑，后续版本会增加批量编辑功能。

---

## 附录：项目文件结构

```
Producer Flow/
├── figma-key-demo.html       ← 主程序（双击打开）
├── server.py                 ← Python 本地服务器（可选）
├── proxy.rb                  ← Ruby 本地代理（macOS 自带）
├── backend/                  ← Cloudflare Worker 后端
├── Key Rules/
│   └── key-rules-config.json ← Key 生成规则配置
├── Copy Parking-lot/
│   └── copy-rules.json       ← 文案规范配置
└── HANDOFF.md                ← 开发者交接文档
```

---

*最后更新：2026-07-19*
