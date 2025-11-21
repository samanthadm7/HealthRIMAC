// src/types/doctor.ts

// ==========================================
// 1. INTERFAZ DE RESPUESTA DEL API (RAW DATA)
// ==========================================
// Esta interfaz define exactamente cómo viene el JSON desde Python.
export interface ApiDoctorRow {
  medico_id: number;
  nombre_doctor: string;
  cmp_numero: string;
  validado_cmp: boolean;
  url_imagen: string;
  calificacion: number;
  
  especialidad_id: number;
  nombre_especialidad: string;
  
  clinica_id: number;
  nombre_clinica: string;
  url_logo: string;
  
  sede_id: number;
  nombre_sede: string;
  distrito: string;
  
  dia: string;        // Ej: "Lunes"
  hora_inicio: string; // Ej: "08:00:00"
  hora_fin: string;    // Ej: "12:00:00"
  tipo_atencion: string; // Ej: "Presencial"
}

// ==========================================
// 2. INTERFACES DEL FRONTEND (UI)
// ==========================================

export interface DoctorSource {
  clinic: string;
  url: string;
  lastUpdated: string;
}

export interface DoctorCertification {
  institution: string;
  degree: string;
  year: number;
}

// Actualizamos esta interfaz para tener más datos de la sede
export interface ClinicLocation {
  id: number;          // Nuevo: ID de la clínica
  clinicName: string;
  branch: string;
  district: string;    // Nuevo: Distrito
  address: string;     // (Calculado o placeholder si el API no lo manda)
  phone?: string;
  availableSlots?: number;
  attentionType: string; // 'presencial' | 'virtual' | 'ambos' (string flexible para recibir del api)
  logoUrl?: string;    // Nuevo: Logo de la clínica
  nextAvailable?: string; // Nuevo: Texto calculado (ej: "Lunes 08:00")
  price?: number;      // Nuevo: Precio (placeholder)
}

export interface Doctor {
  id: number; // CAMBIO IMPORTANTE: El ID ahora es number (viene del backend)
  name: string;
  specialty: string;
  photo: string;
  
  // Información del Colegio Médico del Perú
  cmp: string;
  rne?: string;
  verified: boolean;
  rating?: number; // Nuevo
  
  // Información profesional
  // Los ponemos opcionales o el mapper debe enviar arrays vacíos
  education: DoctorCertification[]; 
  languages: string[];
  
  // Información de clínicas (Agrupadas)
  clinics: ClinicLocation[];
  
  // Disponibilidad y horarios
  availability: 'available' | 'limited' | 'unavailable' | string; // Flexible para texto
  schedules: string[];
  
  // Información adicional
  bio: string;
  specializations: string[];
  
  // Fuentes
  sources: DoctorSource[];
  
  // Campos legacy (opcionales para no romper componentes viejos)
  clinic?: string;
  address?: string;
}

// ==========================================
// 3. FILTROS DE BÚSQUEDA
// ==========================================

export interface SearchFilters {
  // Campos visuales del Frontend (CamelCase) - Para mostrar en la UI
  specialtyName?: string;
  doctorName?: string;
  
  // Campos para el Backend (SnakeCase + IDs) - Para la petición HTTP
  doctor_nombre?: string;
  especialidad_id?: number;
  clinica_id?: number;
  sede_id?: number;
  fecha?: string;
  tipo_atencion?: string; // 'presencial' | 'virtual' | 'ambos' | 'all'

  // Mantenemos estos por compatibilidad con tu lógica de filtrado local antigua si la usas
  specialty?: string; 
  clinicName?: string;
  branch?: string;
  availability: string;
  attentionType?: string; 
}

export interface AISearchResult {
  filters: SearchFilters;
  interpretation: string;
  userQuery: string;
}