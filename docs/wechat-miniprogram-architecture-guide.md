# 原生微信小程序架构指南

基于采购文档《湖北省政府采购网上商城智能审查及移动端功能开发项目》整理，面向“原生微信小程序 + 智能审查能力接入”的代码级落地方案。

## 1. 先把边界定清楚

从采购需求看，这个项目不是一个“纯展示型小程序”，而是一个带业务闭环的移动工作台，核心范围有三类：

1. 信息查询。
   政策法规通知、商品库和价格、订单状态与详情、历史交易、公告公示、供应商信息、核查进度。
2. 消息推送。
   订单状态、审批待办、政策变动、预警通知、征集通知、商品上架和下架通知。
3. 智能审查。
   采购需求、敏感词、采购品目、采购形式、供应商资质材料等的合规核查。

这直接决定了代码架构边界：

- 小程序端只负责登录、查询、筛选、待办处理、结果展示、消息订阅、证据查看。
- 智能审查规则、敏感词库、OCR/NLP、资质核验、风险评分、消息实际投递必须放服务端。
- 小程序端不要承载核心审查逻辑，只消费“审查任务”和“审查结果”。

这是这个项目最重要的架构原则。否则后期规则频繁变更时，小程序发版会拖死业务节奏。

## 2. 我建议你们采用的总体方案

一句话版本：

**原生微信小程序 + TypeScript + SCSS + TDesign 组件库 + MobX 状态管理 + 自研请求层 + 业务分包 + OpenAPI 类型同步 + 官方测试/发布工具链。**

这套方案的优点是：

- 对原生小程序团队最容易上手。
- 对 3 个月交付周期更稳。
- 运行时依赖少，包体更容易控。
- 智能审查结果展示、消息推送、角色权限、长列表查询这些典型政务场景都能覆盖。
- 后面就算继续扩展 PC 端或后台，也能复用接口模型和业务模块划分。

## 3. 技术栈建议

### 3.1 小程序前端

- 开发模式：原生微信小程序
- 语言：TypeScript
- 样式：SCSS
- 组件体系：`glass-easel` + `style: v2`
- UI 组件库：`tdesign-miniprogram`
- 状态管理：`mobx-miniprogram` + `mobx-miniprogram-bindings`
- 局部计算属性：`miniprogram-computed`
- 日期处理：`dayjs`
- 网络层：基于 `wx.request` 自研请求封装，不额外引入 axios/flyio
- API 类型同步：`openapi-typescript`，前提是后端提供 OpenAPI/Swagger

### 3.2 工程与质量

- 包管理器：`npm`
- Node 版本：Node.js 20.19+ LTS
- IDE：VS Code + 微信开发者工具稳定版
- 代码检查：ESLint + Prettier + Stylelint
- 提交门禁：Husky + lint-staged + Commitlint
- 单测：Jest + `miniprogram-simulate`
- 冒烟/E2E：`miniprogram-automator`
- 发布：`miniprogram-ci`

### 3.3 为什么不建议一上来就上跨端框架

这个项目采购目标明确写了“移动端微信小程序”，而且又叠加了政务、审查、推送、合规等约束。对这类项目，我不建议第一期就上 Taro/uni-app/React 小程序方案，原因很直接：

- 原生能力兼容性最稳。
- 微信开发者工具调试链路最短。
- 审批流、订阅消息、页面生命周期、性能排查都更贴近官方模型。
- 新人接手成本更低。

如果后续要做支付宝/抖音/百度多端，再评估跨端，不要在第一期交付前给自己加复杂度。

## 4. 对你们当前脚手架的判断

你们当前仓库已经是一个不错的起点：

- [package.json](/D:/一毂项目/mall-mini/package.json)
- [tsconfig.json](/D:/一毂项目/mall-mini/tsconfig.json)
- [app.json](/D:/一毂项目/mall-mini/miniprogram/app.json)

现状里几个方向是对的：

- 已经启用了 TypeScript。
- 已经使用了 SCSS。
- `app.json` 里已经开启了 `style: "v2"`、`componentFramework: "glass-easel"`、`lazyCodeLoading: "requiredComponents"`。
- 这些都适合继续保留。

需要调整的一点是：

- 当前 `package.json` 里只有 `miniprogram-api-typings`，而且版本偏老，不够支撑后续完整工程化。

## 5. 推荐目录结构

建议直接按业务域和公共层拆，不要继续沿用默认 demo 目录。

```text
miniprogram/
  app.ts
  app.json
  app.scss

  config/
    env.dev.ts
    env.test.ts
    env.prod.ts
    feature-flags.ts
    message-templates.ts

  pages/
    launch/
    login/
    home/
    workbench/

  pkg-order/
    pages/
      list/
      detail/
      history/

  pkg-audit/
    pages/
      task-list/
      task-detail/
      result-detail/
      progress/

  pkg-message/
    pages/
      list/
      detail/
      subscribe/

  pkg-policy/
    pages/
      notice-list/
      notice-detail/

  pkg-mine/
    pages/
      profile/
      settings/
      about/

  components/
    base/
    business/
    state/

  behaviors/
    pagination.ts
    auth-guard.ts
    form-state.ts

  stores/
    app.store.ts
    auth.store.ts
    workbench.store.ts
    message.store.ts

  services/
    core/
      request.ts
      auth.ts
      storage.ts
      logger.ts
      error.ts

  types/
    common.ts
    route.ts

  constants/
    routes.ts
    roles.ts
    order.ts
    audit.ts
    message.ts

  utils/
    router.ts
    format.ts
    guard.ts
    download.ts
    permission.ts

  typings/
    api.d.ts
```

### 目录设计原则

- `pages` 只放主包必需页面，页面专属业务逻辑就近维护在目录下的 `service.ts`。
- 订单、审查、消息、政策等重业务模块全部分包。
- `services/core` 只放请求、认证、存储、日志、错误处理等公共基础能力。
- 业务 `service` 跟着页面或业务组件走，不再集中维护 `services/modules` 这类目录。
- `types` 只保留全局公共类型；业务类型就近定义在 page/component/store 所在目录。
- `components/base` 放按钮、空状态、筛选栏、弹层等通用组件。
- `components/business` 放订单卡片、风险标签、审核时间线、供应商资质块等业务组件。

## 6. 分层规则

建议强制执行下面这条链路：

**Page / Component -> local service.ts -> Store / services/core -> Request -> Backend API**

每层职责如下：

### 6.1 Page / Component

- 只处理生命周期、交互事件、页面编排。
- 不直接写 `wx.request`。
- 不直接拼复杂业务数据。

### 6.2 Store

- 管页面状态和少量全局状态。
- 管 loading、筛选条件、分页、已选项、未读数。
- 不直接耦合具体页面结构。

### 6.3 Service

- 只拆两类：公共基础 Service 和页面 / 组件本地 Service。
- 公共基础 Service 统一放在 `services/core`，只处理请求、认证、存储、日志、错误处理等稳定能力。
- 业务 Service 不再单独抽全局目录，而是跟着 page / component 维护在当前目录下的 `service.ts`。
- 本地 `service.ts` 负责页面专属的数据拼装、轻量业务编排、DTO 适配和跳转前准备。
- 业务类型默认跟着本地 `service.ts`、`store` 或当前页面文件就近定义，不再额外抽一层全局业务 types。

### 6.4 Request

- 统一处理 token、请求头、超时、重试、错误码映射。
- 统一加 `traceId`、客户端版本、平台标识。
- 统一做登录失效跳转和兜底提示。

### 6.5 Backend API

- 返回标准化结构。
- 不要让页面直接吃原始后端字段。

建议所有接口都统一成：

```ts
interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  traceId?: string;
}
```

## 7. 页面与分包怎么拆

采购文档里的功能天然适合分包。建议这样拆：

### 7.1 主包

- 启动页
- 后续真实登录、首页、工作台页面按功能卡片新增
- 全局通用组件和公共资源

### 7.2 `pkg-order`

- 订单列表
- 订单详情
- 历史交易
- 订单状态流转

### 7.3 `pkg-audit`

- 核查任务列表
- 核查详情
- 风险命中结果
- 核查进度

### 7.4 `pkg-message`

- 消息中心
- 消息详情
- 消息订阅授权

### 7.5 `pkg-policy`

- 政策法规
- 公告公示

### 7.6 `pkg-mine`

- 我的
- 设置
- 帮助

这样的好处：

- 首屏更轻。
- 不同小组可以并行开发不同分包。
- 后续核查模块扩展时，不会拖慢主包。

## 8. 状态管理怎么选

我的建议是：

- 全局状态用 `mobx-miniprogram`
- 页面局部联动用 `miniprogram-computed`
- 不要把一切都塞进全局 store

### 8.1 适合做全局 store 的内容

- 登录态
- 用户信息
- 当前角色
- 未读消息数
- 工作台摘要
- 全局字典
- 当前环境配置

### 8.2 适合做页面局部状态的内容

- 当前筛选项
- 当前分页
- 弹窗开关
- 当前表单草稿
- 某个详情页的 loading 和 error

### 8.3 不建议的做法

- 所有页面共享一个超大 store
- 页面直接操作后端返回 DTO
- `setData` 和 store 双源并存，互相覆盖

## 9. 智能审查模块应该怎么接

这个项目最容易犯错的地方，是把“智能审查”理解成小程序端做规则判断。正确做法是：

### 9.1 小程序端负责

- 展示审查任务列表
- 展示核查进度
- 展示命中规则
- 展示风险等级和证据链
- 提交人工复核意见
- 展示审查前后对比

### 9.2 服务端负责

- 敏感词识别
- 品目匹配
- 采购形式校验
- 供应商资质材料识别
- OCR/NLP
- 规则引擎
- 风险评分
- 审查结论生成

### 9.3 前端领域模型建议

```ts
interface AuditTask {
  id: string;
  bizType: 'order' | 'supplier' | 'solicitation';
  status: 'pending' | 'reviewing' | 'done';
  riskLevel: 'low' | 'medium' | 'high';
  title: string;
  createdAt: string;
}

interface AuditResult {
  taskId: string;
  riskLevel: 'low' | 'medium' | 'high';
  hitRules: AuditHitRule[];
  evidences: AuditEvidence[];
  suggestion: string;
  canManualOverride: boolean;
}
```

重点是让前端围绕“任务”和“结果”建模，而不是围绕“某个后端表字段”建模。

## 10. 权限与角色建议

采购文档里至少涉及预算单位、供应商、管理员、审查人员。代码层建议统一做角色路由映射：

- `PURCHASER`
- `SUPPLIER`
- `REVIEWER`
- `ADMIN`

然后把页面能力和按钮能力都做成权限配置：

```ts
interface RouteMeta {
  requiresAuth: boolean;
  roles?: string[];
}
```

不要在页面里到处写：

```ts
if (user.role === 'xxx') { ... }
```

应该把权限判断收敛到：

- 路由守卫
- 页面入口守卫
- 按钮级权限组件

## 11. 消息推送模块怎么做

这块也要分清前后端边界。

### 11.1 小程序端做什么

- 订阅消息授权
- 消息中心列表
- 未读数
- 业务消息跳转
- 站内信详情页

### 11.2 服务端做什么

- 模板 ID 管理
- 消息投递策略
- 幂等控制
- 重复推送抑制
- 业务事件与消息模板映射

### 11.3 前端代码建议

- `config/message-templates.ts` 只放模板 key，不放敏感配置。
- 消息模块的拉取、已读、订阅等业务编排放在 `pkg-message` 对应页面或组件目录下的 `service.ts`。
- 所有消息详情都走统一跳转协议，比如 `bizType + bizId + action`。

## 12. 请求层一定要自研薄封装

我不建议你们再引入额外请求库。原生小程序里，最稳的方式就是封装 `wx.request`。

建议直接做一个 `services/core/request.ts`，统一支持：

- 基础 URL 切换
- token 注入
- 超时
- 文件上传
- 统一错误提示
- 登录失效重登
- 埋点字段
- traceId 透传

这样好处是：

- 依赖少
- 小程序兼容性最稳
- 问题定位快
- 安全边界更清晰

## 13. 接口建模建议

不要让页面直接依赖后端响应字段，但也不必为了“分层完整”把所有业务都塞进全局目录。更适合当前项目的方式是：

- 公共请求入口统一放在 `services/core/request.ts`
- 页面或组件自己的业务编排放在当前目录下的 `service.ts`
- DTO 到页面可用数据的适配，优先放在当前目录下的 `service.ts` 内部；只有映射特别复杂时，再拆同目录私有文件
- 业务类型默认就近定义，不再维护全局 `domain / view` 类型目录

例如订单列表页可以这样组织：

```text
pkg-order/
  pages/
    list/
      index.ts
      index.wxml
      index.scss
      index.json
      service.ts
```

这样做的好处是：

- 页面、服务、类型天然贴近同一业务上下文
- 新人接手时不需要在多个全局目录之间来回跳
- 后续如果某个页面复杂度上升，再在当前目录内做局部拆分即可，不会污染全局结构

## 14. UI 组件库怎么选

建议只选一个：`tdesign-miniprogram`

原因：

- 腾讯生态，和微信小程序贴合度高
- 对政务和后台风格场景更自然
- 组件覆盖面够用
- 设计 token 体系相对完整

不建议同时混用：

- `tdesign-miniprogram`
- `@vant/weapp`
- 自己复制的业务组件

UI 体系一旦混乱，后面样式隔离和主题统一会很痛苦。

## 15. 工程化依赖清单

下面这套是我建议你们首期直接落到 `package.json` 的依赖组合。

版本说明：

- 下面版本号是我在 **2026-04-17** 通过包管理器仓库实时核验到的版本。
- 真正落库时建议锁定精确版本并提交 `package-lock.json`。
- 对于 TypeScript、ESLint 这类工具链，如果你们想更稳，可以先固定在相邻稳定小版本，不必盲追最新 major。

### 15.1 运行时依赖

```json
{
  "dependencies": {
    "dayjs": "1.11.20",
    "miniprogram-computed": "8.0.0",
    "mobx-miniprogram": "6.12.3",
    "mobx-miniprogram-bindings": "6.0.0",
    "tdesign-miniprogram": "1.13.2"
  }
}
```

### 15.2 开发依赖

```json
{
  "devDependencies": {
    "@commitlint/cli": "20.5.0",
    "@commitlint/config-conventional": "20.5.0",
    "@types/jest": "30.0.0",
    "@typescript-eslint/eslint-plugin": "8.58.2",
    "@typescript-eslint/parser": "8.58.2",
    "cross-env": "10.1.0",
    "eslint": "10.2.0",
    "eslint-config-prettier": "10.1.8",
    "husky": "9.1.7",
    "jest": "30.3.0",
    "lint-staged": "16.4.0",
    "miniprogram-api-typings": "5.1.2",
    "miniprogram-automator": "0.12.1",
    "miniprogram-ci": "2.1.31",
    "miniprogram-simulate": "1.6.1",
    "openapi-typescript": "7.13.0",
    "prettier": "3.8.3",
    "sass": "1.99.0",
    "stylelint": "17.8.0",
    "stylelint-config-standard-scss": "17.0.0",
    "ts-jest": "29.4.9",
    "typescript": "6.0.3"
  }
}
```

### 15.3 可选依赖

如果你们后端已经稳定输出 OpenAPI 文档，建议加上 `openapi-typescript` 自动生成类型。

如果你们第一期只想先把前端搭起来，也可以先不接 `openapi-typescript`，但至少保留统一的 `services/core/request.ts` 出口，以及 page / component 目录下的本地 `service.ts` 和就近类型定义。

## 16. 推荐安装命令

```bash
npm install dayjs miniprogram-computed mobx-miniprogram mobx-miniprogram-bindings tdesign-miniprogram
npm install -D @commitlint/cli @commitlint/config-conventional @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser cross-env eslint eslint-config-prettier husky jest lint-staged miniprogram-api-typings miniprogram-automator miniprogram-ci miniprogram-simulate openapi-typescript prettier sass stylelint stylelint-config-standard-scss ts-jest typescript
```

## 17. 你们第一期最值得马上补的脚手架能力

如果让我按优先级排，我会先补这 8 件事：

1. 目录重构和业务分包。
2. 统一请求层。
3. 全局共享状态边界与 `appStore`；认证、消息等真实共享状态按功能需要新增。
4. `TDesign` 组件接入。
5. ESLint、Prettier、Stylelint、Husky、Commitlint。
6. 环境配置文件 `env.dev/test/prod`。
7. 订单域和审查域的页面本地 `service.ts`、DTO 适配和共享公共类型约束。
8. `miniprogram-ci` 发布脚本。

把这 8 件事做完，项目就从“demo 脚手架”升级成“可多人协作的业务工程”了。

## 18. 首期不建议做的事情

- 不要同时上两个 UI 库。
- 不要让页面直接写请求。
- 不要把审查规则写在小程序端。
- 不要在第一期就做超级复杂的全局状态中心。
- 不要为了所谓“先进”强行切跨端框架。
- 不要把所有页面都塞主包。
- 不要把后端 DTO 直接渲染到页面。

## 19. 最终结论

如果目标是“完善且容易上手”，我建议你们就按下面这一版定：

- **开发模式**：原生微信小程序
- **基础语言**：TypeScript + SCSS
- **组件体系**：`glass-easel` + `style: v2`
- **UI 库**：`tdesign-miniprogram`
- **状态管理**：`mobx-miniprogram` + `mobx-miniprogram-bindings`
- **局部联动**：`miniprogram-computed`
- **日期处理**：`dayjs`
- **网络层**：自研 `wx.request` 薄封装
- **接口类型**：`openapi-typescript`
- **单测/E2E**：`miniprogram-simulate` + `miniprogram-automator`
- **发布**：`miniprogram-ci`
- **代码规范**：ESLint + Prettier + Stylelint + Husky + lint-staged + Commitlint
- **分包策略**：主包 + 订单包 + 审查包 + 消息包 + 政策包 + 个人中心包

这是我认为最适合你们这个采购项目的“低风险、易上手、能扩展”的原生小程序架构基线。
