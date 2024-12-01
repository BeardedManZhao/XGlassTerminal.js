/**
 * file XGlassTerminal.js
 * 终端类对象
 */
class XGlassTerminal {

  /**
   * 构造一个终端对象
   * @param element {HTMLElement} 用于存储终端的元素
   * @param commandPrefix {string} 命令前缀
   */
  constructor(element, commandPrefix) {
    this.element = element;
    this.commandPrefix = commandPrefix;
    // 实例化输入框
    this.input = document.createElement("input");
    this.input.className = "XGlassTerminal_input";
    this.input.type = "text";
    this.input.placeholder = '请输入命令';
    this.input.value = commandPrefix
    this.input.addEventListener('input', function() {
      if (this.value.length < commandPrefix.length) {
        this.value = commandPrefix;
      }
    });
    // 实例化输入框的 label
    this.inputLabel = document.createElement("label");
    this.inputLabel.setAttribute("for", "XGlassTerminal_input");
    this.inputLabel.id = "XGlassTerminal_input_label";
    this.inputLabel.appendChild(this.input);

    // pre
    this.XGlassTerminalPre = document.createElement("pre");

    // 实例化终端容器
    this.xGlassTerminal = document.createElement("div");
    this.xGlassTerminal.className = "XGlassTerminal";
    this.xGlassTerminal.appendChild(this.XGlassTerminalPre);
    this.xGlassTerminal.appendChild(this.inputLabel);
    this.xGlassTerminal.addEventListener("click",  () => {
      this.input.focus()
    })

    // 终端加入容器
    this.element.appendChild(this.xGlassTerminal);

  }

  /**
   * 添加文本
   * @param xGlassTerminal {XGlassTerminal} 终端对象
   * @param text {string} 添加的文本
   * @param fun {function} 用于处理添加的文本的函数
   */
  static appendXGlassText(xGlassTerminal, text, fun = undefined){
    xGlassTerminal.XGlassTerminalPre.appendChild(document.createTextNode(text + '\n'));
    if (text.startsWith(xGlassTerminal.commandPrefix)){
      text = text.substring(xGlassTerminal.commandPrefix.length);
    }
    if (fun){
      fun(text);
    }
  }

  /**
   * 初始化事件
   * @param commandSubmitFun {function} 命令提交函数
   */
  initEvent(commandSubmitFun){
    const xGlassTerminal = this;
    const inputLabel = xGlassTerminal.inputLabel;
    const commandPrefix = xGlassTerminal.commandPrefix;

    xGlassTerminal.xGlassTerminal.addEventListener("click", function () {
      inputLabel.click();
    })

    // 准备函数
    xGlassTerminal.input.addEventListener('keydown', function(event) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        if (this.selectionStart === 0 && this.selectionEnd === 1) {
          // 如果用户尝试删除第一个字符
          event.preventDefault();
        }
      } else if (event.key === 'Enter'){
        const value = this.value;
        XGlassTerminal.appendXGlassText(xGlassTerminal, value, commandSubmitFun);
        this.value = commandPrefix;
      }
    });
  }
}
