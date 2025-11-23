import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, Calendar, User, Monitor, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AISearchBar } from './AISearchBar';
import { LeoResponse } from './LeoResponse';
import { DoctorCard } from './DoctorCard';
import { MedicineCarousel } from './MedicineCarousel';
import { Medicine, getMedicinesBySpecialty } from '../data/medicines'; 
import type { Doctor, SearchFilters, AISearchResult } from '../types/doctor';

// ... (Funciones de utilidad se mantienen IGUAL)
const capitalize = (s: string): string => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const dateToSpanishDay = (dateString: string): string | undefined => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return undefined;
    let day = date.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    if (day === 'miércoles') day = 'miercoles';
    return day;
  } catch (e) {
    return undefined;
  }
};

// Función para limpiar texto: quita tildes, pasa a minúsculas y quita espacios extra
const normalizeText = (text: string | undefined | null) => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quita tildes
    .toLowerCase()
    .trim();
};

// ... (Interfaces se mantienen IGUAL)
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
  
  // --- ESTADOS ---
  const [doctorName, setDoctorName] = useState('');
  
  // LÓGICA AUTOCOMPLETE
  const [specialty, setSpecialty] = useState('none');
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [showSpecialtySuggestions, setShowSpecialtySuggestions] = useState(false);
  const specialtyWrapperRef = useRef<HTMLDivElement>(null);

  const [clinicName, setClinicName] = useState('none');
  const [branch, setBranch] = useState('none'); 
  const [availability, setAvailability] = useState('');
  const [attentionType, setAttentionType] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  
  // NUEVO: Referencia para guardar los resultados ORIGINALES de la IA
  // Esto nos permite filtrar sobre ellos sin perderlos.
  const originalAiDoctorsRef = useRef<Doctor[]>([]);
  const lastAiInterpretationRef = useRef<string>('');

  const [apiData, setApiData] = useState<MetadataResponse>({
    especialidades: [], clinicas: [], sedes: [], tipos_atencion: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [carouselSpecialtyName, setCarouselSpecialtyName] = useState(selectedSpecialty); 
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  // 1. CARGAR METADATA (Sin cambios)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('https://motor-busqueda-rfcjnvenka-uk.a.run.app/search/metadata/filtros'); 
        if (!response.ok) throw new Error('Error al cargar filtros');
        const data: MetadataResponse = await response.json();
        setApiData({
            especialidades: data.especialidades || [],
            clinicas: data.clinicas || [],
            sedes: data.sedes || [],
            tipos_atencion: data.tipos_atencion || []
        });
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  // 2. CARGAR MEDICAMENTOS (Sin cambios)
  useEffect(() => {
    if (aiMedicines && aiMedicines.length > 0) {
      setMedicines(aiMedicines);
      setCarouselSpecialtyName(selectedSpecialty || 'Recomendaciones de Leo');
      return; 
    }
    const fetchMedicines = async () => {
        try {
            const specialtyObj = apiData.especialidades?.find(s => s.nombre === selectedSpecialty);
            const specialtyId = specialtyObj?.id; 
            const newMedicines = await getMedicinesBySpecialty(specialtyId);
            setMedicines(newMedicines);
        } catch (error) {
            console.error("Error fetching medicines from API:", error);
            setMedicines([]);
        }
    };
    if ((apiData.especialidades?.length > 0) || (selectedSpecialty === '' && (!apiData.especialidades || apiData.especialidades.length === 0))) {
      fetchMedicines();
    }
    setCarouselSpecialtyName(selectedSpecialty);
  }, [selectedSpecialty, apiData.especialidades, aiMedicines]); 

  // 3. SCROLL AUTOMÁTICO (Sin cambios)
  useEffect(() => {
    if (aiInterpretation) {
      setHasSearched(true);
      setTimeout(() => {
        if (scrollAnchorRef.current) scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [aiInterpretation]);

  // NUEVO: CAPTURAR RESULTADOS IA
  // Cada vez que cambia la interpretación (nueva búsqueda IA) y tenemos doctores, 
  // actualizamos nuestro "backup" para filtrar sobre él.
  useEffect(() => {
    if (aiInterpretation && aiInterpretation !== lastAiInterpretationRef.current) {
        if (doctors.length > 0) {
            originalAiDoctorsRef.current = doctors;
            lastAiInterpretationRef.current = aiInterpretation;
        }
    } else if (!aiInterpretation) {
        // Si se limpia la IA, limpiamos el backup
        originalAiDoctorsRef.current = [];
        lastAiInterpretationRef.current = '';
    }
  }, [aiInterpretation, doctors]);


  // LÓGICA AUTOCOMPLETE CLICK OUTSIDE (Sin cambios)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (specialtyWrapperRef.current && !specialtyWrapperRef.current.contains(event.target as Node)) {
        setShowSpecialtySuggestions(false);
        if (specialty === 'none' && specialtySearch !== '') {
           setSpecialtySearch('');
        } else if (specialty !== 'none') {
           setSpecialtySearch(specialty);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [specialty, specialtySearch]);


  // 4. LÓGICA DE FILTRADO (Distritos/Clinicas - Sin cambios)
  const availableDistricts = useMemo(() => {
    if (!apiData.sedes || apiData.sedes.length === 0) return [];
    let filteredSedes = apiData.sedes;
    if (clinicName !== 'none') {
      const selectedClinicObj = apiData.clinicas.find(c => c.nombre === clinicName);
      if (selectedClinicObj) {
        filteredSedes = filteredSedes.filter(sede => sede.clinica_id === selectedClinicObj.id);
      }
    }
    const districts = filteredSedes.map(s => s.distrito).filter(Boolean);
    return Array.from(new Set(districts)).sort();
  }, [clinicName, apiData.sedes, apiData.clinicas]);

  const availableClinics = useMemo(() => {
    if (!apiData.clinicas) return [];
    if (branch === 'none') return apiData.clinicas;
    const sedesInDistrict = apiData.sedes.filter(s => s.distrito === branch);
    const validClinicIds = new Set(sedesInDistrict.map(s => s.clinica_id));
    return apiData.clinicas.filter(c => validClinicIds.has(c.id));
  }, [branch, apiData.sedes, apiData.clinicas]);

  useEffect(() => { 
    setBranch('none'); 
  }, [clinicName]);

  const filteredSpecialties = useMemo(() => {
    if (!specialtySearch) return apiData.especialidades || [];
    return apiData.especialidades?.filter(s => 
      s.nombre.toLowerCase().includes(specialtySearch.toLowerCase())
    ) || [];
  }, [specialtySearch, apiData.especialidades]);


// 5. EJECUTAR BÚSQUEDA (CORREGIDO CON ESTRUCTURA REAL)
  const handleSearch = () => {
    const selectedSpecialtyObj = apiData.especialidades?.find(s => s.nombre === specialty);
    const selectedClinicObj = apiData.clinicas?.find(c => c.nombre === clinicName);
    const selectedDistrict = branch !== 'none' ? branch : undefined;
    const dayOfWeek = dateToSpanishDay(availability);

    // --- MODO FILTRADO LOCAL (SOBRE RESULTADOS IA) ---
    if (aiInterpretation && originalAiDoctorsRef.current.length > 0) {
        
        console.log("--- FILTRANDO ---");
        
        const filteredDoctors = originalAiDoctorsRef.current.filter(d => {
            // 1. Filtro por Nombre
            // Tu objeto tiene 'name' con el nombre completo
            if (doctorName) {
                const search = normalizeText(doctorName);
                const docFullName = normalizeText(d.name || ''); 
                if (!docFullName.includes(search)) return false;
            }

            // 2. Filtro por Especialidad
            // Tu objeto usa 'specialty' (singular) o 'specializations' (array)
            if (specialty !== 'none') {
                const filterSpec = normalizeText(specialty);
                const docSpec = normalizeText(d.specialty || '');
                // Opcional: si a veces viene vacío, buscar también en d.specializations
                // const docSpecsArray = d.specializations?.map(s => normalizeText(s.name || '')).join(' ') || '';
                
                if (!docSpec.includes(filterSpec)) return false;
            }

            // 3. Filtro por Clínica
            // Tu objeto usa el array 'clinics' y dentro 'clinicName'
            if (clinicName !== 'none') {
                const filterClinic = normalizeText(clinicName);
                
                // Opción A: Buscar en la propiedad top-level 'clinic' (ej: "San Felipe")
                const topLevelMatch = normalizeText(d.clinic || '').includes(filterClinic);
                
                // Opción B: Buscar dentro del array 'clinics' -> 'clinicName'
                const arrayMatch = d.clinics?.some(c => 
                    normalizeText(c.clinicName || '').includes(filterClinic)
                );

                if (!topLevelMatch && !arrayMatch) return false;
            }

            // 4. Filtro por Ubicación (Distrito)
            // Tu objeto usa 'clinics' -> 'district'
            if (branch !== 'none') {
                 const filterDistrict = normalizeText(branch);
                 
                 const hasDistrict = d.clinics?.some(c => 
                    normalizeText(c.district || '').includes(filterDistrict)
                 );
                 
                 if (!hasDistrict) return false;
            }

            // 5. Filtro por Tipo de Atención
            // Nota: En tu imagen no veo 'tipo_atencion', asumo que podría ser 'availability' o similar,
            // pero si mantienes la lógica anterior, asegúrate que la propiedad exista.
            if (attentionType !== 'all') {
                 const filterType = normalizeText(attentionType);
                 // Verifica si tu objeto tiene 'attentionType' o 'mode'. 
                 // Si no existe en el objeto de la foto, esto siempre devolverá false si se usa.
                 const docType = normalizeText(d.tipo_atencion || d.attentionType || ''); 
                 if (!docType.includes(filterType)) return false;
            }

            return true;
        });

        console.log("Doctores encontrados:", filteredDoctors.length);

        onAISearch({
            analysis: aiInterpretation,
            doctors: filteredDoctors,
            medicines: aiMedicines
        });

    } else {
        // --- MODO BÚSQUEDA NORMAL (BACKEND) ---
        const filtersForApi: SearchFilters = {
            nombre_doctor: doctorName || undefined,
            especialidad_id: selectedSpecialtyObj?.id,
            clinica_id: selectedClinicObj?.id,
            distrito: selectedDistrict,
            dia: dayOfWeek,
            tipo_atencion: attentionType === 'all' ? undefined : capitalize(attentionType),
            specialtyName: specialty !== 'none' ? specialty : undefined
        };
        onSearch(filtersForApi);
    }
    
    setHasSearched(true);
  };

  const handleClearFilters = () => {
    setDoctorName('');
    setSpecialty('none');
    setSpecialtySearch('');
    setClinicName('none');
    setBranch('none');
    setAvailability('');
    setAttentionType('all');
    setHasSearched(false);
    
    // Si estamos en modo IA, "Limpiar" significa volver a mostrar TODOS los resultados originales de la IA
    if (aiInterpretation && originalAiDoctorsRef.current.length > 0) {
        onAISearch({
            analysis: aiInterpretation,
            doctors: originalAiDoctorsRef.current, // Restauramos el backup completo
            medicines: aiMedicines
        });
        setHasSearched(true); // Mantenemos estado de búsqueda activo
    } else {
        // Si es búsqueda manual, limpiamos todo llamando al API vacio
        onSearch({});
    }
  };
  
  const isSidePanel = hasSearched;
  const filterFormInnerGridClasses = isSidePanel ? 'grid-cols-1' : 'md:grid-cols-2';
  const filterFormInnerGrid2Classes = isSidePanel ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <div>
      <AISearchBar onSearch={onAISearch} />
      {/* ... RESTO DEL JSX ES IGUAL AL ANTERIOR ... */}
      <div ref={scrollAnchorRef} className="scroll-mt-32 w-full h-1"></div>
      {aiInterpretation && <LeoResponse interpretation={aiInterpretation} />}

      <div className={isSidePanel ? "grid lg:grid-cols-3 gap-8 mb-12" : ""}>
        
        <div className={isSidePanel ? "md:col-span-1" : "col-span-full"}>
          
          <div className={`bg-white rounded-2xl shadow-xl border-2 border-red-100 ${
              isSidePanel ? 'p-6 md:sticky md:top-8 md:mb-0 mb-8' : 'p-6 md:p-8 mb-12'
          }`}>
            <div className="text-center mb-8">
              <h2 className="text-slate-900 mb-2">
                  {aiInterpretation ? 'Filtrar Resultados IA' : 'Búsqueda con Filtros'}
              </h2>
              <p className="text-slate-600">
                  {aiInterpretation 
                    ? 'Refina los resultados encontrados por Leo' 
                    : isLoading ? 'Cargando filtros...' : 'Filtra doctores por especialidad, clínica y más'}
              </p>
            </div>

            {/* ... INPUTS (Nombre, Especialidad Autocomplete, Clinica, etc.) ... 
                (Todo el contenido del formulario es idéntico a tu versión anterior)
            */}
             <div className={`grid gap-4 mb-4 ${filterFormInnerGridClasses}`}>
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

              <div className="space-y-2 relative" ref={specialtyWrapperRef}>
                <label className="text-sm text-slate-700 flex items-center gap-2">
                  <Search className="w-4 h-4 text-red-500" />
                  Especialidad
                </label>
                
                <div className="relative">
                    <Input
                        placeholder="Escribe para buscar especialidad..."
                        value={specialtySearch}
                        onChange={(e) => {
                            setSpecialtySearch(e.target.value);
                            setShowSpecialtySuggestions(true);
                            if (e.target.value === '') setSpecialty('none');
                        }}
                        onFocus={() => setShowSpecialtySuggestions(true)}
                        className="bg-slate-50 border-slate-200 pr-8"
                        disabled={isLoading}
                    />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                {showSpecialtySuggestions && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div 
                            className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                            onClick={() => {
                                setSpecialty('none');
                                setSpecialtySearch('');
                                setShowSpecialtySuggestions(false);
                            }}
                        >
                            Todas las especialidades
                        </div>
                        {filteredSpecialties.length > 0 ? (
                            filteredSpecialties.map(spec => (
                                <div
                                    key={spec.id}
                                    className="px-3 py-2 text-sm hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                                    onClick={() => {
                                        setSpecialty(spec.nombre);
                                        setSpecialtySearch(spec.nombre);
                                        setShowSpecialtySuggestions(false);
                                    }}
                                >
                                    {spec.nombre}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-slate-400 italic">
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                )}
              </div>
            </div>

            <div className={`grid gap-4 mb-6 ${filterFormInnerGrid2Classes}`}>
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
                    {availableClinics.map(clinic => (
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
                    <SelectValue placeholder="Selecciona ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Todas las ubicaciones</SelectItem>
                    {availableDistricts.map((distrito, index) => (
                      <SelectItem key={`${distrito}-${index}`} value={distrito}>
                        {distrito}
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
                    {apiData.tipos_atencion?.map(type => (
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
                {aiInterpretation ? 'Filtrar resultados' : 'Buscar doctores'}
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
        </div>

        {/* RESULTADOS (Sin cambios) */}
        {hasSearched && (
          <div className="lg:col-span-2 space-y-6"> 
            <div className="mb-16 md:mb-0">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          </div>
        )}
      </div>
      <MedicineCarousel medicines={medicines} specialty={carouselSpecialtyName} />
    </div>
  );
}