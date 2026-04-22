import React from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Zap, 
  Activity, 
  Search, 
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  // Toque exótico: Fecha con estilo de sistema
  const systemDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  }).toUpperCase();

  // 🚀 FUNCIÓN PARA SALIR DEL SISTEMA
  const handleLogout = () => {
    localStorage.removeItem('token'); // Borramos la llave maestra
    window.location.href = '/'; // Patada pal Login de una
  };

  return (
    <nav className="sticky top-0 z-[45] w-full bg-[#050505]/70 backdrop-blur-2xl border-b border-white/10 px-6 py-4 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
        
        {/* LADO IZQUIERDO: LOGO & MOBILE MENU */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-3 bg-white/5 hover:bg-purple-600/20 rounded-2xl transition-all duration-300 group"
          >
            <Menu size={20} className="text-gray-400 group-hover:text-purple-400" />
          </button>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)] group-hover:shadow-purple-500/40 transition-all duration-500 transform group-hover:rotate-[360deg]">
                <Zap size={24} className="text-black fill-black" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#050505] rounded-full flex items-center justify-center border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black italic tracking-tighter leading-none text-white">
                URBAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">GYM</span>
              </h1>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mt-1">Sincronización Elite</p>
            </div>
          </div>
        </div>

        {/* CENTRO: BARRA DE BÚSQUEDA FUTURISTA */}
        <div className="hidden lg:flex flex-1 max-w-xl px-10">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 focus-within:border-purple-500/50 transition-all">
              <Search size={18} className="text-gray-500 group-focus-within:text-purple-400" />
              <input 
                type="text" 
                placeholder="RASTREAR GUERRERO O STAFF..." 
                className="bg-transparent border-none outline-none w-full px-4 text-xs font-bold text-white placeholder:text-gray-600 tracking-widest"
              />
            </div>
          </div>
        </div>

        {/* LADO DERECHO: STATUS & PERFIL */}
        <div className="flex items-center gap-3">
          
          <div className="hidden xl:flex flex-col items-end px-4 border-r border-white/5">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-purple-500 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">{systemDate}</span>
            </div>
            <span className="text-[8px] font-black text-purple-500/50 uppercase tracking-[0.3em]">Core v2.0 Stable</span>
          </div>

          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all relative group">
            <Bell size={20} className="text-gray-400 group-hover:text-white" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-pink-600 rounded-full animate-ping"></span>
          </button>

          <div className="flex items-center gap-3 ml-2 bg-white/5 border border-white/5 p-1.5 pr-4 rounded-[20px] hover:bg-white/10 transition-all group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-[14px] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <User size={20} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                 <ShieldCheck size={14} className="text-yellow-400 fill-black" />
              </div>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[11px] font-black text-white uppercase italic tracking-tighter leading-none">Richard Ruiz</span>
              <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest mt-1">Master Admin</span>
            </div>
          </div>

          {/* 🚨 BOTÓN DE CERRAR SESIÓN (CORREGIDO) */}
          <button 
            onClick={handleLogout}
            className="p-3 bg-red-500/5 hover:bg-red-500/20 rounded-2xl text-red-500/50 hover:text-red-500 transition-all group border border-transparent hover:border-red-500/20"
            title="Cerrar Secuencia"
          >
            <LogOut size={20} />
          </button>
        </div>

      </div>
    </nav>
  );
};