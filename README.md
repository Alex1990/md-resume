# md-resume
[Chinese] 简历生成：Markdown -> HTML

## 安装

**NPM:**

```bash
npm install md-resume
```

## 使用

### 目录结构

- **source：**Markdown格式书写的简历
- **theme：**主题目录，默认提供 default，采用 lodash 的`template`来渲染模板文件
- **public：**HTML简历文件目录

### 生成命令

采用 npm scripts 来生成：

- `npm run generate` - 生成 HTML 简历文件到`public/`目录中，根据 Markdown 简历文件的`theme`配置选择主题，选择的主题会被复制到`public/`目录下，某个主题目录下的所有文件夹（css、js等）都会被复制。
- `npm run watch` - 监听`source/`与`theme/`目录下的文件变动，然后执行`npm run generate`命令。
- `npm run start`/`npm start` - 启动一个静态服务器，以`public/`目录作为根目录，默认端口`8080`。并且，还会执行`npm run watch`命令。

## 待办事项

*不保证完成*

- 打印样式，包括分页控制
- 生成 PDF
- 数据与结构分离？Markdown 会混合结构与内容，导致布局等难以控制，采用 YAML 格式存储配置与数据或许更好（个人认为 JSON 格式作为配置文件劣于 YAML）

## 软件许可

MIT
