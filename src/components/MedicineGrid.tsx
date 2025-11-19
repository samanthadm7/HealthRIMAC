import { ShoppingCart, Pill } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import type { Medicine } from '../data/medicines';

interface MedicineGridProps {
  medicines: Medicine[];
  specialty: string;
}

export function MedicineGrid({ medicines, specialty }: MedicineGridProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
          <Pill className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-slate-900">Medicamentos Recomendados</h3>
          <p className="text-sm text-slate-600">
            Medicamentos relacionados a {specialty}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {medicines.map((medicine) => (
          <Card key={medicine.id} className="border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
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
              <div className="p-4">
                <h4 className="text-slate-900 mb-1">{medicine.name}</h4>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2 min-h-[40px]">
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
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Nota importante:</strong> Esta información es solo referencial. 
          Consulte siempre con su médico antes de tomar cualquier medicamento.
        </p>
      </div>
    </section>
  );
}
