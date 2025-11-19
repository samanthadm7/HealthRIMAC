import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pill, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import type { Medicine } from '../data/medicines';

interface MedicineCarouselProps {
  medicines: Medicine[];
  specialty?: string;
}

export function MedicineCarousel({ medicines, specialty }: MedicineCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [medicines]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 -mx-4 px-4 md:rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-lg">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-white">Medicamentos Recomendados</h2>
              <p className="text-blue-100 text-sm">
                {specialty 
                  ? `Medicamentos para ${specialty}` 
                  : 'Los más consultados por nuestros especialistas'
                }
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {medicines.map((medicine) => (
            <div 
              key={medicine.id} 
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm shadow-md">
                        S/ {medicine.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-slate-900 mb-1 line-clamp-1">{medicine.name}</h4>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                      {medicine.presentation}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Comprar en Cuidafarma
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Mobile scroll indicators */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white disabled:opacity-30"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="mt-6 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-sm text-yellow-100">
            <strong className="text-white">Nota importante:</strong> Esta información es solo referencial. 
            Consulte siempre con su médico antes de tomar cualquier medicamento.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
