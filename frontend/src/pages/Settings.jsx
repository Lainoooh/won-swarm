import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Cpu, Monitor, ShieldAlert, Key, Database, Server,
  CheckCircle2, RefreshCw, Save, Check, ChevronRight
} from 'lucide-react';

const SettingsView = () => {
  const { theme, setTheme } = useOutletContext();
  const [activeTab, setActiveTab] = useState('models');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const tabs = [
    { id: 'models', label: '模型接入 (Models)', icon: Cpu },
    { id: 'appearance', label: '外观主题 (Appearance)', icon: Monitor },
    { id: 'security', label: '安全管控 (Security)', icon: ShieldAlert },
    { id: 'secrets', label: '凭证金库 (Secrets)', icon: Key },
  ];

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
      setTimeout(() => setTestResult(null), 3000);
    }, 1500);
  };

  return (
    <div className="bg-white/70 border border-white/60 rounded-xl flex flex-1 overflow-hidden shadow-sm m-1.5 relative z-10 backdrop-blur-2xl">
      <div className="w-56 bg-slate-50/50 border-r border-white/60 p-4 flex flex-col gap-2 shrink-0">
        <h2 className="text-sm font-black text-slate-800 mb-2 pl-2">平台设置</h2>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-bold nav-btn ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 settings-tab-active'
                : 'text-slate-600 hover:bg-white/60 border border-transparent hover:border-white/50 shadow-sm'
            }`}
          >
            <tab.icon size={16} strokeWidth={2.5} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-transparent">
        <div className="max-w-3xl">
          {activeTab === 'models' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Cpu size={20} className="text-blue-600" />
                  大模型驱动配置
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  配置全局 LLM 模型源，支持云端服务与本地私有化部署模型的混合调度。
                </p>
              </div>

              <div className="bg-white/80 border border-blue-200/60 rounded-xl shadow-sm overflow-hidden relative backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="p-4 border-b border-white/60 flex justify-between items-center bg-blue-50/40">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-blue-600" />
                    <span className="font-bold text-sm text-slate-800">本地私有化模型 (Local Model)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100/80 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200/50">
                    推荐方案
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">服务框架 (Provider)</label>
                      <select className="w-full text-xs font-medium text-slate-800 bg-white/60 border border-white rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none shadow-sm">
                        <option>Ollama (兼容 API)</option>
                        <option>vLLM</option>
                        <option>LM Studio</option>
                        <option>自定义 OpenAI 兼容协议</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">默认模型名称 (Model ID)</label>
                      <input
                        type="text"
                        defaultValue="llama3:8b"
                        className="w-full text-xs font-mono text-slate-800 bg-white/60 border border-white rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">接口地址 (Base URL)</label>
                    <input
                      type="text"
                      defaultValue="http://127.0.0.1:11434/v1"
                      className="w-full text-xs font-mono text-slate-800 bg-white/60 border border-white rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-600 flex justify-between">
                      <span>访问密钥 (API Key)</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        若无需鉴权可留空或填 "ollama"
                      </span>
                    </label>
                    <div className="relative">
                      <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        defaultValue="ollama"
                        className="w-full text-xs font-mono text-slate-800 bg-white/60 border border-white rounded-lg pl-8 pr-3 py-2 focus:border-blue-400 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-white/60 mt-4">
                    <div className="text-xs font-medium h-6 flex items-center">
                      {isTesting && (
                        <span className="text-blue-500 flex items-center gap-1.5">
                          <RefreshCw size={12} className="animate-spin" />
                          正在与本地端口握手...
                        </span>
                      )}
                      {testResult === 'success' && (
                        <span className="text-emerald-600 flex items-center gap-1.5">
                          <CheckCircle2 size={12} />
                          连接成功！模型响应正常。
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-white/50 hover:bg-white rounded-lg transition-colors border border-white shadow-sm disabled:opacity-50"
                      >
                        测试连接
                      </button>
                      <button className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5">
                        <Save size={14} />
                        保存配置
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 border border-white/60 rounded-xl p-4 flex items-center justify-between opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/80 border border-white flex items-center justify-center shadow-sm">
                    <Server size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">OpenAI / Anthropic 云端接入</div>
                    <div className="text-[10px] text-slate-400">点击配置云端商业大模型...</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Monitor size={20} className="text-blue-600" />
                  UI 主题与外观
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  全局切换系统视觉体验，支持清透风格与赛博朋克深色模式。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-4">
                {/* 蔚蓝晶透 主题卡片 */}
                <div
                  onClick={() => setTheme('azure')}
                  className={`border-2 rounded-xl p-1 cursor-pointer transition-all duration-300 shadow-sm ${
                    theme === 'azure'
                      ? 'border-[#3b82f6] shadow-md scale-[1.02] bg-[#eff6ff]'
                      : 'border-[#cbd5e1] hover:border-[#93c5fd] bg-[#f8fafc]'
                  }`}
                >
                  <div className="h-32 rounded-lg overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#e8eef3] border border-[#f1f5f9] p-3 relative flex flex-col justify-between">
                    <div className="flex gap-2">
                      <div className="w-1/4 h-8 bg-[#ffffff]/80 rounded shadow-sm border border-[#ffffff]"></div>
                      <div className="w-3/4 h-8 bg-[#ffffff]/60 rounded shadow-sm border border-[#ffffff]"></div>
                    </div>
                    <div className="w-full h-12 bg-[#ffffff] rounded shadow-sm border border-[#ffffff]/50 flex items-center justify-center">
                      <span className="text-[#3b82f6] font-bold text-[10px] px-2 py-1 bg-[#eff6ff] rounded">
                        Active Component
                      </span>
                    </div>
                    {theme === 'azure' && (
                      <div className="absolute top-2 right-2 bg-[#3b82f6] text-[#ffffff] p-1 rounded-full shadow-sm z-50">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-sm font-black text-[#1e293b]">蔚蓝晶透</div>
                    <div className="text-[10px] text-[#64748b] mt-0.5">
                      Azure Glass - 默认浅色高斯模糊
                    </div>
                  </div>
                </div>

                {/* 霓虹深渊 主题卡片 */}
                <div
                  onClick={() => setTheme('cyberpunk')}
                  className={`border-2 rounded-xl p-1 cursor-pointer transition-all duration-300 shadow-sm ${
                    theme === 'cyberpunk'
                      ? 'border-[#22d3ee] shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-[1.02] bg-[#0f172a]'
                      : 'border-[#334155] hover:border-[#475569] bg-[#1e293b]'
                  }`}
                >
                  <div className="h-32 rounded-lg overflow-hidden bg-gradient-to-br from-[#020617] to-[#0f172a] border border-[#1e293b] p-3 relative flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:10px_10px] opacity-30"></div>
                    <div className="flex gap-2 relative z-10">
                      <div className="w-1/4 h-8 bg-[#1e293b]/80 rounded border border-[#22d3ee]/30"></div>
                      <div className="w-3/4 h-8 bg-[#0f172a]/80 rounded border border-[#334155]"></div>
                    </div>
                    <div className="w-full h-12 bg-[#1e293b] rounded border border-[#334155] flex items-center justify-center relative z-10">
                      <span className="text-[#22d3ee] font-bold text-[10px] px-2 py-1 bg-[#083344]/50 border border-[#155e75] rounded drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                        Neon Cyber Component
                      </span>
                    </div>
                    {theme === 'cyberpunk' && (
                      <div className="absolute top-2 right-2 bg-[#06b6d4] text-[#0f172a] p-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] z-50">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-sm font-black text-[#f8fafc]">霓虹深渊</div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5">
                      Neon Cyberpunk - 朋克科技护眼模式
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-black text-rose-600 flex items-center gap-2">
                  <ShieldAlert size={20} />
                  智能体行为与安全边界
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  防止 Agent 意外修改系统或造成天价账单，建议在生产环境中收紧权限。
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-sm">
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      允许执行宿主机终端命令 (Terminal)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      关闭后，Agent 生成的 shell 脚本将需要人工点击批准后才能运行。
                    </div>
                  </div>
                  <div className="w-10 h-6 bg-rose-500 rounded-full flex items-center p-1 cursor-pointer shadow-inner justify-end">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-sm">
                  <div>
                    <div className="text-sm font-bold text-slate-800">沙盒文件系统隔离</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      开启后，Agent 只能在工作区挂载目录内读写，无法访问系统根目录。
                    </div>
                  </div>
                  <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center p-1 cursor-pointer shadow-inner justify-end">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-sm">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">
                      全局 Token 熔断阈值 (单日)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      当 Swarm 集群消耗的 tokens 达到此数值，将自动暂停所有排队任务。
                    </div>
                  </div>
                  <div className="w-40 relative">
                    <input
                      type="number"
                      defaultValue="1000000"
                      className="w-full text-sm font-mono text-slate-800 bg-white/60 border border-white rounded-lg pr-12 pl-3 py-2 focus:border-blue-400 focus:outline-none shadow-sm text-right"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">
                      TOK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'secrets' && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-3 animate-in fade-in bg-white/40 border border-white/60 rounded-xl shadow-sm">
              <Key size={48} className="opacity-20" />
              <div className="text-sm font-bold">全局凭证库开发中...</div>
              <div className="text-xs max-w-sm text-center">
                这里未来将配置数据库密码、Github Token、第三方 API Key 等，
                并通过变量形式安全下发给需要的 Agent，杜绝硬编码。
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
