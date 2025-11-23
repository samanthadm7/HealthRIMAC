import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

import leoAvatar from '../assets/leo-avatar.png'; 

interface AISearchBarProps {
  onSearch: (queryText: string) => void; 
}

export function AISearchBar({ onSearch }: AISearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    
    onSearch(query);
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
    "Busco un cardiólogo para el jueves",
    "Necesito un pediatra",
    "Tengo un problema en la piel",
    "Siento el ojo irritado",
    "Tengo tos"
  ];

  return (
    <div className="bg-gradient-to-br from-red-500 via-red-300 to-pink-600 rounded-2xl shadow-2xl p-4 md:p-6 mb-8 relative overflow-hidden">
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-6"> 
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
            
            {/* --- AVATAR LEO --- */}
            <div 
                className="relative shrink-0 flex justify-center"
                style={{ width: '150px', height: '170px' }} 
            >
                <div 
                    className="absolute bg-black rounded-[100%] blur-md animate-shadow"
                    style={{ 
                        bottom: '10px', width: '60%', height: '20px', left: '20%', zIndex: 0, opacity: 0.5 
                    }}
                ></div>
                <img 
                    src={leoAvatar} 
                    alt="Leo AI" 
                    className="relative w-full h-full object-contain animate-float"
                    style={{ zIndex: 10 }} 
                />
            </div>

            {/* --- TEXTO --- */}
            <div className="max-w-2xl mx-auto space-y-2"> 
              <h2 className="text-white font-bold text-3xl md:text-4xl tracking-tight drop-shadow-md">
                Hola, soy Leo ❤️‍🩹
              </h2>
              <p className="text-white text-base md:text-lg font-bold max-w-lg mx-auto leading-relaxed [-webkit-text-stroke:1px_white]">
                Cuéntame qué sientes o qué necesitas, y encontraré al especialista ideal para ti.
              </p>
            </div>
          </div>
        </div>

        {/* INPUT BUSCADOR */}
        <div className="relative mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ej: "Me duele la cabeza" o "Busco un Nutricionista"'
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
              disabled={!query.trim()}
              className="px-8 py-6 bg-white hover:bg-red-50 text-red-600 shadow-lg disabled:opacity-50 font-semibold transition-all"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              <span className="font-semibold">Buscar</span>
            </Button>
          </div>
        </div>

        {/* SUGERENCIAS */}
        <div className="space-y-2 text-center md:text-left">
          <p className="text-sm text-red-100 opacity-80">Prueba buscando:</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                   setQuery(suggestion);
                }}
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