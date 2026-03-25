# Stock Trade - 股票交易应用

> 股票交易系统 - AngularJS + NestJS

## 功能

- ✅ 股票买卖下单
- ✅ 持仓管理
- ✅ 投资组合盈亏统计
- ✅ 股票搜索
- ✅ 订单历史记录

## 技术栈

- 后端: NestJS + TypeORM + SQLite
- 前端: AngularJS 1.8
- 数据库: SQLite

## 快速开始

```bash
# 安装依赖
npm install

# 开发运行
npm run start:dev

# 生产构建
npm run build
npm run start:prod
```

## API 接口

- `GET /api/trade/orders` - 获取订单列表
- `GET /api/trade/positions` - 获取持仓列表
- `POST /api/trade/order` - 创建订单
- `DELETE /api/trade/order/:id` - 取消订单
- `GET /api/trade/portfolio` - 获取投资组合统计
- `GET /api/trade/search` - 搜索股票

## 访问

前端: 打开 `public/index.html` 直接访问
后端 API: http://localhost:3001

## 许可证

MIT
