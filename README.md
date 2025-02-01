# API Billing System

一个基于 Koa.js 的高性能 API 计费系统，支持按月计费和按调用量计费。

## 主要特性

- 支持多种计费模式：
  - 按月固定额度计费
  - 按实际使用量计费
- 高性能设计：
  - 使用 Redis 进行速率限制和临时数据缓存
  - MongoDB 用于持久化存储
  - 异步处理计费记录
- 完善的错误处理和日志记录
- RESTful API 设计
- 实时使用量统计
- 灵活的计费策略配置

## 系统要求

- Node.js >= 14
- MongoDB >= 4.4
- Redis >= 6.0

## 安装

```bash
# 克隆项目
git clone [repository-url]

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置相关参数

# 启动服务
npm start
```

## API 文档

### 认证
所有 API 请求都需要在 header 中包含 `X-API-Key`

### 计费相关接口

#### 获取月度使用统计
```
GET /billing/usage/:year/:month
```

#### 获取月度账单
```
GET /billing/bill/:year/:month
```

#### 更新计费方案
```
PUT /billing/plan
```

请求体示例：
```json
{
  "billingPlan": "monthly",
  "monthlyQuota": 10000,
  "usageRate": 0.01
}
```

## 性能优化

1. 使用 Redis 进行速率限制和临时数据缓存
2. MongoDB 索引优化
3. 异步处理计费记录
4. 批量处理和聚合查询

## 安全性考虑

1. API 密钥认证
2. 速率限制
3. 输入验证
4. 错误处理
5. 敏感信息加密

## 开发计划

- [ ] 支持多种货币
- [ ] 添加计费预警功能
- [ ] 支持自定义计费规则
- [ ] 添加计费报表导出功能
- [ ] 集成支付网关

## 许可证

MIT
