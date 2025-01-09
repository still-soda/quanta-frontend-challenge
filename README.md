# Quanta — 前端挑战

Quanta 前端挑战是一个面向前端开发者的在线评测平台。通过完善的功能设计，提供顺畅
的前端训练和挑战体验，帮助用户提高技能并进行专业化训练。

---

## 功能概述

### 管理员功能

-  发布挑战
-  修改挑战
-  发布公告
-  查看用户作答情况（包括得分等）
-  用户审查与管理

### 用户功能

-  参与挑战作答
-  查看个人作答详情
-  查看个人活跃记录
-  查看排名
-  查看公告

---

## 技术栈

### 前端

-  **TypeScript + Vue 3.0 + Vite**
-  **Vue Router**
-  **Pinia**
-  **TailwindCSS**
-  **ECharts**

### 后端

#### 开发

-  **NestJS**
-  **Swagger**
-  **Redis (ioredis)**
-  **RabbitMQ (bull)**
-  **MongoDB (mongoose)**
-  **class-validator, class-transformer**

#### 测试

-  **Jest**
-  **ioredis-mock**
-  **mongodb-memory-server**

### 工程化

-  **CI/CD** : GitHub Actions
-  **代码管理** : Monorepo (pnpm Workspaces)
-  **前端监控** : Sentry

---

## 快速启动

按照以下步骤运行项目：

1. **克隆仓库**

   ```bash
   git clone https://github.com/still-soda/quanta-frontend-challenge.git
   ```

2. **安装依赖**

   ```bash
   cd quanta-frontend-challenge
   pnpm install
   ```

3. **启动前端 Web**

   ```bash
   cd ./packages/frontend/web
   pnpm run dev
   ```

4. **启动后端服务**
   ```bash
   cd ./packages/backend
   pnpm run start
   ```

---

## 项目结构

```
quanta-frontend-challenge
├─ .npmrc
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
├─ tsconfig.json
├─ utils/           ## @challenge/utils
├─ public/
├─ packages
│  ├─ frontend
│  │  └─ web/       ## @challenge/client-web
│  └─ backend/      ## @challenge/backend
└─ api/             ## @challenge/api
```

### 项目说明

1. `@challenge/client-web` : 前端 Web 项目；
2. `@challenge/utils` : 工具库；
3. `@challenge/api` : 基于 `Fetch API` 封装的请求库；
4. `@challenge/backend` : 后端服务项目；

---

## 贡献指南

欢迎举报问题和提交 PR！如果您对项目有任何建议，请通过以下方式联系我们：

-  提交 [Issues](https://github.com/still-soda/quanta-frontend-challenge/issues)
-  提交 Pull Request

如需进一步讨论，请通过项目页面的联系方式与我们交流。

---

## License

AGPL-3.0 © 2025 still-soda
