# Flex 布局

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。
主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；
交叉轴的开始位置叫做cross start，结束位置叫做cross end。

参考
[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

## flex-direction属性  决定主轴的方向（即项目的排列方向）。

flex-direction: row | row-reverse | column | column-reverse;

 + row（默认值）：主轴为水平方向，起点在左端。
 + row-reverse：主轴为水平方向，起点在右端。
 + column：主轴为垂直方向，起点在上沿。
 + column-reverse：主轴为垂直方向，起点在下沿。

## flex-wrap属性

默认情况下，项目都排在一条线（又称"轴线"）上。flex-wrap属性定义，如果一条轴线排不下，如何换行。

flex-wrap: nowrap | wrap | wrap-reverse;

 + nowrap（默认）：不换行。
 + wrap：换行，第一行在上方。
 + wrap-reverse：换行，第一行在下方。

## flex-flow

flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。

flex-flow: <flex-direction> || <flex-wrap>;

## justify-content属性

justify-content属性定义了项目在主轴上的对齐方式。

justify-content: flex-start | flex-end | center | space-between | space-around;

假设主轴为从左到右。
 + flex-start（默认值）：左对齐
 + flex-end：右对齐
 + center： 居中
 + space-between：两端对齐，项目之间的间隔都相等。
 + space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

 ## align-items属性

 align-items属性定义项目在交叉轴上如何对齐。

 align-items: flex-start | flex-end | center | baseline | stretch;

下面假设交叉轴从上到下。

 + flex-start：交叉轴的起点对齐。
 + flex-end：交叉轴的终点对齐。
 + center：交叉轴的中点对齐。
 + baseline: 项目的第一行文字的基线对齐。
 + stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

 ## align-content属性

 align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

 align-content: flex-start | flex-end | center | space-between | space-around | stretch;

 + flex-start：与交叉轴的起点对齐。
 + flex-end：与交叉轴的终点对齐。
 + center：与交叉轴的中点对齐。
 + space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
 + space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
 + stretch（默认值）：轴线占满整个交叉轴。