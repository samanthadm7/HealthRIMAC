import { ApiDoctorRow, Doctor, ClinicLocation } from '../types/doctor';

export function mapApiDataToDoctors(rows: ApiDoctorRow[]): Doctor[] {
  // Validación inicial por seguridad
  if (!Array.isArray(rows)) {
    console.warn('mapApiDataToDoctors recibió datos inválidos:', rows);
    return [];
  }

  const doctorsMap = new Map<number, Doctor>();

  rows.forEach((row) => {
    // 1. CREACIÓN O RECUPERACIÓN DEL DOCTOR
    if (!doctorsMap.has(row.medico_id)) {
      doctorsMap.set(row.medico_id, {
        // Identificadores
        id: row.medico_id,
        name: row.nombre_doctor,
        cmp: row.cmp_numero,
        verified: row.validado_cmp,
        
        // Detalles Visuales
        specialty: row.nombre_especialidad,
        photo: row.url_imagen || 'https://via.placeholder.com/150?text=Doctor', // Placeholder si falla la imagen
        rating: row.calificacion || 5.0, // Default a 5 si viene null
        reviews: 12, // Mock data: número de reseñas
        yearsExperience: 8, // Mock data: experiencia
        
        // Arrays vacíos para llenar dinámicamente
        clinics: [],
        schedules: [],
        education: [], 
        languages: ['Español', 'Inglés'], // Mock data
        specializations: [],
        sources: [],
        
        // Textos generados
        bio: `El Dr. ${row.nombre_doctor} es especialista en ${row.nombre_especialidad}, comprometido con la salud de sus pacientes.`,
        description: `Especialista en ${row.nombre_especialidad}`, // Campo duplicado por compatibilidad UI
        
        // Disponibilidad
        availability: 'available',
        
        // Campos Legacy (para componentes antiguos)
        clinic: row.nombre_clinica,
        address: row.distrito
      });
    }

    const doctor = doctorsMap.get(row.medico_id)!;

    // 2. FUSIONAR ESPECIALIDADES
    // Evitamos duplicar texto. Ej: Si ya dice "Cardiología", no agregamos "Cardiología" de nuevo.
    if (!doctor.specialty.includes(row.nombre_especialidad)) {
      doctor.specialty += `, ${row.nombre_especialidad}`;
    }

    // 3. AGREGAR HORARIOS (Formato "Lunes 08:00 - 12:00")
    const horarioLegible = `${row.dia} ${row.hora_inicio.substring(0, 5)} - ${row.hora_fin.substring(0, 5)}`;
    if (!doctor.schedules.includes(horarioLegible)) {
      doctor.schedules.push(horarioLegible);
    }

    // 4. AGREGAR CLÍNICAS / SEDES
    // Verificamos si ya agregamos esta sede específica para no duplicar la tarjeta de ubicación
    const existingClinicIndex = doctor.clinics.findIndex(c => 
      c.id === row.clinica_id && 
      c.branch === row.nombre_sede &&
      c.attentionType === row.tipo_atencion
    );

    if (existingClinicIndex === -1) {
      const newClinic: ClinicLocation = {
        id: row.clinica_id,
        clinicName: row.nombre_clinica,
        branch: row.nombre_sede,
        district: row.distrito,
        address: `${row.nombre_sede}, ${row.distrito}`,
        attentionType: row.tipo_atencion, // 'Presencial' o 'Virtual'
        logoUrl: row.url_logo,
        price: 150, // Precio referencial (mock)
        nextAvailable: `${row.dia} ${row.hora_inicio.substring(0, 5)}`
      };
      doctor.clinics.push(newClinic);
      
      // Actualizamos el precio base del doctor con el de la primera clínica encontrada
      if (!doctor.price) {
        doctor.price = newClinic.price;
      }
    }
  });

  return Array.from(doctorsMap.values());
}