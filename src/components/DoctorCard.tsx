import { MapPin, BadgeCheck, Clock, Monitor, Video, Building2, CalendarCheck, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Doctor } from '../types/doctor';

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

  const mainClinic = doctor.clinics[0];
  
  const hasVirtual = doctor.clinics.some(c => c.attentionType === 'virtual' || c.attentionType === 'ambos');
  const hasPresencial = doctor.clinics.some(c => c.attentionType === 'presencial' || c.attentionType === 'ambos');

  const formatName = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (doctor.bookingUrl && doctor.bookingUrl !== '#') {
      window.open(doctor.bookingUrl, '_blank');
    } else {
      onClick(); 
    }
  };

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group bg-white hover:border-red-200"
    >
      <div onClick={onClick} className="cursor-pointer">
        <CardContent className="p-0"> 
          {/* Photo Section */}
          <div className="relative h-48 bg-slate-100 overflow-hidden">
            <img 
              src={doctor.photo} 
              alt={doctor.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {doctor.verified && (
                <Badge className="bg-red-600 text-white border-0 shadow-md">
                  <BadgeCheck className="w-3 h-3 mr-1" />
                  CMP Habilitado
                </Badge>
              )}
            </div>
          </div>

          {/* Content Section (Cuerpo) */}
          <div className="px-6 py-4"> {/* CORRECCIÓN: Usamos px-6 para asegurar el margen lateral */}
            {/* Header */}
            <div className="mb-2">
              <h3 className="text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-1 font-semibold text-lg">
                {formatName(doctor.name)}
              </h3>
              <p className="text-red-600 mb-1 font-medium">{doctor.specialty}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>CMP: {doctor.cmp}</span>
                {doctor.rne && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>RNE: {doctor.rne}</span>
                  </>
                )}
              </div>
            </div>

            {/* Tipo de Atención */}
            <div className="flex flex-wrap gap-2 mb-3">
              {hasPresencial && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  <Monitor className="w-3 h-3 mr-1" />
                  Presencial
                </Badge>
              )}
              {hasVirtual && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  Virtual
                </Badge>
              )}
            </div>

            {/* Clinic Info */}
            <div className="space-y-1 mb-3 pb-3 border-b border-slate-100"> 
              <div className="flex items-start gap-2 text-sm">
                <Building2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">{mainClinic.clinicName}</p>
                  <p className="text-slate-500 text-xs">{mainClinic.branch}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm ml-6">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-600 text-xs line-clamp-1">{mainClinic.address}</p>
              </div>
              {doctor.clinics.length > 1 && (
                <p className="text-xs text-red-600 ml-6">
                  +{doctor.clinics.length - 1} {doctor.clinics.length > 2 ? 'sedes' : 'sede'} más
                </p>
              )}
            </div>

            {/* Schedule (Horario en el cuerpo) */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="line-clamp-1 font-medium">{doctor.schedules[0] || "Horario a confirmar"}</span>
            </div>
          </div>
          {/* CIERRA Content Section */}
        </CardContent>
      </div>

      {/* Footer Buttons */}
      <div className="px-6 py-4 mt-auto grid grid-cols-2 gap-3 border-t border-slate-100"> {/* CORRECCIÓN: Usamos px-6 aquí también */}
        <Button 
          variant="outline" 
          onClick={handleViewMore}
          className="w-full border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          Ver más
        </Button>
        <Button 
          onClick={handleBooking}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          disabled={!doctor.bookingUrl || doctor.bookingUrl === '#'}
        >
          <CalendarCheck className="w-4 h-4 mr-2" />
          Cita
        </Button>
      </div>
    </Card>
  );
}