export interface Medicine {
  id: string;
  name: string;
  presentation: string;
  price: number;
  image: string;
}

export const genericMedicines: Medicine[] = [
  {
    id: 'gen-1',
    name: 'Paracetamol',
    presentation: 'Tabletas 500mg x 100',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
  },
  {
    id: 'gen-2',
    name: 'Ibuprofeno',
    presentation: 'Tabletas 400mg x 50',
    price: 15.90,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
  },
  {
    id: 'gen-3',
    name: 'Omeprazol',
    presentation: 'Cápsulas 20mg x 30',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
  },
  {
    id: 'gen-4',
    name: 'Loratadina',
    presentation: 'Tabletas 10mg x 20',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
  },
  {
    id: 'gen-5',
    name: 'Amoxicilina',
    presentation: 'Cápsulas 500mg x 24',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
  },
  {
    id: 'gen-6',
    name: 'Vitamina C',
    presentation: 'Tabletas efervescentes 1g x 20',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
  },
  {
    id: 'gen-7',
    name: 'Complejo B',
    presentation: 'Tabletas x 30',
    price: 19.90,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
  },
  {
    id: 'gen-8',
    name: 'Ranitidina',
    presentation: 'Tabletas 150mg x 30',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
  }
];

export const medicinesBySpecialty: Record<string, Medicine[]> = {
  'Cardiología': [
    {
      id: 'card-1',
      name: 'Atorvastatina',
      presentation: 'Tabletas 20mg x 30',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'card-2',
      name: 'Enalapril',
      presentation: 'Tabletas 10mg x 30',
      price: 28.50,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
      id: 'card-3',
      name: 'Aspirina Protect',
      presentation: 'Tabletas 100mg x 30',
      price: 18.90,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'card-4',
      name: 'Metoprolol',
      presentation: 'Tabletas 50mg x 30',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'card-5',
      name: 'Losartán',
      presentation: 'Tabletas 50mg x 30',
      price: 24.90,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
      id: 'card-6',
      name: 'Clopidogrel',
      presentation: 'Tabletas 75mg x 30',
      price: 52.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    }
  ],
  'Pediatría': [
    {
      id: 'ped-1',
      name: 'Paracetamol Infantil',
      presentation: 'Jarabe 120mg/5ml x 120ml',
      price: 14.50,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
      id: 'ped-2',
      name: 'Amoxicilina Suspensión',
      presentation: 'Suspensión 250mg/5ml x 90ml',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'ped-3',
      name: 'Salbutamol Jarabe',
      presentation: 'Jarabe 2mg/5ml x 120ml',
      price: 18.90,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
      id: 'ped-4',
      name: 'Probióticos Infantiles',
      presentation: 'Sobres x 10 unidades',
      price: 35.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'ped-5',
      name: 'Vitaminas Infantiles',
      presentation: 'Jarabe x 120ml',
      price: 28.50,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
      id: 'ped-6',
      name: 'Cetirizina Gotas',
      presentation: 'Gotas 10mg/ml x 15ml',
      price: 16.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    }
  ],
  'Dermatología': [
    {
      id: 'derm-1',
      name: 'Hidrocortisona Crema',
      presentation: 'Crema 1% x 30g',
      price: 24.50,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop'
    },
    {
      id: 'derm-2',
      name: 'Isotretinoína',
      presentation: 'Cápsulas 20mg x 30',
      price: 89.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'derm-3',
      name: 'Clotrimazol Crema',
      presentation: 'Crema tópica 1% x 20g',
      price: 18.00,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop'
    },
    {
      id: 'derm-4',
      name: 'Protector Solar SPF 50+',
      presentation: 'Loción x 120ml',
      price: 65.00,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop'
    },
    {
      id: 'derm-5',
      name: 'Ácido Retinoico',
      presentation: 'Crema 0.05% x 20g',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop'
    },
    {
      id: 'derm-6',
      name: 'Ketoconazol Champú',
      presentation: 'Champú 2% x 120ml',
      price: 38.50,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop'
    }
  ],
  'Ginecología': [
    {
      id: 'gin-1',
      name: 'Ácido Fólico',
      presentation: 'Tabletas 5mg x 30',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'gin-2',
      name: 'Hierro + Ácido Fólico',
      presentation: 'Tabletas x 30',
      price: 18.50,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
      id: 'gin-3',
      name: 'Metronidazol Óvulos',
      presentation: 'Óvulos 500mg x 10',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'gin-4',
      name: 'Anticonceptivos Orales',
      presentation: 'Tabletas (ciclo 28 días)',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'gin-5',
      name: 'Calcio + Vitamina D',
      presentation: 'Tabletas x 60',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'gin-6',
      name: 'Clotrimazol Óvulos',
      presentation: 'Óvulos 500mg x 6',
      price: 28.50,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    }
  ],
  'Traumatología': [
    {
      id: 'trau-1',
      name: 'Ibuprofeno',
      presentation: 'Tabletas 400mg x 50',
      price: 15.90,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
      id: 'trau-2',
      name: 'Diclofenaco',
      presentation: 'Tabletas 50mg x 30',
      price: 18.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'trau-3',
      name: 'Glucosamina + Condroitina',
      presentation: 'Tabletas x 60',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'trau-4',
      name: 'Complejo B Inyectable',
      presentation: 'Ampollas x 6',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'trau-5',
      name: 'Colágeno Hidrolizado',
      presentation: 'Polvo x 300g',
      price: 68.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'trau-6',
      name: 'Gel Antiinflamatorio',
      presentation: 'Gel tópico x 60g',
      price: 28.50,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop'
    }
  ],
  'Oftalmología': [
    {
      id: 'oft-1',
      name: 'Lágrimas Artificiales',
      presentation: 'Gotas oftálmicas x 15ml',
      price: 24.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'oft-2',
      name: 'Timolol Gotas',
      presentation: 'Gotas oftálmicas 0.5% x 5ml',
      price: 35.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'oft-3',
      name: 'Tobramicina Gotas',
      presentation: 'Gotas oftálmicas x 5ml',
      price: 28.50,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'oft-4',
      name: 'Luteína',
      presentation: 'Cápsulas blandas x 30',
      price: 52.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'oft-5',
      name: 'Vitaminas para la Vista',
      presentation: 'Cápsulas x 60',
      price: 68.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'oft-6',
      name: 'Colirio Lubricante',
      presentation: 'Gotas x 10ml',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    }
  ],
  'Gastroenterología': [
    {
      id: 'gast-1',
      name: 'Omeprazol',
      presentation: 'Cápsulas 20mg x 30',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'gast-2',
      name: 'Hidróxido de Aluminio',
      presentation: 'Suspensión x 240ml',
      price: 18.50,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
      id: 'gast-3',
      name: 'Esomeprazol',
      presentation: 'Cápsulas 40mg x 30',
      price: 35.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'gast-4',
      name: 'Probióticos',
      presentation: 'Cápsulas x 30',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'gast-5',
      name: 'Metoclopramida',
      presentation: 'Tabletas 10mg x 30',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'gast-6',
      name: 'Ranitidina',
      presentation: 'Tabletas 150mg x 30',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    }
  ],
  'Neurología': [
    {
      id: 'neuro-1',
      name: 'Paracetamol + Cafeína',
      presentation: 'Tabletas x 20',
      price: 16.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'neuro-2',
      name: 'Gabapentina',
      presentation: 'Cápsulas 300mg x 30',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
      id: 'neuro-3',
      name: 'Complejo B Forte',
      presentation: 'Tabletas x 30',
      price: 24.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'neuro-4',
      name: 'Memantina',
      presentation: 'Tabletas 10mg x 30',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
      id: 'neuro-5',
      name: 'Omega 3',
      presentation: 'Cápsulas x 60',
      price: 52.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    },
    {
      id: 'neuro-6',
      name: 'Suplemento Cerebral',
      presentation: 'Cápsulas x 30',
      price: 68.00,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop'
    }
  ]
};

export function getMedicinesBySpecialty(specialty: string): Medicine[] {
  if (!specialty) {
    return genericMedicines;
  }
  return medicinesBySpecialty[specialty] || genericMedicines;
}
