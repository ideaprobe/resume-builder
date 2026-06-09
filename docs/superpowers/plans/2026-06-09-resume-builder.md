# Resume Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an online resume editor with Go backend, React frontend (pnpm), inline editing, multi-resume management, and PDF export.

**Architecture:** pnpm monorepo with `apps/web` (React + `@inline-edit/react`) and `apps/server` (Gin + PostgreSQL JSONB). JWT in localStorage, Bearer auth.

**Tech Stack:** Go, Gin, PostgreSQL, chromedp, React 19, Vite, Tailwind CSS 4, Zustand, TanStack Query, pnpm

---

## Status: MVP Implemented

- [x] Monorepo scaffolding (pnpm workspace, docker-compose)
- [x] PostgreSQL schema + demo user seed
- [x] Go API: auth, resume CRUD, PDF export
- [x] React: login, resume list, editor with inline edit
- [x] Background color picker, custom sections, item add/copy/delete
- [x] Auto-save (1s debounce)

## Run

```bash
docker compose up -d
pnpm install
pnpm dev:server   # terminal 1
pnpm dev          # terminal 2
```

Demo: `demo` / `demo123`
