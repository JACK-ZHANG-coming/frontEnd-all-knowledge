# mes-web-4.0
## sop 文档发放系统

> 👋 基于Vue3+Vite+Element Plus+Typescript+Scss。

## 1 前端框架

Vue3

## 2 开发环境

- node  `v16.19.0`

- yarn `1.15.2`

## 3 开发工具

建议使用 VSCode

## 4 项目初始化

```
yarn install
```

## 5 项目启动

```
yarn dev
```

## 6 项目部署与发布

```
yarn build
```

## 7 目录结构

```
sop
├─ .eslintignore
├─ .eslintrc.cjs
├─ .gitignore
├─ .prettierignore
├─ .prettierrc.json
├─ env.d.ts
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ App.vue
│  ├─ assets
│  │  └─ picture
│  │     ├─ common
│  │     │  ├─ logo.png
│  │     │  └─ logoImg.png
│  │     └─ to-pages-pic
│  │        ├─ a.png
│  │        └─ b.png
│  ├─ commonTools
│  │  ├─ baseApi
│  │  │  ├─ BaseTool.ts
│  │  │  └─ SApi.ts
│  │  └─ baseDataType
│  │     ├─ ChartData.ts
│  │     ├─ JrjGraph.ts
│  │     └─ Jrjobject.ts
│  ├─ components
│  │  ├─ Aside.vue
│  │  ├─ Footer.vue
│  │  └─ Header.vue
│  ├─ main.ts
│  ├─ router
│  │  ├─ index.ts
│  │  └─ routes.ts
│  ├─ stores
│  │  └─ counter.ts
│  ├─ types
│  │  └─ shims-vue.d.ts
│  └─ views
│     ├─ departmentManage
│     │  ├─ departmentTable.vue
│     │  └─ index.vue
│     ├─ index.vue
│     ├─ login.vue
│     ├─ materialManage
│     │  ├─ index.vue
│     │  └─ materialTable.vue
│     ├─ personManage
│     │  ├─ index.vue
│     │  ├─ personInfo.vue
│     └─ └─ personTable.vue
│
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ yarn.lock

```

## 8 其他

### 

