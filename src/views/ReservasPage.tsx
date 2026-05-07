import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. ESTRUCTURA REAL SINCRONIZADA ← actualizada para clases_instancia
interface Sesion {
  id: string;
  nombre_clase: string;
  trainer_nombre: string;
  sede_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad_total: number;
  cupos_disponibles: number;
}

interface Entrenador {
  id: string;
  nombre: string;
}

interface Sede {
  id: string;
  nombre: string;
}

const ReservasPage = () => {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const [nuevaClase, setNuevaClase] = useState({
    nombre_clase: '', 
    clase_instancia_id: '77f72671-654a-4f9e-8c85-6932470768f5', 
    entrenador_id: '',
    cupos_maximos: 20,
    sede_nombre: 'Sede Central', 
    fecha_inicio: '',
    fecha_fin: '',
    socio_id: '77f72671-654a-4f9e-8c85-6932470768f5', 
    estado: 'CONFIRMED',
    descripcion: '', // 👈 NUEVO
  });

  const cargarDatos = async () => {
    try {
      console.log("🛰️ Sincronizando microservicios...");
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = import.meta.env.VITE_API_URL;

      const [resBookings, resTrainers, resSedes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/reservas`, { headers }),
        fetch(`${apiUrl}/api/admin/staff/trainers`, { headers }),
        fetch(`${apiUrl}/api/admin/sedes`, { headers })
      ]);
      
      const dataBookings = await resBookings.json();
      const dataTrainers = await resTrainers.json();
      const dataSedes = await resSedes.json();
      
      setSesiones(Array.isArray(dataBookings) ? dataBookings : dataBookings?.data || []);
      setEntrenadores(Array.isArray(dataTrainers) ? dataTrainers : dataTrainers?.data || []);
      const todasSedes = dataSedes?.data || dataSedes || [];
      setSedes(Array.isArray(todasSedes) ? todasSedes.filter((s: any) => s.esta_activa) : []);
    } catch (err) {
      console.error("🚨 Fallo de enlace táctico:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleEliminar = async (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      setTimeout(() => setConfirmingId(null), 3000);
      return;
    }

    setConfirmingId(null);
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setSesiones(prev => prev.filter(s => s.id !== id));
      } else {
        alert("❌ No se pudo eliminar.");
      }
    } catch {
      alert("❌ Error de red al eliminar.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCrearSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🕐 fecha_inicio:", nuevaClase.fecha_inicio);
    console.log("🕐 fecha_fin:", nuevaClase.fecha_fin);
    try {
      const coach = entrenadores.find(t => t.id === nuevaClase.entrenador_id);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservas`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          clase_id: nuevaClase.clase_instancia_id,
          nombre_clase: nuevaClase.nombre_clase,
          trainer_id: nuevaClase.entrenador_id,
          trainer_nombre: coach?.nombre || 'Estratega',
          sede_id: "77f72671-654a-4f9e-8c85-6932470768f5",
          sede_nombre: nuevaClase.sede_nombre,
          capacidad_total: nuevaClase.cupos_maximos,
          fecha_inicio: nuevaClase.fecha_inicio + ':00-05:00',
          fecha_fin: nuevaClase.fecha_fin + ':00-05:00',
          descripcion: nuevaClase.descripcion, // 👈 NUEVO
        })
      });

      if (response.ok) {
        alert("✅ Clase de " + nuevaClase.nombre_clase + " desplegada.");
        setIsModalOpen(false);
        cargarDatos();
      } else {
        const errData = await response.json();
        alert("❌ Error: " + errData.error);
      }
    } catch (err) {
      alert("❌ Fallo de red con el microservicio 3003");
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).toUpperCase();
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white font-sans overflow-x-hidden">
      
      <div className="mb-10 flex items-center justify-between">
        <Link to="/dashboard" className="group flex items-center gap-3 text-zinc-500 hover:text-orange-500 transition-all">
          <div className="bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-xl">←</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Centro de Mando</span>
        </Link>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-black font-black text-[10px] px-8 py-4 rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform"
        >
          + Desplegar Nueva Sesion
        </button>
      </div>

      <div className="mb-12">
        <h1 className="text-7xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-500 to-zinc-900 leading-none">
          OPERACIONES <span className="text-orange-500">RESERVAS</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-[3rem]">
              <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sesiones.length > 0 ? (
          sesiones.map((sesion) => {
            const tituloClase = sesion.nombre_clase || 'SIN NOMBRE';
            const ahora = new Date();
            const inicio = new Date(sesion.fecha_inicio);
            const fin = new Date(sesion.fecha_fin);
            const estaActiva = ahora >= inicio && ahora <= fin;
            const duracionMs = fin.getTime() - inicio.getTime();
            const transcurridoMs = ahora.getTime() - inicio.getTime();
            const progresoDuracion = estaActiva
              ? Math.min(Math.round((transcurridoMs / duracionMs) * 100), 100)
              : ahora > fin ? 100 : 0;

            const isConfirming = confirmingId === sesion.id;
            const isDeleting = deletingId === sesion.id;

            return (
              <div key={sesion.id} className="group relative bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-8 hover:border-orange-500/40 transition-all backdrop-blur-xl">
                
                <button
                  onClick={() => handleEliminar(sesion.id)}
                  disabled={isDeleting}
                  title={isConfirming ? "Click de nuevo para confirmar" : "Eliminar sesión"}
                  className={`absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border transition-all text-xs
                    ${isConfirming
                      ? 'bg-red-500/30 border-red-500 text-red-400 scale-110'
                      : 'bg-zinc-800 hover:bg-red-500/20 hover:border-red-500 border-zinc-700 text-zinc-500 hover:text-red-500'
                    }`}
                >
                  {isDeleting ? '...' : isConfirming ? '¿?' : '✕'}
                </button>

                <div className="flex justify-between items-start mb-6 pr-8">
                  <h3 className="text-2xl font-black uppercase italic group-hover:text-orange-500 leading-none">
                    {tituloClase}
                  </h3>
                  <span className={`text-[8px] font-bold px-2 py-1 rounded-full ${estaActiva ? 'bg-orange-500/20 text-orange-500' : ahora > fin ? 'bg-zinc-700/40 text-zinc-500' : 'bg-blue-500/20 text-blue-400'}`}>
                    {estaActiva ? 'ACTIVA' : ahora > fin ? 'FINALIZADA' : 'PROXIMA'}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Estratega:</span>
                    <p className="text-[11px] font-bold text-white italic">{sesion.trainer_nombre || 'SIN ASIGNAR'}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Sede:</span>
                    <p className="text-[11px] font-bold text-white">{sesion.sede_nombre}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Cupos:</span>
                    <p className="text-[11px] font-bold text-white">
                      <span className="text-orange-500">{sesion.cupos_disponibles}</span> / {sesion.capacidad_total} disponibles
                    </p>
                  </div>

                  <div className="border-t border-zinc-800/60 pt-3 mt-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-[7px] font-black">▌</span>
                      <div>
                        <span className="text-zinc-600 text-[7px] font-black uppercase tracking-widest block">Inicio</span>
                        <p className="text-[10px] font-bold text-white">{formatFecha(sesion.fecha_inicio)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-[7px] font-black">▌</span>
                      <div>
                        <span className="text-zinc-600 text-[7px] font-black uppercase tracking-widest block">Fin</span>
                        <p className="text-[10px] font-bold text-white">{formatFecha(sesion.fecha_fin)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-600 text-[7px] font-black uppercase tracking-widest">Ocupacion</span>
                    <span className="text-zinc-500 text-[7px] font-black">{sesion.capacidad_total > 0 ? Math.round(((sesion.capacidad_total - sesion.cupos_disponibles) / sesion.capacidad_total) * 100) : 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 shadow-[0_0_15px_#f97316] transition-all"
                      style={{ width: `${sesion.capacidad_total > 0 ? Math.round(((sesion.capacidad_total - sesion.cupos_disponibles) / sesion.capacidad_total) * 100) : 0}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center mb-1 mt-3">
                    <span className="text-zinc-600 text-[7px] font-black uppercase tracking-widest">Tiempo</span>
                    <span className="text-zinc-500 text-[7px] font-black">{progresoDuracion}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all"
                      style={{ width: `${progresoDuracion}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-500 font-black text-xs uppercase tracking-[0.5em]">Esperando datos de PostgreSQL...</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-[#0f0f0f] border border-orange-500/30 p-10 rounded-[3rem] max-w-lg w-full">
            <h2 className="text-4xl font-black uppercase italic mb-8 text-white">Nueva <span className="text-orange-500">Actividad</span></h2>
            <form onSubmit={handleCrearSesion} className="space-y-6">
              
              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-white">Nombre de la Clase</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-orange-500 outline-none" 
                  placeholder="Ej: Zumba, Boxeo..." 
                  onChange={(e) => setNuevaClase(prev => ({...prev, nombre_clase: e.target.value}))}
                />
              </div>

              {/* 👈 NUEVO: Campo descripcion */}
              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-white">Descripción</label>
                <textarea
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-orange-500 outline-none resize-none"
                  placeholder="Ej: Clase de alta intensidad para todos los niveles..."
                  rows={3}
                  onChange={(e) => setNuevaClase(prev => ({...prev, descripcion: e.target.value}))}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-white">Fecha Inicio</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={nuevaClase.fecha_inicio}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-orange-500 outline-none" 
                    onChange={(e) => setNuevaClase(prev => ({...prev, fecha_inicio: e.target.value}))}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-white">Fecha Fin</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={nuevaClase.fecha_fin}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-orange-500 outline-none" 
                    onChange={(e) => setNuevaClase(prev => ({...prev, fecha_fin: e.target.value}))}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-white">Cupos</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-orange-500 outline-none" 
                    placeholder="20" 
                    onChange={(e) => setNuevaClase(prev => ({...prev, cupos_maximos: parseInt(e.target.value)}))}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-white">Sede</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-orange-500 outline-none appearance-none"
                    onChange={(e) => setNuevaClase(prev => ({...prev, sede_nombre: e.target.value}))}
                  >
                    {sedes.map(s => (
                      <option key={s.id} value={s.nombre}>{s.nombre.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-white">Estratega (Lista del 3001)</label>
                <select 
                  required 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-orange-500 outline-none appearance-none"
                  onChange={(e) => setNuevaClase(prev => ({...prev, entrenador_id: e.target.value}))}
                >
                  <option value="">-- SELECCIONAR ENTRENADOR --</option>
                  {entrenadores.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => {
                  setIsModalOpen(false);
                  setNuevaClase(prev => ({...prev, fecha_inicio: '', fecha_fin: ''}));
                }} className="flex-1 bg-zinc-800 py-4 rounded-2xl text-[9px] font-black uppercase text-white">Abortar</button>
                <button type="submit" className="flex-1 bg-orange-500 text-black py-4 rounded-2xl text-[9px] font-black uppercase">Confirmar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasPage;