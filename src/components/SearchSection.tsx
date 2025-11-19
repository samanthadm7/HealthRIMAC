import { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DoctorCard } from './DoctorCard';
import { MedicineCarousel } from './MedicineCarousel';
import { getMedicinesBySpecialty } from '../data/medicines';
import type { Doctor } from '../App';

interface SearchSectionProps {
  onSearch: (filters: { specialty: string; location: string; availability: string }) => void;
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
  selectedSpecialty: string;
}

export function SearchSection({ onSearch, doctors, onDoctorSelect, selectedSpecialty }: SearchSectionProps) {
  const [specialty, setSpecialty] = useState('none');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const specialtyFilter = specialty === 'none' ? '' : specialty;
    onSearch({ specialty: specialtyFilter, location, availability });
    setHasSearched(true);
  };

  const specialties = [
    'Cardiología',
    'Pediatría',
    'Dermatología',
    'Ginecología',
    'Traumatología',
    'Oftalmología',
    'Gastroenterología',
    'Neurología'
  ];

  const medicines = getMedicinesBySpecialty(selectedSpecialty);

  return (
    <div>
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-slate-900 mb-2">Encuentra al doctor perfecto para ti</h2>
          <p className="text-slate-600">Busca por especialidad, ubicación o disponibilidad</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Especialidad */}
          <div className="space-y-2">
            <label className="text-sm text-slate-700 flex items-center gap-2">
              <Search className="w-4 h-4 text-red-500" />
              Especialidad
            </label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Selecciona una especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Todas las especialidades</SelectItem>
                {specialties.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <label className="text-sm text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              Ubicación
            </label>
            <Input
              placeholder="Ej: San Isidro, Miraflores..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-slate-50 border-slate-200"
            />
          </div>

          {/* Disponibilidad */}
          <div className="space-y-2">
            <label className="text-sm text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              Disponibilidad
            </label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Selecciona disponibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier fecha</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="tomorrow">Mañana</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleSearch}
          className="w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12"
          size="lg"
        >
          <Search className="w-5 h-5 mr-2" />
          Buscar doctores
        </Button>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="mb-16">
          <div className="mb-6">
            <h3 className="text-slate-900 mb-2">Resultados de la búsqueda</h3>
            <p className="text-slate-600">
              {doctors.length === 0 
                ? 'No se encontraron doctores con los filtros seleccionados'
                : `Se encontraron ${doctors.length} ${doctors.length === 1 ? 'doctor' : 'doctores'}`
              }
            </p>
          </div>

          {doctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(doctor => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor}
                  onClick={() => onDoctorSelect(doctor)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          )}
        </div>
      )}

      {/* Medicine Carousel */}
      <MedicineCarousel medicines={medicines} specialty={selectedSpecialty} />
    </div>
  );
}