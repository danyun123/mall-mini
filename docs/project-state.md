# 项目状态快照

- 更新时间：2026年4月19日星期日 10:41:02
- 分支：master
- HEAD：no-commit-yet
- 包管理器：npm@10.8.2
- 同步命令：`npm run sync:state`

## 当前工作树

- AM .gitignore
- A .husky/commit-msg
- A .husky/pre-commit
- A .prettierignore
- A .prettierrc.json
- A .stylelintrc.cjs
- A AGENTS.md
- A commitlint.config.cjs
- A docs/ARCHITECTURE.md
- A docs/CHECKLISTS.md
- A docs/PRODUCT.md
- A docs/exec-plans/init-project.md
- A docs/exec-plans/order-list-sample.md
- A docs/features/order-list.md
- A docs/harness-engineering-guide.md
- A docs/harness-engineering-team-playbook.md
- AM docs/project-state.md
- A docs/wechat-miniprogram-architecture-guide.md
- A eslint.config.mjs
- A jest.config.cjs
- A miniprogram/app.json
- A miniprogram/app.scss
- A miniprogram/app.ts
- A miniprogram/components/base/navigation-bar/index.json
- A miniprogram/components/base/navigation-bar/index.scss
- A miniprogram/components/base/navigation-bar/index.ts
- A miniprogram/components/base/navigation-bar/index.wxml
- A miniprogram/components/base/navigation-bar/service.ts
- A miniprogram/components/business/.gitkeep
- A miniprogram/config/env.dev.ts
- A miniprogram/config/env.prod.ts
- A miniprogram/config/env.test.ts
- A miniprogram/config/feature-flags.ts
- A miniprogram/config/index.ts
- A miniprogram/config/message-templates.ts
- A miniprogram/constants/roles.ts
- A miniprogram/constants/routes.ts
- AD miniprogram/harness-engineering-guide.md
- A miniprogram/pages/home/index.json
- A miniprogram/pages/home/index.scss
- A miniprogram/pages/home/index.ts
- A miniprogram/pages/home/index.wxml
- A miniprogram/pages/home/service.ts
- A miniprogram/pages/launch/index.json
- A miniprogram/pages/launch/index.scss
- A miniprogram/pages/launch/index.ts
- A miniprogram/pages/launch/index.wxml
- A miniprogram/pages/launch/service.ts
- A miniprogram/pages/login/index.json
- A miniprogram/pages/login/index.scss
- A miniprogram/pages/login/index.ts
- A miniprogram/pages/login/index.wxml
- A miniprogram/pages/login/service.ts
- A miniprogram/pages/workbench/index.json
- A miniprogram/pages/workbench/index.scss
- A miniprogram/pages/workbench/index.ts
- A miniprogram/pages/workbench/index.wxml
- A miniprogram/pages/workbench/service.ts
- A miniprogram/pkg-audit/pages/.gitkeep
- A miniprogram/pkg-message/pages/.gitkeep
- A miniprogram/pkg-mine/pages/.gitkeep
- A miniprogram/pkg-order/pages/.gitkeep
- A miniprogram/pkg-order/pages/order-list/index.json
- A miniprogram/pkg-order/pages/order-list/index.scss
- A miniprogram/pkg-order/pages/order-list/index.ts
- A miniprogram/pkg-order/pages/order-list/index.wxml
- A miniprogram/pkg-order/pages/order-list/service.ts
- A miniprogram/pkg-policy/pages/.gitkeep
- A miniprogram/services/core/auth.ts
- A miniprogram/services/core/error.ts
- A miniprogram/services/core/logger.ts
- A miniprogram/services/core/request.ts
- A miniprogram/services/core/storage.ts
- A miniprogram/sitemap.json
- A miniprogram/stores/app.store.ts
- A miniprogram/stores/auth.store.ts
- A miniprogram/stores/message.store.ts
- A miniprogram/stores/workbench.store.ts
- A miniprogram/types/common.ts
- A miniprogram/types/route.ts
- A miniprogram/typings/api.d.ts
- A miniprogram/utils/guard.ts
- A miniprogram/utils/router.ts
- AD miniprogram/wechat-miniprogram-architecture-guide.md
- A package-lock.json
- A package.json
- A project.config.json
- A scripts/build-miniprogram-npm.mjs
- A scripts/miniprogram-ci.mjs
- A scripts/openapi-types.mjs
- A scripts/setup-husky.mjs
- A scripts/sync-project-state.ps1
- A scripts/validate-miniprogram.mjs
- A tsconfig.json
- A typings/index.d.ts

## 当前模块

- pages: home, launch, login, workbench
- components/base: navigation-bar
- services/core: auth.ts, error.ts, logger.ts, request.ts, storage.ts
- stores: app.store.ts, auth.store.ts, message.store.ts, workbench.store.ts
- types: api, common.ts, domain, route.ts, view

## 知识库索引

- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CHECKLISTS.md
- docs/harness-engineering-guide.md
- docs/harness-engineering-team-playbook.md
- docs/features/order-list.md
- docs/exec-plans/init-project.md
- docs/exec-plans/order-list-sample.md

## 协作提醒

- 新增或跨模块改动后先运行 `npm run sync:state`。
- 复杂需求先写 `docs/exec-plans/` 或 `docs/features/`，再动代码。
- AI 输出必须包含改动文件、验证结果和残余风险。
