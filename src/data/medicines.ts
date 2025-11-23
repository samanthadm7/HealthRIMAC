
const MEDICINE_API_URL = 'https://motor-busqueda-rfcjnvenka-uk.a.run.app/search/busqueda_medicamentos';

export interface Medicine {
  id: string;
  name: string;
  presentation: string;
  price: number;
  image: string;
  purchaseUrl: string;
  category: string;
}


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


function mapApiToMedicine(apiData: ApiMedicineRow[]): Medicine[] {
  if (!apiData) return [];
  
  return apiData.map(item => ({
    id: String(null), 
    name: item.name_product,
    presentation: item.presentacion,
    price: item.precio,
    image: item.url_image,
    purchaseUrl: item.url_compra,
    category: item.categoria,
  }));
}

export async function getMedicinesBySpecialty(specialtyId?: number): Promise<Medicine[]> {

  const idToSend = specialtyId ?? null; 
  
  try {
    const payload = {
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
      return [];
    }

    const apiData: ApiMedicineRow[] = await response.json();
    return mapApiToMedicine(apiData);

  } catch (error) {
    console.error("Fetch error for medicines:", error);
    return [];
  }
}