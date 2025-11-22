import { Medicine } from '../data/medicines';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* 1. Sección de Imagen */}
      <div className="relative h-48 p-6 bg-white flex items-center justify-center overflow-hidden">
        {/* Imagen con efecto zoom suave */}
        <img 
          src={medicine.image} 
          alt={medicine.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </div>

      {/* 2. Detalles del Producto */}
      <div className="p-4 pt-0 flex-1 flex flex-col">
        {/* Nombre del producto */}
        <h3 className="font-bold text-gray-800 text-sm mb-1 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {medicine.name}
        </h3>

        {/* Presentación (ej: 100 tabletas) */}
        <p className="text-xs text-gray-500 mb-3">
          {medicine.presentation}
        </p>
        
        {/* Sección de Precios */}
        {/* Nota: Hemos movido el 'mt-auto' para que empuje el precio y el botón hacia abajo */}
        <div className="mt-auto flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              S/ {medicine.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 3. Botón de Acción (Enlace con la URL de compra) */}
        <a 
          href={medicine.purchaseUrl}
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow group/btn"
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