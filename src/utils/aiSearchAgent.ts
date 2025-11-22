import type { AISearchResult } from '../types/doctor';

// Mapeo de síntomas a especialidades
const symptomToSpecialty: Record<string, { specialty: string; message: string }> = {
  'dolor de cabeza': { 
    specialty: 'Neurología', 
    message: 'especialistas que pueden ayudarte con tu dolor de cabeza' 
  },
  'migraña': { 
    specialty: 'Neurología', 
    message: 'neurólogos especializados en migrañas' 
  },
  'dolor de espalda': { 
    specialty: 'Traumatología', 
    message: 'traumatólogos que pueden tratar tu dolor de espalda' 
  },
  'lesión deportiva': { 
    specialty: 'Traumatología', 
    message: 'traumatólogos especializados en lesiones deportivas' 
  },
  'dolor de rodilla': { 
    specialty: 'Traumatología', 
    message: 'traumatólogos para evaluar tu rodilla' 
  },
  'dolor de corazón': { 
    specialty: 'Cardiología', 
    message: 'cardiólogos para revisar tu salud cardíaca' 
  },
  'palpitaciones': { 
    specialty: 'Cardiología', 
    message: 'cardiólogos que pueden evaluar tus palpitaciones' 
  },
  'problemas de piel': { 
    specialty: 'Dermatología', 
    message: 'dermatólogos para tratar tus problemas de piel' 
  },
  'acné': { 
    specialty: 'Dermatología', 
    message: 'dermatólogos especializados en tratamiento de acné' 
  },
  'manchas en la piel': { 
    specialty: 'Dermatología', 
    message: 'dermatólogos para evaluar las manchas en tu piel' 
  },
  'embarazo': { 
    specialty: 'Ginecología', 
    message: 'ginecólogos para el cuidado de tu embarazo' 
  },
  'problemas menstruales': { 
    specialty: 'Ginecología', 
    message: 'ginecólogos para evaluar tus problemas menstruales' 
  },
  'control infantil': { 
    specialty: 'Pediatría', 
    message: 'pediatras para el control de tu hijo/a' 
  },
  'vacunas niños': { 
    specialty: 'Pediatría', 
    message: 'pediatras para las vacunas de tu hijo/a' 
  },
  'fiebre niño': { 
    specialty: 'Pediatría', 
    message: 'pediatras para evaluar la fiebre de tu hijo/a' 
  },
  'problemas digestivos': { 
    specialty: 'Gastroenterología', 
    message: 'gastroenterólogos para tratar tus problemas digestivos' 
  },
  'dolor de estómago': { 
    specialty: 'Gastroenterología', 
    message: 'gastroenterólogos para evaluar tu dolor de estómago' 
  },
  'problemas de visión': { 
    specialty: 'Oftalmología', 
    message: 'oftalmólogos para revisar tu visión' 
  },
  'vista borrosa': { 
    specialty: 'Oftalmología', 
    message: 'oftalmólogos para evaluar tu vista borrosa' 
  },
  'lentes': { 
    specialty: 'Oftalmología', 
    message: 'oftalmólogos para evaluación de lentes' 
  },
};

// Normalizar texto para búsqueda
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .trim();
}

// Detectar síntomas en el texto
function detectSymptom(query: string): { specialty: string; message: string } | null {
  const normalized = normalizeText(query);
  
  for (const [symptom, result] of Object.entries(symptomToSpecialty)) {
    if (normalized.includes(normalizeText(symptom))) {
      return result;
    }
  }
  
  return null;
}

// Detectar disponibilidad temporal
function detectAvailability(query: string): { availability: string; message: string } | null {
  const normalized = normalizeText(query);
  
  if (normalized.includes('hoy') || normalized.includes('ahora') || normalized.includes('urgente')) {
    return { availability: 'today', message: 'disponibles para hoy' };
  }
  
  if (normalized.includes('mañana') || normalized.includes('manana')) {
    return { availability: 'tomorrow', message: 'disponibles para mañana' };
  }
  
  if (normalized.includes('esta semana') || normalized.includes('semana')) {
    return { availability: 'week', message: 'disponibles esta semana' };
  }
  
  return null;
}

// Detectar tipo de atención
function detectAttentionType(query: string): 'Presencial' | 'Virtual' | 'ambos' | null { // Actualiza el tipo de retorno si usas TypeScript estricto
  const normalized = normalizeText(query);
  
  if (normalized.includes('virtual') || normalized.includes('online') || normalized.includes('videollamada') || normalized.includes('teleconsulta')) {
    return 'Virtual'; // CAMBIO AQUÍ: De 'virtual' a 'Virtual'
  }
  
  if (normalized.includes('presencial') || normalized.includes('en persona') || normalized.includes('consultorio')) {
    return 'Presencial'; // CAMBIO AQUÍ: De 'presencial' a 'Presencial'
  }
  
  return null;
}

// Detectar ubicación
function detectLocation(query: string): string | null {
  const normalized = normalizeText(query);
  
  const locations = [
    'san isidro', 'miraflores', 'surco', 'la molina', 'surquillo',
    'jesus maria', 'lince', 'magdalena', 'pueblo libre', 'san miguel',
    'callao', 'los olivos', 'san juan de lurigancho', 'ate'
  ];
  
  for (const location of locations) {
    if (normalized.includes(location)) {
      return location;
    }
  }
  
  return null;
}

// Detectar especialidad directamente mencionada
function detectSpecialty(query: string): string | null {
  const normalized = normalizeText(query);
  
  const specialties: Record<string, string> = {
    'cardiologo': 'Cardiología',
    'cardiologia': 'Cardiología',
    'pediatra': 'Pediatría',
    'pediatria': 'Pediatría',
    'dermatologo': 'Dermatología',
    'dermatologia': 'Dermatología',
    'ginecologo': 'Ginecología',
    'ginecologia': 'Ginecología',
    'traumatologo': 'Traumatología',
    'traumatologia': 'Traumatología',
    'oftalmologo': 'Oftalmología',
    'oftalmologia': 'Oftalmología',
    'gastroenterologo': 'Gastroenterología',
    'gastroenterologia': 'Gastroenterología',
    'neurologo': 'Neurología',
    'neurologia': 'Neurología',
  };
  
  for (const [key, specialty] of Object.entries(specialties)) {
    if (normalized.includes(key)) {
      return specialty;
    }
  }
  
  return null;
}

// Función principal del agente de IA
export function interpretSearch(userQuery: string): AISearchResult {
  const normalized = normalizeText(userQuery);
  
  // Detectar diferentes aspectos de la búsqueda
  const symptomResult = detectSymptom(normalized);
  const availabilityResult = detectAvailability(normalized);
  const attentionType = detectAttentionType(normalized);
  const location = detectLocation(normalized);
  const directSpecialty = detectSpecialty(normalized);
  
  // Construir filtros
  let specialty = '';
  let interpretationParts: string[] = [];
  
  // Prioridad: especialidad directa > síntoma detectado
  if (directSpecialty) {
    specialty = directSpecialty;
    interpretationParts.push(directSpecialty.toLowerCase() + 's');
  } else if (symptomResult) {
    specialty = symptomResult.specialty;
    interpretationParts.push(symptomResult.message);
  }
  
  // Agregar disponibilidad a la interpretación
  if (availabilityResult) {
    interpretationParts.push(availabilityResult.message);
  }
  
  // Agregar tipo de atención
  if (attentionType) {
    if (attentionType === 'virtual') {
      interpretationParts.push('con atención virtual');
    } else if (attentionType === 'presencial') {
      interpretationParts.push('con atención presencial');
    }
  }
  
  // Agregar ubicación
  if (location) {
    interpretationParts.push('en ' + location.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  }
  
  // Generar mensaje de interpretación
  let interpretation = '';
  if (interpretationParts.length > 0) {
    interpretation = 'Esta es la lista de ' + interpretationParts.join(' ');
  } else {
    interpretation = 'Mostrando todos los doctores disponibles';
  }
  
  return {
    filters: {
      specialty,
      location: location || '',
      availability: availabilityResult?.availability || 'all',
      attentionType: attentionType || 'all',
    },
    interpretation,
    userQuery,
  };
}
