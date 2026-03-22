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
  File as FileIcon, Image as ImageIcon, Eye, Edit, Trash2, Save,
  LayoutGrid, List, Copy, Check, BrainCircuit, Gem
} from 'lucide-react';

// --- 自动生成的 24 个 Agent Mock 数据，用于展示紧凑排版与分页 ---
const generateMockAgents = () => {
  const rolesMap = ['project-manager', 'frontend-developer', 'backend-developer', 'qa-engineer', 'ui-designer'];
  const namePrefixMap = ['项目管理', '前端研发', '后端研发', '测试工程', 'UI设计'];
  const statusMap = ['online', 'idle', 'busy', 'offline'];
  const models = ['gpt-4-turbo', 'claude-3-opus', 'gpt-3.5-turbo', 'dall-e-3', 'claude-3-sonnet'];

  return Array.from({ length: 24 }).map((_, i) => {
    const roleIdx = i % 5;
    const status = statusMap[i % 4];
    return {
      id: `ag-${100 + i}`,
      name: `PC${(i % 3) + 1}-${namePrefixMap[roleIdx]}`,
      roles: [rolesMap[roleIdx]],
      status: status,
      task: (status === 'busy' || status === 'online') ? `TASK-${1000 + i}` : null,
      queuedTasks: status === 'busy' && i % 2 === 0 ? [`TASK-${2000 + i}`] : [],
      progress: status === 'busy' ? Math.floor(Math.random() * 80 + 10) : 0,
      lastPing: `${(i % 10) + 1}s ago`,
      sk: `sk_${Math.random().toString(36).substring(2, 8)}`,
      caps: ['task-decomposition', 'react', 'python', 'pytest', 'figma'].slice(roleIdx, roleIdx + 2),
      model: models[i % 5],
      tokens: Math.floor(Math.random() * 5000000 + 10000),
      linshi: Math.floor(Math.random() * 1000 + 10)
    };
  });
};

const mockAgents = generateMockAgents();

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

// --- Formatter ---
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

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

  const actualType = type === 'agent_mini' ? 'agent' : type;
  const typeConfig = configs[actualType] || configs['req'];
  const config = typeConfig[status] || typeConfig[Object.keys(typeConfig)[0]];

  if (type === 'agent_mini') {
     return <div className={`w-2.5 h-2.5 rounded-full border border-white shadow-sm ${config.dot || 'bg-slate-300'}`} title={config.label}></div>;
  }
  return (
    <span className={`px-2 py-0.5 text-[10px] rounded-full border flex items-center justify-center gap-1 w-fit font-bold shadow-sm ${config.color}`}>
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>}
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
  return <span className={`px-1.5 py-0.5 text-[9px] uppercase rounded border font-bold ${config.color}`}>{config.label}</span>;
};

// 极简版图标按钮 (复制 SK)
const CopyIconBtn = ({ sk }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`p-1.5 rounded border transition-colors ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 border-transparent hover:border-blue-200 shadow-sm'}`} title={copied ? '已复制' : '复制 Token'}>
      {copied ? <Check size={12}/> : <Copy size={12}/>}
    </button>
  );
};

// --- Modals ---

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

// Agent 表单弹窗 (新增/编辑共用)
const AgentFormModal = ({ agent, onClose }) => {
  const isEdit = !!agent;

  // 定制化多选状态
  const [selectedRoles, setSelectedRoles] = useState(agent?.roles || ['backend-developer']);
  const [isRolesOpen, setIsRolesOpen] = useState(false);

  const roleOptions = [
    { value: 'project-manager', label: '项目经理 (Project Manager)' },
    { value: 'product-manager', label: '产品经理 (Product Manager)' },
    { value: 'frontend-developer', label: '前端研发 (Frontend Dev)' },
    { value: 'backend-developer', label: '后端研发 (Backend Dev)' },
    { value: 'qa-engineer', label: '测试工程 (QA Engineer)' },
    { value: 'ui-designer', label: 'UI设计 (UI Designer)' }
  ];

  const toggleRole = (val) => {
    setSelectedRoles(prev => prev.includes(val) ? prev.filter(r => r !== val) : [...prev, val]);
  };

  return (
    <Modal size="default" heightClass="max-h-fit" zIndex="z-[60]" title={<div className="flex items-center gap-1.5">{isEdit ? <Edit size={16} className="text-blue-600"/> : <Plus size={16} className="text-blue-600"/>} <span className="text-sm">{isEdit ? '编辑 Agent 配置' : '新增 Agent 节点'}</span></div>} onClose={onClose}>
       <div className="flex flex-col gap-5 p-2">
         {/* Name */}
         <div className="flex flex-col gap-2">
           <label className="text-xs font-bold text-slate-600">Agent 名称 <span className="text-rose-500">*</span></label>
           <input type="text" defaultValue={agent?.name || ''} className="w-full text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-400 shadow-sm transition-colors" placeholder="例如：PC3-高级架构师" />
         </div>

         {/* Custom Roles Multi-select */}
         <div className="flex flex-col gap-2 relative">
           <label className="text-xs font-bold text-slate-600">分配角色权限 (Roles) <span className="text-rose-500">*</span></label>

           {/* 模拟输入框容器 */}
           <div
             className={`min-h-[42px] w-full bg-white border ${isRolesOpen ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200'} rounded-lg px-3 py-2 shadow-sm cursor-pointer transition-all flex flex-wrap gap-1.5 items-center relative`}
             onClick={() => setIsRolesOpen(!isRolesOpen)}
           >
             {selectedRoles.length === 0 ? (
               <span className="text-xs text-slate-400 select-none flex-1 py-0.5">请选择此 Agent 需要挂载的角色...</span>
             ) : (
               selectedRoles.map(r => <RoleTag key={r} role={r} />)
             )}
             <ChevronDown size={14} className={`text-slate-400 shrink-0 ml-auto transition-transform duration-200 ${isRolesOpen ? 'rotate-180' : ''}`} />
           </div>

           {/* 悬浮下拉面板 */}
           {isRolesOpen && (
             <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto p-1.5 custom-scrollbar">
               {roleOptions.map(option => (
                 <label key={option.value} className={`flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors ${selectedRoles.includes(option.value) ? 'bg-blue-50/50' : ''}`}>
                   <input
                     type="checkbox"
                     className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shadow-sm"
                     checked={selectedRoles.includes(option.value)}
                     onChange={() => toggleRole(option.value)}
                   />
                   <span className="text-xs font-bold text-slate-800">{option.label}</span>
                 </label>
               ))}
             </div>
           )}
         </div>
       </div>

       <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
         <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">取消</button>
         <button onClick={onClose} className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"><CheckCircle2 size={14}/> {isEdit ? '保存修改' : '确认创建'}</button>
       </div>
    </Modal>
  );
};


// --- 核心模块：Agent Management ---

const AgentManagement = () => {
  const [agentModalState, setAgentModalState] = useState({ isOpen: false, agent: null });
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部状态');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredAgents = mockAgents.filter(ag => {
    const matchSearch = ag.name.toLowerCase().includes(searchQuery.toLowerCase()) || ag.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === '全部状态' ||
                        (statusFilter === '在线' && ag.status === 'online') ||
                        (statusFilter === '空闲' && ag.status === 'idle') ||
                        (statusFilter === '忙碌' && ag.status === 'busy') ||
                        (statusFilter === '离线' && ag.status === 'offline');
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const currentAgents = filteredAgents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white/70 border border-white/60 rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm m-2">
      {/* 头部控制区 */}
      <div className="p-3 border-b border-slate-200/60 bg-white/40 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="模糊搜索 Agent..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg pl-8 pr-3 py-2 w-56 shadow-sm focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:border-blue-400 cursor-pointer transition-colors"
          >
            <option>全部状态</option><option>在线</option><option>空闲</option><option>忙碌</option><option>离线</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100/80 border border-slate-200 p-0.5 rounded-lg shadow-inner">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="模块视图">
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="列表视图">
              <List size={14} />
            </button>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <button onClick={() => setAgentModalState({ isOpen: true, agent: null })} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
            <Plus size={14} strokeWidth={2.5} /> 新增 Agent
          </button>
        </div>
      </div>

      {/* 内容展示区 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-50/30 flex flex-col">
        {filteredAgents.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-bold text-sm gap-2">
             <Terminal size={32} className="opacity-20"/> 未匹配到任何 Agent
           </div>
        ) : viewMode === 'grid' ? (
          // --- 极限紧凑的模块(卡片)视图 ---
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 flex-1 content-start">
            {currentAgents.map(ag => (
              <div key={ag.id} className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all flex flex-col relative group min-h-[135px]">

                {/* Header */}
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                      <Cpu size={14} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[11px] font-black text-slate-800 truncate leading-tight">{ag.name}</span>
                      <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5 mt-0.5 truncate"><BrainCircuit size={9}/>{ag.model}</span>
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5 pl-1">
                    <StatusBadge status={ag.status} type="agent" />
                  </div>
                </div>

                {/* 拆分并排对齐的数据格: Tokens vs 鳞石 */}
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                   <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-lg py-1.5 shadow-sm">
                     <span className="text-[8px] font-bold text-slate-400 mb-0.5">消耗 Tokens</span>
                     <span className="font-mono text-[11px] font-bold text-slate-700 leading-none">{formatNumber(ag.tokens)}</span>
                   </div>
                   <div className="flex flex-col items-center justify-center bg-cyan-50/50 border border-cyan-100 rounded-lg py-1.5 shadow-sm relative overflow-hidden">
                     <div className="absolute inset-0 bg-cyan-400/10 blur-md"></div>
                     <span className="text-[8px] font-bold text-cyan-600/80 mb-0.5 flex items-center gap-1 z-10">
                       <Gem size={8} className="text-cyan-500 fill-cyan-100 drop-shadow-[0_0_2px_rgba(6,182,212,0.8)]"/> 赚取鳞石
                     </span>
                     <span className="font-mono text-[11px] font-bold text-cyan-700 leading-none z-10">{formatNumber(ag.linshi)}</span>
                   </div>
                </div>

                {/* Single Line Task Status */}
                <div className="text-[9px] font-medium mb-2 flex-1">
                   {ag.status === 'busy' || (ag.status==='online' && ag.task) ? (
                     <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-1.5 rounded text-blue-700">
                       <span className="truncate flex-1 pr-1 font-bold">{ag.task}</span>
                       {ag.status === 'busy' && <span className="font-black shrink-0">{ag.progress}%</span>}
                     </div>
                   ) : (
                     <div className="text-slate-400 p-1.5 bg-slate-50 border border-slate-100 rounded text-center truncate">
                       {ag.status === 'offline' ? '已切断连接' : '节点空闲待命中...'}
                     </div>
                   )}
                </div>

                {/* Micro Footer Actions */}
                <div className="flex items-center justify-between pt-1 mt-auto border-t border-slate-100">
                   <span className="text-[8px] text-slate-400 font-mono bg-white border border-slate-100 shadow-sm px-1.5 py-0.5 rounded">{ag.id}</span>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <CopyIconBtn sk={ag.sk} />
                     <button onClick={() => setAgentModalState({ isOpen: true, agent: ag })} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-200 transition-colors shadow-sm" title="编辑节点配置"><Edit size={12}/></button>
                     <button className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-colors shadow-sm" title="运行日志控制台"><Terminal size={12}/></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // --- 列表视图 ---
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Agent 信息</th>
                  <th className="px-4 py-3">驱动模型</th>
                  <th className="px-4 py-3">配置角色</th>
                  <th className="px-4 py-3">运行时数据</th>
                  <th className="px-4 py-3">当前任务状态</th>
                  <th className="px-4 py-3 text-right">微操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentAgents.map((ag) => (
                  <tr key={ag.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={ag.status} type="agent" />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800">{ag.name}</span>
                          <span className="text-[9px] font-mono text-slate-400">{ag.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit"><BrainCircuit size={10}/> {ag.model}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">{ag.roles.map(r => <RoleTag key={r} role={r} />)}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col bg-slate-50 border border-slate-100 rounded px-2 py-1 min-w-[70px]">
                          <span className="text-[8px] font-bold text-slate-400">Tokens</span>
                          <span className="font-mono text-[10px] font-bold text-slate-700">{formatNumber(ag.tokens)}</span>
                        </div>
                        <div className="flex flex-col bg-cyan-50/50 border border-cyan-100 rounded px-2 py-1 min-w-[70px] relative overflow-hidden">
                          <div className="absolute inset-0 bg-cyan-400/10 blur-md"></div>
                          <span className="text-[8px] font-bold text-cyan-600/80 flex items-center gap-1 z-10"><Gem size={8} className="text-cyan-500 fill-cyan-100 drop-shadow-[0_0_2px_rgba(6,182,212,0.8)]"/> 鳞石</span>
                          <span className="font-mono text-[10px] font-bold text-cyan-700 z-10">{formatNumber(ag.linshi)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1 max-w-[180px]">
                        {ag.status === 'busy' ? (
                           <>
                             <div className="flex items-center gap-2">
                               <span className="text-xs text-blue-600 font-bold truncate cursor-pointer hover:underline">{ag.task}</span>
                               <span className="text-[9px] font-mono text-blue-500 bg-blue-50 px-1 rounded">{ag.progress}%</span>
                             </div>
                             {ag.queuedTasks.length > 0 && <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 w-fit">排队: {ag.queuedTasks.length}</span>}
                           </>
                        ) : <span className="text-xs text-slate-400 italic">空闲 / 离线</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyIconBtn sk={ag.sk} />
                        <button onClick={() => setAgentModalState({ isOpen: true, agent: ag })} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 rounded transition-colors shadow-sm" title="编辑"><Edit size={12} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded transition-colors shadow-sm" title="运行日志"><Terminal size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页控制器 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 px-1 pt-2 border-t border-slate-200/60 shrink-0">
             <span className="text-[10px] font-bold text-slate-500">共匹配到 <span className="text-blue-600">{filteredAgents.length}</span> 个 Agent 节点</span>
             <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg shadow-sm p-0.5">
               <button
                 disabled={currentPage === 1}
                 onClick={() => setCurrentPage(p => p - 1)}
                 className="px-2 py-1 text-[10px] font-bold text-slate-600 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
               >
                 上一页
               </button>
               <div className="px-3 text-[10px] font-mono font-bold text-slate-700 border-x border-slate-100">
                 {currentPage} / {totalPages}
               </div>
               <button
                 disabled={currentPage === totalPages}
                 onClick={() => setCurrentPage(p => p + 1)}
                 className="px-2 py-1 text-[10px] font-bold text-slate-600 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
               >
                 下一页
               </button>
             </div>
          </div>
        )}
      </div>

      {agentModalState.isOpen && (
        <AgentFormModal
          agent={agentModalState.agent}
          onClose={() => setAgentModalState({ isOpen: false, agent: null })}
        />
      )}
    </div>
  );
};

// ... existing code for ProjectManagement, Dashboard, App ...
// (Keeping below unchanged to ensure full rendering without issues)
const ProjectManagement = ({ onProjectClick }) => (
  <div className="bg-white/70 border border-white/60 rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm m-2">
    <div className="p-3 border-b border-slate-200/60 bg-white/40 flex justify-between items-center shrink-0">
      <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="搜索项目..." className="bg-white border border-slate-200/60 text-xs rounded-lg pl-8 pr-3 py-1.5 w-64 shadow-sm focus:outline-none focus:border-blue-400 transition-colors" /></div>
      <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs px-4 py-1.5 rounded-lg shadow-sm font-bold flex items-center gap-1.5"><Plus size={14}/>新建项目</button>
    </div>
    <div className="flex-1 overflow-auto custom-scrollbar p-1">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 sticky top-0 z-10">
          <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
             <th className="px-4 py-3 border-b border-slate-200/60">项目名称</th><th className="px-4 py-3 border-b border-slate-200/60">负责人</th><th className="px-4 py-3 border-b border-slate-200/60">周期</th><th className="px-4 py-3 border-b border-slate-200/60">进度</th><th className="px-4 py-3 border-b border-slate-200/60 text-right pr-6">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/60">
          {mockProjects.map(p => (
            <tr key={p.id} className="hover:bg-white/80 transition-colors">
              <td className="px-4 py-3"><div onClick={() => onProjectClick(p)} className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">{p.name}</div><div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.id}</div></td>
              <td className="px-4 py-3 text-xs font-medium text-slate-700 flex items-center gap-1.5 mt-1.5"><Cpu size={14} className="text-blue-500"/>{p.manager}</td>
              <td className="px-4 py-3 text-[10px] text-slate-500 font-mono">{p.startDate} 至 {p.endDate}</td>
              <td className="px-4 py-3"><div className="w-32 h-2 bg-slate-200/60 rounded-full overflow-hidden shadow-inner flex items-center"><div className="h-full bg-blue-500 rounded-full" style={{width: `${p.progress}%`}} /></div></td>
              <td className="px-4 py-3 text-right pr-6"><button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="flex-1 overflow-hidden flex flex-col gap-3 p-2">
    <div className="flex-1 flex items-center justify-center bg-white/50 border border-slate-200 border-dashed rounded-xl">
       <span className="text-slate-400 font-bold text-sm">仪表盘组件已省略，请查看左侧 Agent 导航卡片...</span>
    </div>
  </div>
);

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('agents'); // Default to agents to see changes
  const [activeProject, setActiveProject] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'agents', label: 'Agent', icon: Users },
    { id: 'projects', label: '项目管理', icon: FolderOpen },
    { id: 'tasks', label: '任务看板', icon: KanbanSquare },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#e8eef3] text-slate-800 font-sans flex overflow-hidden selection:bg-cyan-200 selection:text-cyan-900 relative">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.3]" xmlns="http://www.w3.org/2000/svg">
          <pattern id="network-pattern" x="0" y="0" width="800" height="800" patternUnits="userSpaceOnUse"><g stroke="#94a3b8" strokeWidth="1" fill="none" className="opacity-50"><path d="M 50 150 L 150 50 L 300 100 L 250 250 Z" /></g></pattern>
          <rect width="100%" height="100%" fill="url(#network-pattern)" />
        </svg>
      </div>

      <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-48'} border-r border-white/60 bg-white/40 backdrop-blur-2xl flex flex-col z-30 shadow-sm transition-all duration-300 relative shrink-0`}>
        <div className={`h-14 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-4'} border-b border-white/40 relative shrink-0`}>
          <Network size={20} className="animate-pulse stroke-[2.5] text-blue-600 shrink-0" />
          {!isSidebarCollapsed && <span className="font-black text-base tracking-tight text-slate-800 whitespace-nowrap ml-2">One<span className="text-blue-600">Swarm</span></span>}
        </div>
        <div className={`py-3 flex-1 ${isSidebarCollapsed ? 'px-2' : 'px-3'}`}>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setCurrentRoute(item.id); if(item.id !== 'projects') setActiveProject(null); }} title={isSidebarCollapsed ? item.label : ''} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-all duration-200 text-sm font-bold ${currentRoute === item.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-white/50 border border-transparent'}`}>
                <item.icon size={16} strokeWidth={currentRoute === item.id ? 2.5 : 2} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
        <header className="h-14 border-b border-white/40 bg-white/40 backdrop-blur-2xl flex items-center justify-between px-4 z-20 shrink-0 shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center text-xs font-bold text-slate-500">
            OneSwarm <ChevronRight size={14} className="mx-2 opacity-50" /> <span className="text-slate-800">{navItems.find(i => i.id === currentRoute)?.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/50 shadow-sm text-[10px] font-bold text-emerald-600"><Circle size={8} fill="currentColor" className="animate-pulse" /> WS Connected</div>
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-slate-400 hover:text-blue-500 p-1.5 transition-colors bg-white/50 hover:bg-white rounded-md shadow-sm border border-transparent hover:border-slate-200">{isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col relative z-10">
          {currentRoute === 'dashboard' && <Dashboard />}
          {currentRoute === 'agents' && <AgentManagement />}
          {currentRoute === 'projects' && (activeProject ? <div className="p-10 text-center text-slate-400 italic text-xs">大纲树见项目管理...</div> : <ProjectManagement onProjectClick={setActiveProject} />)}
          {currentRoute === 'tasks' && <div className="flex-1 m-6 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 font-bold bg-white/50">任务看板开发中...</div>}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.8); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.8); }
        .custom-scrollbar-dark::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
      `}} />
    </div>
  );
}