import React, { useState } from 'react';
import {
  X, FileText, Paperclip, FileIcon, ImageIcon,
  Plus, Play, CheckCircle2, GitMerge, Box, Activity, Cpu,
  ChevronDown, ChevronRight, Terminal, Layout, Code, FileJson,
  Flag, CheckCircle, SkipForward, PauseCircle, Ban, Eye,
  Edit, Trash2, Save, FolderOpen, Search, AlertTriangle, Info
} from 'lucide-react';
import { RoleTag } from './Tags';

// --- Confirm Modal Component (通用二次确认弹窗) ---
export const ConfirmModal = ({
  type = 'warning', // 'warning' | 'info' | 'danger'
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  confirmLoading = false
}) => {
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white'
    },
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50',
      confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200 px-4">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 w-[420px]">
        <div className="p-4 flex items-start gap-3">
          <div className={`${config.iconBg} ${config.iconColor} rounded-full p-2.5 shrink-0`}>
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="p-3 border-t border-slate-200/60 bg-slate-50/50 flex justify-end gap-2 shrink-0">
          <button
            onClick={onCancel}
            disabled={confirmLoading}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmLoading}
            className={`px-4 py-1.5 ${config.confirmBtn} text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50`}
          >
            {confirmLoading && <CheckCircle2 size={12} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Request Type Select Component (需求类型下拉) ---
export const ReqTypeSelect = ({ value, onChange, placeholder = '选择需求类型', disabled = false, size = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'functional', label: '功能需求', desc: '新增或修改功能' },
    { value: 'non-functional', label: '非功能需求', desc: '性能、安全等' },
    { value: 'technical', label: '技术需求', desc: '架构、重构等' },
    { value: 'bug', label: '缺陷修复', desc: 'Bug 修复' },
    { value: 'change', label: '变更需求', desc: '需求变更' }
  ];

  const selected = options.find(o => o.value === value);

  const sizeClass = size === 'small' ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs';

  return (
    <div className="relative">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full font-bold text-slate-800 bg-white border border-slate-200 rounded cursor-pointer flex items-center justify-between ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:outline-none focus:border-blue-400 shadow-sm'}`}
      >
        {selected ? (
          <span>{selected.label}</span>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        <ChevronDown size={12} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[99]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[100] overflow-hidden">
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${value === opt.value ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">{opt.label}</span>
                </div>
                <span className="text-[9px] text-slate-500">{opt.desc}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Priority Select Component (优先级下拉) ---
export const PrioritySelect = ({ value, onChange, placeholder = '选择优先级', disabled = false, size = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'P0', label: 'P0', desc: '最高优先级', color: 'text-rose-600 bg-rose-50' },
    { value: 'P1', label: 'P1', desc: '高优先级', color: 'text-amber-600 bg-amber-50' },
    { value: 'P2', label: 'P2', desc: '普通优先级', color: 'text-blue-600 bg-blue-50' },
    { value: 'P3', label: 'P3', desc: '低优先级', color: 'text-slate-600 bg-slate-50' }
  ];

  const selected = options.find(o => o.value === value);

  const sizeClass = size === 'small' ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs';

  return (
    <div className="relative">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded cursor-pointer flex items-center justify-between ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:outline-none focus:border-blue-400 shadow-sm'}`}
      >
        {selected ? (
          <span className={selected.color}>{selected.label}</span>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
        <ChevronDown size={12} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[99]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[100] overflow-hidden">
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${value === opt.value ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-bold ${opt.color} px-1.5 py-0.5 rounded border border-current`}>{opt.label}</span>
                  <span className="text-[9px] text-slate-500">{opt.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Agent Select Dropdown Component (Multi-select with search) ---
export const AgentSelect = ({ value = [], onChange, placeholder = '选择 Agent...', agents = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 使用传入的 agents 列表
  const agentList = agents;

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-emerald-500';
      case 'busy': return 'bg-amber-500';
      case 'idle': return 'bg-blue-400';
      case 'offline': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'online': return '在线';
      case 'busy': return '执行中';
      case 'idle': return '空闲';
      case 'offline': return '断线';
      default: return status;
    }
  };

  const filteredAgents = agentList.filter(agent => {
    const searchLower = searchTerm.toLowerCase();
    return agent.name.toLowerCase().includes(searchLower) ||
           agent.roles.some(r => r.toLowerCase().includes(searchLower)) ||
           agent.model.toLowerCase().includes(searchLower);
  });

  const toggleAgent = (agentId) => {
    if (value.includes(agentId)) {
      onChange(value.filter(id => id !== agentId));
    } else {
      onChange([...value, agentId]);
    }
  };

  const removeAgent = (agentId, e) => {
    e.stopPropagation();
    onChange(value.filter(id => id !== agentId));
  };

  const selectedAgents = agentList.filter(a => value.includes(a.id));

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm cursor-pointer min-h-[38px] flex flex-wrap gap-1.5 items-center"
      >
        {selectedAgents.length === 0 ? (
          <span className="text-slate-400 select-none flex-1">{placeholder}</span>
        ) : (
          selectedAgents.map(agent => (
            <span key={agent.id} className="bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(agent.status)}`}></span>
              {agent.name}
              <button onClick={(e) => removeAgent(agent.id, e)} className="hover:text-blue-900">
                <X size={10} />
              </button>
            </span>
          ))
        )}
        <ChevronDown size={12} className={`text-slate-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[99]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[100] max-h-60 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索 Agent 名称/角色/Model..."
                  className="w-full text-xs bg-white border border-slate-200 rounded pl-7 pr-2 py-1.5 focus:outline-none focus:border-blue-400"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48 custom-scrollbar">
              {filteredAgents.length === 0 ? (
                <div className="p-3 text-center text-[10px] text-slate-400">未找到匹配的 Agent</div>
              ) : (
                filteredAgents.map(agent => {
                  const isSelected = value.includes(agent.id);
                  return (
                    <label
                      key={agent.id}
                      className={`flex items-center gap-2 p-2.5 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${isSelected ? 'bg-blue-50/50' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAgent(agent.id)}
                        className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} title={getStatusText(agent.status)}></span>
                          <span className="text-[11px] font-bold text-slate-800 truncate">{agent.name}</span>
                          <span className="text-[9px] text-slate-500 bg-slate-100 px-1 rounded font-mono">{agent.model}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex gap-1 flex-wrap">
                            {agent.roles.slice(0, 3).map((role, idx) => (
                              <RoleTag key={idx} role={role} />
                            ))}
                          </div>
                          <span className="text-[9px] text-slate-400 ml-auto">{getStatusText(agent.status)}</span>
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Modal Base Component ---
export const Modal = ({ title, onClose, children, footer, size = 'default', zIndex = 'z-50', heightClass = 'h-[88vh] max-h-[88vh]' }) => {
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

// --- Attachment Modal ---
export const AttachmentModal = ({ item, onClose }) => {
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

// --- Create Requirement Modal (3-Step Wizard) ---
export const CreateRequirementModal = ({ onClose, agents = [] }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [agentList, setAgentList] = useState(agents);

  React.useEffect(() => {
    // 使用传入的 agents
    setAgentList(agents);
  }, [agents]);

  const [features, setFeatures] = useState([
    { id: 1, name: '多端自适应布局', priority: 'P1', desc: '支持在移动端和 PC 端无缝切换，保证交互体验一致。', isEditing: false },
    { id: 2, name: '数据看板图表展示', priority: 'P0', desc: '集成 ECharts，提供基础的折线图、柱状图数据渲染。', isEditing: false }
  ]);

  const targetPhases = ['UI 设计', '概要设计', '详细设计', '系统研发', '系统测试'];
  const [selectedFeatureIds, setSelectedFeatureIds] = useState(new Set());
  const [phaseAssignments, setPhaseAssignments] = useState({
    'UI 设计': [], '概要设计': [], '详细设计': [], '系统研发': [], '系统测试': []
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
                   {isAnalyzing ? <CheckCircle2 size={14} className="animate-spin"/> : <Play size={14}/>} 进行需求分析
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
                       ) : <span className={`text-[9px] px-1 py-0.5 rounded border font-mono font-bold ${f.priority === 'P0' ? 'bg-red-50 text-red-600 border-red-200' : f.priority === 'P1' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>{f.priority}</span>}
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
                     <span className={`text-[9px] px-1 py-0.5 rounded border font-mono font-bold ${f.priority === 'P0' ? 'bg-red-50 text-red-600 border-red-200' : f.priority === 'P1' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>{f.priority}</span>
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
                              const ag = agentList.find(a => a.id === agId);
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
                           {agentList.map(ag => (
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

// --- Task Detail Modal ---
export const TaskDetailModal = ({ task, onClose }) => {
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
            <span className="flex items-center gap-0.5"><GitMerge size={10} className="text-cyan-500"/> 关联大纲：{task.reqId}</span>
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

// --- Project Modal (Add/Edit Project) ---
export const ProjectModal = ({ project, agents = [], onClose, onSave }) => {
  const isEdit = !!project;
  const [formData, setFormData] = useState({
    name: project?.name || '',
    manager_id: project?.manager_id || '',
    manager_name: project?.manager_name || '',
    start_date: project?.start_date || project?.startDate || '2026-03-01',
    end_date: project?.end_date || project?.endDate || '2026-04-30',
    description: project?.description || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.manager_id) {
      alert('请填写必填项');
      return;
    }
    if (onSave) {
      onSave({
        name: formData.name,
        manager_id: formData.manager_id,
        manager_name: formData.manager_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description
      });
    }
    onClose();
  };

  // 找到选中的 agent
  const selectedAgent = agents.find(a => a.id === formData.manager_id);

  return (
    <Modal
      size="large"
      zIndex="z-[60]"
      title={
        <div className="flex items-center gap-1.5">
          <FolderOpen size={14} className="text-blue-600"/>
          <span>{isEdit ? '编辑项目' : '新建项目'}</span>
        </div>
      }
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">
            取消
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
            保存
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">项目名称 <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
              placeholder="请输入项目名称"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">负责人 (Agent) <span className="text-rose-500">*</span></label>
            <AgentSelect
              value={formData.manager_id ? [formData.manager_id] : []}
              onChange={(agentIds) => {
                const agentId = agentIds[0] || '';
                const agent = agents.find(a => a.id === agentId);
                handleChange('manager_id', agentId);
                handleChange('manager_name', agent ? agent.name : '');
              }}
              placeholder="选择负责 Agent..."
              agents={agents}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">开始日期</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">结束日期</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
              className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <label className="text-[10px] font-bold text-slate-500">项目描述</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full h-24 text-xs text-slate-800 bg-white border border-slate-200 rounded p-2.5 focus:outline-none focus:border-blue-400 resize-none custom-scrollbar shadow-sm"
            placeholder="请输入项目描述..."
          />
        </div>
      </div>
    </Modal>
  );
};

// --- Module Modal (Add/Edit Module) ---
export const ModuleModal = ({ module, onClose, onSave }) => {
  const isEdit = !!module;
  const [formData, setFormData] = useState({
    title: module?.title || '',
    docs: module?.docs || 0,
    expanded: module?.expanded || true,
    type: 'module'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.title) {
      alert('请填写模块名称');
      return;
    }
    if (onSave) {
      onSave({
        ...formData,
        parent_id: null
      });
    }
    onClose();
  };

  return (
    <Modal
      size="large"
      zIndex="z-[60]"
      title={
        <div className="flex items-center gap-1.5">
          <Box size={14} className="text-indigo-600"/>
          <span>{isEdit ? '编辑大纲模块' : '新增大纲模块'}</span>
        </div>
      }
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">
            取消
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
            保存
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex flex-col gap-1 shrink-0">
          <label className="text-[10px] font-bold text-slate-500">模块名称 <span className="text-rose-500">*</span></label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
            placeholder="请输入模块名称，例如：用户管理模块"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">附件数量</label>
            <input
              type="number"
              min="0"
              value={formData.docs}
              onChange={(e) => handleChange('docs', parseInt(e.target.value) || 0)}
              className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">默认展开</label>
            <select
              value={formData.expanded ? 'true' : 'false'}
              onChange={(e) => handleChange('expanded', e.target.value === 'true')}
              className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
            >
              <option value="true">是</option>
              <option value="false">否</option>
            </select>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 shrink-0">
          <h4 className="text-[11px] font-bold text-indigo-700 mb-1.5 flex items-center gap-1.5">
            <Box size={12} className="text-indigo-500"/> 模块说明
          </h4>
          <p className="text-[10px] text-indigo-600 leading-relaxed">
            模块是需求大纲的顶级节点，用于组织和管理相关的功能点。每个模块下可以添加多个子功能，支持分配给不同的 Agent 进行研发。
          </p>
        </div>
      </div>
    </Modal>
  );
};

// --- Feature Modal (Add/Edit Feature) ---
export const FeatureModal = ({ feature, module, onClose, onSave }) => {
  const isEdit = !!feature;
  const [formData, setFormData] = useState({
    title: feature?.title || '',
    reqType: feature?.reqType || 'functional',
    priority: feature?.priority || 'P1',
    description: feature?.description || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...feature,
        ...formData,
        id: feature?.id || `FEAT-${Date.now()}`,
        currentStep: feature?.currentStep || 0
      });
    }
    onClose();
  };

  return (
    <Modal
      size="large"
      zIndex="z-[60]"
      title={
        <div className="flex items-center gap-1.5">
          <GitMerge size={14} className="text-cyan-600"/>
          <span>{isEdit ? '编辑子功能' : '新增子功能'}</span>
        </div>
      }
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">
            取消
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
            保存
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex flex-col gap-1 shrink-0">
          <label className="text-[10px] font-bold text-slate-500">功能名称 <span className="text-rose-500">*</span></label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-400 shadow-sm"
            placeholder="请输入功能名称"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">需求类型</label>
            <ReqTypeSelect
              value={formData.reqType}
              onChange={(value) => handleChange('reqType', value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500">优先级</label>
            <PrioritySelect
              value={formData.priority}
              onChange={(value) => handleChange('priority', value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <label className="text-[10px] font-bold text-slate-500">所属模块</label>
          <input
            type="text"
            value={module?.title || '-'}
            disabled
            className="w-full text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 cursor-not-allowed shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-1 shrink-0 flex-1">
          <label className="text-[10px] font-bold text-slate-500">功能描述</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full h-32 text-xs text-slate-800 bg-white border border-slate-200 rounded p-2.5 focus:outline-none focus:border-blue-400 resize-none custom-scrollbar shadow-sm"
            placeholder="请输入功能详细描述..."
          />
        </div>
      </div>
    </Modal>
  );
};

// --- Feature Flow Modal ---
export const FeatureFlowModal = ({ feature, onClose, tasks = [], projectId }) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());
  const [viewingTask, setViewingTask] = useState(null);
  const [taskList, setTaskList] = useState(tasks);

  const actualStepIdx = feature.currentStep || 0;
  const [viewedStepIdx, setViewedStepIdx] = useState(actualStepIdx);

  React.useEffect(() => {
    // 使用传入的 tasks
    setTaskList(tasks);
  }, [tasks]);

  const featureTasks = taskList.filter(t => t.req_id === feature.id || t.reqId === feature.id);
  const canOperate = viewedStepIdx === actualStepIdx;

  const steps = [
    { icon: FileText, label: '需求设计' },
    { icon: Layout, label: 'UI 设计' },
    { icon: FileJson, label: '概要设计' },
    { icon: Code, label: '详细设计' },
    { icon: Terminal, label: '系统研发' },
    { icon: CheckCircle, label: '系统测试' },
    { icon: Flag, label: '项目验收' }
  ];

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
                  <Activity size={12} className="text-blue-500"/> 【{steps[viewedStepIdx].label}】节点拆解子任务
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
