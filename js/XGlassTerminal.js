/**
 * file XGlassTerminal.js
 * 终端类对象
 * @author 赵凌宇
 */
class XGlassTerminal {

    /**
     * 构造一个终端对象
     * @param element {HTMLElement} 用于存储终端的元素
     * @param commandPrefix {string} 命令前缀
     */
    constructor(element, commandPrefix) {
        this.setCommandPrefix.call(this, commandPrefix);
        // 实例化输入框
        this._input = document.createElement("input");
        this._input.className = "XGlassTerminal_input";
        this._input.type = "text";
        this._input.placeholder = '请输入命令';
        this._input.value = this._commandPrefix;
        this._input.addEventListener('input', () => {
            const commandPrefix1 = this.getCommandPrefix();
            if (this._input.value.length < commandPrefix1.length) {
                this._input.value = commandPrefix1;
            }
        });
        // 实例化输入框的 label
        this._inputLabel = document.createElement("label");
        this._inputLabel.setAttribute("for", "XGlassTerminal_input");
        this._inputLabel.id = "XGlassTerminal_input_label";
        this._inputLabel.appendChild(this._input);

        // pre
        this._XGlassTerminalPre = document.createElement("pre");

        // 实例化终端容器
        this._xGlassTerminal = document.createElement("div");
        this._xGlassTerminal.className = "XGlassTerminal";
        this._xGlassTerminal.appendChild(this._XGlassTerminalPre);
        this._xGlassTerminal.appendChild(this._inputLabel);
        this._xGlassTerminal.addEventListener("click", () => {
            this.input.focus()
        });

        // 终端加入容器
        element.appendChild(this._xGlassTerminal);
        console.info(getXGlassTerminalAsciiLogo());
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }

    set commandPrefix(value) {
        this._commandPrefix = value;
        this._input.value = this._commandPrefix;
    }

    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value;
    }

    get inputLabel() {
        return this._inputLabel;
    }

    set inputLabel(value) {
        this._inputLabel = value;
    }

    get XGlassTerminalPre() {
        return this._XGlassTerminalPre;
    }

    set XGlassTerminalPre(value) {
        this._XGlassTerminalPre = value;
    }

    get xGlassTerminal() {
        return this._xGlassTerminal;
    }

    set xGlassTerminal(value) {
        this._xGlassTerminal = value;
    }

    /**
     * 添加文本
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param text {string} 添加的文本
     * @param fun {function} 用于处理添加的文本的函数
     * @param trimPrefix {boolean} 是否去除命令前缀
     */
    static appendXGlassText(xGlassTerminal, text, fun = undefined, trimPrefix = false) {
        xGlassTerminal._XGlassTerminalPre.appendChild(document.createTextNode(text + '\n'));
        if (trimPrefix) {
            text = text.substring(xGlassTerminal._commandPrefix.length);
        }
        if (fun) {
            fun(xGlassTerminal, text);
        }
    }

    clear() {
        this._XGlassTerminalPre.innerHTML = "";
    }

    setCommandPrefix(commandPrefix) {
        this._commandPrefix = commandPrefix;
        this._commandPrefix += " ";
    }

    getCommandPrefix() {
        return this._commandPrefix;
    }

    /**
     * 初始化事件
     * @param commandSubmitFun {function} 命令提交函数 参数是 xGlassTerminal 对象 以及 输入框的值
     * @param commandTabFun {function} 命令补全处理函数，此函数会在输入框按下 tab 时调用 参数是 xGlassTerminal 对象 以及 输入框的值
     * @param ArrowUp {function} 上方向
     * @param ArrowDown {function} 下方向
     */
    initEvent(commandSubmitFun, commandTabFun = undefined, ArrowUp = undefined, ArrowDown = undefined) {
        const xGlassTerminal = this;
        const inputLabel = xGlassTerminal._inputLabel;
        const length = xGlassTerminal.getCommandPrefix().length;

        // 欢迎命令
        commandSubmitFun(xGlassTerminal, "welcome");

        xGlassTerminal._xGlassTerminal.addEventListener("click", function () {
            inputLabel.click();
        });

        // 准备函数
        xGlassTerminal._input.addEventListener('keydown', function (event) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                if (this.selectionStart === 0 && this.selectionEnd === 1) {
                    // 如果用户尝试删除第一个字符
                    event.preventDefault();
                }
            } else if (event.key === 'Tab') {
                // 可能是补全
                event.preventDefault();
                if (commandTabFun) {
                    commandTabFun(xGlassTerminal, this.value.substring(length));
                }
            } else if (event.key === 'Enter') {
                const value = this.value;
                XGlassTerminal.appendXGlassText(xGlassTerminal, value, commandSubmitFun, true);
                this.value = xGlassTerminal.getCommandPrefix();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (ArrowUp) {
                    ArrowUp(xGlassTerminal, this.value.substring(length));
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (ArrowDown) {
                    ArrowDown(xGlassTerminal, this.value.substring(length));
                }
            }
        });
    }
}

function getXGlassTerminalAsciiLogo() {
    return "\n __   _______ _            _______                  _             _   _     \n \\ \\ / / ____| |          |__   __|                (_)           | | (_)    \n  \\ V / |  __| | __ _ ___ ___| | ___ _ __ _ __ ___  _ _ __   __ _| |  _ ___ \n   > <| | |_ | |/ _` / __/ __| |/ _ \\ '__| '_ ` _ \\| | '_ \\ / _` | | | / __|\n  / . \\ |__| | | (_| \\__ \\__ \\ |  __/ |  | | | | | | | | | | (_| | |_| \\__ \\\n /_/ \\_\\_____|_|\\__,_|___/___/_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_(_) |___/\n                                                                    _/ |    \n                                                                   |__/     \n"
}

/**
 * @author 赵凌宇
 */
class LinuxCommandHandler {

    constructor(linuxDirectory = {
        '/': {
            bin: {
                ls: {
                    __fun__: this.ls,
                    __text__: "ls 用于获取到一个文件目录下面的所有子文件以及目录"
                },
                pwd: {
                    __fun__: this.pwd,
                    __text__: "pwd 用于获取当前工作目录"
                },
                cd: {
                    __fun__: this.cd
                    , __text__: "cd 用于改变当前工作目录"
                },
                mkdir: {
                    __fun__: this.mkdir,
                    __text__: "mkdir 用于创建一个目录"
                },
                rm: {
                    __fun__: this.rm,
                    __text__: "rm 用于删除一个文件或者一个目录"
                },
                touch: {
                    __fun__: this.touch,
                    __text__: "touch 用于创建一个文件"
                },
                cat: {
                    __fun__: this.cat,
                    __text__: "cat 用于获取一个文件的内容"
                },
                mv: {
                    __fun__: this.mv,
                    __text__: "mv 用于移动一个文件或者一个目录"
                },
                cp: {
                    __fun__: this.cp,
                    __text__: "cp 用于复制一个文件或者一个目录"
                },
                echo: {
                    __fun__: this.echo,
                    __text__: "echo 用于输出一个字符串"
                },
                time: {
                    __fun__: this.time,
                    __text__: "time 用于获取当前时间"
                },
                curl: {
                    __fun__: this.curl,
                    __text__: "curl 用于获取一个URL的内容"
                },
                help: {
                    __fun__: this.help,
                    __text__: "help 用于获取命令的帮助"
                },
                welcome: {
                    __fun__: this.welcome,
                    __text__: "welcome 用于获取欢迎信息"
                },
                writer: {
                    __fun__: this.writer,
                    __text__: "writer 用于将一些字符串写入文件"
                },
                grep: {
                    __fun__: this.grep,
                    __text__: "grep 用于过滤一些文件名字 grep 正则 需要被匹配的目录，会自动的读取目录下面的所有子文件和子目录的名字"
                },
                ifconfig: {
                    __fun__: this.ifconfig,
                    __text__: "ifconfig 用于获取网络接口的信息"
                },
                date: {
                    __fun__: this.date,
                    __text__: "date 用于获取当前日期"
                },
                clear: {
                    __fun__: this.clear,
                    __text__: "clear 用于清空屏幕"
                },
                whoAmI: {
                    __fun__: this.whoAmI,
                    __text__: "whoAmI 用于获取当前用户名"
                },
                hostname: {
                    __fun__: this.hostname,
                    __text__: "hostname 获取当前的主机名称"
                },
                "export": {
                    __fun__: this.export,
                    __text__: "export 用于设置环境变量"
                },
                env: {
                    __fun__: this.env,
                    __text__: "env 用于获取环境变量"
                },
                printenv: {
                    __fun__: this.printenv,
                    __text__: "printenv 用于获取环境变量"
                },
                unset: {
                    __fun__: this.unset,
                    __text__: "unset 用于删除环境变量"
                },
                openWeb: {
                    __fun__: this.openWeb,
                    __text__: "openWeb 用于打开一个URL"
                },
                history: {
                    __fun__: (x, r) => {
                        if (r.length > 1) {
                            if (r[1] === "-c") {
                                XGlassLinuxCommand.backCommand = [];
                                XGlassLinuxCommand._history_index = 0;
                                return;
                            }
                        }
                        for (let backCommandElement of XGlassLinuxCommand.backCommand) {
                            XGlassTerminal.appendXGlassText(x, backCommandElement);
                        }
                    },
                    __text__: "history 用于获取命令历史"
                },
                "realpath": {
                    __fun__: this.realpath,
                    __text__: "realpath 用于获取一个文件的真实路径"
                },
                wget: {
                    __fun__: this.wget,
                    __text__: "wget 用于下载一个文件"
                },
                wgetYouDisk: {
                    __fun__: this.wgetYouDisk,
                    __text__: "wgetYouDisk 尝试URl下载，若回复是可下载的，则会自动调用您的浏览器下载"
                },
                bash: {
                    __fun__: this.bash,
                    __text__: "bash 用于执行一个bash js 脚本，直接输入 bash <js代码> 就可以运行！"
                },
                tree: {
                    __fun__: this.tree,
                    __text__: "tree 用于获取一个目录的树形结构"
                },
            },
            usr: {
                bin: {
                    bash: {},
                    sh: {},
                    csh: {},
                    tcsh: {},
                    zsh: {},
                    ksh: {}
                }
            },
            etc: {
                passwd: {},
                group: {},
                hosts: {},
                resolv_conf: {},
                hostname: {
                    __text__: `XGlassTerminal@${navigator.userAgent}`
                },
                profile: {
                    __text__: {}
                }
            },
            var: {
                log: {
                    messages: {}
                }
            },
            home: {
                user: {
                    documents: {
                        report_txt: {}
                    }
                }
            }
        }
    }) {
        this.linuxDirectory = linuxDirectory;
        this.nowPath = '/';
        // 特殊属性设置 这样的属性会被视为属性 将不会被常用命令查询
        this.specialProperties = {
            '__fun__': "执行代码",
            '__text__': "文本内容"
        }
    }

    /**
     * 查找文件或目录
     * @param path {string} 路径
     * @param fun {Function} 自定义的处理 会将完整路径传递进来，内部可以继续查找等操作
     * @return {Object|null} 找到的文件或目录对象，未找到则返回 null
     */
    findFileOrDir(path, fun = undefined) {
        if (path === '/') {
            return this.linuxDirectory['/'];
        }
        // 处理相对路径中的 ..
        while (path.includes('../')) {
            const parts = path.split('/');
            const index = parts.indexOf('..');
            if (index > 0) {
                parts.splice(index - 1, 2); // 移除 .. 和它前面的一个目录
            } else {
                parts.splice(index, 1); // 如果 .. 在最前面，只移除 ..
            }
            path = parts.join('/');
        }

        // 处理相对路径
        const isRelative = path.charAt(0) === '.' || path.charAt(0) === '~' || path.charAt(0) === './';
        if (isRelative || path.charAt(0) !== '/') {
            path = (this.nowPath + '/' + (isRelative ? path.substring(1) : path)).replaceAll('//', '/');
        }

        // 规范化路径
        path = path.split('/').filter(part => part !== '').join('/');

        if (path === '') {
            path = '/';
        }

        // 传递完整路径
        if (fun) {
            return fun(path);
        }

        console.info("find:", path);

        let parts = path.split('/');
        let current = this.linuxDirectory['/'];

        for (let part of parts) {
            if (!current[part] || part in this.specialProperties) {
                return null;
            }
            current = current[part];
        }
        return current;
    }

    /**
     *  辅助函数：添加文件或目录
     * @param xGlassTerminal
     * @param path 路径
     * @param item 文件或目录对象
     */
    addFileOrDir(xGlassTerminal, path, item) {
        // 获取到当前路径的父目录
        let parentPath = path.substring(0, path.lastIndexOf('/'));
        // 获取到当前路径的名称
        const itemName = path.substring(path.lastIndexOf('/') + 1);
        // 如果夫目录是空的，则直接给父目录换为绝对路径
        if (parentPath.charAt(0) === '') {
            parentPath = this.nowPath;
        }
        const parent = this.findFileOrDir(parentPath);
        if (parent) {
            parent[itemName] = item;
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `Error: Cannot add ${itemName} to ${parentPath}.`);
        }
    }

    ifconfig = (xGlassTerminal, args) => {
        if (args.length >= 2) {
            this.curl(xGlassTerminal, ['ifconfig', 'https://ifconfig.me/' + args[1]]);
        } else {
            this.curl(xGlassTerminal, ['ifconfig', 'https://ifconfig.me/ip']);
        }
    };

    whoAmI = (xGlassTerminal) => {
        XGlassTerminal.appendXGlassText(xGlassTerminal, 'root');
    };

    hostname = (xGlassTerminal) => {
        this.cat(xGlassTerminal, ['cat', '/etc/hostname']);
    };

    date = (xGlassTerminal) => {
        const date = new Date();
        XGlassTerminal.appendXGlassText(xGlassTerminal, date.toLocaleString());
    };

    clear = (xGlassTerminal) => {
        xGlassTerminal.clear();
    };

    export = (xGlassTerminal, args) => {
        if (args.length < 2) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Usage: export <variable>=<value>');
            return;
        }
        const split = args[1].split('=');
        // 找到 /etc/profile 文件
        const findFileOrDir1 = this.findFileOrDir("/etc/profile");
        if (findFileOrDir1) {
            findFileOrDir1.__text__[split[0].trim()] = split[1].trim();
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Error: Cannot find /etc/profile');
        }
    };

    env = (xGlassTerminal) => {
        // 获取 /etc/profile 文件
        const findFileOrDir1 = this.findFileOrDir("/etc/profile");
        if (findFileOrDir1) {
            for (let key in findFileOrDir1.__text__) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `${key}=${findFileOrDir1.__text__[key]}`);
            }
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Error: Cannot find /etc/profile');
        }
    };

    printenv = (xGlassTerminal, args, fun) => {
        if (args.length < 1) {
            env(xGlassTerminal);
            return;
        }
        // 获取 /etc/profile 文件
        const findFileOrDir1 = this.findFileOrDir("/etc/profile");
        if (findFileOrDir1) {
            const textElement = findFileOrDir1.__text__[args[1]];
            if (fun) {
                fun(textElement);
            } else {
                XGlassTerminal.appendXGlassText(xGlassTerminal, textElement);
            }
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Error: Cannot find /etc/profile');
        }
    };

    unset = (xGlassTerminal, args) => {
        if (args.length <= 1) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Usage: unset <variable>');
        } else {
            // 获取 /etc/profile 文件
            const findFileOrDir1 = this.findFileOrDir("/etc/profile");
            if (findFileOrDir1) {
                delete findFileOrDir1.__text__[args[1]];
            } else {
                XGlassTerminal.appendXGlassText(xGlassTerminal, 'Error: Cannot find /etc/profile');
            }
        }
    };

    help = (xGlassTerminal, args) => {
        if (args.length > 1) {
            this.cat(xGlassTerminal, ['cat', '/bin/' + args[1]]);
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Available commands list');
            XGlassTerminal.appendXGlassText(xGlassTerminal, '+==============================+');
            this.processCommand(xGlassTerminal, ['ls', '/bin']);
        }
    };

    welcome = (xGlassTerminal) => {
        XGlassTerminal.appendXGlassText(xGlassTerminal, 'Welcome to XGlass Terminal!');
        XGlassTerminal.appendXGlassText(xGlassTerminal, 'Type "help" for a list of available commands.');
        XGlassTerminal.appendXGlassText(xGlassTerminal, getXGlassTerminalAsciiLogo());
    };

    curl = (xGlassTerminal, args) => {
        if (args.length < 2) {
            xGlassTerminal.appendXGlassText(xGlassTerminal, 'Usage: curl <url>');
        }

        const url = args[1];

        try {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, data, undefined);
                })
                .catch(error => {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, error.message, undefined);
                });
        } catch (e) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, JSON.stringify(e));
        }
    };

    cp = (xGlassTerminal, args) => {
        if (args.length < 3) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Usage: cp <source> <destination>');
        }
        if (this.findFileOrDir(args[1]) === null) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'cp: cannot copy ' + args[1] + ': No such file or directory');
        } else {
            this.addFileOrDir(xGlassTerminal, args[2], this.findFileOrDir(args[1]));
        }
    };

    mv = (xGlassTerminal, args) => {
        if (args.length < 3) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Usage: mv <source> <destination>');
        }
        if (this.findFileOrDir(args[1]) === null) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'mv: cannot move ' + args[1] + ': No such file or directory');
        } else {
            this.addFileOrDir(xGlassTerminal, args[2], this.findFileOrDir(args[1]));
            this.rm(xGlassTerminal, [args[1]]);
        }
    };

    /**
     * 处理 time 命令
     * @param xGlassTerminal
     * @param args {Array<string>} 命令参数
     * @return {string} 时间测量结果
     */
    time = (xGlassTerminal, args) => {
        if (args.length < 2) {
            return 'Usage: time <command>';
        }
        // 构建子命令
        let c = [];
        for (let i = 1; i < args.length; i++) {
            c.push(args[i]);
        }
        const startTime = Date.now();
        // 执行命令
        this.processCommand(xGlassTerminal, c);
        const endTime = Date.now();
        const realTime = endTime - startTime;
        const userTime = 0; // 用户时间，这里简化为 0
        const sysTime = 0; // 系统时间，这里简化为 0
        XGlassTerminal.appendXGlassText(xGlassTerminal, `···\nreal ${realTime}ms\nuser ${userTime}ms\nsys ${sysTime}ms`);
    };

    /**
     * linux grep 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @param fun {function} 命令处理函数 匹配到一个确定的就会调用此函数
     * @return {function} linux 命令处理函数
     */
    grep = (xGlassTerminal, command, fun) => {
        if (command.length < 3) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Usage: grep <pattern> <file>');
            return;
        }

        // 提取出文件路径
        const filePath = command[2];
        const files = this.findFileOrDir(filePath);

        // 提取出匹配字符串 正则
        const pattern = new RegExp(command[1]);

        if (!files) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `grep: ${filePath}: No such file or directory`);
            return;
        }
        // 使用正则表达式匹配文件名字
        const strings = Object.keys(files).filter(key => pattern.test(key));
        console.info(command, strings, strings.length);
        if (strings.length === 0){

        } else if (strings.length === 1 && fun) {
            fun(strings[0]);
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `grep: 【${filePath}】 match: ${pattern}`);
            XGlassTerminal.appendXGlassText(xGlassTerminal, `+=================================+`);
            for (const line of strings) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `${line} 【${files[line].__text__}】`);
            }
        }
    };

    /**
     * linux ls 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @param fun {function} 命令处理函数 获取到一个确定的路径之后会调用此函数
     */
    ls = (xGlassTerminal, command, fun = undefined) => {
        // 获取命令参数
        const args = command || [];

        // 默认列出当前目录
        let path = this.nowPath;
        if (args.length > 1) {
            path = args[1];
        }

        // 查找指定路径的目录
        const targetDir = this.findFileOrDir(path);

        if (!targetDir) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `ls: cannot access '${path}': No such file or directory`);
            return;
        }

        // 检查是否是目录
        if (typeof targetDir !== 'object' || Array.isArray(targetDir)) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `ls: cannot access '${path}': Not a directory`);
            return;
        }

        // 列出目录内容
        const entries = Object.keys(targetDir).sort();
        // 查看是否只有一个路径
        if (entries.length === 1 && fun) {
            fun(entries[0]);
        }
        const result = entries.join('\t');

        XGlassTerminal.appendXGlassText(xGlassTerminal, result);
    };


    /**
     * linux pwd 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @return {function} linux 命令处理函数
     */
    pwd = (xGlassTerminal) => {
        XGlassTerminal.appendXGlassText(xGlassTerminal, this.nowPath);
    };

    realpath = (xGlassTerminal, commandStrings, fun = undefined) => {
        if (commandStrings.length < 2) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Usage: realpath <path>');
            return;
        }
        // 获取到当前的命令
        let commandString1 = commandStrings[commandStrings.length - 1];
        if (commandString1 === '/'){
            if (fun){
                fun(commandString1);
                return;
            }
            XGlassTerminal.appendXGlassText(xGlassTerminal, commandString1);
            return;
        }
        if (commandString1.charAt(0) !== '/') {
            commandString1 = XGlassLinuxCommand.linuxCommand.nowPath + '/' + commandString1;
        }
        // 分割路径和文件名
        const parts = commandString1.split('/');
        let parentDir = parts.slice(0, -1).join('/') || '/';
        const fileName = parts[parts.length - 1];

        // 在父目录中找以 fileName 开头的文件或目录
        this.grep(xGlassTerminal, ['grep', '^' + fileName + '.*', parentDir], (r) => {
            // 构建目录
            let s = "";
            for (let i = 0; i < r.length - 1; i++) {
                s += r[i];
            }
            // 构建路径
            if (parentDir === "/") {
                parentDir = ' ';
            }
            const res = parentDir + '/' + r;
            if (fun){
                fun(res);
                return;
            }
            XGlassTerminal.appendXGlassText(xGlassTerminal, res);
        });
    };

    /**
     * linux cd 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */
    cd = (xGlassTerminal, command) => {
        if (command.length > 1) {
            const path = command[1];
            let fullPath;

            // 处理相对路径和 ../
            if (path.startsWith('../') || path.startsWith('./') || !path.startsWith('/')) {
                fullPath = (this.nowPath + '/' + path).replaceAll('//', '/');
            } else {
                fullPath = path;
            }

            // 处理路径中的 ..
            while (fullPath.includes('../')) {
                const parts = fullPath.split('/');
                const index = parts.indexOf('..');
                if (index > 0) {
                    parts.splice(index - 1, 2); // 移除 .. 和它前面的一个目录
                } else {
                    parts.splice(index, 1); // 如果 .. 在最前面，只移除 ..
                }
                fullPath = parts.join('/');
            }

            // 规范化路径
            fullPath = fullPath.split('/').filter(part => part !== '').join('/');
            if (fullPath === '') {
                fullPath = '/';
            }

            // 确保路径以斜杠开头
            if (!fullPath.startsWith('/')) {
                fullPath = '/' + fullPath;
            }

            const targetDir = this.findFileOrDir(fullPath);

            if (!targetDir) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `cd: no such file or directory: ${path}`);
                return;
            }

            // 检查是否是目录
            if (typeof targetDir !== 'object' || Array.isArray(targetDir)) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `cd: not a directory: ${path}`);
                return;
            }

            this.nowPath = fullPath;
        }
    };

    /**
     * linux mkdir 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */
    mkdir = (xGlassTerminal, command) => {
        if (command.length > 1) {
            const path = command[1];
            const targetDir = this.findFileOrDir(path);

            if (targetDir) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `mkdir: cannot create directory '${path}': File exists`);
                return;
            }

            this.addFileOrDir(xGlassTerminal, path, {});
            XGlassTerminal.appendXGlassText(xGlassTerminal, `mkdir: created directory '${path}'`);
        }
    };

    /**
     * linux touch 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */
    touch = (xGlassTerminal, command) => {
        if (command.length > 1) {
            const path = command[1];
            const targetDir = this.findFileOrDir(path);

            if (targetDir) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `touch: cannot touch '${path}': File exists`);
                return;
            }

            this.addFileOrDir(xGlassTerminal, path, {
                __fun__: (xGlassTerminal, command) => {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, command[0] + " is a file!");
                }
            });
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, "Usage: touch <file>");
        }
    };

    /**
     * linux writer 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */

    writer = (xGlassTerminal, command) => {
        if (command.length > 2) {
            const path = command[1];
            const targetDir = this.findFileOrDir(path);

            if (targetDir) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `touch: cannot touch '${path}': File exists`);
                return;
            }

            if (command.length > 3) {
                // 认为是有 isJsShellCode 的 在这里将疑似代码的部分获取到 就是从 command[2] 开始到 command[command.length - 1]结束
                let string = "";
                for (let i = 2; i < command.length; i++) {
                    string += command[i] + " ";
                }
                XGlassTerminal.appendXGlassText(xGlassTerminal, "编译：" + string);
                this.addFileOrDir(xGlassTerminal, path, {
                    __text__: string,
                    __fun__: (xGlassTerminal, command) => {
                        const eval1 = eval(string);
                        if (eval1) {
                            XGlassTerminal.appendXGlassText(xGlassTerminal, eval1);
                        }
                    }
                });
            } else {
                this.addFileOrDir(xGlassTerminal, path, {
                    text: command.length > 2 ? command[2] : "",
                    __fun__: (xGlassTerminal, command) => {
                        XGlassTerminal.appendXGlassText(xGlassTerminal, command[0] + " is a file!");
                    }
                });
            }
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, "Usage: writer <file> <text（如果带有空格则认为是脚本）>");
        }
    };

    /**
     * linux rm 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */
    rm = (xGlassTerminal, command) => {
        if (command.length > 1) {
            const path = command[1];
            const targetDir = this.findFileOrDir(path);

            if (!targetDir) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `rm: cannot remove '${path}': No such file or directory`);
                return;
            }

            delete this.linuxDirectory[path];
            XGlassTerminal.appendXGlassText(xGlassTerminal, `rm: removed '${path}'`);
        }
    };

    /**
     * linux cat 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */
    cat = (xGlassTerminal, command) => {
        if (command.length > 1) {
            const path = command[1];
            const targetDir = this.findFileOrDir(path);

            if (!targetDir) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `cat: cannot open '${path}': No such file or directory`);
                return;
            }

            if (typeof targetDir === 'string') {
                XGlassTerminal.appendXGlassText(xGlassTerminal, targetDir);
            } else if (typeof targetDir.__text__ === 'object') {
                // 代表这个 __text__ 内容需要特殊处理
                for (let r in targetDir.__text__) {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, `${r}=${targetDir.__text__[r]}`);
                }
            } else {
                XGlassTerminal.appendXGlassText(xGlassTerminal, targetDir.__text__);
            }
        }
    };

    /**
     * linux echo 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */
    echo = (xGlassTerminal, command) => {
        if (command.length > 1) {
            let text = command.slice(1).join(' ');

            // 处理变量问题
            const variablePattern = /\$\w+/g;
            const variables = text.match(variablePattern);

            if (variables) {
                variables.forEach(variable => {
                    const varName = variable.substring(1); // 去掉 $
                    this.printenv(xGlassTerminal, ['printenv', varName], (e) => {
                        if (e !== undefined) {
                            text = text.replace(variable, e);
                        } else {
                            XGlassTerminal.appendXGlassText(xGlassTerminal, `Variable ${variable} not found.`);
                        }
                    })
                });
            }

            // 首先查是否是 >>
            if (command.includes('>>')) {
                const parts = text.split('>>');
                const fileContent = parts[0].trim();
                const fileName = parts[1].trim();

                if (fileName) {
                    this.writer(xGlassTerminal, ["writer", fileName, fileContent]);
                } else {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, "Usage: echo <text> >> <file>");
                }
            } else {
                XGlassTerminal.appendXGlassText(xGlassTerminal, text);
            }
        }
    };

    openWeb = (xGlassTerminal, command) => {
        if (command.length <= 1) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, "use param openWeb <URL>");
            return;
        }
        window.open(command[1]);
        XGlassTerminal.appendXGlassText(xGlassTerminal, "已尝试打开 URL " + command[1]);
    };

    wget = (xGlassTerminal, command) => {
        if (command.length > 2) {
            const url = command[1];
            const fileName = command[2];
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    this.writer(xGlassTerminal, ["writer", fileName, data]);
                })
                .catch(error => {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, `Error: ${error}`);
                });
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, "Usage: wget <URL> <fileName>");
        }
    };

    wgetYouDisk = (xGlassTerminal, command) => {
        if (command.length > 1) {
            const url = command[1];
            const fileName = command[2];
            this.openWeb(xGlassTerminal, ["openWeb", url]);
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, "Usage: wgetYouDisk <URL> <fileName>");
        }
    };

    bash = (xGlassTerminal, command) => {
        let script = command.slice(1).join(' ');
        XGlassTerminal.appendXGlassText(xGlassTerminal, "bash Js 编译: " + script);
        // 将脚本中的 console.log 函数替换为 echo调用
        script = script.replaceAll("console.log", "XGlassLinuxCommand.GetLinuxCommandHandlerConsoleLog");
        const scriptElement = document.createElement('script');
        scriptElement.textContent = script;
        XGlassTerminal.appendXGlassText(xGlassTerminal, "bash Js 执行: " + script);
        XGlassTerminal.appendXGlassText(xGlassTerminal, "bash Js =========================>>> run!");
        document.body.appendChild(scriptElement);
        XGlassTerminal.appendXGlassText(xGlassTerminal, "bash Js =========================>>> 操作结束，释放空间！");
        document.body.removeChild(scriptElement);
    };


    tree = (xGlassTerminal, command) => {
        if (command.length <= 1) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, "Usage: tree <path>");
            return;
        }

        try {
            XGlassTerminal.appendXGlassText(xGlassTerminal, "tree =========================>>> run!");
            this.buildTree(undefined, command[1], xGlassTerminal);
            XGlassTerminal.appendXGlassText(xGlassTerminal, "tree =========================>>> 操作结束，释放空间！");
        } catch (error) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `Error: ${error.message}`);
        }
    };

    buildTree(files, dirPath, xGlassTerminal, parentPrefix = '┃', prefix = ' ') {
        try {
            if (!files){
                files = this.findFileOrDir(dirPath);
            }
            if (typeof files !== 'object'){
                return;
            }
            for (const file in files) {
                if (file === '' || (file in this.specialProperties)){
                    continue;
                }
                console.info(file, file in this.specialProperties);
                const filePath = dirPath + '/' + file;
                // 不是空就找
                const findFileOrDir1 = this.findFileOrDir(filePath);
                // 没找到就跳
                if (!findFileOrDir1){
                    continue;
                }
                // 找到了就输出
                XGlassTerminal.appendXGlassText(xGlassTerminal, parentPrefix + prefix + '┣' + file);
                // 继续迭代
                this.buildTree(findFileOrDir1[file], filePath, xGlassTerminal, parentPrefix,  prefix + parentPrefix);
            }
            XGlassTerminal.appendXGlassText(xGlassTerminal, parentPrefix + prefix);

        } catch (error) {
            XGlassTerminal.appendXGlassText(xGlassTerminal, 'Error reading directory: ' + error.message);
        }
    }
    /**
     * linux 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     */
    processCommand(xGlassTerminal, command) {
        // 从 bin 下面获取文件
        const file = this.findFileOrDir(`/bin/${command[0]}`);
        // 提取出函数对象
        if (file && file.__fun__) {
            file.__fun__(xGlassTerminal, command);
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `${command[0]}: command not found`);
        }
    }
}



/**
 * 命令处理类
 */
class XGlassLinuxCommand {

    static linuxCommand = new LinuxCommandHandler();

    static backCommand = [];
    static _history_index = 0;

    static xGlassTerminal;

    /**
     * 命令处理
     * @param commandString 需要被处理的命令
     * @return {Object} 处理结果，包含命令和参数
     */
    static commandProHandler(commandString) {
        // 使用正则表达式拆分命令字符串
        const regex = /"([^"]+)"|'([^']+)'|(\S+)/g;
        let match;
        let args = [];

        while ((match = regex.exec(commandString)) !== null) {
            args.push(match[0].replace(/^["']|["']$/g, ''));
        }

        return args;
    }

    /**
     * 使用缺省的命令处理函数 这使用的是上一次使用过的终端对象 可以省略 此函数在编译操作时会使用！
     * @param commandString
     * @return {void|*}
     * @constructor
     */
    static GetLinuxCommandHandlerConsoleLog(commandString) {
        return this.linuxCommand.echo(this.xGlassTerminal, ['echo', commandString]);
    }

    /**
     * linux 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param commandString {[string]} 命令字符串
     * @return linux 命令处理函数
     */
    static GetLinuxCommandHandler(xGlassTerminal, commandString) {
        XGlassLinuxCommand.xGlassTerminal = xGlassTerminal;
        if (commandString.length === 0) {
            return;
        }
        XGlassLinuxCommand.backCommand.push(commandString);
        XGlassLinuxCommand._history_index = XGlassLinuxCommand.backCommand.length;
        commandString = XGlassLinuxCommand.commandProHandler(commandString);
        console.info("linux handler: ", commandString);
        return this.linuxCommand.processCommand(xGlassTerminal, commandString);
    }

    /**
     * 方向向上
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param commandString {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     * @constructor
     */
    static GetLinuxCommandHandlerArrowUp(xGlassTerminal, commandString) {
        if (XGlassLinuxCommand._history_index <= 0) {
            xGlassTerminal.input.value = xGlassTerminal.getCommandPrefix();
            return;
        }
        xGlassTerminal.input.value = xGlassTerminal.getCommandPrefix() + XGlassLinuxCommand.backCommand[--XGlassLinuxCommand._history_index];
    }

    /**
     * 方向向上
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param commandString {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     * @constructor
     */
    static GetLinuxCommandHandlerArrowDown(xGlassTerminal, commandString) {
        if (XGlassLinuxCommand._history_index >= XGlassLinuxCommand.backCommand.length) {
            xGlassTerminal.input.value = xGlassTerminal.getCommandPrefix();
            return;
        }
        xGlassTerminal.input.value = xGlassTerminal.getCommandPrefix() + XGlassLinuxCommand.backCommand[XGlassLinuxCommand._history_index++];
    }

    /**
     * tab 键处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param commandString {string} 命令字符串
     * @return {function} linux 命令处理函数
     * @constructor
     */
    static GetLinuxCommandHandlerTab(xGlassTerminal, commandString) {
        if (commandString.length === 0) {
            return;
        }
        const commandStrings = XGlassLinuxCommand.commandProHandler(commandString);

        if (commandStrings.length === 1) {
            // 查看命令位是否有备选
            this.linuxCommand.grep(xGlassTerminal, ['grep', '^' + commandString, '/bin'], (r) => {
                if (r.length > 0) {
                    // 显示备选
                    xGlassTerminal.input.value = xGlassTerminal.getCommandPrefix() + r;
                }
            })
        } else if (commandStrings.length > 1) {
            // 获取到当前的命令
            let commandString1 = commandStrings[commandStrings.length - 1];
            if (commandString1.charAt(0) !== '/') {
                commandString1 = this.linuxCommand.nowPath + '/' + commandString1;
            }
            // 分割路径和文件名
            const parts = commandString1.split('/');
            let parentDir = parts.slice(0, -1).join('/') || '/';
            const fileName = parts[parts.length - 1];

            // 在父目录中找以 fileName 开头的文件或目录
            this.linuxCommand.grep(xGlassTerminal, ['grep', '^' + fileName + '.*', parentDir], (r) => {
                XGlassTerminal.appendXGlassText(xGlassTerminal, r);
                // 构建目录
                let s = "";
                for (let i = 0; i < r.length - 1; i++) {
                    s += r[i];
                }
                                // 构建命令
                let c = "";
                for (let i = 0; i < commandStrings.length - 1; i++) {
                    c += commandStrings[i] + ' ';
                }
                if (parentDir === "/") {
                    parentDir = '';
                }
                xGlassTerminal.input.value = xGlassTerminal.getCommandPrefix() + c + parentDir + '/' + r;
            });
        }
    }
}