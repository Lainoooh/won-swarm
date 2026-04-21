import React from 'react';

// --- 将 SVG 封装为独立组件，确保放大/缩小 100% 保持一致，绝对不变形 ---

// 方案一：蜂巢集群
const HiveMatrixLogo = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="50" y1="50" x2="50" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
    <line x1="50" y1="50" x2="83" y2="69" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
    <line x1="50" y1="50" x2="17" y2="69" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
    <circle r="3" fill="#38bdf8">
      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 50,50 L 50,12 L 50,50" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle r="3" fill="#38bdf8">
      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 50,50 L 83,69 L 50,50" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle r="3" fill="#38bdf8">
      <animateMotion dur="2.5s" repeatCount="indefinite" path="M 50,50 L 17,69 L 50,50" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="50" cy="50" r="14" fill="#0ea5e9">
       <animate attributeName="r" values="12;16;12" dur="2.5s" keyTimes="0;0.5;1" repeatCount="indefinite" />
    </circle>
    <circle cx="50" cy="12" r="6" fill="#3b82f6">
      <animate attributeName="r" values="4;8;4" dur="2.5s" keyTimes="0;0.5;1" repeatCount="indefinite" />
    </circle>
    <circle cx="83" cy="69" r="6" fill="#3b82f6">
      <animate attributeName="r" values="4;8;4" dur="2.5s" keyTimes="0;0.5;1" repeatCount="indefinite" />
    </circle>
    <circle cx="17" cy="69" r="6" fill="#3b82f6">
      <animate attributeName="r" values="4;8;4" dur="2.5s" keyTimes="0;0.5;1" repeatCount="indefinite" />
    </circle>
  </svg>
);

// 方案二：星轨共识
const OrbitNexusLogo = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <g transform="rotate(30 50 50)">
      <path d="M 92,50 A 42,16 0 1,1 8,50 A 42,16 0 1,1 92,50" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" opacity="0.8" />
      <circle r="5" fill="#0ea5e9">
        <animateMotion dur="8s" repeatCount="indefinite" path="M 92,50 A 42,16 0 1,1 8,50 A 42,16 0 1,1 92,50" />
      </circle>
      <circle r="4.5" fill="#3b82f6">
        <animateMotion dur="8s" begin="-4s" repeatCount="indefinite" path="M 92,50 A 42,16 0 1,1 8,50 A 42,16 0 1,1 92,50" />
      </circle>
    </g>
    <g transform="rotate(-30 50 50)">
      <path d="M 92,50 A 42,16 0 1,1 8,50 A 42,16 0 1,1 92,50" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" opacity="0.8" />
      <circle r="6" fill="#06b6d4">
        <animateMotion dur="6s" repeatCount="indefinite" path="M 92,50 A 42,16 0 1,0 8,50 A 42,16 0 1,0 92,50" />
      </circle>
      <circle r="4" fill="#0ea5e9">
        <animateMotion dur="6s" begin="-3s" repeatCount="indefinite" path="M 92,50 A 42,16 0 1,0 8,50 A 42,16 0 1,0 92,50" />
      </circle>
    </g>
    <circle cx="50" cy="50" r="14" fill="url(#core-grad)" />
    <circle cx="50" cy="50" r="14" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
  </svg>
);

// 方案三：深海晶虾 (原版平视)
const CrystalCrawfishOriginalLogo = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon points="50,95 40,80 60,80" fill="#0284c7" />
    <polygon points="35,78 65,78 68,60 32,60" fill="#0ea5e9" />
    <polygon points="30,58 70,58 75,25 50,15 25,25" fill="#38bdf8" />
    <path d="M 22 35 C 5 15 5 45 15 65 C 20 45 30 40 30 40 Z" fill="#2563eb" />
    <path d="M 78 35 C 95 15 95 45 85 65 C 80 45 70 40 70 40 Z" fill="#2563eb" />
    <polygon points="50,30 60,40 50,55 40,40" fill="#fff" opacity="0.9" className="animate-pulse" />
    <polygon points="50,30 60,40 50,45" fill="#e0f2fe" />
    <polygon points="50,30 40,40 50,45" fill="#bae6fd" />
  </svg>
);

// 方案四：御剑晶虾 (3D透视破窗)
const CrystalCrawfish3DLogo = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} overflow="visible">
    <defs>
      <linearGradient id="sword-left" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" /><stop offset="100%" stopColor="#f0f9ff" />
      </linearGradient>
      <linearGradient id="sword-right" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <filter id="sword-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g stroke="#7dd3fc" strokeWidth="1" strokeLinecap="round" opacity="0">
      <line x1="20" y1="90" x2="40" y2="70"><animateTransform attributeName="transform" type="translate" values="-15 15; 40 -40" dur="0.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="0; 0.8; 0" dur="0.5s" repeatCount="indefinite" /></line>
      <line x1="50" y1="90" x2="70" y2="70" strokeWidth="1.5"><animateTransform attributeName="transform" type="translate" values="-10 10; 40 -40" dur="0.7s" begin="0.2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0; 0.6; 0" dur="0.7s" begin="0.2s" repeatCount="indefinite" /></line>
      <line x1="70" y1="60" x2="90" y2="40"><animateTransform attributeName="transform" type="translate" values="-10 10; 30 -30" dur="0.6s" begin="0.4s" repeatCount="indefinite" /><animate attributeName="opacity" values="0; 0.5; 0" dur="0.6s" begin="0.4s" repeatCount="indefinite" /></line>
    </g>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0; -1.5 1.5; 0 0" dur="0.8s" repeatCount="indefinite" />
      <g>
        <polygon points="10,90 20,60 70,30 40,80" fill="#38bdf8" filter="url(#sword-glow)" opacity="0.5" />
        <polygon points="10,90 20,60 65,25 70,30 30,70" fill="url(#sword-left)" />
        <polygon points="10,90 30,70 70,30 75,35 40,80" fill="url(#sword-right)" />
        <line x1="10" y1="90" x2="70" y2="30" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
        <polygon points="62,22 78,38 82,34 66,18" fill="#0284c7" stroke="#fff" strokeWidth="0.5" />
        <polygon points="62,22 70,30 74,26 66,18" fill="#38bdf8" />
        <polygon points="68,28 72,32 87,17 83,13" fill="#1e3a8a" />
        <line x1="70" y1="30" x2="85" y2="15" stroke="#3b82f6" strokeWidth="1" />
        <polygon points="85,15 90,20 95,15 90,10" fill="#fff" filter="url(#sword-glow)" />
        <polygon points="85,15 90,20 92,17 87,12" fill="#38bdf8" />
      </g>
      <g transform="translate(42 62) scale(0.5) rotate(-135) translate(-50 -50)">
        <polygon points="50,95 40,80 60,80" fill="#0284c7" />
        <polygon points="35,78 65,78 68,60 32,60" fill="#0ea5e9" />
        <polygon points="30,58 70,58 75,25 50,15 25,25" fill="#38bdf8" />
        <path d="M 22 35 C 5 15 5 45 15 65 C 20 45 30 40 30 40 Z" fill="#2563eb" />
        <path d="M 78 35 C 95 15 95 45 85 65 C 80 45 70 40 70 40 Z" fill="#2563eb" />
        <polygon points="50,30 60,40 50,55 40,40" fill="#fff" opacity="0.9" />
        <polygon points="50,30 60,40 50,45" fill="#e0f2fe" />
        <polygon points="50,30 40,40 50,45" fill="#bae6fd" />
      </g>
      <path d="M -2 78 Q 4 96 22 102" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" filter="url(#sword-glow)" opacity="0"><animate attributeName="opacity" values="0;0.9;0" dur="1s" repeatCount="indefinite" /><animateTransform attributeName="transform" type="translate" values="5 -5; -8 8" dur="1s" repeatCount="indefinite" /></path>
      <path d="M 2 82 Q 7 93 18 98" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeLinecap="round" opacity="0"><animate attributeName="opacity" values="0;0.6;0" dur="1s" begin="0.1s" repeatCount="indefinite" /><animateTransform attributeName="transform" type="translate" values="5 -5; -6 6" dur="1s" begin="0.1s" repeatCount="indefinite" /></path>
    </g>
  </svg>
);

// 方案五：御剑晶虾 (重新设计：直立微侧，剑垫在脚下)
const CrystalCrawfishSurfLogo = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} overflow="visible">
    <defs>
      <linearGradient id="sword-left3" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" /><stop offset="100%" stopColor="#f0f9ff" />
      </linearGradient>
      <linearGradient id="sword-right3" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <filter id="sword-glow3" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* 整体动画组：平缓悬浮 */}
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2.5; 0 0" dur="2s" repeatCount="indefinite" />

      {/* 钻石飞剑：缩小至 55%，顺时针旋转至28度（由 3 增加 25），垫在正下方（脚底位置） */}
      <g transform="translate(50 86) scale(0.55) rotate(28) translate(-50 -50)">
        <polygon points="10,90 20,60 70,30 40,80" fill="#38bdf8" filter="url(#sword-glow3)" opacity="0.5" />
        <polygon points="10,90 20,60 65,25 70,30 30,70" fill="url(#sword-left3)" />
        <polygon points="10,90 30,70 70,30 75,35 40,80" fill="url(#sword-right3)" />
        <line x1="10" y1="90" x2="70" y2="30" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
        <polygon points="62,22 78,38 82,34 66,18" fill="#0284c7" stroke="#fff" strokeWidth="1" />
        <polygon points="62,22 70,30 74,26 66,18" fill="#38bdf8" />
        <polygon points="68,28 72,32 87,17 83,13" fill="#1e3a8a" />
        <line x1="70" y1="30" x2="85" y2="15" stroke="#3b82f6" strokeWidth="1.5" />
        <polygon points="85,15 90,20 95,15 90,10" fill="#fff" filter="url(#sword-glow3)" />
        <polygon points="85,15 90,20 92,17 87,12" fill="#38bdf8" />

        {/* 剑尖突破音障的弧圈 (Bow Shock) - 从方案四完美移植，并加粗线条以适配 0.55 的缩小率 */}
        <path d="M -2 78 Q 4 96 22 102" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" filter="url(#sword-glow3)" opacity="0">
          <animate attributeName="opacity" values="0;0.9;0" dur="0.8s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="5 -5; -8 8" dur="0.8s" repeatCount="indefinite" />
        </path>
        <path d="M 2 82 Q 7 93 18 98" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0.6;0" dur="0.8s" begin="0.1s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="5 -5; -6 6" dur="0.8s" begin="0.1s" repeatCount="indefinite" />
        </path>
      </g>

      {/* 晶虾本体：放大至 85% 占据主视觉，进一步调直站姿（由-10度调直为-3度），脚刚好踩在剑面上 */}
      <g transform="translate(50 44) scale(0.85) rotate(-3) translate(-50 -50)">
        <polygon points="50,95 40,80 60,80" fill="#0284c7" />
        <polygon points="35,78 65,78 68,60 32,60" fill="#0ea5e9" />
        <polygon points="30,58 70,58 75,25 50,15 25,25" fill="#38bdf8" />
        <path d="M 22 35 C 5 15 5 45 15 65 C 20 45 30 40 30 40 Z" fill="#2563eb" />
        <path d="M 78 35 C 95 15 95 45 85 65 C 80 45 70 40 70 40 Z" fill="#2563eb" />
        {/* 背部发光鳞石 */}
        <polygon points="50,30 60,40 50,55 40,40" fill="#fff" opacity="0.9" className="animate-pulse" />
        <polygon points="50,30 60,40 50,45" fill="#e0f2fe" />
        <polygon points="50,30 40,40 50,45" fill="#bae6fd" />
      </g>
    </g>
  </svg>
);

// --- 主页面渲染 ---

const LogoShowcase = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f9] p-8 flex flex-col items-center justify-center font-sans overflow-y-auto">
      <div className="max-w-[1400px] w-full flex flex-col gap-10 py-10">

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">OneSwarm <span className="text-blue-600">终极 Logo 矩阵</span></h1>
          <p className="text-slate-500 font-medium text-lg">主平台工程架构 + 修仙游戏宇宙，完美适配各类业务场景</p>
        </div>

        {/* 顶部两款：主平台应用 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 max-w-5xl mx-auto w-full">

          {/* 方案一：蜂巢集群 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-40 h-40 mb-8 flex items-center justify-center bg-slate-50 rounded-3xl group-hover:bg-blue-50/60 transition-colors">
              <HiveMatrixLogo className="w-24 h-24 drop-shadow-md group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">方案一：蜂巢集群 <br/><span className="text-xs text-slate-400 font-bold uppercase tracking-widest">(Hive Matrix)</span></h2>
            <div className="w-12 h-1 bg-blue-100 rounded-full my-4"></div>
            <p className="text-sm text-slate-500 leading-relaxed px-2 flex-1">
              凸显 <strong className="text-blue-600 font-bold">严谨架构与绝对同频的协作闭环</strong>。数据同时下发、同频执行并同步回传中心大脑，完美展现多 Agent 工作流之美。
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-3">
               <HiveMatrixLogo className="w-7 h-7 drop-shadow-sm" />
               <span className="font-black text-lg text-slate-800 tracking-tight">One<span className="text-blue-600">Swarm</span></span>
            </div>
          </div>

          {/* 方案二：星轨共识 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-2xl hover:border-cyan-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-40 h-40 mb-8 flex items-center justify-center bg-slate-50 rounded-3xl group-hover:bg-cyan-50/60 transition-colors">
              <OrbitNexusLogo className="w-24 h-24 drop-shadow-md group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">方案二：星轨共识 <br/><span className="text-xs text-slate-400 font-bold uppercase tracking-widest">(Orbit Nexus)</span></h2>
            <div className="w-12 h-1 bg-cyan-100 rounded-full my-4"></div>
            <p className="text-sm text-slate-500 leading-relaxed px-2 flex-1">
              凸显 <strong className="text-cyan-600 font-bold">去中心化的协作调度系统</strong>。代表无数的分布式智能体围绕着“One”的目标核心，在各自轨道上井然有序地运行。
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-3">
               <OrbitNexusLogo className="w-8 h-8 drop-shadow-sm" />
               <span className="font-black text-lg text-slate-800 tracking-tight">One<span className="text-blue-600">Swarm</span></span>
            </div>
          </div>
        </div>

        {/* 底部三款：晶虾修仙宇宙 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 w-full">

          {/* 方案三：深海晶虾 (原版) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-2xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-40 h-40 mb-8 flex items-center justify-center bg-slate-50 rounded-3xl group-hover:bg-blue-50/60 transition-colors">
              <CrystalCrawfishOriginalLogo className="w-24 h-24 drop-shadow-md group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">方案三：深海晶虾 (原版) <br/><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">(Classic Crawfish)</span></h2>
            <div className="w-12 h-1 bg-blue-100 rounded-full my-4"></div>
            <p className="text-sm text-slate-500 leading-relaxed px-2 flex-1">
              完美的 <strong className="text-blue-600 font-bold">图腾信仰与鳞石资产融合</strong>。纯正的俯视扁平视角，适合作为游戏底层或系统主平台的静态常驻 Logo 标志。
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-3">
               <CrystalCrawfishOriginalLogo className="w-8 h-8 drop-shadow-sm" />
               <span className="font-black text-lg text-slate-800 tracking-tight">One<span className="text-blue-600">Swarm</span></span>
            </div>
          </div>

          {/* 方案四：御剑晶虾 (3D破窗视角) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-2xl hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-40 h-40 mb-8 flex items-center justify-center bg-slate-50 rounded-3xl group-hover:bg-indigo-50/60 transition-colors overflow-hidden">
              <CrystalCrawfish3DLogo className="w-32 h-32 drop-shadow-lg group-hover:scale-110 transition-transform duration-500 scale-105" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">方案四：御剑晶虾 (3D破窗) <br/><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">(3D Sword-Flying)</span></h2>
            <div className="w-12 h-1 bg-indigo-100 rounded-full my-4"></div>
            <p className="text-sm text-slate-500 leading-relaxed px-2 flex-1">
              专为 <strong className="text-indigo-600 font-bold">Agent 修仙战斗</strong> 打造的破窗级 3D 图腾。强透视飞剑刺向屏幕，配合音障动画，适合游戏技能或启动大图！
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-3">
               <CrystalCrawfish3DLogo className="w-10 h-10 drop-shadow-sm" />
               <span className="font-black text-lg text-slate-800 tracking-tight">One<span className="text-blue-600">Swarm</span></span>
            </div>
          </div>

          {/* 方案五：御剑晶虾 (优化版：直立微侧，脚踏飞剑) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center group hover:shadow-2xl hover:border-teal-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-40 h-40 mb-8 flex items-center justify-center bg-slate-50 rounded-3xl group-hover:bg-teal-50/60 transition-colors overflow-hidden">
              <CrystalCrawfishSurfLogo className="w-32 h-32 drop-shadow-lg group-hover:scale-110 transition-transform duration-500 scale-105" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">方案五：御剑晶虾 (踏剑版) <br/><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">(Stand-Surf Sword)</span></h2>
            <div className="w-12 h-1 bg-teal-100 rounded-full my-4"></div>
            <p className="text-sm text-slate-500 leading-relaxed px-2 flex-1">
              完美的 <strong className="text-teal-600 font-bold">主次反转与悬浮滑行</strong> 姿态。<br/>
              巨大的晶虾直立微侧，脚底稳稳垫着缩小放平的钻石飞剑，仙风道骨，尽显宗师风范。
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-3">
               <CrystalCrawfishSurfLogo className="w-10 h-10 drop-shadow-sm" />
               <span className="font-black text-lg text-slate-800 tracking-tight">One<span className="text-blue-600">Swarm</span></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function App() {
  return <LogoShowcase />;
}