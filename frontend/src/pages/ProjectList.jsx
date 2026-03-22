import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, MoreVertical, Calendar, Clock, Cpu } from 'lucide-react';
import { StatusBadge } from '../components/utils/Tags';
import { mockProjects } from '../data/mockData';

const ProjectList = () => {
  const navigate = useNavigate();

  const handleProjectClick = (proj) => {
    navigate(`/projects/${proj.id}`);
  };

  return (
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
                  <span onClick={() => handleProjectClick(proj)} className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer w-fit">{proj.name}</span>
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
};

export default ProjectList;
