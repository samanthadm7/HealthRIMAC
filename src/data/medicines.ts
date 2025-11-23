
// URL de la nueva API (usando la IP proporcionada por el usuario)
const MEDICINE_API_URL = 'https://motor-busqueda-rfcjnvenka-uk.a.run.app/search/busqueda_medicamentos';

// Interfaz para el Frontend (actualizada con purchaseUrl)
export interface Medicine {
  id: string;
  name: string;
  presentation: string;
  price: number;
  image: string;
  purchaseUrl: string;
  category: string;
}


// Interfaz para la respuesta RAW del API
interface ApiMedicineRow {
  categoria:string;
  sub_categoria:string;
  medicamento_id: number;
  name_product: string;
  esta_disponible: boolean;
  url_image: string;
  precio: number;
  moneda: string;
  url_compra: string;
  presentacion: string;
  id_especialidad: number;
}

/**
 * Mapea la respuesta del API de medicamentos al formato de Frontend (Medicine).
 * @param apiData Los datos crudos del API.
 * @returns Los datos mapeados para el frontend.
 */
function mapApiToMedicine(apiData: ApiMedicineRow[]): Medicine[] {
  if (!apiData) return [];
  
  return apiData.map(item => ({
    id: String(null), // Convertir ID (number) a string
    name: item.name_product,
    presentation: item.presentacion,
    price: item.precio,
    image: item.url_image,
    purchaseUrl: item.url_compra,
    category: item.categoria,
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