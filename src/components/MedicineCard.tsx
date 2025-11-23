import { Medicine } from '../data/medicines';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  
  // Asignamos las props que no vienen del API a valores por defecto para evitar errores de render
  // Usamos el precio del API, pero aseguramos que sea un número antes de operar.
  const basePrice = typeof medicine.price === 'number' && medicine.price > 0 ? medicine.price : 0;
  const originalPrice = basePrice * 1.25; 
  const discount = 20; 
  
    
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* 1. Sección de Imagen con Badge de Descuento */}
      <div className="relative h-48 p-6 bg-white flex items-center justify-center overflow-hidden">
        {/* Etiqueta de descuento flotante (Simulación: siempre 20%) */}
        {/* Solo mostramos el descuento si el precio base es mayor a cero */}
        {basePrice > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
            -{discount}%
          </span>
        )}
        
        {/* Imagen con efecto zoom suave */}
        <img 
          // 🚀 SOLUCIÓN: Fallback directo en el 'src' si medicine.image es nulo/vacío
          src={medicine.image || 'https://placehold.co/150x150/eef2f6/333333?text=Sin+Imagen'} 
          alt={medicine.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
          onError={(e) => { 
            // Fallback para cuando la URL de la imagen no carga por error HTTP/CORS
            (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/eef2f6/333333?text=Sin+Imagen';
          }}
        />
      </div>

      {/* 2. Detalles del Producto */}
      <div className="p-4 pt-0 flex-1 flex flex-col">
        {/* Categoría pequeña - Usamos la constante 'FARMACIA' */}
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">
          {/* Se usa la constante 'FARMACIA' ya que 'medicine.category' no está en la interfaz final */}
          {medicine.category}
        </p>

        {/* Nombre del producto */}
        <h3 className="font-bold text-gray-800 text-sm mb-1 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          {medicine.name}
        </h3>

        {/* Presentación */}
        <p className="text-xs text-gray-500 mb-3">
          {medicine.presentation}
        </p>
        
        {/* Sección de Precios */}
        <div className="mt-auto flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {/* Precio TACHADO (Simulación) - Solo si el precio base es > 0 */}
            {basePrice > 0 ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  S/ {originalPrice.toFixed(2)}
                </span>
                {/* Precio ACTUAL (medicine.price) */}
                <span className="text-xl font-bold text-gray-900">
                  S/ {basePrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                S/ 0.00
              </span>
            )}
          </div>
        </div>

        {/* 3. Botón de Acción (ENLACE DIRECTO) */}
        <a 
          href={medicine.purchaseUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow group/btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:animate-bounce">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          COMPRAR
        </a>
      </div>
    </div>
  );
};

export default MedicineCard;