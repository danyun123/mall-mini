# Harness Engineering 开发指南

> 本文按 OpenAI 于 2026 年 2 月 11 日提出的 `Harness Engineering` 理解来整理，并结合当前微信小程序仓库给出一套可以直接开工的落地方法。

![Harness 开发闭环](./assets/harness-loop.svg)

## 1. 一句话理解

`Harness Engineering` 不是“把 prompt 写得更长”，而是围绕 AI / Agent 搭建一整套可重复工作的工程系统：

- 任务怎么描述
- 上下文放在哪里
- 工具怎么接入
- 代码必须满足什么约束
- 怎么验证结果
- 什么时候让人接管

一句话说，人负责定方向和边界，Agent 负责执行，`harness` 负责让执行过程稳定、可验证、可迭代。

## 2. 它到底解决什么问题

传统 AI 开发常见问题不是模型不会写代码，而是：

- 不知道真实需求边界
- 看不到项目里的关键知识
- 改了代码却没验证
- 会复制坏模式，越改越乱
- 文档、代码、测试彼此脱节

`Harness Engineering` 的核心就是把这些问题前置处理掉，让 Agent 在一个“有地图、有护栏、有反馈”的环境里工作。

## 3. 核心思想

### 3.1 仓库就是事实源

不要把关键信息放在聊天记录、口头沟通、飞书消息里。Agent 运行时只能稳定看到仓库中的内容，所以需求、架构、约束、计划、检查项，最好都以仓库文件为准。

### 3.2 让 Agent 易读，不只是让人易读

好的工程不只是目录清晰，更重要的是让 Agent 能快速判断：

- 这个功能属于哪个模块
- 数据从哪里来
- 应该修改哪些文件
- 哪些依赖方向是允许的
- 做完后该怎么验证

### 3.3 约束比说教更重要

只写“请保持代码整洁”没有用。真正有效的是把规则写成明确结构：

- 固定目录分层
- 明确依赖方向
- 统一接口命名
- 边界数据先校验再使用
- 用 lint / test / checklist 去机械执行

### 3.4 先做单 Agent 闭环，再谈多 Agent

先把一个 Agent 的工作闭环跑通：

- 读需求
- 找上下文
- 改代码
- 自检
- 验证
- 补文档

这个闭环稳定后，再考虑拆多 Agent 协作，不然复杂度会先失控。

### 3.5 持续做“垃圾回收”

Agent 会重复仓库里已有模式，好的坏的都会学。仓库一旦出现坏样例，后续会被持续放大。所以要定期：

- 清理重复代码
- 收敛命名
- 更新过期文档
- 记录技术债
- 修正错误示例

## 4. 标准实施步骤

### Step 1. 先定义目标、边界、完成标准

每个需求开始前，先写清楚四件事：

- 要解决什么业务问题
- 本次改动范围到哪里为止
- 明确产出是什么
- 什么情况下算完成

建议最少写成下面这个格式：

```md
任务：新增商品列表页
目标：用户可以查看商品列表并进入详情
范围：只做列表展示和加载态；不做筛选、排序、支付
完成标准：

1. 页面可以拉取并展示商品列表
2. 加载失败时有错误提示
3. 点击商品可跳转详情页
4. 代码符合项目分层要求
5. 文档和检查项同步更新
```

### Step 2. 给 Agent 一张“地图”

不要把所有规则都塞进一个超长说明文件。更好的做法是：

- 用一个短的 `AGENTS.md` 作为入口导航
- 用 `docs/` 存放架构、计划、产品说明、检查项
- 让每类文档都有固定位置

推荐最小结构：

```text
AGENTS.md
docs/
  ARCHITECTURE.md
  PRODUCT.md
  CHECKLISTS.md
  exec-plans/
  features/
```

其中：

- `AGENTS.md` 只负责说明“去哪里看”
- `ARCHITECTURE.md` 说明分层和依赖规则
- `features/` 说明具体业务
- `exec-plans/` 记录复杂任务拆解和进度

### Step 3. 先定结构，再写功能

在 Harness 思路里，结构先于实现。先规定：

- 页面层做什么
- 业务层做什么
- API 层做什么
- 类型定义放哪里
- 公共工具放哪里

如果这一步不先定，后面 Agent 很容易把请求、状态、页面逻辑、格式化逻辑全写在一个文件里。

### Step 4. 把“能做事”的工具接进来

Agent 不该只会改文本，它还应该能：

- 启动项目
- 查看日志
- 运行检查
- 读取接口返回
- 执行关键路径验证

对前端或小程序项目来说，最重要的不是工具数量，而是下面这条链路能不能跑通：

`改代码 -> 启动/预览 -> 查看页面/日志 -> 发现问题 -> 再修`

### Step 5. 给出清晰的实现约束

建议把以下约束写进项目文档，并尽量机械检查：

- 接口请求不能直接散落在页面里
- 页面只处理展示状态和交互事件
- 页面或组件专属的业务拼装逻辑进入当前目录下的 `service.ts`
- 全局 `types` 只保留公共类型，业务类型就近放在页面、组件、store 或本地 `service.ts`
- 公共工具只放稳定、通用、可复用的函数
- 边界数据必须做空值或结构校验

### Step 6. 把验证做成固定闭环

每次开发都走同一条路：

1. 读任务
2. 读相关文档
3. 实现代码
4. 自查影响范围
5. 运行检查
6. 手动验证关键路径
7. 更新文档

重点不是“测试很多”，而是“每次都按固定方式验证”。

### Step 7. 规定什么时候必须人工接管

# 说明

下面几类情况不要完全放给 Agent：

- 需求本身不明确
- 会影响支付、权限、用户隐私
- 涉及不可逆操作
- 同一个问题连续修复失败
- 代码实现和文档描述明显冲突

Harness 的目标不是不要人，而是把人放在真正需要判断的位置上。

### Step 8. 建立持续清理机制

每周至少做一次简单清理：

- 删除无用代码
- 合并重复工具函数
- 修正文档过期内容
- 补充最近遇到的坑
- 把临时方案升级成正式规则

这是防止项目越做越乱的关键。

## 5. 适合当前仓库的落地方式

当前仓库是一个微信小程序 TypeScript 模板，结构很轻，正适合从小处开始落地 Harness。

建议在现有项目上补出下面这套最小工程结构：

```text
docs/
  harness-engineering-guide.md
  ARCHITECTURE.md
  PRODUCT.md
  CHECKLISTS.md
  features/
  exec-plans/

miniprogram/
  services/
    core/
  stores/
  types/
  components/
  pages/
  utils/
```

当前项目里各层职责建议如下：

| 位置                        | 职责                             | 不要放什么                 |
| --------------------------- | -------------------------------- | -------------------------- |
| `miniprogram/pages`         | 页面状态、页面事件、页面生命周期 | 复杂业务拼装、重复请求逻辑 |
| `miniprogram/components`    | 可复用 UI 组件                   | 具体业务流程               |
| `miniprogram/stores`        | 全局共享状态、跨页面共享状态     | 页面专属编排               |
| `miniprogram/services/core` | 请求、认证、存储、日志、错误处理 | 页面专属业务逻辑           |
| `miniprogram/types`         | 全局公共类型                     | 业务专属类型、运行时副作用 |
| `miniprogram/utils`         | 稳定通用工具函数                 | 某个页面专属逻辑           |

![小程序项目分层建议](./assets/harness-mini-program-architecture.svg)

## 6. 在这个小程序项目里，推荐这样开发一个功能

以“新增商品列表页”为例，建议按下面顺序做：

### 6.1 先写需求卡

放到 `docs/features/product-list.md`：

- 页面目的
- 数据字段
- 交互动作
- 异常处理
- 验收标准

### 6.2 再补类型

先在当前页面或本地 `service.ts` 里定义 `Product`、`ProductListItem` 这类业务类型，只有需要全局复用时再上提到 `miniprogram/types`。

### 6.3 统一走公共请求层

例如：

- `miniprogram/services/core/request.ts`

这里只负责统一请求出口、认证头、超时、错误处理，不负责页面状态。

### 6.4 在页面目录下做业务拼装

例如：

- `miniprogram/pages/product-list/service.ts`

这里负责：

- 请求列表
- 处理错误
- 转换后端字段
- 给页面输出稳定结构

### 6.5 页面层只消费结果

例如：

- `miniprogram/pages/product-list/index.ts`
- `miniprogram/pages/product-list/index.wxml`
- `miniprogram/pages/product-list/index.scss`

页面层主要做：

- 触发加载
- 渲染列表
- 展示 loading / empty / error
- 处理点击跳转

### 6.6 最后补验证和文档

至少要补：

- 手动检查清单
- 已知限制
- 影响范围说明

如果项目暂时没有自动化测试，也要保留最小 smoke checklist。

## 7. 可直接复制使用的开发模板

下面这个模板可以直接给 Agent 或给团队成员使用。

```md
任务名称：<功能名>

业务目标：
<这次为什么做>

范围：
<做什么>
<不做什么>

上下文入口：

1. 先看 docs/ARCHITECTURE.md
2. 再看 docs/features/<feature>.md
3. 再看相关 pages / components / stores / services/core / types

实现要求：

1. 页面层不直接堆复杂业务逻辑
2. 请求统一进入 `services/core/request.ts`
3. 业务拼装进入当前页面或组件目录下的 `service.ts`
4. 业务类型优先就近定义，全局 `types` 只放公共类型
5. 代码修改后同步更新文档

验证要求：

1. 至少覆盖正常、空态、错误态
2. 检查主要跳转是否正常
3. 检查关键日志和报错提示

交付物：

1. 代码
2. 文档
3. 验证记录
```

## 8. 直接开工时的最小清单

如果你现在就要在这个项目上正式采用 Harness 思路，建议先做这 6 件事：

1. 新建一个简短的 `AGENTS.md`，只做导航，不堆长篇规则。
2. 新建 `docs/ARCHITECTURE.md`，写清页面、服务、API、类型四层职责。
3. 新建 `docs/CHECKLISTS.md`，固定页面功能验收项。
4. 明确 `miniprogram/services/core`、`miniprogram/stores`、`miniprogram/types` 和 page / component 本地 `service.ts` 的分工。
5. 选一个真实功能作为样板，不要一开始就全量改造。
6. 每完成一个功能，就同步补文档和清理坏样例。

## 9. 一句话记忆

`Harness Engineering` 的重点不是“让 AI 替你写代码”，而是“把项目改造成一个 AI 能稳定交付代码的环境”。

真正决定质量的，往往不是那一句 prompt，而是：

- 仓库知识是否完整
- 分层是否清晰
- 验证是否固定
- 反馈是否闭环
- 坏模式是否及时清理

## 10. AI 协作协议

如果目标是让 AI 在后续开发中稳定遵守仓库规则，不要只依赖“它可能会自动读文档”。团队应统一显式调用 `$mall-mini-harness`，把读文档、按分层实现、补注释、同步文档、刷新项目状态和执行验证固定成默认流程。

推荐把下面这句作为所有任务的统一开头：

```md
使用 $mall-mini-harness，完成以下任务。
```

要验证 AI 是否真的按规范工作，不看它说得像不像，只看它有没有满足这四条：

1. 先复述目标、范围和不做什么。
2. 明确列出会改哪些文件，不碰哪些文件。
3. 复杂任务先落 `docs/exec-plans/` 或 `docs/features/`，再动代码。
4. 交付时必须带验证结果和残余风险。

多人协作时，建议统一用这段模板发给 AI：

```md
任务：
<一句话说明要做什么>

范围：
<做什么>
<不做什么>

上下文：

1. 先读 docs/project-state.md
2. 再读 docs/ARCHITECTURE.md
3. 再读相关 feature / exec-plan

约束：

1. 只改相关文件
2. 关键代码必须写注释
3. 业务类型就近维护，不要乱提到全局 types
4. 完成后同步更新文档和状态快照

验证：

1. typecheck
2. lint
3. test
4. 关键路径手动冒烟
```

如果 AI 输出里缺了“文件清单”“验证结果”“文档更新”，就不要把它当成完成了，直接让它重做。

### 10.1 团队一句话任务模板

下面这些模板可以直接复制，只替换功能名和范围即可。

```md
使用 $mall-mini-harness，完成 <业务页面> 的 <具体功能>，只改该页面目录和必要公共能力，完成后同步文档、项目状态并执行验证。
```

```md
使用 $mall-mini-harness，修复 <页面名称> 的 <问题描述>，只改该页面相关文件，不改接口协议，完成后补注释和验证记录。
```

```md
使用 $mall-mini-harness，重构消息中心列表的数据拼装逻辑，把业务编排收敛到页面目录下的 `service.ts`，不要扩散到全局 `services` 或 `types`。
```

```md
使用 $mall-mini-harness，为采购单详情页补一份功能卡和执行计划，再开始编码；如果实现中涉及权限或隐私，先暂停并升级确认。
```

```md
使用 $mall-mini-harness，审查 `pkg-message` 模块当前实现是否符合仓库规范，输出问题清单、影响文件、验证结果和剩余风险，不要顺手改无关模块。
```

### 10.2 一句话模板写法

为了让 AI 更稳定地执行，你们的一句话任务尽量同时带上这 6 个要素：

- 使用 `$mall-mini-harness`
- 目标模块或页面
- 本次要做什么
- 明确不做什么
- 是否需要同步文档和项目状态
- 完成后要跑哪些验证

最短可用格式如下：

```md
使用 $mall-mini-harness，完成 <模块/页面> 的 <任务>，只改 <范围>，不做 <范围外内容>，完成后同步文档、项目状态并执行验证。
```

## 11. 日常同步

多人开发时，建议把这句命令当成日常入口：

```bash
npm run sync:state
```

它会刷新 `docs/project-state.md`，让仓库状态、模块结构和当前工作树保持一致。每天开工前先看它，做完跨模块改动后再跑一次。

## 12. 参考资料

- OpenAI, _Harness engineering: leveraging Codex in an agent-first world_  
  <https://openai.com/index/harness-engineering/>
- OpenAI, _A practical guide to building agents_  
  <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>
- OpenAI Docs, _Agent evals_  
  <https://platform.openai.com/docs/guides/agent-evals>
