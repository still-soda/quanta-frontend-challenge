# Quanta 前端挑战

## 简介

Quanta 前端挑战可以理解为针对前端开发的 OJ (Online Judgement)，其可以为用户提供
顺畅的前端练习体验。管理员在管理系统发布挑战后，用户可以参与挑战作答，并由系统的
判题机进行自动判题，完成后将结果反馈给用户。

## 功能

-  管理员
   -  发布挑战
   -  修改挑战
   -  发布公告
   -  查看用户作答情况（包括得分等）
   -  用户审查
   -  用户操作
-  用户
   -  参与挑战作答
   -  查看个人作答详情
   -  查看个人活跃记录
   -  查看排名
   -  查看公告

## 技术栈

### 前端

-  TypeScript + Vue 3.0 + Vite
-  Vue Router
-  Pinia
-  TailwindCSS
-  ECharts

### 后端

#### 开发

-  NestJS
-  Swagger
-  Redis (ioredis)
-  RabbitMQ (bull)
-  MongoDB (mongoose)
-  class-validator, class-transformer

#### 测试

-  Jest
-  ioredis-mock
-  mongodb-memory-server
-

### 工程化

-  **CI/CD** : GitHub Actions
-  **代码管理** : Monorepo (pnpm Workspaces)
-  **前端监控** : Sentry

## 运行

1. 克隆该仓库
   ```bash
   git clone https://github.com/still-soda/quanta-frontend-challenge.git
   ```
2. 安装依赖
   ```bash
   cd quanta-frontend-challenge
   pnpm install
   ```
3. 运行Web端
   ```bash
   cd ./packages/frontend/web
   pnpm run dev
   ```
4. 运行后端
   ```bash
   cd ./packages/backend
   pnpm run start
   ```

### 项目结构

```txt
quanta-frontend-challenge
├─ .npmrc
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
├─ tsconfig.json
├─ utils/           ## @challenge/utils
├─ public
│  └─ Backend Design.excalidraw
├─ packages
│  ├─ frontend
│  │  └─ web/       ## @challenge/client-web
│  └─ backend/      ## @challenge/backend
└─ api/             ## @challenge/api
```

1. `@challenge/client-web` 为前端 Web 项目;
2. `@challenge/utils` 为工具库;
3. `@challenge/api` 为基于 `Fetch API` 封装的请求库;
4. `@challenge/backend` 为后端项目;
