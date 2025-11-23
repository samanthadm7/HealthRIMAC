import requests
from bs4 import BeautifulSoup
import pandas as pd
import datetime
import re
import time

BASE_URL = "https://clinicaangloamericana.pe/medicos/"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

DIAS_MAP = {
    "LU": "Lunes", "MA": "Martes", "MI": "Miércoles", 
    "JU": "Jueves", "VI": "Viernes", "SA": "Sábado", "DO": "Domingo"
}

DIRECCIONES = {
    "San Isidro": "Alfredo Salazar N° 350, San Isidro",
    "La Molina": "Av. La Fontana 362, La Molina",
    "Edificio Dr. Fleck": "Av. Emilio Cavenecia 250, San Isidro"
}

DISTRITOS = {
    "San Isidro": "San Isidro",
    "La Molina": "La Molina",
    "Edificio Dr. Fleck": "San Isidro"
}

def get_soup(url):
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            return BeautifulSoup(res.content, 'html.parser')
    except Exception as e:
        print(f"Error en {url}: {e}")
    return None

def parse_doctor_detail(doctor_url, basic_info):
    soup = get_soup(doctor_url)
    if not soup:
        return []

    full_data_rows = []
    
    cmp_code = ""
    rne_code = ""
    experiencia = ""
    
    cv_div = soup.find('div', id='cv-ficha')
    if cv_div:
        cv_text = cv_div.get_text(" ", strip=True)
        
        cmp_match = re.search(r'CMP:?\s*(\d+)', cv_text)
        if cmp_match: cmp_code = cmp_match.group(1)
            
        rne_match = re.search(r'RNE:?\s*(\d+)', cv_text)
        if rne_match: rne_code = rne_match.group(1)
            
        experiencia = cv_text.replace("CV", "").replace("CMP:", "").replace(cmp_code, "").replace("RNE:", "").replace(rne_code, "").strip()
        if len(experiencia) > 200: experiencia = experiencia[:200] + "..."

    content_area = soup.find('div', class_='entry-content')
    
    current_sede = "Sede Principal"
    current_address = ""
    current_distrito = ""
    
    if content_area:
        rows = content_area.find_all('div', class_=lambda x: x and ('single-horarios' in x or 'row-underline' in x))
        
        for row in rows:
            classes = row.get('class', [])
            
            if 'single-horarios' in classes:
                header_text = row.get_text(strip=True)
                current_sede_title = header_text.replace("Horarios", "").strip()
                current_sede = current_sede_title
                
                if "Fleck" in current_sede: 
                    current_address = DIRECCIONES["Edificio Dr. Fleck"]
                    current_distrito = DISTRITOS["Edificio Dr. Fleck"]
                elif "Molina" in current_sede: 
                    current_address = DIRECCIONES["La Molina"]
                    current_distrito = DISTRITOS["La Molina"]
                elif "Isidro" in current_sede: 
                    current_address = DIRECCIONES["San Isidro"]
                    current_distrito = DISTRITOS["San Isidro"]
                else:
                    current_address = DIRECCIONES.get(current_sede, "Dirección no especificada")
                    current_distrito = DISTRITOS.get(current_sede, "")

            elif 'row-underline' in classes:
                col_label = row.find('div', class_='col-md-5')
                col_value = row.find('div', class_='col-md-7')
                
                if col_label and col_value:
                    label_text = col_label.get_text(strip=True).upper().replace(".", "")
                    value_text = col_value.get_text(strip=True)
                    
                    if any(day in label_text for day in ["LU", "MA", "MI", "JU", "VI", "SA", "DO"]):
                        
                        hora_inicio = ""
                        hora_fin = ""
                        horas_match = re.search(r'(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})', value_text)
                        if horas_match:
                            hora_inicio = horas_match.group(1)
                            hora_fin = horas_match.group(2)
                        
                        dias_raw = label_text.split(',')
                        for dia_abr in dias_raw:
                            dia_clean = dia_abr.strip()
                            nombre_dia = DIAS_MAP.get(dia_clean, dia_clean)
                            
                            item = {
                                'clinica': 'Clínica Anglo Americana',
                                'nombre_completo': basic_info['name'].lower(),
                                'cmp': cmp_code,
                                'codigo_medico': basic_info['id'],
                                'activo': True,
                                'experiencia': experiencia,
                                'url_imagen': basic_info['img'],
                                'url_cita': basic_info['url'], 
                                'especialidad_slug': basic_info['specialty'].lower().replace(" ", "-"),
                                'especialidad': basic_info['specialty'],
                                'description_card': f"Médico especialista en {basic_info['specialty']}",
                                'sede_slug': current_sede.lower().replace(" ", "-"),
                                'sede_title': current_sede,
                                'sede_adress': current_address,
                                'distrito': current_distrito, 
                                'tipo_atencion_slug': 'presencial',
                                'tipo_atencion_title': 'Presencial',
                                'dia': nombre_dia,
                                'hora_inicio': hora_inicio,
                                'hora_fin': hora_fin,
                                'fecha_scraping': str(datetime.date.today())
                            }
                            full_data_rows.append(item)

    if not full_data_rows:
        item = {
            'clinica': 'Clínica Anglo Americana',
            'nombre_completo': basic_info['name'].lower(),
            'cmp': cmp_code,
            'codigo_medico': basic_info['id'],
            'activo': True,
            'experiencia': experiencia,
            'url_imagen': basic_info['img'],
            'url_cita': basic_info['url'], 
            'especialidad': basic_info['specialty'],
            'sede_title': 'No especificado',
            'distrito': '',
            'dia': '', 'hora_inicio': '', 'hora_fin': '',
            'fecha_scraping': str(datetime.date.today())
        }
        full_data_rows.append(item)
        
    return full_data_rows

all_records = []

for page in range(1, 24): 
    if page == 1:
        url = BASE_URL
    else:
        url = f"{BASE_URL}page/{page}/?nombre-doctor="
    
    print(f"Scrapeando Listado Página {page}: {url}")
    soup = get_soup(url)
    
    if not soup: 
        print(f"No se pudo cargar la página {page}")
        break
    
    cards = soup.find_all('div', class_='fl-post-grid-post')
    
    if not cards:
        print(f"No se encontraron más médicos en la página {page}. Deteniendo.")
        break

    for card in cards:
        try:
            title_tag = card.find('h2', class_='fl-post-title')
            link_tag = title_tag.find('a')
            name = link_tag.get_text(strip=True)
            profile_url = link_tag['href'] 
            
            post_id = "unknown"
            classes = card.get('class', [])
            for c in classes:
                if c.startswith('post-') and c != 'post-grid-post':
                    post_id = c.replace('post-', '')
            
            spec_tag = card.find('div', class_='xterms')
            specialty = spec_tag.get_text(strip=True) if spec_tag else "General"
            
            img_tag = card.find('div', class_='fl-post-image').find('img')
            img_url = img_tag['src'] if img_tag else ""
            
            basic_info = {
                'name': name,
                'url': profile_url, 
                'id': post_id,
                'specialty': specialty,
                'img': img_url
            }
            
            print(f"  -> Procesando: {name}")
            
            doctor_records = parse_doctor_detail(profile_url, basic_info)
            all_records.extend(doctor_records)
            
            time.sleep(0.5)
            
        except Exception as e:
            print(f"Error procesando tarjeta de médico: {e}")

if all_records:
    df = pd.DataFrame(all_records)
    df.to_json('medicos_anglo_final.json', orient='records', force_ascii=False, indent=4)
    df.to_csv('medicos_anglo_final.csv', index=False, encoding='utf-8-sig')
    print(f"Proceso terminado exitosamente. {len(all_records)} registros generados.")
else:
    print("No se extrajeron registros.")