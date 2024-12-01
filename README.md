# XGlassTerminal.js

XGlassTerminal.js 是一个用于构建前端终端样式的 JavaScript 库。它允许开发者轻松地创建一个具有终端风格的用户界面，并对用户输入的命令进行事件处理。该库提供了丰富的功能，包括文本添加、命令处理、点击事件绑定等。

## 主要功能

### 终端样式构建：

创建一个具有终端风格的 div 容器。
支持自定义命令前缀（如 #、$ 等）。

### 文本添加：
可以向终端添加文本，并支持自动换行。
可以根据命令前缀处理特定的命令。

### 事件处理：
支持对用户输入的命令进行处理。
可以绑定点击事件，使用户可以通过点击终端来聚焦输入框。


### 样式定制：
提供基本的 CSS 样式，可以根据需要进行自定义。

## 使用方法

在你的 HTML 文件中引入 XGlassTerminal.js 和相应的 CSS 文件。然后使用下面的代码

```html
<html lang="zh">

<head>
  <meta charset="utf-8">
  <title>测试代码</title>
  <link rel="stylesheet" href="css/XGlassTerminal.css">
</head>

<body>
<div>

</div>
</body>

<script src="js/XGlassTerminal.js" type="text/javascript"></script>
<script>
  // 实例化终端
  const terminal = new XGlassTerminal(document.querySelector("div"), "#");
  // 初始化终端 这里可以给处理函数
  terminal.initEvent(function (text) {
    alert("输入了: " + text);
  });
  // 添加文本 也可以使用 input
  XGlassTerminal.appendXGlassText(terminal, "Hello World!", (e) => alert("输入了 " + e));
</script>
</html>

```