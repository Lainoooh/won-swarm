# UI 页面间距规范

## 白色底框容器规范

所有页面的主要白色内容区域使用以下统一样式：

```jsx
<div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm">
```

### 关键要点

1. **不使用外边距** - 移除 `m-2` 或其他 margin 类，让白色底框紧贴边框栏和顶栏
2. **背景** - `bg-white/70` 半透明白色背景
3. **边框** - `border border-white/60` 白色半透明边框
4. **圆角** - `rounded-xl` 大圆角
5. **阴影** - `shadow-sm` 轻微阴影

### 适用页面

- AgentList 页面 ✓
- ProjectList 页面 ✓
- RequirementTree 页面
- TaskBoard 页面
- 其他所有主要内容页面

## 统一效果

调整前：白色底框与侧边栏、顶栏之间有明显间隙（`m-2` 造成）
调整后：白色底框与侧边栏、顶栏无缝衔接，视觉更紧凑统一

---
创建时间：2026-03-23
相关讨论：AgentList 页面间距调整
