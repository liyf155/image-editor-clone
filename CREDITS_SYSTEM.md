# Credits System Implementation Guide

## 概述

Credits系统已经实现完成，功能如下：
- 用户注册后自动获得4个免费credits
- 生成一张图片消耗2个credits
- 用户购买套餐后获得相应的credits（Basic: 1800, Pro: 9600, Max: 55200）

## 部署步骤

### 1. 运行数据库迁移

在Supabase的SQL编辑器中运行以下文件：
```
supabase/migrations/20240111000002_add_credits_system.sql
```

这将创建以下内容：
- `user_credits` 表 - 存储用户credits余额
- `credit_transactions` 表 - 记录所有credits交易历史
- 3个数据库函数：
  - `get_or_create_user_credits(user_uuid)` - 获取或创建用户credits
  - `add_credits(user_uuid, amount, trans_type, descr, rel_id)` - 添加/扣除credits
  - `get_credit_balance(user_uuid)` - 获取用户余额

### 2. 验证部署

登录后，用户应该能够：
1. 看到header中显示的credits余额（例如：🍌 4 Credits）
2. 在编辑器部分看到credits可用信息
3. 生成图片后看到credits减少2个
4. 购买套餐后credits增加

## API端点

### GET /api/credits
获取当前用户的credits余额和交易历史

**响应示例：**
```json
{
  "balance": 4,
  "transactions": [
    {
      "id": "...",
      "amount": 4,
      "balance_after": 4,
      "transaction_type": "registration_bonus",
      "description": "Free credits for signing up",
      "created_at": "2026-01-11T..."
    }
  ]
}
```

### POST /api/generate
生成图片（需要2个credits）

**请求：**
```json
{
  "image": "data:image/jpeg;base64,...",
  "prompt": "transform this image...",
  "model": "google/gemini-2.5-flash-image-preview",
  "userId": "user-uuid"
}
```

**响应：**
```json
{
  "content": "...",
  "imageUrl": "https://...",
  "creditsUsed": 2,
  "remainingCredits": 2
}
```

**错误响应（credits不足）：**
```json
{
  "error": "Insufficient credits",
  "details": "You need 2 credits to generate an image. Current balance: 0"
}
```

## Credits分配规则

| 来源 | Credits数量 |
|------|------------|
| 注册奖励 | 4 credits |
| Basic套餐 | 1800 credits/year |
| Pro套餐 | 9600 credits/year |
| Max套餐 | 55200 credits/year |
| 生成图片 | -2 credits |

## 前端显示

Credits在以下位置显示：

1. **Header导航栏**（已登录用户可见）
   - 显示格式：🍌 X Credits

2. **编辑器部分**
   - 显示格式：🍌 X Credits Available • 2 Credits per Image

3. **生成按钮检查**
   - 如果credits < 2，显示提示并引导用户购买套餐

## 错误处理

系统会自动处理以下情况：

1. **生成失败时自动退款**
   - 网络错误
   - API错误
   - API密钥未配置

2. **重复注册检查**
   - 用户只有首次登录时获得4个免费credits

3. **并发安全**
   - 使用数据库行锁确保credits扣减的原子性

## 测试场景

### 测试1: 新用户注册
1. 退出当前账号
2. 使用新的Google账号登录
3. 验证：应该自动获得4个credits
4. 检查数据库 `user_credits` 和 `credit_transactions` 表

### 测试2: 生成图片
1. 上传图片并输入提示词
2. 点击 "Generate Now"
3. 验证：credits减少2个
4. 检查交易记录中是否添加了 `-2` 的记录

### 测试3: Credits不足
1. 生成图片直到credits = 0
2. 尝试再次生成
3. 验证：应该显示提示框建议购买套餐

### 测试4: 购买套餐
1. 点击pricing页面的 "Get Started"
2. 完成支付（测试环境）
3. 验证：webhook添加相应credits
4. 检查交易记录

## 数据库查询示例

```sql
-- 查看所有用户credits余额
SELECT user_id, balance, updated_at FROM user_credits ORDER BY balance DESC;

-- 查看特定用户的交易历史
SELECT * FROM credit_transactions
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC
LIMIT 20;

-- 查看所有注册奖励
SELECT * FROM credit_transactions
WHERE transaction_type = 'registration_bonus'
ORDER BY created_at DESC;

-- 统计总发放credits
SELECT
  transaction_type,
  SUM(amount) as total_credits,
  COUNT(*) as transaction_count
FROM credit_transactions
GROUP BY transaction_type;
```

## 常见问题

**Q: 如何给用户手动添加credits？**
```sql
SELECT add_credits(
  'user-uuid',
  100,
  'manual_grant',
  'Customer support grant'
);
```

**Q: 如何查看用户是否有足够credits？**
```sql
SELECT get_credit_balance('user-uuid');
```

**Q: 如何修改每张图片的credits消耗？**
编辑 `app/api/generate/route.ts` 中的 `CREDITS_PER_IMAGE` 常量。

**Q: 生成失败时credits会退还吗？**
会的，系统会自动在以下情况退还credits：
- 网络错误
- OpenRouter API错误
- API密钥未配置

## 下一步优化建议

1. 添加credits即将用尽的提醒通知
2. 在pricing页面更清晰地显示credits数量
3. 添加credits交易历史页面供用户查看
4. 实现credits过期机制（如果需要）
5. 添加推荐奖励系统（推荐新用户获得额外credits）
