import { ArrowLeft, MapPin, Clock, Building2, Calendar, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MedicineGrid } from './MedicineGrid';
import { getMedicinesBySpecialty } from '../data/medicines';
import type { Doctor } from '../App';

interface DoctorDetailProps {
  doctor: Doctor;
  onBack: () => void;
}

export function DoctorDetail({ doctor, onBack }: DoctorDetailProps) {
  const medicines = getMedicinesBySpecialty(doctor.specialty);

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
    <div>
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 hover:bg-slate-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a resultados
      </Button>

      {/* Doctor Profile */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Photo and Basic Info */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-slate-200 sticky top-24">
            <div className="relative h-80 bg-slate-100">
              <img 
                src={doctor.photo} 
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6 text-center">
              <Badge className={`${config.className} mb-3`}>
                {config.label}
              </Badge>
              <h2 className="text-slate-900 mb-2">{doctor.name}</h2>
              <p className="text-red-600 mb-4">{doctor.specialty}</p>
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <User className="w-4 h-4" />
                <span className="text-sm">Médico Especialista</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Acerca del Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{doctor.bio}</p>
            </CardContent>
          </Card>

          {/* Clinics */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-500" />
                Clínicas donde atiende
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {doctor.clinics.map((clinic, index) => (
                <div 
                  key={index}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <p className="text-slate-900 mb-1">{clinic.name}</p>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{clinic.address}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                Horarios disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {doctor.schedules.map((schedule, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                  >
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-green-700" />
                    </div>
                    <span className="text-slate-700">{schedule}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button 
            size="lg"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Cita
          </Button>
        </div>
      </div>

      {/* Recommended Medicines Section */}
      <MedicineGrid medicines={medicines} specialty={doctor.specialty} />
    </div>
  );
}
