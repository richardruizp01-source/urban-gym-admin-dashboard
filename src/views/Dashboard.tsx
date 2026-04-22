import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🚀 Importado
import { Layout } from '../components/Layout';
import { Users, Calendar, MapPin, Zap, TrendingUp, AlertCircle, ArrowUpRight, Crown, Activity } from 'lucide-react';
import { getDashboardData } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate(); // 🚀 Hook para el salto
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token') || undefined;
        const data = await getDashboardData(token);
        setDashboardData(data);
      } catch (err) {
        console.error('Error en el Dashboard:', err);
        setError('Error de conexión con el servidor (puerto 3005)');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🚀 MAPEADO EXÓTICO (Colores ajustados al Flow de Urban Gym)
  const stats = [
    { 
      label: 'Miembros Activos', 
      value: dashboardData?.resumen?.miembros_activos ?? 0, 
      icon: <Users size={28} />, 
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-500/20',
      path: '/miembros'
    },
    { 
      label: 'Reservas Hoy', 
      value: dashboardData?.resumen?.reservas_hoy ?? 0, 
      icon: <Calendar size={28} />, 
      color: 'from-pink-500 to-rose-600',
      shadow: 'shadow-pink-500/20',
      path: '/reservas',
      hideValue: true // 👈 NUEVO: ocultar número
    },
    { 
      label: 'Sedes Activas', 
      value: dashboardData?.resumen?.sedes_activas ?? 0, 
      icon: <MapPin size={28} />, 
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/20',
      path: '/sedes'
    },
    { 
      label: 'Maquinaria', 
      value: dashboardData?.resumen?.maquinas_activas ?? 0, 
      icon: <Zap size={28} />, 
      color: 'from-yellow-400 to-orange-500',
      shadow: 'shadow-yellow-500/20',
      path: '/maquinas'
    },
  ];

  if (loading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <Zap className="absolute inset-0 m-auto text-purple-500 animate-pulse" size={30} />
        </div>
        <p className="text-gray-500 font-black tracking-[0.5em] text-[10px] uppercase">Sincronizando Core...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* 🔥 BANNER ELITE: CENTRO DE MANDO */}
        <div className="relative overflow-hidden rounded-[40px] bg-[#0d0d11] border border-white/5 p-12 shadow-2xl group">
          {/* Luces de fondo dinámicas */}
          <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <Crown size={18} className="text-yellow-500 fill-yellow-500" />
               <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.5em]">Urban Gym Management</span>
            </div>
            <h1 className="text-7xl font-black text-white mb-4 italic uppercase tracking-tighter leading-none">
              Centro de <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-gray-600">Mando</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full">
                <Activity size={14} className="text-green-500 animate-pulse" />
                <span className="text-green-500 text-[10px] font-black uppercase tracking-widest text-xs">Sistemas Online</span>
              </div>
              <p className="text-gray-500 text-sm font-bold italic tracking-wide">Bienvenido de vuelta, Richard Ruiz.</p>
            </div>
          </div>
          <Zap size={220} className="absolute right-[-40px] bottom-[-40px] text-white/[0.02] -rotate-12 group-hover:text-white/[0.05] transition-all duration-700" />
        </div>

        {/* 🚨 ALERTA DE ERROR */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 text-red-500 animate-pulse">
            <AlertCircle size={24} />
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest">Falla de Conexión</span>
              <span className="text-sm font-bold opacity-80">{error}</span>
            </div>
          </div>
        )}

        {/* 💳 GRID DE CARDS EXÓTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(stat.path)} // 🚀 Acción de clic para navegar
              className="group relative cursor-pointer overflow-hidden rounded-[35px] bg-[#0d0d11] border border-white/5 p-8 transition-all duration-500 hover:scale-[1.02] hover:border-white/20 shadow-xl"
            >
              <div className={`p-4 w-fit rounded-2xl bg-gradient-to-br ${stat.color} mb-6 shadow-2xl ${stat.shadow} transform group-hover:rotate-[10deg] transition-transform`}>
                {stat.icon}
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
              {!stat.hideValue && ( // 👈 NUEVO: solo muestra número si hideValue no está activo
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-white tabular-nums tracking-tighter italic">
                    {stat.value}
                  </p>
                  <ArrowUpRight size={20} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              
              {/* Reflejo de cristal */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* 🏢 SECCIÓN DE SEDES (Lógica Visual) */}
        <div className="bg-[#0d0d11]/50 border border-white/5 p-10 rounded-[40px] backdrop-blur-md">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.5em]">Estado de Sedes // Global</h3>
            <div className="h-px flex-1 bg-white/5 mx-6"></div>
            <TrendingUp size={16} className="text-purple-500" />
          </div>
          <p className="text-gray-600 text-sm italic font-medium">Selecciona una sede en el menú lateral para ver detalles específicos del rendimiento en Cereté.</p>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;