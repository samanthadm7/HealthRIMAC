import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, Calendar, User, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AISearchBar } from './AISearchBar';
import { LeoResponse } from './LeoResponse';
import { DoctorCard } from './DoctorCard';
import { MedicineCarousel } from './MedicineCarousel';
import { Medicine } from '../data/medicines'; 
import type { Doctor, SearchFilters, AISearchResult } from '../types/doctor';

// --- FUNCIONES DE UTILIDAD ---
const capitalize = (s: string): string => {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const dateToSpanishDay = (dateString: string): string | undefined => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return undefined;
    let day = date.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    if (day === 'miércoles') day = 'miercoles';
    return day;
  } catch (e) {
    console.error("Error converting date to Spanish day:", e);
    return undefined;
  }
};

// --- INTERFACES DE METADATA ---
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
  onSearch: (filters: SearchFilters, interpretation?: string) => void;
  onAISearch: (result: AISearchResult) => void;
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
  selectedSpecialty: string;
  aiInterpretation: string;
  aiMedicines?: Medicine[]; 
}

export function SearchSection({ 
  onSearch, 
  onAISearch, 
  doctors, 
  onDoctorSelect, 
  selectedSpecialty, 
  aiInterpretation,
  aiMedicines = [] 
}: SearchSectionProps) {
  // --- ESTADOS DE FILTROS MANUALES ---
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('none');
  const [clinicName, setClinicName] = useState('none');
  const [branch, setBranch] = useState('none');
  const [availability, setAvailability] = useState('');
  const [attentionType, setAttentionType] = useState('all');
  
  // Estados de UI
  const [hasSearched, setHasSearched] = useState(false);
  const [showManualFilters, setShowManualFilters] = useState(false);

  // Estado de Datos API (Metadata)
  const [apiData, setApiData] = useState<MetadataResponse>({
    especialidades: [], clinicas: [], sedes: [], tipos_atencion: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Estados para Medicamentos
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [carouselSpecialtyName, setCarouselSpecialtyName] = useState(selectedSpecialty); 

  const scrollAnchorRef = useRef<HTMLDivElement>(null);

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

// 2. CARGAR MEDICAMENTOS (Lógica Actualizada con URL Correcta)
  useEffect(() => {
    // CASO A: Prioridad a los medicamentos de IA si existen
    if (aiMedicines && aiMedicines.length > 0) {
      console.log('💊 [SearchSection] Usando medicamentos de IA:', aiMedicines.length); // DEBUG 1
      setMedicines(aiMedicines);
      setCarouselSpecialtyName(selectedSpecialty || 'Recomendaciones de Leo');
      return; 
    }

    // CASO B: Carga desde API Backend
    const fetchMedicinesFromApi = async () => {
        let specialtyNameForLog = selectedSpecialty || 'Todas (null)'; // DEBUG 2

        try {
            const specialtyObj = apiData.especialidades.find(s => s.nombre === selectedSpecialty);
            const specialtyId = specialtyObj ? specialtyObj.id : null;
            
            const payload = {
                especialidad_ids: specialtyId 
            };

            console.log(`💊 [SearchSection] Solicitando medicamentos para: ${specialtyNameForLog} (ID: ${specialtyId})`); // DEBUG 3

            const response = await fetch('http://10.160.29.147:8000/search/busqueda_medicamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                 // DEBUG 4: Si la respuesta no es OK (ej: 500 Internal Server Error)
                throw new Error(`Error ${response.status} al cargar medicamentos`);
            }

            const result = await response.json();
            console.log('💊 [SearchSection] Respuesta Cruda del API:', result); // DEBUG 5: Verifica el formato

            if (Array.isArray(result) && result.length > 0) {
                const mappedMedicines = result.map((m: any) => ({
                    id: m.medicamento_id,
                    name: m.nombre,
                    description: m.presentacion || 'Sin presentación', 
                    price: typeof m.precio_base === 'number' ? m.precio_base : 0,
                    image: m.url_imagen || 'https://placehold.co/300x300/eef2f6/333333?text=Medicamento', 
                    brand: 'Generico',
                    category: 'Farmacia',
                    requiresPrescription: false
                }));
                console.log(`💊 [SearchSection] Medicamentos mapeados con éxito: ${mappedMedicines.length}`); // DEBUG 6
                setMedicines(mappedMedicines);
            } else {
                console.log('💊 [SearchSection] API devolvió un array vacío o no array.'); // DEBUG 7
                setMedicines([]);
            }

        } catch (error) {
            console.error("💊 [SearchSection] Error crítico en la carga:", error); // DEBUG 8
            setMedicines([]);
        }
    };

    // Solo ejecuta la búsqueda si ya cargamos la metadata
    if (apiData.especialidades.length > 0 || (selectedSpecialty === '' && apiData.especialidades.length === 0)) {
      fetchMedicinesFromApi();
    } else {
       console.log('💊 [SearchSection] Esperando a que cargue la metadata de especialidades...');
    }
    
    setCarouselSpecialtyName(selectedSpecialty);

  }, [selectedSpecialty, apiData.especialidades, aiMedicines]);

  // 3. MANEJO DE SCROLL AUTOMÁTICO
  useEffect(() => {
    if (aiInterpretation) {
      setHasSearched(true);
      setTimeout(() => {
        if (scrollAnchorRef.current) {
          scrollAnchorRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start', 
          });
        }
      }, 300);
    }
  }, [aiInterpretation]);

  // 4. FILTRADO INTELIGENTE DE SEDES
  const availableBranches = useMemo(() => {
    if (clinicName === 'none') return apiData.sedes;
    const selectedClinicObj = apiData.clinicas.find(c => c.nombre === clinicName);
    if (!selectedClinicObj) return apiData.sedes;
    return apiData.sedes.filter(sede => sede.clinica_id === selectedClinicObj.id);
  }, [clinicName, apiData.sedes, apiData.clinicas]);

  useEffect(() => { setBranch('none'); }, [clinicName]);

  // 5. EJECUTAR BÚSQUEDA MANUAL
  const handleSearch = () => {
    const selectedSpecialtyObj = apiData.especialidades.find(s => s.nombre === specialty);
    const selectedClinicObj = apiData.clinicas.find(c => c.nombre === clinicName);
    const selectedBranchObj = apiData.sedes.find(s => s.nombre === branch);
    const dayOfWeek = dateToSpanishDay(availability);

    const filtersForApi: SearchFilters = {
      nombre_doctor: doctorName || undefined,
      especialidad_id: selectedSpecialtyObj?.id,
      clinica_id: selectedClinicObj?.id,
      distrito: selectedBranchObj?.distrito,
      dia: dayOfWeek,
      tipo_atencion: attentionType === 'all' ? undefined : capitalize(attentionType),
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
      {/* BARRA DE BÚSQUEDA IA (LEO) */}
      <AISearchBar onSearch={onAISearch} />

      {/* BOTÓN TOGGLE PARA FILTROS MANUALES */}
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

      {/* FORMULARIO DE FILTROS MANUALES */}
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

      {/* ANCLA DE SCROLL INVISIBLE */}
      <div ref={scrollAnchorRef} className="scroll-mt-32 w-full h-1"></div>

      {/* RESPUESTA DE LEO */}
      {aiInterpretation && <LeoResponse interpretation={aiInterpretation} />}
      
      {/* RESULTADOS DE BÚSQUEDA */}
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

      {/* CARRUSEL DE MEDICINAS */}
      <MedicineCarousel medicines={medicines} specialty={carouselSpecialtyName} />
    </div>
  );
}