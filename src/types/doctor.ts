// src/types/doctor.ts

// ==========================================
// 1. INTERFAZ DE RESPUESTA DEL API (RAW DATA)
// ==========================================
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

// Nueva interfaz para la respuesta completa del Endpoint Semántico
export interface SemanticApiResponse {
  tipo: string;
  especialidades: string[];
  filtros_busqueda: any;
  data: ApiDoctorRow[]; // Aquí viene el array de doctores
  medicamentos: any[];
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

export interface ClinicLocation {
  id: number;          
  clinicName: string;
  branch: string;
  district: string;    
  address: string;     
  phone?: string;
  availableSlots?: number;
  attentionType: string; 
  logoUrl?: string;    
  nextAvailable?: string; 
  price?: number;      
}

export interface Doctor {
  id: number; 
  name: string;
  specialty: string;
  photo: string;
  
  // Información del Colegio Médico
  cmp: string;
  rne?: string;
  verified: boolean;
  rating: number; 
  reviews: number;       // Agregado: Cantidad de reseñas (mock)
  yearsExperience: number; // Agregado: Años de experiencia (mock)
  
  // Información profesional
  education: DoctorCertification[]; 
  languages: string[];
  
  // Información de clínicas
  clinics: ClinicLocation[];
  
  // Disponibilidad
  availability: 'available' | 'limited' | 'unavailable' | string; 
  schedules: string[];
  
  // Bio y detalles
  bio: string;
  specializations: string[];
  sources: DoctorSource[];
  description?: string; // Campo opcional por compatibilidad
  price?: number;       // Campo opcional por compatibilidad
  
  // Campos legacy
  clinic?: string;
  address?: string;
}

// ==========================================
// 3. FILTROS DE BÚSQUEDA
// ==========================================

export interface SearchFilters {
  specialtyName?: string;
  doctorName?: string;
  
  doctor_nombre?: string;
  especialidad_id?: number;
  clinica_id?: number;
  sede_id?: number;
  fecha?: string;
  tipo_atencion?: string;

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