import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Zap, 
  Settings, 
  Dumbbell, 
  Briefcase, 
  Target, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string; 
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navItems: NavItem[] = [
    {
      icon: <Target size={22} />,
      label: 'CENTRO DE MANDO',
      href: '/dashboard',
      color: 'text-yellow-400',
    },
    {
      icon: <Users size={22} />,
      label: 'SOCIOS ELITE',
      href: '/miembros',
      color: 'text-purple-400',
    },
    {
      icon: <Briefcase size={22} />,
      label: 'TROPA STAFF',
      href: '/empleados',
      color: 'text-blue-400',
    },
    {
      icon: <Calendar size={22} />,
      label: 'RESERVAS',
      href: '/reservas',
      color: 'text-pink-400',
    },
    {
      icon: <MapPin size={22} />,
      label: 'SEDES CENTRAL',
      href: '/sedes',
      color: 'text-green-400',
    },
    {
      icon: <Zap size={22} />,
      label: 'MÁQUINAS',
      href: '/maquinas',
      color: 'text-orange-400',
    },
    {
      icon: <Settings size={22} />,
      label: 'SISTEMA',
      href: '/settings',
      color: 'text-gray-400',
    },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 lg:hidden z-30 backdrop-blur-xl animate-in fade-in duration-500"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar - Diseño Galáctico */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-80 bg-[#050505] text-white transform transition-all duration-500 ease-out z-40 border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 🔥 HEADER - URBAN GYM BRANDING (PROTEGIDO CONTRA TRADUCCIÓN) */}
        <div className="p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] transform group-hover:rotate-[360deg] transition-transform duration-700">
              <Dumbbell size={28} className="text-black" />
            </div>
            
            {/* Atributo translate="no" para que Chrome no lo toque */}
            <div className="flex flex-col justify-center leading-[0.8]" translate="no">
              <span className="notranslate text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                URBAN
              </span>
              <span className="notranslate text-4xl font-black italic tracking-tighter text-white">
                GYM
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Core v2.0 Online</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-6 py-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={idx}
                to={item.href}
                className={`group relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white/5 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
                    : 'hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-full shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
                )}
                
                <span className={`transition-all duration-300 transform group-hover:scale-110 ${
                  isActive ? item.color : 'text-gray-600 group-hover:text-white'
                }`}>
                  {item.icon}
                </span>

                <span className={`flex-1 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-200'
                }`}>
                  {item.label}
                </span>

                {isActive && (
                   <ChevronRight size={14} className="text-purple-500 animate-bounce-x" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* --- FOOTER EXÓTICO - RICHARD RUIZ --- */}
        <div className="p-6">
          <div className="relative group p-6 rounded-[30px] bg-gradient-to-br from-gray-900/50 to-black border border-white/5 overflow-hidden transition-all hover:border-purple-500/30">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/10 blur-[40px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <div className="w-14 h-14 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-pink-600 font-black text-2xl shadow-2xl group-hover:scale-110 group-hover:border-purple-500/50 transition-all duration-500">
                    RR
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#050505] rounded-full flex items-center justify-center border border-white/10">
                   <ShieldCheck size={12} className="text-purple-400" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <p className="text-sm font-black uppercase italic tracking-tighter text-white">Richard Ruiz</p>
                <div className="flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                   <p className="text-[9px] text-purple-400 font-black uppercase tracking-widest">Master Admin</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center" translate="no">
               <span className="notranslate text-[8px] text-gray-600 font-black uppercase tracking-[0.3em]">
                 URBAN GYM PROTOCOL // ACTIVE
               </span>
               <div className="p-2 bg-white/5 rounded-lg hover:bg-purple-500/20 transition-all">
                  <Settings size={14} className="text-gray-500 group-hover:text-purple-400" />
               </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};