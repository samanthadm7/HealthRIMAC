import { ApiDoctorRow, Doctor, ClinicLocation } from '../types/doctor';

export function mapApiDataToDoctors(rows: ApiDoctorRow[]): Doctor[] {
  const doctorsMap = new Map<number, Doctor>();

  rows.forEach((row) => {
    // 1. Si el doctor no existe aún en nuestro mapa, lo creamos con sus datos básicos
    if (!doctorsMap.has(row.medico_id)) {
      doctorsMap.set(row.medico_id, {
        // Datos directos
        id: row.medico_id,
        name: row.nombre_doctor,
        specialty: row.nombre_especialidad,
        photo: row.url_imagen || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop', // Foto por defecto si viene null
        cmp: row.cmp_numero,
        verified: row.validado_cmp,
        rating: row.calificacion || 0, // Si viene null, ponemos 0
        
        // Arrays que iremos llenando o dejando vacíos (porque el API de búsqueda simple no los trae todos)
        clinics: [],
        schedules: [],
        education: [], // El endpoint de búsqueda no suele traer esto, se deja vacío para el detalle
        languages: ['Español'], // Default
        specializations: [],
        bio: `El Dr. ${row.nombre_doctor} es especialista en ${row.nombre_especialidad}.`, // Bio generada o vacía
        sources: [],
        
        // Estado inicial de disponibilidad
        availability: 'available', 
        
        // Campos legacy (para evitar errores si algún componente viejo los usa)
        clinic: row.nombre_clinica,
        address: row.distrito
      });
    }

    // Recuperamos la referencia al doctor actual
    const doctor = doctorsMap.get(row.medico_id)!;

    // 2. FUSIONAR ESPECIALIDADES
    // Si el doctor aparece con otra especialidad (ej: fila 1 Cardiologia, fila 2 Pediatria)
    if (!doctor.specialty.includes(row.nombre_especialidad)) {
      doctor.specialty += `, ${row.nombre_especialidad}`;
    }

    // 3. AGREGAR HORARIOS (schedules)
    // Formato legible: "Lunes 08:00 - 12:00"
    const horarioFormateado = `${row.dia} ${row.hora_inicio.slice(0, 5)} - ${row.hora_fin.slice(0, 5)}`;
    if (!doctor.schedules.includes(horarioFormateado)) {
      doctor.schedules.push(horarioFormateado);
    }

    // 4. AGREGAR CLÍNICAS / SEDES (Evitando duplicados)
    // Un doctor puede tener 3 horarios en la misma sede, pero solo queremos mostrar la sede una vez en la tarjeta.
    
    // Buscamos si ya existe esta combinación Clínica + Sede + TipoAtención
    const existingClinicIndex = doctor.clinics.findIndex(c => 
      c.id === row.clinica_id && 
      c.branch === row.nombre_sede && 
      c.attentionType.toLowerCase() === row.tipo_atencion.toLowerCase()
    );

    if (existingClinicIndex === -1) {
      // Si es una sede nueva para este doctor, la agregamos
      const newClinic: ClinicLocation = {
        id: row.clinica_id,
        clinicName: row.nombre_clinica,
        branch: row.nombre_sede,
        district: row.distrito,
        address: `${row.nombre_sede}, ${row.distrito}`, // Construimos una dirección aproximada
        attentionType: row.tipo_atencion,
        logoUrl: row.url_logo,
        price: 100, // Dato placeholder (el API no lo manda aún)
        nextAvailable: `${row.dia} ${row.hora_inicio.slice(0, 5)}` // Ej: "Lunes 08:00"
      };
      doctor.clinics.push(newClinic);
    }
  });

  // Convertimos el Mapa a un Array simple para que React lo pueda mapear
  return Array.from(doctorsMap.values());
}