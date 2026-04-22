# 项目状态快照

- 包管理器：npm@10.8.2
- 同步命令：`npm run sync:state`

## 本地状态

- 本文件不记录本地更新时间、分支、HEAD 或工作树状态。
- 查看本地状态请运行 `git status --short --branch`。

## 当前模块

- pages: launch
- components/base: navigation-bar
- services/core: auth.ts, error.ts, logger.ts, request.ts, storage.ts
- stores: app.store.ts
- types: common.ts, route.ts

## 知识库索引

- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CHECKLISTS.md
- docs/LESSONS_LEARNED.md
- docs/exec-plans/init-project.md

## 协作提醒

- 新增或跨模块改动后先运行 `npm run sync:state`。
- 需要提交信息时使用 `git rev-parse --short HEAD`，不要把本地瞬时状态写入共享文档。
- 复杂需求先写 `docs/exec-plans/` 或 `docs/features/`，再动代码。
- AI 输出必须包含改动文件、验证结果和残余风险。
