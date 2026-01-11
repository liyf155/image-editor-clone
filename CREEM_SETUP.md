# Creem 支付集成说明

## 概述

本项目已成功集成 Creem 支付系统，支持三个定价方案：
- **Basic**: $12/月 (75 张图片/月)
- **Pro**: $19.50/月 (400 张图片/月)
- **Max**: $80/月 (2300 张图片/月)

## 配置步骤

### 1. 注册 Creem 账号

1. 访问 [Creem Dashboard](https://dashboard.creem.io/)
2. 使用 Google 账号或邮箱注册
3. 完成身份验证（上传身份证等）

### 2. 创建产品

在 Creem Dashboard 中为每个定价方案创建产品：

1. 进入 **Products** → **Add Product**
2. 填写产品信息：
   - **Name**: 方案名称（如 "Basic Plan"）
   - **Return URL**: `http://localhost:3000/payment/success`（测试）/ `https://your-domain.com/payment/success`（生产）
   - **Description**: 产品描述
   - **Payment Type**: Subscription（订阅）或 One-time（一次性）
   - **Price**: 设置价格
   - **Currency**: USD
3. 创建后，复制 **Product ID**（格式类似 `prod_xxxxxxxxx`）

为三个方案分别创建产品后，你会得到：
- `CREEM_PRODUCT_ID_BASIC`
- `CREEM_PRODUCT_ID_PRO`
- `CREEM_PRODUCT_ID_MAX`

### 3. 获取 API Key

1. 进入 **Developer** → **API Keys**
2. 创建 API Key
3. 复制 API Key（格式类似 `creem_test_xxxxxxxxx`）

**重要**: 测试环境和生产环境使用不同的 API Key！

### 4. 更新环境变量

编辑 `.env.local` 文件，填入实际的值：

```bash
# Creem Payment Configuration
CREEM_API_KEY=creem_test_your_actual_api_key_here
CREEM_API_URL=https://test-api.creem.io  # 测试环境
# CREEM_API_URL=https://api.creem.io     # 生产环境

# Product IDs from Creem Dashboard
CREEM_PRODUCT_ID_BASIC=prod_your-basic-product-id
CREEM_PRODUCT_ID_PRO=prod_your-pro-product-id
CREEM_PRODUCT_ID_MAX=prod_your-max-product-id

# Webhook Secret (可选)
CREEM_WEBHOOK_SECRET=your-webhook-secret-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # 测试环境
# NEXT_PUBLIC_APP_URL=https://your-domain.com  # 生产环境
```

### 5. 配置 Webhook（可选）

如果你需要接收支付通知：

1. 进入 **Developer** → **Webhooks**
2. 创建 Webhook：
   - **Name**: Payment Notification
   - **Webhook URL**:
     - 测试环境：需要使用 ngrok 等工具将本地端口暴露为公网 URL
     - 生产环境：`https://your-domain.com/api/payment/webhook`
3. 创建后复制 **Webhook Secret**

## 测试支付

### 测试环境

1. 确保 `.env.local` 中使用测试 API Key 和测试 API URL
2. 访问 `http://localhost:3000/pricing`
3. 点击任意方案的 "Get Started" 按钮
4. 在 Creem 支付页面使用测试信用卡：
   - **卡号**: `4242 4242 4242 4242`
   - **其他信息**: 任意填写
5. 完成支付后会重定向到成功页面

### 生产环境

切换到生产环境时，需要：

1. 更新 `.env.local` 中的配置：
   ```bash
   CREEM_API_KEY=creem_prod_xxxxxxxxx  # 生产 API Key
   CREEM_API_URL=https://api.creem.io  # 生产 API URL
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

2. 确保 Creem Dashboard 中创建的产品使用生产环境配置

## 支付流程

1. 用户点击 "Get Started" 按钮
2. 前端调用 `/api/payment/create-checkout` API
3. 后端调用 Creem API 创建 checkout session
4. 返回 `checkout_url` 给前端
5. 用户重定向到 Creem 支付页面
6. 用户完成支付
7. Creem 重定向回 `success_url` 并附带签名参数
8. （可选）验证签名确保支付真实性
9. 显示支付成功页面

## 安全提示

- ✅ **永远不要在前端暴露 CREEM_API_KEY**
- ✅ **在生产环境中始终验证签名**
- ✅ **使用 Webhook 接收支付通知**（更可靠）
- ✅ **为测试和生产环境使用不同的 API Key**

## 测试技巧

### 使用折扣码

在测试支付时，为了避免实际扣费，可以：

1. 在 Creem Dashboard 创建 **100% 折扣码**
2. 在支付时输入折扣码
3. 显示为 FREE，无需输入信用卡信息

### 本地测试 Webhook

如果需要测试 Webhook：

1. 安装 ngrok: `brew install ngrok`
2. 启动开发服务器: `npm run dev`
3. 启动 ngrok: `ngrok http 3000`
4. 复制 ngrok 提供的公网 URL
5. 在 Creem Dashboard 中配置 Webhook URL 为：`https://xxx.ngrok.io/api/payment/webhook`

## 故障排查

### 签名验证失败

确保：
1. API Key 正确
2. 参数顺序正确（不要排序）
3. 签名生成算法与 Creem 文档一致

### API 调用失败

检查：
1. API URL 是否正确（测试 vs 生产）
2. API Key 是否有效
3. Product ID 是否正确

### 支付后未重定向

确认：
1. success_url 配置正确
2. URL 可以公网访问（测试时使用 ngrok）

## 参考资源

- [Creem 官方文档](https://docs.creem.io)
- [Creem Dashboard](https://dashboard.creem.io)
- [Creem 支付配置教程](https://www.yirenxueshe.com/ai/133.html)（中文）

## 技术实现

### 核心文件

```
lib/creem/
├── signature.ts          # 签名生成和验证
└── checkout.ts           # Checkout session 创建

app/api/payment/
├── create-checkout/
│   └── route.ts         # 创建支付会话 API
└── verify-signature/
    └── route.ts         # 签名验证 API

app/payment/
├── success/
│   └── page.tsx         # 支付成功页面
└── cancelled/
    └── page.tsx         # 支付取消页面

app/pricing/
└── page.tsx             # 定价页面
```

### API 端点

- `POST /api/payment/create-checkout` - 创建支付会话
- `POST /api/payment/verify-signature` - 验证支付签名

## 支持和帮助

如果遇到问题：

1. 查看 Creem Dashboard 中的日志
2. 检查浏览器控制台错误
3. 检查服务器日志
4. 参考 Creem 官方文档

祝使用愉快！🍌
