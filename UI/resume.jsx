import React, { useState, useEffect } from 'react';
import {
  Github, ExternalLink, ChevronLeft, ChevronRight, Terminal,
  Code2, Layers, Mail, Phone, GraduationCap, Briefcase, MapPin,
  Settings, Save, Plus, Trash2, ArrowLeft
} from 'lucide-react';

// --- 初始默认数据 ---
const INITIAL_DATA = {
  basic: {
    name: '王磊',
    title: 'AI & 大模型应用专家',
    intro: '7年研发与交付经验，曾任阿里云资深交付工程师。专注大模型（LLM）应用落地、RAG 架构设计与 AI Agent 开发。擅长将前沿 AI 技术与复杂业务场景深度结合，打造高效、稳定的智能化解决方案。',
    id: 'AI-ENG-7301'
  },
  contact: {
    phone: '+86 199-8208-5627',
    email: '489312578@qq.com',
    edu: '北京航空航天大学 - 硕士',
    exp: '7年经验 - 前阿里云 资深交付工程师',
    location: '中国 · 北京'
  },
  projects: [
    {
      id: 1,
      title: '企业级智能知识库 (RAG)',
      description: '基于大语言模型与向量数据库构建的企业级文档问答系统。实现多模态文档解析、切片、检索，并提供高准确率的智能问答与溯源功能。',
      techStack: 'Python, LangChain, Milvus, React, OpenAI API', // 改为逗号分隔的字符串，方便前端编辑
      githubUrl: 'https://github.com',
      previewUrl: 'https://example.com',
      images: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450, https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=450'
    },
    {
      id: 2,
      title: '云端自动化运维 Agent',
      description: '结合大模型与自动化脚本，构建可自主诊断云服务器异常、分析日志并生成修复建议的智能 Agent，大幅提升交付与运维效率。',
      techStack: 'LLM, Agentic Workflow, Python, 阿里云 API, Docker',
      githubUrl: 'https://github.com',
      previewUrl: 'https://example.com',
      images: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=450, https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450'
    },
    {
      id: 3,
      title: '智能数据洞察大屏',
      description: '接入自然语言查询 (NL2SQL) 的业务大盘。用户通过自然语言即可生成复杂的数据报表与可视化图表，极大降低了数据分析的门槛。',
      techStack: 'NL2SQL, Vue 3, ECharts, FastAPI',
      githubUrl: 'https://github.com',
      previewUrl: 'https://example.com',
      images: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=450, https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=450'
    }
  ]
};

// --- 通用组件 ---

// 图片滑动框组件 (Image Carousel)
const ProjectSlider = ({ imagesString }) => {
  const images = imagesString.split(',').map(s => s.trim()).filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return <div className="w-full h-56 bg-slate-200 flex items-center justify-center text-slate-400">暂无预览图</div>;
  }

  const nextSlide = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-56 group overflow-hidden bg-slate-100 rounded-t-xl">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover flex-shrink-0" />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={prevSlide} className="p-1 rounded-full bg-white/70 hover:bg-white text-blue-600 shadow-sm backdrop-blur-sm transition-all hover:scale-110">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="p-1 rounded-full bg-white/70 hover:bg-white text-blue-600 shadow-sm backdrop-blur-sm transition-all hover:scale-110">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- 页面视图 1: 简历展示页 ---
const ResumeView = ({ data }) => {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-24 space-y-32">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-8">
        {/* Left: Intro */}
        <div className="flex-1 space-y-6 w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            {data.basic.name} <br />
            <span className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mt-2 block">
              {data.basic.title}
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl whitespace-pre-wrap">
            {data.basic.intro}
          </p>
        </div>

        {/* Right: Info Card */}
        <div className="flex-1 w-full lg:max-w-md">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-300 to-blue-400 rounded-2xl transform rotate-2 group-hover:rotate-3 group-hover:scale-105 transition-all duration-500 opacity-60 blur-lg shadow-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-500">
                  <Terminal size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">个人档案</h3>
                  <p className="text-sm text-cyan-600 font-mono">ID: {data.basic.id}</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-500 shadow-sm"><Phone size={18} /></div>
                  <span className="font-medium">{data.contact.phone}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-500 shadow-sm"><Mail size={18} /></div>
                  <span className="font-medium">{data.contact.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-cyan-50 border border-cyan-100 rounded-lg text-cyan-600 shadow-sm"><GraduationCap size={18} /></div>
                  <span className="font-medium">{data.contact.edu}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-cyan-50 border border-cyan-100 rounded-lg text-cyan-600 shadow-sm"><Briefcase size={18} /></div>
                  <span className="font-medium">{data.contact.exp}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shadow-sm"><MapPin size={18} /></div>
                  <span className="font-medium">{data.contact.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="space-y-10">
        <div className="flex items-center gap-3 mb-8">
          <Layers className="text-blue-500" size={28} />
          <h2 className="text-3xl font-bold">项目档案库</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent ml-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project) => (
            <div key={project.id} className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
              <ProjectSlider imagesString={project.images} />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.split(',').map(s => s.trim()).filter(Boolean).map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium text-sm">
                      <Github size={16} /> 源码库
                    </a>
                  )}
                  {project.previewUrl && (
                    <a href={project.previewUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-medium text-sm">
                      <ExternalLink size={16} /> 在线预览
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 mt-20 pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {data.basic.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
             <Code2 size={20} className="hover:text-cyan-500 transition-colors" />
             <Github size={20} className="hover:text-slate-800 transition-colors" />
             <Mail size={20} className="hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

// 修复 Bug：将子组件提取到外部，防止每次状态更新时被重新挂载导致失去焦点和滚动跳变
const InputSection = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">{title}</h3>
    <div className="grid gap-4">{children}</div>
  </div>
);

// --- 页面视图 2: 管理后台 ---
const AdminView = ({ data, setData, goBack }) => {
  const handleBasicChange = (field, value) => {
    setData(prev => ({ ...prev, basic: { ...prev.basic, [field]: value } }));
  };

  const handleContactChange = (field, value) => {
    setData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const handleProjectChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: '新项目标题',
      description: '项目描述...',
      techStack: 'React, Node.js',
      githubUrl: '',
      previewUrl: '',
      images: ''
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const removeProject = (id) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  return (
    <div className="relative z-20 min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-30">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">控制台 / 内容配置</h2>
              <p className="text-xs text-slate-500">修改后的内容将实时保存在前端状态中</p>
            </div>
          </div>
          <button onClick={goBack} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-md shadow-blue-500/20">
            <Save size={16} /> 保存并预览
          </button>
        </div>

        {/* Basic Info */}
        <InputSection title="🧑‍💻 基础信息">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">姓名</label>
              <input type="text" value={data.basic.name} onChange={(e) => handleBasicChange('name', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">职位头衔</label>
              <input type="text" value={data.basic.title} onChange={(e) => handleBasicChange('title', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">档案ID编号</label>
              <input type="text" value={data.basic.id} onChange={(e) => handleBasicChange('id', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">个人简介</label>
            <textarea value={data.basic.intro} onChange={(e) => handleBasicChange('intro', e.target.value)} rows="3" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
        </InputSection>

        {/* Contact Info */}
        <InputSection title="📞 联系与背景">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">电话号码</label>
              <input type="text" value={data.contact.phone} onChange={(e) => handleContactChange('phone', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">电子邮箱</label>
              <input type="text" value={data.contact.email} onChange={(e) => handleContactChange('email', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">学历信息</label>
              <input type="text" value={data.contact.edu} onChange={(e) => handleContactChange('edu', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">简要工作经验</label>
              <input type="text" value={data.contact.exp} onChange={(e) => handleContactChange('exp', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">所在坐标</label>
              <input type="text" value={data.contact.location} onChange={(e) => handleContactChange('location', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
        </InputSection>

        {/* Projects Info */}
        <InputSection title="🚀 项目管理">
          <div className="space-y-6">
            {data.projects.map((project, index) => (
              <div key={project.id} className="relative p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <div className="absolute top-4 right-4">
                  <button onClick={() => removeProject(project.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>

                <h4 className="font-bold text-slate-700">项目 #{index + 1}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">项目名称</label>
                    <input type="text" value={project.title} onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">技术栈 (英文逗号分隔)</label>
                    <input type="text" value={project.techStack} onChange={(e) => handleProjectChange(project.id, 'techStack', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">项目简介</label>
                  <textarea value={project.description} onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} rows="2" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">轮播图片地址 (英文逗号分隔，可留空)</label>
                  <textarea value={project.images} onChange={(e) => handleProjectChange(project.id, 'images', e.target.value)} rows="2" placeholder="https://..., https://..." className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-xs" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">源码仓库地址 (可留空)</label>
                    <input type="text" value={project.githubUrl} onChange={(e) => handleProjectChange(project.id, 'githubUrl', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">在线预览地址 (可留空)</label>
                    <input type="text" value={project.previewUrl} onChange={(e) => handleProjectChange(project.id, 'previewUrl', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addProject} className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-blue-400 hover:text-blue-500 transition-colors font-medium">
              <Plus size={18} /> 新增项目
            </button>
          </div>
        </InputSection>
      </div>
    </div>
  );
};

// --- 主应用组件 ---
export default function App() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('resume'); // 'resume' 或 'admin'
  const [resumeData, setResumeData] = useState(INITIAL_DATA);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-200 selection:text-cyan-900 relative">

      {/* 仅在简历页展示科技背景 */}
      {view === 'resume' && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.85]">
          <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="stream-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="stream-cyan" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="50%" stopColor="#0891b2" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
              </linearGradient>
            </defs>
            <pattern id="dot-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#cbd5e1" opacity="0.4"/>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-grid)" />
            <path d="M-200,200 C300,100 600,700 1600,500" fill="none" stroke="url(#stream-blue)" strokeWidth="1.5" />
            <path d="M-200,220 C280,120 580,720 1600,520" fill="none" stroke="url(#stream-blue)" strokeWidth="0.5" opacity="0.6" />
            <path d="M-100,800 C400,900 800,200 1500,300" fill="none" stroke="url(#stream-cyan)" strokeWidth="2" strokeDasharray="4 8" />
            <path d="M-150,780 C380,880 780,180 1500,280" fill="none" stroke="url(#stream-cyan)" strokeWidth="1" />
            <path d="M-50,450 C450,500 900,400 1550,600" fill="none" stroke="url(#stream-blue)" strokeWidth="1" strokeDasharray="2 4" opacity="0.7"/>
            <circle cx="350" cy="285" r="2.5" fill="#38bdf8" opacity="0.8">
               <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="850" cy="425" r="3" fill="#22d3ee" opacity="0.9">
               <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="680" cy="625" r="2" fill="#0284c7" opacity="0.6">
               <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="1150" cy="335" r="3.5" fill="#38bdf8" opacity="0.7">
               <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      )}

      {view === 'resume' && (
        <>
          <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-300/20 blur-[100px] z-0 pointer-events-none" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/10 blur-[120px] z-0 pointer-events-none" />
        </>
      )}

      {/* --- 路由渲染 --- */}
      {view === 'resume' ? (
        <ResumeView data={resumeData} />
      ) : (
        <AdminView data={resumeData} setData={setResumeData} goBack={() => setView('resume')} />
      )}

      {/* --- 全局悬浮按钮: 切换管理面板 --- */}
      {view === 'resume' && (
        <button
          onClick={() => setView('admin')}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 hover:scale-105 transition-all group border border-slate-700"
          title="打开配置面板"
        >
          <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-medium text-sm pr-1">管理面板</span>
        </button>
      )}
    </div>
  );
}