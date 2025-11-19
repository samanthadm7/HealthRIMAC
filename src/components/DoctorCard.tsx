import { MapPin, Clock, Building2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import type { Doctor } from '../App';

interface DoctorCardProps {
  doctor: Doctor;
  onClick: () => void;
}

export function DoctorCard({ doctor, onClick }: DoctorCardProps) {
  const availabilityConfig = {
    available: { 
      label: 'Disponible', 
      className: 'bg-green-100 text-green-700 border-green-200' 
    },
    limited: { 
      label: 'Disponibilidad limitada', 
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200' 
    },
    unavailable: { 
      label: 'No disponible', 
      className: 'bg-slate-100 text-slate-600 border-slate-200' 
    }
  };

  const config = availabilityConfig[doctor.availability];

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group cursor-pointer">
      <div onClick={onClick}>
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img 
            src={doctor.photo} 
            alt={doctor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className={config.className}>
              {config.label}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <h3 className="text-slate-900 mb-1">{doctor.name}</h3>
          <p className="text-red-600 mb-4">{doctor.specialty}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
              <span className="line-clamp-1">{doctor.clinic}</span>
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
              <span className="line-clamp-1">{doctor.address}</span>
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
              <span className="line-clamp-1">{doctor.schedules[0]}</span>
            </div>
          </div>

          <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            onClick={onClick}
          >
            Ver detalles
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
