# 🔧 Resume Optimizer - 修复指南

## ❌ 问题：Error: Unexpected token '<', "<!DOCTYPE "... is not valid JSON

这个错误意味着 Netlify Function 没有正确工作。

## ✅ 解决方案：重新部署修复版本

### 步骤 1：删除旧仓库中的文件

1. 去你的 GitHub 仓库：https://github.com/Limmy-Guo/Resume-Optimizer
2. 删除所有文件（或者创建一个新的仓库）

### 步骤 2：上传新的文件

使用这个修复版本的文件：
- ✅ `index.html`
- ✅ `package.json` （更新了依赖）
- ✅ `netlify.toml` （添加了 functions 配置）
- ✅ `netlify/functions/optimize-resume.js` （使用 Anthropic SDK）

### 步骤 3：在 Netlify 中检查设置

1. 去 Netlify Dashboard
2. 点击你的网站
3. 点击 **"Project configuration"**
4. 点击 **"Build & deploy"**
5. 检查 **Functions directory**: 应该是 `netlify/functions`

### 步骤 4：确认环境变量

1. 在 **Project configuration** → **Environment variables**
2. 确认有 `ANTHROPIC_API_KEY` 变量
3. 值是你的有效 API key（sk-ant-api03-...）
4. Scopes 选择了 **Production** 或 **All**

### 步骤 5：清除缓存并重新部署

1. 去 **Deploys** 页面
2. 点击 **Deploy settings** 按钮
3. 向下滚动找到 **"Clear cache and retry deploy"**
4. 或者直接点击 **"Trigger deploy"** → **"Clear cache and deploy site"**

## 🔍 如何验证 Function 是否正确部署

### 方法 1：查看 Functions 日志

1. 在 Netlify，进入你的网站
2. 左侧菜单点击 **"Functions"** （如果有的话）
3. 应该能看到 `optimize-resume` function
4. 点击查看日志

### 方法 2：测试 Function URL

访问：`https://resume-optimizer-limmy.netlify.app/.netlify/functions/optimize-resume`

如果返回：
- ✅ `{"error":"Method not allowed"}` → Function 正常工作
- ❌ HTML 页面或 404 → Function 没有部署

## 🆘 如果还是不行

### 选项 A：使用 Netlify CLI 本地测试

```bash
# 安装依赖
npm install

# 安装 Netlify CLI
npm install -g netlify-cli

# 本地测试
netlify dev

# 访问 http://localhost:8888 测试
```

### 选项 B：查看构建日志

1. 在 Netlify **Deploys** 页面
2. 点击最新的部署
3. 查看 **"Deploy log"**
4. 搜索 "functions" 或 "error"
5. 截图发给我

### 选项 C：确认文件结构

你的 GitHub 仓库应该是这样的：

```
Resume-Optimizer/
├── index.html
├── package.json
├── netlify.toml
└── netlify/
    └── functions/
        └── optimize-resume.js
```

**注意**：不是 `functions/optimize-resume.js`，而是 `netlify/functions/optimize-resume.js`

## 📋 检查清单

- [ ] GitHub 仓库中有 `netlify/functions/optimize-resume.js`
- [ ] `package.json` 包含 `@anthropic-ai/sdk` 依赖
- [ ] `netlify.toml` 中 functions 路径是 `netlify/functions`
- [ ] Netlify 环境变量中有 `ANTHROPIC_API_KEY`
- [ ] API key 是有效的（去 console.anthropic.com 确认）
- [ ] 清除缓存并重新部署

## 💡 快速测试命令

在浏览器控制台（F12）运行：

```javascript
fetch('/.netlify/functions/optimize-resume', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    jobDescription: 'test',
    currentResume: 'test'
  })
}).then(r => r.json()).then(console.log).catch(console.error)
```

如果返回：
- ✅ `{error: "API key not configured"}` → Function 工作，但 API key 没设置
- ✅ `{improvedResume: "..."}` → 完全正常！
- ❌ SyntaxError → Function 没工作

## 🎯 最后的办法

如果以上都不行，可以：
1. 创建一个全新的 Netlify 站点
2. 用修复版本的文件重新部署
3. 或者告诉我具体的错误信息，我帮你调试
