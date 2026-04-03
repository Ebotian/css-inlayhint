# Hint 分类设计

## 目标

我们已经完成第一版链路，接下来不再追求“一次性覆盖全部 CSS 解析结果”，而是按语义通道逐步收敛。

设计目标不是把 490 个属性都做成 hint，而是把真正稳定、低噪音、可解释的信息分流到不同展示槽位里：

- 左侧语义 hint
- 右侧解析 hint
- endblock 汇总 hint

这三类 hint 彼此独立，不能混成一条规则。

## 核心原则

1. 先语义，后展示。
2. 先稳定，后覆盖。
3. 先分通道，后扩属性。
4. 能从源码直接读出的信息，优先不提示。
5. 默认 suppress，白名单放开。

## 三通道模型

### 1. 左侧语义 hint

左侧语义 hint 表达的是“这个值在结构上是什么角色”。

它更适合：

- shorthand 的分量语义
- 方向型、角型、分组型 family 的角色标签
- 能稳定拆成 1/2/3/4 段的结构

当前设计下，左侧语义 hint 的主力应当是 `shorthand-family`。

典型例子：

- `margin`
- `padding`
- `border-width`
- `border-style`
- `border-color`
- `border-radius`
- `grid-area`
- `flex`
- `columns`

说明：

- `border-radius` 属于角型 shorthand，不是四边型 shorthand，但仍然属于左侧语义的合格对象。
- 左侧语义的重点是“结构角色”而不是“值类型”。

### 2. 右侧解析 hint

右侧解析 hint 表达的是“这个值最终解析成了什么”。

它更适合：

- 单位，如 `px`、`rem`、`%`
- 类型，如 length、time、angle、color
- 引用，如 `var(--x)`、引用链、fallback 链
- 关键字类别，如 CSS-wide keyword、枚举关键字、函数关键字

右侧解析 hint 是独立通道，不是左侧语义的补丁。

它的价值在于：

- 帮助理解值的最终形态
- 补足 shorthand 左侧无法表达的细节
- 保留 token 级的信息密度

### 3. endblock 汇总 hint

endblock hint 表达的是“这个块整体是什么”。

它更适合：

- `@media`
- `@supports`
- `@container`
- `@layer`
- `@keyframes`
- `@font-face`
- 长 selector 的块摘要

endblock 不应该承担 token 级解析，也不应该显示过长的展开结果。

它的目标是：

- 让大块结构在闭合处更容易扫读
- 提供块级摘要，而不是属性级细节

## 默认抑制策略

第一版设计里，以下类别默认不作为左侧语义 hint 的主力：

- `generic-single`
- `keyword-union`
- `reference-only`

这些类别不是永远不能显示，而是默认不进入左侧语义通道。

还要永久抑制的对象：

- CSS custom properties，`--*`
- `var(...)`
- CSS-wide keywords：`initial`、`inherit`、`unset`、`revert`、`revert-layer`

## 白名单原则

不按“结构类别”整类放开，而按“具体属性”逐个评估。

也就是说：

- 左侧语义默认只放开 `shorthand-family`
- 右侧解析只放开少量明确有价值的属性类型
- endblock 只放开少量块级结构

如果某个 `generic-single` 或 `keyword-union` 真的值得显示，也应该作为单独白名单项进入，而不是整类放开。

## 例外与边界

### 左侧语义的例外

`border-radius` 不属于四边型 shorthand，但仍然应该进入左侧语义通道，因为它有稳定的角型分量语义。

### 右侧解析的边界

右侧解析不应该把所有值都变成提示。

如果解析结果只是重复源码已有信息，或者噪音大于收益，就不显示。

### endblock 的边界

endblock 不做 token 级拆解，不做 unit/type/reference 的详细解析。

它只做块级摘要。

## 建议的分类决策

### 左侧语义

优先：

- `shorthand-family`

默认不放开：

- `generic-single`
- `keyword-union`
- `reference-only`

### 右侧解析

优先：

- 单位类
- 引用类
- 类型类
- 枚举类

默认白名单驱动，逐项增加。

### endblock

优先：

- at-rule 块
- 长 selector 块
- 规则块摘要

默认只做块摘要，不做细粒度值解析。

## 对当前实现的落地含义

1. `classifier` 继续只做保守筛选，不要把所有结构都放进主链。
2. `mapper` 只负责把已确认的 shorthand family 映射成更语义化的 label。
3. `resolver` 负责把左侧语义与右侧解析分开，不要混用同一个位置规则。
4. `constructor` 负责最终显示样式，统一冒号、左右 padding 等视觉约定。
5. `endblock` 需要单独的入口和单独的规则，不和 inline hint 混在一起。

## 结论

当前最合理的路线是：

- 左侧语义：窄一些，只保留真正稳定的 shorthand family
- 右侧解析：独立成层，按白名单逐步放开
- endblock：独立成块摘要通道

这样做比“一次性让所有属性都显示 hint”更稳，也更接近 clangd 的分层思想。
