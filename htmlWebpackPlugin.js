const path = require('path')
const fs = require('fs')
const htmlMinifier = require('html-minifier').minify
// js类
class HtmlWebpackPlugin {
  // 这里接受options选项作为参数
  constructor(options) {
    this.options = options; // 参数包含标题/文件名
  }
  // 注册插件
  // 在插件函数的 prototype 上定义一个 `apply` 方法，以 compiler 为参数。
  apply(compiler) {
    // 指定一个挂载到 webpack 自身的事件钩子。
    compiler.hooks.emit.tapAsync(
      // 钩子名
      'SimpleHtmlWebpackPlugin',
      // 钩子函数
      (compilation, callback) => {
        // 调用generateHtml方法生成html内容
        // 传入compilation对象作为参数
        const html = this.generateHtml(compilation);
        // 生成html文件输出路径
        compilation.assets[this.options.filename || 'index.html'] = {
          source: () => html, // 返回html内容
          size: () => html.length // 返回html长度
        };
        // 使用tapAsync方法绑定插件，必须调用callback指定回调函数
        // 表示处理完成
        callback();
      });
  }

  generateHtml(compilation) {
    let html
    // template：用于文件系统读取模板文件/templateContent：直接从参数值中提供HTML模板内容
    // 这里用文件中template模板
    if (this.options.templateContent) {
      html = this.options.templateContent;
    } else if (this.options.template) {
      const templatePath = path.resolve(this.options.template);
      html = fs.readFileSync(templatePath, 'utf-8');
    } else {
      html = this.defaultTemplate();
    }
    // title
    if (this.options.title) {
      html = html.replace('<title>', `<title>${this.options.title}`)
    }
    const assets = Object.keys(compilation.assets); // 输出所有文件名称
    const scripts = assets.map(asset => `<script src="${asset}"></script>`).join('\n');
    // inject
    if (this.options.inject === 'body') {
      html = html.replace('</body>', `</body>\n${scripts}`)
    } else if (this.options.inject === 'head') {
      html = html.replace('</head>', `${scripts}\n</head>`)
    }
    // meta
    if (this.options.meta) {
      const metaTag = Object.entries(this.options.meta)
        .map(([name, content]) => `<meta name="${name}" content="${content}">`).join('\n')
      html = html.replace('<head>', `<head>\n${metaTag}`)
    }
    // minify
    if (this.options.minify) {
      html = htmlMinifier(html, this.options.minify)
    }
    return html
  }
}
module.exports = HtmlWebpackPlugin;



