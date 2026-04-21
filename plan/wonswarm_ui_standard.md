# WonSwarm UI 开发规范

## 项目概述
WonSwarm - 多智能体协同开发平台

## 规范列表

### 1. 页面容器规范
**白色底框容器样式**
- 背景：`bg-white/70 backdrop-blur-2xl`
- 边框：`border border-white/60`
- 圆角：`rounded-xl`
- 阴影：`shadow-sm`
- **关键：不使用外边距（无 `m-2`）**，让内容区紧贴侧边栏和顶栏

**适用页面**：AgentList、ProjectList、RequirementTree、TaskBoard 等所有主内容页面

### 2. 字体大小规范
**统一使用 `text-xs` (12px) 作为标准字体大小**

#### 头部控制区
- 搜索框/输入框：`text-xs` + `rounded-lg` + `px-3 py-2`
- 按钮：`text-xs` + `rounded-lg` + `px-4 py-2`
- 图标：`size={14}`

#### 表格表头
- 字体：`text-xs font-bold text-slate-500`
- padding：`px-3 py-2` 或 `px-4 py-2.5`
- 边框：`border-slate-200/60`

#### 表格内容
- 字体：`text-xs`
- 单元格 padding：`px-4 py-2`
- 分隔线：`divide-slate-100`

#### 左侧边栏（项目列表）
- 标题：`text-xs` + 图标 `size={14}`
- 搜索框：`text-xs` + `rounded-lg`
- 列表项：`text-xs` + `rounded-lg`
- 底部信息：`text-xs`

### 3. Agent 卡片布局规范
**底部信息行布局**（同一行，左右分布）
- 左侧：角色标签 + "+ 数字" 悬停显示所有角色
- 右侧：复制 SK + 编辑 + 删除 按钮

**角色与 + 数字对齐方式**
- 父容器：`flex items-end gap-1`（底部对齐）
- 两个元素都用：`inline-flex items-center justify-center h-[18px]`
- 角色标签：`px-1 py-0.5 text-[9px]`
- + 数字框：`px-1 py-0.5 text-[8px]` 模仿原始 `ag-100` 框样式

**悬停效果**
- 边框变亮：`hover:border-blue-300`
- **无背景色高亮**（移除 `hover:bg-blue-50/80`）

### 4. 弹窗/Tooltip 规范
**+ 数字悬停显示所有角色**
- 定位：`absolute top-full left-0 mt-0.5`（元素下方显示）
- 样式：`bg-white border border-slate-200 rounded-lg shadow-lg p-1.5`
- 显示控制：`invisible group-hover:visible`

### 5. 组件统一规范
**RoleTag 组件**
```jsx
<span className={`inline-flex items-center justify-center px-1 py-0.5 text-[9px] uppercase rounded border font-bold h-[18px] leading-none ${config.color}`}>
```

**CopyIconBtn 组件**
- 位置：底部操作区右侧，紧挨编辑按钮左边
- 样式：与其他操作按钮高度一致

---

## 更新记录

| 日期 | 更新内容 |
|------|----------|
| 2026-03-23 | 初始版本：页面容器间距、Agent 卡片布局、角色对齐方案 |
| 2026-03-23 | 新增：统一字体大小规范（text-xs 标准），适用于所有页面头部、表格、边栏 |

---
创建时间：2026-03-23
最后更新：2026-03-23
