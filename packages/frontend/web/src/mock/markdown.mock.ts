const markdownMock = `
# 前端挑战（FrontEnd-Challenge）项目文档

## 项目简介

本项目是为前端学习者开放的一个学习平台，通过完成平台上定期发布的挑战任务来实现能力的提升。

## 项目功能

### 客户端

进入首页，查看项目简介和功能，点击注册根据学号和姓名创建账号（当前仅对实习生开放），随后可以登录，登陆后进入仪表盘（Dashboard）。

仪表盘展示成员当前信息：

-  连续完成挑战次数
-  挑战总得分
-  站内总排名
-  挑战热点图
-  最新挑战、全部挑战
-  挑战得分图表

项目左侧侧边栏显示多个分类：CSS挑战、JS挑战，以及后续会退出的 Vue 挑战和 React 挑战。

点击左侧任意一个挑战标签进入挑战选择页面，展示全部挑战，最新发布的重点展示。点击单条挑战会进入JS挑战详情页面。CSS挑战页面同理，但是需要在挑战右侧展示CSS略缩图。挑战选择页面上方展示挑战分类标签，方便分类训练。

挑战详情页面分为以下几个部分：

1.  顶部标题
2.  挑战描述
3.  挑战标签
4.  得分要点
5.  预览图（CSS挑战或任何对效果有要求的挑战）
6.  附件下载（提供单个或多个（合并为压缩包）下载）
7.  答案提交
8.  历史提交结果、得分以及得分细则

首页点击个人排名进入详细排名，排名定时刷新（一周或一天），每隔一段大的时间重置评分（赛季设定），但是保留历史最后一次排名。

首页点击热点图进入个人历史作答页面，可以查看所有历史作答。

### 管理端

管理端分为一级管理员和二级管理员，一级管理员有权添加二级管理员，或将二级管理员提升为一级管理员。

所有管理员均可发布挑战，二级管理员可以删除自己创建的挑战，一级管理员无限制。同样的权限，管理员有权关闭挑战，开启挑战等。

仅一级管理员有权删除用户，或者禁赛用户。

管理员有权查看所有挑战的作答记录，源码等等。

#### 发布挑战

-  上传附件，以供成员下载，如有多个需要打包成压缩包
-  编写问题描述，（富文本 / Markdown）编辑，包括图片等等；以及得分规则
-  编写判题规则
   -  指定设备型号（用于页面检测）
   -  指定每个步骤的操作流程
   -  指定每个步骤的预期结果
   -  指定每个步骤的得分
   -  *上传标准答案文件（主要用于CSS挑战的画面匹配）
   -  *指定画面偏差阈值（CSS挑战实现效果的比较阈值）

#### 判题预期步骤可用审核流程

-  等待时间（ms）
-  步骤流（多个步骤的整合）
-  获取单个元素

## 项目技术栈

### 前端

-  核心框架：Vue.js + TailwindCSS / Sass + TypeScript
-  状态管理：Pinia
-  错误监控：Sentry
-  包管理：yarn
-  客户端采用定制组件，管理端使用ElementPlus组件库

### 后端

-  开发框架：Node + Nest.js + Mongoose
-  缓存：Redis
-  消息队列：RabbitMQ
-  特效判题：Jest Image Snapshot
-  交互判题：Playwright
-  数据库：MongoDB 

### 部署

-  CI/CD：GitHub Action
-  前端项目托管平台：Vercel
-  域名转发：Cloudflare

## 项目配置

### 服务器

-  CentOS 9 + 宝塔面板
-  2核 CPU；2GB RAM；

### 云存储

-  腾讯云存储桶

## 技术构想

### 实现判题

对于JS挑战，会给定一个上下文（可能是一个HTML文件，也可能是Vue文件等等），要求实现某些功能。使用 Playwright 无头浏览器模式加载HTML文件，触发特定操作，然后通过“观察”在特定时间控制台的输出、DOM元素的状态来确定是否完成了效果。

对于CSS挑战，给定预期的figma文件或图片，通过 jest-image-snapshot 匹配相似度，根据相似度评分。

### 减轻服务器荷载

为了减轻服务器压力，所有判题任务会被放在消息队列中分批消费，确保不会同时执行多个任务。
`;

export default markdownMock;
