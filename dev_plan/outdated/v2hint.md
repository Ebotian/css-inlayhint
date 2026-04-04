# 左 hint 候选分类

这一页只整理“左侧语义 hint”的候选集，目标是先把最稳定、最可解释的 shorthand 家族做完。

## 一、四边 / 四角分量型

这类最适合优先做左 hint。它们的共同特点是：

- 分量模型稳定
- 1/2/3/4 段映射清楚
- 用户能直接把 hint 和源码值对应起来
- 噪音低，收益高

候选：

- border
- border-top
- border-right
- border-bottom
- border-left
- border-width
- border-style
- border-color
- margin
- padding
- scroll-padding
- border-radius

细分：

- 四边型：border、border-top、border-right、border-bottom、border-left、border-width、border-style、border-color、margin、padding、scroll-padding
- 四角型：border-radius

特点补充：

- border / border-top / border-right / border-bottom / border-left 更像边框总括与方向总括
- border-width / border-style / border-color 更像边框分量家族
- margin / padding / scroll-padding 是最标准的四分量 family
- border-radius 是角型例外，不是四边，但仍然适合左 hint

## 二、双轴 / 成对方向型

这类也可以做左 hint，但不能直接套四边模型。

共同特点：

- 只有两个轴或两个槽位
- 更像成对语义，而不是四边展开
- 左 hint 的 label 需要更短、更克制

候选：

- grid-column
- grid-row
- scroll-padding-block
- scroll-padding-inline
- background-position
- flex-flow
- columns

特点补充：

- grid-column / grid-row 适合做“起止位置”类提示
- scroll-padding-block / scroll-padding-inline 是块轴 / 内联轴分量
- background-position 是双值位置语义
- flex-flow 是方向 + 换行组合
- columns 是宽度 + 列数组合

## 三、复合组合型

这类能做左 hint，但优先级低于前两类。

共同特点：

- 分支多
- 组合维度不止一个
- 容易把左 hint 做得太吵
- 更需要控制 label 长度和展示条件

候选：

- flex
- outline
- list-style
- column-rule
- text-decoration
- text-emphasis

特点补充：

- flex 是 grow / shrink / basis 组合
- outline 是 width / style / color 组合
- list-style 是 type / position / image 组合，更像属性集合
- column-rule 是列规则的边框变体
- text-decoration 是装饰线组合，可能还带 thickness
- text-emphasis 是轻量的 style / color 组合

## 四、左 hint 的优先级

### 第一梯队，优先做

- border
- border-top
- border-right
- border-bottom
- border-left
- border-width
- border-style
- border-color
- margin
- padding
- border-radius

这一组的特点是：

- 结构最稳定
- 角色最清楚
- 最适合建立用户对左 hint 的心智

### 第二梯队，可以继续做，但要单独规则

- grid-column
- grid-row
- scroll-padding
- scroll-padding-block
- scroll-padding-inline
- background-position
- flex-flow
- columns

这一组的特点是：

- 也有明确的槽位语义
- 但不是标准四边家族
- 需要单独设计 label 和映射规则

### 第三梯队，先谨慎

- flex
- outline
- list-style
- column-rule
- text-decoration
- text-emphasis

这一组的特点是：

- 复合度更高
- 更容易产生噪音
- 适合先做测试验证，再决定是否纳入左 hint 主线

## 五、分类原则

1. 左 hint 先服务结构角色，不服务值类型。
2. 能稳定拆成有限槽位的，优先。
3. 能让用户一眼看懂 family 的，优先。
4. 分支复杂、语义偏值解释的，先放后面。
5. 不是所有 shorthand family 都要立即做，按稳定性分批推进。

## 六、后续建议

- 左 hint 先吃第一梯队
- 第二梯队单独建 mapping
- 第三梯队先观察，必要时再补测试
- 右解析和 endblock 暂时不要混进这份清单里