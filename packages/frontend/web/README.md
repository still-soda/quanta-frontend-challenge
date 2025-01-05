# Quanta 前端挑战 Web 端

## 技术栈

-  Vue + Vite
-  TailwindCSS
-  Pinia
-  Vue Router

## 基于路由的视图文件夹配置

### 命名和嵌套规则

在 `src/views` 文件夹下，`app` 文件夹映射到路由的 `/`，`auth` 文件夹映射到路由的
`/auth/`。

在视图文件夹中，除了 `components` 、`utils` 以外的文件夹，统一为相应名称的子路由
的入口文件夹，例如：

-  `src/views/app/dashboard` 应当映射到 `/dashboard` 路由；
-  `src/views/auth/login` 应当映射到 `/auth/login` 路由；

### 布局和入口文件

在视图文件夹中，规定 `layout.vue` 文件作为子视图的布局容器，`index.vue` 作为当前
视图的入口文件。
