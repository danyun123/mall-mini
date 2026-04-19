# AGENTS

## 从这里开始

1. 先读 [docs/PRODUCT.md](./docs/PRODUCT.md)，了解项目目标和业务边界。
2. 再读 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)，确认分层规则和依赖方向。
3. 开发或评审前读 [docs/CHECKLISTS.md](./docs/CHECKLISTS.md)。
4. 遇到复杂任务时，在 `docs/exec-plans/` 新建或更新执行记录。
5. 做具体功能时，在 `docs/features/` 新建或更新需求卡片。

## 仓库地图

- `miniprogram/pages`：只放主包页面；每个 page 目录就近维护自己的 `service.ts`
- `miniprogram/pkg-*`：重业务模块分包；分包页面同样按目录维护 `service.ts`
- `miniprogram/components`：基础组件和业务组件；带交互编排的组件在目录下维护 `service.ts`
- `miniprogram/stores`：全局共享状态和跨页面共享状态
- `miniprogram/services/core`：请求、认证、存储、日志、错误处理等公共基础服务
- `miniprogram/types`：仅保留全局公共类型，如 `request`、`env`、`route`
- `miniprogram/utils`：稳定、通用、可复用的工具函数
- `docs/project-state.md`：当前项目状态快照，多人协作前先看它

## 工作规则

- 默认依赖链：`Page / Component -> local service.ts -> Store / services/core -> Request -> Backend`
- 页面和组件中不能直接调用 `wx.request`
- 业务类型就近定义在所属的 `page / component / store / local service` 中，不再集中维护到全局 `types`
- 页面不能直接渲染后端 DTO
- `stores` 只承载共享状态，不承载页面专属编排
- 关键代码必须写注释，尤其是页面事件函数、`service.ts` 业务编排函数、`store` 自定义 state、构建/校验脚本、复杂分支和数据转换逻辑；注释要说明意图、边界和为什么这样做，不能只重复函数名
- 没有关键注释视为未完成；如果一个页面有多个事件函数，必须让接手的人只看注释就能知道每个函数负责哪段交互
- AI 协作时默认显式使用 `$mall-mini-harness`，不要假设后续会话会自动读取完整仓库规则
- 多人协作或跨模块改动前，先运行 `npm run sync:state` 刷新项目状态快照
- 项目知识一定要沉淀到仓库文件中，而不是只留在对话上下文里
- 真实功能一旦变更行为，必须同步更新文档和验证记录

## 交付闭环

1. 先确认目标、范围和完成标准。
2. 改代码前先读相关文档。
3. 在既定分层内完成实现。
4. 运行 `typecheck`、`lint`、`test` 和必要的手动冒烟验证。
5. 主动检查运行时控制台；只要出现红色报错或可复现警告，必须先定位并处理，不能只说静态检查通过。
6. 把验证结果记录到对应的计划或功能文档中。

## 人工接管

当任务涉及支付、隐私、权限、不可逆操作，或仓库事实与需求描述冲突时，应暂停并请求人工确认。
