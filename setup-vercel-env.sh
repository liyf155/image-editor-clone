#!/bin/bash

# Vercel环境变量配置脚本
# 使用方法：bash setup-vercel-env.sh

echo "🚀 开始配置Vercel环境变量..."
echo ""

# 检查是否登录Vercel
echo "1️⃣ 检查Vercel登录状态..."
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ 未登录Vercel，请先登录:"
    echo "   vercel login"
    exit 1
fi
echo "✅ 已登录Vercel"
echo ""

# 添加环境变量
echo "2️⃣ 添加环境变量..."

echo "添加 NEXT_PUBLIC_SUPABASE_URL..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<EOF
https://rxngnvluylqrhlklwnhr.supabase.co
EOF

echo "添加 NEXT_PUBLIC_SUPABASE_ANON_KEY..."
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bmdudmx1eWxxcmhsa2x3bmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjQyODYsImV4cCI6MjA4MzI0MDI4Nn0.tzgj1f-MxEvHBk9_NAexmt6PgtVZSEEarYm9l1B2gj4
EOF

echo "添加 OPENROUTER_API_KEY..."
vercel env add OPENROUTER_API_KEY production <<EOF
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
EOF

echo "添加 CREEM_API_URL..."
vercel env add CREEM_API_URL production <<EOF
https://test-api.creem.io
EOF

echo "添加 CREEM_API_KEY..."
vercel env add CREEM_API_KEY production <<EOF
creem_7YTkrxE2SWAWideXTQpclS
EOF

echo "添加 CREEM_PRODUCT_ID_BASIC..."
vercel env add CREEM_PRODUCT_ID_BASIC production <<EOF
prod_dQv4gtZqqevMAMZgEEQzp
EOF

echo "添加 CREEM_PRODUCT_ID_PRO..."
vercel env add CREEM_PRODUCT_ID_PRO production <<EOF
prod_Gmq1iNZvdQVj9yNO8vFlT
EOF

echo "添加 CREEM_PRODUCT_ID_MAX..."
vercel env add CREEM_PRODUCT_ID_MAX production <<EOF
prod_3O2B2AiaKdINwNWbRjtCVZ
EOF

echo "添加 CREEM_WEBHOOK_SECRET..."
vercel env add CREEM_WEBHOOK_SECRET production <<EOF
whsec_fhgJbP52U9Sneh2X0gbSQ
EOF

echo "添加 NEXT_PUBLIC_APP_URL..."
vercel env add NEXT_PUBLIC_APP_URL production <<EOF
https://image-editor-clone.vercel.app
EOF

echo ""
echo "✅ 所有环境变量已添加！"
echo ""
echo "🔄 重新部署项目..."
vercel --prod

echo ""
echo "✅ 部署完成！"
echo "🌐 访问: https://image-editor-clone.vercel.app"
