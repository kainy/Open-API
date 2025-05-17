# API Billing Gateway 开源API计费网关

一个基于 Koa.js 的高性能 API 计费网关，支持按月计费和按调用量计费。

## 演示（Live Demo）

https://open.kainy.cn/#gh

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

## 界面截图

### 用户端

##### >>用户-首页
<img width="1189" alt="用户-首页" src="https://github.com/user-attachments/assets/adbc6466-d602-49fe-9479-11bd30e1be73" />

##### >>用户-使用统计
![用户-使用统计](https://github.com/user-attachments/assets/811f0dfe-b59d-451c-9dde-26976fdc7776)

##### >>用户-账单中心
![用户-账单中心](https://github.com/user-attachments/assets/02f110ff-d9dd-4b4d-9793-87b1194d7829)

##### >>用户-充值和支付
![用户-充值和支付](https://github.com/user-attachments/assets/eda60591-9d88-48b1-a651-91781b0143c8)

##### >>用户-工单系统
![用户-工单系统](https://github.com/user-attachments/assets/654f76b7-87d3-445b-8b8e-18fa010c7bfa)

### 管理员端

##### >>管理员-首页
![管理员-首页](https://github.com/user-attachments/assets/3660b513-8de2-43a4-97ca-1428ba22f015)

##### >>管理员-用户管理-查看调用记录
![管理员-用户管理-查看调用记录](https://github.com/user-attachments/assets/d2e83101-4b67-4fc2-998d-be2e35c15cac)

##### >>管理员-工单管理
![管理员-工单管理](https://github.com/user-attachments/assets/bf7487bb-1f79-49b3-ba75-835807c33588)

##### >>管理员-营销设置
![管理员-营销设置](https://github.com/user-attachments/assets/bfa4872f-4048-4680-8ad7-42f22975e4b0)


## 许可证

MIT
