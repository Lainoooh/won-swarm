import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  FolderOpen, Search, Calendar, Cpu, Plus,
  ChevronDown, Box, Paperclip, GitMerge, Users,
  PauseCircle, SkipForward, Ban, Edit, Trash2, RefreshCw
} from 'lucide-react';
import { StatusBadge, PriorityTag, ReqTypeTag } from '../components/utils/Tags';
import { FeatureFlowModal, AttachmentModal, CreateRequirementModal, ModuleModal, FeatureModal, ConfirmModal } from '../components/utils/Modal';
import { getProjects, getRequirementsTree, createRequirement, updateRequirement, deleteRequirement, requirementAction, getAgents } from '../api';

const RequirementTree = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [treeData, setTreeData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [showCreateReqModal, setShowCreateReqModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  // 确认弹窗状态
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});

  const loadProjects = useCallback(async () => {
    try {
      const [projRes, agentsRes] = await Promise.all([
        getProjects({ page: 1, page_size: 100 }),
        getAgents({ page: 1, page_size: 100 })
      ]);
      const projList = projRes.items || [];
      setProjects(projList);
      setAgents(agentsRes.items || []);
      const proj = projList.find(p => p.id === projectId) || projList[0];
      setCurrentProject(proj);
      if (proj) {
        loadRequirements(proj.id);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, [projectId]);

  const loadRequirements = useCallback(async (pid) => {
    setLoading(true);
    try {
      const res = await getRequirementsTree(pid);
      setTreeData(res.items || []);
    } catch (error) {
      console.error('Failed to load requirements:', error);
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectChange = (p) => {
    navigate(`/projects/${p.id}`);
    setCurrentProject(p);
    loadRequirements(p.id);
  };

  const toggleNode = (id) => setTreeData(treeData.map(node => node.id === id ? { ...node, expanded: !node.expanded } : node));
  const openFeatureModal = (feature) => setActiveFeature(feature);

  // 通用确认弹窗处理
  const showConfirmModal = (config) => {
    setConfirmConfig(config);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (confirmConfig.onConfirm) {
      confirmConfig.onConfirm();
    }
    setShowConfirm(false);
    setConfirmConfig({});
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmConfig({});
  };

  // Module handlers
  const handleAddModule = () => {
    setEditingModule(null);
    setShowModuleModal(true);
  };

  const handleEditModule = (module, e) => {
    e.stopPropagation();
    setEditingModule(module);
    setShowModuleModal(true);
  };

  const handleDeleteModule = (module, e) => {
    e.stopPropagation();
    showConfirmModal({
      type: 'danger',
      title: '删除模块确认',
      message: `确定要删除模块"${module.title}"吗？删除后该模块下的所有子功能也将被删除，此操作不可恢复。`,
      confirmText: '确认删除',
      onConfirm: async () => {
        try {
          await deleteRequirement(module.id);
          loadRequirements(currentProject.id);
        } catch (error) {
          alert('删除失败：' + error.message);
        }
      }
    });
  };

  const handleSaveModule = async (moduleData) => {
    try {
      await createRequirement(currentProject.id, {
        type: 'module',
        parent_id: null,
        title: moduleData.title,
        description: '',
        docs_count: moduleData.docs || 0,
        expanded: moduleData.expanded,
        project_id: currentProject.id
      });
      loadRequirements(currentProject.id);
      setShowModuleModal(false);
      setEditingModule(null);
    } catch (error) {
      alert('保存失败：' + error.message);
    }
  };

  const handleAddFeature = (module, e) => {
    e.stopPropagation();
    setCurrentModule(module);
    setEditingFeature(null);
    setShowFeatureModal(true);
  };

  // Feature handlers
  const handleEditFeature = (feature, module, e) => {
    e.stopPropagation();
    setCurrentModule(module);
    setEditingFeature(feature);
    setShowFeatureModal(true);
  };

  const handleDeleteFeature = (feature, e) => {
    e.stopPropagation();
    showConfirmModal({
      type: 'danger',
      title: '删除功能确认',
      message: `确定要删除功能"${feature.title}"吗？删除后将无法恢复。`,
      confirmText: '确认删除',
      onConfirm: async () => {
        try {
          await deleteRequirement(feature.id);
          loadRequirements(currentProject.id);
        } catch (error) {
          alert('删除失败：' + error.message);
        }
      }
    });
  };

  const handleSaveFeature = async (featureData) => {
    try {
      if (editingFeature) {
        await updateRequirement(editingFeature.id, featureData);
      } else {
        await createRequirement(currentProject.id, { ...featureData, project_id: currentProject.id, parent_id: currentModule.id, type: 'feature' });
      }
      loadRequirements(currentProject.id);
      setShowFeatureModal(false);
      setCurrentModule(null);
      setEditingFeature(null);
    } catch (error) {
      alert('保存失败：' + error.message);
    }
  };

  // Feature action buttons
  const handleFeatureCollaborate = (feature) => {
    setActiveFeature(feature);
  };

  const handleFeatureCancel = (feature) => {
    showConfirmModal({
      type: 'warning',
      title: '取消流程确认',
      message: `确定要取消功能"${feature.title}"的流程吗？取消后该功能将被标记为已取消状态。`,
      confirmText: '确认取消',
      onConfirm: async () => {
        try {
          await requirementAction(feature.id, 'cancel');
          loadRequirements(currentProject.id);
        } catch (error) {
          alert('操作失败：' + error.message);
        }
      }
    });
  };

  const handleFeaturePause = (feature) => {
    showConfirmModal({
      type: 'warning',
      title: '叫停流程确认',
      message: `确定要叫停功能"${feature.title}"吗？叫停后该功能将暂停执行，直到重新激活。`,
      confirmText: '确认叫停',
      onConfirm: async () => {
        try {
          await requirementAction(feature.id, 'pause');
          loadRequirements(currentProject.id);
        } catch (error) {
          alert('操作失败：' + error.message);
        }
      }
    });
  };

  const handleFeatureAdvance = (feature) => {
    showConfirmModal({
      type: 'info',
      title: '推进流程确认',
      message: `确定要将功能"${feature.title}"推进到下一阶段吗？`,
      confirmText: '确认推进',
      onConfirm: async () => {
        try {
          await requirementAction(feature.id, 'advance');
          loadRequirements(currentProject.id);
        } catch (error) {
          alert('操作失败：' + error.message);
        }
      }
    });
  };

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
            const isActive = p.id === currentProject?.id;
            return (
              <div
                key={p.id}
                onClick={() => handleProjectChange(p)}
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
           <span>共 {projects.length} 项</span>
           <div className="flex items-center gap-0.5">
             <button className="p-0.5 hover:bg-white rounded"><ChevronDown size={10} className="rotate-90"/></button>
             <span className="px-0.5">1/1</span>
             <button className="p-0.5 hover:bg-white rounded"><ChevronDown size={10} className="-rotate-90"/></button>
           </div>
        </div>
      </div>

      {/* 右侧大纲树内容 */}
      <div className="flex-1 flex flex-col bg-transparent min-w-0">
        <div className="p-2 border-b border-white/40 flex justify-between items-center bg-white/40 shrink-0">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black text-slate-800">{currentProject?.name || '加载中...'} <span className="text-slate-500 font-normal">需求大纲</span></span>
              {currentProject && (
              <div className="flex flex-wrap items-center gap-1.5 ml-1 bg-white/60 border border-white/80 px-1.5 py-0.5 rounded shadow-sm text-[9px] font-medium text-slate-600">
                 <span className="flex items-center gap-0.5"><Cpu size={9} className="text-blue-500"/> {currentProject.manager_name}</span>
                 <div className="w-px h-2 bg-slate-300"></div>
                 <span className="flex items-center gap-0.5"><Calendar size={9} className="text-slate-400"/> {currentProject.start_date} 至 {currentProject.end_date}</span>
                 <div className="w-px h-2 bg-slate-300"></div>
                 <span>需：<span className="font-bold text-slate-800">{currentProject.req_count}</span></span>
                 <span>任：<span className="font-bold text-slate-800">{currentProject.task_count}</span></span>
                 <div className="w-px h-2 bg-slate-300"></div>
                 <span className="flex items-center gap-1">
                   进度:
                   <div className="w-8 h-1 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{width: `${currentProject.progress}%`}}></div>
                   </div>
                   <span className="font-bold text-slate-800">{currentProject.progress}%</span>
                 </span>
              </div>
              )}
            </div>
          </div>
          <button onClick={() => setShowCreateReqModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 font-medium shadow-sm shrink-0 transition-colors">
            <Plus size={12} /> 新增需求大纲
          </button>
        </div>

        <div className="flex-1 p-2 lg:p-3 overflow-auto custom-scrollbar bg-transparent">
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-white/60 rounded-xl shadow-sm p-1 flex flex-col h-full">

            {/* 表头布局 */}
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
              {loading ? (
                <div className="flex items-center justify-center py-8 text-slate-400">
                  <RefreshCw size={20} className="animate-spin inline mr-2"/> 加载需求树...
                </div>
              ) : treeData.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-slate-400">
                  暂无需求数据
                </div>
              ) : (
              treeData.map(module => (
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
                          <Paperclip size={12}/>{module.docs}
                        </span>
                      )}
                    </div>
                    <div className="w-16 text-center shrink-0"></div>
                    <div className="w-16 text-center shrink-0"></div>
                    <div className="w-[280px] flex justify-center items-center border-l border-transparent shrink-0"></div>
                    <div className="w-[160px] flex justify-end items-center gap-2 shrink-0 pr-4" onClick={(e) => e.stopPropagation()}>
                       <button onClick={(e) => handleAddFeature(module, e)} className="px-2 py-1 bg-blue-50 text-blue-600 hover:border-blue-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors mr-1"><Plus size={12}/> 子功能</button>
                       <button onClick={(e) => handleEditModule(module, e)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="编辑"><Edit size={14}/></button>
                       <button onClick={(e) => handleDeleteModule(module, e)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors" title="删除"><Trash2 size={14}/></button>
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
                         <button onClick={() => handleFeatureCollaborate(feature)} className="px-2 py-1 bg-indigo-50 text-indigo-600 hover:border-indigo-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"><Users size={12}/> 协同</button>
                         <button onClick={() => handleFeatureCancel(feature)} className="px-2 py-1 bg-rose-50 text-rose-600 hover:border-rose-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"><Ban size={12}/> 取消</button>
                         <button onClick={() => handleFeaturePause(feature)} className="px-2 py-1 bg-amber-50 text-amber-600 hover:border-amber-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"><PauseCircle size={12}/> 叫停</button>
                         <button onClick={() => handleFeatureAdvance(feature)} className="px-2 py-1 bg-blue-50 text-blue-600 hover:border-blue-200 border border-transparent rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors"><SkipForward size={12}/> 推进</button>
                      </div>
                      <div className="w-[160px] flex justify-end items-center gap-2 z-10 shrink-0 border-l border-transparent pr-4" onClick={(e) => e.stopPropagation()}>
                         <button onClick={(e) => handleEditFeature(feature, module, e)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="编辑"><Edit size={14}/></button>
                         <button onClick={(e) => handleDeleteFeature(feature, e)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors" title="删除"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>

      {activeFeature && <FeatureFlowModal feature={activeFeature} onClose={() => setActiveFeature(null)} tasks={[]} projectId={currentProject?.id} />}
      {activeAttachment && <AttachmentModal item={activeAttachment} onClose={() => setActiveAttachment(null)} />}
      {showCreateReqModal && <CreateRequirementModal onClose={() => setShowCreateReqModal(false)} agents={agents} />}
      {showModuleModal && (
        <ModuleModal
          module={editingModule}
          onClose={() => {
            setShowModuleModal(false);
            setEditingModule(null);
          }}
          onSave={handleSaveModule}
          projectId={currentProject?.id}
        />
      )}
      {showFeatureModal && (
        <FeatureModal
          feature={editingFeature}
          module={currentModule}
          onClose={() => {
            setShowFeatureModal(false);
            setEditingFeature(null);
            setCurrentModule(null);
          }}
          onSave={handleSaveFeature}
          projectId={currentProject?.id}
        />
      )}
      {showConfirm && (
        <ConfirmModal
          type={confirmConfig.type}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          onConfirm={confirmConfig.onConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default RequirementTree;
