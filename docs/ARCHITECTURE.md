# 架构说明

## 技术基线

- 原生微信小程序
- TypeScript + SCSS
- `glass-easel` + `style: v2`
- `tdesign-miniprogram`
- `mobx-miniprogram` + `mobx-miniprogram-bindings`
- `miniprogram-computed`
- 基于 `wx.request` 的自研请求层
- `npm` 作为正式包管理器

## 分层规则

### Page / Component

- 负责生命周期、事件响应、视图绑定
- 默认在目录下维护一个 `service.ts`
- 不直接写 `wx.request`
- 不直接消费后端 DTO

### local service.ts

- 放在页面或组件目录下，就近维护
- 负责页面专属的数据拼装、业务编排、轻量适配和跳转前准备
- 可以读取 `store`，也可以调用 `services/core`
- 不承载跨业务域复用的基础能力

### Store

- 只放跨页面共享状态和全局共享状态
- 当前仅保留 `app.store.ts`；认证态、工作台摘要、未读数等真实共享状态按功能需要新增
- 避免把页面私有状态塞进全局 `store`

### services/core

- 只保留公共基础服务
- 当前包括：请求、认证、存储、日志、错误处理
- 公共服务不关心具体页面结构

### types

- 只保留全局公共类型
- 当前包括：`request`、`env`、`route`
- 业务类型放回所属目录，就近定义和维护

## 依赖方向

默认依赖链如下：

`Page / Component -> local service.ts -> Store / services/core -> Request -> Backend`

禁止出现以下模式：

- 页面或组件直接调用 `wx.request`
- 页面直接渲染后端原始 DTO
- 为了“统一”把所有业务 service 放回一个全局模块目录
- 为了“统一”把所有业务类型重新堆回 `miniprogram/types`
- 所有页面共享一个超大全局 `store`

## 目录地图

```text
miniprogram/
  config/
  constants/
  components/
    base/
    business/
  pages/
    launch/
      index.ts
      service.ts
  pkg-order/
  pkg-audit/
  pkg-message/
  pkg-policy/
  pkg-mine/
  stores/
  services/
    core/
  types/
  utils/
```

## 设计原则

- 页面和组件目录优先就近收口业务逻辑
- 公共能力先判断是否真的跨域复用，再决定是否上提
- 共享状态和页面编排分开维护
- 文档要反映真实代码结构，不能让文档继续描述旧架构
- 关键代码必须写注释，尤其是 `scripts/`、构建/校验脚本、复杂分支和数据转换逻辑，注释要说明意图和边界，不只写“做了什么”
- 多人协作时，以 `docs/project-state.md` 作为当前仓库状态快照；新增模块或跨模块改动后先刷新它
