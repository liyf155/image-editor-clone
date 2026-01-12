# 生产环境配置检查清单

使用此清单确保所有生产环境配置正确。

---

## 🔐 凭证获取清单

### OpenRouter
- [ ] 登录 https://openrouter.ai/
- [ ] 获取 API Key
- [ ] 验证key格式：`sk-or-v1-...`
- [ ] 填入配置：`OPENROUTER_API_KEY`

### Supabase（生产环境）
- [ ] 决定：使用现有项目 vs 创建新项目
- [ ] 登录 https://supabase.com/dashboard
- [ ] 获取 Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 获取 anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 运行数据库迁移：
  - [ ] `20240111000002_add_credits_system.sql`
  - [ ] 验证表已创建（user_credits, credit_transactions, subscriptions, checkout_mappings）
  - [ ] 验证函数已创建（add_credits, get_credit_balance）

### Creem（生产环境）⚠️ 关键
- [ ] 登录 https://dashboard.creem.io/（正式账号）
- [ ] API Settings:
  - [ ] 创建 Production API Key（不是Test）
  - [ ] 复制 API Key → `CREEM_API_KEY`
  - [ ] 确认 URL：`CREEM_API_URL=https://api.creem.io`（必须！）

- [ ] Products（在生产环境创建）:
  - [ ] Basic产品 → `CREEM_PRODUCT_ID_BASIC`
  - [ ] Pro产品 → `CREEM_PRODUCT_ID_PRO`
  - [ ] Max产品 → `CREEM_PRODUCT_ID_MAX`

- [ ] Webhook:
  - [ ] 创建Webhook：`https://你的域名.com/api/payment/webhook`
  - [ ] 复制 Secret → `CREEM_WEBHOOK_SECRET`

### 应用配置
- [ ] 决定域名：
  - [ ] 自定义域名：`https://yourdomain.com`
  - [ ] Vercel临时域名：`https://xxx.vercel.app`
  - [ ] 填入：`NEXT_PUBLIC_APP_URL`

---

## 📝 配置文件检查

### .env.production 文件
```bash
# 复制模板
cp .env.production.template .env.production

# 然后填入以下所有值：
```

#### 必须配置的变量（11个）：

1. **OPENROUTER_API_KEY** = `sk-or-v1-...`
2. **NEXT_PUBLIC_SUPABASE_URL** = `https://....supabase.co`
3. **NEXT_PUBLIC_SUPABASE_ANON_KEY** = `eyJhbGc...`
4. **CREEM_API_URL** = `https://api.creem.io` ⚠️
5. **CREEM_API_KEY** = `creem_...`
6. **CREEM_PRODUCT_ID_BASIC** = `prod_...`
7. **CREEM_PRODUCT_ID_PRO** = `prod_...`
8. **CREEM_PRODUCT_ID_MAX** = `prod_...`
9. **CREEM_WEBHOOK_SECRET** = `whsec_...`
10. **NEXT_PUBLIC_APP_URL** = `https://...`

#### Vercel环境变量（推荐）
如果使用Vercel，可以不在项目中有 `.env.production` 文件，而是在Vercel Dashboard中配置上述所有变量。

---

## 🚨 关键配置验证

### ❌ 开发环境（当前）
```bash
CREEM_API_URL=https://test-api.creem.io  # 测试API
CREEM_API_KEY=creem_7YTkrxE2SWAWideXTQpclS  # 测试Key
CREEM_PRODUCT_ID_BASIC=prod_dQv4gtZqqevMAMZgEEQzp  # 测试产品
```

### ✅ 生产环境（必须改成）
```bash
CREEM_API_URL=https://api.creem.io  # 正式API ⚠️
CREEM_API_KEY=creem_新的生产key  # 生产Key
CREEM_PRODUCT_ID_BASIC=prod_生产环境的产品ID  # 生产产品
```

---

## ✅ 部署前验证

### 1. 本地测试
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 测试访问
open http://localhost:3000
```

检查项：
- [ ] 首页加载正常
- [ ] Google登录可用
- [ ] /pricing 页面显示正确
- [ ] Credits显示在header中（登录后）

### 2. 检查环境变量加载
在浏览器控制台（F12）运行：
```javascript
console.log({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  appUrl: process.env.NEXT_PUBLIC_APP_URL
})
```

预期输出：
```json
{
  "supabaseUrl": "https://你的项目.supabase.co",
  "appUrl": "https://你的域名.com"
}
```

### 3. 网络请求检查
打开浏览器开发者工具 → Network 标签

**测试支付按钮：**
1. 访问 /pricing
2. 点击 "Get Started"
3. 检查跳转URL

✅ 正确：`https://api.creem.io/checkout/...`
❌ 错误：`https://test-api.creem.io/...`

---

## 🚀 部署步骤

### Vercel 部署（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel --prod
   ```

4. **配置环境变量（两种方式）**

   **方式A：通过Dashboard**
   - 访问 https://vercel.com/dashboard
   - 选择项目 → Settings → Environment Variables
   - 添加所有11个变量

   **方式B：通过CLI**
   ```bash
   vercel env add OPENROUTER_API_KEY production
   # 逐个添加...
   ```

5. **重新部署**
   ```bash
   vercel --prod
   ```

### Docker 部署

1. **构建镜像**
   ```bash
   docker build -t nano-banana:prod .
   ```

2. **运行容器**
   ```bash
   docker run -d \
     --name nano-banana \
     -p 3000:3000 \
     --env-file .env.production \
     nano-banana:prod
   ```

### VPS 部署

1. **上传文件**
   ```bash
   scp -r . user@server:/var/www/nano-banana
   ```

2. **SSH到服务器**
   ```bash
   ssh user@server
   cd /var/www/nano-banana
   ```

3. **创建 .env.production**
   ```bash
   cp .env.production.template .env.production
   nano .env.production
   # 填入所有凭证
   ```

4. **构建并启动**
   ```bash
   npm install
   npm run build
   npm run start
   # 或使用 PM2
   pm2 start npm --name "nano-banana" -- start
   ```

---

## 🧪 生产环境测试

### 测试1：用户注册流程
1. 访问生产环境URL
2. 点击 "Sign In with Google"
3. 完成登录
4. 验证：应该看到4个免费credits

### 测试2：购买套餐
1. 访问 `/pricing`
2. 点击任意 "Get Started"
3. 使用测试卡完成支付
4. 验证：
   - [ ] Webhook被触发（查看Creem Dashboard）
   - [ ] Supabase subscriptions表有记录
   - [ ] Credits余额增加（Basic: 1800, Pro: 9600, Max: 55200）

### 测试3：生成图片
1. 上传图片
2. 输入提示词
3. 点击 "Generate Now"
4. 验证：
   - [ ] Credits减少2个
   - [ ] 图片生成成功
   - [ ] credit_transactions表有记录

### 测试4：错误处理
1. 生成图片直到credits=0
2. 再次尝试生成
3. 验证：应该提示credits不足

---

## 🔍 故障排查

### 问题1：支付失败
```
错误：Live payments not enabled for your account
```
**原因：** 使用了test-api而不是生产API
**解决：**
```bash
# 检查 .env.production
CREEM_API_URL=https://api.creem.io  # 必须是这个

# 重新部署
vercel --prod
```

### 问题2：Webhook未触发
```
症状：支付成功但没有credits
```
**检查：**
1. Webhook URL是否可以从外网访问
2. Vercel函数日志：`vercel logs`
3. Creem Dashboard → Webhooks → 查看日志

### 问题3：Credits不显示
```
症状：登录后看不到credits余额
```
**检查：**
1. Supabase中user_credits表是否有数据
2. 浏览器控制台是否有错误
3. `/api/credits` 返回什么

### 问题4：数据库错误
```
错误：relation "user_credits" does not exist
```
**原因：** 数据库迁移未运行
**解决：**
1. 登录Supabase Dashboard
2. 进入SQL Editor
3. 运行 `20240111000002_add_credits_system.sql`

---

## 📊 监控建议

部署后建议设置以下监控：

### Vercel Analytics
- [ ] 在Vercel Dashboard启用Analytics
- [ ] 监控页面加载速度
- [ ] 监控错误率

### 日志监控
- [ ] 定期检查 `vercel logs`
- [ ] 设置错误告警

### 业务指标
- [ ] 用户注册数量
- [ ] 支付转化率
- [ ] Credits使用率
- [ ] 图片生成成功率

---

## ✅ 最终检查清单

部署前最后确认：

- [ ] 所有11个环境变量已配置
- [ ] `CREEM_API_URL=https://api.creem.io`（确认！）
- [ ] Supabase生产项目已创建/选择
- [ ] 数据库迁移已运行
- [ ] Creem生产环境产品和API Key已创建
- [ ] Webhook已配置
- [ ] `.env.production` 未提交到git
- [ ] 本地生产构建测试通过
- [ ] 已部署到生产环境
- [ ] 已完成端到端测试
- [ ] 监控已设置

---

## 📞 紧急联系方式

准备好以下联系方式：
- Creem技术支持邮箱
- Supabase技术支持
- Vercel支持（如果使用）
- 回滚计划步骤

---

**配置完成后，请仔细检查每一项，确保生产环境可以正常运行！**
