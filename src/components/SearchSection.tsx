import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, User, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AISearchBar } from './AISearchBar';
import { LeoResponse } from './LeoResponse';
import { DoctorCard } from './DoctorCard';
import { MedicineCarousel } from './MedicineCarousel';
// Importamos Medicine y la función asíncrona
import { Medicine, getMedicinesBySpecialty } from '../data/medicines'; 
import type { Doctor, SearchFilters, AISearchResult } from '../types/doctor';

// --- NUEVAS FUNCIONES DE UTILIDAD ---

// Helper para capitalizar la primera letra
const capitalize = (s: string): string => {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Convierte una fecha ISO (YYYY-MM-DD) a un día de la semana en español (e.g., "lunes")
const dateToSpanishDay = (dateString: string): string | undefined => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return undefined;

    let day = date.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    
    // Aseguramos que 'miércoles' se envíe sin acento si es necesario
    if (day === 'miércoles') {
      day = 'miercoles';
    }

    return day;
    
  } catch (e) {
    console.error("Error converting date to Spanish day:", e);
    return undefined;
  }
};


// --- TIPOS INTERNOS PARA LA METADATA ---
interface Especialidad { id: number; nombre: string; }
interface Clinica { id: number; nombre: string; }
interface Sede { id: number; clinica_id: number; nombre: string; distrito: string; }
interface MetadataResponse {
  especialidades: Especialidad[];
  clinicas: Clinica[];
  sedes: Sede[];
  tipos_atencion: string[];
}

interface SearchSectionProps {
  // SearchFilters ahora incluye los campos snake_case del backend
  onSearch: (filters: SearchFilters, interpretation?: string) => void;
  onAISearch: (result: AISearchResult) => void;
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
  selectedSpecialty: string;
  aiInterpretation: string;
}

export function SearchSection({ onSearch, onAISearch, doctors, onDoctorSelect, selectedSpecialty, aiInterpretation }: SearchSectionProps) {
  // Estados de los inputs manuales
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('none');
  const [clinicName, setClinicName] = useState('none');
  const [branch, setBranch] = useState('none');
  const [availability, setAvailability] = useState('');
  const [attentionType, setAttentionType] = useState('all');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [showManualFilters, setShowManualFilters] = useState(false);

  // Estado para la metadata (opciones de los select)
  const [apiData, setApiData] = useState<MetadataResponse>({
    especialidades: [], clinicas: [], sedes: [], tipos_atencion: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS para el CAROUSEL ---
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  // Este estado rastrea el nombre de la especialidad que se muestra en el carrusel
  const [carouselSpecialtyName, setCarouselSpecialtyName] = useState(selectedSpecialty); 
  // ---------------------------------------

  // 1. CARGAR METADATA AL INICIO
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('http://10.160.29.147:8000/search/metadata/filtros'); 
        if (!response.ok) throw new Error('Error al cargar filtros');
        const data: MetadataResponse = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  // --- MODIFICACIÓN CLAVE: CARGAR MEDICAMENTOS al inicio y con el cambio de especialidad ---
  useEffect(() => {
    // 1. Determinar el ID de la especialidad a usar
    const specialtyObj = apiData.especialidades.find(s => s.nombre === selectedSpecialty);
    let specialtyId: number | undefined = specialtyObj?.id;
    let specialtyNameToUse = selectedSpecialty;

    // LÓGICA PARA CARGA INICIAL (SIN especialidad seleccionada)
    if (selectedSpecialty === '' || selectedSpecialty === 'none') {
        // Al cargar la página, no hay ID de especialidad.
        // specialtyId es undefined, lo que hará que getMedicinesBySpecialty envíe "especialidad_ids": null
        // --- CAMBIO CLAVE AQUÍ: Usamos una cadena vacía en lugar de 'General' ---
        specialtyNameToUse = ''; 
        specialtyId = undefined; 
    }
    
    // 2. Buscar medicamentos 
    // Solo llamamos si la metadata ya cargó (para la inicial 'General') o si la especialidad ha cambiado a una válida.
    if (apiData.especialidades.length > 0 || specialtyId !== undefined || (selectedSpecialty === '' && apiData.especialidades.length > 0)) {
      // getMedicinesBySpecialty(undefined) enviará el payload con "especialidad_ids": null
      getMedicinesBySpecialty(specialtyId) 
        .then(data => setMedicines(data))
        .catch(() => setMedicines([]));
    } else {
        // Caso: Metadata aún cargando.
        setMedicines([]); 
    }

    // 3. Actualizar el nombre de la especialidad para el título del carrusel
    setCarouselSpecialtyName(specialtyNameToUse);

  }, [selectedSpecialty, apiData.especialidades]); // Depende de la especialidad seleccionada y los datos de la API


  // Filtrado inteligente de sedes (Solo muestra sedes de la clínica seleccionada)
  const availableBranches = useMemo(() => {
    if (clinicName === 'none') return apiData.sedes;
    const selectedClinicObj = apiData.clinicas.find(c => c.nombre === clinicName);
    if (!selectedClinicObj) return apiData.sedes;
    return apiData.sedes.filter(sede => sede.clinica_id === selectedClinicObj.id);
  }, [clinicName, apiData.sedes, apiData.clinicas]);

  // Limpiar sede si cambia la clínica
  useEffect(() => { setBranch('none'); }, [clinicName]);

  // 2. PREPARAR Y ENVIAR LA BÚSQUEDA (TRADUCCIÓN A IDs)
  const handleSearch = () => {
    // Buscamos los objetos completos para obtener sus IDs
    const selectedSpecialtyObj = apiData.especialidades.find(s => s.nombre === specialty);
    const selectedClinicObj = apiData.clinicas.find(c => c.nombre === clinicName);
    const selectedBranchObj = apiData.sedes.find(s => s.nombre === branch);

    // CONVERTIMOS LA FECHA A DÍA DE LA SEMANA
    const dayOfWeek = dateToSpanishDay(availability);

    // Construimos el objeto de filtros con los nombres que espera la API (snake_case)
    const filtersForApi: SearchFilters = {
      nombre_doctor: doctorName || undefined,
      especialidad_id: selectedSpecialtyObj?.id, // Mandamos ID
      clinica_id: selectedClinicObj?.id,         // Mandamos ID
      distrito: selectedBranchObj?.distrito,     // Mandamos Distrito
      
      dia: dayOfWeek, // Enviamos el día de la semana
      
      // Capitalizamos el tipo de atención si no es 'all'
      tipo_atencion: attentionType === 'all' ? undefined : capitalize(attentionType),
      
      // Extra: Mandamos el nombre de la especialidad para el carrusel de medicinas
      specialtyName: specialty !== 'none' ? specialty : undefined
    };

    onSearch(filtersForApi);
    setHasSearched(true);
  };

  const handleClearFilters = () => {
    setDoctorName('');
    setSpecialty('none');
    setClinicName('none');
    setBranch('none');
    setAvailability('');
    setAttentionType('all');
    setHasSearched(false);
    onSearch({});
  };

  return (
    <div>
      {/* Barra LEO (Inteligente) */}
      <AISearchBar onSearch={onAISearch} />

      {/* Botón para mostrar/ocultar filtros manuales */}
      <div className="mb-8">
        <Button
          onClick={() => setShowManualFilters(!showManualFilters)}
          variant="outline"
          className={`w-full transition-all duration-300 group ${
            showManualFilters 
              ? 'py-4 bg-white hover:bg-slate-50 text-slate-600 border-slate-300 shadow-sm' 
              : 'py-10 bg-gradient-to-r from-white to-red-50 border-2 border-dashed border-slate-300 text-slate-700 shadow-lg'
          }`}
          size="lg"
        >
          <div className="flex items-center justify-center gap-3">
            {showManualFilters ? (
              <>
                <ChevronUp className="w-4 h-4 group-hover:animate-bounce" />
                <span className="font-medium text-sm">Ocultar filtros tradicionales</span>
              </>
            ) : (
              <>
                 <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full group-hover:bg-red-200 transition-colors">
                    <Search className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-lg block">¿Prefieres usar los filtros?</span>
                    <span className="text-base text-slate-500 block mt-1">Busca por especialidad, clínica, sede y más.</span>
                  </div>
                </div>
                <ChevronDown className="w-6 h-6 text-red-500 ml-auto group-hover:animate-bounce" />
              </>
            )}
          </div>
        </Button>
      </div>

      {/* FORMULARIO DE BÚSQUEDA MANUAL */}
      {showManualFilters && (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12 border-2 border-red-100">
          <div className="text-center mb-8">
            <h2 className="text-slate-900 mb-2">Búsqueda Manual con Filtros</h2>
            <p className="text-slate-600">
              {isLoading ? 'Cargando filtros...' : 'Filtra doctores por especialidad, clínica y más criterios'}
            </p>
          </div>

          {/* FILA 1: Nombre y Especialidad */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-red-500" />
                Nombre del doctor
              </label>
              <Input
                placeholder="Ej: Dr. Carlos Mendoza"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700 flex items-center gap-2">
                <Search className="w-4 h-4 text-red-500" />
                Especialidad
              </label>
              <Select value={specialty} onValueChange={setSpecialty} disabled={isLoading}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas las especialidades</SelectItem>
                  {apiData.especialidades.map(spec => (
                    <SelectItem key={spec.id} value={spec.nombre}>{spec.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* FILA 2: Clínica, Ubicación, Tipo, Fecha */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Clínica
              </label>
              <Select value={clinicName} onValueChange={setClinicName} disabled={isLoading}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecciona una clínica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas las clínicas</SelectItem>
                  {apiData.clinicas.map(clinic => (
                    <SelectItem key={clinic.id} value={clinic.nombre}>{clinic.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Ubicación
              </label>
              <Select value={branch} onValueChange={setBranch} disabled={isLoading}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecciona una ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas las ubicaciones</SelectItem>
                  {availableBranches.map(sede => (
                    <SelectItem key={sede.id} value={sede.nombre}>
                      {sede.nombre} {clinicName === 'none' ? `(${apiData.clinicas.find(c => c.id === sede.clinica_id)?.nombre})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-red-500" />
                Tipo de atención
              </label>
              <Select value={attentionType} onValueChange={setAttentionType} disabled={isLoading}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {apiData.tipos_atencion.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500" />
                Fecha de cita
              </label>
              <Input
                type="date"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="bg-slate-50 border-slate-200 w-full cursor-pointer"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar doctores
            </Button>
            {hasSearched && (
              <Button 
                onClick={handleClearFilters}
                variant="outline"
                size="lg"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      )}

      {/* RESTO DEL COMPONENTE (Resultados, etc.) */}
      {aiInterpretation && <LeoResponse interpretation={aiInterpretation} />}
      
      {hasSearched && (
        <div className="mb-16">
          <div className="mb-6">
            <h3 className="text-slate-900 mb-2">Resultados de la búsqueda</h3>
            <p className="text-slate-600">
              {doctors.length === 0 
                ? 'No se encontraron doctores con los filtros seleccionados'
                : `Se encontraron ${doctors.length} ${doctors.length === 1 ? 'doctor' : 'doctores'}`
              }
            </p>
          </div>

          {doctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(doctor => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor}
                  onClick={() => onDoctorSelect(doctor)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          )}
        </div>
      )}

      {/* CAMBIO AQUÍ: Usamos el estado 'carouselSpecialtyName' para el título */}
      <MedicineCarousel medicines={medicines} specialty={carouselSpecialtyName} />
    </div>
  );
}