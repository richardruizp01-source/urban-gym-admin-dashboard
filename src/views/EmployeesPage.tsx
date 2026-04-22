import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { UserMinus, UserPlus, Zap, Loader2, X, Crown, Shield } from 'lucide-react'; 
import { getEmployees, deleteMember, createMember } from '../services/api';
import { toast } from 'sonner';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    role: 'TRAINER', 
    email: '', 
    telefono: '',
    password: ''
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || undefined;
      const data = await getEmployees(token);
      setEmployees(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || undefined;
      await createMember({
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.role,
        telefono: formData.telefono,
        password: formData.password || '123456',
      }, token);
      toast.success(`GUERRERO ${formData.nombre.toUpperCase()} SINCRONIZADO`, {
        icon: <Zap className="text-yellow-400" fill="currentColor" />,
        style: { background: '#000', color: '#fff', border: '1px solid #7c3aed' }
      });
      setIsModalOpen(false);
      setFormData({ nombre: '', role: 'TRAINER', email: '', telefono: '', password: '' });
      fetchStaff();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const removeEmployee = async (id: string, nombre: string) => {
    try {
      const token = localStorage.getItem('token') || undefined;
      await deleteMember(id, token);
      toast.success(`${nombre} eliminado del equipo`);
      fetchStaff();
    } catch (err) {
      toast.error('Error al eliminar empleado');
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn relative">
        
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px] animate-in fade-in duration-500"></div>
            
            <div className="relative bg-[#0a0a0c] border-2 border-purple-500/50 p-1 rounded-[45px] w-full max-w-lg overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.3)] animate-in zoom-in-95 duration-300">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/30 blur-[80px] rounded-full"></div>

              <div className="relative bg-[#0d0d11] p-10 rounded-[40px] border border-white/5">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                      Registrar <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-6xl">Titán</span>
                    </h3>
                    <p className="text-purple-400/50 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Urban Gym Staff Division</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="group p-3 bg-white/5 rounded-full hover:bg-red-500/20 transition-all">
                    <X size={24} className="text-gray-500 group-hover:text-red-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nombre */}
                  <div className="relative">
                    <label className="absolute -top-2 left-4 px-2 bg-[#0d0d11] text-[9px] font-black text-purple-400 uppercase tracking-widest z-10">Alias del Miembro</label>
                    <input 
                      type="text" required placeholder="NOMBRE COMPLETO"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-white focus:border-purple-500 outline-none transition-all placeholder:text-white/10 font-bold"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className="absolute -top-2 left-4 px-2 bg-[#0d0d11] text-[9px] font-black text-purple-400 uppercase tracking-widest z-10">Correo Electrónico</label>
                    <input 
                      type="email" required placeholder="EMAIL@URBANGYM.COM"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-white focus:border-purple-500 outline-none transition-all placeholder:text-white/10 font-bold"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="absolute -top-2 left-4 px-2 bg-[#0d0d11] text-[9px] font-black text-purple-400 uppercase tracking-widest z-10">Contraseña</label>
                    <input 
                      type="password" placeholder="DEJAR VACÍO = 123456"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-white focus:border-purple-500 outline-none transition-all placeholder:text-white/10 font-bold"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Rol */}
                    <div className="relative">
                      <label className="absolute -top-2 left-4 px-2 bg-[#0d0d11] text-[9px] font-black text-purple-400 uppercase tracking-widest z-10">Rango Especializado</label>
                      <select 
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-white focus:border-purple-500 outline-none font-bold appearance-none"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="TRAINER">⚡ TRAINER</option>
                        <option value="RECEPCION">🛡️ RECEPCIÓN</option>
                        <option value="ADMIN">👑 DIRECTOR</option>
                      </select>
                    </div>
                    {/* Teléfono */}
                    <div className="relative">
                      <label className="absolute -top-2 left-4 px-2 bg-[#0d0d11] text-[9px] font-black text-purple-400 uppercase tracking-widest z-10">Línea de Enlace</label>
                      <input 
                        type="text" placeholder="WHATSAPP"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-white focus:border-purple-500 outline-none transition-all font-bold placeholder:text-white/10"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full relative overflow-hidden group bg-white p-6 rounded-[20px] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 text-black group-hover:text-white font-black uppercase tracking-[0.2em] italic text-lg transition-colors">
                      Activar Guerrero
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- HEADER ÉLITE --- */}
        <div className="flex justify-between items-center bg-gray-900/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 transition-opacity">
             <Zap size={140} className="text-purple-500 rotate-12 fill-purple-500/10" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
               <Crown size={16} className="text-yellow-400 fill-yellow-400" />
               <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.5em]">Urban Gym Elite</span>
            </div>
            <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                La <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">Tropa</span>
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest px-6 py-4 rounded-2xl transition-all hover:scale-105"
          >
            <UserPlus size={20} />
            Nuevo
          </button>
        </div>

        {/* --- GRID DE STAFF --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
               <Loader2 className="animate-spin text-purple-500" size={60} />
               <div className="absolute inset-0 blur-2xl bg-purple-500/20 animate-pulse"></div>
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">Sincronizando Sistema...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {employees.map(emp => (
              <div key={emp.id} className="group bg-[#0d0d11] border border-white/5 p-8 rounded-[35px] flex justify-between items-center hover:border-purple-500/40 transition-all duration-500 shadow-xl hover:shadow-purple-500/5 overflow-hidden relative">
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                       <Shield size={28} />
                    </div>
                    <div>
                       <h4 className="text-2xl font-black text-white italic uppercase tracking-tight group-hover:text-purple-400 transition-colors">{emp.nombre}</h4>
                       <p className="text-gray-500 text-sm mt-1">{emp.email}</p>
                       <span className="bg-purple-500/10 text-purple-400 text-[9px] font-black px-3 py-1 rounded-full border border-purple-500/20 uppercase tracking-widest mt-2 inline-block">
                          {emp.rol || emp.role || 'ELITE STAFF'}
                       </span>
                    </div>
                 </div>
                 <button onClick={() => removeEmployee(emp.id, emp.nombre)} className="relative z-10 p-4 text-gray-500 hover:text-red-500 transition-colors">
                    <UserMinus size={24} />
                 </button>
              </div>
            ))}

            {/* BOTÓN AGREGAR */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="relative h-[120px] rounded-[35px] border-2 border-dashed border-white/10 flex items-center justify-center gap-4 group overflow-hidden transition-all hover:border-purple-500/50"
            >
              <div className="absolute inset-0 bg-purple-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="p-3 bg-white/5 rounded-full text-gray-500 group-hover:text-purple-400 group-hover:rotate-90 transition-all duration-500">
                <UserPlus size={32} />
              </div>
              <span className="relative z-10 font-black uppercase text-sm tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">Invocar Nuevo Titán</span>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};