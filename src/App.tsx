import { useState } from 'react';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { DoctorDetail } from './components/DoctorDetail';
import { mapApiDataToDoctors } from './utils/doctorMapper'; 
import type { Doctor, SearchFilters, AISearchResult, ApiDoctorRow } from './types/doctor';

export type { Doctor };

export default function App() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]); 
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false); 

  // Función de búsqueda conectada al Backend (VERSIÓN POST)
  const handleSearch = async (filters: SearchFilters, interpretation?: string) => {
    
    // Manejo de interpretación IA (visual)
    if (interpretation) {
      setAiInterpretation(interpretation);
    } else {
      setAiInterpretation('');
    }

    // Actualizamos título de carrusel de medicinas (visual)
    if (filters.specialtyName) {
       setSelectedSpecialty(filters.specialtyName);
    }

    setIsLoading(true);

    try {
      // 1. URL DEL ENDPOINT
      const url = 'http://172.16.80.49:8000/search/busqueda';
      
      // 2. PREPARAR EL CUERPO (BODY) DEL REQUEST
      // Creamos un objeto limpio solo con los datos que tienen valor
      const requestBody: Record<string, any> = {};

      Object.keys(filters).forEach(key => {
        // @ts-ignore: Ignoramos checks de TS aquí para iterar dinámicamente
        const value = filters[key];
        
        // Filtramos valores vacíos, nulos o 'none' y quitamos campos exclusivos del frontend
        if (value !== undefined && value !== null && value !== '' && value !== 'none' && key !== 'specialtyName') {
          requestBody[key] = value;
        }
      });

      console.log("Enviando POST a API:", url);
      console.log("Payload (Body):", requestBody);

      // 3. HACER LA PETICIÓN POST
      const response = await fetch(url, {
        method: 'POST', // Método HTTP
        headers: {
          'Content-Type': 'application/json', // Indicamos que enviamos JSON
        },
        body: JSON.stringify(requestBody) // Convertimos el objeto JS a string JSON
      });

      if (!response.ok) {
        throw new Error(`Error en la búsqueda: ${response.status} ${response.statusText}`);
      }

      const rawData: ApiDoctorRow[] = await response.json();
      
      // 4. PROCESAR LA RESPUESTA (Mapeo de datos)
      const processedDoctors = mapApiDataToDoctors(rawData);

      setFilteredDoctors(processedDoctors);
      setSelectedDoctor(null);

    } catch (error) {
      console.error("Error conectando con el backend:", error);
      setFilteredDoctors([]); // Si falla, limpiamos la lista
    } finally {
      setIsLoading(false);
    }
  };

  const handleAISearch = (result: AISearchResult) => {
    handleSearch(result.filters, result.interpretation);
  };

  // --- VISTA DE DETALLE DEL DOCTOR ---
  if (selectedDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 relative">
        {/* Fondos decorativos */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-96 h-96 bg-red-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <DoctorDetail 
              doctor={selectedDoctor} 
              onBack={() => setSelectedDoctor(null)}
            />
          </main>
        </div>
      </div>
    );
  }

  // --- VISTA PRINCIPAL (BUSCADOR) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 relative">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <SearchSection 
            onSearch={handleSearch}
            onAISearch={handleAISearch}
            doctors={filteredDoctors}
            onDoctorSelect={setSelectedDoctor}
            selectedSpecialty={selectedSpecialty}
            aiInterpretation={aiInterpretation}
          />

          {/* Indicador visual de carga */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-slate-600 font-medium">Buscando doctores disponibles...</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}