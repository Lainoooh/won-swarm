import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderOpen, KanbanSquare, Settings,
  Bell, ChevronRight, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { HiveMatrixLogo } from '../utils/Modal';
import '../../styles/cyberpunk-theme.css';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('azure');
  const location = useLocation();

  // 从 localStorage 加载主题偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'azure' || savedTheme === 'cyberpunk')) {
      setTheme(savedTheme);
    }
  }, []);

  // 保存主题偏好到 localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    updateFavicon(theme);
  }, [theme]);

  // 动态更新 Favicon
  const updateFavicon = (currentTheme) => {
    const strokeColor = currentTheme === 'cyberpunk' ? '#06b6d4' : '#3b82f6';
    const fillColor = currentTheme === 'cyberpunk' ? '#22d3ee' : '#0ea5e9';
    const staticSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,12 83,31 83,69 50,88 17,69 17,31" fill="none" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="50" r="14" fill="${fillColor}"/></svg>`;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,${encodeURIComponent(staticSvg)}`;
  };

  // 暴露主题设置函数给 Settings 页面
  useEffect(() => {
    window.setAppTheme = setTheme;
    return () => {
      delete window.setAppTheme;
    };
  }, []);

  const navItems = [
    { id: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: '/agents', label: 'Agent', icon: Users },
    { id: '/projects', label: '项目管理', icon: FolderOpen },
    { id: '/tasks', label: '任务看板', icon: KanbanSquare },
    { id: '/settings', label: '系统设置', icon: Settings },
  ];

  const getBreadcrumbs = () => {
    const currentItem = navItems.find(item => item.id === location.pathname);
    if (currentItem) return currentItem.label;
    return '未知页面';
  };

  return (
    <div className={`min-h-screen bg-[#e8eef3] text-slate-800 font-sans flex overflow-hidden selection:bg-cyan-200 selection:text-cyan-900 relative ${theme === 'cyberpunk' ? 'theme-cyberpunk' : ''}`}>
      {/* Background decorations */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {theme === 'azure' ? (
          <>
            {/* Azure theme - original network pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.3]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="network-pattern" x="0" y="0" width="800" height="800" patternUnits="userSpaceOnUse">
                  <g stroke="#94a3b8" strokeWidth="1" fill="none" className="opacity-50">
                    <path d="M 50 150 L 150 50 L 300 100 L 250 250 L 100 300 Z M 300 100 L 500 50 L 650 150 L 550 300 L 400 250 Z M 650 150 L 750 50 L 850 150 L 750 300 Z M 100 300 L 250 250 L 350 450 L 150 550 L 50 400 Z M 250 250 L 400 250 L 550 300 L 450 500 L 350 450 Z M 550 300 L 750 300 L 650 550 L 450 500 Z M 150 550 L 350 450 L 300 700 L 100 650 Z M 350 450 L 450 500 L 600 750 L 400 850 L 300 700 Z M 450 500 L 650 550 L 750 750 L 600 750 Z" />
                  </g>
                  <g fill="#0ea5e9" className="opacity-60">
                    <circle cx="50" cy="150" r="3" /><circle cx="150" cy="50" r="4" /><circle cx="300" cy="100" r="3" /><circle cx="250" cy="250" r="5" /><circle cx="100" cy="300" r="3" />
                    <circle cx="500" cy="50" r="4" /><circle cx="650" cy="150" r="3" /><circle cx="550" cy="300" r="5" /><circle cx="400" cy="250" r="3" /><circle cx="350" cy="450" r="5" />
                  </g>
                  <g fill="#38bdf8" className="animate-pulse">
                    <circle cx="250" cy="250" r="10" className="opacity-30" /><circle cx="550" cy="300" r="12" className="opacity-20" /><circle cx="350" cy="450" r="11" className="opacity-20" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#network-pattern)" />
            </svg>
            <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-cyan-400/20 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-500/15 rounded-full blur-[140px]"></div>
          </>
        ) : (
          <>
            {/* Cyberpunk theme - dark with neon grid */}
            <div className="absolute inset-0 bg-[#020617]">
              <svg className="absolute inset-0 w-full h-full opacity-[0.4]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="network-pattern-dark" x="0" y="0" width="800" height="800" patternUnits="userSpaceOnUse">
                    <g stroke="#06b6d4" strokeWidth="1.5" fill="none" className="opacity-60" style={{ filter: 'drop-shadow(0 0 2px rgba(6,182,212,0.8))' }}>
                      <path d="M 50 150 L 150 50 L 300 100 L 250 250 L 100 300 Z M 300 100 L 500 50 L 650 150 L 550 300 L 400 250 Z M 650 150 L 750 50 L 850 150 L 750 300 Z M 100 300 L 250 250 L 350 450 L 150 550 L 50 400 Z M 250 250 L 400 250 L 550 300 L 450 500 L 350 450 Z M 550 300 L 750 300 L 650 550 L 450 500 Z M 150 550 L 350 450 L 300 700 L 100 650 Z M 350 450 L 450 500 L 600 750 L 400 850 L 300 700 Z M 450 500 L 650 550 L 750 750 L 600 750 Z" />
                    </g>
                    <g fill="#22d3ee" className="opacity-80" style={{ filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.9))' }}>
                      <circle cx="50" cy="150" r="3" /><circle cx="150" cy="50" r="4" /><circle cx="300" cy="100" r="3" /><circle cx="250" cy="250" r="5" /><circle cx="100" cy="300" r="3" />
                      <circle cx="500" cy="50" r="4" /><circle cx="650" cy="150" r="3" /><circle cx="550" cy="300" r="5" /><circle cx="400" cy="250" r="3" /><circle cx="350" cy="450" r="5" />
                    </g>
                    <g fill="#67e8f9" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 6px rgba(103,232,249,0.8))' }}>
                      <circle cx="250" cy="250" r="10" className="opacity-40" /><circle cx="550" cy="300" r="12" className="opacity-30" /><circle cx="350" cy="450" r="11" className="opacity-30" />
                    </g>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#network-pattern-dark)" />
              </svg>
              <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-cyan-600/15 rounded-full blur-[140px]"></div>
              <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] bg-blue-600/15 rounded-full blur-[150px]"></div>
            </div>
          </>
        )}
      </div>

      {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-48'} border-r border-white/60 bg-white/40 backdrop-blur-2xl flex flex-col z-30 shadow-sm transition-all duration-300 relative shrink-0`}>
        <div className={`h-10 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-3'} border-b border-white/40 relative shrink-0`}>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <HiveMatrixLogo className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span className="font-black text-sm tracking-tight text-slate-800 whitespace-nowrap">One<span className="text-blue-600">Swarm</span></span>}
          </div>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`absolute ${isSidebarCollapsed ? '-right-2' : 'right-2'} top-1/2 -translate-y-1/2 bg-white/90 border border-white text-slate-400 hover:text-blue-600 rounded-full p-0.5 shadow-sm transition-all z-50`}>
            {isSidebarCollapsed ? <PanelLeftOpen size={10} /> : <PanelLeftClose size={10} />}
          </button>
        </div>

        <div className={`py-2 flex-1 ${isSidebarCollapsed ? 'px-1.5' : 'px-2'}`}>
          <nav className="space-y-0.5">
            {navItems.map(item => {
              const NavIcon = item.icon;
              const isActive = location.pathname === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.id}
                  title={isSidebarCollapsed ? item.label : ''}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-2'} py-1.5 rounded-md transition-all duration-200 text-xs font-bold ${isActive ? 'bg-white/80 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                >
                  <NavIcon size={14} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className={`p-2 border-t border-white/40 bg-white/30 m-1.5 rounded-md ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-[9px] font-black text-white shrink-0">AD</div>
            {!isSidebarCollapsed && (
              <div className="truncate leading-tight">
                <div className="text-[11px] font-bold text-slate-800 truncate">Admin</div>
                <div className="text-[8px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5"><span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> 平台管理员</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-10 border-b border-white/40 bg-white/40 backdrop-blur-2xl flex items-center justify-between px-3 z-20 shrink-0">
          <div className="flex items-center text-[11px] font-medium text-slate-500 bg-white/60 px-2 py-0.5 rounded border border-white shadow-sm">
            <span>OneSwarm</span><ChevronRight size={10} className="mx-1 text-slate-400" />
            <span className="text-blue-600 font-bold">{getBreadcrumbs()}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/60 border border-white px-2 py-0.5 rounded-full shadow-sm">
              <span className="relative flex h-1 w-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span></span>
              <span className="text-[9px] font-bold font-mono text-emerald-600">WS (30009)</span>
            </div>
            <button className="text-slate-400 hover:text-blue-500 relative transition-colors bg-white/60 p-1 rounded-full border border-white hover:bg-white shadow-sm">
              <Bell size={12} /><span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white shadow-[0_0_8px_#ef4444]"></span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-1.5 flex-1 overflow-hidden flex flex-col relative z-10">
          <Outlet context={{ theme, setTheme }} />
        </div>
      </main>

      {/* Global styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
        .scanner-animation { animation: scan 10s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.8); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.8); }
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default MainLayout;
