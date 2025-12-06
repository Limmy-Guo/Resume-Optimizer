# Resume Optimizer - Vercel 部署（超简单版）

## 🚀 5分钟部署步骤：

### 1. 上传到 GitHub
1. 创建新仓库或清空现有的 Resume-Optimizer 仓库
2. 上传这3个文件：
   - `index.html`
   - `vercel.json`
   - `api/optimize-resume.js`（注意文件夹结构）

### 2. 部署到 Vercel
1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 点击 "Add New" → "Project"
4. 选择你的 Resume-Optimizer 仓库
5. 点击 "Deploy"（不需要任何配置）

### 3. 添加环境变量
1. 部署完成后，点击 "Settings"
2. 点击 "Environment Variables"
3. 添加：
   - Name: `ANTHROPIC_API_KEY`
   - Value: 你的 API key
   - Environment: Production (勾选)
4. 点击 "Save"

### 4. 重新部署
1. 回到 "Deployments" 标签
2. 点击最新的部署右边的 "..." 按钮
3. 点击 "Redeploy"

### 5. 完成！
访问你的网站 URL（类似 `your-app.vercel.app`）

---

## ✅ 为什么 Vercel 更简单：

- ✅ 自动识别 API 文件夹
- ✅ 不需要复杂配置
- ✅ 更好的错误提示
- ✅ 部署更快更稳定

---

## 📁 文件结构：

```
resume-vercel/
├── index.html
├── vercel.json
└── api/
    └── optimize-resume.js
```

就这么简单！
