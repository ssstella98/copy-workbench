# HANDOFF — Producer Copy Workbench

> 写给下一个会话 · 2026-07-12

---

## 我们在做什么

为迪士尼 Digital Producer 团队构建一个**文案管理工作台（Copy Workbench）**，覆盖从 Figma 设计稿 → Key 生成 → 文案撰写的全流程。前端原型为单文件 HTML（`figma-key-demo.html`），目前约 2,000+ 行。

### 两大核心模块

| 模块 | 状态 | 功能 |
|------|------|------|
| Key Generator | 完成 | Figma API → 扫描 TEXT 节点 → 自动生成 `Domain.Page.Module.Title.Body` Key → 编辑/隐藏/导出 |
| Copywriting | 刚完成 | 三层 Prompt 架构 → AI 写文案 → 合规审查 → 保存 |

---

## 已完成的工作

### 1. Key Generator Tab（稳定）

- Figma REST API 集成（`/v1/files/{key}` + `/v1/images/{key}`）
- CANVAS → Frame 扫描 + 页面选择器（内联面板，非弹窗）
- TEXT 节点递归提取 + 动态数据过滤（纯数字/日期/邮箱/单符号自动排除）
- 设备框/封面页自动跳过
- `Domain.Page.Module.Title.Body` Key 自动生成
  - Page: Frame 名称 → 去前缀 → 译英文 → CamelCase（可手动改）
  - Module: 26 枚举值，关键词 + 位置自动检测（可手动改）
  - Title: 四级 fallback（精确匹配→子串→拆词→AI 翻译）
- 左侧 Figma 预览 + 右侧 Key 表格，hover 联动蓝色虚线框选
- 字段隐藏/删除、Frame 间翻页（键盘 ← →）
- 导出 JSON / CSV
- Figma API 限流重试（指数退避 6s→18s→54s→162s→486s）
- 图片分块拉取（每批 20 ID，间隔 1.5s）

### 2. Copywriting Tab（刚完成，需测试）

- 三层 Prompt 架构：
  - Layer 1: 项目背景（整行 textarea，项目级）
  - Layer 2: User Flow 描述（左侧栏，按 Figma CANVAS 级别匹配，切换页面自动切换）
  - Layer 3: 字段级提示（每行 🤖 按钮打开弹窗填写）
- 文案编辑表格：`# | Key Name | 💬 | 🇨🇳中文 | 🇺🇸English | ✓合规 | 🤖`
- 每行 🤖 → 弹窗：填提示 → 🪄 生成 → 预览中/英 + 即时合规检查 → ✅ 填入
- 🤖 批量生成：遍历所有有 Layer 3 提示的字段，逐条调 DeepSeek API
- 🔍 合规审查：审查当前页所有文案，分 ✅/⚠/✗，弹窗展示详情
- Layer 1/2/3 prompts 随保存写入 IndexedDB

### 3. 项目管理

- 项目列表页（localStorage）+ CRUD（新建/编辑/删除）
- IndexedDB 持久化：`figmaData`（Figma 原始数据+截图）+ `projectKeys`（Key 数据+提示词）
- 进入已保存项目不调 Figma API，直接展示缓存
- 手动「🔄 同步 Figma」才重新拉取

### 4. 规则与 Skills

- `Key Rules/key-rules-config.json`: Key 生成规则配置（demo fetch 加载，可热更新）
- `.claude/skills/generate-key.md`: Key 生成 Skill
- `.claude/skills/copywriting.md`: 文案撰写 Skill（含 8 种类型规范 + 15 条合规规则）
- `Copy Parking-lot/copy-style-guide.md`: 基于 166,616 条已上线文案提炼的规范文档
- `Copy Parking-lot/copy-rules.json`: 机器可读文案规则

### 5. 文档

- `Spec-figma-key-demo.md`: 详细产品规格（v3.0）
- `Tech-Brief.md`: 技术概要
- `Key Rules/Key-Rules.md`: Key 规则文档

---

## 当前代码位置

**主文件：** `figma-key-demo.html`（单文件，~2,000+ 行）

**启动方式：**
```bash
cd "/Users/stella98/Desktop/达贡族/迪士尼/Producer Flow"
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080/figma-key-demo.html
```
**绝对不能**用 `file://` 协议打开——CORS 会拦截 Figma API 和 DeepSeek API 调用。

---

## 下一步计划

### 立即可做

1. **测试 Copywriting Tab 完整流程**：Key Generator 保存 → 切换 Copywriting → 填 Layer 1 → 切换 CANVAS 填 Layer 2 → 某行 🤖 → 填提示 → 生成 → 确认
2. **补充 `key-rules-config.json` 的翻译词表**：目前 fallback 词表 120+ 条，HMH 新词持续补充
3. **Git 同步**：`git add -u && git commit -m "..." && git push`

### 中期

4. **后端开发**：Figma API 代理（解决 Token 安全性 + 限流）、用户认证、数据库
5. **AI 翻译优化**：Copywriting Tab 中 EN 字段的 AI 翻译质量和速度
6. **多 Figma 文件支持**：项目关联多个 Figma 文件（数据结构已是数组，改 UI 即可）

### 远期

7. **在线审核流转**：Legal → PA → Native Speaker 在平台内审核
8. **文案资产库**：历史 approved 文案检索复用
9. **日文自动翻译**

---

## 绝对不要踩的坑

1. **不要用 `file://` 打开 HTML** → Figma API 和 DeepSeek API 都会被 CORS 拦截。必须用 `localhost` 访问。

2. **不要一次传太多 Figma image ID** → `/v1/images` 端点 URL 长度有限制，超过 20 个 ID 会 400。已改成分块 20 个 + 间隔 1.5s。

3. **Figma API 429 限流** → 限流窗口约 1 分钟。已加了指数退避重试（6s→18s→54s→162s→486s）。不要连续疯狂刷新。

4. **不要删除 IndexedDB 数据** → `figmaData` 和 `projectKeys` 两个 store 存了所有项目数据。清浏览器缓存会丢失。

5. **不要混用 localStorage 和 IndexedDB 的 key** → 项目列表用 localStorage key `cw_projects`，Figma/Key 数据用 IndexedDB key `projectId`。

6. **修改 `renderWorkspace` 要小心** → 这个函数已重构为 `renderKeyWorkspace` + `renderCopywritingTab` 两个分支。加新功能时不要往旧的 inline HTML 里塞代码，抽成独立 render 函数。

7. **不要修改 `key-rules-config.json` 的结构而不更新 fallback** → demo 启动时 fetch JSON，失败则用 `FALLBACK_TITLE_MAP` 和 `FALLBACK_MODULE_KEYWORDS`。改 JSON schema 时记得同步更新 fallback。

8. **DeepSeek API 格式** → 用的是 OpenAI 兼容格式（`/v1/chat/completions`），`Authorization: Bearer <key>`，响应在 `data.choices[0].message.content`。

9. **Copywriting Tab 的 Layer 2 切换** → 切换 Frame 或 CANVAS 时，必须先 `saveLayer2Input()` 保存当前 textarea 值到 `WS.layer2Prompts[canvasName]`，再切换。否则数据丢失。

10. **GitHub Push Protection** → 这个仓库开启了 Secret Scanning。不要提交包含 Figma Token 或 API Key 的文件。`终端存储的输出.txt` 已被 gitignore。

---

## 关键文件清单

```
Producer Flow/
├── figma-key-demo.html              ← 主程序（当前工作焦点）
├── copywriting-proto.html           ← Copywriting Tab 原型图
├── HANDOFF.md                       ← 本文档
├── Spec-figma-key-demo.md           ← 产品规格 v3.0
├── Tech-Brief.md                    ← 技术概要
├── .gitignore
├── .claude/skills/
│   ├── generate-key.md
│   └── copywriting.md
├── Key Rules/
│   ├── key-rules-config.json        ← Key 生成规则（可热更新）
│   ├── Key-Rules.md
│   ├── Key生成规则-V1.docx
│   └── Page Elements_for key-value.pptx
├── Copy Parking-lot/
│   ├── 2025/                        ← 38 个 Key_Library Excel 文件
│   ├── compliance-experience-rules.json
│   ├── copy-style-guide.md
│   └── copy-rules.json
```

---

## 如果新会话要接手

直接说：
> "请先阅读 HANDOFF.md，然后打开 figma-key-demo.html 理解当前代码状态。我们在做迪士尼 Producer 文案工作台。"

然后告诉 Claude 你要做什么具体任务。
