import type { Doctor } from '../types/doctor';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Carlos Mendoza Ríos',
    specialty: 'Cardiología',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    cmp: 'CMP 45678',
    rne: 'RNE 12345',
    verified: true,
    education: [
      { institution: 'Universidad Nacional Mayor de San Marcos', degree: 'Médico Cirujano', year: 2008 },
      { institution: 'Hospital Rebagliati', degree: 'Especialidad en Cardiología', year: 2012 },
      { institution: 'Cleveland Clinic, USA', degree: 'Fellow en Cardiología Intervencionista', year: 2015 }
    ],
    languages: ['Español', 'Inglés'],
    clinics: [
      { clinicName: 'Clínica Ricardo Palma', branch: 'Sede San Isidro', address: 'Av. Javier Prado Este 1066, San Isidro', phone: '01-224-2224', availableSlots: 8, attentionType: 'ambos' },
      { clinicName: 'Clínica Internacional', branch: 'Sede Centro', address: 'Av. Garcilaso de la Vega 1420, Lima', phone: '01-619-6161', availableSlots: 5, attentionType: 'presencial' },
      { clinicName: 'Clínica San Felipe', branch: 'Sede Jesús María', address: 'Av. Gregorio Escobedo 650, Jesús María', phone: '01-219-0000', availableSlots: 3, attentionType: 'virtual' }
    ],
    availability: 'available',
    schedules: ['Lunes 9:00 - 13:00', 'Miércoles 14:00 - 18:00', 'Viernes 9:00 - 13:00'],
    bio: 'Cardiólogo especializado en cardiología intervencionista. Experto en cateterismo cardíaco, angioplastía y diagnóstico de enfermedades cardiovasculares. Certificado por el American College of Cardiology.',
    specializations: ['Cardiología Intervencionista', 'Ecocardiografía', 'Cateterismo Cardíaco'],
    sources: [
      { clinic: 'Clínica Ricardo Palma', url: 'https://www.ricardopalma.pe', lastUpdated: '2024-11-15' },
      { clinic: 'Clínica Internacional', url: 'https://www.clinicainternacional.pe', lastUpdated: '2024-11-14' },
      { clinic: 'Colegio Médico del Perú', url: 'https://www.cmp.org.pe', lastUpdated: '2024-11-10' }
    ],
    clinic: 'Clínica Ricardo Palma',
    address: 'Av. Javier Prado Este 1066, San Isidro'
  },
  {
    id: '2',
    name: 'Dra. María González Vargas',
    specialty: 'Pediatría',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    cmp: 'CMP 52341',
    rne: 'RNE 18765',
    verified: true,
    education: [
      { institution: 'Universidad Peruana Cayetano Heredia', degree: 'Médico Cirujano', year: 2011 },
      { institution: 'Instituto Nacional de Salud del Niño', degree: 'Especialidad en Pediatría', year: 2015 },
      { institution: 'Hospital de Niños de Boston', degree: 'Subespecialidad en Neumología Pediátrica', year: 2018 }
    ],
    languages: ['Español', 'Inglés', 'Portugués'],
    clinics: [
      { clinicName: 'Clínica San Felipe', branch: 'Sede Jesús María', address: 'Av. Gregorio Escobedo 650, Jesús María', phone: '01-219-0000', availableSlots: 12, attentionType: 'ambos' },
      { clinicName: 'Clínica Maison de Santé', branch: 'Sede Surco', address: 'Calle Las Acacias 312, Surco', phone: '01-610-8900', availableSlots: 6, attentionType: 'presencial' },
      { clinicName: 'Clínica Anglo Americana', branch: 'Sede San Isidro', address: 'Av. Alfredo Salazar 350, San Isidro', phone: '01-616-8900', availableSlots: 4, attentionType: 'virtual' }
    ],
    availability: 'limited',
    schedules: ['Martes 10:00 - 14:00', 'Jueves 15:00 - 19:00', 'Sábado 9:00 - 13:00'],
    bio: 'Pediatra con subespecialización en neumología pediátrica. Experta en enfermedades respiratorias infantiles, asma y alergias. Enfoque integral y humano en la atención de niños y adolescentes.',
    specializations: ['Neumología Pediátrica', 'Asma Infantil', 'Alergias'],
    sources: [
      { clinic: 'Clínica San Felipe', url: 'https://www.sanfelipe.pe', lastUpdated: '2024-11-16' },
      { clinic: 'Clínica Maison de Santé', url: 'https://www.maison.pe', lastUpdated: '2024-11-15' },
      { clinic: 'Colegio Médico del Perú', url: 'https://www.cmp.org.pe', lastUpdated: '2024-11-10' }
    ],
    clinic: 'Clínica San Felipe',
    address: 'Av. Gregorio Escobedo 650, Jesús María'
  },
  {
    id: '3',
    name: 'Dr. Roberto Silva Córdova',
    specialty: 'Dermatología',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    cmp: 'CMP 48932',
    rne: 'RNE 15234',
    verified: true,
    education: [
      { institution: 'Universidad Nacional de Trujillo', degree: 'Médico Cirujano', year: 2005 },
      { institution: 'Hospital Dos de Mayo', degree: 'Especialidad en Dermatología', year: 2010 },
      { institution: 'Universidad de Barcelona', degree: 'Máster en Dermatología Estética', year: 2013 }
    ],
    languages: ['Español', 'Inglés'],
    clinics: [
      { clinicName: 'Clínica Centenario', branch: 'Sede San Isidro', address: 'Av. Real 1030, San Isidro', phone: '01-705-1111', availableSlots: 7, attentionType: 'ambos' },
      { clinicName: 'Clínica Delgado', branch: 'Sede Surquillo', address: 'Av. Angamos Este 2520, Surquillo', phone: '01-264-3300', availableSlots: 5, attentionType: 'presencial' }
    ],
    availability: 'available',
    schedules: ['Lunes 14:00 - 18:00', 'Miércoles 9:00 - 13:00', 'Viernes 14:00 - 18:00'],
    bio: 'Dermatólogo con amplia experiencia en dermatología clínica y estética. Especialista en tratamientos láser, acné, psoriasis y cáncer de piel. Certificado internacionalmente en procedimientos estéticos.',
    specializations: ['Dermatología Estética', 'Láser Dermatológico', 'Cáncer de Piel'],
    sources: [
      { clinic: 'Clínica Centenario', url: 'https://www.centenario.pe', lastUpdated: '2024-11-17' },
      { clinic: 'Colegio Médico del Perú', url: 'https://www.cmp.org.pe', lastUpdated: '2024-11-10' }
    ],
    clinic: 'Clínica Centenario',
    address: 'Av. Real 1030, San Isidro'
  },
  {
    id: '4',
    name: 'Dra. Ana Torres Mendoza',
    specialty: 'Ginecología',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    cmp: 'CMP 50123',
    rne: 'RNE 16789',
    verified: true,
    education: [
      { institution: 'Universidad Nacional Mayor de San Marcos', degree: 'Médico Cirujano', year: 2009 },
      { institution: 'Hospital Nacional Materno Infantil', degree: 'Especialidad en Ginecología y Obstetricia', year: 2013 },
      { institution: 'Johns Hopkins Hospital, USA', degree: 'Fellow en Medicina Materno-Fetal', year: 2016 }
    ],
    languages: ['Español', 'Inglés'],
    clinics: [
      { clinicName: 'Clínica Anglo Americana', branch: 'Sede San Isidro', address: 'Av. Alfredo Salazar 350, San Isidro', phone: '01-616-8900', availableSlots: 10, attentionType: 'ambos' },
      { clinicName: 'Clínica San Pablo', branch: 'Sede Surco', address: 'Av. El Polo 789, Surco', phone: '01-610-7777', availableSlots: 8, attentionType: 'virtual' },
      { clinicName: 'Clínica Ricardo Palma', branch: 'Sede San Isidro', address: 'Av. Javier Prado Este 1066, San Isidro', phone: '01-224-2224', availableSlots: 6, attentionType: 'presencial' }
    ],
    availability: 'available',
    schedules: ['Martes 9:00 - 13:00', 'Jueves 9:00 - 13:00', 'Sábado 10:00 - 12:00'],
    bio: 'Ginecóloga obstetra especializada en medicina materno-fetal y embarazos de alto riesgo. Experiencia en atención de partos y cuidado integral de la mujer. Certificada en ecografía obstétrica 4D.',
    specializations: ['Medicina Materno-Fetal', 'Embarazos de Alto Riesgo', 'Ecografía 4D'],
    sources: [
      { clinic: 'Clínica Anglo Americana', url: 'https://www.angloamericana.pe', lastUpdated: '2024-11-16' },
      { clinic: 'Clínica San Pablo', url: 'https://www.sanpablo.pe', lastUpdated: '2024-11-15' },
      { clinic: 'Colegio Médico del Perú', url: 'https://www.cmp.org.pe', lastUpdated: '2024-11-10' }
    ],
    clinic: 'Clínica Anglo Americana',
    address: 'Av. Alfredo Salazar 350, San Isidro'
  },
  {
    id: '5',
    name: 'Dr. Luis Ramírez Soto',
    specialty: 'Traumatología',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    cmp: 'CMP 47654',
    rne: 'RNE 14567',
    verified: true,
    education: [
      { institution: 'Universidad Peruana Cayetano Heredia', degree: 'Médico Cirujano', year: 2007 },
      { institution: 'Hospital Rebagliati', degree: 'Especialidad en Traumatología y Ortopedia', year: 2011 },
      { institution: 'Hospital for Special Surgery, USA', degree: 'Fellow en Cirugía Artroscópica', year: 2014 }
    ],
    languages: ['Español', 'Inglés'],
    clinics: [
      { clinicName: 'Clínica Delgado', branch: 'Sede Surquillo', address: 'Av. Angamos Este 2520, Surquillo', phone: '01-264-3300', availableSlots: 4, attentionType: 'presencial' },
      { clinicName: 'Clínica San Felipe', branch: 'Sede Jesús María', address: 'Av. Gregorio Escobedo 650, Jesús María', phone: '01-219-0000', availableSlots: 3, attentionType: 'ambos' }
    ],
    availability: 'limited',
    schedules: ['Lunes 15:00 - 19:00', 'Miércoles 15:00 - 19:00'],
    bio: 'Traumatólogo y cirujano ortopédico especializado en lesiones deportivas y cirugía artroscópica. Experto en reconstrucción de ligamentos, artroscopía de rodilla y hombro. Médico de equipo deportivo profesional.',
    specializations: ['Cirugía Artroscópica', 'Lesiones Deportivas', 'Ortopedia Pediátrica'],
    sources: [
      { clinic: 'Clínica Delgado', url: 'https://www.delgado.pe', lastUpdated: '2024-11-18' },
      { clinic: 'Colegio Médico del Perú', url: 'https://www.cmp.org.pe', lastUpdated: '2024-11-10' }
    ],
    clinic: 'Clínica Delgado',
    address: 'Av. Angamos Este 2520, Surquillo'
  },
  {
    id: '6',
    name: 'Dra. Patricia Vargas Luna',
    specialty: 'Oftalmología',
    photo: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop',
    cmp: 'CMP 51234',
    rne: 'RNE 17890',
    verified: true,
    education: [
      { institution: 'Universidad Ricardo Palma', degree: 'Médico Cirujano', year: 2013 },
      { institution: 'Instituto Nacional de Oftalmología', degree: 'Especialidad en Oftalmología', year: 2017 },
      { institution: 'Bascom Palmer Eye Institute, USA', degree: 'Fellow en Cirugía Refractiva', year: 2019 }
    ],
    languages: ['Español', 'Inglés'],
    clinics: [
      { clinicName: 'Clínica El Golf', branch: 'Sede San Isidro', address: 'Av. Aurelio Miró Quesada 1030, San Isidro', phone: '01-264-7777', availableSlots: 9, attentionType: 'presencial' },
      { clinicName: 'Clínica Oftalmológica', branch: 'Sede Centro', address: 'Av. Arequipa 1440, Lima', phone: '01-433-4334', availableSlots: 7, attentionType: 'ambos' },
      { clinicName: 'Clínica Internacional', branch: 'Sede Centro', address: 'Av. Garcilaso de la Vega 1420, Lima', phone: '01-619-6161', availableSlots: 5, attentionType: 'virtual' }
    ],
    availability: 'available',
    schedules: ['Lunes 8:00 - 12:00', 'Martes 14:00 - 18:00', 'Viernes 8:00 - 12:00'],
    bio: 'Oftalmóloga especializada en cirugía refractiva (LASIK, PRK) y cataratas. Experta en corrección de miopía, hipermetropía y astigmatismo. Certificada internacionalmente en las últimas tecnologías láser.',
    specializations: ['Cirugía Refractiva', 'LASIK', 'Cataratas'],
    sources: [
      { clinic: 'Clínica El Golf', url: 'https://www.elgolf.pe', lastUpdated: '2024-11-17' },
      { clinic: 'Clínica Oftalmológica', url: 'https://www.oftalmo.pe', lastUpdated: '2024-11-16' },
      { clinic: 'Colegio Médico del Perú', url: 'https://www.cmp.org.pe', lastUpdated: '2024-11-10' }
    ],
    clinic: 'Clínica El Golf',
    address: 'Av. Aurelio Miró Quesada 1030, San Isidro'
  },
  {
    id: '7',
    name: 'Dr. Jorge Paredes Huamán',
    specialty: 'Gastroenterología',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    cmp: 'CMP 49876',
    rne: 'RNE 16234',
    verified: true,
    education: [
      { institution: 'Universidad Nacional Mayor de San Marcos', degree: 'Médico Cirujano', year: 2010 },
      { institution: 'Hospital Rebagliati', degree: 'Especialidad en Gastroenterología', year: 2014 },
      { institution: 'Mayo Clinic, USA', degree: 'Fellow en Endoscopia Avanzada', year: 2017 }
    ],
    languages: ['Español', 'Inglés'],
    clinics: [
      { clinicName: 'Clínica San Pablo', branch: 'Sede Surco', address: 'Av. El Polo 789, Surco', phone: '01-610-7777', availableSlots: 6, attentionType: 'ambos' },
      { clinicName: 'Clínica Centenario', branch: 'Sede San Isidro', address: 'Av. Real 1030, San Isidro', phone: '01-705-1111', availableSlots: 4, attentionType: 'presencial' }
    ],
    availability: 'available',
    schedules: ['Martes 8:00 - 12:00', 'Jueves 14:00 - 18:00', 'Sábado 9:00 - 11:00'],
    bio: 'Gastroenterólogo especializado en enfermedades digestivas y endoscopia terapéutica. Experto en diagnóstico y tratamiento de enfermedades del aparato digestivo, hígado y páncreas.',
    specializations: ['Endoscopia Digestiva', 'Hepatología', 'Enfermedades Inflamatorias Intestinales'],
    sources: [
      { clinic: 'Clínica San Pablo', url: 'https://www.sanpablo.pe', lastUpdated: '2024-11-16' },
      { clinic: 'Colegio Médico del Perú', url: 'https://www.cmp.org.pe', lastUpdated: '2024-11-10' }
    ],
    clinic: 'Clínica San Pablo',
    address: 'Av. El Polo 789, Surco'
  },
  {
    id: '8',
    name: 'Dra. Sandra Flores Quispe',
    specialty: 'Neurología',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    cmp: 'CMP 53456',
    rne: 'RNE 18234',
    verified: true,
    education: [
      { institution: 'Universidad Peruana Cayetano Heredia', degree: 'Médico Cirujano', year: 2012 },
      { institution: 'Hospital Guillermo Almenara', degree: 'Especialidad en Neurología', year: 2016 },
      { institution: 'Massachusetts General Hospital, USA', degree: 'Fellow en Epilepsia', year: 2019 }
    ],
    languages: ['Español', 'Inglés', 'Francés'],
    clinics: [
      { clinicName: 'Clínica Internacional', branch: 'Sede Centro', address: 'Av. Garcilaso de la Vega 1420, Lima', phone: '01-619-6161', availableSlots: 8, attentionType: 'virtual' },
      { clinicName: 'Clínica Anglo Americana', branch: 'Sede San Isidro', address: 'Av. Alfredo Salazar 350, San Isidro', phone: '01-616-8900', availableSlots: 5, attentionType: 'presencial' },
      { clinicName: 'Clínica Maison de Santé', branch: 'Sede Surco', address: 'Calle Las Acacias 312, Surco', phone: '01-610-8900', availableSlots: 3, attentionType: 'ambos' }
    ],
    availability: 'available',
    schedules: ['Lunes 10:00 - 14:00', 'Miércoles 10:00 - 14:00', 'Viernes 10:00 - 14:00'],
    bio: 'Neuróloga especializada en epilepsia, cefaleas y enfermedades neurodegenerativas. Experta en electroencefalografía y neurofisiología clínica. Certificada en el tratamiento de Alzheimer y Parkinson.',
    specializations: ['Epilepsia', 'Cefaleas', 'Enfermedades Neurodegenerativas'],
    sources: [
      { clinic: 'Clínica Internacional', url: 'https://www.clinicainternacional.pe', lastUpdated: '2024-11-18' },
      { clinic: 'Clínica Anglo Americana', url: 'https://www.angloamericana.pe', lastUpdated: '2024-11-17' },
      { clinic: 'Colegio Médico del Perú', url: 'https://www.cmp.org.pe', lastUpdated: '2024-11-10' }
    ],
    clinic: 'Clínica Internacional',
    address: 'Av. Garcilaso de la Vega 1420, Lima'
  }
];
