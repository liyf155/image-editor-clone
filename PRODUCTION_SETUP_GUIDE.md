# 生产环境配置完整指南

本文档将一步步指导你获取所有生产环境所需的凭证。

---

## 📋 配置清单

在开始之前，确保你有以下账号：
- [ ] OpenRouter 账号
- [ ] Supabase 账号（生产项目）
- [ ] Creem 账号（生产环境）
- [ ] 域名（可选，如果使用Vercel可以暂时用vercel.app）

---

## 1️⃣ OpenRouter API Key

### 步骤：

1. **登录 OpenRouter**
   - 访问：https://openrouter.ai/
   - 登录你的账号

2. **获取 API Key**
   - 点击右上角头像 → Settings
   - 找到 "API Keys" 部分
   - 复制你的 API Key（格式：`sk-or-v1-...`）

3. **填入配置文件**
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-你复制的key
   ```

### 验证：
```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer 你的key"
```

---

## 2️⃣ Supabase 配置（生产环境）

### 🚨 重要决策：是否创建新的Supabase项目？

**选项A：使用现有项目（如果你已经有Supabase项目）**
- 优点：数据已存在
- 缺点：可能有开发数据混杂

**选项B：创建新的生产项目（推荐）**
- 优点：干净的环境，独立的数据
- 缺点：需要重新运行数据库迁移

### 步骤（使用现有项目）：

1. **登录 Supabase**
   - 访问：https://supabase.com/dashboard
   - 选择你的项目

2. **获取 API 凭证**
   - 左侧菜单 → Settings → API
   - 找到 "Project API Keys" 部分

3. **复制以下信息**：

   **a) Project URL**
   ```
   格式：https://xxxxxxxxxxxxxxxxxx.supabase.co
   复制到：NEXT_PUBLIC_SUPABASE_URL
   ```

   **b) anon/public key**
   ```
   格式：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   复制到：NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

4. **运行数据库迁移**
   - 左侧菜单 → SQL Editor
   - 点击 "New Query"
   - 复制并运行以下文件的内容：
     ```
     supabase/migrations/20240111000002_add_credits_system.sql
     ```
   - 点击 "Run" 执行
   - 确认看到 "Success" 消息

5. **验证表创建**
   ```sql
   -- 检查表是否存在
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('user_credits', 'credit_transactions', 'subscriptions', 'checkout_mappings');

   -- 应该看到4个表
   ```

### 步骤（创建新项目）：

1. **创建新项目**
   - 访问：https://supabase.com/dashboard
   - 点击 "New Project"
   - 填写项目信息：
     - Name: `nano-banana-prod`
     - Database Password: (保存好这个密码)
     - Region: 选择离用户最近的区域
   - 点击 "Create new project"
   - 等待2-3分钟创建完成

2. **获取 API 凭证**
   - 步骤同上（使用现有项目的步骤2-5）

---

## 3️⃣ Creem 配置（生产环境）⚠️ 最关键

### 🚨 重要提醒：
**生产环境和测试环境是分开的！你需要：**
- 在生产环境创建新产品
- 获取新的Product IDs
- 使用正式API Key（不是test key）

### 步骤：

1. **登录 Creem 生产环境**
   - 访问：https://dashboard.creem.io/
   - 使用你的正式账号登录（不是test账号）

2. **获取 API Key**

   a) 进入 Developers → API Keys
   b) 点击 "Create API Key"
   c) 选择：**Production**（不是 Test）
   d) 复制 API Key（格式：`creem_...`）

   ```bash
   CREEM_API_KEY=creem_你复制的key
   CREEM_API_URL=https://api.creem.io  # 固定这个，不要改！
   ```

3. **创建产品（Products）**

   你需要创建3个产品：

   **a) Basic 产品**
   - 进入 Products → Create Product
   - 填写信息：
     ```
     Name: Basic
     Description: Perfect for individuals and light users
     Price: $12/month
     ```
   - 创建后复制 Product ID
   ```bash
   CREEM_PRODUCT_ID_BASIC=prod_xxxxx
   ```

   **b) Pro 产品**
   - 再次点击 "Create Product"
   - 填写信息：
     ```
     Name: Pro
     Description: For professional creators and teams
     Price: $19.5/month
     ```
   - 复制 Product ID
   ```bash
   CREEM_PRODUCT_ID_PRO=prod_xxxxx
   ```

   **c) Max 产品**
   - 再次点击 "Create Product"
   - 填写信息：
     ```
     Name: Max
     Description: Designed for large enterprises
     Price: $80/month
     ```
   - 复制 Product ID
   ```bash
   CREEM_PRODUCT_ID_MAX=prod_xxxxx
   ```

4. **配置 Webhook**

   a) 进入 Developers → Webhooks
   b) 点击 "Add Webhook"
   c) 填写信息：
      ```
      Webhook URL: https://你的域名.com/api/payment/webhook
      Events: 勾选所有支付相关事件
      ```
   d) 创建后复制 Webhook Secret
   ```bash
   CREEM_WEBHOOK_SECRET=whsec_xxxxx
   ```

   **临时域名（测试用）：**
   - 如果用Vercel：`https://你的项目.vercel.app/api/payment/webhook`
   - 如果用其他：先部署后再配置webhook

5. **验证配置**
   - 检查 API Key 是否是 Production 类型
   - 确认 `CREEM_API_URL=https://api.creem.io`（不是test-api）
   - 确认Product IDs已复制

---

## 4️⃣ 应用域名配置

### 如果有自定义域名：

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 如果使用Vercel临时域名：

```bash
NEXT_PUBLIC_APP_URL=https://nano-banana.vercel.app
# 替换为你的实际Vercel项目名
```

### 如果本地测试：

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5️⃣ 创建 .env.production 文件

现在你已经收集了所有凭证，创建配置文件：

```bash
# 在项目根目录执行
cp .env.production.template .env.production
```

然后填入你复制的所有值：

```bash
# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-你的key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key

# Creem - ⚠️ 注意URL是api.creem.io不是test-api
CREEM_API_URL=https://api.creem.io
CREEM_API_KEY=creem_你的生产key
CREEM_PRODUCT_ID_BASIC=prod_你的basic产品id
CREEM_PRODUCT_ID_PRO=prod_你的pro产品id
CREEM_PRODUCT_ID_MAX=prod_你的max产品id
CREEM_WEBHOOK_SECRET=whsec_你的webhook_secret

# App
NEXT_PUBLIC_APP_URL=https://你的域名.com
```

---

## 6️⃣ 验证配置

### 本地测试生产配置：

```bash
# 1. 构建生产版本
npm run build

# 2. 启动生产服务器
npm run start

# 3. 访问 http://localhost:3000
# 4. 检查：
#    - 页面是否正常加载
#    - 能否登录Google
#    - 能否访问 /pricing 页面
#    - 点击 Get Started 是否跳转到Creem生产环境
```

### 检查API调用：

打开浏览器控制台（F12），检查：
```javascript
// 应该看到生产环境的URL
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// 应该是 https://xxxxx.supabase.co

// 确认不是test-api
// 网络请求中不应该看到 test-api.creem.io
```

---

## 7️⃣ Vercel 环境变量配置（推荐方式）

如果你使用Vercel部署，有两种方式配置：

### 方式A：通过 Vercel Dashboard（推荐）

1. **登录 Vercel**
   - 访问：https://vercel.com/dashboard
   - 选择你的项目

2. **进入 Settings**
   - 顶部菜单 → Settings
   - 左侧菜单 → Environment Variables

3. **添加环境变量**
   逐个添加以下变量（点击 "Add New"）：

   ```
   Name: OPENROUTER_API_KEY
   Value: sk-or-v1-你的key
   Environment: Production, Preview (全选)

   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://你的项目.supabase.co
   Environment: Production, Preview

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: 你的anon_key
   Environment: Production, Preview

   Name: CREEM_API_URL
   Value: https://api.creem.io
   Environment: Production, Preview

   Name: CREEM_API_KEY
   Value: creem_你的生产key
   Environment: Production, Preview

   Name: CREEM_PRODUCT_ID_BASIC
   Value: prod_你的basic_id
   Environment: Production, Preview

   Name: CREEM_PRODUCT_ID_PRO
   Value: prod_你的pro_id
   Environment: Production, Preview

   Name: CREEM_PRODUCT_ID_MAX
   Value: prod_你的max_id
   Environment: Production, Preview

   Name: CREEM_WEBHOOK_SECRET
   Value: whsec_你的secret
   Environment: Production, Preview

   Name: NEXT_PUBLIC_APP_URL
   Value: https://你的域名.vercel.app
   Environment: Production, Preview
   ```

4. **保存并重新部署**
   - 添加完所有变量后
   - 进入 "Deployments"
   - 点击最新的部署右侧的 "..." → "Redeploy"

### 方式B：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 添加环境变量
vercel env add OPENROUTER_API_KEY production
# 粘贴你的key

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 粘贴你的URL

# ... 重复添加其他变量

# 部署
vercel --prod
```

---

## 8️⃣ 部署后的最终验证

### 1. 检查环境变量是否加载

在Vercel部署日志中应该看到：
```bash
# 构建日志中应该显示
Loaded env from /vercel/path/.env.production
```

### 2. 测试支付流程

1. 访问 `https://你的域名.com/pricing`
2. 点击任意 "Get Started" 按钮
3. 检查URL是否跳转到：
   ```
   https://api.creem.io/checkout/...
   ```
   ✅ 正确（生产环境）

   ❌ 错误（如果是test-api.creem.io说明配置错误）

### 3. 完成一笔小额测试

1. 用测试卡完成支付
2. 检查：
   - [ ] Webhook是否被触发
   - [ ] Supabase `subscriptions` 表是否有记录
   - [ ] Supabase `user_credits` 表余额是否增加
   - [ ] Supabase `credit_transactions` 表是否有交易记录

### 4. 测试图片生成

1. 登录账号
2. 检查是否显示4个免费credits
3. 生成一张图片
4. 验证credits减少到2

---

## 🔒 安全检查清单

部署前确认：

- [ ] `.env.production` 已加入 `.gitignore`
- [ ] `.env.local` 已加入 `.gitignore`
- [ ] 所有API密钥都没有硬编码在代码中
- [ ] Creem使用的是 `https://api.creem.io`（不是test-api）
- [ ] Supabase RLS策略已启用
- [ ] Webhook Secret已配置

---

## 📞 遇到问题？

### 常见错误：

**错误1：支付后没收到webhook**
```
解决：检查webhook URL是否可以从外网访问
```

**错误2：显示 "Live payments not enabled"**
```
解决：CREEM_API_URL 应该是 https://api.creem.io
      不是 https://test-api.creem.io
```

**错误3：Credits没有添加**
```
解决：
1. 检查数据库迁移是否运行
2. 查看Vercel函数日志
3. 检查webhook是否被触发
```

**错误4：Supabase连接失败**
```
解决：
1. 确认NEXT_PUBLIC_SUPABASE_URL正确
2. 检查Supabase项目是否暂停
3. 确认anon key正确
```

---

## 📚 相关文档

- [Credits系统说明](./CREDITS_SYSTEM.md)
- [部署清单](./PRODUCTION_CHECKLIST.md)
- [Creem文档](https://docs.creem.io/)
- [Supabase文档](https://supabase.com/docs)
- [Vercel文档](https://vercel.com/docs)

---

## ✅ 完成检查

当你完成以上所有步骤后，你应该有：

- [ ] `.env.production` 文件（所有值已填入）
- [ ] 或 Vercel Dashboard 中的环境变量已配置
- [ ] Supabase生产项目，已运行所有迁移
- [ ] Creem生产环境的3个产品和API Key
- [ ] Webhook已配置并指向你的域名
- [ ] 本地测试通过（`npm run build && npm run start`）
- [ ] 部署到生产环境
- [ ] 完成端到端测试（注册、支付、生成图片）

🎉 恭喜，你的应用已准备好上线！
