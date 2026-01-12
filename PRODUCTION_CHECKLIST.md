# 生产环境部署清单

## 🔴 部署前必须修改

### 1. Creem API配置
```bash
# ❌ 错误（测试环境）
CREEM_API_URL=https://test-api.creem.io

# ✅ 正确（生产环境）
CREEM_API_URL=https://api.creem.io
```

### 2. 获取生产环境凭证

1. **登录Creem生产环境**
   - 访问 https://dashboard.creem.io/
   - 使用正式账号登录（不是test账号）

2. **创建生产环境产品**
   - 在Products页面创建Basic、Pro、Max三个产品
   - 复制生产环境的Product IDs

3. **获取生产环境API Key**
   - 在API Keys页面创建生产密钥
   - 复制到环境变量 `CREEM_API_KEY`

4. **配置Webhook**
   - Webhook URL: `https://yourdomain.com/api/payment/webhook`
   - 复制Webhook Secret到 `CREEM_WEBHOOK_SECRET`

### 3. Supabase配置
- 确保使用生产环境Supabase项目
- 不要使用开发环境的URL和Key

### 4. 运行数据库迁移
在Supabase SQL编辑器中运行：
```sql
-- 1. Credits系统
-- 文件: supabase/migrations/20240111000002_add_credits_system.sql

-- 2. 订阅系统（如果还没运行）
-- 检查 subscriptions 和 checkout_mappings 表是否存在
```

## 🟡 部署步骤

### Vercel部署（推荐）
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod

# 4. 在Vercel Dashboard配置环境变量
```

### Docker部署
```bash
# 1. 构建镜像
docker build -t nano-banana .

# 2. 运行容器
docker run -p 3000:3000 \
  -e CREEM_API_URL=https://api.creem.io \
  -e CREEM_API_KEY=your_key \
  -e CREEM_WEBHOOK_SECRET=your_secret \
  --env-file .env.production \
  nano-banana
```

### VPS部署
```bash
# 1. 创建.env.production文件
cp .env.production.example .env.production
# 编辑填入真实值

# 2. 构建
npm run build

# 3. 启动
npm run start

# 或使用PM2
pm2 start npm --name "nano-banana" -- start
```

## ✅ 部署后验证

### 1. 测试支付流程
- [ ] 访问 `/pricing` 页面
- [ ] 点击 "Get Started" 按钮
- [ ] 确认跳转到Creem生产环境（不是test-api）
- [ ] 完成一笔小额测试支付
- [ ] 验证webhook接收成功
- [ ] 检查credits是否正确添加

### 2. 测试图片生成
- [ ] 登录账号
- [ ] 确认显示4个免费credits
- [ ] 上传图片并生成
- [ ] 验证credits减少到2
- [ ] 检查 `credit_transactions` 表有记录

### 3. 测试订阅用户
- [ ] 购买Basic套餐
- [ ] 验证获得1800 credits
- [ ] 生成图片，验证扣除2 credits
- [ ] 检查 `subscriptions` 表状态为active

### 4. 检查日志
```bash
# Vercel
vercel logs

# PM2
pm2 logs nano-banana

# Docker
docker logs <container_id>
```

## 🔒 安全检查

- [ ] `.env.local` 已加入 `.gitignore`
- [ ] `.env.production` 已加入 `.gitignore`（或不提交）
- [ ] API密钥不在代码中硬编码
- [ ] Webhook signature验证已启用
- [ ] 数据库RLS策略已启用
- [ ] CORS配置正确（如果有需要）

## 📊 监控设置

### 推荐监控工具
1. **Vercel Analytics** - 性能监控
2. **Sentry** - 错误追踪
3. **Supabase Logs** - 数据库查询日志
4. **Creem Dashboard** - 支付成功/失败率

### 关键指标
- 用户注册率
- 支付转化率
- 图片生成成功率
- Webhook失败率
- Credits使用率

## 🆘 常见问题

### Q: 支付后没有收到webhook？
**A:** 检查以下几点：
1. Webhook URL是否可以从外网访问（不能用localhost）
2. Creem Dashboard中webhook是否配置正确
3. 检查服务器防火墙是否允许Creem的请求
4. 查看Creem Dashboard的webhook日志

### Q: Credits没有添加？
**A:**
1. 检查 `credit_transactions` 表是否有错误日志
2. 确认数据库函数 `add_credits` 是否创建成功
3. 查看服务器日志中的错误信息

### Q: 生产环境还是用test-api？
**A:** 必须修改 `.env.production` 中的 `CREEM_API_URL=https://api.creem.io`

## 📞 紧急联系方式

准备这些信息在部署前：
- Creem技术支持
- Supabase技术支持
- Vercel支持（如果使用）
- 回滚计划

---

## 快速切换命令

```bash
# 开发环境
npm run dev
# 使用 .env.local

# 生产环境构建
npm run build
# 使用 .env.production

# 本地测试生产构建
npm run build && npm run start
# 使用 .env.production
```
