import React from 'react';

// 状态徽章组件
export const StatusBadge = ({ status, type = 'agent' }) => {
  const configs = {
    agent: {
      online: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500 animate-pulse', label: '在线' },
      idle: { color: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500', label: '空闲' },
      busy: { color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500 animate-pulse', label: '执行中' },
      offline: { color: 'text-slate-500 bg-slate-100 border-slate-200', dot: 'bg-slate-400', label: '离线' },
    },
    project: {
      planning: { color: 'text-slate-600 bg-slate-100 border-slate-200', dot: 'bg-slate-500', label: '规划中' },
      in_progress: { color: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500 animate-pulse', label: '进行中' },
      completed: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: '已完成' },
    },
    req: {
      pending: { color: 'text-slate-600 bg-slate-100 border-slate-200', label: '待处理' },
      planning: { color: 'text-cyan-600 bg-cyan-50 border-cyan-200', label: '规划中' },
      in_development: { color: 'text-blue-600 bg-blue-50 border-blue-200', label: '研发中' },
      reviewing: { color: 'text-amber-600 bg-amber-50 border-amber-200', label: '评审中' },
      testing: { color: 'text-purple-600 bg-purple-50 border-purple-200', label: '测试中' },
    }
  };
  const config = configs[type][status] || configs[type][Object.keys(configs[type])[0]];
  return (
    <span className={`px-1.5 py-0.5 text-[10px] rounded-full border flex items-center gap-1 w-fit font-medium ${config.color}`}>
      {config.dot && <span className={`w-1 h-1 rounded-full ${config.dot}`}></span>}
      {config.label}
    </span>
  );
};

// 角色标签组件
export const RoleTag = ({ role }) => {
  const roleMap = {
    'project-manager': { label: '项目经理', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    'product-manager': { label: '产品经理', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    'frontend-developer': { label: '前端研发', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    'backend-developer': { label: '后端研发', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    'ui-designer': { label: 'UI 设计', color: 'text-pink-600 bg-pink-50 border-pink-200' },
    'qa-engineer': { label: '测试工程', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    'architect': { label: '架构师', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    'tech-lead': { label: '技术主管', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    'analyst': { label: '分析师', color: 'text-lime-600 bg-lime-50 border-lime-200' },
  };
  const config = roleMap[role] || { label: role, color: 'text-slate-600 bg-slate-100 border-slate-200' };
  return <span className={`px-1 py-0.5 text-[9px] uppercase rounded border font-medium ${config.color}`}>{config.label}</span>;
};

// 优先级标签组件
export const PriorityTag = ({ p }) => {
  const colors = {
    'P0': 'bg-red-50 text-red-600 border-red-200',
    'P1': 'bg-amber-50 text-amber-600 border-amber-200',
    'P2': 'bg-blue-50 text-blue-600 border-blue-200',
    'P3': 'bg-slate-50 text-slate-600 border-slate-200',
  };
  return <span className={`text-[9px] px-1 py-0.5 rounded border font-mono font-bold ${colors[p]}`}>{p}</span>;
};

// 需求类型标签组件
export const ReqTypeTag = ({ type }) => {
  const config = {
    'new': { label: '新增需求', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    'change': { label: '需求变更', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    'bug': { label: '缺陷修复', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  }[type] || { label: '未分类', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  return <span className={`text-[9px] px-1 py-0.5 rounded border font-bold flex-shrink-0 ${config.color}`}>{config.label}</span>;
};
