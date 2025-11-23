import { useState, useEffect } from 'react';
import leoTalking from '../assets/leo-avatar2.png'; 
import leoThinking from '../assets/leo-pensando.png';

const placeholderThinking = leoTalking; 

interface LeoResponseProps {
  interpretation: string;
}

export function LeoResponse({ interpretation }: LeoResponseProps) {
  if (!interpretation) return null;

  const isThinking = interpretation.toLowerCase().includes("analizando");
  
  // Transición de imágenes
  const [displayImage, setDisplayImage] = useState(isThinking ? (leoThinking || placeholderThinking) : leoTalking);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const nextImage = isThinking ? (leoThinking || placeholderThinking) : leoTalking;
    if (displayImage !== nextImage) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayImage(nextImage);
        setIsAnimating(false);
      }, 200); 
      return () => clearTimeout(timer);
    }
  }, [isThinking, displayImage]);

  const renderStyledText = (text: string) => {
    
    const matchFull = text.match(/Estos especialistas en (.+) te pueden ayudar con tu (.+)(\.|)(\s|$)/i);
    if (matchFull) {
      return (
        <span>
          Estos especialistas en <span className="text-red-600 font-black">{matchFull[1]}</span> te pueden ayudar con tu <span className="text-red-600 font-black">{matchFull[2]}</span>
        </span>
      );
    }
    const matchSimple = text.match(/He encontrado especialistas en: (.+)/i);
    if (matchSimple) {
      return (
        <span>
          He encontrado especialistas en: <span className="text-red-600 font-black">{matchSimple[1]}</span>
        </span>
      );
    }
    return text;
  };

  return (
    <div className="w-full flex justify-center mb-12 px-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* --- ANIMACIÓN CSS --- */}
      <style>{`
        @keyframes flotar {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); } /* Sube 10px */
          100% { transform: translateY(0px); }
        }
        .animacion-flotar {
          animation: flotar 2s ease-in-out infinite;
        }
      `}</style>

      <div className="grid grid-cols-[100px_1fr] max-w-xl gap-4 items-end"> 
        
        {/* COLUMNA 1: LEÓN (Avatar) */}
        <div className={`relative z-20 flex items-end justify-center transition-all ${isThinking ? 'animacion-flotar' : ''}`}> 
          <img 
            src={displayImage} 
            alt="Leo AI" 
            style={{ width: '100px' }} 
            className={`h-auto object-contain drop-shadow-2xl transition-opacity duration-300 ${isAnimating ? 'opacity-80' : 'opacity-100'}`}
          />
        </div>
        
        {/* COLUMNA 2: GLOBO (Texto) */}
        <div className="relative"> 
          
          {/* ETIQUETA */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-600 font-black text-xs tracking-wider uppercase">Leo</span>
            <span className={`text-slate-400 text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full uppercase transition-colors duration-300 ${isThinking ? 'text-red-400 bg-red-50' : ''}`}>
              {isThinking ? 'Procesando...' : 'Asistente'}
            </span>
          </div>

          {/* GLOBO DE DIÁLOGO */}
          <div className="relative drop-shadow-xl filter">
            
            <div 
              className="absolute top-8 -left-4 w-8 h-8 bg-white transform rotate-45 transition-all duration-500"
              style={{ borderRadius: '0 0 0 4px' }}
            ></div>

            {/* CAJA DE TEXTO */}
            <div 
              className={`relative bg-white p-6 z-10 max-w-full min-h-[100px] flex items-center transition-all duration-500 ease-out ${isThinking ? 'rounded-[2.5rem] w-full md:w-auto' : 'rounded-[2rem] rounded-tl-none w-auto'}`}
            >
              <p className={`text-slate-700 text-lg font-medium leading-relaxed ${isThinking ? 'animate-pulse' : ''}`}>
                {renderStyledText(interpretation)}
              </p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}