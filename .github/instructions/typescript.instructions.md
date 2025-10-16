# TypeScript 项目编码规范

> 目标：提升可读性、类型安全、可维护性与一致性，适用于本仓库（Vue3 + TS + Tailwind + Vite）环境。

## 1. 基础原则
- 使用 **Strict TypeScript**：不要关闭 `strict` 相关编译选项。
- 禁止 `any`（除非有明确注释说明特殊原因）。优先使用 `unknown` 再做类型收窄。
- 避免滥用类型断言（`as`）。若必须断言，先验证来源可靠性。
- 逻辑优先：类型是辅助而非障碍，不为了“炫技”写过度复杂的泛型。

## 2. 文件与命名
- 文件名使用 **kebab-case**：如 `use-destinations.ts`、`destination-modal.vue`。
- 类型或接口放在 `src/types/` 或就近（若仅单文件内部使用）。
- 接口使用首字母大写驼峰：`Destination`、`BookingPayload`。
- 常量使用全大写 + 下划线：`API_BASE_URL`（若跨文件共享）。
- 组合式函数（composable）以 `use` 前缀：`useRecent`、`useDestinations`。

## 3. 导入与导出
- 优先使用 **具名导出**，避免默认导出造成重命名混乱；根组件或单一实体可默认导出。
- 同一模块的导入合并：
  ```ts
  // ✅ 推荐
  import { ref, computed } from 'vue';
  // ❌ 避免
  import { ref } from 'vue';
  import { computed } from 'vue';
  ```
- 导出顺序：类型、常量、函数、类（语义自然）。

## 4. 类型定义
- 优先使用 `interface` 描述对象结构；仅在需要联合扩展或类型运算时用 `type`。
- 避免写过宽泛的结构：`Record<string, any>` 可重构为明确键集合。
- 函数类型：
  ```ts
  type FetchDestinations = (keyword?: string) => Promise<Destination[]>;
  ```
- 使用 `enum` 谨慎（可能生成额外 JS）；更推荐字面量联合：
  ```ts
  type Category = 'island' | 'city' | 'mountain' | 'nature' | 'culture';
  ```
- 可选字段用 `?` 而不是联合 `| undefined`：
  ```ts
  interface Destination { bestSeason?: string }
  ```

## 5. 严格的空值处理
- 启用 `strictNullChecks` 后避免非必要的非空断言（`!`）。
- 分支内尽早返回，缩短可能为 `undefined` 的作用域：
  ```ts
  if (!destination) return;
  // 后续 destination 肯定存在
  ```

## 6. 函数与参数
- 参数 <=3 为宜；超过则改成对象参数：
  ```ts
  function createBooking(payload: BookingPayload) { /* ... */ }
  ```
- 避免返回多种不相关类型：用结果封装：
  ```ts
  interface Result<T> { ok: boolean; data?: T; error?: string }
  ```
- 异步函数必须捕获错误并返回显式状态，不直接吞掉：
  ```ts
  try { /* ... */ } catch (e) { return { ok: false, error: String(e) }; }
  ```

## 7. 组合式 API（Vue 专属）
- 响应式变量使用 `ref`；集合或对象用 `reactive` 仅在需要深层响应时。
- 不要在 `setup` 外直接访问 props 的响应式值（防止语义歧义）。
- 计算值用 `computed` 而非手动 `watch`。`watch` 仅用于副作用。
- 返回对象中字段排序： state、derived/computed、methods。

## 8. 错误与异常
- 前端错误使用轻量结构：`{ message: string; code?: string }`。
- 不滥用 `throw`：UI 可恢复的场景使用返回值而非异常。
- 控制台输出：开发期允许 `console.warn` / `console.error`，禁止遗留无意义 `console.log`。

## 9. 类型推断与显式标注
- 能推断时不重复写类型：
  ```ts
  const count = ref(0); // 不需要 : Ref<number>
  ```
- 导出公共函数、库边界必须显式返回类型：
  ```ts
  export function filterByCategory(list: Destination[], c?: Category): Destination[] { /* ... */ }
  ```

## 10. 异步与 Promise
- 优先 `async/await`；避免 `.then().catch()` 链式吞错。
- 并发请求用 `Promise.allSettled` 而非 `all`（避免单点失败全部 reject）。
- 避免创建悬挂 Promise：都要有错误处理或超时策略。

## 11. 可维护性与重构提示
- 出现重复 3 次以上的类型/逻辑抽成函数或类型别名。
- 超过 150 行的 `.vue` 组件考虑拆分（逻辑与展示分离）。
- 多处使用的校验逻辑集中于 `utils/validation.ts`。

## 12. Tailwind 与类型协同
- 不在 TS 中硬编码样式字符串；样式逻辑条件放在模板或 `computed`。
- 动态类名拼接统一使用数组 + 过滤：
  ```ts
  const btnClass = computed(() => ['px-4','py-2', disabled ? 'opacity-50' : 'bg-primaryBlue'].join(' '));
  ```

## 13. 测试（Vitest）
- 单元测试命名：`<target>.test.ts`。
- 测试内容：
  - 纯逻辑（过滤、排序）必须测试。
  - 异步模拟：使用 `vi.useFakeTimers()` + 手动推进时间。
- 断言前先设置明确 Arrange / Act / Assert 区块注释。

## 14. 依赖与性能
- 避免引入庞大库只为单一函数（例如 lodash 全量）。
- 使用浏览器原生 API 优先（URL、Intl、fetch）。
- 路由懒加载保持默认；不要在根入口过多注册庞大模块。

## 15. 注释与文档
- 使用 JSDoc 为公共函数或复杂类型补充语义：
  ```ts
  /** 按关键字与分类同时过滤目的地 */
  export function search(list: Destination[], keyword: string, c?: Category): Destination[] { /* ... */ }
  ```
- 避免描述“显而易见”代码；注释关注原因与约束（Why / Invariant）。

## 16. 安全与防御
- 对用户输入统一先做裁剪：`value.trim()`。
- Email / 电话校验使用集中工具，不在组件散落正则。
- 与外部（未来 API）交互时对返回值做类型收窄：
  ```ts
  function isDestination(x: any): x is Destination { return typeof x?.id === 'string' && typeof x?.name === 'string'; }
  ```

## 17. 版本与演进
- 变更公共类型时：
  1. 更新 `types/` 文件
  2. 搜索引用并调整
  3. 补充或更新测试
  4. 描述在 README 或 CHANGELOG（如后续添加）

## 18. 常见反例（Anti-pattern）
| 反例 | 替代方案 |
|------|----------|
| 大量使用 `any` | 使用具体接口或 `unknown` + 类型守卫 |
| 在组件内写复杂数据转换 | 抽离到独立纯函数 + 单元测试 |
| 直接修改传入的 props 对象 | 创建局部副本或使用 `toRef` / `toRefs` |
| 多层嵌套可选链调用 | 分支守卫提前返回 |
| 模板中含大量三元嵌套 | 计算属性或拆子组件 |

## 19. 提交流程建议
1. 保证 `npm run test` 全部通过。
2. 运行类型检查（Vite 启动或 `tsc --noEmit`）。
3. 避免 ESLint/TSC 报错（后续可加 ESLint）。
4. 自查：是否有未使用的导出、是否能删除多余断言。

## 20. 示例片段整合
```ts
// types/destination.ts
export interface Destination { /* ... */ }

// composables/useDestinations.ts
export function useDestinations() {
  // state
  // ...existing code...
  // computed
  // ...existing code...
  // methods
  // ...existing code...
  return { /* 明确返回结构 */ };
}
```

---
持续改进：若团队规模扩大，可增加 ESLint + type-aware 规则（如 @typescript-eslint），以及自动生成 API 类型映射。
