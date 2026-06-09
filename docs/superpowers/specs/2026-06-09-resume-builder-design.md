# Resume Builder 设计文档

> 日期：2026-06-09  
> 状态：待实现

## 概述

在线简历编辑器，支持模板渲染、内联文字编辑、区块增删复制、背景色切换、多份简历管理与 PDF 导出。

技术栈：**Go 后端 + React 前端**，包管理使用 **pnpm workspace**。

## 需求摘要

| 维度 | 决定 |
|------|------|
| 架构 | Go 服务端 + React 前端 |
| 包管理 | pnpm workspace |
| 账号 | 数据库预置账号，密码登录，无注册 |
| 认证 | JWT 存 **localStorage**，请求头 `Authorization: Bearer <token>`，**不使用 Cookie** |
| 简历管理 | 每人多份独立简历，列表切换 |
| 编辑体验 | 所见即所得，直接点文字编辑，无弹窗 |
| 区块 | 固定核心（基本信息、工作经历、教育、技能）+ 可自定义新区块；条目可增删复制 |
| 样式 | 1 个通用模板；整页背景色（预设色板） |
| 导出 | 服务端 PDF（chromedp） |

## 架构

```
┌─────────────┐   REST/JSON + Bearer JWT   ┌──────────────┐   SQL   ┌────────────┐
│  React SPA  │ ◄────────────────────────► │  Go (Gin)    │ ◄─────► │ PostgreSQL │
│  pnpm       │                            │  API Server  │         │  JSONB     │
└─────────────┘                            └──────────────┘         └────────────┘
       │                                           │
       │  简历模板 + @inline-edit/react             │  chromedp
       └───────────────────────────────────────────┘  HTML → PDF
```

### 技术选型

| 层 | 选型 | 职责 |
|----|------|------|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS | 登录、简历列表、编辑器、导出 |
| 内联编辑 | `@inline-edit/react` | 字段级所见即所得，双击/聚焦即编辑 |
| 状态 | Zustand（编辑器）+ TanStack Query（服务端数据） | 本地编辑状态与服务端同步 |
| 后端 | Go 1.22+ / Gin | 认证、CRUD、PDF 生成 |
| 数据库 | PostgreSQL 16 | users、resumes 表 |
| 迁移 | golang-migrate 或 goose | 数据库版本管理 |
| 认证 | JWT + bcrypt | 无注册，账号 DB 预置 |
| PDF | chromedp | HTML 渲染为 A4 PDF |
| 部署 | Docker Compose | 本地一键启动 |

### 内联编辑组件说明

没有「装上去就是简历编辑器」的现成包。采用拼装方案：

- **单行字段**（姓名、职位、公司等）：`@inline-edit/react`
- **多行字段**（工作描述等）：同库 Textarea 模式
- **区块增删复制**：自写逻辑，操作 JSON 数组
- **背景色**：自写色板组件，修改 `content.theme.backgroundColor`
- **简历模板**：自写 React 组件（`templates/default.tsx`）

参考项目（不直接依赖）：Reactive Resume（数据模型）、Reyzume（编辑交互）。

## 认证方案

### 流程

1. `POST /api/auth/login` 校验用户名密码，返回 `{ token, user }`
2. 前端将 `token` 存入 `localStorage`（key: `auth_token`）
3. 后续请求在 Header 携带 `Authorization: Bearer <token>`
4. `POST /api/auth/logout` 仅前端清除 localStorage（服务端无状态 JWT 可不实现黑名单）
5. Token 过期（建议 7 天）→ 401 → 前端跳转登录页

### 安全注意

- localStorage 易受 XSS 攻击，前端需避免注入风险（React 默认转义 + 不渲染原始 HTML）
- 不使用 httpOnly Cookie，因此 CSRF 风险较低，但仍需校验 CORS

## 页面结构

### 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/login` | 登录页 | 账号 + 密码，无注册入口 |
| `/` | 简历列表 | 当前用户所有简历，新建 / 删除 / 进入编辑 |
| `/editor/:id` | 编辑器 | 左侧工具栏 + 右侧 A4 简历画布 |

### 编辑器布局

```
┌──────────────────────────────────────────────────────────┐
│  ← 返回   简历名称(可编辑)          [保存状态]  [导出 PDF]  │
├──────────┬───────────────────────────────────────────────┤
│  工具栏   │                                               │
│          │         A4 简历画布（直接点字编辑）              │
│ 背景色    │                                               │
│ ○白 ○灰  │   张三  ·  前端工程师                           │
│ ○蓝 ...  │   ─────────────────                           │
│          │   工作经历                          [+ 添加]    │
│ 区块管理  │   ┌ 字节跳动 · 高级工程师 ───── [复制][删除]  │
│ + 自定义  │   │ 2021 - 至今                                │
│          │   │ 负责...                                    │
│          │   └ ...                                        │
│          │   教育背景 / 技能 / 自定义区块 ...               │
└──────────┴───────────────────────────────────────────────┘
```

### 交互要点

- 画布内文字使用 `@inline-edit/react`，双击或聚焦即编辑，无弹窗
- 可重复区块右侧悬浮 `[+ 添加]`、`[复制]`、`[删除]`
- 自定义区块：工具栏「+ 自定义区块」→ 输入标题 → 画布新增一节
- 背景色：工具栏色板点击即生效
- 自动保存：编辑后 1s 防抖，右上角显示「保存中 / 已保存 / 保存失败」

## 数据模型

### `users` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| username | VARCHAR UNIQUE | 登录名 |
| password_hash | VARCHAR | bcrypt |
| created_at | TIMESTAMPTZ | 创建时间 |

账号由管理员直接 INSERT，无注册接口。

### `resumes` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID FK | 所属用户 |
| title | VARCHAR | 列表显示名，如「前端岗」 |
| content | JSONB | 简历全文 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### `content` JSON 结构

```json
{
  "template": "default",
  "theme": {
    "backgroundColor": "#ffffff"
  },
  "sections": [
    {
      "id": "basics",
      "type": "basics",
      "fields": {
        "name": "张三",
        "title": "前端工程师",
        "email": "zhang@example.com",
        "phone": "138xxxx",
        "location": "北京"
      }
    },
    {
      "id": "work-1",
      "type": "work",
      "items": [
        {
          "id": "work-item-1",
          "company": "字节跳动",
          "position": "高级工程师",
          "startDate": "2021-01",
          "endDate": "",
          "description": "负责..."
        }
      ]
    },
    {
      "id": "edu-1",
      "type": "education",
      "items": [
        {
          "id": "edu-item-1",
          "school": "清华大学",
          "degree": "本科",
          "startDate": "2015-09",
          "endDate": "2019-06"
        }
      ]
    },
    {
      "id": "skills-1",
      "type": "skills",
      "items": [
        { "id": "skill-1", "name": "React" },
        { "id": "skill-2", "name": "TypeScript" }
      ]
    },
    {
      "id": "custom-1",
      "type": "custom",
      "title": "证书",
      "items": [
        { "id": "custom-item-1", "content": "PMP 认证" }
      ]
    }
  ]
}
```

### 区块规则

- `basics`：固定存在，单条 `fields`，不可删除
- `work` / `education` / `skills`：固定类型，可增删 `items`，第一版各保留一个 section 容器，不可删除整个 section
- `custom`：可整节增删，标题用户自定义
- 所有 `id` 前端用 `crypto.randomUUID()` 生成

### 预设背景色

`#ffffff`（白）、`#f5f5f5`（浅灰）、`#f0f4f8`（浅蓝）、`#faf8f5`（米色）、`#f8f5ff`（浅紫）

## API 接口

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/api/auth/login` | `{username, password}` → `{token, user}` | 否 |
| POST | `/api/auth/logout` | 前端清除 token 即可 | 否 |
| GET | `/api/auth/me` | 当前用户信息 | Bearer JWT |
| GET | `/api/resumes` | 当前用户简历列表 | Bearer JWT |
| POST | `/api/resumes` | 创建空简历 `{title}` | Bearer JWT |
| GET | `/api/resumes/:id` | 获取完整 content | Bearer JWT |
| PATCH | `/api/resumes/:id` | 更新 `{title?, content?}` | Bearer JWT |
| DELETE | `/api/resumes/:id` | 删除简历 | Bearer JWT |
| POST | `/api/resumes/:id/export` | 返回 PDF 文件流 | Bearer JWT |

所有 resume 操作校验 `user_id` 归属，跨用户访问返回 403。

### PATCH 策略

第一版整份 `content` 全量替换（前端 1s 防抖后发送），简单可靠。后续可改为 JSON Patch 优化带宽。

## PDF 导出

### 主方案：chromedp

```
POST /api/resumes/:id/export
  → 读取 content JSON
  → Go html/template 渲染 HTML（与前端视觉一致）
  → chromedp 无头 Chrome 打印为 A4 PDF
  → 返回 application/pdf
```

| 项 | 决定 |
|----|------|
| 纸张 | A4，边距 20mm |
| 样式 | 导出专用 CSS，与编辑器画布一致 |
| 背景色 | 应用 `theme.backgroundColor` |
| 字体 | Noto Sans SC 或系统安全字体 |

Docker 镜像需安装 Chromium。

### 降级方案

前端 `window.print()` + 打印样式表，仅作开发备选，不作为主路径。

## 项目结构

```
resume-builder/
├── pnpm-workspace.yaml
├── package.json
├── docker-compose.yml
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── pages/          # Login, ResumeList, Editor
│   │   │   ├── components/
│   │   │   │   ├── editor/     # ResumeCanvas, SectionBlock, Toolbar
│   │   │   │   └── ui/
│   │   │   ├── templates/      # default.tsx
│   │   │   ├── hooks/          # useAutoSave, useAuth
│   │   │   ├── api/            # fetch 封装（自动带 Bearer token）
│   │   │   └── types/
│   │   └── package.json
│   └── server/
│       ├── cmd/server/main.go
│       ├── internal/
│       │   ├── handler/
│       │   ├── service/
│       │   ├── repository/
│       │   ├── model/
│       │   ├── middleware/     # JWT 鉴权（解析 Authorization header）
│       │   └── pdf/
│       ├── templates/            # PDF HTML 模板
│       ├── migrations/
│       └── go.mod
└── docs/
    └── superpowers/specs/
```

## MVP 交付范围

### 包含

- 账号密码登录（DB 预置账号，JWT 存 localStorage）
- 简历列表：新建、删除、切换
- 编辑器：内联编辑、区块条目增删复制、自定义区块、背景色切换
- 1 个 `default` 模板
- 自动保存（1s 防抖）
- 服务端 PDF 导出
- Docker Compose 本地一键启动

### 不包含（后续迭代）

- 用户注册 / 管理后台
- 多模板切换
- 拖拽排序区块
- 富文本（加粗、斜体等）
- 历史版本 / 撤销重做
- 简历分享链接
- JWT 刷新 Token / 黑名单

## 错误处理

| 场景 | 行为 |
|------|------|
| 401 未认证 / Token 过期 | 清除 localStorage，跳转登录页 |
| 403 无权访问 | Toast 提示「无权访问」 |
| 保存失败 | 右上角显示「保存失败」，保留本地编辑状态，可重试 |
| PDF 导出失败 | Toast 提示错误信息 |
| 网络断开 | 编辑器仍可编辑，恢复网络后自动重试保存 |
