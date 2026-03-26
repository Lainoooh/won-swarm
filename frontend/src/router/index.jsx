import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import AgentList from '../pages/AgentList';
import ProjectList from '../pages/ProjectList';
import RequirementTree from '../pages/RequirementTree';
import TaskKanban from '../pages/TaskKanban';
import Settings from '../pages/Settings';

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
        element: <Settings />
      }
    ]
  }
]);
