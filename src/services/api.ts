// API base URL - Unificada para que todo use el mismo origen
const API_BASE_URL = 'http://localhost:3005/api'; 

export interface DashboardData {
  resumen: {
    total_miembros: number;
    miembros_activos: number;
    miembros_inactivos: number;
    total_reservas: number;
    reservas_hoy: number;
    reservas_confirmadas: number;
    total_sedes: number;
    sedes_activas: number;
    maquinas_activas: number;
  };
  miembros_recientes: Array<{
    id: string;
    nombre: string;
    email: string;
    role: string;
    estado_membresia: string;
  }>;
  reservas_recientes: Array<{
    id: string;
    socio_id: string;
    clase_instancia_id: string;
    estado: string;
    fecha_creacion: string;
  }>;
  sedes: Array<any>;
  maquinas: Array<any>;
}

/**
 * Obtener datos del dashboard
 */
export const getDashboardData = async (token?: string): Promise<DashboardData> => {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Obtener miembros (Socios)
 */
export const getMembers = async (token?: string) => {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/admin/miembros`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const updateMemberStatus = async (id: string, estado: string, token?: string) => {
  // 1. Prioridad: Usar el token que llega por parámetro, si no, buscar en LocalStorage
  // 2. Limpieza: Quitamos comillas extras que a veces pone el navegador
  const rawToken = token || localStorage.getItem('token');
  const cleanToken = rawToken ? rawToken.replace(/['"]+/g, '') : '';

  // 🚨 VALIDACIÓN: Si el token es el de "emergencia" o está vacío, avisamos
  if (!cleanToken) {
  throw new Error("Sesión inválida");
}

  const response = await fetch(`http://localhost:3001/api/v1/members/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanToken}` // Aquí enviamos el JWT real
    },
    body: JSON.stringify({ estado })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en la petición');
  }

  return response.json();
};

/**
 * ELIMINAR MIEMBRO
 */
export const deleteMember = async (id: string, token?: string) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(`${API_BASE_URL}/admin/miembros/${id}`, { 
    method: 'DELETE', 
    headers 
  });
  
  if (!response.ok) throw new Error('No se pudo eliminar');
  return await response.json();
};

/**
 * CREAR MIEMBRO
 */
export const createMember = async (memberData: any, token?: string) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(`${API_BASE_URL}/admin/miembros`, {
    method: 'POST',
    headers,
    body: JSON.stringify(memberData),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'No se pudo crear');
  return data.data;
};

// --- MÉTODOS DE STAFF, RESERVAS, SEDES ---

export const getEmployees = async (token?: string) => {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/admin/staff`, { method: 'GET', headers });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
};

export const getReservations = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/reservas`);
  const data = await response.json();
  return data.data;
};
// Agrega esta función a tu archivo api.ts
/**
 * OBTENER MÁQUINAS (Arsenal)
 * Forzamos que siempre devuelva un Array para que el componente pueda filtrar
 */
export const getMachines = async (token?: string) => {
  try {
    const authToken = token || localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/maquinas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) return [];

    const result = await response.json();
    // 🚀 Retornamos directamente el array de datos
    return result.data || result || [];
  } catch (error) {
    console.error('Error fetching machines:', error);
    return [];
  }
};
/**
 * CREAR NUEVA MÁQUINA
 * Aseguramos que el sede_id viaje correctamente
 */
export const createMachine = async (machineData: any, token?: string) => {
  try {
    const authToken = token || localStorage.getItem('token');
    const headers: HeadersInit = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };

    const response = await fetch(`${API_BASE_URL}/admin/maquinas`, {
      method: 'POST',
      headers,
      body: JSON.stringify(machineData), // Aquí viaja el UUID de la sede
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Error al crear');
    return result;
  } catch (error) {
    console.error('❌ Error en createMachine:', error);
    throw error;
  }
};

/**
 * ACTUALIZAR ESTADO DE MÁQUINA (Mantenimiento / Operativo)
 * Ajustado para conectar con: PATCH /api/facility/equipos/:id
 */
export const updateMachineStatus = async (id: string, data: { estado: string }, token?: string) => {
  try {
    const authToken = token || localStorage.getItem('token');
    
    // 🚀 EL CAMBIO: La ruta debe ser /admin/maquinas/ para que el BFF la reconozca
    const response = await fetch(`${API_BASE_URL}/admin/maquinas/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data),
    });

    // Si el servidor responde con HTML, esto captura el error antes de que explote el JSON
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta error servidor:", errorText);
        throw new Error(`Error ${response.status}: No se encontró la ruta en el BFF`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateMachineStatus:', error);
    throw error;
  }
};

/**
 * ELIMINAR MÁQUINA PERMANENTEMENTE
 * Ajustado para conectar con: DELETE /api/facility/equipos/:id
 */
export const deleteMachine = async (id: string, token?: string) => {
  try {
    const authToken = token || localStorage.getItem('token');
    
    // 🚀 Aquí también ajustamos la ruta
    const response = await fetch(`${API_BASE_URL}/equipos/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) throw new Error('No se pudo eliminar la máquina');
    
    return await response.json();
  } catch (error) {
    console.error('Error en deleteMachine:', error);
    throw error;
  }
};

/**
 * OBTENER SEDES (Centros de Poder) - Directo al 3002
 */
export const getSedes = async (token?: string) => {
  try {
    const rawToken = token || localStorage.getItem('token');
    const cleanToken = rawToken ? rawToken.replace(/['"]+/g, '') : '';

    // 🚀 CAMBIO: Apuntamos al puerto real del microservicio
    const response = await fetch('http://localhost:3002/api/facilities/sedes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`
      }
    });

    if (!response.ok) return [];

    const result = await response.json();
    // 💡 IMPORTANTE: Verifica si el microservicio devuelve { data: [...] } o solo el array
    return result.data || result || [];
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }
};

/**
 * CREAR NUEVA SEDE - Directo al 3002
 */
export const createSede = async (sedeData: any, token?: string) => {
  const rawToken = token || localStorage.getItem('token');
  const cleanToken = rawToken ? rawToken.replace(/['"]+/g, '') : '';

  // 🚀 CAMBIO: Apuntamos al puerto real del microservicio
  const response = await fetch('http://localhost:3002/api/facilities/sedes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cleanToken}`
    },
    body: JSON.stringify(sedeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear sede');
  }
  return await response.json();
};
/**
 * ACTUALIZAR ESTADO DE SEDE (ON/OFF) - Directo al 3002
 */
export const updateSedeStatus = async (sedeId: string, estaActiva: boolean, token?: string) => {
  try {
    const rawToken = token || localStorage.getItem('token');
    const cleanToken = rawToken ? rawToken.replace(/['"]+/g, '') : '';

    const response = await fetch(`http://localhost:3002/api/facilities/sedes/${sedeId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`
      },
      // Enviamos el campo exacto que vimos en tu base de datos
      body: JSON.stringify({ esta_activa: estaActiva }), 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar estado');
    }

    return true;
  } catch (error) {
    console.error('Error en updateSedeStatus:', error);
    return false;
  }
};