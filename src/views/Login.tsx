import React, { useState } from 'react';
import { Zap, ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, Star, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token); // ✅ JWT real
        toast.success('IDENTIDAD CONFIRMADA', {
          description: 'Sincronizando con el Centro de Mando...',
          icon: <ShieldCheck className="text-green-500" />,
        });
        window.location.replace('/dashboard');
      } else {
        setIsAuthenticating(false);
        toast.error('ACCESO DENEGADO', {
          description: 'Credenciales inválidas. Revisa el correo y la clave.',
          icon: <AlertTriangle className="text-red-500" />,
          style: { background: '#000', color: '#fff', border: '1px solid #ef4444' }
        });
      }
    } catch (err) {
      setIsAuthenticating(false);
      toast.error('ERROR DE CONEXIÓN', {
        description: 'No se pudo conectar con el servidor.',
        icon: <AlertTriangle className="text-red-500" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">
      
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-pink-600/10 blur-[150px] rounded-full animate-pulse"></div>

      <div className="relative w-full max-w-lg bg-white/[0.01] border-2 border-white/5 backdrop-blur-3xl p-12 rounded-[50px] shadow-2xl overflow-hidden group">
        
        <div className="flex flex-col items-center mb-12 relative z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-white rounded-[30px] flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)] group-hover:rotate-[360deg] transition-transform duration-1000">
              <Zap size={45} className="text-black fill-black" />
            </div>
            <div className="absolute -top-3 -right-3 bg-yellow-500 p-2 rounded-full border-4 border-[#050505]">
               <Star size={16} className="text-black fill-black" />
            </div>
          </div>
          
          <h1 className="text-5xl font-black italic tracking-tighter text-white text-center leading-none uppercase">
            URBAN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">GYM</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mt-4 italic">Cereté Elite Division</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8 relative z-10">
          
          <div className="relative">
            <label className="absolute -top-2.5 left-7 px-2 bg-[#080808] text-[10px] font-black text-purple-400 uppercase tracking-widest z-10 italic">Core User</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-6 text-gray-600" size={20} />
              <input 
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="richard@urbangym.com"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-base text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-800 font-medium"
                style={{ textTransform: 'none' }}
              />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2.5 left-7 px-2 bg-[#080808] text-[10px] font-black text-purple-400 uppercase tracking-widest z-10 italic">Security Key</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-6 text-gray-600" size={20} />
              <input 
                type={showPassword ? "text" : "password"} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-14 text-base text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-800 font-medium"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 text-gray-600 hover:text-white">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" disabled={isAuthenticating}
            className="w-full relative overflow-hidden group bg-white py-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-2xl disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 text-black group-hover:text-white font-black uppercase italic tracking-[0.2em] text-xs flex items-center justify-center gap-3">
              {isAuthenticating ? <Loader2 className="animate-spin" size={20} /> : "Iniciar Secuencia"}
            </span>
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">Urban Gym Protocol © 2026</p>
        </div>
      </div>
    </div>
  );
};