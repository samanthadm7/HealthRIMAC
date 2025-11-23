import { Medicine } from '../data/medicines';
import MedicineCard from './MedicineCard';

interface MedicineGridProps {
  medicines: Medicine[];
  specialty?: string;
}

export const MedicineGrid = ({ medicines, specialty }: MedicineGridProps) => {
  
  if (!medicines || medicines.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-10 bg-gray-50 rounded-2xl">
      <div className="container mx-auto px-8 md:px-12">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">💊</span> Medicamentos Recomendados
              {specialty && <span className="text-red-600">para {specialty}</span>}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Los más consultados por nuestros especialistas
            </p>
          </div>
          <a href="#" className="text-sm font-medium text-red-600 hover:underline hidden sm:block">
            Ver todos &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default MedicineGrid;
