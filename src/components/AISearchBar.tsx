import { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { interpretSearch } from '../utils/aiSearchAgent';
import type { AISearchResult } from '../types/doctor';

// 1. IMPORTA TU IMAGEN AQUÍ
// Asegúrate de que la ruta coincida con donde guardaste la foto
import leoAvatar from '../assets/leo-avatar.png'; 

interface AISearchBarProps {
  onSearch: (result: AISearchResult) => void;
}

export function AISearchBar({ onSearch }: AISearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simular un pequeño delay para dar sensación de procesamiento
    setTimeout(() => {
      const result = interpretSearch(query);
      onSearch(result);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const suggestions = [
    "Me duele la cabeza",
    "Busco un cardiólogo para hoy",
    "Necesito un pediatra",
    "Consulta virtual con dermatólogo",
  ];

  return (
    <div className="bg-gradient-to-br from-red-500 via-red-300 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-8"> {/* Aumenté un poco el margen inferior (mb-8) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
            
            {/* --- CONTENEDOR DEL PERSONAJE (ESCENARIO) --- */}
            <div 
                className="relative shrink-0 flex justify-center"
                style={{ width: '220px', height: '240px' }} // Definimos el tamaño del área aquí
            >
                
                {/* 1. LA SOMBRA (Pegada al piso y centrada) */}
                <div 
                    className="absolute bg-black rounded-[100%] blur-md animate-shadow"
                    style={{ 
                        bottom: '10px',      // A 10px del fondo
                        width: '60%',        // Ancho relativo al contenedor
                        height: '20px',      // Altura del óvalo
                        left: '20%',         // Para centrarlo (20% lado + 60% ancho = 80%)
                        zIndex: 0,           // Detrás de la imagen
                        opacity: 0.5         // Opacidad base visible
                    }}
                ></div>

                {/* 2. LA IMAGEN (Flotando encima) */}
                <img 
                    src={leoAvatar} 
                    alt="Leo AI" 
                    className="relative w-full h-full object-contain animate-float"
                    style={{ zIndex: 10 }} // Aseguramos que esté DELANTE de la sombra
                />

            </div>
            {/* ----------------------------------------- */}

            {/* 2. ZONA DE TEXTO (Tipografía mejorada) */}
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-white font-bold text-4xl md:text-5xl tracking-tight drop-shadow-md">
                Hola, soy Leo 🐾
              </h2>
              
              {/* <div className="flex items-center justify-center gap-2 text-red-100 font-medium text-xl">
                <span>Tu asistente médico inteligente</span>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div> */}

              <p className="text-white text-lg md:text-xl font-bold max-w-lg mx-auto leading-relaxed [-webkit-text-stroke:2px_white]">
                Cuéntame qué sientes o qué necesitas, y encontraré al especialista ideal para ti en segundos.
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ej: "Me duele la cabeza" o "Busco un cardiólogo para hoy"'
                className="pl-12 pr-12 py-6 text-lg bg-white border-0 shadow-lg focus:ring-2 focus:ring-white"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="px-8 py-6 bg-white hover:bg-red-50 text-red-600 shadow-lg disabled:opacity-50 font-semibold transition-all"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent mr-2" />
                  <span className="font-semibold">Analizando...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Buscar</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-2 text-center md:text-left">
          <p className="text-sm text-red-100 opacity-80">Ejemplos de búsqueda:</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full text-sm transition-all border border-white/20 hover:border-white/40"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}