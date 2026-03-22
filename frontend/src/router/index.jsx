import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import AgentList from '../pages/AgentList';
import ProjectList from '../pages/ProjectList';
import RequirementTree from '../pages/RequirementTree';
import TaskKanban from '../pages/TaskKanban';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'agents',
        element: <AgentList />
      },
      {
        path: 'projects',
        element: <ProjectList />
      },
      {
        path: 'projects/:projectId',
        element: <RequirementTree />
      },
      {
        path: 'tasks',
        element: <TaskKanban />
      },
      {
        path: 'settings',
        element: <div className="flex items-center justify-center h-full text-slate-500 text-sm">系统设置页面（待开发）</div>
      }
    ]
  }
]);
