import React, { useState } from 'react';
import {
  Activity, Users, LayoutDashboard, KanbanSquare,
  FolderOpen, Settings, Bell, Search, Terminal,
  Plus, Play, Square, CheckCircle2, Circle, AlertCircle,
  Cpu, Network, Server, ChevronRight, ChevronLeft, X, FileText,
  Calendar, Filter, Clock, MoreVertical, Tag, Paperclip,
  ChevronDown, Layout, Code, CheckCircle, Flag,
  FileJson, PauseCircle, SkipForward, Ban, Box, GitMerge,
  PanelLeftClose, PanelLeftOpen, ArrowLeft,
  File as FileIcon, Image as ImageIcon, Eye, Edit, Trash2, Save
} from 'lucide-react';

// --- Mock Data ---
const mockAgents = [
  { id: 'ag-101', name: 'PC2-项目经理', roles: ['project-manager'], status: 'online', task: 'TASK-001', progress: 85, lastPing: '2s ago', sk: 'sk_x8f...2a', caps: ['task-decomposition'] },
  { id: 'ag-102', name: 'PC2-前端开发', roles: ['frontend-developer'], status: 'idle', task: null, progress: 0, lastPing: '5s ago', sk: 'sk_v2m...9p', caps: ['vue3', 'react'] },
  { id: 'ag-103', name: 'PC2-后端开发', roles: ['backend-developer'], status: 'busy', task: 'TASK-002', progress: 42, lastPing: '1s ago', sk: 'sk_q1l...5c', caps: ['fastapi', 'python'] },
  { id: 'ag-104', name: 'MAC-UI设计', roles: ['ui-designer'], status: 'offline', task: null, progress: 0, lastPing: '2h ago', sk: 'sk_p9k...1z', caps: ['figma'] },
  { id: 'ag-105', name: 'Server-测试专家', roles: ['qa-engineer'], status: 'online', task: 'TASK-003', progress: 10, lastPing: '1s ago', sk: 'sk_t5b...8r', caps: ['pytest', 'selenium'] },
];

const mockProjects = [
  { id: 'PROJ-001', name: '电商平台重构', status: 'in_progress', manager: 'PC2-项目经理', startDate: '2026-03-01', endDate: '2026-06-30', progress: 45, reqCount: 24, taskCount: 86 },
  { id: 'PROJ-002', name: '内部协同ERP系统', status: 'planning', manager: 'Admin', startDate: '2026-04-15', endDate: '2026-10-01', progress: 0, reqCount: 12, taskCount: 0 },
  { id: 'PROJ-003', name: 'OneSwarm 官网开发', status: 'completed', manager: 'PC2-项目经理', startDate: '2026-01-10', endDate: '2026-03-15', progress: 100, reqCount: 8, taskCount: 32 },
];

const mockReqTree = [
  {
    id: 'MOD-01', type: 'module', title: '用户认证中心', creator: 'Admin', docs: 2, expanded: true,
    children: [
      { id: 'FEAT-010', type: 'feature', reqType: 'new', title: '标准账号密码登录与注册', priority: 'P0', status: 'testing', creator: '产品经理', docs: 3, currentStep: 4 },
      { id: 'FEAT-011', type: 'feature', reqType: 'change', title: '第三方 OAuth 授权登录', priority: 'P1', status: 'in_development', creator: '产品经理', docs: 2, currentStep: 2 },
      { id: 'FEAT-012', type: 'feature', reqType: 'bug', title: '多因素认证 (MFA)', priority: 'P2', status: 'planning', creator: '安全专员', docs: 1, currentStep: 0 },
    ]
  },
  {
    id: 'MOD-02', type: 'module', title: '购物车与交易核心', creator: '架构师', docs: 1, expanded: true,
    children: [
      { id: 'FEAT-020', type: 'feature', reqType: 'new', title: '购物车性能优化 (缓存重构)', priority: 'P0', status: 'reviewing', creator: '产品经理', docs: 4, currentStep: 2 },
      { id: 'FEAT-021', type: 'feature', reqType: 'bug', title: '支付回调偶发失败修复', priority: 'P0', status: 'in_development', creator: '测试团队', docs: 2, currentStep: 4 },
    ]
  }
];

const mockTasks = [
  { id: 'TASK-001', reqId: 'FEAT-010', stepIdx: 0, title: '需求分析与用例拆解', project: '电商平台重构', status: 'completed', assignee: 'PC2-项目经理', priority: 'P1' },
  { id: 'TASK-002', reqId: 'FEAT-011', stepIdx: 2, title: '第三方登录API开发', project: '电商平台重构', status: 'in_progress', assignee: 'PC2-后端开发', priority: 'P0' },
  { id: 'TASK-003', reqId: 'FEAT-010', stepIdx: 5, title: '登录页面自动化测试脚本', project: '电商平台重构', status: 'todo', assignee: 'Server-测试专家', priority: 'P2' },
  { id: 'TASK-004', reqId: 'FEAT-020', stepIdx: 1, title: '商品详情页UI设计', project: '电商平台重构', status: 'completed', assignee: 'MAC-UI设计', priority: 'P1' },
  { id: 'TASK-005', reqId: 'FEAT-010', stepIdx: 4, title: '用户登录注册核心逻辑研发', project: '电商平台重构', status: 'in_progress', assignee: 'PC2-后端开发', priority: 'P0' },
];

const mockLogs = [
  "[10:00:01] WS CONNECTED: session-xyz agent: ag-101",
  "[10:00:05] TASK ASSIGNED: ag-103 -> TASK-002",
  "[10:00:12] HEARTBEAT ACK: ag-102 status: idle",
  "[10:00:15] PROGRESS UPDATE: ag-101 (85%)",
  "[10:00:22] HEARTBEAT ACK: ag-105 status: online",
];

// --- Shared Components ---

const StatusBadge = ({ status, type = 'agent' }) => {
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

const RoleTag = ({ role }) => {
  const roleMap = {
    'project-manager': { label: '项目经理', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    'product-manager': { label: '产品经理', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    'frontend-developer': { label: '前端研发', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    'backend-developer': { label: '后端研发', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    'ui-designer': { label: 'UI设计', color: 'text-pink-600 bg-pink-50 border-pink-200' },
    'qa-engineer': { label: '测试工程', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  };
  const config = roleMap[role] || { label: role, color: 'text-slate-600 bg-slate-100 border-slate-200' };
  return <span className={`px-1 py-0.5 text-[9px] uppercase rounded border font-medium ${config.color}`}>{config.label}</span>;
};

const PriorityTag = ({ p }) => {
  const colors = {
    'P0': 'bg-red-50 text-red-600 border-red-200',
    'P1': 'bg-amber-50 text-amber-600 border-amber-200',
    'P2': 'bg-blue-50 text-blue-600 border-blue-200',
    'P3': 'bg-slate-50 text-slate-600 border-slate-200',
  };
  return <span className={`text-[9px] px-1 py-0.5 rounded border font-mono font-bold ${colors[p]}`}>{p}</span>;
}

const ReqTypeTag = ({ type }) => {
  const config = {
    'new': { label: '新增需求', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    'change': { label: '需求变更', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    'bug': { label: '缺陷修复', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  }[type] || { label: '未分类', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  return <span className={`text-[9px] px-1 py-0.5 rounded border font-bold flex-shrink-0 ${config.color}`}>{config.label}</span>;
};

// --- Modals ---

// Custom Modal with optimized h-[88vh] for proper breathing room
const Modal = ({ title, onClose, children, footer, size = 'default', zIndex = 'z-50', heightClass = 'h-[88vh] max-h-[88vh]' }) => {
  const sizeClass = size === '2xl' ? 'w-[90vw] max-w-[1400px]' : size === 'xl' ? 'w-[1050px]' : size === 'large' ? 'w-[850px]' : 'w-[500px]';
  return (
    <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center ${zIndex} animate-in fade-in duration-200 px-4`}>
      <div className={`bg-white/95 backdrop-blur-2xl border border-white/60 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${sizeClass} ${heightClass}`}>
        <div className="flex justify-between items-center p-2.5 border-b border-white/40 bg-white/40 shrink-0">
          <div className="text-sm font-bold text-slate-800">{title}</div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white/50 rounded-md p-1 hover:bg-white border border-white/50 shadow-sm"><X size={14} /></button>
        </div>
        <div className="p-2.5 overflow-y-auto custom-scrollbar bg-transparent flex flex-col flex-1 min-h-0">
          {children}
        </div>
        {footer && (
          <div className="p-2.5 border-t border-white/40 bg-white/40 flex justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const AttachmentModal = ({ item, onClose }) => {
  const [selectedDoc, setSelectedDoc] = useState(0);
  const docs = [
    { id: 1, name: `${item.title}-详细设计.md`, type: 'md', size: '15 KB', date: '2026-03-22', content: `# ${item.title} 详细设计\n\n## 1. 架构概览\n本模块主要采用微服务架构，并且使用 WebSocket 建立与 Agent 的长连接通信集群。\n\n## 2. 接口设计\n\`\`\`json\n{\n  "status": 200,\n  "message": "success",\n  "data": {\n     "session": "x8f2_uuid_ab9"\n  }\n}\n\`\`\`` },
    { id: 2, name: `${item.title}-原型交互图.pdf`, type: 'pdf', size: '2.4 MB', date: '2026-03-21', content: 'PDF 预览组件渲染区域' },
  ];
  const currentDoc = docs[selectedDoc];

  return (
    <Modal size="large" zIndex="z-[70]" title={<div className="flex items-center gap-1.5"><Paperclip size={14} className="text-blue-600"/> <span>{item.title} - 附件归档库</span></div>} onClose={onClose}>
      <div className="flex h-full border border-slate-200/60 rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm shadow-inner shrink-0">
        <div className="w-1/3 border-r border-slate-200/60 bg-slate-50/50 flex flex-col shrink-0">
          <div className="p-2 border-b border-slate-200/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">文件列表 ({docs.length})</div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-1">
            {docs.map((doc, idx) => (
              <div key={doc.id} onClick={() => setSelectedDoc(idx)} className={`p-2 rounded-md cursor-pointer transition-all border ${selectedDoc === idx ? 'bg-white border-blue-200 shadow-sm' : 'border-transparent hover:bg-slate-100/50'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  {doc.type === 'md' ? <FileText size={14} className="text-blue-500 shrink-0"/> : <FileIcon size={14} className="text-rose-500 shrink-0"/>}
                  <span className={`text-xs font-bold truncate ${selectedDoc === idx ? 'text-blue-700' : 'text-slate-700'}`}>{doc.name}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 pl-5">
                  <span>{doc.size}</span><span>{doc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 bg-white/80 flex flex-col relative overflow-hidden">
          <div className="p-2.5 border-b border-slate-200/60 flex justify-between items-center bg-white/90 backdrop-blur-md z-10 shrink-0">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              {currentDoc.type === 'md' ? <FileText size={14} className="text-blue-500"/> : <FileIcon size={14} className="text-rose-500"/>}
              <span className="truncate max-w-[300px]">{currentDoc.name}</span>
            </span>
            <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm">下载原件</button>
          </div>
          <div className="flex-1 overflow-auto p-4 custom-scrollbar z-10">
            {currentDoc.type === 'md' ? (
              <div className="text-slate-700 h-full">
                 <pre className="bg-[#1e293b] text-slate-300 p-4 rounded-lg text-xs font-mono whitespace-pre-wrap shadow-inner border border-slate-700 h-full">{currentDoc.content}</pre>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <ImageIcon size={40} className="text-slate-300 mb-3" />
                <span className="text-slate-600 font-bold text-sm">PDF 文档渲染区域</span>
                <span className="text-[10px] font-medium text-slate-400 mt-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">支持多页平滑滚动与矢量缩放</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Wizard Modal for Requirement Creation
const CreateRequirementModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const [features, setFeatures] = useState([
    { id: 1, name: '多端自适应布局', priority: 'P1', desc: '支持在移动端和PC端无缝切换，保证交互体验一致。', isEditing: false },
    { id: 2, name: '数据看板图表展示', priority: 'P0', desc: '集成 ECharts，提供基础的折线图、柱状图数据渲染。', isEditing: false }
  ]);

  const targetPhases = ['UI设计', '概要设计', '详细设计', '系统研发', '系统测试'];
  const [selectedFeatureIds, setSelectedFeatureIds] = useState(new Set());
  const [phaseAssignments, setPhaseAssignments] = useState({
    'UI设计': [], '概要设计': [], '详细设计': [], '系统研发': [], '系统测试': []
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  React.useEffect(() => {
    if (step === 3 && selectedFeatureIds.size === 0 && features.length > 0) {
      setSelectedFeatureIds(new Set(features.map(f => f.id)));
    }
  }, [step, features, selectedFeatureIds.size]);

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult("### 需求分析报告\n\n根据您提供的 Prompt，已为您提炼以下核心方向：\n\n1. **技术栈要求**：需要基于 React + Tailwind CSS 构建。\n2. **交互重点**：必须包含极速的响应式体验与暗色/亮色切换可能。\n3. **拆解建议**：建议将基础架构与业务模块分步迭代...");
    }, 1500);
  };

  const addFeature = () => setFeatures([...features, { id: Date.now(), name: '', priority: 'P2', desc: '', isEditing: true }]);
  const toggleEdit = (id) => setFeatures(features.map(f => f.id === id ? { ...f, isEditing: !f.isEditing } : f));
  const deleteFeature = (id) => setFeatures(features.filter(f => f.id !== id));
  const toggleFeatureSelection = (id) => {
    const newSet = new Set(selectedFeatureIds);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedFeatureIds(newSet);
  };
  const toggleAllFeatures = () => {
    if (selectedFeatureIds.size === features.length) setSelectedFeatureIds(new Set());
    else setSelectedFeatureIds(new Set(features.map(f => f.id)));
  };
  const toggleAgentSelection = (phase, agentId) => {
    setPhaseAssignments(prev => {
      const list = prev[phase];
      if (list.includes(agentId)) return { ...prev, [phase]: list.filter(id => id !== agentId) };
      return { ...prev, [phase]: [...list, agentId] };
    });
  };

  return (
    <Modal size="2xl" title={<div className="flex items-center gap-1.5"><Plus size={16} className="text-blue-600"/> <span className="text-sm">新增需求大纲流程</span></div>} onClose={onClose}>
      <div className="flex flex-col h-full min-h-0">
        {/* Wizard Stepper Header */}
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-3 rounded-lg border border-slate-200/60 shadow-sm shrink-0 mb-4">
           {[
             { num: 1, label: '需求录入与分析' },
             { num: 2, label: '功能点拆解' },
             { num: 3, label: '任务派遣' }
           ].map((s, i) => (
             <div key={s.num} className="flex items-center gap-2 flex-1">
               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s.num ? 'bg-blue-600 text-white shadow-md' : step > s.num ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                 {step > s.num ? <CheckCircle2 size={12}/> : s.num}
               </div>
               <span className={`text-[11px] font-bold ${step === s.num ? 'text-blue-700' : step > s.num ? 'text-emerald-700' : 'text-slate-500'}`}>{s.label}</span>
               {i < 2 && <div className="flex-1 h-px bg-slate-300/60 mx-4"></div>}
             </div>
           ))}
        </div>

        {/* Step Content Area */}
        {step === 1 && (
          <div className="flex gap-4 flex-1 min-h-0">
            <div className="w-1/2 flex flex-col gap-3 bg-white/60 p-3 rounded-lg border border-slate-200/60 shadow-sm">
               <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-slate-500">需求名称</label>
                 <input type="text" className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400" placeholder="例如：新版工作台重构..." />
               </div>
               <div className="flex flex-col gap-1 flex-1">
                 <label className="text-[10px] font-bold text-slate-500">需求描述 Prompt</label>
                 <textarea className="w-full flex-1 text-xs text-slate-800 bg-white border border-slate-200 rounded p-2.5 focus:outline-none focus:border-blue-400 resize-none custom-scrollbar" placeholder="详细描述该需求的背景、目标与约束..."></textarea>
               </div>
               <div className="flex items-center gap-2 mt-auto">
                 <div className="flex flex-col gap-1 flex-1">
                   <label className="text-[10px] font-bold text-slate-500">指定 Agent</label>
                   <select className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400">
                     <option>PC2-项目经理</option>
                     <option>Admin</option>
                   </select>
                 </div>
                 <button onClick={handleAnalysis} className="mt-4 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5 shrink-0">
                   {isAnalyzing ? <Circle size={14} className="animate-spin"/> : <Play size={14}/>} 进行需求分析
                 </button>
               </div>
            </div>

            <div className="w-1/2 bg-[#1e293b] rounded-lg shadow-inner border border-slate-700 p-4 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <Terminal size={14} className="text-cyan-400"/>
                <span className="text-xs font-bold text-slate-200">Agent 分析结果预览</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar-dark text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                {analysisResult || <span className="text-slate-500 italic">等待发起分析...</span>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3 flex-1 min-h-0">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-2 text-xs text-slate-600 font-mono shadow-sm shrink-0">
              <FileText size={14} className="text-blue-500"/> 读取需求文档：<span className="font-bold text-slate-800">/docs/req-analytics-001.md</span>
            </div>

            <div className="flex items-center justify-between shrink-0">
              <h4 className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5"><Box size={14} className="text-indigo-500"/> 功能列表清单</h4>
              <button onClick={addFeature} className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors shadow-sm"><Plus size={12}/> 新增功能</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100 shadow-inner">
              {features.map(f => (
                <div key={f.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col gap-2 relative group hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-2 flex-1">
                       <GitMerge size={14} className="text-cyan-500 shrink-0"/>
                       {f.isEditing ? (
                         <input type="text" defaultValue={f.name} className="flex-1 text-xs font-bold bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-400" placeholder="功能名称"/>
                       ) : (
                         <span className="text-xs font-bold text-slate-800">{f.name || '未命名功能'}</span>
                       )}
                     </div>
                     <div className="flex items-center gap-2 shrink-0">
                       {f.isEditing ? (
                         <select defaultValue={f.priority} className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-1 py-1 focus:outline-none">
                           <option>P0</option><option>P1</option><option>P2</option>
                         </select>
                       ) : <PriorityTag p={f.priority}/>}
                     </div>
                     <div className="flex items-center gap-1.5 shrink-0 transition-opacity">
                       {f.isEditing ? (
                         <button onClick={() => toggleEdit(f.id)} className="p-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100" title="保存"><Save size={14}/></button>
                       ) : (
                         <button onClick={() => toggleEdit(f.id)} className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="编辑"><Edit size={14}/></button>
                       )}
                       <button onClick={() => deleteFeature(f.id)} className="p-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100" title="删除"><Trash2 size={14}/></button>
                     </div>
                  </div>
                  {f.isEditing ? (
                    <textarea defaultValue={f.desc} className="w-full text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:border-blue-400 resize-none h-16 custom-scrollbar" placeholder="功能描述..." />
                  ) : (
                    <div className="text-[10px] text-slate-500 ml-5">{f.desc || '暂无描述信息'}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex h-full gap-4 flex-1 min-h-0 bg-white/40 border border-slate-200/60 rounded-xl p-3 shadow-sm">
             {/* 左侧：功能列表 */}
             <div className="w-1/3 flex flex-col gap-2 h-full">
               <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 shrink-0">
                 <input
                   type="checkbox"
                   className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shadow-sm"
                   checked={selectedFeatureIds.size > 0 && selectedFeatureIds.size === features.length}
                   onChange={toggleAllFeatures}
                 />
                 <span className="text-[11px] font-bold text-slate-700">待指派功能 ({selectedFeatureIds.size}/{features.length})</span>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                 {features.map(f => (
                   <div key={f.id} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors cursor-pointer ${selectedFeatureIds.has(f.id) ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-200 hover:border-blue-200'}`} onClick={() => toggleFeatureSelection(f.id)}>
                     <input
                       type="checkbox"
                       className="w-3 h-3 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shadow-sm pointer-events-none"
                       checked={selectedFeatureIds.has(f.id)}
                       onChange={() => {}}
                     />
                     <div className="flex flex-col flex-1 min-w-0">
                       <span className="text-[11px] font-bold text-slate-800 truncate">{f.name || '未命名功能'}</span>
                     </div>
                     <PriorityTag p={f.priority} />
                   </div>
                 ))}
               </div>
             </div>

             {/* 分隔线 */}
             <div className="w-px bg-slate-200/60 shrink-0"></div>

             {/* 右侧：研发节点分配 */}
             <div className="flex-1 flex flex-col gap-3 min-h-0">
               <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-[11px] text-slate-600 flex items-center gap-1.5 shadow-sm shrink-0">
                 <Activity size={14} className="text-blue-500"/>
                 <span className="font-bold text-blue-700">为已选中的功能配置工作流 Agent (支持多选)</span>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                 <div className="grid grid-cols-2 gap-3 pb-24">
                   {targetPhases.map(phase => (
                     <div key={phase} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col gap-2 transition-colors relative">
                       <div className="flex items-center justify-between">
                         <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5"><Box size={14} className="text-indigo-500"/> {phase}</span>
                         <Cpu size={12} className="text-slate-400"/>
                       </div>

                       {/* Custom Multi-select Dropdown */}
                       <div
                         className="min-h-[32px] mt-1 text-[11px] bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors rounded-lg px-2 py-1.5 flex flex-wrap gap-1.5 cursor-pointer relative items-center"
                         onClick={() => setOpenDropdown(openDropdown === phase ? null : phase)}
                       >
                          {phaseAssignments[phase].length === 0 ? (
                            <span className="text-slate-400 select-none flex-1">选择执行 Agent...</span>
                          ) : (
                            phaseAssignments[phase].map(agId => {
                              const ag = mockAgents.find(a => a.id === agId);
                              return (
                                <span key={agId} className="bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                  {ag?.name.split('-')[1] || ag?.name}
                                </span>
                              )
                            })
                          )}
                          <ChevronDown size={12} className="text-slate-400 shrink-0 ml-auto"/>
                       </div>

                       {/* Dropdown Panel */}
                       {openDropdown === phase && (
                         <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                           {mockAgents.map(ag => (
                             <label key={ag.id} className={`flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors ${phaseAssignments[phase].includes(ag.id) ? 'bg-blue-50/50' : ''}`}>
                               <input
                                 type="checkbox"
                                 className="w-3 h-3 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                 checked={phaseAssignments[phase].includes(ag.id)}
                                 onChange={() => toggleAgentSelection(phase, ag.id)}
                               />
                               <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-slate-800">{ag.name}</span>
                                 <div className="flex gap-1 mt-0.5">
                                    <RoleTag role={ag.roles[0]} />
                                 </div>
                               </div>
                             </label>
                           ))}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/60 shrink-0">
           <button
             onClick={() => step > 1 ? setStep(step - 1) : onClose()}
             className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
           >
             {step > 1 ? '上一步' : '取消'}
           </button>
           <button
             onClick={() => step < 3 ? setStep(step + 1) : onClose()}
             className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors"
           >
             {step < 3 ? '下一步' : '完成分配并创建大纲'} {step < 3 && <ChevronRight size={14}/>}
           </button>
        </div>
      </div>
    </Modal>
  );
};

const TaskDetailModal = ({ task, onClose }) => {
  return (
    <Modal size="large" zIndex="z-[60]" title={<div className="flex items-center gap-1"><Activity size={12} className="text-blue-500"/> <span className="font-mono text-[9px] text-slate-500 bg-white border border-slate-200 px-1 rounded shadow-sm">{task.id}</span> <span className="text-xs">任务详情及编辑</span></div>} onClose={onClose}>
      <div className="flex flex-col h-full gap-2 flex-1 min-h-0">
        <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-md p-2 shadow-sm relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-400 rounded-full blur-[60px] opacity-10 -mr-8 -mt-8"></div>
          <div className="flex items-center gap-1.5 relative z-10">
            <label className="text-[10px] font-bold text-slate-500 whitespace-nowrap">标题</label>
            <input
              type="text"
              defaultValue={task.title}
              className="flex-1 text-sm font-black text-slate-800 bg-white/50 border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:border-blue-400 shadow-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 relative z-10 mt-1.5 ml-6">
            <span className="flex items-center gap-0.5"><FolderOpen size={10} className="text-blue-400"/> {task.project}</span>
            <div className="w-px h-2.5 bg-slate-300"></div>
            <span className="flex items-center gap-0.5"><GitMerge size={10} className="text-cyan-500"/> 关联大纲: {task.reqId}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 shrink-0">
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-md p-2 shadow-sm flex flex-col">
            <div className="text-[9px] font-bold text-slate-500 mb-1">指派 Agent</div>
            <select className="w-full text-[11px] font-bold text-slate-800 bg-white/50 border border-slate-200 rounded focus:outline-none focus:border-blue-400 cursor-pointer shadow-sm px-1.5 py-1">
               <option>{task.assignee}</option>
               <option>PC2-前端开发</option>
               <option>Server-测试专家</option>
               <option>PC2-项目经理</option>
            </select>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-md p-2 shadow-sm flex flex-col">
            <div className="text-[9px] font-bold text-slate-500 mb-1">当前状态</div>
            <div className="flex mt-auto">
              <span className={`px-1.5 py-1 text-[10px] rounded flex items-center gap-0.5 w-fit font-bold border ${task.status === 'completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : task.status === 'in_progress' ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                {task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '执行中' : '待处理'}
              </span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-md p-2 shadow-sm flex flex-col">
            <div className="text-[9px] font-bold text-slate-500 mb-1">任务优先级</div>
            <select className="w-full mt-auto text-[11px] font-mono font-bold text-slate-800 bg-white/50 border border-slate-200 rounded focus:outline-none focus:border-blue-400 cursor-pointer shadow-sm px-1.5 py-1">
               <option>{task.priority}</option>
               <option>P0</option>
               <option>P1</option>
               <option>P2</option>
               <option>P3</option>
            </select>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-md p-2 shadow-sm flex flex-col">
            <div className="text-[9px] font-bold text-slate-500 mb-1">要求截止时间</div>
            <input type="date" defaultValue="2026-03-25" className="w-full mt-auto text-[11px] font-bold text-slate-800 font-mono bg-white/50 border border-slate-200 rounded focus:outline-none focus:border-blue-400 cursor-pointer shadow-sm px-1.5 py-1" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-md p-2 shadow-sm text-xs text-slate-700 flex flex-col flex-1 min-h-[150px]">
           <div className="font-bold text-[10px] text-slate-500 mb-1.5 flex items-center gap-1 shrink-0"><FileText size={12}/> 任务详细指导约束 (Prompts / Specs)</div>
           <textarea
             className="w-full p-2 bg-white/50 border border-slate-200 rounded text-[11px] leading-relaxed shadow-inner focus:outline-none focus:border-blue-400 custom-scrollbar transition-colors flex-1 resize-none min-h-[150px]"
             defaultValue={task.id === 'NEW-TASK' ? '' : "该子任务由系统自动从功能拆解而来。请执行指定的研发或设计动作。\n\n1. 分析需求文档并生成概要设计。\n2. 根据规范编写 API 接口文档。\n3. 建立单元测试用例基线。\n4. 补充边界条件逻辑和测试代码。\n5. ... 其他额外约束指令。"}
             placeholder="输入提供给 Agent 执行的具体指令和上下文约束..."
           ></textarea>
        </div>

        <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/40 shrink-0">
           <button className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-colors">
             <Ban size={12} /> 取消任务
           </button>
           <div className="flex items-center gap-2">
             <button className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-colors">
               <PauseCircle size={12} /> 叫停任务
             </button>
             <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-colors">
               <SkipForward size={12} /> 推进任务
             </button>
             <button className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all">
               <CheckCircle2 size={12} /> 保存并重新下发
             </button>
           </div>
        </div>
      </div>
    </Modal>
  );
};

const FeatureFlowModal = ({ feature, onClose }) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());
  const [viewingTask, setViewingTask] = useState(null);

  const actualStepIdx = feature.currentStep || 0;
  const [viewedStepIdx, setViewedStepIdx] = useState(actualStepIdx);

  const steps = [
    { icon: FileText, label: '需求设计' },
    { icon: Layout, label: 'UI设计' },
    { icon: FileJson, label: '概要设计' },
    { icon: Code, label: '详细设计' },
    { icon: Terminal, label: '系统研发' },
    { icon: CheckCircle, label: '系统测试' },
    { icon: Flag, label: '项目验收' }
  ];

  const featureTasks = mockTasks.filter(t => t.reqId === feature.id && t.stepIdx === viewedStepIdx);
  const canOperate = viewedStepIdx === actualStepIdx;

  const toggleTaskSelection = (taskId) => {
    const newSet = new Set(selectedTaskIds);
    if (newSet.has(taskId)) newSet.delete(taskId);
    else newSet.add(taskId);
    setSelectedTaskIds(newSet);
  };

  const toggleAllTasks = () => {
    if (selectedTaskIds.size === featureTasks.length) setSelectedTaskIds(new Set());
    else setSelectedTaskIds(new Set(featureTasks.map(t => t.id)));
  };

  return (
    <>
      <Modal size="xl" zIndex="z-50" title={<div className="flex items-center gap-1.5"><GitMerge size={14} className="text-cyan-500"/> <span className="font-mono text-[10px] text-slate-500 bg-white border border-slate-200 px-1 rounded">{feature.id}</span> 大纲流程协同控制</div>} onClose={onClose}>
        <div className="flex flex-col h-full gap-2.5 min-h-0 px-1 pb-1">

          <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-xl p-3 relative overflow-hidden shadow-sm shrink-0">
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white shadow-sm border border-white rounded-lg"><FileText size={18} className="text-blue-600" /></div>
              <div>
                <h2 className="text-sm font-black text-slate-800">{feature.title} - {steps[viewedStepIdx].label}</h2>
                <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 mt-0.5">
                  全局所处阶段 <span className="px-1 py-0.5 bg-white border border-slate-200 rounded-full flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-slate-400"></span> {steps[actualStepIdx].label}</span>
                  {!canOperate && <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold border border-slate-200">当前视图为历史/未来节点，禁止操作</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl p-2.5 shadow-sm overflow-x-auto custom-scrollbar shrink-0">
            {steps.map((step, idx) => {
              const isCompleted = idx < actualStepIdx;
              const isCurrentProgress = idx === actualStepIdx;
              const isSelected = idx === viewedStepIdx;
              const StepIcon = step.icon;
              return (
                <React.Fragment key={step.label}>
                  <div
                    onClick={() => setViewedStepIdx(idx)}
                    className={`flex flex-col items-center gap-1.5 flex-shrink-0 w-14 cursor-pointer transition-all ${isSelected ? 'scale-110 opacity-100' : 'hover:scale-105 opacity-80 hover:opacity-100'} ${!isCompleted && !isCurrentProgress && !isSelected ? 'grayscale opacity-50' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center relative transition-all ${
                      isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-50' : ''
                    } ${
                      isCompleted ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' :
                      isCurrentProgress ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] text-blue-600' :
                      'bg-slate-50 border border-slate-200 text-slate-400'
                    }`}>
                      <StepIcon size={14} strokeWidth={isSelected || isCurrentProgress ? 2.5 : 2} />
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-md z-10">
                          <CheckCircle2 size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-blue-700' : isCurrentProgress ? 'text-blue-600' : isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>{step.label}</span>
                  </div>
                  {idx < steps.length - 1 && <div className="flex-1 h-0.5 bg-slate-100 rounded-full mx-1 relative min-w-[10px]"><div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400" style={{opacity: isCompleted ? 1 : 0}}></div></div>}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center justify-between py-0.5 shrink-0">
             <button disabled={!canOperate} className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-colors ${canOperate ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-50 cursor-not-allowed'}`}>
               <Ban size={12} /> 取消流程
             </button>
             <div className="flex items-center gap-2">
               <button disabled={!canOperate} className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-colors ${canOperate ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-50 cursor-not-allowed'}`}>
                 <PauseCircle size={12} /> 叫停并挂起
               </button>
               <button disabled={!canOperate} className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all ${canOperate ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white' : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed border border-transparent'}`}>
                 <SkipForward size={12} /> 推进到下一阶段
               </button>
             </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-0 bg-white/40 border border-white/60 rounded-xl p-2.5 shadow-sm">
            <div className="flex items-center justify-between shrink-0 mb-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={!canOperate}
                  className="w-3 h-3 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer shadow-sm disabled:opacity-50"
                  checked={featureTasks.length > 0 && selectedTaskIds.size === featureTasks.length}
                  onChange={toggleAllTasks}
                />
                <h4 className="text-[10px] font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity size={12} className="text-blue-500"/> 【{steps[viewedStepIdx].label}】 节点拆解子任务
                </h4>
              </div>
              <div className="flex items-center gap-2">
                {selectedTaskIds.size > 0 && <span className="text-[9px] font-medium text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">已选 {selectedTaskIds.size} 项</span>}
                <button
                  disabled={!canOperate}
                  onClick={() => setViewingTask({ id: 'NEW-TASK', title: '新建研发子任务...', project: '当前项目', reqId: feature.id, status: 'todo', priority: 'P2', assignee: '未分配' })}
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors shadow-sm ${canOperate ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100' : 'text-slate-400 bg-slate-100 border border-slate-200 opacity-50 cursor-not-allowed'}`}
                >
                  + 新建子任务
                </button>
              </div>
            </div>

            {featureTasks.length > 0 ? (
              <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-[100px]">
                {featureTasks.map(task => (
                  <div key={task.id} className={`bg-white/80 backdrop-blur-sm border ${canOperate ? 'hover:border-blue-200' : 'border-white/60'} rounded-lg p-2.5 shadow-sm flex items-center gap-3 group transition-colors`}>
                    <input
                      type="checkbox"
                      disabled={!canOperate}
                      className="w-3 h-3 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer shrink-0 shadow-sm disabled:opacity-50"
                      checked={selectedTaskIds.has(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                    />
                    <div className="flex flex-col w-[30%] min-w-0">
                      <span className={`text-[11px] font-bold text-slate-800 truncate ${canOperate ? 'group-hover:text-blue-600' : ''} transition-colors`} title={task.title}>{task.title}</span>
                      <span className="text-[8px] font-mono text-slate-400 mt-0.5">{task.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 w-[20%] shrink-0">
                      <Cpu size={12} className={task.status === 'todo' ? 'text-slate-400' : 'text-blue-500'}/>
                      <span className="text-[10px] font-medium text-slate-600 truncate" title={task.assignee}>{task.assignee}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 w-[25%] shrink-0">
                      <div className="flex-1 h-1.5 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{width: task.status === 'completed' ? '100%' : task.status === 'in_progress' ? '45%' : '0%'}}></div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 w-8 text-right">
                        {task.status === 'completed' ? '100%' : task.status === 'in_progress' ? '45%' : '0%'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                       <span className={`text-[9px] px-2 py-0.5 rounded font-bold w-14 text-center ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : task.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                         {task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '执行中' : '待处理'}
                       </span>
                       <button onClick={() => setViewingTask(task)} className="p-1.5 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded border border-slate-200 hover:border-blue-200 transition-all shadow-sm" title="查看任务详情">
                          <Eye size={14} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/50 border border-dashed border-slate-300/60 rounded-lg flex flex-col items-center justify-center flex-1 min-h-[100px] gap-2">
                <span className="text-xs font-bold text-slate-500">【{steps[viewedStepIdx].label}】阶段暂无拆解任务</span>
                {canOperate && <span className="text-[10px] font-medium text-slate-400">请点击右上方按钮分配 Agent 新建执行子任务</span>}
              </div>
            )}
          </div>

          <div className="shrink-0 bg-white/40 border border-white/60 rounded-xl p-2.5 shadow-sm">
            <h4 className="text-[11px] font-bold text-slate-800 mb-1.5 flex items-center gap-2">全局流转日志 <span className="text-[9px] font-normal text-slate-500">(1 条)</span></h4>
            <div className="border-l-2 border-slate-200 ml-1.5 pl-2.5 py-0.5 relative">
               <div className="absolute w-2 h-2 bg-amber-400 rounded-full -left-[5px] top-1 shadow-[0_0_0_3px_#f8fafc]"></div>
               <div className="flex gap-2.5 items-start">
                 <span className="text-[9px] text-slate-400 font-mono mt-0.5 bg-white px-1 rounded border border-slate-100 shadow-sm">13:01</span>
                 <div>
                   <div className="text-[10px] font-bold text-slate-800 flex items-center gap-1.5">
                     <span className="text-amber-600 bg-amber-50 px-1 rounded">调度中心</span> <span className="text-slate-300">→</span> <span className="text-blue-600 bg-blue-50 px-1 rounded">所有 Agent</span>
                   </div>
                   <div className="text-[10px] text-slate-600 mt-1 bg-white/80 p-1.5 rounded border border-white shadow-sm">
                      <span className="font-bold">指令：</span>正在初始化需求分解流，并分派执行规范...
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </Modal>
      {viewingTask && <TaskDetailModal task={viewingTask} onClose={() => setViewingTask(null)} />}
    </>
  );
};

const Dashboard = () => (
  <div className="flex-1 overflow-hidden flex flex-col gap-2">
    <div className="grid grid-cols-4 gap-2 shrink-0">
      {[
        { title: '在线 Agent', value: '4/5', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50/80' },
        { title: '并发任务数', value: '12', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50/80' },
        { title: 'WS 连接数', value: '8', icon: Network, color: 'text-cyan-600', bg: 'bg-cyan-50/80' },
        { title: '系统负载', value: '34%', icon: Server, color: 'text-emerald-600', bg: 'bg-emerald-50/80' },
      ].map((stat, i) => {
        const StatIcon = stat.icon;
        return (
          <div key={i} className="bg-white/70 backdrop-blur-2xl border border-white/60 p-3 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <div className="text-slate-500 text-[10px] mb-0.5 font-bold">{stat.title}</div>
              <div className="text-lg font-black text-slate-800">{stat.value}</div>
            </div>
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} shadow-inner`}>
              <StatIcon size={16} strokeWidth={2.5} />
            </div>
          </div>
        )
      })}
    </div>

    <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
      <div className="col-span-2 bg-white/70 backdrop-blur-2xl border border-white/60 rounded-xl p-3 flex flex-col shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 shrink-0">
          <Network size={14} className="text-blue-600"/>
          实时拓扑结构
        </h3>
        <div className="flex-1 bg-white/40 rounded-lg border border-white/60 relative flex items-center justify-center overflow-hidden shadow-inner min-h-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] flex items-center justify-between scale-[0.8] lg:scale-100">
            <div className="z-10 bg-white/90 backdrop-blur-md border border-blue-200 p-3 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col items-center">
              <Server size={24} className="text-blue-600 mb-1.5" />
              <span className="text-[10px] font-bold text-slate-800">协同调度中心</span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5">Port: 30009</span>
            </div>

            <div className="absolute inset-0 flex justify-between items-center px-10">
              <div className="space-y-8">
                {[mockAgents[0], mockAgents[1]].map((agent, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-white/90 backdrop-blur-sm border border-white p-2 rounded-lg flex flex-col items-center w-20 shadow-sm z-10">
                      <Cpu size={16} className={agent.status === 'online' ? 'text-emerald-500' : 'text-slate-400'} />
                      <span className="text-[9px] font-medium text-slate-700 mt-1 truncate w-full text-center">{agent.name}</span>
                    </div>
                    <div className={`w-20 h-px border-t-2 border-dashed ${agent.status === 'online' ? 'border-emerald-400/50' : 'border-slate-300/50'}`}></div>
                  </div>
                ))}
              </div>
              <div className="space-y-8">
                {[mockAgents[2], mockAgents[4]].map((agent, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-20 h-px border-t-2 border-dashed ${agent.status === 'online' ? 'border-emerald-400/50' : 'border-slate-300/50'}`}></div>
                    <div className="bg-white/90 backdrop-blur-sm border border-white p-2 rounded-lg flex flex-col items-center w-20 shadow-sm z-10">
                      <Cpu size={16} className={agent.status === 'online' || agent.status === 'busy' ? 'text-blue-500' : 'text-emerald-500'} />
                      <span className="text-[9px] font-medium text-slate-700 mt-1 truncate w-full text-center">{agent.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b]/90 backdrop-blur-2xl border border-slate-700/50 rounded-xl p-3 flex flex-col font-mono text-[10px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>
        <h3 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5 font-sans shrink-0">
          <Terminal size={14} className="text-cyan-400"/>
          WebSocket 控制台
        </h3>
        <div className="flex-1 overflow-y-auto space-y-1.5 text-slate-400 custom-scrollbar-dark pr-1.5">
          {mockLogs.map((log, i) => (
            <div key={i} className="border-l-2 border-slate-700/50 pl-2 py-0.5 hover:bg-slate-800/30 transition-colors">
              <span className="text-slate-500 mr-1.5">{log.substring(0, 10)}</span>
              <span className={log.includes('CONNECTED') ? 'text-emerald-400' : log.includes('TASK') ? 'text-blue-400' : log.includes('HEARTBEAT') ? 'text-slate-300' : 'text-amber-400'}>
                {log.substring(10)}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-cyan-400 mt-2 animate-pulse pt-1">
            <span>&gt;</span>
            <span className="w-1.5 h-3 bg-cyan-400 inline-block"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AgentManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm">
      <div className="p-2.5 border-b border-white/40 flex justify-between items-center bg-white/40 shrink-0">
        <div className="flex gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索 Agent..." className="bg-white/80 backdrop-blur-sm border border-white/60 text-slate-700 text-[11px] rounded-md pl-7 pr-2 py-1 focus:outline-none focus:border-blue-500 w-48 shadow-sm"/>
          </div>
          <select className="bg-white/80 backdrop-blur-sm border border-white/60 text-slate-700 text-[11px] rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 shadow-sm">
            <option>全部状态</option><option>在线</option><option>空闲</option><option>离线</option>
          </select>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm font-medium">
          <Plus size={12} /> 新增
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-transparent">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/50 backdrop-blur-md sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">状态</th>
              <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">Agent 名称</th>
              <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">配置角色</th>
              <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">Worker SK</th>
              <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">当前任务</th>
              <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50 w-32">执行进度</th>
              <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {mockAgents.map((agent) => (
              <tr key={agent.id} className="hover:bg-white/60 transition-colors group">
                <td className="px-3 py-2"><StatusBadge status={agent.status} type="agent" /></td>
                <td className="px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">{agent.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{agent.id}</span>
                  </div>
                </td>
                <td className="px-3 py-2"><div className="flex flex-wrap gap-1">{agent.roles.map(r => <RoleTag key={r} role={r} />)}</div></td>
                <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{agent.sk}</td>
                <td className="px-3 py-2">
                  {agent.task ? <span className="text-[10px] text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-1 bg-blue-50/80 px-1 py-0.5 rounded border border-blue-100 w-fit"><CheckCircle2 size={10} /> {agent.task}</span> : <span className="text-[10px] text-slate-400">-</span>}
                </td>
                <td className="px-3 py-2">
                  {agent.task ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-slate-200/50 rounded-full overflow-hidden border border-white/50 shadow-inner">
                        <div className={`h-full rounded-full ${agent.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`} style={{ width: `${agent.progress}%` }}></div>
                      </div>
                      <span className="text-[9px] font-medium text-slate-600 w-5">{agent.progress}%</span>
                    </div>
                  ) : <span className="text-[9px] text-slate-400">无活动</span>}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-white hover:shadow-sm hover:text-red-500 text-slate-400 rounded border border-transparent hover:border-slate-200 transition-all"><Square size={12} /></button>
                    <button className="p-1 hover:bg-white hover:shadow-sm hover:text-blue-600 text-slate-400 rounded border border-transparent hover:border-slate-200 transition-all"><Settings size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <Modal title="新增 Agent 节点" onClose={() => setShowAddModal(false)}
          footer={<><button onClick={() => setShowAddModal(false)} className="px-3 py-1 text-xs bg-white border border-slate-200 rounded-md">取消</button><button onClick={() => setShowAddModal(false)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md">创建</button></>}
        >
          <div className="space-y-3">
             <div className="text-[11px] text-slate-500">表单内容（演示环境省略...）</div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const ProjectManagement = ({ onProjectClick }) => (
  <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm">
    <div className="p-2.5 border-b border-white/40 flex justify-between items-center bg-white/40 shrink-0">
      <div className="flex gap-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="搜索项目..." className="bg-white/80 backdrop-blur-sm border border-white/60 text-slate-700 text-[11px] rounded-md pl-7 pr-2 py-1 w-48 shadow-sm focus:outline-none focus:border-blue-500" />
        </div>
        <button className="bg-white/80 backdrop-blur-sm border border-white/60 text-slate-600 text-[11px] px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
          <Filter size={12}/> 筛选
        </button>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm font-medium">
        <Plus size={12} /> 新建项目
      </button>
    </div>

    <div className="flex-1 overflow-auto custom-scrollbar bg-transparent">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/50 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">项目名称</th>
            <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">负责人</th>
            <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">周期</th>
            <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50">数据统计</th>
            <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50 w-32">进度</th>
            <th className="px-3 py-1.5 text-[10px] font-bold text-slate-500 border-b border-slate-200/50 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/40">
          {mockProjects.map((proj) => (
            <tr key={proj.id} className="hover:bg-white/60 transition-colors group">
              <td className="px-3 py-2">
                <div className="flex flex-col">
                  <span onClick={() => onProjectClick(proj)} className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer w-fit">{proj.name}</span>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">{proj.id}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-[11px] font-medium text-slate-700 flex items-center gap-1 mt-1">
                <Cpu size={12} className="text-blue-500"/>{proj.manager}
              </td>
              <td className="px-3 py-2">
                <div className="flex flex-col text-[9px] font-medium text-slate-500 space-y-0.5">
                  <span className="flex items-center gap-1"><Calendar size={9} className="text-slate-400"/> {proj.startDate}</span>
                  <span className="flex items-center gap-1"><Clock size={9} className="text-slate-400"/> {proj.endDate}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-[9px]">
                <div className="flex gap-1.5">
                  <span className="text-slate-600 flex flex-col items-center bg-white/60 border border-white/80 shadow-sm px-1.5 py-0.5 rounded">
                    <span className="font-bold">需求</span><span className="font-mono">{proj.reqCount}</span>
                  </span>
                  <span className="text-slate-600 flex flex-col items-center bg-white/60 border border-white/80 shadow-sm px-1.5 py-0.5 rounded">
                    <span className="font-bold">任务</span><span className="font-mono">{proj.taskCount}</span>
                  </span>
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1 bg-slate-200/50 rounded-full overflow-hidden border border-white/50 shadow-inner">
                    <div className={`h-full rounded-full ${proj.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`} style={{ width: `${proj.progress}%` }}></div>
                  </div>
                  <span className="text-[9px] font-medium text-slate-600 w-5">{proj.progress}%</span>
                </div>
              </td>
              <td className="px-3 py-2 text-right">
                <button className="text-slate-400 hover:text-blue-600 p-0.5 bg-white/50 hover:bg-white rounded border border-transparent shadow-sm"><MoreVertical size={12}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- 核心：需求大纲树页面 ---
const RequirementTree = ({ project, projects, onProjectChange, onBack }) => {
  const [treeData, setTreeData] = useState(mockReqTree);
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [showCreateReqModal, setShowCreateReqModal] = useState(false);

  const toggleNode = (id) => setTreeData(treeData.map(node => node.id === id ? { ...node, expanded: !node.expanded } : node));
  const openFeatureModal = (feature) => setActiveFeature(feature);

  return (
    <div className="flex flex-1 w-full animate-in slide-in-from-right-4 duration-300 bg-white/70 backdrop-blur-2xl border border-white/60 rounded-xl shadow-sm overflow-hidden min-h-0">

      {/* 左侧项目列表 */}
      <div className="w-48 shrink-0 flex flex-col border-r border-slate-300/40 bg-white/20">
        <div className="p-2 border-b border-white/40 bg-white/30 flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center gap-1 text-slate-800">
            <FolderOpen size={12} className="text-blue-600"/>
            <h3 className="font-bold text-[11px]">项目列表</h3>
          </div>
          <div className="relative">
            <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索项目..." className="bg-white/80 backdrop-blur-sm border border-white/60 text-slate-700 text-[10px] rounded pl-6 pr-2 py-1 focus:outline-none focus:border-blue-500 w-full shadow-sm" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-1">
          {projects.map(p => {
            const isActive = p.id === project.id;
            return (
              <div
                key={p.id}
                onClick={() => onProjectChange(p)}
                className={`px-2 py-1.5 rounded-md cursor-pointer transition-all border text-[11px] font-bold flex items-center justify-between group relative overflow-hidden
                  ${isActive ? 'bg-blue-50/80 border-blue-200/50 text-blue-700 shadow-sm' : 'bg-transparent border-transparent hover:bg-white/50 text-slate-600'}`}
              >
                 {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></div>}
                 <span className="truncate pr-2 z-10">{p.name}</span>
                 {isActive && <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)] flex-shrink-0 animate-pulse z-10"></div>}
              </div>
            );
          })}
        </div>

        <div className="p-1.5 border-t border-white/40 bg-white/30 flex justify-between items-center text-[9px] text-slate-500 shrink-0">
           <span>共 {projects.length} 项 (10/页)</span>
           <div className="flex items-center gap-0.5">
             <button className="p-0.5 hover:bg-white rounded"><ChevronLeft size={10}/></button>
             <span className="px-0.5">1/1</span>
             <button className="p-0.5 hover:bg-white rounded"><ChevronRight size={10}/></button>
           </div>
        </div>
      </div>

      {/* 右侧大纲树内容 */}
      <div className="flex-1 flex flex-col bg-transparent min-w-0">
        <div className="p-2 border-b border-white/40 flex justify-between items-center bg-white/40 shrink-0">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black text-slate-800">{project.name} <span className="text-slate-500 font-normal">需求大纲</span></span>
              <div className="flex flex-wrap items-center gap-1.5 ml-1 bg-white/60 border border-white/80 px-1.5 py-0.5 rounded shadow-sm text-[9px] font-medium text-slate-600">
                 <span className="flex items-center gap-0.5"><Cpu size={9} className="text-blue-500"/> {project.manager}</span>
                 <div className="w-px h-2 bg-slate-300"></div>
                 <span className="flex items-center gap-0.5"><Calendar size={9} className="text-slate-400"/> {project.startDate} 至 {project.endDate}</span>
                 <div className="w-px h-2 bg-slate-300"></div>
                 <span>需: <span className="font-bold text-slate-800">{project.reqCount}</span></span>
                 <span>任: <span className="font-bold text-slate-800">{project.taskCount}</span></span>
                 <div className="w-px h-2 bg-slate-300"></div>
                 <span className="flex items-center gap-1">
                   进度:
                   <div className="w-8 h-1 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{width: `${project.progress}%`}}></div>
                   </div>
                   <span className="font-bold text-slate-800">{project.progress}%</span>
                 </span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowCreateReqModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 font-medium shadow-sm shrink-0 transition-colors">
            <Plus size={12} /> 新增需求大纲
          </button>
        </div>

        <div className="flex-1 p-2 lg:p-3 overflow-auto custom-scrollbar bg-transparent">
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-white/60 rounded-xl shadow-sm p-1 flex flex-col h-full">

            {/* 表头布局调整 */}
            <div className="flex items-center px-2 py-1.5 border-b border-white/60 bg-white/50 rounded-t-lg shrink-0">
              <div className="flex-1 flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider min-w-[200px]">
                <input type="checkbox" className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" title="全选/取消全选" />
                <span>大纲层级</span>
              </div>
              <div className="w-16 text-[9px] font-bold text-slate-500 uppercase text-center shrink-0">优先级</div>
              <div className="w-16 text-[9px] font-bold text-slate-500 uppercase text-center shrink-0">状态</div>
              <div className="w-[280px] text-[9px] font-bold text-slate-500 uppercase text-center border-l border-slate-200/60 pl-2 shrink-0">子级配置</div>
              <div className="w-[160px] text-[9px] font-bold text-slate-500 uppercase text-right border-l border-slate-200/60 pl-2 pr-4 shrink-0">当前节点控制</div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 py-1 min-h-0">
              {treeData.map(module => (
                <div key={module.id} className="mb-2 border-b border-slate-200/50 pb-2 last:border-0">

                  {/* Module Row (需求大纲行) */}
                  <div className="flex items-center px-2 py-2 hover:bg-blue-50/80 rounded-md cursor-pointer transition-all border border-transparent group" onClick={() => toggleNode(module.id)}>
                    <div className="flex-1 flex items-center gap-1.5 min-w-[200px]">
                      <input type="checkbox" onClick={(e) => e.stopPropagation()} className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mr-1" />
                      <ChevronDown size={12} className={`text-slate-400 transition-transform ${module.expanded ? '' : '-rotate-90'}`} />
                      <Box size={14} className="text-indigo-500" />
                      <span className="font-bold text-xs text-slate-800">{module.title}</span>
                      {module.docs > 0 && (
                        <span onClick={(e) => { e.stopPropagation(); setActiveAttachment(module); }} className="flex items-center gap-0.5 text-[9px] text-slate-500 bg-white border border-slate-200/50 px-1 py-0.5 rounded ml-1 hover:text-blue-600 transition-colors z-10">
                          <Paperclip size={9}/>{module.docs}
                        </span>
                      )}
                    </div>
                    <div className="w-16 text-center shrink-0"></div>
                    <div className="w-16 text-center shrink-0"></div>
                    <div className="w-[280px] flex justify-center items-center border-l border-transparent shrink-0"></div>
                    <div className="w-[160px] flex justify-end items-center gap-2 border-l border-transparent shrink-0 pr-4" onClick={(e) => e.stopPropagation()}>
                       <button className="px-2 py-1 bg-blue-50 text-blue-600 hover:border-blue-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors mr-1"><Plus size={12}/> 子功能</button>
                       <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="编辑"><Edit size={14}/></button>
                       <button className="p-1 text-slate-400 hover:text-rose-600 transition-colors" title="删除"><Trash2 size={14}/></button>
                    </div>
                  </div>

                  {/* Feature Rows (子功能行) */}
                  {module.expanded && module.children.map(feature => (
                    <div key={feature.id} onClick={() => openFeatureModal(feature)} className="flex items-center px-2 py-1.5 ml-8 mt-0.5 bg-transparent hover:bg-blue-50/80 rounded-md cursor-pointer transition-all border border-transparent group relative">
                      <div className="absolute -left-4 top-1/2 w-3 h-px bg-slate-300"></div>
                      <div className="absolute -left-4 -top-2 h-[calc(50%+8px)] w-px bg-slate-300"></div>

                      <div className="flex-1 flex items-center gap-1.5 z-10 min-w-[200px] pr-2">
                        <input type="checkbox" onClick={(e) => e.stopPropagation()} className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mr-1" />
                        <GitMerge size={12} className="text-cyan-500 shrink-0" />
                        <span className="text-[11px] font-medium text-slate-700 group-hover:text-blue-700 transition-colors truncate">{feature.title}</span>
                        <ReqTypeTag type={feature.reqType} />
                        {feature.docs > 0 && (
                          <span onClick={(e) => { e.stopPropagation(); setActiveAttachment(feature); }} className="flex items-center gap-0.5 text-[9px] text-slate-500 bg-white border border-slate-200/50 px-1 py-0.5 rounded ml-0.5 hover:text-blue-600 shrink-0">
                            <Paperclip size={9}/>{feature.docs}
                          </span>
                        )}
                      </div>
                      <div className="w-16 flex justify-center z-10 shrink-0"><PriorityTag p={feature.priority} /></div>
                      <div className="w-16 flex justify-center z-10 shrink-0"><StatusBadge status={feature.status} type="req" /></div>
                      <div className="w-[280px] flex justify-center items-center gap-1.5 z-10 shrink-0 border-l border-transparent" onClick={(e) => e.stopPropagation()}>
                         <button onClick={() => openFeatureModal(feature)} className="px-2 py-1 bg-indigo-50 text-indigo-600 hover:border-indigo-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"><Users size={12}/> 协同</button>
                         <button className="px-2 py-1 bg-rose-50 text-rose-600 hover:border-rose-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"><Ban size={12}/> 取消</button>
                         <button className="px-2 py-1 bg-amber-50 text-amber-600 hover:border-amber-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"><PauseCircle size={12}/> 叫停</button>
                         <button className="px-2 py-1 bg-blue-50 text-blue-600 hover:border-blue-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"><SkipForward size={12}/> 推进</button>
                      </div>
                      <div className="w-[160px] flex justify-end items-center gap-2 z-10 shrink-0 border-l border-transparent pr-4" onClick={(e) => e.stopPropagation()}>
                         <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="编辑"><Edit size={14}/></button>
                         <button className="p-1 text-slate-400 hover:text-rose-600 transition-colors" title="删除"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeFeature && <FeatureFlowModal feature={activeFeature} onClose={() => setActiveFeature(null)} />}
      {activeAttachment && <AttachmentModal item={activeAttachment} onClose={() => setActiveAttachment(null)} />}
      {showCreateReqModal && <CreateRequirementModal onClose={() => setShowCreateReqModal(false)} />}
    </div>
  );
};

const TaskKanban = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const columns = [
    { id: 'todo', title: '待处理', icon: Circle, color: 'text-slate-500', border: 'border-slate-300' },
    { id: 'in_progress', title: '进行中', icon: Play, color: 'text-blue-600', border: 'border-blue-400' },
    { id: 'review', title: '审核中', icon: AlertCircle, color: 'text-amber-500', border: 'border-amber-400' },
    { id: 'completed', title: '已完成', icon: CheckCircle2, color: 'text-emerald-500', border: 'border-emerald-400' }
  ];

  const handleAssignClick = (task) => {
    setSelectedTask(task);
    setAssignModalOpen(true);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black text-slate-800">电商平台重构</h2>
          <span className="px-1.5 py-0.5 bg-white/80 border border-white text-blue-600 shadow-sm rounded text-[9px] font-bold">Sprint 3</span>
        </div>
        <button className="bg-white/60 backdrop-blur-md text-slate-600 text-[11px] px-2.5 py-1 border border-white/80 shadow-sm rounded-md flex items-center gap-1 font-medium">
          <Filter size={10}/> 过滤
        </button>
      </div>

      <div className="flex-1 flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar min-h-0">
        {columns.map(col => {
          const ColIcon = col.icon;
          return (
            <div key={col.id} className={`w-64 flex-shrink-0 flex flex-col bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl shadow-sm overflow-hidden relative`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${col.id === 'todo' ? 'bg-slate-300' : col.id === 'in_progress' ? 'bg-blue-400' : col.id === 'review' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>

              <div className="p-2 bg-white/50 border-b border-white/60 flex items-center justify-between mt-1 shrink-0">
                <h3 className={`text-[11px] font-bold flex items-center gap-1 ${col.color}`}><ColIcon size={12} strokeWidth={2.5} /> {col.title}</h3>
                <span className="text-[9px] bg-white/80 shadow-sm border border-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-mono font-bold">{mockTasks.filter(t => t.status === col.id).length}</span>
              </div>

              <div className="flex-1 p-2 overflow-y-auto space-y-2 custom-scrollbar min-h-0">
                {mockTasks.filter(t => t.status === col.id).map(task => (
                  <div key={task.id} className="bg-white/80 backdrop-blur-sm border border-white hover:border-blue-200 p-2.5 rounded-lg cursor-pointer transition-all group shadow-sm flex flex-col relative">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[8px] font-mono font-bold text-slate-500 bg-slate-100/50 px-1 py-0.5 rounded">{task.id}</span>
                      <PriorityTag p={task.priority} />
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-800 mb-1 leading-snug">{task.title}</h4>
                    <div className="flex justify-between items-center mt-auto pt-1.5 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500">
                        <Cpu size={10} className={task.status === 'in_progress' ? 'text-blue-500' : 'text-slate-400'} />
                        <span className="truncate max-w-[80px]">{task.assignee}</span>
                      </div>
                      {col.id === 'todo' && (
                        <button onClick={(e) => { e.stopPropagation(); handleAssignClick(task); }} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded shadow-sm">分配</button>
                      )}
                      {col.id === 'in_progress' && (
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-1/2"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {assignModalOpen && selectedTask && (
        <Modal title="快速指派" onClose={() => setAssignModalOpen(false)} heightClass="max-h-[88vh]">
          <div className="space-y-3">
            <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg p-3 shadow-sm">
              <div className="text-[10px] text-slate-500 mb-1 font-mono font-bold">{selectedTask.id} · {selectedTask.project}</div>
              <div className="text-xs font-black text-slate-800">{selectedTask.title}</div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1.5">选择执行 Agent</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {mockAgents.map(agent => (
                  <label key={agent.id} className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all shadow-sm ${agent.status === 'offline' ? 'opacity-50 border-slate-200 bg-slate-50/50' : 'border-white/80 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:shadow-md'}`}>
                    <div className="flex items-center gap-2.5">
                      <input type="radio" name="agent" disabled={agent.status === 'offline'} className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500 bg-white" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          {agent.name}
                          <StatusBadge status={agent.status} type="agent" />
                        </div>
                        <div className="text-[9px] mt-1 flex gap-1 flex-wrap">
                          {agent.roles.map(r => <RoleTag key={r} role={r} />)}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/40 mt-4">
              <button onClick={() => setAssignModalOpen(false)} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-sm">取消</button>
              <button onClick={() => setAssignModalOpen(false)} className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-all shadow-md shadow-cyan-500/20">确认指派</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// --- Application ---
export default function App() {
  const [currentRoute, setCurrentRoute] = useState('projects');
  const [activeProject, setActiveProject] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'agents', label: 'Agent', icon: Users },
    { id: 'projects', label: '项目管理', icon: FolderOpen },
    { id: 'tasks', label: '任务看板', icon: KanbanSquare },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  const handleNavClick = (routeId) => {
    setCurrentRoute(routeId);
    if (routeId !== 'projects') setActiveProject(null);
  };

  return (
    <div className="min-h-screen bg-[#e8eef3] text-slate-800 font-sans flex overflow-hidden selection:bg-cyan-200 selection:text-cyan-900 relative">

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.3]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network-pattern" x="0" y="0" width="800" height="800" patternUnits="userSpaceOnUse">
              <g stroke="#94a3b8" strokeWidth="1" fill="none" className="opacity-50">
                <path d="M 50 150 L 150 50 L 300 100 L 250 250 L 100 300 Z M 300 100 L 500 50 L 650 150 L 550 300 L 400 250 Z M 650 150 L 750 50 L 850 150 L 750 300 Z M 100 300 L 250 250 L 350 450 L 150 550 L 50 400 Z M 250 250 L 400 250 L 550 300 L 450 500 L 350 450 Z M 550 300 L 750 300 L 650 550 L 450 500 Z M 150 550 L 350 450 L 300 700 L 100 650 Z M 350 450 L 450 500 L 600 750 L 400 850 L 300 700 Z M 450 500 L 650 550 L 750 750 L 600 750 Z" />
              </g>
              <g fill="#0ea5e9" className="opacity-60">
                <circle cx="50" cy="150" r="3" /><circle cx="150" cy="50" r="4" /><circle cx="300" cy="100" r="3" /><circle cx="250" cy="250" r="5" /><circle cx="100" cy="300" r="3" />
                <circle cx="500" cy="50" r="4" /><circle cx="650" cy="150" r="3" /><circle cx="550" cy="300" r="5" /><circle cx="400" cy="250" r="3" /><circle cx="350" cy="450" r="5" />
              </g>
              <g fill="#38bdf8" className="animate-pulse">
                <circle cx="250" cy="250" r="10" className="opacity-30" /><circle cx="550" cy="300" r="12" className="opacity-20" /><circle cx="350" cy="450" r="11" className="opacity-20" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-pattern)" />
        </svg>
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-cyan-400/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-500/15 rounded-full blur-[140px]"></div>
      </div>

      <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-48'} border-r border-white/60 bg-white/40 backdrop-blur-2xl flex flex-col z-30 shadow-sm transition-all duration-300 relative shrink-0`}>
        <div className={`h-10 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-3'} border-b border-white/40 relative shrink-0`}>
          <div className="flex items-center gap-1.5 text-blue-600 overflow-hidden">
            <Network size={18} className="animate-pulse stroke-[2.5] flex-shrink-0" />
            {!isSidebarCollapsed && <span className="font-black text-sm tracking-tight text-slate-800 whitespace-nowrap">One<span className="text-blue-600">Swarm</span></span>}
          </div>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`absolute ${isSidebarCollapsed ? '-right-2' : 'right-2'} top-1/2 -translate-y-1/2 bg-white/90 border border-white text-slate-400 hover:text-blue-600 rounded-full p-0.5 shadow-sm transition-all z-50`}>
            {isSidebarCollapsed ? <PanelLeftOpen size={10} /> : <PanelLeftClose size={10} />}
          </button>
        </div>

        <div className={`py-2 flex-1 ${isSidebarCollapsed ? 'px-1.5' : 'px-2'}`}>
          <nav className="space-y-0.5">
            {navItems.map(item => {
              const NavIcon = item.icon;
              return (
                <button key={item.id} onClick={() => handleNavClick(item.id)} title={isSidebarCollapsed ? item.label : ''} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-2'} py-1.5 rounded-md transition-all duration-200 text-xs font-bold ${currentRoute === item.id ? 'bg-white/80 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
                  <NavIcon size={14} strokeWidth={currentRoute === item.id ? 2.5 : 2} className="flex-shrink-0" />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              )
            })}
          </nav>
        </div>

        <div className={`p-2 border-t border-white/40 bg-white/30 m-1.5 rounded-md ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-[9px] font-black text-white shrink-0">AD</div>
            {!isSidebarCollapsed && (
              <div className="truncate leading-tight">
                <div className="text-[11px] font-bold text-slate-800 truncate">Admin</div>
                <div className="text-[8px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5"><span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> 平台管理员</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
        <header className="h-10 border-b border-white/40 bg-white/40 backdrop-blur-2xl flex items-center justify-between px-3 z-20 shrink-0">
          <div className="flex items-center text-[11px] font-medium text-slate-500 bg-white/60 px-2 py-0.5 rounded border border-white shadow-sm">
            <span>OneSwarm</span><ChevronRight size={10} className="mx-1 text-slate-400" />
            {currentRoute === 'projects' && activeProject ? (
              <><span className="text-slate-500 hover:text-blue-600 cursor-pointer" onClick={() => setActiveProject(null)}>项目管理</span><ChevronRight size={10} className="mx-1 text-slate-400" /><span className="text-blue-600 font-bold truncate max-w-[150px]">{activeProject.name}</span></>
            ) : (<span className="text-blue-600 font-bold">{navItems.find(i => i.id === currentRoute)?.label}</span>)}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/60 border border-white px-2 py-0.5 rounded-full shadow-sm">
              <span className="relative flex h-1 w-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span></span>
              <span className="text-[9px] font-bold font-mono text-emerald-600">WS (30009)</span>
            </div>
            <button className="text-slate-400 hover:text-blue-500 relative transition-colors bg-white/60 p-1 rounded-full border border-white hover:bg-white shadow-sm">
              <Bell size={12} /><span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white shadow-[0_0_8px_#ef4444]"></span>
            </button>
          </div>
        </header>

        <div className="p-1.5 flex-1 overflow-hidden flex flex-col relative z-10">
          {currentRoute === 'dashboard' && <Dashboard />}
          {currentRoute === 'agents' && <AgentManagement />}
          {currentRoute === 'projects' && (activeProject ? <RequirementTree project={activeProject} projects={mockProjects} onProjectChange={setActiveProject} onBack={() => setActiveProject(null)} /> : <ProjectManagement onProjectClick={setActiveProject} />)}
          {currentRoute === 'tasks' && <TaskKanban />}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
        .scanner-animation { animation: scan 10s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.8); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.8); }
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
}