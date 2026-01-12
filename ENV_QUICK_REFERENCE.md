# 开发环境 vs 生产环境 - 快速对比

## 🔑 核心差异对比表

| 配置项 | 开发环境 (.env.local) | 生产环境 (.env.production) |
|--------|---------------------|-------------------------|
| **文件名** | `.env.local` | `.env.production` |
| **Node环境** | `development` | `production` |
| **Creem API** | `https://test-api.creem.io` | `https://api.creem.io` ⚠️ |
| **Creem Key** | 测试Key | 生产Key |
| **Creem产品** | 测试产品ID | 生产产品ID |
| **Supabase** | 开发项目 | 生产项目 |
| **域名** | `localhost:3000` | 你的域名 |
| **启动命令** | `npm run dev` | `npm run build && npm run start` |

---

## 🚨 最关键的改变

### ❌ 当前开发环境配置
```bash
# .env.local
CREEM_API_URL=https://test-api.creem.io  # ❌ 测试环境
CREEM_API_KEY=creem_7YTkrxE2SWAWideXTQpclS
CREEM_PRODUCT_ID_BASIC=prod_dQv4gtZqqevMAMZgEEQzp
```

### ✅ 生产环境必须改成
```bash
# .env.production
CREEM_API_URL=https://api.creem.io  # ✅ 生产环境（必须改）
CREEM_API_KEY=creem_新的生产密钥  # 从Creem获取
CREEM_PRODUCT_ID_BASIC=prod_生产环境的产品ID  # 在Creem重新创建产品
```

---

## 📋 配置文件对比

### 开发环境：`.env.local`
```bash
# 当前配置（本地开发用）
OPENROUTER_API_KEY=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
NEXT_PUBLIC_SUPABASE_URL=https://rxngnvluylqrhlklwnhr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bmdudmx1eWxxcmhsa2x3bmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjQyODYsImV4cCI6MjA4MzI0MDI4Nn0.tzgj1f-MxEvHBk9_NAexmt6PgtVZSEEarYm9l1B2gj4

# ⚠️ 以下是测试配置
CREEM_API_URL=https://test-api.creem.io  # 测试API
CREEM_API_KEY=creem_7YTkrxE2SWAWideXTQpclS  # 测试Key
CREEM_PRODUCT_ID_BASIC=prod_dQv4gtZqqevMAMZgEEQzp  # 测试产品
CREEM_PRODUCT_ID_PRO=prod_Gmq1iNZvdQVj9yNO8vFlT  # 测试产品
CREEM_PRODUCT_ID_MAX=prod_3O2B2AiaKdINwNWbRjtCVZ  # 测试产品
CREEM_WEBHOOK_SECRET=whsec_fhgJbP52U9Sneh2X0gbSQ  # 测试Webhook

# NEXT_PUBLIC_APP_URL=https://imgedtor.online  # 未设置
```

### 生产环境：`.env.production`
```bash
# 需要配置以下内容

# 1. OpenRouter（可以复用开发环境的）
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxx

# 2. Supabase（建议使用新的生产项目）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx

# 3. Creem（⚠️ 必须使用生产环境）
CREEM_API_URL=https://api.creem.io  # ✅ 生产API（关键！）
CREEM_API_KEY=creem_xxxxxxxxxxxxxxxx  # 从Creem生产环境获取
CREEM_PRODUCT_ID_BASIC=prod_xxxxxxxxxxxxxxxx  # 在Creem生产环境创建
CREEM_PRODUCT_ID_PRO=prod_xxxxxxxxxxxxxxxx  # 在Creem生产环境创建
CREEM_PRODUCT_ID_MAX=prod_xxxxxxxxxxxxxxxx  # 在Creem生产环境创建
CREEM_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx  # 从Creem Webhook设置获取

# 4. 应用配置
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # 你的生产域名
```

---

## 🎯 需要重新获取的凭证

### 在生产环境需要重新创建/获取：

#### ✅ 可以复用的：
- **OpenRouter API Key**（开发和生产可以用同一个）

#### ⚠️ 需要重新配置的：

**1. Creem配置（必须全部重新配置）**
- [ ] API Key（创建Production Key）
- [ ] Product IDs（在生产环境重新创建3个产品）
- [ ] Webhook Secret（配置生产webhook）

**2. Supabase配置（推荐新建）**
- [ ] Project URL
- [ ] Anon Key
- [ ] 重新运行数据库迁移

**3. 应用配置**
- [ ] 生产域名URL

---

## 🔄 环境切换命令

### 开发环境（当前）
```bash
# 启动开发服务器
npm run dev

# 访问
open http://localhost:3000

# 加载配置
.env.local
```

### 生产环境（部署后）
```bash
# 本地测试生产构建
npm run build
npm run start

# 访问
open http://localhost:3000

# 加载配置
.env.production
```

### Vercel部署
```bash
# 部署到生产环境
vercel --prod

# 或者在Vercel Dashboard配置环境变量后自动加载
```

---

## 📝 快速设置步骤

### 步骤1：获取生产环境凭证

```bash
# 1. OpenRouter（可复用）
# 当前key：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

# 2. Supabase - 创建生产项目或使用现有项目
# 访问：https://supabase.com/dashboard
# 获取：URL 和 anon key

# 3. Creem - ⚠️ 最关键
# 访问：https://dashboard.creem.io/
# 获取：
#   - Production API Key
#   - 生产环境的3个Product IDs
#   - Webhook Secret
```

### 步骤2：创建配置文件

```bash
# 在项目根目录
cp .env.production.template .env.production

# 编辑文件
nano .env.production  # 或用你喜欢的编辑器

# 填入所有凭证（参考模板中的注释）
```

### 步骤3：本地测试

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 测试
# 1. 访问 http://localhost:3000
# 2. 登录Google
# 3. 检查credits显示
# 4. 访问/pricing
# 5. 点击Get Started，确认跳转到 api.creem.io（不是test-api）
```

### 步骤4：部署到生产环境

**Vercel方式（推荐）：**
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod

# 或者：在Vercel Dashboard中配置环境变量
```

---

## ✅ 验证清单

部署前必须确认：

```bash
# 1. 检查Creem API URL（最关键）
grep CREEM_API_URL .env.production
# 应该输出：CREEM_API_URL=https://api.creem.io

# 2. 检查Supabase URL
grep NEXT_PUBLIC_SUPABASE_URL .env.production
# 应该是你的生产项目URL

# 3. 检查App URL
grep NEXT_PUBLIC_APP_URL .env.production
# 应该是你的生产域名

# 4. 本地测试
npm run build && npm run start
# 访问 http://localhost:3000 测试所有功能
```

---

## 🚨 常见错误

### 错误1：支付后显示 "Live payments not enabled"
```bash
# 原因：CREEM_API_URL 错误
# 错误：CREEM_API_URL=https://test-api.creem.io
# 正确：CREEM_API_URL=https://api.creem.io
```

### 错误2：Product ID找不到
```bash
# 原因：使用的是测试环境的Product ID
# 解决：在Creem生产环境重新创建产品
# 1. 登录 https://dashboard.creem.io/
# 2. Products → Create Product
# 3. 创建Basic, Pro, Max三个产品
# 4. 复制新的Product IDs到配置文件
```

### 错误3：Webhook未触发
```bash
# 原因：Webhook URL配置错误或无法访问
# 解决：
# 1. 确认URL是：https://你的域名.com/api/payment/webhook
# 2. 不能是localhost
# 3. 确认服务器防火墙允许外网访问
```

---

## 📚 相关文档

- [完整配置指南](./PRODUCTION_SETUP_GUIDE.md) - 详细的步骤说明
- [配置检查清单](./PRODUCTION_CONFIG_CHECKLIST.md) - 逐项检查清单
- [部署检查清单](./PRODUCTION_CHECKLIST.md) - 部署前验证
- [Credits系统](./CREDITS_SYSTEM.md) - Credits功能说明

---

## 💡 提示

1. **保存好你的凭证**
   - 建议使用密码管理器保存所有API密钥
   - 不要在代码中硬编码任何密钥

2. **测试很重要**
   - 在生产环境部署前，务必先本地测试
   - 用小额真实支付测试完整流程

3. **备份配置**
   - 保存 `.env.production` 的副本在安全的地方
   - 记录所有Product IDs和API Keys的来源

4. **监控**
   - 部署后设置监控和告警
   - 定期检查日志和错误

---

**准备就绪后，按照 [PRODUCTION_SETUP_GUIDE.md](./PRODUCTION_SETUP_GUIDE.md) 逐步操作即可！**
