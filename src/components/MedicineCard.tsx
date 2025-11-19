import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface MedicineCardProps {
  medicine: {
    id: string;
    name: string;
    presentation: string;
    price: number;
    image: string;
  };
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-300 bg-white h-full">
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
  );
}
