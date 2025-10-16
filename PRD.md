# 旅游网站产品需求文档（PRD）

## 1. 项目简介
一个面向大众用户的旅游目的地浏览与在线预定网站。采用 Vue3 + TypeScript + Tailwind CSS 构建，支持响应式设计（手机 / 平板 / 桌面）。视觉主色调为蓝色与绿色，突出信任、自然与探索。图片资源优先使用 Unsplash 与 Pexels 免费高质量图片外链，减少仓库体积。

## 2. 目标与价值
| 目标 | 说明 | 用户价值 |
|------|------|----------|
| 快速发现目的地 | 提供可筛选的目的地卡片与详情 | 减少决策时间 |
| 简单预定流程 | 一个表单完成基本预定意向 | 提升转化率 |
| 高性能与响应式 | 首屏加载快，移动端体验好 | 增强留存 |
| 可扩展性 | 数据与功能模块化 | 便于后续迭代 |

## 3. 页面概述
### 3.1 首页（Home）—— 浏览目的地
功能点：
- 顶部导航（Logo / 主页 / 预定）与移动端汉堡菜单
- Hero 区：宣传语 + CTA 按钮“开始预定”
- 目的地卡片栅格（自适应列数：Mobile 1、Tablet 2、Desktop 3~4）
  - 显示图片、名称、简短描述、标签
  - 图片悬停放大、可点击打开详情 Modal
- 搜索与筛选：名称关键字搜索 + 分类过滤（海岛 / 城市 / 山地 / 自然 / 文化）
- 详情 Modal：大图 + 完整描述 + 最佳季节 + 参考价格 + 标签 + 跳转预定按钮
- 最近浏览区域（最多保存 5 条，本地 localStorage）

### 3.2 预定页面（Booking）—— 填写预定
功能点：
- 目的地下拉选择（支持通过 URL 参数预填，如 ?dest=maldives）
- 表单字段：姓名（必填）、邮箱（必填）、手机（可选）、出行日期（必填）、人数（>=1）、备注（可选）
- 实时校验：邮箱格式、人数下限、手机号格式
- 价格预估：基础价 * 人数（若提供 basePrice）
- 提交：模拟异步（假设 800ms 延迟 + 10% 失败概率）
- 成功 / 失败反馈：Toast 或表单下方状态消息
- 防重复：提交中禁用按钮

## 4. 技术栈
| 类别 | 技术 | 用途 |
|------|------|------|
| 框架 | Vue 3 (Composition API) | 组件化开发 |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS | 原子类 + 自定义主题 |
| 构建 | Vite | 快速开发与打包 |
| 路由 | Vue Router | 页面导航 |
| 校验 | vee-validate 或自定义 | 表单验证 |
| 测试 | Vitest | 单元测试 |
| 图片 | Unsplash / Pexels | 高清外链资源 |

Tailwind 自定义色板（示例）：
```js
// tailwind.config.js
export default {
  theme: { extend: { colors: { primaryBlue: '#1e75d8', primaryGreen: '#1fae81' } } }
};
```

## 5. 数据模型
```ts
// Destination
interface Destination {
  id: string;
  name: string;
  category: 'island' | 'city' | 'mountain' | 'nature' | 'culture';
  shortDescription: string;
  description: string;
  imageUrl: string;      // Unsplash/Pexels 外链
  bestSeason?: string;   // e.g. '11-04'
  basePrice?: number;    // 用于预估
  tags?: string[];
}

// BookingPayload
interface BookingPayload {
  destinationId: string;
  name: string;
  email: string;
  phone?: string;
  date: string; // ISO
  people: number;
  note?: string;
}
```

## 6. 示例目的地数据
```ts
export const destinations: Destination[] = [
  {
    id: 'maldives',
    name: '马尔代夫',
    category: 'island',
    shortDescription: '印度洋上的度假天堂',
    description: '清澈海水与白沙滩，适合蜜月与潜水，最佳季节 11 月到 4 月。',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    bestSeason: '11-04',
    basePrice: 8500,
    tags: ['海岛','蜜月','潜水']
  },
  {
    id: 'kyoto',
    name: '京都',
    category: 'culture',
    shortDescription: '古韵与现代交织的文化之都',
    description: '寺庙庭院与四季景色，春樱秋枫，文化旅行佳选。',
    imageUrl: 'https://images.unsplash.com/photo-1554797589-7241bb691973',
    bestSeason: '03-04 / 10-11',
    basePrice: 6200,
    tags: ['文化','历史','四季']
  },
  {
    id: 'interlaken',
    name: '因特拉肯',
    category: 'mountain',
    shortDescription: '湖泊与雪山融合的户外圣地',
    description: '滑雪、徒步、跳伞等活动丰富，适合冒险与自然爱好者。',
    imageUrl: 'https://images.unsplash.com/photo-1516569422861-f3b3b1f0b9d6',
    bestSeason: '06-09 / 12-02',
    basePrice: 7800,
    tags: ['山地','户外','运动']
  }
];
```

## 7. 目录结构规划
```bash
travel-site/
├── README.md                # 项目说明（可含运行指南）
├── PRD.md                   # 本产品需求文档
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js        # PostCSS 配置 (ESM 导出)
├── tailwind.config.js       # Tailwind 配置
├── public/
│   └── index.html           # 入口 HTML
├── src/
│   ├── main.ts              # App 入口
│   ├── App.vue              # 根组件
│   ├── router/
│   │   └── index.ts         # 路由
│   ├── pages/
│   │   ├── Home.vue         # 首页
│   │   └── Booking.vue      # 预定页
│   ├── components/
│   │   ├── Navbar.vue
│   │   ├── DestinationCard.vue
│   │   ├── DestinationFilter.vue
│   │   ├── DestinationModal.vue
│   │   └── BookingForm.vue
│   ├── composables/
│   │   ├── useDestinations.ts
│   │   └── useRecent.ts
│   ├── data/
│   │   └── destinations.ts  # 模拟数据
│   ├── types/
│   │   └── destination.ts   # 类型定义
│   ├── utils/
│   │   └── validation.ts    # 校验函数
│   └── styles/
│       └── tailwind.css
└── src/tests/               # Vitest 单元测试
```

## 8. 用户故事
| 用户故事 | 验收标准 |
|----------|----------|
| 访客希望快速浏览目的地 | 首页加载 ≥3 个卡片，图片正常显示 |
| 访客希望按类别筛选 | 点击类别按钮后仅显示对应类别卡片 |
| 访客希望查看详情 | 点击卡片弹出 Modal，展示完整描述与标签 |
| 用户希望填写预定 | 表单必填项为空有错误提示，正确提交显示成功消息 |
| 用户希望价格预估 | 人数改变时预估价格即时更新 |
| 用户希望保留浏览记录 | 最近浏览区出现刚查看的目的地 |

## 9. 非功能需求
- 响应式断点：Tailwind 默认 sm(640px)/md(768px)/lg(1024px)/xl(1280px)
- 加载体验：图片 `loading="lazy"` + 骨架占位
- 可访问性：alt 文本、按钮可聚焦、Modal 支持 ESC 关闭
- 性能：初始包 < 200KB（通过路由懒加载）
- 代码质量：TS 严格模式；核心逻辑（过滤、数据）有测试覆盖

## 10. 交互与状态
| 场景 | 展示 |
|------|------|
| 图片加载中 | 骨架灰块动画 |
| Modal 打开 | 背景遮罩 + body 禁滚动（后续可加） |
| 表单提交中 | 按钮禁用 + 显示“提交中...” |
| 提交成功 | 绿色提示文本 + 表单清空 |
| 提交失败 | 红色错误提示，可重试 |

## 11. 测试范围（MVP）
- 数据文件：目的地数组长度与字段完整性
- Composable：搜索与分类过滤逻辑
- 表单校验：邮箱错误、人数 <1 情况

## 12. MVP 验收清单
| 项目 | 状态标准 |
|------|----------|
| 首页栅格 | 自适应列数无横向滚动条 |
| 详情 Modal | 正常打开关闭不报错 |
| 筛选与搜索 | 输入或点击后结果更新 |
| 预定表单 | 必填校验与价格预估生效 |
| 最近浏览 | 查看目的地后列表出现对应卡片 |
| 样式主题 | 主按钮/导航使用自定义 primaryBlue/primaryGreen |

## 13. 后续迭代（非 MVP）
- 用户登录与历史预定
- 真实后端 API 集成（REST/GraphQL）
- 国际化（中文 / 英文）
- 深链接目的地路由 `/destination/:id`
- 收藏 / 分享功能
- 增量图片优化（Blur Hash / LQIP）

## 14. 风险与应对
| 风险 | 描述 | 缓解策略 |
|------|------|-----------|
| 图片慢加载 | 外链网络波动 | 使用骨架 + lazy loading |
| 表单误填 | 邮箱或日期格式错误 | 即时校验 + 统一错误样式 |
| 移动端拥挤 | 栅格/标签过多 | 标签折行 + line-clamp 描述 |
| 数据扩展困难 | 早期硬编码 | 抽离至 `data/destinations.ts` 并准备接口适配层 |

## 15. 启动步骤（参考）
```bash
# 安装依赖
npm install
# 启动开发
npm run dev
# 运行测试
npm run test -- --run
```

## 16. 成功指标（初步）
- 首屏渲染时间 (本地开发) < 2s
- 表单成功提交流程 < 5s（含模拟延迟）
- 关键功能测试覆盖率 ≥ 60%（MVP 阶段）

---
需要我继续生成项目代码或直接初始化文件结构，请告诉我。