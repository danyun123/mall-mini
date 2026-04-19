# 项目状态快照

- 更新时间：2026年4月19日星期日 11:43:21
- 分支：master
- HEAD：5e90ffc
- 包管理器：npm@10.8.2
- 同步命令：`npm run sync:state`

## 当前工作树

- M docs/ARCHITECTURE.md
- M docs/CHECKLISTS.md
- M docs/PRODUCT.md
- M docs/exec-plans/init-project.md
- D docs/exec-plans/order-list-sample.md
- D docs/features/order-list.md
- M docs/harness-engineering-guide.md
- M docs/harness-engineering-team-playbook.md
- M docs/project-state.md
- M docs/wechat-miniprogram-architecture-guide.md
- M miniprogram/app.json
- M miniprogram/app.ts
- M miniprogram/constants/routes.ts
- D miniprogram/pages/home/index.json
- D miniprogram/pages/home/index.scss
- D miniprogram/pages/home/index.ts
- D miniprogram/pages/home/index.wxml
- D miniprogram/pages/home/service.ts
- M miniprogram/pages/launch/index.ts
- M miniprogram/pages/launch/index.wxml
- M miniprogram/pages/launch/service.ts
- D miniprogram/pages/login/index.json
- D miniprogram/pages/login/index.scss
- D miniprogram/pages/login/index.ts
- D miniprogram/pages/login/index.wxml
- D miniprogram/pages/login/service.ts
- D miniprogram/pages/workbench/index.json
- D miniprogram/pages/workbench/index.scss
- D miniprogram/pages/workbench/index.ts
- D miniprogram/pages/workbench/index.wxml
- D miniprogram/pages/workbench/service.ts
- D miniprogram/pkg-order/pages/order-list/index.json
- D miniprogram/pkg-order/pages/order-list/index.scss
- D miniprogram/pkg-order/pages/order-list/index.ts
- D miniprogram/pkg-order/pages/order-list/index.wxml
- D miniprogram/pkg-order/pages/order-list/service.ts
- D miniprogram/stores/auth.store.ts
- D miniprogram/stores/message.store.ts
- D miniprogram/stores/workbench.store.ts
- M scripts/sync-project-state.ps1
- ?? docs/features/.gitkeep

## 当前模块

- pages: launch
- components/base: navigation-bar
- services/core: auth.ts, error.ts, logger.ts, request.ts, storage.ts
- stores: app.store.ts
- types: api, common.ts, domain, route.ts, view

## 知识库索引

- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CHECKLISTS.md
- docs/harness-engineering-guide.md
- docs/harness-engineering-team-playbook.md
- docs/exec-plans/init-project.md

## 协作提醒

- 新增或跨模块改动后先运行 `npm run sync:state`。
- 复杂需求先写 `docs/exec-plans/` 或 `docs/features/`，再动代码。
- AI 输出必须包含改动文件、验证结果和残余风险。
