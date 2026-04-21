import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, CheckCircle2, X, BrainCircuit, Gem,
  Copy, Check, Edit, Terminal, ChevronDown, RefreshCw
} from 'lucide-react';
import { StatusBadge, RoleTag } from '../components/utils/Tags';
import { getAgents, createAgent, updateAgent, deleteAgent } from '../api';
import { CrystalCrawfishSurfLogo } from '../components/utils/Modal';

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
const AgentFormModal = ({ agent, onClose, onSave }) => {
  const isEdit = !!agent;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    roles: agent?.roles || [],
  });
  const [selectedRoles, setSelectedRoles] = useState(agent?.roles || []);
  const [isRolesOpen, setIsRolesOpen] = useState(false);

  const roleOptions = [
    { value: 'project-manager', label: '项目经理 (Project Manager)' },
    { value: 'product-manager', label: '产品经理 (Product Manager)' },
    { value: 'frontend-developer', label: '前端研发 (Frontend Dev)' },
    { value: 'backend-developer', label: '后端研发 (Backend Dev)' },
    { value: 'qa-engineer', label: '测试工程 (QA Engineer)' },
    { value: 'ui-designer', label: 'UI 设计 (UI Designer)' },
    { value: 'architect', label: '架构师 (Architect)' },
    { value: 'tech-lead', label: '技术主管 (Tech Lead)' },
    { value: 'analyst', label: '分析师 (Analyst)' },
  ];

  const toggleRole = (val) => {
    setSelectedRoles(prev => prev.includes(val) ? prev.filter(r => r !== val) : [...prev, val]);
  };

  const handleSubmit = async () => {
    if (!formData.name || selectedRoles.length === 0) {
      alert('请填写必填项');
      return;
    }
    setLoading(true);
    try {
      const data = {
        name: formData.name,
        roles: selectedRoles,
        worker_sk: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        model: 'claude-sonnet-4-6',
      };
      if (isEdit) {
        await updateAgent(agent.id, data);
      } else {
        await createAgent(data);
      }
      onSave();
    } catch (error) {
      alert('操作失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200 px-4" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 w-[450px]" onClick={(e) => e.stopPropagation()}>
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
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-400 shadow-sm transition-colors"
                placeholder="例如：PC3-高级架构师"
              />
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
                <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto p-1.5 custom-scrollbar agent-roles-dropdown">
                  {roleOptions.map(option => (
                    <label key={option.value} className={`flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors agent-role-option ${selectedRoles.includes(option.value) ? 'bg-blue-50/50 agent-role-selected' : ''}`}>
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

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-2">
              <p className="text-[10px] text-blue-700 leading-relaxed">
                <strong>说明：</strong>新增 Agent 时系统将自动生成 Worker SK 和默认模型配置。如需修改高级配置，请在创建后点击编辑按钮进行修改。
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-2.5 border-t border-white/40 bg-white/40 shrink-0">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50">取消</button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50">
            <CheckCircle2 size={14}/> {loading ? '保存中...' : (isEdit ? '保存修改' : '确认创建')}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 主组件 ---
const AgentList = () => {
  const [agentModalState, setAgentModalState] = useState({ isOpen: false, agent: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 20;

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, page_size: itemsPerPage };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await getAgents(params);
      setAgents(res.items || []);
      setTotal(res.total || 0);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const handleSave = () => {
    setAgentModalState({ isOpen: false, agent: null });
    loadAgents();
  };

  const handleDelete = async (agentId) => {
    if (!confirm('确定要删除此 Agent 吗？此操作不可恢复。')) return;
    try {
      await deleteAgent(agentId);
      loadAgents();
    } catch (error) {
      alert('删除失败：' + error.message);
    }
  };

  const filteredAgents = agents.filter(ag => {
    const matchSearch = ag.name.toLowerCase().includes(searchQuery.toLowerCase()) || ag.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || ag.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="bg-white/70 border border-white/60 rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm">
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
            <option value="all">全部状态</option>
            <option value="online">在线</option>
            <option value="idle">空闲</option>
            <option value="busy">忙碌</option>
            <option value="offline">离线</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={loadAgents} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="刷新">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="w-px h-6 bg-slate-200"></div>
          <button onClick={() => setAgentModalState({ isOpen: true, agent: null })} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
            <Plus size={14} strokeWidth={2.5} /> 新增 Agent
          </button>
        </div>
      </div>

      {/* 内容展示区 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-50/30 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-bold text-sm gap-2">
            <RefreshCw size={32} className="animate-spin"/> 加载中...
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-bold text-sm gap-2">
            <Terminal size={32} className="opacity-20"/> 未匹配到任何 Agent
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 flex-1 content-start">
            {filteredAgents.map(ag => (
              <div key={ag.id} className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all flex flex-col relative group min-h-[135px] agent-card">
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                      <CrystalCrawfishSurfLogo className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[11px] font-black text-slate-800 truncate leading-tight agent-name">{ag.name}</span>
                      <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5 mt-0.5 truncate"><BrainCircuit size={9}/>{ag.model}</span>
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5 pl-1">
                    <StatusBadge status={ag.status} type="agent" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2.5">
                   <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-lg py-1.5 shadow-sm">
                     <span className="text-[8px] font-bold text-slate-400 mb-0.5 agent-label">Tokens</span>
                     <span className="font-mono text-[11px] font-bold text-slate-700 leading-none agent-value">{formatNumber(ag.tokens)}</span>
                   </div>
                   <div className="flex flex-col items-center justify-center bg-cyan-50/50 border border-cyan-100 rounded-lg py-1.5 shadow-sm relative overflow-hidden">
                     <div className="absolute inset-0 bg-cyan-400/10 blur-md"></div>
                     <span className="text-[8px] font-bold text-cyan-600/80 mb-0.5 flex items-center gap-1 z-10">
                       <Gem size={8} className="text-cyan-500 fill-cyan-100"/> 鳞石
                     </span>
                     <span className="font-mono text-[11px] font-bold text-cyan-700 leading-none z-10 agent-linshi">{formatNumber(ag.linshi)}</span>
                   </div>
                </div>

                <div className="text-[9px] font-medium mb-2 flex-1">
                  {ag.status === 'busy' ? (
                    <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-1.5 rounded text-blue-700">
                      <span className="truncate flex-1 pr-1 font-bold">{ag.current_task || '执行中'}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 p-1.5 bg-slate-50 border border-slate-100 rounded text-center truncate">
                      {ag.status === 'offline' ? '已切断连接' : '节点空闲待命中...'}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 mt-auto border-t border-slate-100 pb-2">
                   <div className="flex items-end gap-1 agent-roles-container">
                     {ag.roles.length > 0 ? (
                       <>
                         <RoleTag role={ag.roles[0]} />
                         {ag.roles.length > 1 && (
                           <div className="relative group/roles">
                             <span className="inline-flex items-center justify-center px-1 py-0.5 text-[8px] text-slate-500 font-medium bg-slate-100 border border-slate-200 shadow-sm rounded h-[18px] leading-none cursor-default hover:bg-slate-200 transition-colors">+{ag.roles.length - 1}</span>
                             <div className="invisible group-hover/roles:visible absolute top-full left-0 mt-0.5 flex flex-wrap gap-1 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 z-20 min-w-[120px] pointer-events-none group-hover/roles:pointer-events-auto">
                               {ag.roles.map(r => <RoleTag key={r} role={r} />)}
                             </div>
                           </div>
                         )}
                       </>
                     ) : (
                       <span className="text-[8px] text-slate-400 italic">未分配角色</span>
                     )}
                   </div>
                   <div className="flex items-center gap-1">
                     <CopyIconBtn sk={ag.worker_sk || 'sk_***'} />
                     <button onClick={() => setAgentModalState({ isOpen: true, agent: ag })} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded border border-transparent hover:border-indigo-200 transition-colors shadow-sm" title="编辑节点配置"><Edit size={12}/></button>
                     <button onClick={() => handleDelete(ag.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 rounded border border-transparent hover:border-rose-200 transition-colors shadow-sm" title="删除"><X size={12}/></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页控制器 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 px-1 pt-2 border-t border-slate-200/60 shrink-0">
             <span className="text-[10px] font-bold text-slate-500">共 <span className="text-blue-600">{total}</span> 个 Agent 节点</span>
             <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg shadow-sm p-0.5">
               <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-2 py-1 text-[10px] font-bold text-slate-600 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">上一页</button>
               <div className="px-3 text-[10px] font-mono font-bold text-slate-700 border-x border-slate-100">{currentPage} / {totalPages}</div>
               <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-2 py-1 text-[10px] font-bold text-slate-600 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">下一页</button>
             </div>
          </div>
        )}
      </div>

      {agentModalState.isOpen && (
        <AgentFormModal
          agent={agentModalState.agent}
          onClose={() => setAgentModalState({ isOpen: false, agent: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AgentList;
