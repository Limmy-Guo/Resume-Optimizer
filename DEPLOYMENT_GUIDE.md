# Resume Optimizer - Netlify 部署指南 🚀

## 📦 准备工作

### 1. 获取 Anthropic API Key
1. 访问 https://console.anthropic.com/settings/keys
2. 登录或注册账户
3. 点击 "Create Key" 创建新的 API key
4. **复制并保存好你的 API key**（格式：sk-ant-api03-...）

## 🌐 方法一：通过 Netlify 网站部署（推荐）

### 步骤 1：上传到 GitHub

1. 去 https://github.com/new 创建新仓库
2. 仓库名称：`resume-optimizer`
3. 设置为 Public 或 Private
4. 点击 "Create repository"

5. 上传文件到 GitHub：
   - 点击 "uploading an existing file"
   - 拖拽整个 `resume-app-netlify` 文件夹中的所有文件
   - 点击 "Commit changes"

### 步骤 2：连接到 Netlify

1. 去 https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 选择 "Deploy with GitHub"
4. 授权 Netlify 访问你的 GitHub
5. 选择 `resume-optimizer` 仓库
6. 构建设置（Netlify 会自动检测）：
   - Build command: （留空）
   - Publish directory: `.`
7. 点击 "Deploy site"

### 步骤 3：添加环境变量（最重要！）

1. 在 Netlify 网站，进入你的站点
2. 点击 "Site configuration" → "Environment variables"
3. 点击 "Add a variable" → "Add a single variable"
4. 添加：
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: 你的 API key（sk-ant-api03-...）
5. 点击 "Create variable"

### 步骤 4：重新部署

1. 回到 "Deploys" 标签
2. 点击 "Trigger deploy" → "Deploy site"
3. 等待部署完成（大约 1-2 分钟）
4. 点击你的网站 URL 测试！

## 🖥️ 方法二：使用 Netlify CLI（命令行）

### 安装 Netlify CLI
```bash
npm install -g netlify-cli
```

### 部署步骤
```bash
# 进入项目文件夹
cd resume-app-netlify

# 登录 Netlify
netlify login

# 初始化站点
netlify init

# 设置环境变量
netlify env:set ANTHROPIC_API_KEY "你的API_key"

# 部署
netlify deploy --prod
```

## 🎨 自定义域名（可选）

1. 在 Netlify 网站，进入 "Site configuration" → "Domain management"
2. 点击 "Add custom domain"
3. 输入你的域名（例如：resume.yourdomain.com）
4. 按照提示配置 DNS 设置

## ✅ 测试你的网站

部署完成后，访问你的 Netlify URL（例如：`your-site-name.netlify.app`）

测试步骤：
1. 粘贴一个职位描述
2. 粘贴你的简历
3. 点击 "Optimize Resume"
4. 等待 10-30 秒
5. 查看优化后的简历！

## 🐛 故障排查

### 问题 1: "API key not configured"
- 确保你在 Netlify 中添加了环境变量 `ANTHROPIC_API_KEY`
- 环境变量名称必须完全一致（区分大小写）
- 添加环境变量后需要重新部署

### 问题 2: "Failed to optimize resume"
- 检查 API key 是否有效
- 去 Anthropic 控制台检查 API 使用额度
- 查看 Netlify Functions 日志（在 "Functions" 标签）

### 问题 3: 404 错误
- 确保 `netlify.toml` 文件在根目录
- 确保文件结构正确

### 问题 4: Function 超时
- Netlify 免费版 Functions 有 10 秒超时限制
- 考虑升级到付费版本（26 秒超时）
- 或者使用 Background Functions

## 📁 项目文件结构

```
resume-app-netlify/
├── index.html              # 前端页面
├── netlify.toml            # Netlify 配置
├── package.json            # 依赖配置
└── netlify/
    └── functions/
        └── optimize-resume.js  # Serverless Function
```

## 💰 费用说明

### Netlify 免费套餐包括：
- ✅ 100 GB 带宽/月
- ✅ 300 分钟构建时间/月
- ✅ 125,000 Function 调用/月
- ✅ 自动 SSL 证书
- ✅ 自定义域名

### Anthropic API 费用：
- Claude Sonnet 4: ~$3 per million input tokens
- 每次优化大约使用 3000-5000 tokens
- 估算：1000 次优化 ≈ $12-20

## 🔒 安全建议

1. ✅ 永远不要在代码中硬编码 API key
2. ✅ 使用环境变量存储敏感信息
3. ✅ 定期轮换 API key
4. ✅ 监控 API 使用情况
5. ✅ 考虑添加访问限制（如果公开）

## 📞 需要帮助？

- Netlify 文档: https://docs.netlify.com
- Anthropic 文档: https://docs.anthropic.com
- Netlify 社区: https://answers.netlify.com

## 🎉 完成！

现在你的 Resume Optimizer 已经在线了！分享你的网站链接给朋友们使用吧！

你的网站 URL 格式：
`https://your-site-name.netlify.app`

可以在 Netlify 控制台的 "Site configuration" 中找到并自定义。
