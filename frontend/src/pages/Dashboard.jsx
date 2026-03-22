import React from 'react';
import { Cpu, Activity, Network, Server, Terminal } from 'lucide-react';
import { mockAgents, mockLogs } from '../data/mockData';

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

export default Dashboard;
