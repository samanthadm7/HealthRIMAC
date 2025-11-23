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

  // Función de resaltado de texto
  const renderStyledText = (text: string) => {
    const matchFull = text.match(/Estos especialistas en (.+) te pueden ayudar con tu (.+?)(\.|)(\s|$)/i);
    if (matchFull) {
      return (
        <span>
          Estos especialistas en <span className="text-red-600 font-black">{matchFull[1]}</span> te pueden ayudar con tu <span className="text-red-600 font-black">{matchFull[2]}</span>.
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
      
      {/* --- AGREGAMOS ESTA ANIMACIÓN CSS --- */}
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

      {/* Grid Fijo para estabilidad */}
      <div className="grid grid-cols-[250px_1fr] w-[750px] max-w-full gap-0">
        
        {/* COLUMNA 1: LEÓN */}
        {/* APLICAMOS LA CLASE 'animacion-flotar' SI ESTÁ PENSANDO */}
        <div className={`relative z-20 flex items-end justify-center transition-all ${isThinking ? 'animacion-flotar' : ''}`}> 
          <img 
            src={displayImage} 
            alt="Leo AI" 
            style={{ width: '250px' }} 
            // Quitamos el animate-pulse de la imagen para que no parpadee, solo flote
            className={`h-auto object-contain drop-shadow-2xl transition-opacity duration-300 ${isAnimating ? 'opacity-80' : 'opacity-100'}`}
          />
        </div>
        
        {/* COLUMNA 2: GLOBO */}
        {/* TAMBIÉN APLICAMOS 'animacion-flotar' AQUÍ CON UN PEQUEÑO RETRASO (opcional) O SINCRONIZADO */}
        <div className={`relative mt-20 -ml-6 ${isThinking ? 'animacion-flotar' : ''}`}>
          
          {/* ETIQUETA */}
          <div className="flex items-center gap-2 mb-1 ml-10">
            <span className="text-red-600 font-black text-xs tracking-wider uppercase">Leo</span>
            <span className={`text-slate-400 text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full uppercase transition-colors duration-300 ${isThinking ? 'text-red-400 bg-red-50' : ''}`}>
              {isThinking ? 'Procesando...' : 'Asistente'}
            </span>
          </div>

          {/* GLOBO */}
          <div className="relative drop-shadow-xl filter">
            
            {/* PICO */}
            <div 
              className="absolute top-8 -left-4 w-8 h-8 bg-white transform rotate-45 transition-all duration-500"
              style={{ borderRadius: '0 0 0 4px' }}
            ></div>

            {/* CAJA DE TEXTO */}
            <div 
              className={`relative bg-white p-6 z-10 max-w-[420px] min-h-[100px] flex items-center transition-all duration-500 ease-out ${isThinking ? 'rounded-[2.5rem] w-[200px]' : 'rounded-[2rem] rounded-tl-none w-auto'}`}
            >
              {/* Texto con efecto de pulso suave en la opacidad si está pensando */}
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