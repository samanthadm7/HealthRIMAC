import { useState } from 'react';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { DoctorDetail } from './components/DoctorDetail';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  clinic: string;
  address: string;
  availability: 'available' | 'limited' | 'unavailable';
  schedules: string[];
  clinics: Array<{ name: string; address: string }>;
  bio: string;
}

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    clinic: 'Clínica Ricardo Palma',
    address: 'Av. Javier Prado Este 1066, San Isidro',
    availability: 'available',
    schedules: ['Lunes 9:00 - 13:00', 'Miércoles 14:00 - 18:00', 'Viernes 9:00 - 13:00'],
    clinics: [
      { name: 'Clínica Ricardo Palma', address: 'Av. Javier Prado Este 1066, San Isidro' },
      { name: 'Clínica Internacional', address: 'Av. Garcilaso de la Vega 1420, Lima' }
    ],
    bio: 'Especialista en cardiología con más de 15 años de experiencia. Experto en diagnóstico y tratamiento de enfermedades cardiovasculares.'
  },
  {
    id: '2',
    name: 'Dra. María González',
    specialty: 'Pediatría',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    clinic: 'Clínica San Felipe',
    address: 'Av. Gregorio Escobedo 650, Jesús María',
    availability: 'limited',
    schedules: ['Martes 10:00 - 14:00', 'Jueves 15:00 - 19:00'],
    clinics: [
      { name: 'Clínica San Felipe', address: 'Av. Gregorio Escobedo 650, Jesús María' },
      { name: 'Clínica Maison de Santé', address: 'Calle Las Acacias 312, Surco' }
    ],
    bio: 'Pediatra con especialización en enfermedades respiratorias infantiles. Más de 10 años atendiendo a niños y adolescentes.'
  },
  {
    id: '3',
    name: 'Dr. Roberto Silva',
    specialty: 'Dermatología',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    clinic: 'Clínica Centenario',
    address: 'Av. Real 1030, San Isidro',
    availability: 'available',
    schedules: ['Lunes 14:00 - 18:00', 'Miércoles 9:00 - 13:00', 'Viernes 14:00 - 18:00'],
    clinics: [
      { name: 'Clínica Centenario', address: 'Av. Real 1030, San Isidro' }
    ],
    bio: 'Dermatólogo con experiencia en tratamientos estéticos y dermatología clínica. Certificado internacionalmente.'
  },
  {
    id: '4',
    name: 'Dra. Ana Torres',
    specialty: 'Ginecología',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    clinic: 'Clínica Anglo Americana',
    address: 'Av. Alfredo Salazar 350, San Isidro',
    availability: 'available',
    schedules: ['Martes 9:00 - 13:00', 'Jueves 9:00 - 13:00', 'Sábado 10:00 - 12:00'],
    clinics: [
      { name: 'Clínica Anglo Americana', address: 'Av. Alfredo Salazar 350, San Isidro' },
      { name: 'Clínica San Pablo', address: 'Av. El Polo 789, Surco' }
    ],
    bio: 'Ginecóloga obstetra especializada en medicina materno-fetal. Más de 12 años de experiencia.'
  },
  {
    id: '5',
    name: 'Dr. Luis Ramírez',
    specialty: 'Traumatología',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    clinic: 'Clínica Delgado',
    address: 'Av. Angamos Este 2520, Surquillo',
    availability: 'limited',
    schedules: ['Lunes 15:00 - 19:00', 'Miércoles 15:00 - 19:00'],
    clinics: [
      { name: 'Clínica Delgado', address: 'Av. Angamos Este 2520, Surquillo' }
    ],
    bio: 'Traumatólogo y cirujano ortopédico. Especialista en lesiones deportivas y cirugía artroscópica.'
  },
  {
    id: '6',
    name: 'Dra. Patricia Vargas',
    specialty: 'Oftalmología',
    photo: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop',
    clinic: 'Clínica El Golf',
    address: 'Av. Aurelio Miró Quesada 1030, San Isidro',
    availability: 'available',
    schedules: ['Lunes 8:00 - 12:00', 'Martes 14:00 - 18:00', 'Viernes 8:00 - 12:00'],
    clinics: [
      { name: 'Clínica El Golf', address: 'Av. Aurelio Miró Quesada 1030, San Isidro' },
      { name: 'Clínica Oftalmológica', address: 'Av. Arequipa 1440, Lima' }
    ],
    bio: 'Oftalmóloga con subespecialización en cirugía refractiva y cataratas. Certificada internacionalmente.'
  },
  {
    id: '7',
    name: 'Dr. Jorge Paredes',
    specialty: 'Gastroenterología',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    clinic: 'Clínica San Pablo',
    address: 'Av. El Polo 789, Surco',
    availability: 'available',
    schedules: ['Martes 8:00 - 12:00', 'Jueves 14:00 - 18:00'],
    clinics: [
      { name: 'Clínica San Pablo', address: 'Av. El Polo 789, Surco' }
    ],
    bio: 'Gastroenterólogo especializado en enfermedades digestivas y endoscopia. Más de 10 años de experiencia.'
  },
  {
    id: '8',
    name: 'Dra. Sandra Flores',
    specialty: 'Neurología',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    clinic: 'Clínica Internacional',
    address: 'Av. Garcilaso de la Vega 1420, Lima',
    availability: 'available',
    schedules: ['Lunes 10:00 - 14:00', 'Miércoles 10:00 - 14:00', 'Viernes 10:00 - 14:00'],
    clinics: [
      { name: 'Clínica Internacional', address: 'Av. Garcilaso de la Vega 1420, Lima' }
    ],
    bio: 'Neuróloga especializada en cefaleas, epilepsia y enfermedades neurodegenerativas.'
  }
];

export default function App() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');

  const handleSearch = (filters: { specialty: string; location: string; availability: string }) => {
    let results = [...mockDoctors];

    if (filters.specialty) {
      results = results.filter(doctor => 
        doctor.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
      setSelectedSpecialty(filters.specialty);
    } else {
      setSelectedSpecialty('');
    }

    if (filters.location) {
      results = results.filter(doctor => 
        doctor.address.toLowerCase().includes(filters.location.toLowerCase()) ||
        doctor.clinic.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      if (filters.availability === 'today') {
        results = results.filter(doctor => doctor.availability === 'available');
      } else if (filters.availability === 'tomorrow') {
        results = results.filter(doctor => doctor.availability !== 'unavailable');
      }
    }

    setFilteredDoctors(results);
    setSelectedDoctor(null);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSpecialty(doctor.specialty);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSearch = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!selectedDoctor ? (
          <SearchSection 
            onSearch={handleSearch}
            doctors={filteredDoctors}
            onDoctorSelect={handleDoctorSelect}
            selectedSpecialty={selectedSpecialty}
          />
        ) : (
          <DoctorDetail 
            doctor={selectedDoctor}
            onBack={handleBackToSearch}
          />
        )}
      </main>

      <footer className="mt-20 py-8 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>© 2025 Rimac Hackathon – Reto Data</p>
          <p className="text-sm mt-2">Buscador Inteligente de Doctores y Clínicas</p>
        </div>
      </footer>
    </div>
  );
}
