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
# 安装依赖（需加 --legacy-peer-deps，见下方说明）
npm install --legacy-peer-deps

# 若想清空编译产物与本地数据库后重装依赖（练习时可随时执行）
npm run reinit

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

前端: 打开 `public/index.html` 直接访问，或启动后端后访问 http://localhost:3001/（静态页由 Nest 托管）
后端 API: http://localhost:3001

## 本地练习与重置

- `npm run reinit`：删除 `dist/`、`stock-trade.db` 并重新 `npm install --legacy-peer-deps`，适合想从干净数据库和依赖状态开始练习时执行。
- 仅清空数据库：删除项目根目录下的 `stock-trade.db`，下次启动会由 TypeORM 自动重建。
- 更多运行说明见仓库根目录 `AGENTS.md`。

## 许可证

MIT
