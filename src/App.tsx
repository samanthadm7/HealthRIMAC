import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { DoctorDetail } from './components/DoctorDetail';
// Importamos la nueva interfaz desde el mapper (o desde types si la moviste)
import { mapApiDataToDoctors, ApiDoctorRow } from './utils/doctorMapper'; 
import type { Doctor, SearchFilters, AISearchResult } from './types/doctor';
import type { Medicine } from './data/medicines'; 

export type { Doctor };

// Actualizamos la interfaz de la respuesta Semántica
// Asumimos que 'data' ahora devuelve el nuevo formato ApiDoctorRow
interface SemanticApiResponse {
  tipo: string;
  especialidades: string[];
  filtros_busqueda: any;
  data: ApiDoctorRow[]; // <--- USAMOS LA NUEVA INTERFAZ
  medicamentos: any[]; 
  sintoma_detectado?: string[]; 
}

export default function App() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]); 
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false); 
  
  const [aiMedicines, setAiMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // --- BÚSQUEDA SEMÁNTICA (IA / LEO) ---
  // Modificamos para aceptar 'input' que puede ser el texto de búsqueda O el objeto de resultados filtrados
  const handleSemanticSearch = async (input: any) => {
    
    // 1. LÓGICA NUEVA: DETECCION DE FILTRO LOCAL
    // Si 'input' es un objeto y tiene la propiedad 'doctors', significa que viene del filtro local
    // en SearchSection. Solo actualizamos el estado visual y salimos.
    if (typeof input === 'object' && input.doctors) {
      setFilteredDoctors(input.doctors);
      // Mantenemos la interpretación y medicamentos si vienen en el objeto
      if (input.analysis) setAiInterpretation(input.analysis);
      if (input.medicines) setAiMedicines(input.medicines);
      return; // <--- IMPORTANTE: Salimos aquí para NO hacer fetch a la API
    }

    // 2. LÓGICA ORIGINAL: BÚSQUEDA EN API
    // Si no entró en el if anterior, asume que 'input' es el texto (string) de búsqueda
    const queryText = input as string;

    setIsLoading(true);
    setAiInterpretation(`Analizando tu consulta: "${queryText}"...`);
    setSelectedSpecialty(''); 
    setAiMedicines([]); 

    try {
      const url = 'https://motor-busqueda-rfcjnvenka-uk.a.run.app/search/busqueda_semantica';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: queryText })
      });

      if (!response.ok) throw new Error(`Error API: ${response.status}`);

      const result: SemanticApiResponse = await response.json();
      
      // Lógica de mensaje
      const especialidadesStr = result.especialidades?.join(' o '); 
      const sintomaStr = result.sintoma_detectado?.[0]; 

      if (especialidadesStr && sintomaStr) {
        setAiInterpretation(`Estos especialistas en ${especialidadesStr} te pueden ayudar con tu ${sintomaStr}.`);
      } else if (especialidadesStr) {
        setAiInterpretation(`He encontrado especialistas en: ${especialidadesStr}.`);
      } else {
        setAiInterpretation('Aquí tienes los resultados más relevantes para tu búsqueda.');
      }

      // --- MAPEO DE MEDICAMENTOS ---
      if (result.medicamentos && Array.isArray(result.medicamentos) && result.medicamentos.length > 0) {
        const mappedMedicines: Medicine[] = result.medicamentos.map((m: any, index: number) => {
          return {
            id: m.id || String(index + 9999), 
            name: m.name_product || m.name_product || 'Medicamento sugerido',
            presentation: m.presentacion || m.descripcion || 'Sin presentación',
            price: typeof m.precio === 'number' ? m.precio : 0,
            image: m.url_imagen || 'https://placehold.co/300x300/eef2f6/333333?text=Medicamento', 
            purchaseUrl: m.url_compra || '#' 
          };
        });
        setAiMedicines(mappedMedicines);
      } else {
        setAiMedicines([]);
      }

      // Especialidad y Doctores
      if (result.especialidades && result.especialidades.length > 0) {
        setSelectedSpecialty(result.especialidades[0]); 
      } else {
        setSelectedSpecialty('Resultados');
      }

      // Mapeo de doctores usando la nueva estructura
      if (result.data && Array.isArray(result.data)) {
        const processedDoctors = mapApiDataToDoctors(result.data);
        setFilteredDoctors(processedDoctors);
      } else {
        setFilteredDoctors([]);
      }
      
      setSelectedDoctor(null);

    } catch (error) {
      console.error(error);
      setAiInterpretation('Lo siento, hubo un problema. Intenta usar los filtros manuales.');
      setFilteredDoctors([]);
      setAiMedicines([]);
    } finally {
      setIsLoading(false);
    }
  };
  // --- BÚSQUEDA MANUAL ---
  const handleManualSearch = async (filters: SearchFilters, interpretation?: string) => {
    if (interpretation) setAiInterpretation(interpretation);
    else setAiInterpretation('');

    if (filters.specialtyName) setSelectedSpecialty(filters.specialtyName);

    setAiMedicines([]); 
    
    setIsLoading(true);

    try {
      const url = 'https://motor-busqueda-rfcjnvenka-uk.a.run.app/search/busqueda';
      const requestBody: Record<string, any> = {};

      Object.keys(filters).forEach(key => {
        // @ts-ignore
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '' && value !== 'none' && key !== 'specialtyName') {
          requestBody[key] = value;
        }
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error(`Error en la búsqueda: ${response.status}`);

      // Usamos el tipo ApiDoctorRow nuevo aquí también
      const rawData: ApiDoctorRow[] = await response.json();
      const processedDoctors = mapApiDataToDoctors(rawData);

      setFilteredDoctors(processedDoctors);
      setSelectedDoctor(null);

    } catch (error) {
      console.error(error);
      setFilteredDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 relative">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <DoctorDetail 
            doctor={selectedDoctor} 
            onBack={() => setSelectedDoctor(null)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 relative">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchSection 
          onSearch={handleManualSearch}
          onAISearch={handleSemanticSearch}
          doctors={filteredDoctors}
          onDoctorSelect={setSelectedDoctor}
          selectedSpecialty={selectedSpecialty}
          aiInterpretation={aiInterpretation}
          aiMedicines={aiMedicines} 
        />
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Leo está buscando lo mejor para ti...</span>
          </div>
        )}
      </main>
    </div>
  );
}