import { Doctor, ClinicLocation } from '../types/doctor';

export interface ApiDoctorRow {
  id_clinica: number;
  nombre_clinica: string;
  nombre_doctor: string;
  cmp: string;
  rne: string | null;
  url_foto_doctor: string;
  especialidad: string;
  especialidad_homologada?: string | null;
  id_especialidad?: number | null;
  sede: string;
  distrito: string;
  direccion_sede: string;
  telefono_clinica: string;
  dia_atencion: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  url_agenda_cita: string;
  url_logo_clinica: string;
  calificacion: number;
  cmp_verificado: boolean;
  formacion: string;
  tipo_atencion: string;
}

export function mapApiDataToDoctors(rows: ApiDoctorRow[]): Doctor[] {

  if (!Array.isArray(rows)) {
    console.warn('mapApiDataToDoctors recibió datos inválidos:', rows);
    return [];
  }

  const doctorsMap = new Map<number, Doctor>();

  rows.forEach((row) => {
    const doctorId = parseInt(row.cmp, 10) || Math.random(); 

    if (!doctorsMap.has(doctorId)) {


      doctorsMap.set(doctorId, {
        id: doctorId,
        name: row.nombre_doctor,
        cmp: row.cmp,
        rne: row.rne || undefined, 
        verified: row.cmp_verificado,
        
        specialty: row.especialidad,
        photo: row.url_foto_doctor || 'https://via.placeholder.com/150?text=Doctor',
        rating: row.calificacion || 5.0,
        yearsExperience: 10, 
        
        clinics: [],
        schedules: [],
        education: row.formacion, 
        specializations: [],
        sources: [],
        
        bio: `${row.nombre_doctor} es especialista en ${row.especialidad}.`,
        description: `Especialista en ${row.especialidad}`,
        
        availability: (row.dia_atencion) ? 'available' : 'limited',
        
        clinic: row.nombre_clinica,
        address: row.distrito,
        bookingUrl: row.url_agenda_cita
      });
    }

    const doctor = doctorsMap.get(doctorId)!;

    if (row.dia_atencion && row.hora_inicio && row.hora_fin) {
      const horarioLegible = `${row.dia_atencion} ${row.hora_inicio.substring(0, 5)} - ${row.hora_fin.substring(0, 5)}`;
      if (!doctor.schedules.includes(horarioLegible)) {
        doctor.schedules.push(horarioLegible);
      }
    } else if (doctor.schedules.length === 0) {
       doctor.schedules.push("Horarios a confirmar");
    }

    const existingClinicIndex = doctor.clinics.findIndex(c => 
      c.id === row.id_clinica && 
      c.branch === row.sede &&
      c.attentionType === row.tipo_atencion
    );

    if (existingClinicIndex === -1) {
      const newClinic: ClinicLocation = {
        id: row.id_clinica,
        clinicName: row.nombre_clinica,
        branch: row.sede,
        district: row.distrito || "",
        address: row.direccion_sede || `${row.sede}, ${row.distrito}`,
        attentionType: row.tipo_atencion,
        logoUrl: row.url_logo_clinica,
        price: 0,
        nextAvailable: row.dia_atencion ? `${row.dia_atencion} ${row.hora_inicio?.substring(0,5)}` : 'Consultar',
        bookingUrl: row.url_agenda_cita 
      };
      
      doctor.clinics.push(newClinic);
    }
  });

  return Array.from(doctorsMap.values());
}