import { Medicine } from '../data/medicines';
import MedicineCard from './MedicineCard';
// Importamos los componentes de carrusel que YA tienes en tu proyecto
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

interface MedicineCarouselProps {
  medicines: Medicine[];
  specialty?: string;
}

export const MedicineCarousel = ({ medicines, specialty }: MedicineCarouselProps) => {
  
  if (!medicines || medicines.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-10 bg-gray-50 rounded-2xl">
      <div className="container mx-auto px-8 md:px-12"> {/* Padding extra para las flechas */}
        
        {/* Encabezado: Título a la izquierda, controles a la derecha */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">💊</span> Medicamentos Recomendados
              {specialty && <span className="text-red-600">para {specialty}</span>}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Los más consultados por nuestros especialistas
            </p>
          </div>
          {/* Enlace "Ver todos" discreto */}
          <a href="#" className="text-sm font-medium text-red-600 hover:underline hidden sm:block">
            Ver todos &rarr;
          </a>
        </div>

        {/* COMPONENTE CARRUSEL */}
        <Carousel
          opts={{
            align: "start",
            loop: true, 
          }}
          className="w-full relative group"
        >
          <CarouselContent className="-ml-4">
            {medicines.map((medicine) => (
              // Aquí está el truco visual:
              // basis-1/2 (2 ítems en móvil)
              // basis-1/3 (3 ítems en tablet)
              // basis-1/4 (4 ítems en PC - igual que tu imagen de referencia)
              <CarouselItem key={medicine.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="h-full p-1">
                  <MedicineCard medicine={medicine} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Flechas de Navegación (Estilo flotante y moderno) */}
          <CarouselPrevious className="absolute -left-4 md:-left-10 top-1/2 -translate-y-1/2 h-10 w-10 border-gray-300 text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors bg-white shadow-md" />
          <CarouselNext className="absolute -right-4 md:-right-10 top-1/2 -translate-y-1/2 h-10 w-10 border-gray-300 text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors bg-white shadow-md" />
        </Carousel>

      </div>
    </div>
  );
};

export default MedicineCarousel;
