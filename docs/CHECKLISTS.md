# 检查清单

## 功能交付清单

编码前：

- 确认业务目标和本次不做的内容
- 阅读 `docs/ARCHITECTURE.md` 和对应功能卡片
- 确认改动是否涉及认证、权限或隐私

实现中：

- 页面和组件目录下的业务编排放在本地 `service.ts`
- 请求入口只允许经过 `services/core/request.ts`
- 共享状态放在 `stores`，页面私有状态留在页面或本地 `service.ts`
- 新增类型时先判断是否为全局公共类型；不是就近定义，不放到 `miniprogram/types`
- 根目录 `node_modules` 变更后，要执行 `npm run build:mini-npm`，或确认开发者工具“构建 npm”成功
- 关键代码必须补注释，尤其是 `scripts/`、构建/校验逻辑、复杂分支和数据转换代码
- 每天或每次跨模块改动后，运行 `npm run sync:state` 刷新 `docs/project-state.md`
- 优先复用共享工具，避免重复造轮子

合并前：

- 运行 `npm run typecheck`
- 运行 `npm run lint`
- 运行 `npm run test`
- 验证正常态、空态和错误态
- 验证关键路径路由跳转
- 如行为或约束有变化，同步更新文档

## 小程序冒烟清单

- 应用能从启动页正常进入，没有运行时错误
- 登录页可以走通 mock 登录链路
- 首页和工作台页可以正常访问
- `app.json` 中不再保留 demo 页面路由
- 全局样式和自定义组件可在微信开发者工具中正常编译

## Agent 执行清单

- 改代码前先读仓库文档
- 能显式调用 skill 时，统一使用 `$mall-mini-harness` 作为任务开头，不依赖 AI 自己猜规则
- 以仓库事实为准，不依赖聊天记忆
- 非简单任务要在 `docs/exec-plans/` 中记录验证结果
- 交付说明必须包含改动文件、验证结果和剩余风险
- 涉及支付、隐私、权限或破坏性操作时升级给人工确认
