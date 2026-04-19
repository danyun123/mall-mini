# 项目初始化执行记录

## 目标

把微信官方 TypeScript demo 升级成一个可维护的原生小程序工程骨架，并让它符合当前选定的架构基线和仓库约束。

## 范围

- 建立仓库事实源和工程护栏
- 重构主包、分包、`stores`、`services/core`、页面本地 `service.ts`、公共 `types` 等目录结构
- 用启动页替换官方 demo 页面
- 接入包管理、lint、test 和 commit 工具链

## 不在本次范围

- 真实后端集成
- 真实业务页实现
- 订单列表页实现

## 完成标准

1. 仓库中存在 `AGENTS.md` 和约定的 `docs/` 入口文档。
2. `app.json` 中已移除 demo 页面。
3. 启动页能够编译并作为主包入口正常展示。
4. `typecheck`、`lint`、`test` 命令已具备且可运行。
5. Git、Husky、lint-staged、Commitlint 已初始化。

## 验证记录

- 已完成仓库初始化：
  - `git init`
  - `npm install`
  - `npm run prepare`
  - `npm run openapi:types`
- 已完成自动化检查：
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`
- 已完成仓库结构调整：
  - 从 `app.json` 中移除了官方 `index` 和 `logs` demo 页面
  - 将旧 demo 导航栏替换为 `components/base/navigation-bar`
  - 新增了 `launch` 主包启动页
  - 2026-04-19 已清理 `login`、`home`、`workbench` 占位测试页，真实业务页以后按功能卡片新增
  - 新增了 `docs`、`stores`、`services/core`、`config`、`constants`、`types` 等基础目录
  - 已按最新架构把页面和组件的业务编排下沉到各自目录下的 `service.ts`
  - 已把业务类型从全局 `types/domain` 回收为就近维护，只保留全局公共类型

## 备注

- 当前尚未配置 OpenAPI schema 来源，因此 `openapi:types` 只会生成占位类型文件。
- `lint:style` 运行时可能输出来自依赖链的 Node experimental warning，但命令本身可以成功退出。
- 当前终端环境无法直接打开微信开发者工具，因此尚未完成图形界面的手动冒烟验证。
