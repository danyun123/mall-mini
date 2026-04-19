# 项目状态快照

- 更新时间：2026年4月19日星期日 14:42:27
- 分支：master
- HEAD：a1d4451
- 包管理器：npm@10.8.2
- 同步命令：`npm run sync:state`

## 当前工作树

- M AGENTS.md
- M docs/ARCHITECTURE.md
- M docs/CHECKLISTS.md
- M docs/harness-engineering-team-playbook.md
- M docs/project-state.md
- ?? docs/exec-plans/login-module-rollback.md

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
- docs/exec-plans/login-module-rollback.md

## 协作提醒

- 新增或跨模块改动后先运行 `npm run sync:state`。
- 复杂需求先写 `docs/exec-plans/` 或 `docs/features/`，再动代码。
- AI 输出必须包含改动文件、验证结果和残余风险。
