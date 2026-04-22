import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { 
  Plus, Building2, MapPin, Phone, 
  Activity, X, Zap, Power, Globe 
} from 'lucide-react';
import { getSedes, createSede, updateSedeStatus } from '../services/api'; 
import { toast } from 'sonner';

interface Sede {
  id?: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  capacidad_max: number;
  esta_activa: boolean; 
}

export const SedesPage = () => {
  const navigate = useNavigate();
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Sede>({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    capacidad_max: 100,
    esta_activa: true
  });

  // 1. CARGAR SEDES
  const fetchSedes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const data = await getSedes(token);
      console.log("Sedes cargadas:", data); // Para ver en F12
      setSedes(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Error al sincronizar sedes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSedes(); }, []);

  // 2. ⚡ LÓGICA DEL BOTÓN (CORREGIDA)
  const handleToggleStatus = async (id: string | undefined, estadoActual: boolean) => {
    if (!id) return;
    
    try {
      const token = localStorage.getItem('token') || '';
      // Enviamos el ID y el valor contrario al actual
      const success = await updateSedeStatus(id, !estadoActual, token);
      
      if (success) {
        toast.success(!estadoActual ? "SEDE ACTIVADA" : "SEDE DESACTIVADA", {
          icon: <Activity size={16} className={!estadoActual ? "text-green-500" : "text-red-500"} />
        });
        await fetchSedes(); // Forzamos recarga de la lista
      } else {
        toast.error("El servidor no procesó el cambio");
      }
    } catch (err) {
      toast.error("Error de conexión con el microservicio");
    }
  };

  // 3. REGISTRAR SEDE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      await createSede(formData, token);
      toast.success("SEDE REGISTRADA");
      setIsModalOpen(false);
      setFormData({ nombre: '', direccion: '', ciudad: '', telefono: '', capacidad_max: 100, esta_activa: true });
      fetchSedes();
    } catch (err) {
      toast.error("Error al registrar");
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn p-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-gray-900/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-md">
          <div>
            <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.5em]">Urban Gym Infrastructure</span>
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Sedes <span className="text-purple-500">Activas</span></h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2 hover:bg-purple-500 hover:text-white transition-all shadow-lg"
          >
            <Plus size={20} /> Nueva Sede
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-500 font-black uppercase tracking-widest animate-pulse italic">Escaneando Instalaciones...</div>
          ) : (
            sedes.map((sede) => (
              <div key={sede.id} className="bg-[#0d0d11] border border-white/5 rounded-[35px] p-8 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${sede.esta_activa ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-800 text-gray-600'}`}>
                    <Building2 size={28} />
                  </div>
                  <div className={`flex items-center gap-2 border px-3 py-1 rounded-full ${sede.esta_activa ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <Activity size={10} className={sede.esta_activa ? 'text-green-500 animate-pulse' : 'text-red-500'} />
                    <span className={`text-[9px] font-black uppercase tracking-widest italic ${sede.esta_activa ? 'text-green-400' : 'text-red-400'}`}>
                      {sede.esta_activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white italic uppercase mb-1">{sede.nombre}</h3>
                <p className="text-gray-500 text-xs font-medium mb-6 flex items-center gap-2">
                  <MapPin size={12} className="text-purple-500" /> {sede.direccion}
                </p>

                <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5 mb-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-gray-500 tracking-widest">Capacidad Max</span>
                    <span className="text-white">{sede.capacidad_max} Usuarios</span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => handleToggleStatus(sede.id, !!sede.esta_activa)}
                    className={`p-4 rounded-2xl border border-white/5 transition-all duration-300 ${
                      !sede.esta_activa 
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'
                    }`}
                  >
                    <Power size={20} className={sede.esta_activa ? 'animate-pulse' : 'opacity-40'} />
                  </button>

                  <button 
                    onClick={() => navigate('/maquinas')}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl border border-white/5 transition-all text-[10px] font-black uppercase italic tracking-[0.2em]"
                  >
                    Gestionar Arsenal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL (Se mantiene igual) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a0c] border-2 border-purple-500/50 p-10 rounded-[40px] w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Nueva <br/><span className="text-purple-500 text-4xl">Sede</span></h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="NOMBRE DE LA SEDE" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-purple-500 transition-all uppercase" value={formData.nombre} onChange={(e)=>setFormData({...formData, nombre: e.target.value})}/>
                <input type="text" placeholder="DIRECCIÓN" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-purple-500 transition-all" value={formData.direccion} onChange={(e)=>setFormData({...formData, direccion: e.target.value})}/>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="CIUDAD" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-purple-500" value={formData.ciudad} onChange={(e)=>setFormData({...formData, ciudad: e.target.value})}/>
                  <input type="number" placeholder="CAPACIDAD" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-purple-500" value={formData.capacidad_max} onChange={(e)=>setFormData({...formData, capacidad_max: Number(e.target.value)})}/>
                </div>
                <input type="text" placeholder="TELÉFONO" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-purple-500" value={formData.telefono} onChange={(e)=>setFormData({...formData, telefono: e.target.value})}/>
                <button type="submit" className="w-full bg-purple-600 hover:bg-white hover:text-black text-white p-4 rounded-2xl font-black uppercase italic transition-all mt-4">Registrar Instalación</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};