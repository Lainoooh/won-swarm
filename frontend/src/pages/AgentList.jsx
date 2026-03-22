import React, { useState } from 'react';
import { Search, Plus, Settings, Square, CheckCircle2, X } from 'lucide-react';
import { StatusBadge, RoleTag } from '../components/utils/Tags';
import { mockAgents } from '../data/mockData';

const AgentList = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [stoppedAgents, setStoppedAgents] = useState(new Set());

  const handleStopAgent = (agentId) => {
    const newSet = new Set(stoppedAgents);
    if (newSet.has(agentId)) {
      newSet.delete(agentId);
    } else {
      newSet.add(agentId);
    }
    setStoppedAgents(newSet);
    console.log('Stop/Start agent:', agentId, !stoppedAgents.has(agentId));
  };

  const handleSettings = (agentId) => {
    console.log('Settings for agent:', agentId);
  };

  const handleSaveAgent = (agentData) => {
    console.log('Save agent:', agentData);
    setShowAddModal(false);
  };

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
                    <button
                      onClick={() => handleStopAgent(agent.id)}
                      className={`p-1 hover:bg-white hover:shadow-sm rounded border transition-all ${stoppedAgents.has(agent.id) ? 'text-emerald-500 hover:text-emerald-600 hover:border-emerald-200 bg-emerald-50' : 'text-slate-400 hover:text-red-500 hover:border-slate-200'}`}
                      title={stoppedAgents.has(agent.id) ? '启动' : '停止'}
                    >
                      <Square size={12} />
                    </button>
                    <button
                      onClick={() => handleSettings(agent.id)}
                      className="p-1 hover:bg-white hover:shadow-sm hover:text-blue-600 text-slate-400 rounded border border-transparent hover:border-slate-200 transition-all"
                      title="设置"
                    >
                      <Settings size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[70] animate-in fade-in duration-200 px-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 w-[550px] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-2.5 border-b border-white/40 bg-white/40 shrink-0">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Plus size={14} className="text-blue-600"/>
                <span>新增 Agent 节点</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white/50 rounded-md p-1 hover:bg-white border border-white/50 shadow-sm"><X size={14} /></button>
            </div>
            <div className="p-3 overflow-y-auto custom-scrollbar bg-transparent flex flex-col flex-1 min-h-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">Agent 名称 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
                      placeholder="例如：PC2-前端开发"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">Worker SK <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      className="w-full text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
                      placeholder="worker_sk_xxxxx"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">配置角色</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                    {['前端开发', '后端开发', '测试专家', '项目经理', 'UI 设计', '架构师'].map(role => (
                      <label key={role} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded cursor-pointer transition-colors">
                        <input type="checkbox" className="w-3 h-3 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                        <span className="text-[10px] font-medium text-slate-700">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">备注说明</label>
                  <textarea
                    className="w-full h-20 text-xs text-slate-800 bg-white border border-slate-200 rounded p-2.5 focus:outline-none focus:border-blue-400 resize-none custom-scrollbar shadow-sm"
                    placeholder="请输入 Agent 节点的备注说明..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                  <h4 className="text-[11px] font-bold text-blue-700 mb-1">配置说明</h4>
                  <ul className="text-[10px] text-blue-600 space-y-0.5 list-disc list-inside">
                    <li>Worker SK 是 Agent 与调度中心通信的凭证</li>
                    <li>一个 Agent 可以同时配置多个角色</li>
                    <li>创建完成后需要重启 Agent 节点才能生效</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-2.5 border-t border-white/40 bg-white/40 flex justify-end gap-2 shrink-0">
              <button onClick={() => setShowAddModal(false)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">取消</button>
              <button onClick={() => handleSaveAgent({})} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;
