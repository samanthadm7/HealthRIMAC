import { ArrowLeft, MapPin, Clock, Building2, Calendar, User, BadgeCheck, GraduationCap, Languages, Phone, ExternalLink, Monitor, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MedicineGrid } from './MedicineGrid';
import { getMedicinesBySpecialty } from '../data/medicines';
import type { Doctor } from '../types/doctor';

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
              {doctor.verified && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-600 text-white border-0 shadow-lg">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    CMP Verificado
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-6 text-center">
              <Badge className={`${config.className} mb-3`}>
                {config.label}
              </Badge>
              <h2 className="text-slate-900 mb-2">{doctor.name}</h2>
              <p className="text-red-600 mb-1">{doctor.specialty}</p>
              <p className="text-sm text-slate-500 mb-4">{doctor.cmp} {doctor.rne && `• ${doctor.rne}`}</p>
              
              {/* Quick Stats */}
              <div className="space-y-3 text-sm pt-4 border-t border-slate-200">
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Verificado en CMP</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Languages className="w-4 h-4 text-green-600" />
                  <span>{doctor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Building2 className="w-4 h-4 text-red-500" />
                  <span>{doctor.clinics.length} {doctor.clinics.length === 1 ? 'clínica' : 'clínicas'}</span>
                </div>
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
              <p className="text-slate-700 mb-4">{doctor.bio}</p>
              {doctor.specializations.length > 0 && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Subespecialidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-red-500" />
                Formación Académica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {doctor.education.map((edu, index) => (
                <div 
                  key={index}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <p className="text-slate-900 mb-1">{edu.degree}</p>
                  <p className="text-sm text-slate-600">{edu.institution}</p>
                  <p className="text-xs text-slate-500 mt-1">{edu.year}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Clinics */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-500" />
                Clínicas donde atiende ({doctor.clinics.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {doctor.clinics.map((clinic, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-r from-slate-50 to-red-50 rounded-lg border border-red-100"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-slate-900">{clinic.clinicName}</p>
                        {clinic.attentionType === 'presencial' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            <Monitor className="w-3 h-3 mr-1" />
                            Presencial
                          </Badge>
                        )}
                        {clinic.attentionType === 'virtual' && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                            <Video className="w-3 h-3 mr-1" />
                            Virtual
                          </Badge>
                        )}
                        {clinic.attentionType === 'ambos' && (
                          <>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              <Monitor className="w-3 h-3 mr-1" />
                              Presencial
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                              <Video className="w-3 h-3 mr-1" />
                              Virtual
                            </Badge>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{clinic.branch}</p>
                      <div className="flex items-start gap-2 text-sm text-slate-600 mb-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{clinic.address}</span>
                      </div>
                      {clinic.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{clinic.phone}</span>
                        </div>
                      )}
                    </div>
                    {clinic.availableSlots !== undefined && clinic.availableSlots > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-green-700">{clinic.availableSlots} citas disponibles</p>
                      </div>
                    )}
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
                ))}</div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card className="border-slate-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2 text-base">
                <ExternalLink className="w-4 h-4 text-red-600" />
                Fuentes de Información
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-3">
                Esta información ha sido consolidada y verificada de las siguientes fuentes:
              </p>
              <div className="space-y-2">
                {doctor.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-white rounded border border-red-200">
                    <span className="text-slate-700">{source.clinic}</span>
                    <span className="text-xs text-slate-500">Actualizado: {new Date(source.lastUpdated).toLocaleDateString('es-PE')}</span>
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
