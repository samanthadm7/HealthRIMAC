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
    "Busco un cardiólogo",
    "Necesito un pediatra",
    "Problema en la piel",
    "Ojo irritado",
    "Tengo tos"
  ];

  return (
    <div className="bg-gradient-to-br from-red-500 via-red-300 to-pink-600 rounded-2xl shadow-2xl py-6 px-6 md:py-8 md:px-12 mb-8 relative overflow-hidden">
      
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* --- SECCIÓN 1: LEO --- */}
        <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left space-y-4">
            
            <div className="flex flex-col xl:flex-row items-center gap-4">
                {/* Avatar */}
                <div 
                    className="relative shrink-0 flex justify-center"
                    style={{ width: '100px', height: '110px' }} 
                >
                    <div 
                        className="absolute bg-black rounded-[100%] blur-md animate-shadow"
                        style={{ 
                            bottom: '5px', width: '60%', height: '15px', left: '20%', zIndex: 0, opacity: 0.5 
                        }}
                    ></div>
                    <img 
                        src={leoAvatar} 
                        alt="Leo AI" 
                        className="relative w-full h-full object-contain animate-float"
                        style={{ zIndex: 10 }} 
                    />
                </div>

                {/* Textos */}
                <div className="space-y-1"> 
                    <h2 className="text-white font-bold text-2xl tracking-tight drop-shadow-md whitespace-nowrap">
                        Hola, soy Leo ❤️‍🩹
                    </h2>
                    <p className="text-white text-sm font-bold max-w-xs leading-relaxed [-webkit-text-stroke:0.5px_white]">
                        ¿Cómo te ayudo hoy?
                    </p>
                </div>
            </div>
        </div>

        <div className="w-full lg:col-span-2">
            
            {/* INPUT BUSCADOR */}
            <div className="relative mb-4">
              <div className="flex gap-2">
                  <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder='Ej: "Me duele la cabeza"'
                      className="pl-12 pr-12 py-6 text-lg bg-white border-0 shadow-lg focus:ring-2 focus:ring-white w-full"
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
                  className="px-6 md:px-8 py-6 bg-white hover:bg-red-50 text-red-600 shadow-lg disabled:opacity-50 font-semibold transition-all shrink-0"
                  size="lg"
                  >
                  <Search className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline font-semibold">Buscar</span>
                  </Button>
              </div>
            </div>

            {/* SUGERENCIAS */}
            <div className="space-y-2">
              <p className="text-sm text-red-100 opacity-80 text-center md:text-left">Prueba buscando:</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {suggestions.map((suggestion, index) => (
                  <button
                      key={index}
                      onClick={() => {
                          setQuery(suggestion);
                      }}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full text-xs transition-all border border-white/20 hover:border-white/40"
                  >
                      {suggestion}
                  </button>
                  ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}