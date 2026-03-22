import React, { useState } from 'react';
import {
  Search, Plus, Settings, Square, CheckCircle2, X, Cpu, BrainCircuit, Gem,
  LayoutGrid, List, Copy, Check, Edit, Terminal, ChevronDown
} from 'lucide-react';
import { StatusBadge, RoleTag } from '../components/utils/Tags';
import { mockAgents } from '../data/mockData';

// --- 数字格式化 ---
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// --- CopyIconBtn 组件 ---
const CopyIconBtn = ({ sk }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sk);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`p-1.5 rounded border transition-colors ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 border-transparent hover:border-blue-200 shadow-sm'}`} title={copied ? '已复制' : '复制 Token'}>
      {copied ? <Check size={12}/> : <Copy size={12}/>}
    </button>
  );
};

// --- AgentFormModal 组件 ---
const AgentFormModal = ({ agent, onClose }) => {
  const isEdit = !!agent;
  const [selectedRoles, setSelectedRoles] = useState(agent?.roles || []);
  const [isRolesOpen, setIsRolesOpen] = useState(false);

  const roleOptions = [
    { value: 'project-manager', label: '项目经理 (Project Manager)' },
    { value: 'product-manager', label: '产品经理 (Product Manager)' },
    { value: 'frontend-developer', label: '前端研发 (Frontend Dev)' },
    { value: 'backend-developer', label: '后端研发 (Backend Dev)' },
    { value: 'qa-engineer', label: '测试工程 (QA Engineer)' },
    { value: 'ui-designer', label: 'UI 设计 (UI Designer)' }
  ];

  const toggleRole = (val) => {
    setSelectedRoles(prev => prev.includes(val) ? prev.filter(r => r !== val) : [...prev, val]);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200 px-4" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 w-[550px] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-2.5 border-b border-white/40 bg-white/40 shrink-0">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            {isEdit ? <Edit size={16} className="text-blue-600"/> : <Plus size={16} className="text-blue-600"/>}
            <span>{isEdit ? '编辑 Agent 配置' : '新增 Agent 节点'}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white/50 rounded-md p-1 hover:bg-white border border-white/50 shadow-sm"><X size={14} /></button>
        </div>
        <div className="p-4 overflow-y-auto custom-scrollbar bg-transparent flex flex-col flex-1 min-h-0">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600">Agent 名称 <span className="text-rose-500">*</span></label>
              <input type="text" defaultValue={agent?.name || ''} className="w-full text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-400 shadow-sm transition-colors" placeholder="例如：PC3-高级架构师" />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-xs font-bold text-slate-600">分配角色权限 (Roles) <span className="text-rose-500">*</span></label>
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

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600">Worker SK <span className="text-rose-500">*</span></label>
              <input type="text" defaultValue={agent?.sk || ''} className="w-full text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-400 shadow-sm transition-colors" placeholder="worker_sk_xxxxx" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-2.5 border-t border-white/40 bg-white/40 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">取消</button>
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"><CheckCircle2 size={14}/> {isEdit ? '保存修改' : '确认创建'}</button>
        </div>
      </div>
    </div>
  );
};

// --- 主组件 ---
const AgentList = () => {
  const [agentModalState, setAgentModalState] = useState({ isOpen: false, agent: null });
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部状态');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [stoppedAgents, setStoppedAgents] = useState(new Set());

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

  const handleStopAgent = (agentId) => {
    const newSet = new Set(stoppedAgents);
    if (newSet.has(agentId)) {
      newSet.delete(agentId);
    } else {
      newSet.add(agentId);
    }
    setStoppedAgents(newSet);
  };

  const handleSettings = (agentId) => {
    console.log('Settings for agent:', agentId);
  };

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
          // --- 卡片视图 ---
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

                {/* Tokens vs 鳞石 */}
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

                {/* Task Status */}
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

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-1 mt-auto border-t border-slate-100">
                   <span className="text-[8px] text-slate-400 font-mono bg-white border border-slate-100 shadow-sm px-1.5 py-0.5 rounded">{ag.id}</span>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <CopyIconBtn sk={ag.sk} />
                     <button onClick={() => setAgentModalState({ isOpen: true, agent: ag })} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-200 transition-colors shadow-sm" title="编辑节点配置"><Edit size={12}/></button>
                     <button onClick={() => handleSettings(ag.id)} className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-colors shadow-sm" title="运行日志控制台"><Terminal size={12}/></button>
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
                      <div className="flex flex-col gap-1">
                        {ag.status === 'busy' ? (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-blue-600 font-bold truncate cursor-pointer hover:underline">{ag.task}</span>
                              <span className="text-[9px] font-mono text-blue-500 bg-blue-50 px-1 rounded">{ag.progress}%</span>
                            </div>
                            {ag.queuedTasks && ag.queuedTasks.length > 0 && <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 w-fit">排队：{ag.queuedTasks.length}</span>}
                          </>
                        ) : <span className="text-xs text-slate-400 italic">空闲 / 离线</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyIconBtn sk={ag.sk} />
                        <button onClick={() => handleStopAgent(ag.id)} className={`p-1.5 rounded border transition-colors ${stoppedAgents.has(ag.id) ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 bg-white'}`} title={stoppedAgents.has(ag.id) ? '启动' : '停止'}><Square size={12} /></button>
                        <button onClick={() => setAgentModalState({ isOpen: true, agent: ag })} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 rounded transition-colors shadow-sm" title="编辑"><Edit size={12} /></button>
                        <button onClick={() => handleSettings(ag.id)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded transition-colors shadow-sm" title="运行日志"><Terminal size={12} /></button>
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

export default AgentList;
