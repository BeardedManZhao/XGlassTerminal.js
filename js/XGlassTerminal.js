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
                    fun: this.ls
                },
                pwd: {
                    fun: this.pwd
                },
                cd: {
                    fun: this.cd
                },
                mkdir: {
                    fun: this.mkdir
                },
                rm: {
                    fun: this.rm
                },
                touch: {
                    fun: this.touch
                },
                cat: {
                    fun: this.cat
                },
                mv: {
                    fun: this.mv
                },
                cp: {
                    fun: this.cp
                },
                echo: {
                    fun: this.echo
                },
                time: {
                    fun: this.time
                },
                curl: {
                    fun: this.curl
                },
                help: {
                    fun: this.help
                },
                welcome: {
                    fun: this.welcome
                },
                writer: {
                    fun: this.writer
                },
                grep: {
                    fun: this.grep
                }
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
                resolv_conf: {}
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
    }

    /**
     * 查找文件或目录
     * @param path {string} 路径
     * @return {Object|null} 找到的文件或目录对象，未找到则返回 null
     */
    findFileOrDir(path) {
        const b = path.charAt(0) === '.';
        if (b || path.charAt(0) !== '/') {
            path = (this.nowPath + (b ? path.substring(1, path.length) : path)).replaceAll('//', '/');
        }
        if (path === '/') {
            return this.linuxDirectory['/'];
        }
        if (path.charAt(0) === '/') {
            path = path.substring(1, path.length);
        }
        console.info("find:", path);
        let parts = path.split('/');
        let current = this.linuxDirectory['/'];

        for (let part of parts) {
            if (!current[part]) {
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
        const parentPath = path.substring(0, path.lastIndexOf('/'));
        // 获取到当前路径的名称
        const itemName = path.substring(path.lastIndexOf('/') + 1);
        const parent = this.findFileOrDir(parentPath);
        if (parent) {
            parent[itemName] = item;
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `Error: Cannot add ${itemName} to ${parentPath}.`);
        }
    }

    help = (xGlassTerminal) => {
        XGlassTerminal.appendXGlassText(xGlassTerminal, 'Available commands list');
        XGlassTerminal.appendXGlassText(xGlassTerminal, '+==============================+');
        this.processCommand(xGlassTerminal, ['ls', '/bin']);
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
     * @return {function} linux 命令处理函数
     */
    grep = (xGlassTerminal, command) => {
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
        XGlassTerminal.appendXGlassText(xGlassTerminal, `grep: ${filePath} match: ${pattern}`);
        XGlassTerminal.appendXGlassText(xGlassTerminal, `+=================================+`);
        // 使用正则表达式匹配文件名字
        for (const line in files) {
            if (pattern.test(line)) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, line);
            }
        }
    };

    /**
     * linux ls 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */
    ls = (xGlassTerminal, command) => {

        // 获取命令参数
        const args = command || [];

        // 默认列出当前目录
        let path = '.';
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

    /**
     * linux cd 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     */
    cd = (xGlassTerminal, command) => {
        if (command.length > 1) {
            const path = command[1];
            const targetDir = this.findFileOrDir(path);

            if (!targetDir) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `cd: no such file or directory: ${path}`);
                return;
            }

            // 检查是否是目录
            if (typeof targetDir !== 'object' || Array.isArray(targetDir)) {
                XGlassTerminal.appendXGlassText(xGlassTerminal, `cd: not a directory: ${path}`);
            }
            this.nowPath = path;
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
                fun: (xGlassTerminal, command) => {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, command[0] + " is a file!");
                }
            });
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

            this.addFileOrDir(xGlassTerminal, path, {
                text: command.length > 2 ? command[2] : "",
                fun: (xGlassTerminal, command) => {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, command[0] + " is a file!");
                }
            });
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, "Usage: writer <file> <text>");
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
            XGlassTerminal.appendXGlassText(xGlassTerminal, targetDir.text);
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
            // 首先查是否是 >>
            if (command[2] && command[2] === '>>') {
                // 查看是否有目录
                if (command[3]) {
                    this.writer(xGlassTerminal, ["writer", command[3], command[1]]);
                } else {
                    XGlassTerminal.appendXGlassText(xGlassTerminal, "Usage: echo <text> >> <file>");
                }
            } else {
                const text = command.slice(1).join(' ');
                XGlassTerminal.appendXGlassText(xGlassTerminal, text);
            }
        }
    };

    /**
     * linux 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param command {[string]} 命令字符串
     */
    processCommand(xGlassTerminal, command) {
        // 从 bin 下面获取文件
        const file = this.findFileOrDir(`/bin/${command[0]}`);
        // 提取出函数对象
        if (file && file.fun) {
            file.fun(xGlassTerminal, command);
        } else {
            XGlassTerminal.appendXGlassText(xGlassTerminal, `${command[0]}: command not found`);
        }
    };
}

/**
 * 命令处理类
 */
class Command {

    static linuxCommand = new LinuxCommandHandler();

    static backCommand = '';

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
     * linux 命令处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param commandString {[string]} 命令字符串
     * @return linux 命令处理函数
     */
    static GetLinuxCommandHandler(xGlassTerminal, commandString) {
        Command.backCommand = commandString;
        commandString = Command.commandProHandler(commandString);
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
        xGlassTerminal.input.value = xGlassTerminal.getCommandPrefix() + Command.backCommand;
    }

    /**
     * tab 键处理
     * @param xGlassTerminal {XGlassTerminal} 终端对象
     * @param commandString {[string]} 命令字符串
     * @return {function} linux 命令处理函数
     * @constructor
     */
    static GetLinuxCommandHandlerTab(xGlassTerminal, commandString) {
        if (commandString.length === 0) {
            return;
        }
        commandString = Command.commandProHandler(commandString);
        if (commandString.length === 1) {
            // 查看命令位是否有备选
            this.linuxCommand.grep(xGlassTerminal, ['grep', '^' + commandString, '/bin'])
        }
    }
}


