# Resume Builder

在线简历编辑器 — Go 后端 + React 前端。

## 快速开始

### 1. 启动数据库

```bash
docker compose up -d
```

### 2. 启动后端

```bash
cp .env.example .env
# 数据库默认端口 5433（避免与本机 PostgreSQL 5432 冲突）
pnpm dev:server
```

### 3. 启动前端

```bash
pnpm install
pnpm dev
```

访问 http://localhost:5173

**演示账号：** `demo` / `demo123`

## 功能

- 账号密码登录（JWT 存 localStorage）
- 多份简历管理
- 内联编辑（双击文字直接修改）
- 工作经历 / 教育 / 技能条目增删复制
- 自定义区块
- 背景色切换
- PDF 导出（需本机安装 Chrome/Chromium）

## 技术栈

- 前端：React + Vite + Tailwind CSS 4 + daisyUI 5 + pnpm
- 后端：Go + Gin + PostgreSQL + chromedp
