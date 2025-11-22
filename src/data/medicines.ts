// src/data/medicines.ts

// URL de la nueva API (usando la IP proporcionada por el usuario)
const MEDICINE_API_URL = 'http://10.160.29.147:8000/search/busqueda_medicamentos';

// Interfaz para el Frontend (actualizada con purchaseUrl)
export interface Medicine {
  id: string;
  name: string;
  presentation: string;
  price: number;
  image: string;
  purchaseUrl: string; // URL de compra
}

// Interfaz para la respuesta RAW del API
interface ApiMedicineRow {
  medicamento_id: number;
  nombre: string;
  precio_base: number;
  presentacion: string;
  url_imagen: string;
  url_compra: string;
  especialidad_id: number;
}

/**
 * Mapea la respuesta del API de medicamentos al formato de Frontend (Medicine).
 * @param apiData Los datos crudos del API.
 * @returns Los datos mapeados para el frontend.
 */
function mapApiToMedicine(apiData: ApiMedicineRow[]): Medicine[] {
  if (!apiData) return [];
  
  return apiData.map(item => ({
    id: String(item.medicamento_id), // Convertir ID (number) a string
    name: item.nombre,
    presentation: item.presentacion,
    price: item.precio_base,
    image: item.url_imagen,
    purchaseUrl: item.url_compra,
  }));
}


/**
 * Busca medicamentos recomendados de una especialidad específica usando el API.
 * Si specialtyId es undefined (carga inicial), envía la especialidad como null
 * para obtener medicamentos generales.
 * @param specialtyId El ID numérico de la especialidad (opcional).
 * @returns Una promesa que resuelve a un array de medicamentos.
 */
export async function getMedicinesBySpecialty(specialtyId?: number): Promise<Medicine[]> {
  // Envía el ID directo (number) o null si es undefined (carga inicial)
  const idToSend = specialtyId ?? null; 
  
  try {
    const payload = {
      // Usamos idToSend, que puede ser ID (number) o null
      especialidad_ids: idToSend, 
    };

    // console.log('Payload enviado a la API de medicamentos:', payload); // LÍNEA DE DEPURACIÓN REMOVIDA

    const response = await fetch(MEDICINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Error fetching medicines: ${response.status} ${response.statusText}`);
      // Fallback a array vacío en caso de error HTTP
      return [];
    }

    const apiData: ApiMedicineRow[] = await response.json();
    return mapApiToMedicine(apiData);

  } catch (error) {
    console.error("Fetch error for medicines:", error);
    // Fallback a array vacío en caso de error de red
    return [];
  }
}