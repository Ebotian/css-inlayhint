keyword不对,要根据值字面量语义确定
background也是,不允许多语义拼接
有待检查新增量是否合法
background-attachment: fixed/local/scroll -> viewport/content/border
background-repeat: repeat/no-repeat/space/round/repeat-x/repeat-y -> tiling/single/spaced/rounded/horizontal/vertical
background-blend-mode: normal/other -> default/blend
background-clip: border-box/padding-box/content-box/text/border-area -> border/padding/content/glyph/border-layer
background-image: none/non-none -> absent/graphic
background-origin: border-box/padding-box/content-box -> border/padding/content
对实际编程实现来说,一次一个family是最合适的实现排除方法,没有银弹