```
 __   _______ _            _______                  _             _   _     
 \ \ / / ____| |          |__   __|                (_)           | | (_)    
  \ V / |  __| | __ _ ___ ___| | ___ _ __ _ __ ___  _ _ __   __ _| |  _ ___ 
   > <| | |_ | |/ _` / __/ __| |/ _ \ '__| '_ ` _ \| | '_ \ / _` | | | / __|
  / . \ |__| | | (_| \__ \__ \ |  __/ |  | | | | | | | | | | (_| | |_| \__ \
 /_/ \_\_____|_|\__,_|___/___/_|\___|_|  |_| |_| |_|_|_| |_|\__,_|_(_) |___/
                                                                    _/ |    
                                                                   |__/     
```

# XGlassTerminal.js

XGlassTerminal.js 是一个用于构建前端终端样式的 JavaScript
库。它允许开发者轻松地创建一个具有终端风格的用户界面，并对用户输入的命令进行事件处理。该库提供了丰富的功能，包括文本添加、命令处理、点击事件绑定等。

同时还支持在终端中装载 Linux 终端模拟操作，如输入、Tab键、上下方向键等，其中内置了常用的 Linux 命令 以及 一些常用的 Linux
命令。

## 主要功能

### 终端样式构建

- 创建一个具有终端风格的 `div` 容器。
- 支持自定义命令前缀（如 `#`、`$` 等）。

### 文本添加

- 可以向终端添加文本，并支持自动换行。
- 可以根据命令前缀处理特定的命令。

### 事件处理

- 支持对用户输入的命令进行处理。
- 可以绑定点击事件，使用户可以通过点击终端来聚焦输入框。

### 样式定制

- 提供基本的 CSS 样式，可以根据需要进行自定义。

## 基本使用方法

### 在线体验

您可以在线体验 XGlassTerminal.js 的功能，[点击这里](https://www.lingyuzhao.top/gamePage/linuxTerminal.html)
可以快速前往，这样的方法更加适合于体验。

### 基本终端样式使用案例

在你的 HTML 文件中引入 XGlassTerminal.js 和相应的 CSS 文件。然后使用下面的代码：

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
    terminal.initEvent(function (x, text) {
        alert("输入了: " + text);
    });
    // 添加文本 也可以使用 appendXGlassText
    XGlassTerminal.appendXGlassText(terminal, "Hello World!", (x, e) => alert("输入了 " + e));
</script>
</html>

```

### 自定义命令前缀

```javascript
  // 实例化终端  并设置前缀为 #
const terminal = new XGlassTerminal(document.querySelector("div"), "#");
// 自定义前缀
terminal.commandPrefix = "root@xxx# ";
```

### 按键多监听

```javascript
// 实例化终端 并设置前缀为 #
const terminal = new XGlassTerminal(document.querySelector("div"), "#");
// 自定义前缀
terminal.commandPrefix = "root@xxx# ";
// 初始化终端 并对输入进行监听 TODO 参数统一是 当前的终端对象(为了防止在嵌套函数中无法访问设计的) 以及输入的命令
terminal.initEvent(
    // 第一个函数是监听回车后的命令
    (x, r) => XGlassTerminal.appendXGlassText(x, "您输入的是：" + r),
    // 第二个函数是监听Tab键后的命令
    (x, r) => x.input.value += ' 您按下了Tab键: 输入框的值为：' + r
);
```

## linux 终端模拟操作

```javascript
    // 实例化终端 并设置前缀为 #
const terminal = new XGlassTerminal(document.querySelector("div"), "#");
// 自定义前缀
terminal.commandPrefix = "root@xxx# ";
// 初始化终端 并对输入进行监听 TODO 参数统一是 当前的终端对象(为了防止在嵌套函数中无法访问设计的) 以及输入的命令
terminal.initEvent(
    // 第一个函数是监听回车后的命令
    (x, r) => Command.GetLinuxCommandHandler(x, r),
    // 第二个函数是监听Tab键后的命令
    (x, r) => Command.GetLinuxCommandHandlerTab(x, r),
    // 第三个是上方向按键
    Command.GetLinuxCommandHandlerArrowUp
);
```

## 更新日志

### 2024-12-02

- 优化了 Linux 终端的命令提示
- 增多了 Linux 中的命令数量
- 支持 Linux 命令的补全操作