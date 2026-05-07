import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { UserPlus, Trash2, Play, CirclePause, X, Clock, Activity, KeyRound } from 'lucide-react'; 
import { getMembers, deleteMember, createMember, updateMemberStatus } from '../services/api';
import { toast } from 'sonner';

const PLANES = [
  { value: 'BASICO', label: '🥉 BÁSICO', precio: '$120.000' },
  { value: 'ESTANDAR', label: '🥈 ESTÁNDAR', precio: '$180.000' },
  { value: 'PREMIUM', label: '🥇 PREMIUM', precio: '$250.000' },
  { value: 'VIP', label: '👑 VIP', precio: '$350.000' },
];

const MembershipTimer = ({ fechaVencimiento }: { fechaVencimiento: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date().getTime();
      const vencimiento = new Date(fechaVencimiento).getTime();
      const distancia = vencimiento - ahora;

      if (distancia < 0) {
        setTimeLeft("TIEMPO AGOTADO");
        clearInterval(interval);
      } else {
        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
        setTimeLeft(`${dias}D ${horas}H ${minutos}M ${segundos}S`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [fechaVencimiento]);

  return (
    <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 py-2 px-4 rounded-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-1">
        <Clock size={10} className="text-purple-400 animate-pulse" />
        <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em]">Tiempo de Vida</span>
      </div>
      <span className={`font-mono text-sm font-black tracking-tighter ${timeLeft.includes("AGOTADO") ? "text-red-500 animate-pulse" : "text-green-400"}`}>
        {timeLeft}
      </span>
    </div>
  );
};

export const MembersPage = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordTemporal, setPasswordTemporal] = useState<string | null>(null); // 👈 NUEVO
  const [formData, setFormData] = useState({ 
    nombre: '', 
    email: '', 
    password: '', 
    rol: 'SOCIO', 
    telefono: '',
    tipo_plan: 'BASICO'
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;
      const data = await getMembers(token);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando miembros:", err);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleToggleStatus = async (id: string, estadoActual: string) => {
    try {
      const esActivo = estadoActual === 'ACTIVOS' || estadoActual === 'ACTIVE' || estadoActual === 'ACTIVO';
      const nuevoEstado = esActivo ? 'INACTIVE' : 'ACTIVE';
      const token = localStorage.getItem('token');
      if (!token) return toast.error("Inicia sesión");
      await updateMemberStatus(id, nuevoEstado, token);
      setMembers(prev => prev.map(m => 
        m.id === id ? { ...m, estado_membresia: nuevoEstado } : m
      ));
      toast.success(`Guerrero ${nuevoEstado === 'ACTIVE' ? 'Activado' : 'en Pausa'}`);
    } catch (err) { 
      toast.error("Error de permisos"); 
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (!window.confirm(`Borrar a: ${nombre}`)) return;
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await deleteMember(id, token);
        setMembers(prev => prev.filter(m => m.id !== id)); 
        toast.success("Eliminado");
      }
    } catch (err) { toast.error("Error al eliminar"); }
  };

  // 👈 NUEVO: resetear contraseña
  const handleResetPassword = async (id: string, nombre: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`https://urban-gym-admin-api.onrender.com/api/admin/members/${id}/reset-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPasswordTemporal(`${nombre}: ${data.password_temporal}`);
      } else {
        toast.error("No se pudo resetear");
      }
    } catch (err) {
      toast.error("Error de conexión");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const nuevo = await createMember({ ...formData }, token);
      if (nuevo) {
        fetchMembers();
        setIsModalOpen(false);
        toast.success("¡Titán Registrado!");
        setFormData({ nombre: '', email: '', password: '', rol: 'SOCIO', telefono: '', tipo_plan: 'BASICO' });
      }
    } catch (err) { toast.error("Error al crear"); }
  };

  const esActivo = (estado: string) => 
    estado === 'ACTIVE' || estado === 'ACTIVOS' || estado === 'ACTIVO';

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn relative">

        {/* 👈 NUEVO: Modal contraseña temporal */}
        {passwordTemporal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a0c] border-2 border-purple-500/50 p-10 rounded-[40px] w-full max-w-sm text-center shadow-2xl">
              <div className="text-5xl mb-4">🔑</div>
              <h3 className="text-2xl font-black text-white italic uppercase mb-2">Contraseña Temporal</h3>
              <p className="text-zinc-500 text-xs mb-6">Entrégala al usuario de forma segura</p>
              <div className="bg-black/40 border border-purple-500/30 rounded-2xl p-6 mb-6">
                <p className="text-purple-400 font-mono font-black text-xl tracking-widest">{passwordTemporal}</p>
              </div>
              <button 
                onClick={() => setPasswordTemporal(null)}
                className="w-full bg-purple-600 hover:bg-white hover:text-black text-white p-4 rounded-2xl font-black uppercase italic transition-all"
              >
                Listo
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px]"></div>
            <div className="relative bg-[#0a0a0c] border-2 border-purple-500/50 p-10 rounded-[45px] w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Registrar Socio</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-500" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="NOMBRE" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={formData.nombre} onChange={(e)=>setFormData({...formData, nombre: e.target.value})}/>
                <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
                <input type="password" placeholder="CONTRASEÑA" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
                <select className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={formData.tipo_plan} onChange={(e)=>setFormData({...formData, tipo_plan: e.target.value})}>
                  {PLANES.map(p => <option key={p.value} value={p.value} className="bg-black">{p.label}</option>)}
                </select>
                <button type="submit" className="w-full bg-white text-black p-4 rounded-xl font-black uppercase italic">Activar</button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex justify-between items-center bg-gray-900/40 p-10 rounded-[40px] border border-white/5">
          <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Red de Élite <span className="text-purple-500">({members.length})</span></h2>
          <div className="flex gap-3">
            <button onClick={fetchMembers} className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2 border border-white/10 hover:bg-white/20 transition-all">
              <Activity size={20} /> Sincronizar
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2">
              <UserPlus size={20} /> Nuevo Socio
            </button>
          </div>
        </div>

        {/* LISTA */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-black tracking-widest uppercase animate-pulse italic">Sincronizando Satélites...</div>
          ) : (
            members.map((miembro) => (
              <div key={miembro.id} className="bg-[#0d0d11] border border-white/5 rounded-[30px] p-8 flex items-center justify-between hover:bg-purple-500/5 transition-all group">
                <div className="flex flex-col min-w-[250px]">
                  <span className="font-black text-2xl italic uppercase text-white group-hover:text-purple-400 transition-colors">{miembro.nombre}</span>
                  <span className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">{miembro.email}</span>
                </div>
                <div className="px-6">
                  <span className="text-purple-400 font-black text-xs tracking-[0.2em]">{miembro.tipo_plan || 'BASICO'}</span>
                </div>
                <div className="px-6">
                  <span className={`px-5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                    esActivo(miembro.estado_membresia)
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {esActivo(miembro.estado_membresia) ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>
                <div className="px-6 flex-1 flex justify-center">
                  {esActivo(miembro.estado_membresia) && miembro.fecha_vencimiento ? (
                    <MembershipTimer fechaVencimiento={miembro.fecha_vencimiento} />
                  ) : (
                    <span className="text-gray-700 italic font-black text-[10px] tracking-widest uppercase opacity-30">
                      EN ESPERA
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {/* 👈 NUEVO: botón reset contraseña */}
                  <button 
                    onClick={() => handleResetPassword(miembro.id, miembro.nombre)}
                    className="p-4 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white rounded-2xl border border-white/5 transition-all"
                    title="Resetear contraseña"
                  >
                    <KeyRound size={24} />
                  </button>
                  <button onClick={() => handleToggleStatus(miembro.id, miembro.estado_membresia)} className={`p-4 rounded-2xl transition-all border border-white/5 ${
                    esActivo(miembro.estado_membresia)
                    ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                    : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  }`}>
                    {esActivo(miembro.estado_membresia) ? <CirclePause size={24} /> : <Play size={24} />}
                  </button>
                  <button onClick={() => handleDelete(miembro.id, miembro.nombre)} className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl border border-white/5 transition-all">
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};