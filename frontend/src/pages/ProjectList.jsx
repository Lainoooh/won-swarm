import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, MoreVertical, Calendar, Clock, Cpu, Edit, Trash2, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../components/utils/Tags';
import { ProjectModal, ConfirmModal } from '../components/utils/Modal';
import { getProjects, createProject, updateProject, deleteProject, getAgents } from '../api';

const ProjectList = () => {
  const navigate = useNavigate();

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProjects({ page: 1, page_size: 100 });
      setProjects(res.items || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAgents = useCallback(async () => {
    try {
      const res = await getAgents({ page: 1, page_size: 100 });
      setAgents(res.items || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  }, []);

  useEffect(() => {
    loadProjects();
    loadAgents();
  }, []);

  const handleProjectClick = (proj) => {
    navigate(`/projects/${proj.id}`);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (proj, e) => {
    e.stopPropagation();
    setEditingProject(proj);
    setShowProjectModal(true);
    setOpenActionMenu(null);
  };

  const handleDeleteClick = (proj, e) => {
    e.stopPropagation();
    setDeletingProject(proj);
    setShowDeleteConfirm(true);
    setOpenActionMenu(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(deletingProject.id);
      loadProjects();
    } catch (error) {
      alert('删除失败：' + error.message);
    } finally {
      setShowDeleteConfirm(false);
      setDeletingProject(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeletingProject(null);
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await createProject(projectData);
      }
      loadProjects();
      setShowProjectModal(false);
      setEditingProject(null);
    } catch (error) {
      alert('保存失败：' + error.message);
    }
  };

  const toggleActionMenu = (projId, e) => {
    e.stopPropagation();
    setOpenActionMenu(openActionMenu === projId ? null : projId);
  };

  const statusOrder = { planning: 0, in_progress: 1, completed: 2 };

  return (
  <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm" onClick={() => setOpenActionMenu(null)}>
    <div className="p-3 border-b border-slate-200/60 bg-white/40 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="搜索项目..." className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg pl-8 pr-3 py-2 w-56 shadow-sm focus:outline-none focus:border-blue-400 transition-colors" onClick={(e) => e.stopPropagation()} />
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-colors" onClick={(e) => e.stopPropagation()}>
          <Filter size={14}/> 筛选
        </button>
      </div>
      <button onClick={handleNewProject} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
        <Plus size={14} strokeWidth={2.5} /> 新建项目
      </button>
    </div>

    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-50/30 flex flex-col">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/50 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-4 py-2.5 text-xs font-bold text-slate-500 border-b border-slate-200/60">项目名称</th>
            <th className="px-4 py-2.5 text-xs font-bold text-slate-500 border-b border-slate-200/60">负责人</th>
            <th className="px-4 py-2.5 text-xs font-bold text-slate-500 border-b border-slate-200/60">周期</th>
            <th className="px-4 py-2.5 text-xs font-bold text-slate-500 border-b border-slate-200/60">数据统计</th>
            <th className="px-4 py-2.5 text-xs font-bold text-slate-500 border-b border-slate-200/60 w-32">进度</th>
            <th className="px-4 py-2.5 text-xs font-bold text-slate-500 border-b border-slate-200/60 text-right">
              <button onClick={loadProjects} className="p-2 hover:bg-white rounded-lg transition-colors" title="刷新">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8 text-slate-400 font-bold text-sm"><RefreshCw size={32} className="animate-spin inline"/> 加载中...</td></tr>
          ) : projects.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8 text-slate-400 font-bold text-sm">暂无项目数据</td></tr>
          ) : (
            [...projects].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]).map((proj) => (
              <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span onClick={() => handleProjectClick(proj)} className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer w-fit">{proj.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{proj.id}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-xs font-medium text-slate-700 flex items-center gap-1.5 mt-1">
                  <Cpu size={14} className="text-blue-500"/>{proj.manager_name}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400"/>
                      <span className="font-mono">{proj.start_date}</span>
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400"/>
                      <span className="font-mono">{proj.end_date}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100">需：{proj.req_count}</span>
                    <span className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">任：{proj.task_count}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500" style={{width: `${proj.progress}%`}}></div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 w-10 text-right">{proj.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right relative">
                  <div className="flex items-center justify-end gap-1">
                    <StatusBadge status={proj.status} type="project" />
                    <button onClick={(e) => toggleActionMenu(proj.id, e)} className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-700">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  {openActionMenu === proj.id && (
                    <div className="absolute right-4 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 min-w-[100px]">
                      <button onClick={(e) => handleEditProject(proj, e)} className="w-full px-3 py-1.5 text-xs text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700">
                        <Edit size={12} /> 编辑
                      </button>
                      <button onClick={(e) => handleDeleteClick(proj, e)} className="w-full px-3 py-1.5 text-xs text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600">
                        <Trash2 size={12} /> 删除
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {showProjectModal && (
      <ProjectModal
        project={editingProject}
        agents={agents}
        onClose={() => { setShowProjectModal(false); setEditingProject(null); }}
        onSave={handleSaveProject}
      />
    )}

    {showDeleteConfirm && (
      <ConfirmModal
        type="danger"
        title="删除项目确认"
        message={`确定要删除项目"${deletingProject?.name}"吗？删除后将无法恢复，请谨慎操作。`}
        confirmText="确认删除"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    )}
  </div>
  );
};

export default ProjectList;
