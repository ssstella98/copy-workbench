# PRD: Producer Copy Workbench — MVP

| 字段 | 内容 |
|------|------|
| 版本 | v1.0 |
| 日期 | 2026-05-25 |
| 作者 | Digital Product Team |
| 状态 | Draft |
| 关联文档 | Digital-Producer-Copy-Workflow.md, Spec_Q&A1.md |

---

## 1. Executive Summary

Producer Copy Workbench 是一个面向 Digital Producer 的文案管理工作台，替代当前完全依赖人工的 Figma → Key → Copy → Word 文档的线下流程。MVP 聚焦**文案字段的识别、Key 值自动生成、多语言文案编辑、和标准化文档导出**四大能力，将 Producer 在项目中投入的文案管理时长缩短 50%。

AI 辅助起草、文案资产库、在线审核流转等高阶能力规划在二期实现。

---

## 2. Problem Statement

当前文案管理全链路依赖人工，核心痛点：

| # | 痛点 | 现状 | 影响 |
|---|------|------|------|
| P1 | 页面整理 & Key 值生成混乱 | Producer 人工对照 Figma 整理层级和点位，用 Excel+宏生成 Key | 投入大、易出错、各 Studio 各自为政 |
| P2 | 开发交付 Key 文档过晚 | 开发在项目接近完成时才做 knowledge transfer，Key 值在 Sprint 中持续增删改 | Producer 写文案时间被严重压缩 |
| P3 | 文案产出效率低 | 逐条与 AI 对话起草，术语不统一，跨项目无法复用 | 重复劳动多，质量参差不齐 |
| P4 | 文档整理纯手工 | 手动将 Figma 截图、Key 值、中英日文案拼成 Word | 耗时且极易格式错乱 |

---

## 3. Product Vision

**一个统一的工作台，让 Producer 从 Figma 设计稿直达最终的可配置文案。**

- Producer 不再手动整理页面层级
- Key 值命名规范由系统自动校验、不依赖人工经验
- 一份工作台覆盖中/英/日三语文案编辑
- 一键导出标准 Word 文档（左图右表）和 JSON（交付开发）

---

## 4. MVP Scope

### 4.1 In Scope

| 模块 | 能力 | 优先级 |
|------|------|--------|
| 项目管理 | 以项目为维度创建工作区，支持多人并行、互不干扰 | P0 |
| Figma 集成 | 上传/关联 Figma 文件，自动识别文字图层，生成文案字段清单 | P0 |
| 页面层级管理 | 从 Figma Frame 名称自动提取页面层级，支持人工调整 | P0 |
| Key 值管理 | 按 `{project}.{flow}.{page}.{function}.{shortExplanation}` 规则自动生成 Key，实时校验格式，支持修改 | P0 |
| 多语言文案编辑 | 每个字段维护中文、英文、日文三语 copy，支持并行编辑 | P0 |
| 项目内 Key 共享 | 同一项目内，相同文案的多个位置可指向同一个 Key | P0 |
| 导出 | 导出为 Word 文档（左 UI 图右表格）和 JSON 文件（交付开发） | P0 |

### 4.2 Out of Scope (Phase 2+)

- AI 辅助起草文案
- 文案资产库（历史 approved 文案归档与检索）
- 在线审核流转（Legal / Public Affair / Native Speaker 在平台内审核）
- 版本历史与回滚
- 跨项目 Key 共享
- 后台 CMS 直接对接

---

## 5. User Personas & Roles

| 角色 | 描述 | MVP 权限 | Phase 2 权限 |
|------|------|----------|-------------|
| **Producer** | 文案工作的主要执行者，负责定义 Key、撰写中英日文案 | 创建项目、上传 Figma、管理 Key、编辑 Copy、导出 | 同左 + 发起审核 |
| **Producer Manager** | 管理 Producer 团队，查看项目进度 | 查看所有项目、只读权限 | 同左 + 审批 |
| **Engineering** | 消费最终 JSON 文件，配置到项目 | 无需登录平台（通过导出文件消费） | TBD |
| **Legal / Public Affair** | 审核文案合规性 | 无需登录平台（Phase 2） | 仅查看 |
| **Native Speaker** | 审核英文文案自然度 | 无需登录平台（Phase 2） | 仅查看 + 评论 |

---

## 6. Core Workflow

### 6.1 As-Is（当前流程）

```
PM确认Scope → Designer出UI → Dev画页面+定Key → Dev导出Key给Producer
→ Producer人工整理Key+写Copy → 手动拼Word → 线下审核流转 → 手动填Excel → Dev转JSON
```

### 6.2 To-Be（MVP 目标流程）

```
PM确认Scope → Designer出UI（Design Review通过）
→ Producer上传Figma到工作台 → 系统自动识别文案字段+生成层级和Key
→ Producer确认/调整Key → Producer编辑中英日Copy → 导出Word（送审）+ 导出JSON（交付开发）
```

关键变化：**Producer 在 Design Review 通过后即可介入，不再等待开发交付 Key。Key 的权威来源从开发转移到 Producer。**

---

## 7. Functional Requirements

### 7.1 项目管理

#### FR-1.1 项目创建
- Producer 可创建新项目，填写：项目名称、项目描述、参与语言（默认中/英/日）
- 系统自动生成项目 ID，作为 Key 命名中的 `{project}` 字段
- 支持项目列表视图，按创建时间/更新时间排序

#### FR-1.2 多人协作
- 同一项目可添加多个 Producer 成员
- 支持多人同时在线编辑不同字段，不产生冲突
- 字段级别的编辑锁：当 Producer A 正在编辑某字段的某语言 Copy 时，Producer B 对该字段该语言的编辑按钮置灰，提示"xxx 正在编辑"

#### FR-1.3 项目状态
- 项目状态流转：`Draft → Copy In Progress → Copy Completed → Under Review → Approved`
- MVP 中状态仅作为标记，不触发流程自动化

---

### 7.2 Figma 集成 & 字段识别

#### FR-2.1 Figma 文件关联
- 支持两种方式导入：
  - **方式 A（推荐）**：输入 Figma 文件链接 + Personal Access Token，系统通过 Figma REST API 读取文件结构
  - **方式 B（兜底）**：上传 Figma 导出的 PNG 图片，系统通过 OCR 识别文字
- 方式 A 为本期主力实现方案，方式 B 作为备选通道

#### FR-2.2 文字图层识别（方式 A - Figma API）
- 系统遍历 Figma 文件中所有页面（Pages）和画板（Frames），提取所有 TEXT 节点
- 显示识别结果列表，每条记录包含：
  - Figma 原始文字内容（placeholder copy）
  - 所在 Frame 路径（Page > Frame > Sub-frame > ...）
  - 文字样式（字号、字重、颜色）——仅供 Producer 参考
- **去重逻辑**：同一 Frame 下文字内容完全相同的 TEXT 节点，自动合并为一条字段记录
- Producer 可以：
  - 勾选/取消勾选需要保留的字段
  - 批量忽略某 Frame 下的所有字段
  - 手动添加遗漏的字段

#### FR-2.3 文字图层识别（方式 B - 图片 OCR）
- Producer 上传按页面层级命名的 PNG 图片（例：`1.HomepagePopup_2.Menu_3.SubmitOrder.png`）
- 系统对每张图片运行 OCR，提取其中文字区域
- 显示识别结果列表，包含：图片名、识别文字、文字在图片中的位置坐标
- Producer 确认保留字段，系统从文件名中解析层级结构
- 支持手动校正 OCR 识别结果

#### FR-2.4 Figma 方案对比与建议

| 维度 | 方式 A：Figma API | 方式 B：图片+OCR |
|------|-------------------|------------------|
| 准确度 | 高（直接读 TEXT 节点） | 中（OCR 误差，中/日文尤甚） |
| Producer 前置投入 | 低（一次授权即可） | 高（需手动导出+命名图片） |
| 层级获取 | 自动从 Frame 树解析 | 依赖图片命名，手动维护 |
| 重复页面去重 | 可通过 Frame ID/名称自动去重 | 需要人工判断 |
| 技术依赖 | Figma Personal Access Token | OCR 服务（需评估中文/日文准确率） |
| 推荐程度 | **推荐（主力方案）** | 兜底备选 |

**结论：MVP 以方式 A 为主力实现方案，方式 B 仅作为无 Figma 权限场景的备选通道。**

#### FR-2.5 页面层级管理
- 系统自动从 Figma Frame 的嵌套结构和命名提取页面层级
- 层级格式遵循现有命名习惯（例：`1.HomepagePopup > 2.Menu > 3.SubmitOrder > 4.1OrderFinished`）
- Producer 可以：
  - 拖拽调整层级顺序
  - 重命名层级节点
  - 合并/拆分层级
  - 为层级节点选择对应页面的截图（Figma API 可导出 Frame 为图片）
- 层级树最终作为导出的 Word 文档的目录结构

---

### 7.3 Key 值管理

#### FR-3.1 Key 自动生成规则
- Key 结构：`{project}.{flow}.{page}.{function}.{shortExplanation}`
- 各段含义与来源：

| 段 | 含义 | 来源 | 示例 |
|----|------|------|------|
| `{project}` | 项目标识 | 创建项目时自动生成 | `VisitorMode` |
| `{flow}` | 业务流程 | 从 Figma 顶级 Frame 名称提取 | `SubmitOrder` |
| `{page}` | 具体页面 | 从 Figma 子 Frame 名称提取 | `Checkout` |
| `{function}` | UI 功能区 | Producer 从预设枚举中选择或手动输入 | `FooterBar` |
| `{shortExplanation}` | 字段简要说明 | Producer 手动输入（英文，驼峰） | `Confirmation` |

- 完整示例：`VisitorMode.SubmitOrder.Checkout.FooterBar.Confirmation`

#### FR-3.2 Key 格式校验
- `{project}` 段：字母数字，首字母大写驼峰
- `{flow}` / `{page}` 段：字母数字，首字母大写驼峰
- `{function}` 段：字母数字，首字母大写驼峰
- `{shortExplanation}` 段：字母数字，首字母大写驼峰，不超过 3 个单词
- 各段之间以 `.` 分隔
- 全 Key 长度不超过 128 字符
- 同一项目内 Key 必须唯一
- 不符合规则时，系统实时标红提示，阻止保存

#### FR-3.3 Key 手动调整
- Producer 可以修改任意段的 Key 值
- 修改时系统实时校验格式
- 支持批量替换某一段的值（如将某 Flow 下所有 Key 的 `{function}` 从 `Footer` 改为 `FooterBar`）

#### FR-3.4 项目内 Key 共享
- Producer 可将字段 B 的文案指向字段 A 的 Key（即引用关系）
- 当字段 A 的文案更新时，所有引用它的字段自动同步
- 引用关系在导出 JSON 中以 `ref` 字段标记
- 仅限同一项目内引用

---

### 7.4 多语言文案编辑

#### FR-4.1 编辑界面
- 每个字段展示一个三语编辑行：中文 | 英文 | 日文
- 编辑模式：点击语言单元格进入编辑态，失焦自动保存
- 支持 Tab 键在同字段各语言间切换
- 显示字符数统计

#### FR-4.2 批量操作
- 支持选中多个字段，批量填入同一文案（适用于多页面通用文案）
- 支持从 Excel/CSV 批量导入已有文案（匹配 Key 进行合并）

#### FR-4.3 文案字段属性
- 每个字段除三语 Copy 外，还维护：
  - **字段类型**：`Label` / `Placeholder` / `Button` / `Error` / `Toast` / `Tooltip` / `Description` / `Other`
  - **是否必填**（三语是否必须全部填写）
  - **字符限制**（如 UI 限制 max 20 字符）
  - **备注**（记录业务背景、约束条件等）

#### FR-4.4 字段类型与场景 Checklist（Phase 1 简化版）
- MVP 中字段类型为手动选择的下拉枚举，选择后展示对应的填写提示：
  - `Error` → "请确认是否覆盖以下场景：空输入 / 格式错误 / 超出限制 / 网络异常"
  - `Toast` → "请确认成功/失败/进行中三种状态文案"
  - `Button` → "请确认 Normal / Disabled / Loading 三种状态"
- 提示仅为 Checklist 文字，不强制校验

---

### 7.5 导出

#### FR-5.1 Word 文档导出
- 导出为 .docx 格式，排版为**左侧 UI 截图 + 右侧文案表格**
- 按页面层级组织章节，每页一个章节
- 每页内容：
  - 左侧：该页面的 Figma Frame 截图（从 Figma API 导出或 Producer 上传）
  - 右侧：表格，列为 `Key | Type | 中文 | English | 日本語`，按 UI 从上到下/从左到右排列
- 封面页：项目名称 + 导出时间 + 语言版本
- Producer 可配置导出范围：全部页面 / 指定页面 / 指定 Flow

#### FR-5.2 JSON 导出
- 导出为标准 JSON 格式，交付开发直接导入项目
- JSON Schema：

```json
{
  "project": "VisitorMode",
  "version": "1.0",
  "exportedAt": "2026-05-25T10:00:00Z",
  "locales": ["zh-CN", "en-US", "ja-JP"],
  "pages": [
    {
      "flow": "SubmitOrder",
      "page": "Checkout",
      "fields": [
        {
          "key": "VisitorMode.SubmitOrder.Checkout.FooterBar.Confirmation",
          "type": "Button",
          "zh-CN": "确认下单",
          "en-US": "Place Order",
          "ja-JP": "注文を確定する"
        },
        {
          "key": "VisitorMode.SubmitOrder.Checkout.FooterBar.TotalPrice",
          "type": "Label",
          "ref": "VisitorMode.SubmitOrder.Menu.FooterBar.TotalPrice"
        }
      ]
    }
  ]
}
```

- `ref` 字段表示该字段引用另一个 Key 的文案，开发侧去重渲染

#### FR-5.3 Excel 导出（兜底格式）
- 针对部分团队的 Excel 导入习惯，保留 Excel 导出
- 单 Sheet，列：`Key | Flow | Page | Function | Type | zh-CN | en-US | ja-JP`

---

## 8. Figma API Integration Design

### 8.1 授权方式
- Producer 从 Figma 账户设置生成 Personal Access Token
- Token 在工作台中加密存储
- 系统通过 Token 调用 Figma REST API：
  - `GET /v1/files/{file_key}` — 获取文件结构
  - `GET /v1/files/{file_key}/nodes?ids={node_ids}` — 获取特定节点详情
  - `GET /v1/images/{file_key}?ids={node_ids}` — 导出 Frame 为图片

### 8.2 文字节点递归提取算法
```
Input: Figma file key + token
1. 调用 /v1/files/{file_key} 获取 Document 树
2. 递归遍历所有 children，过滤 type == "TEXT" 的节点
3. 对每个 TEXT 节点，向上追溯其 parent chain，构建 Frame 路径
4. 按 Frame 路径分组，同一 Frame 下 text 相同的节点标记为可能重复
5. 输出：{ text, framePath, nodeId, style } 列表
```

### 8.3 去重策略
- **同一 Frame 内相同文本** → 自动合并，显示合并来源计数
- **不同 Frame 相同文本** → 不自动合并（属于不同页面/状态），需 Producer 手动判断是否共享 Key
- Producer 可在确认界面手动合并/拆分

---

## 9. Data Model (High-Level)

```
Project
  id: string (PK)
  name: string
  description: string
  locales: string[]        // ["zh-CN", "en-US", "ja-JP"]
  status: enum
  members: User[]
  createdAt: datetime
  updatedAt: datetime

FigmaSource
  id: string (PK)
  projectId: string (FK)
  fileKey: string
  fileName: string
  lastSyncAt: datetime

PageNode
  id: string (PK)
  projectId: string (FK)
  parentId: string | null   // 自引用，构建层级树
  name: string              // e.g. "3.SubmitOrder"
  sortOrder: number
  figmaFrameId: string | null
  screenshot: string | null // Frame 截图 URL
  level: number             // 层级深度

CopyField
  id: string (PK)
  projectId: string (FK)
  pageNodeId: string (FK)
  key: string               // 唯一索引 (project scope)
  type: enum                // Label, Placeholder, Button, Error, Toast, Tooltip, Description, Other
  sortOrder: number         // 在页面中的显示顺序
  refKey: string | null     // 引用目标 Key
  maxLength: number | null
  required: boolean
  note: string
  createdAt: datetime
  updatedAt: datetime

CopyTranslation
  id: string (PK)
  copyFieldId: string (FK)
  locale: string            // "zh-CN" | "en-US" | "ja-JP"
  text: string
  updatedBy: string
  updatedAt: datetime
```

---

## 10. Non-Functional Requirements

| 类别 | 要求 |
|------|------|
| 性能 | Figma 文件解析（含文字提取）在 30s 内完成（< 100 Frame 规模）；列表页加载 < 2s |
| 并发 | 支持 10 个 Producer 同时在线，同项目 3 人同时编辑不同字段无冲突 |
| 安全 | Figma Token 加密存储；平台需账号登录；项目数据按成员权限隔离 |
| 可用性 | 99.5% uptime（工作时间） |
| 浏览器 | 支持 Chrome / Edge 最新两个版本 |
| 国际化 | 平台 UI 语言为英文，支持中/英/日文案内容展示和编辑 |
| 数据 | 所有文案数据实时自动保存，支持手动触发 Figma 重同步 |

---

## 11. Success Metrics

| 指标 | 目标 | 测量方式 |
|------|------|----------|
| Producer 文案交付周期 | 缩短 50% | 对比 Mobile Order 历史耗时 vs 工作台耗时 |
| Key 命名规范合规率 | 100% | 系统自动校验，不合规无法保存 |
| Word 文档导出效率 | 从 2-3 天缩短至一键导出 | Producer 操作耗时统计 |
| Producer 满意度 | ≥ 4.5/5 | 试点后问卷 |

---

## 12. Rollout Plan

| 阶段 | 内容 | 时间 |
|------|------|------|
| Phase 0: 技术预研 | 验证 Figma API 可行性、确认 OCR 引擎中文/日文准确率、搭建原型 | Week 1-2 |
| Phase 1: MVP 开发 | 项目管理 + Figma 集成 + Key 管理 + 多语言编辑 + 导出 | Week 3-10 |
| Phase 2: 历史项目模拟 | 用 Mobile Order（Visitor Mode）完整数据跑通工作流，验证 Key 规则、层级识别、导出效果 | Week 11-12 |
| Phase 3: 新项目试点 | 选取 1 个新项目，Producer 全程使用工作台 | Week 13-16 |
| Phase 4: 复盘 & 迭代 | 收集中试反馈，规划 Phase 2 功能 | Week 17-18 |
| Phase 5: 推广 | 全 Digital Producer 团队切换至工作台 | Week 19+ |

---

## 13. Open Questions & Risks

| # | 问题 / 风险 | 影响 | 应对 |
|---|-------------|------|------|
| R1 | Figma Personal Access Token 的权限范围和安全性 | Figma 文件读取权限可能受限 | 与 Figma Admin 确认 Token 权限策略；考虑未来升级为 OAuth |
| R2 | 各 Studio 设计师的 Figma Frame 命名规范可能不统一 | 自动提取的层级可能混乱 | 提供人工调整能力兜底；逐步推动设计侧命名规范统一 |
| R3 | OCR 中文/日文准确率可能不足 | 方式 B 可用性低 | 前期用 Mobile Order 历史图片做 OCR 准确率测试 |
| R4 | Producer 需要改变与开发团队的协作习惯（Key 从开发定义变为 Producer 定义） | 开发侧可能抵触 | 提前与 DE 沟通新流程，明确角色边界 |
| R5 | 各 Studio 开发团队的 JSON 格式可能有差异 | 导出的 JSON 可能不兼容 | 调研各 Studio 现有 JSON schema，提供自定义 mapping |
| Q1 | 平台是基于现有内部系统构建还是全新独立应用？ | 技术选型、部署策略 | **已确认：全新独立应用** |
| Q2 | Figma API 是否在公司网络环境下可访问？ | 集成可行性 | **不确定，需预研阶段验证；若不通过则用图片+OCR兜底** |
| Q3 | 日文文案是否有专门的翻译人员（而非 Native Speaker）？ | 日文 Copy 的责任归属 | **已确认：有专门的日文翻译人员负责** |

---

## 14. Appendix: Key Naming Convention Reference

### 完整结构
```
{project}.{flow}.{page}.{function}.{shortExplanation}
```

### 段定义
| 段 | 说明 | 是否可修改 | 示例值 |
|----|------|-----------|--------|
| project | 项目缩写，创建项目时设定 | 创建后不可修改 | `VisitorMode`, `AnnualPass` |
| flow | 业务流程，从 Figma 顶级 Frame 名提取 | 可修改 | `SubmitOrder`, `CheckIn` |
| page | 具体页面，从 Figma 子 Frame 名提取 | 可修改 | `Checkout`, `Menu`, `Homepage` |
| function | UI 功能区，预设枚举 + 手动输入 | 可修改 | `FooterBar`, `Header`, `Modal`, `Banner` |
| shortExplanation | 字段简要说明，驼峰英文，≤ 3 词 | 可修改 | `Confirmation`, `PriceDetail`, `EmptyCart` |

### 预设 Function 枚举
`Header`, `FooterBar`, `Modal`, `Banner`, `Toast`, `Card`, `List`, `Form`, `ButtonGroup`, `Tooltip`, `EmptyState`, `LoadingState`, `ErrorState`, `Other`

### 预设 Field Type 枚举
`Label`, `Placeholder`, `Button`, `Error`, `Toast`, `Tooltip`, `Description`, `Link`, `Title`, `Subtitle`, `Other`
