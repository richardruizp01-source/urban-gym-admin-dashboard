
import { Link } from 'react-router-dom';

const SystemPage = () => {
  const stats = [
    { label: 'Servidor API', status: 'ONLINE', color: 'text-green-500', ping: '12ms' },
    { label: 'Base de Datos', status: 'SYNC', color: 'text-purple-500', ping: '8ms' },
    { label: 'Seguridad JWT', status: 'ACTIVE', color: 'text-blue-500', ping: 'OK' },
    { label: 'BFF Gateway', status: 'ONLINE', color: 'text-yellow-500', ping: '15ms' },
  ];

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-purple-500">
      
      {/* HEADER TÁCTICO */}
      <div className="mb-10 flex items-center justify-between">
        <Link 
          to="/dashboard" 
          className="group flex items-center gap-3 text-zinc-500 hover:text-purple-500 transition-all"
        >
          <div className="bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800 group-hover:border-purple-500/50">
            <span className="text-xl inline-block group-hover:-translate-x-1 transition-transform">←</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cerrar Sistema</span>
        </Link>
        <div className="text-right">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-none">Protocolo de Seguridad</p>
          <p className="text-xs font-bold text-purple-500">NIVEL 5 // MASTER ADMIN</p>
        </div>
      </div>

      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-700">
          NÚCLEO DEL <span className="text-purple-500 font-black">SISTEMA</span>
        </h1>
        <div className="h-1 w-32 bg-purple-600 mt-2"></div>
      </div>

      {/* GRID DE ESTADOS REAL-TIME */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className={`text-xl font-black italic ${stat.color}`}>{stat.status}</span>
              <span className="text-[10px] text-zinc-700 font-mono">{stat.ping}</span>
            </div>
          </div>
        ))}
      </div>

      {/* TERMINAL DE LOGS (Lo más exótico) */}
      <div className="bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-900/50 px-6 py-3 border-b border-zinc-800 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          <span className="ml-4 text-[10px] font-mono text-zinc-500">terminal@urban-gym-os: ~</span>
        </div>
        <div className="p-8 font-mono text-sm space-y-2 opacity-80">
          <p className="text-purple-400 font-bold tracking-tighter">[SYS] Inicializando URBAN GYM CORE V2.0...</p>
          <p className="text-zinc-500"> {">"} Verificando conexión con microservicios en puertos 3002, 3005...</p>
          <p className="text-green-500 italic"> [OK] Base de datos PostgreSQL conectada correctamente.</p>
          <p className="text-zinc-500"> {">"} Cargando módulos de La Tropa (Entrenadores)...</p>
          <p className="text-zinc-500"> {">"} Sincronizando Arsenal VIP (Máquinas)...</p>
          <p className="text-purple-500 animate-pulse font-black"> [ALERT] Richard Ruiz ha iniciado sesión desde terminal maestra.</p>
          <p className="text-zinc-600 mt-4 animate-bounce">_</p>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN RÁPIDA */}
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all">
          Reiniciar Servidores
        </button>
        <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/50 transition-all">
          Descargar Logs
        </button>
      </div>

    </div>
  );
};

export default SystemPage;