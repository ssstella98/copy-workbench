# Producer Copy Workbench — Spec (figma-key-demo.html)

> 版本：v2.0 · 日期：2026-06-26 · 状态：前端原型 / 后端待开发

---

## 1. 产品概述

面向 Digital Producer 的文案管理工作台前端原型。核心价值：从 Figma 设计稿自动提取文案字段 → 按规则生成 Key → 多语言编辑 → 导出。支持项目管理、本地持久化、AI 预翻译。

### 1.1 技术概况

- 单文件 HTML + Vanilla JS，约 1,600 行
- 浏览器本地存储：localStorage（项目列表）+ IndexedDB（Figma 数据 + Key 数据）
- 外部 API 依赖：Figma REST API、DeepSeek API（AI 翻译）
- 规则配置外置：`Key Rules/key-rules-config.json`

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
| 进入项目 | 点击卡片 | 跳转工作区，自动加载 IndexedDB 中保存的数据（如已保存） |

**新建/编辑项目模态框字段：**

| 字段 | 必填 | 说明 |
|------|------|------|
| 项目名称 | 是 | 自由文本 |
| Domain | 是 | Key 中的项目前缀，如 `HMH`、`Refund` |
| Figma URL | 否 | 完整 Figma 设计文件链接，可后续添加 |
| Figma Token | 否 | Personal Access Token，存 IndexedDB（不经过服务器） |

---

### 2.2 项目工作区

进入项目后的主操作界面。

#### 2.2.1 布局结构

```
┌─ Header ────────────────────────────────────────────┐
│ ← 项目列表 | 项目名称 | Domain | [💾 保存] [🏠 回到列表] │
├─ Toolbar ───────────────────────────────────────────┤
│ [Figma URL] [Token] [加载 Figma] | JSON CSV | [AI Key] [🤖 AI翻译] │
├─ 页面选择器（条件显示）───────────────────────────────│
├─ 主工作区 ───────────────────────────────────────────┤
│ ┌ 侧栏 ───┬─ Figma 预览 ──┬─ Key 表格 ────────────┐ │
│ │ 📁 Upsell│  (sticky)    │ # │ Key │ Type │ ... │ │
│ │  ├ Frame │              │                      │ │
│ │  └ Frame │  [◀ 1/5 ▶]  │                      │ │
│ │          │              │                      │ │
│ │ [管理页面]│              │                      │ │
│ └──────────┴──────────────┴──────────────────────┘ │
└────────────────────────────────────────────────────┘
```

#### 2.2.2 工具栏

根据 Figma 数据是否已加载，工具栏显示两种状态：

**未加载 Figma（首次）：**
- Figma URL 输入框 + Token 输入框 + 「加载 Figma」按钮
- JSON / CSV 导出按钮（禁用）
- DeepSeek API Key 输入框 + 「🤖 AI 翻译」按钮（禁用）
- 状态指示器

**已加载 Figma：**
- Figma 文件名摘要 + 「● 已加载 · N 个 Frame」
- 「🔄 同步 Figma」按钮（手动触发重新拉取）
- JSON / CSV 导出按钮
- DeepSeek API Key 输入框 + 「🤖 AI 翻译」按钮
- 状态指示器

**「💾 保存项目」按钮：** 在工作区有数据时显示于 Header。保存后：
- Figma 原始数据 + Frame 截图 → IndexedDB `figmaData` store
- 所有 Frame 的 Key 数据（含字段编辑结果）→ IndexedDB `projectKeys` store
- API Key → 同上
- 项目列表的 `updatedAt` 时间戳 → localStorage

#### 2.2.3 左侧目录栏

**展示内容：**
- 标题「📁 页面目录」，右侧 ◀/▶ 收起/展开按钮
- 按 CANVAS（Figma Page）分组，每组可折叠：
  - 组头：`▼ 📁 Upsell`，点击折叠/展开其下 Frame
  - Frame 项：`🖼 HMH Home Page`，当前查看的 Frame 高亮
- 底部「📋 管理页面」按钮

**交互：**
| 操作 | 行为 |
|------|------|
| 点击 Frame 项 | 切换到该 Frame 的预览和 Key 表格 |
| 点击 CANVAS 组头 | 折叠/展开该组下的 Frame 列表 |
| 点击「◀/▶」 | 收起/展开整个侧栏（收起后仅 36px 宽） |
| 点击「管理页面」 | 展开/收起页面选择器面板 |

#### 2.2.4 Figma 预览区

**位置：** 侧栏右侧，工作区中部，sticky 定位。宽度 380px。

**展示内容：**
- 顶部标签：当前 Frame 的 CANVAS 名 / Frame 名
- 预览主体：
  - 有 Figma 截图时：显示 PNG 图片，蓝色虚线矩形框覆盖在 TEXT 节点位置上
  - 无截图时（Demo / 加载失败）：显示彩色占位行列表，每行一个字段
- 底部导航栏：
  - 单个 Frame：仅显示 Frame 名称
  - 多个 Frame：显示「◀ Frame名 ▶」翻页按钮，支持键盘 ← → 切换

**定位框选交互：**
- 每个已识别的 TEXT 节点在预览图上以蓝色虚线矩形标记
- 矩形位置使用 CSS 百分比定位（不依赖 JS 像素计算）
- 鼠标悬停右侧 Key 表格某行 → 对应预览矩形变为红色并显示编号圆圈
- 数据来源：`absoluteBoundingBox` 相对 Frame 的百分比坐标

#### 2.2.5 Key 编辑表格

**表头：** # | 隐藏 | Figma 草稿 | Domain | Page | Module | Title | Body | Full Key

**每列编辑方式：**

| 列 | 编辑方式 | 说明 |
|----|---------|------|
| # | 只读 | 字段序号 |
| 隐藏 | 按钮 🚫/👁 | 切换该字段的显示/隐藏状态 |
| Figma 草稿 | 只读 | 设计稿中的原始 TEXT 内容，鼠标悬浮看全文 |
| Domain | 只读 | 项目固定值，蓝色标签样式 |
| Page | 文本输入 | Frame 名自动生成，可手动修改 |
| Module | 下拉 + 文本输入 | 自动检测填充，下拉选枚举值（26个），下方输入框支持自定义 |
| Title | 文本输入 | 自动翻译生成（词表 + 词拆解 + AI），可手动修改 |
| Body | 文本输入 | 默认空，可选填 |
| Full Key | 只读 | 五段拼接的完整 Key，等宽字体 |

**字段隐藏/删除：**
- 点击 🚫：隐藏当前字段（整行灰化 + 删除线），预览框线同步消失
- 表头「显示已隐藏」复选框：切换是否展示已隐藏行
- 「取消全部隐藏」：一键恢复所有隐藏字段
- 「删除已隐藏」：确认后物理删除当前页所有已隐藏字段（不可恢复）
- 导出时自动排除已隐藏字段

**键盘：** 在多 Frame 时，← → 切换 Frame

---

## 3. Figma 集成

### 3.1 文件加载流程

```
用户输入 Figma URL + Token → 点击「加载 Figma」
  ↓
parseFileKey(url) → 提取 file_key
  ↓
fetchFigmaFile(fileKey, token) → GET /v1/files/{key}
  ├─ 限流重试：6次，间隔 6s/18s/54s/162s/486s
  └─ 缓存：同一 file_key 5 分钟内不重新请求
  ↓
scanFigmaFrames(data) → 扫描所有 CANVAS → FRAME
  ├─ 过滤：跳过 iPhone/封面/组件等设备框
  ├─ 计数：递归统计每个 Frame 内的 TEXT 节点数
  ├─ 过滤：≤ 2 个文案字段的 Frame 不显示
  └─ 去重：同名 Frame 追加 (1)/(2) 后缀
  ↓
显示页面选择器面板（内联，非弹窗）
```

### 3.2 页面选择器

- 按 CANVAS 分组展示所有扫描到的 Frame
- 每个 Frame：复选框 + 名称 + TEXT 数量
- 顶部操作：全选 / 取消全选 / 「✅ 确认添加」
- 已添加的 Frame 灰色标记「已添加」，不可重复勾选
- 确认后：`deepScanFrame()` 逐个深入提取 TEXT 节点 → `fetchFrameImages()` 分块拉取截图

### 3.3 TEXT 节点提取

`deepScanFrame(meta, rawData)` 逻辑：

1. 在原始 Figma JSON 中递归查找匹配 `meta.id` 的节点
2. 找到后递归遍历其所有子节点
3. 对每个 `type === 'TEXT'` 且 `characters` 非空的节点：
   - 过滤 `isDynamicData()`：纯数字、日期、时间、邮箱、单符号
   - 计算相对坐标：`relX/Y/W/H` = 文本框相对于 Frame 的百分比位置
   - 自动生成 `page`（Frame 名译英文）、`module`（关键词检测）、`title`（翻译）
4. 返回 `{ fields, filtered }` 

### 3.4 截图拉取

`fetchFrameImages(fileKey, token, imageIds)` 逻辑：
- 每批 20 个 ID
- 批次间间隔 1.5s 防限流
- 遇到 429 等 10s 后重试一次
- 图片格式：PNG，2x scale

### 3.5 「同步 Figma」功能

手动触发，对比已有数据：

1. 重新拉取 Figma 文件结构
2. 重新扫描 Frame 列表
3. 打开页面选择器——已添加的 Frame 标记「已添加」，新增的 Frame 可勾选加入
4. 已添加 Frame 的 Key 编辑数据保留（按 Frame ID 匹配）

---

## 4. Key 生成规则

### 4.1 结构

```
Domain.Page.Module.Title.Body
```

驼峰格式，`.` 分隔，不可出现中文。

### 4.2 Domain

| 属性 | 值 |
|------|-----|
| 来源 | 项目创建时设定，保存在 localStorage |
| 修改 | 编辑项目可改，影响所有已生成 Key 的 Domain 段 |
| 格式 | 首字母大写驼峰 |

### 4.3 Page

| 属性 | 值 |
|------|-----|
| 来源 | Figma Frame 名称自动生成 |
| 规则 | 去项目前缀 → 中文翻译为英文 → CamelCase → 取前 3 词 |
| 修改 | 可在表格中手动编辑 |

**示例：**
- `HMH Home Page` → `HomePage`
- `Payment Page` → `PaymentPage`
- `HMH Product List Page` → `ProductListPage`

### 4.4 Module

| 属性 | 值 |
|------|-----|
| 来源 | 根据 TEXT 内容关键词 + 位置自动检测 |
| 枚举 | 26 个值，不可自定义（但下拉框支持手动输入自定义值） |
| 修改 | 可在表格下拉框中更改 |

**26 个枚举值（按类别）：**

| 类别 | 值 |
|------|-----|
| Layer | Modal, Sheet, PoPup |
| Navigation | NavigationBar |
| Feedback | Toast, ActionBar |
| Form | Switch, RadioButton, Checkbox, TextField, Dropdown, Capsule, Calendar |
| Function | Icon, Button, Hyperlink |
| Content | Placeholder, Label, Title, Subtitle, Notes, Tooltip |
| Layout | Banner, ToDoList, KeyEntrance, Upsell, Activity, Facility, TopTips |

**检测规则（优先级从高到低）：**
1. 关键词匹配（配置于 `key-rules-config.json` 的 `detectionKeywords`）
2. 位置 + 文本长度兜底：
   - 底部且 ≤6 字符 → `NavigationBar`
   - 底部且 >6 字符 → `ActionBar`
   - 顶部且 >20 字符 → `Banner`
   - 顶部且 ≤12 字符 → `TopTips`
   - >40 字符 → `Notes`

### 4.5 Title

| 属性 | 值 |
|------|-----|
| 来源 | Figma TEXT 内容自动翻译为英文 |
| 限制 | ≤ 3 个英文单词，CamelCase |
| 修改 | 可在表格中手动编辑 |

**自动翻译策略（四级 fallback）：**

```
输入中文文案
  ↓
① 精确匹配 TITLE_MAP → 直接输出
  ↓ 未命中
② 最长子串匹配 → 输出最长匹配键的翻译
  ↓ 未命中
③ 贪心拆词翻译 → 从左到右最长词匹配，拼接 CamelCase（限 3 词）
  ↓ 未命中
④ AI 翻译 → 用户手动点击「🤖 AI 翻译」（不自动触发）
  ↓
⑤ 留空 → 用户手动填写
```

**TITLE_MAP 来源：**
1. 优先：从 `key-rules-config.json` 的 `title.translationMap` 加载（150+ 条）
2. 兜底：内置 `FALLBACK_TITLE_MAP`（120+ 条，含大量 1-2 字基础词块用于拆解）

### 4.6 Body

| 属性 | 值 |
|------|-----|
| 来源 | 手动填写 |
| 默认值 | 空 |
| 用途 | 长文本说明，如弹窗文案、政策内容 |

---

## 5. 数据过滤

### 5.1 动态数据过滤 `isDynamicData()`

以下 TEXT 节点不视为文案，自动排除：

| 模式 | 示例 | 原因 |
|------|------|------|
| 纯数字（剥离 ¥$,. 后） | `¥1,239.00`、`.00`、`×2` | 价格/数量 |
| 日期 | `2024年08月16日` | 动态日期 |
| 时间 | `9:41`、`14:45` | 状态栏时间 |
| 邮箱 | `Mickey@disney.com` | 用户数据 |
| 单符号 | `¥`、`?`、`!` | 图标字体残片 |
| 单拉丁字母 | `F`、`p` | 图标字体 |
| 长数字串 | `2948586`、`+0000` | 订单号、电话 |

### 5.2 Frame 过滤 `isSkippableFrame()`

Frame 名称包含以下关键词则不扫描：`iphone`、`android`、`device`、`mockup`、`封面`、`cover`、`legend`、`组件`。

---

## 6. 数据持久化

### 6.1 存储方案

| 存储 | 内容 | 容量 |
|------|------|------|
| localStorage | 项目列表（id, name, domain, figmaUrl, timestamps） | ~5-10MB |
| IndexedDB `figmaData` | Figma 原始 JSON + Frame 截图 URL + Token + API Key | 数百 MB |
| IndexedDB `projectKeys` | 每个 Frame 的字段数据（page, module, title, body, hidden） | 数百 MB |

### 6.2 保存时机

- **手动保存：** 用户点击「💾 保存项目」
- **项目元数据：** 创建项目 / 加载 Figma 成功后自动更新 localStorage
- **IndexedDB 写入：** 仅在手动保存时触发

### 6.3 加载时机

- 用户点击项目卡片进入 → 自动从 IndexedDB 加载 `figmaData` 和 `projectKeys`
- 加载成功 → 直接展示缓存数据（不调 Figma API）
- 加载失败/无数据 → 展示 Figma URL + Token 输入框

---

## 7. 导出

### 7.1 JSON 导出

```json
{
  "domain": "HMH",
  "projectId": "proj_...",
  "exportedAt": "2026-06-26T...",
  "pages": [{
    "frameName": "HMH Home Page",
    "frameId": "3:1880",
    "canvasName": "Upsell",
    "fields": [{
      "figmaText": "房间号",
      "key": "Hmh.HomePage.NavigationBar.RoomNum",
      "page": "HomePage",
      "module": "NavigationBar",
      "title": "RoomNum",
      "body": null
    }]
  }]
}
```

- 已隐藏字段自动排除
- 按 Frame 分组输出

### 7.2 CSV 导出

列：`Frame | Canvas | Figma Text | Domain | Page | Module | Title | Body | Full Key`

- 已隐藏字段自动排除
- UTF-8 BOM 编码（兼容 Excel 中文）

---

## 8. AI 翻译

### 8.1 接口

| 项目 | 值 |
|------|-----|
| 服务 | DeepSeek API（OpenAI 兼容格式） |
| 端点 | `POST https://api.deepseek.com/v1/chat/completions` |
| 模型 | `deepseek-chat` |
| 认证 | `Authorization: Bearer <api_key>` |
| 每批 | 20 条 |

### 8.2 触发与流程

1. 用户填写 DeepSeek API Key → 点击「🤖 AI 翻译」
2. 系统收集当前项目中所有 `title` 为空且 `text` 非空的字段
3. 分批发送，每批 20 条中文文案
4. Prompt：中文 → 英文 CamelCase（≤ 3 词），非文案返回空字符串
5. 返回 JSON 数组，逐条填入对应字段的 Title
6. 出错时停止后续批次，显示错误信息
7. API Key 随「保存项目」写入 IndexedDB

---

## 9. 规则配置

### 9.1 配置文件

`Key Rules/key-rules-config.json` 是生成规则的唯一配置源。

**加载方式：**
- 应用启动时 `fetch` 加载（尝试 3 个路径变体）
- 加载成功：覆盖内置默认值
- 加载失败：使用内置 `FALLBACK_TITLE_MAP` + `FALLBACK_MODULE_KEYWORDS`

**可配置项：**

| 配置段 | 说明 | 修改影响 |
|--------|------|----------|
| `title.translationMap` | 中文→英文翻译词表 | 直接影响 Title 自动生成命中率 |
| `module.detectionKeywords` | Module 关键词检测规则 | 直接影响 Module 自动判断准确率 |
| `module.enums` | Module 枚举值列表 | 影响下拉框选项 |

---

## 10. 已知限制

| # | 限制 | 影响 | 生产环境解决方案 |
|---|------|------|-----------------|
| 1 | Figma Token 存在浏览器 IndexedDB | 安全风险 | 后端代理，Token 存服务器 |
| 2 | 无用户认证 | 数据仅限当前浏览器 | 后端 + 账号系统 |
| 3 | localStorage 容量有限 | 项目列表不能无限增长 | 后端数据库 |
| 4 | IndexedDB 换电脑不可见 | 数据不跨设备 | 后端数据同步 |
| 5 | Module 检测依赖关键词 | 新项目可能需调词表 | 项目管理内支持自定义规则 |
| 6 | Title 翻译词表需手工维护 | 新词持续补充 | AI 翻译作为 fallback |
| 7 | Figma API 限流 | 大文件需分批拉取 | 后端代理 + 队列 |

---

## 11. 文件清单

```
Producer Flow/
├── figma-key-demo.html           # 主程序（单文件，~1600行）
├── Key Rules/
│   ├── key-rules-config.json     # 规则配置（可热更新）
│   └── Key-Rules.md              # 规则文档（团队参考）
├── PRD-Copy-Workbench-MVP.md     # 产品需求文档
├── Tech-Brief.md                 # 技术概要
├── Spec-figma-key-demo.md        # 本文档
└── Copy-Workbench-Briefing.html  # 老板汇报页
```

---

*End of Spec*
