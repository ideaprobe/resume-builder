# Resume Builder 设计文档

> 日期：2026-06-09  
> 状态：**部分实现**（最后核对：2026-06-10）

### 实现状态图例

| 标记 | 含义 |
|------|------|
| ✅ | 已实现，与规格一致或基本满足 |
| ⚠️ | 部分实现 / 实现方式与规格有差异 |
| ❌ | 未实现 |
| 🆕 | 规格标为「不包含」，但代码中已实现 |

---

## 概述

在线简历编辑器，支持模板渲染、内联文字编辑、区块增删复制、背景色切换、多份简历管理与 PDF 导出。

技术栈：**Go 后端 + React 前端**，包管理使用 **pnpm workspace**。

## 需求摘要

| 维度 | 决定 | 状态 |
|------|------|------|
| 架构 | Go 服务端 + React 前端 | ✅ |
| 包管理 | pnpm workspace | ✅ `pnpm-workspace.yaml` |
| 账号 | 数据库预置账号，密码登录，无注册 | ✅ `migrations/001_init.sql` |
| 认证 | JWT 存 **localStorage**，`Authorization: Bearer` | ✅ `api/client.ts`, `middleware/auth.go` |
| 简历管理 | 每人多份独立简历，列表切换 | ✅ `ResumeListPage.tsx` |
| 编辑体验 | 所见即所得，直接点文字编辑，无弹窗 | ⚠️ 自研 `InlineField`，非 `@inline-edit/react` |
| 区块 | 固定核心 + 可自定义新区块；条目可增删复制 | ✅；`skills` 已改为 **`certificates`** |
| 样式 | 1 个通用模板；整页背景色（预设色板） | ⚠️ 10 套**渐变页眉**预设，非 5 色平面背景 |
| 导出 | 服务端 PDF（chromedp） | ✅ `internal/pdf/generator.go` |

## 架构

```
┌─────────────┐   REST/JSON + Bearer JWT   ┌──────────────┐   SQL   ┌────────────┐
│  React SPA  │ ◄────────────────────────► │  Go (Gin)    │ ◄─────► │ PostgreSQL │
│  pnpm       │                            │  API Server  │         │  JSONB     │
└─────────────┘                            └──────────────┘         └────────────┘
       │                                           │
       │  简历模板 + 自研内联编辑 + TipTap            │  chromedp
       └───────────────────────────────────────────┘  HTML → PDF
```

### 技术选型

| 层 | 选型 | 职责 | 状态 |
|----|------|------|------|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS | 登录、简历列表、编辑器、导出 | ✅ |
| 内联编辑 | ~~`@inline-edit/react`~~ → 自研 `InlineField` + TipTap | 字段级所见即所得 | ⚠️ 见下文 |
| 状态 | Zustand（编辑器）+ TanStack Query（服务端数据） | 本地编辑状态与服务端同步 | ✅ |
| 后端 | Go 1.22+ / Gin | 认证、CRUD、PDF 生成 | ✅ |
| 数据库 | PostgreSQL 16 | users、resumes 表 | ✅ |
| 迁移 | ~~golang-migrate / goose~~ → Docker 挂载 SQL | 数据库版本管理 | ⚠️ `001_init.sql` 手动初始化 |
| 认证 | JWT + bcrypt | 无注册，账号 DB 预置 | ✅ |
| PDF | chromedp | HTML 渲染为 A4 PDF | ✅ |
| 部署 | Docker Compose | 本地一键启动 | ⚠️ 仅 PostgreSQL 容器，应用需本地启动 |

### 内联编辑组件说明

没有「装上去就是简历编辑器」的现成包。采用拼装方案：

| 方案 | 规格 | 实际 | 状态 |
|------|------|------|------|
| 单行字段 | `@inline-edit/react` | `InlineField.tsx`（`<input>` 原地编辑） | ⚠️ |
| 多行字段 | 同库 Textarea 模式 | TipTap `InlineRichText.tsx`（工作描述、自定义区块） | 🆕 超出规格 |
| 区块增删复制 | 自写逻辑 | `ItemActions.tsx` + 各 `*Block` | ✅ |
| 背景色 | 色板改 `theme.backgroundColor` | 渐变预设 `THEME_PRESETS` + `Toolbar.tsx` | ⚠️ |
| 简历模板 | `templates/default.tsx` | 同路径 | ✅ |

参考项目（不直接依赖）：Reactive Resume（数据模型）、Reyzume（编辑交互）。

## 认证方案 ✅

### 流程

| 步骤 | 状态 | 实现位置 |
|------|------|----------|
| `POST /api/auth/login` → `{ token, user }` | ✅ | `handler/auth.go` |
| token 存入 `localStorage`（`auth_token`） | ✅ | `api/client.ts` |
| Header `Authorization: Bearer <token>` | ✅ | `api/client.ts` |
| `POST /api/auth/logout` 前端清除 | ✅ | `ResumeListPage.tsx` `clearToken()`（无服务端路由，符合规格） |
| Token 过期 401 → 跳转登录 | ✅ | `api/client.ts` |

### 安全注意

- localStorage XSS：React 转义 + 富文本经 DOMPurify（`sanitizeHtml.ts`）✅
- 无 httpOnly Cookie，CORS 校验 ⚠️ 基础实现

## 页面结构

### 路由 ✅

| 路径 | 页面 | 状态 | 文件 |
|------|------|------|------|
| `/login` | 登录页 | ✅ | `pages/LoginPage.tsx` |
| `/` | 简历列表 | ✅ | `pages/ResumeListPage.tsx` |
| `/editor/:id` | 编辑器 | ✅ | `pages/EditorPage.tsx` |

### 编辑器布局 ✅

```
┌──────────────────────────────────────────────────────────┐
│  ← 返回   简历名称(可编辑)          [保存状态]  [导出 PDF]  │  ✅ EditorPage header
├──────────┬───────────────────────────────────────────────┤
│  工具栏   │         A4 简历画布（直接点字编辑）              │  ✅ Toolbar + default.tsx
│ 页眉配色  │   姓名 · 职位 · 联系方式                        │
│ 预设渐变  │   工作经历 / 教育 / 证书 / 自定义 ...            │
│ + 自定义  │   [拖拽把手排序区块] 🆕                         │
│ 加载示例  │   [头像上传] 🆕                                 │
└──────────┴───────────────────────────────────────────────┘
```

### 交互要点

| 交互 | 状态 | 说明 |
|------|------|------|
| 画布内点字即编辑，无弹窗 | ✅ | `InlineField` / `InlineRichText` |
| 条目 `[+ 添加]`、`[复制]`、`[删除]` | ✅ | `SectionHead` + `ItemActions` |
| 工具栏「+ 自定义区块」 | ✅ | `Toolbar.tsx` → `createEmptyCustomSection` |
| 背景/页眉配色点击即生效 | ✅ | `THEME_PRESETS` 色板 |
| 自动保存 1s 防抖 + 状态徽章 | ✅ | `useAutoSave.ts` + `EditorPage.tsx` |
| 导出前静默保存 + 导出中遮罩 | 🆕 | `flush({ silent: true })` |
| 区块拖拽排序 | 🆕 | `SortableSections.tsx`（@dnd-kit） |
| 加载马超示例数据 | 🆕 | `data/sampleMachao.ts` |

## 数据模型

### `users` 表 ✅

`apps/server/migrations/001_init.sql` — 含 demo 账号。

### `resumes` 表 ✅

`content` JSONB，`handler/resume.go` + `repository/resume.go`。

### `content` JSON 结构 ⚠️

与规格示例大体一致，差异：

| 字段 | 规格 | 实际 | 状态 |
|------|------|------|------|
| `theme.backgroundColor` | 平面色 | 仍兼容；主推 `gradient` + `accent` + `heroTone` | ⚠️ |
| `theme` | 仅 backgroundColor | `ResumeTheme` 含渐变、强调色、页眉文字色 | ⚠️ |
| `basics.fields.avatar` | 未提及 | base64 头像字段 | 🆕 |
| `type: skills` | 技能标签 | 已改为 **`certificates`**（证书） | ⚠️ 破坏性变更 |
| `description` / `content` | 纯文本 | 富文本 HTML（TipTap） | 🆕 |

```json
{
  "template": "default",
  "theme": {
    "gradient": "linear-gradient(...)",
    "accent": "#5b5bd6",
    "heroTone": "light"
  },
  "sections": [ "basics", "work", "education", "certificates", "custom..." ]
}
```

### 区块规则

| 规则 | 状态 |
|------|------|
| `basics` 固定、不可删 | ✅ |
| `work` / `education` 可增删 items，section 容器不可删 | ✅ |
| ~~`skills`~~ → `certificates` | ⚠️ 类型已替换 |
| `custom` 可整节增删、标题自定义 | ✅ |
| `id` 用 `crypto.randomUUID()` | ✅ `createId()` |
| 区块顺序用户可拖拽 | 🆕 `reorderResumeSections()`，顺序同步 PDF |

### 预设背景色 ⚠️

规格 5 色平面背景 → 实际 **10 套渐变页眉预设**（`THEME_PRESETS`：`indigo-dusk`、`wine-rose` 等）。

## API 接口

| 方法 | 路径 | 状态 | 备注 |
|------|------|------|------|
| POST | `/api/auth/login` | ✅ | |
| POST | `/api/auth/logout` | ✅ | 仅前端清 token |
| GET | `/api/auth/me` | ✅ | |
| GET | `/api/resumes` | ✅ | |
| POST | `/api/resumes` | ✅ | |
| GET | `/api/resumes/:id` | ✅ | |
| PATCH | `/api/resumes/:id` | ✅ | 整份 content 全量替换 |
| DELETE | `/api/resumes/:id` | ✅ | |
| POST | `/api/resumes/:id/export` | ✅ | 返回 PDF 流 |

`user_id` 归属校验 → 403 ✅ `handler/resume.go`

### PATCH 策略 ✅

1s 防抖全量 PATCH，与规格一致。`useAutoSave.ts`

## PDF 导出 ⚠️

### 主方案：chromedp ✅

```
POST /api/resumes/:id/export
  → content JSON
  → Go text/template 渲染 resume.html
  → chromedp PrintToPDF
  → application/pdf
```

| 项 | 规格 | 实际 | 状态 |
|----|------|------|------|
| 纸张 | A4，边距 20mm | A4 **零边距**，`resume-canvas` 铺满 | ⚠️ |
| 样式 | 导出 CSS 与编辑器一致 | 共享 `export/resume-canvas.css` + `print.css` | ✅ |
| 背景/主题 | `theme.backgroundColor` | `resolveThemeStyle()` CSS 变量 + 渐变 | ⚠️ |
| 字体 | Noto Sans SC | LXGW WenKai（霞鹜文楷）+ 等待 `document.fonts` | ⚠️ |
| 联系方式图标 | 未单独说明 | 已补 SVG（邮箱/电话/地址） | ✅ |
| 富文本 HTML | 未提及 | `formatBody` 渲染，非转义 | ✅ |
| 区块顺序 | 未提及 | 跟随 `sections` 数组顺序 | 🆕 |
| Docker Chromium | 需要 | 需本机/镜像安装 Chrome | ⚠️ |

实现文件：`internal/pdf/generator.go`、`templates/resume.html`、`templates/export/*`

### 降级方案 ❌

前端 `window.print()` 未实现。

## 项目结构 ✅

与规格基本一致，额外：

- `apps/web/src/data/sampleMachao.ts` — 示例数据 🆕
- `apps/web/src/components/editor/SortableSections.tsx` — 拖拽排序 🆕
- `apps/web/src/components/ui/InlineRichText.tsx` — 富文本 🆕
- `apps/web/src/components/resume/AvatarUpload.tsx` — 头像 🆕
- `apps/server/templates/export/` — PDF 专用 CSS  bundle

## MVP 交付范围

### 包含

| 功能 | 状态 |
|------|------|
| 账号密码登录（DB 预置，JWT localStorage） | ✅ |
| 简历列表：新建、删除、切换 | ✅ |
| 编辑器：内联编辑、条目增删复制、自定义区块 | ✅ |
| 背景/页眉配色切换 | ⚠️ 渐变预设，非平面 5 色 |
| 1 个 `default` 模板 | ✅ |
| 自动保存（1s 防抖） | ✅ |
| 服务端 PDF 导出 | ✅ |
| Docker Compose 本地一键启动 | ⚠️ 仅数据库容器 |

### 不包含（后续迭代）— 实际对照

| 功能 | 规格 | 实际 |
|------|------|------|
| 用户注册 / 管理后台 | ❌ 不包含 | ❌ 未实现 |
| 多模板切换 | ❌ 不包含 | ❌ 仅 `default` |
| 拖拽排序区块 | ❌ 不包含 | 🆕 **已实现** |
| 富文本（加粗、斜体等） | ❌ 不包含 | 🆕 **已实现**（TipTap） |
| 历史版本 / 撤销重做 | ❌ 不包含 | ❌ 未实现 |
| 简历分享链接 | ❌ 不包含 | ❌ 未实现 |
| JWT 刷新 / 黑名单 | ❌ 不包含 | ❌ 未实现 |

### 规格未列、已实现的其他功能 🆕

- 头像上传与 WASM 压缩（`AvatarUpload.tsx`、`compressImage.ts`）
- 证书区块（替代技能 `skills`）
- 页眉渐变 + 多预设主题 + 深浅文字自适应
- 导出 loading 遮罩、防重复点击
- 「加载马超示例」一键填充

## 错误处理

| 场景 | 规格 | 状态 |
|------|------|------|
| 401 / Token 过期 | 清 localStorage，跳转登录 | ✅ `api/client.ts` |
| 403 无权访问 | Toast「无权访问」 | ⚠️ 后端有文案，前端无专用 Toast |
| 保存失败 | 右上角「保存失败」，保留本地状态 | ✅ |
| PDF 导出失败 | Toast 提示 | ⚠️ 使用 `alert()` |
| 网络断开 → 恢复后自动重试保存 | 自动重试 | ❌ 未实现 |

---

## 待办 / 与规格差距（优先级参考）

1. ❌ `skills` 与 `certificates` 规格文档同步（或恢复兼容）
2. ⚠️ Docker Compose 补齐 server + web + Chromium
3. ❌ 离线保存重试、403/PDF 错误 Toast 化
4. ❌ 多模板、分享链接、版本历史（仍属后续迭代）
5. ⚠️ 数据库迁移工具（goose / golang-migrate）替代纯 SQL 挂载
