import React, { useState, useEffect } from 'react';
import { Circle, Play, AlertCircle, CheckCircle2, Filter, Cpu, Plus, RefreshCw } from 'lucide-react';
import { PriorityTag, StatusBadge, RoleTag } from '../components/utils/Tags';
import { Modal } from '../components/utils/Modal';
import { getProjectTasks, getAgents } from '../api';

const TaskKanban = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectId] = useState('pj-001'); // Default project for demo

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, agentsRes] = await Promise.all([
        getProjectTasks(projectId, { page: 1, page_size: 100 }),
        getAgents({ page: 1, page_size: 100 })
      ]);
      setTasks(tasksRes.items || []);
      setAgents(agentsRes.items || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusValue = (status) => {
    // Map backend status to kanban columns
    const statusMap = {
      'pending': 'todo',
      'todo': 'todo',
      'in_progress': 'in_progress',
      'review': 'review',
      'completed': 'completed'
    };
    return statusMap[status] || 'todo';
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black text-slate-800">电商平台重构</h2>
          <span className="px-1.5 py-0.5 bg-white/80 border border-white text-blue-600 shadow-sm rounded text-[9px] font-bold">Sprint 3</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white/60 backdrop-blur-md text-slate-600 text-[11px] px-2.5 py-1 border border-white/80 shadow-sm rounded-md flex items-center gap-1 font-medium">
            <Filter size={10}/> 过滤
          </button>
          <button onClick={loadData} className="p-1 hover:bg-white rounded transition-colors" title="刷新">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <RefreshCw size={20} className="animate-spin"/> 加载中...
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            暂无任务数据，请先在项目需求树中创建任务
          </div>
        ) : (
          columns.map(col => {
            const ColIcon = col.icon;
            const columnTasks = tasks.filter(t => getStatusValue(t.status) === col.id);
            return (
              <div key={col.id} className={`w-64 flex-shrink-0 flex flex-col bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl shadow-sm overflow-hidden relative`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${col.id === 'todo' ? 'bg-slate-300' : col.id === 'in_progress' ? 'bg-blue-400' : col.id === 'review' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>

                <div className="p-2 bg-white/50 border-b border-white/60 flex items-center justify-between mt-1 shrink-0">
                  <h3 className={`text-[11px] font-bold flex items-center gap-1 ${col.color}`}><ColIcon size={12} strokeWidth={2.5} /> {col.title}</h3>
                  <span className="text-[9px] bg-white/80 shadow-sm border border-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-mono font-bold">{columnTasks.length}</span>
                </div>

                <div className="flex-1 p-2 overflow-y-auto space-y-2 custom-scrollbar min-h-0">
                  {columnTasks.map(task => (
                    <div key={task.id} className="bg-white/80 backdrop-blur-sm border border-white hover:border-blue-200 p-2.5 rounded-lg cursor-pointer transition-all group shadow-sm flex flex-col relative">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[8px] font-mono font-bold text-slate-500 bg-slate-100/50 px-1 py-0.5 rounded">{task.id}</span>
                        <PriorityTag p={task.priority || 'P2'} />
                      </div>
                      <h4 className="text-[11px] font-bold text-slate-800 mb-1 leading-snug">{task.title}</h4>
                      <div className="flex justify-between items-center mt-auto pt-1.5 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500">
                          <Cpu size={10} className={task.status === 'in_progress' ? 'text-blue-500' : 'text-slate-400'} />
                          <span className="truncate max-w-[80px]">{task.assignee_name || '未分配'}</span>
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
          })
        )}
      </div>

      {assignModalOpen && selectedTask && (
        <Modal title="快速指派" onClose={() => setAssignModalOpen(false)} heightClass="max-h-[88vh]">
          <div className="space-y-3">
            <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-lg p-3 shadow-sm">
              <div className="text-[10px] text-slate-500 mb-1 font-mono font-bold">{selectedTask.id} · {selectedTask.project_id}</div>
              <div className="text-xs font-black text-slate-800">{selectedTask.title}</div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1.5">选择执行 Agent</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {agents.map(agent => (
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

export default TaskKanban;
