import { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Clock, Building2, Calendar, 
  User, BadgeCheck, GraduationCap, Languages, 
  Stethoscope 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MedicineGrid } from './MedicineGrid';
import { Medicine } from '../data/medicines'; 

// --- DEFINICIÓN DE TIPOS ---
interface ClinicLocation {
  id: number;
  clinicName: string;
  branch: string;
  district: string;
  address: string;
  attentionType: string;
  logoUrl: string;
  price: number;
  nextAvailable: string; // Ej: "Viernes 09:30"
  endTime?: string;      // Ej: "13:00" (NUEVO CAMPO)
  bookingUrl: string;
}

interface Doctor {
  id: number;
  name: string;
  cmp: string;
  rne?: string;
  verified: boolean;
  specialty: string;
  photo: string;
  rating: number;
  yearsExperience: number;
  clinics: ClinicLocation[];
  schedules: string[];
  education: string;
  specializations: any[];
  sources: any[];
  bio: string;
  description: string;
  availability: string;
  clinic: string;
  address: string;
  bookingUrl: string;
}
// ----------------------------

interface DoctorDetailProps {
  doctor: Doctor;
  onBack: () => void;
}

export function DoctorDetail({ doctor, onBack }: DoctorDetailProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(false);
  
  // Scroll al inicio al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cargar medicamentos
  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoadingMedicines(true);
      try {
        const metaResponse = await fetch('https://motor-busqueda-rfcjnvenka-uk.a.run.app/search/metadata/filtros');
        if (!metaResponse.ok) throw new Error("Error fetching metadata");
        const metaData = await metaResponse.json();

        const specialtyObj = metaData.especialidades.find((s: any) => s.nombre === doctor.specialty);
        const specialtyId = specialtyObj ? specialtyObj.id : null;

        if (specialtyId) {
          const medResponse = await fetch('https://motor-busqueda-rfcjnvenka-uk.a.run.app/search/busqueda_medicamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ especialidad_ids: specialtyId })
          });

          if (!medResponse.ok) throw new Error(`Error ${medResponse.status} al cargar medicamentos`);
          const medResult = await medResponse.json();

          if (Array.isArray(medResult) && medResult.length > 0) {
            const mappedMedicines = medResult.map((m: any) => ({
              id: m.medicamento_id,
              name: m.name_product,
              description: m.presentacion || 'Disponible',
              price: typeof m.precio === 'number' ? m.precio : 0,
              image: m.url_image || 'https://placehold.co/300x300/eef2f6/333333?text=Medicamento', 
              brand: m.sub_categoria,
              category: m.categoria,
              requiresPrescription: false
            }));
            setMedicines(mappedMedicines);
          } else setMedicines([]);
        } else setMedicines([]);

      } catch {
        setMedicines([]);
      } finally {
        setIsLoadingMedicines(false);
      }
    };

    fetchMedicines();
  }, [doctor.specialty]);

  const availabilityConfig: Record<string, { label: string, className: string }> = {
    available: { label: 'Disponible', className: 'bg-green-100 text-green-700 border-green-200' },
    limited: { label: 'Disponibilidad limitada', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    unavailable: { label: 'No disponible', className: 'bg-slate-100 text-slate-600 border-slate-200' }
  };

  const config = availabilityConfig[doctor.availability] || availabilityConfig.unavailable;

  // Helper para limpiar disponibilidad
  const getAvailabilityText = (text: string) => {
    if (!text || text.includes('undefined') || text.includes('null')) {
      return "Consultar disponibilidad";
    }
    return text;
  };

  // Helper para limpiar distrito
  const getDistrictText = (district: string) => {
    if (!district || district === 'null' || district === 'undefined') return '';
    return `- ${district}`;
  };

  return (
    <div>
      <Button onClick={onBack} variant="ghost" className="mb-6 hover:bg-slate-100">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a resultados
      </Button>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column (Foto y Datos) */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-slate-200 sticky lg:top-24">
            <div className="relative h-80 bg-slate-100">
              <img 
                src={doctor.photo} 
                alt={doctor.name}
                className="w-full h-full object-cover"
                onError={(e) => { 
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/eeeeee/aaaaaa?text=No+Photo';
                }}
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
              <p className="text-sm text-slate-500 mb-4">{doctor.cmp} {doctor.rne && `• RNE: ${doctor.rne}`}</p>

              <div className="space-y-3 text-sm pt-4 border-t border-slate-200">
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>CMP Habilitado</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Languages className="w-4 h-4 text-green-600" />
                  <span>Español</span> 
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Building2 className="w-4 h-4 text-red-500" />
                  <span>{doctor.clinics.length} sedes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Acerca del doctor */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Acerca del Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{doctor.bio || doctor.description}</p>
            </CardContent>
          </Card>

          

          {/* --- SECCIÓN SEDES Y HORARIOS --- */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4 mt-8">
              <Building2 className="w-5 h-5 text-red-500" />
              Sedes y Horarios
            </h3>

            <div className="flex flex-col gap-6 mb-8">
              {doctor.clinics.map((clinic, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Encabezado de la Sede */}
                  <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      {clinic.logoUrl && (
                        <img 
                          src={clinic.logoUrl} 
                          alt="Logo Clínica" 
                          className="w-10 h-10 object-contain bg-white rounded-full p-1 border border-slate-100 shrink-0"
                        />
                      )}
                      
                      <div className="flex-1">
                        <p className="text-slate-900 font-bold text-lg leading-tight mb-1">{clinic.clinicName}</p>
                        <p className="text-sm text-slate-500 font-semibold mb-3">
                          {clinic.branch} {getDistrictText(clinic.district)}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{clinic.address}</span>
                          </div>
                          
                          {clinic.attentionType && (
                            <>
                              <span className="hidden sm:inline text-slate-300">|</span>
                              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                <Stethoscope className="w-4 h-4 text-blue-500 shrink-0" />
                                <span className="capitalize font-medium">{clinic.attentionType}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Horarios */}
                  <div className="p-4 bg-green-50/40 flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full shrink-0">
                      <Clock className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-green-800 uppercase tracking-wide block mb-1">
                        Horario de Atención
                      </span>
                      {/* CAMBIO: Mostrar Inicio - Fin */}
                      <p className="text-base text-slate-800 font-medium">
                        {getAvailabilityText(clinic.nextAvailable)}
                        {clinic.endTime && ` - ${clinic.endTime}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formación Académica */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-red-500" />
                Formación Académica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pb-8 pt-2 px-1">
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {doctor.education || "Información no disponible"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Botón Agendar Cita */}
          <a
            href={doctor.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block ${!doctor.bookingUrl ? 'pointer-events-none opacity-50' : ''}`}
          >
            <Button 
              size="lg"
              className="w-full h-12 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-100"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {doctor.bookingUrl ? "Agendar Cita en Web" : "Agenda no disponible online"}
            </Button>
          </a>
        </div>
      </div>

      {isLoadingMedicines ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-slate-500 mt-2">Cargando recomendaciones...</p>
        </div>
      ) : (
        <MedicineGrid medicines={medicines} specialty={doctor.specialty} />
      )}
    </div>
  );
}