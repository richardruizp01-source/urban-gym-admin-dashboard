import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getMachines, updateMachineStatus, getSedes, createMachine } from '../services/api'; 
import { Dumbbell, Wrench, ArrowLeft, MapPin, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

// 🚀 CONFIGURACIÓN DE SERIALES SIMPLES (C-M-X)
const SERIALES_SIMPLES = [
  "C-01", "C-02", "C-03", 
  "M-01", "M-02", "M-03", 
  "X-01", "X-02", "X-03"
];

export const MachinesPage = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<any[]>([]);
  const [realSedes, setRealSedes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSede, setSelectedSede] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    serial_number: '',
    sede_id: '',
    area: 'CARDIO'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const [machinesRes, sedesRes] = await Promise.all([
        getMachines(token),
        getSedes(token)
      ]);
      setMachines(Array.isArray(machinesRes) ? machinesRes : (machinesRes?.data || []));
      setRealSedes(Array.isArray(sedesRes) ? sedesRes : (sedesRes?.data || []));
    } catch (e) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      const finalData = { ...formData, sede_id: selectedSede || formData.sede_id };
      
      if (!finalData.sede_id) return toast.error("Selecciona una sede");

      await createMachine(finalData, token);
      toast.success("EQUIPO REGISTRADO: " + finalData.serial_number);
      setIsModalOpen(false);
      setFormData({ nombre: '', marca: '', serial_number: '', sede_id: '', area: 'CARDIO' });
      loadData();
    } catch (err) {
      toast.error("Error al registrar");
    }
  };

  const toggleMaintenance = async (machine: any) => {
    const nuevoEstado = machine.estado === 'OPERATIVO' ? 'MANTENIMIENTO' : 'OPERATIVO';
    try {
      await updateMachineStatus(machine.id, { estado: nuevoEstado });
      setMachines(prev => prev.map(m => m.id === machine.id ? { ...m, estado: nuevoEstado } : m));
    } catch (error) {
      toast.error("Error de estado");
    }
  };

  const filteredMachines = useMemo(() => {
    if (!selectedSede) return [];
    return machines.filter(m => String(m.sede_id) === String(selectedSede));
  }, [machines, selectedSede]);

  if (loading) return <Layout><div className="h-screen flex items-center justify-center text-orange-500 font-black animate-pulse uppercase italic">Cargando Arsenal...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-10 pb-20 p-6">
        
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[40px] bg-[#0d0d11] border border-white/5 p-10 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button onClick={() => selectedSede ? setSelectedSede(null) : navigate('/dashboard')} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-orange-500 transition-all">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
                {selectedSede ? realSedes.find(s => s.id === selectedSede)?.nombre?.split(' ')[1] : 'ARSENAL'} <br /> 
                <span className="text-orange-500">EQUIPOS</span>
              </h1>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 text-black px-8 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2 hover:bg-white transition-all">
              <Plus size={20} /> Nuevo Equipo
            </button>
          </div>
        </div>

        {/* SELECTOR DE SEDE O GRID DE MÁQUINAS */}
        {!selectedSede ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realSedes.map((sede) => (
              <div key={sede.id} onClick={() => setSelectedSede(sede.id)} className="group cursor-pointer rounded-[40px] bg-[#0d0d11] border border-white/5 p-10 hover:border-orange-500/50 transition-all text-center">
                <MapPin className="mx-auto text-gray-800 group-hover:text-orange-500 mb-4 transition-colors" size={40} />
                <h2 className="text-3xl font-black text-white italic uppercase">{sede.nombre}</h2>
                <p className="text-orange-500 text-[10px] font-black mt-4 uppercase tracking-[0.3em]">Abrir Arsenal</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines.map((m: any) => (
              <div key={m.id} className="bg-[#0d0d11] border border-white/5 rounded-[40px] p-8 hover:border-orange-500/30 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-white/5 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all"><Dumbbell size={24} /></div>
                  <button onClick={() => toggleMaintenance(m)} className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase ${m.estado === 'OPERATIVO' ? 'text-green-400 border-green-400/20' : 'text-yellow-400 border-yellow-400/20 animate-pulse'}`}>
                    {m.estado || 'OPERATIVO'}
                  </button>
                </div>
                <p className="text-orange-500 text-[9px] font-black uppercase mb-1">{m.marca}</p>
                <h3 className="text-2xl font-black text-white italic uppercase mb-6 leading-tight">{m.nombre}</h3>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center text-gray-600 text-[10px] font-bold">
                  <span>SN: {m.serial_number}</span>
                  <Wrench size={16} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🛠️ MODAL DE CREACIÓN CON C-M-X SELECTOR */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#0a0a0c] border-2 border-orange-500/20 p-10 rounded-[50px] w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Nueva <br/><span className="text-orange-500 text-4xl">Unidad</span></h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleCreateMachine} className="space-y-4">
                <input type="text" placeholder="NOMBRE" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all uppercase font-bold text-xs" value={formData.nombre} onChange={(e)=>setFormData({...formData, nombre: e.target.value})}/>
                <input type="text" placeholder="MARCA" required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all uppercase font-bold text-xs" value={formData.marca} onChange={(e)=>setFormData({...formData, marca: e.target.value})}/>

                {/* ⚡ SELECTOR RÁPIDO C-M-X */}
                <div className="space-y-3 py-2">
                  <p className="text-[10px] font-black text-orange-500 uppercase italic tracking-widest px-1">Serial del Arsenal</p>
                  <div className="flex flex-wrap gap-2">
                    {SERIALES_SIMPLES.map(sn => (
                      <button
                        key={sn}
                        type="button"
                        onClick={() => setFormData({...formData, serial_number: sn})}
                        className={`w-12 h-10 rounded-xl text-[10px] font-black transition-all border uppercase ${
                          formData.serial_number === sn 
                            ? 'bg-orange-500 text-black border-orange-500 shadow-lg scale-110' 
                            : 'bg-white/5 text-gray-500 border-white/5 hover:border-orange-500/40'
                        }`}
                      >
                        {sn}
                      </button>
                    ))}
                  </div>
                  <input type="text" placeholder="O MANUAL" className="w-full bg-black/60 border border-white/5 p-3 rounded-xl text-white text-[10px] outline-none focus:border-orange-500 transition-all text-center font-bold tracking-[0.2em]" value={formData.serial_number} onChange={(e)=>setFormData({...formData, serial_number: e.target.value})}/>
                </div>

                {!selectedSede && (
                  <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 uppercase font-black text-[10px]" value={formData.sede_id} onChange={(e)=>setFormData({...formData, sede_id: e.target.value})}>
                    <option value="" className="bg-black text-gray-500">ASIGNAR SEDE...</option>
                    {realSedes.map(s => <option key={s.id} value={s.id} className="bg-black">{s.nombre}</option>)}
                  </select>
                )}

                <button type="submit" className="w-full bg-orange-500 hover:bg-white hover:text-black text-black p-5 rounded-2xl font-black uppercase italic transition-all mt-4 text-sm shadow-xl">Confirmar Unidad</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};