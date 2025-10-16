# Travel Site

基于 Vue3 + TypeScript + Tailwind 的旅游目的地浏览与预定应用。详细需求见 `PRD.md`。

## 启动
```bash
npm install
npm run dev
npm run test -- --run
```

## MCP Server

项目包含一个 MCP (Model Context Protocol) stdio 服务器，支持查询目的地数据。

### 启动 MCP 服务器

```bash
node mcp-server/server.js
```

### 支持的方法

#### 1. listDestinations

返回所有目的地的精简信息（id, name, category, basePrice）。

**请求示例：**
```bash
echo '{"id":1,"method":"listDestinations"}' | node mcp-server/server.js
```

**响应示例：**
```json
{
  "id": 1,
  "result": [
    {"id": "maldives", "name": "马尔代夫", "category": "island", "basePrice": 8500},
    {"id": "kyoto", "name": "京都", "category": "culture", "basePrice": 6200},
    {"id": "interlaken", "name": "因特拉肯", "category": "mountain", "basePrice": 7800}
  ]
}
```

#### 2. searchDestinations

根据关键词和/或分类过滤目的地。

**参数：**
- `keyword` (可选): 搜索关键词，匹配目的地的 id、name 或 shortDescription（忽略大小写）
- `category` (可选): 目的地分类，可选值：island, city, mountain, nature, culture

**请求示例：**
```bash
# 按关键词搜索
echo '{"id":2,"method":"searchDestinations","params":{"keyword":"mal"}}' | node mcp-server/server.js

# 按分类过滤
echo '{"id":3,"method":"searchDestinations","params":{"category":"island"}}' | node mcp-server/server.js

# 组合搜索
echo '{"id":4,"method":"searchDestinations","params":{"keyword":"文化","category":"culture"}}' | node mcp-server/server.js
```

**响应示例：**
```json
{
  "id": 2,
  "result": [
    {"id": "maldives", "name": "马尔代夫", "category": "island", "basePrice": 8500}
  ]
}
```

### 错误处理

#### 错误响应格式
```json
{
  "id": 1,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

#### 错误代码
- `BAD_REQUEST`: 无效的 JSON 或缺少必需的 method 字段
- `METHOD_NOT_FOUND`: 不支持的方法名
- `INTERNAL_ERROR`: 服务器内部错误

**示例：**
```bash
# 缺少 method 字段
echo '{}' | node mcp-server/server.js
# 响应: {"id":null,"error":{"code":"BAD_REQUEST","message":"Missing required field: method"}}

# 无效的 JSON
echo 'not json' | node mcp-server/server.js
# 响应: {"id":null,"error":{"code":"BAD_REQUEST","message":"Invalid JSON input"}}
```

## 目录
详见 PRD 文档及源码结构。
