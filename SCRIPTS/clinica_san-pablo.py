from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
import requests
import datetime
import time
import re
import urllib3

# Desactivar advertencias de certificados SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --- CONFIGURACIÓN ---
# URL extraída de tu archivo HTML (Línea 444)
BASE_IFRAME_URL = "https://www.qualab.com.pe/staff/"
LIST_URL = f"{BASE_IFRAME_URL}staff-medico-surco.php"

SEDE_INFO = {
    "slug": "surco",
    "title": "San Pablo Surco",
    "address": "Av. El Polo 789",
    "distrito": "Santiago de Surco"
}

# Mapeo de Horarios (IDs del HTML a Texto)
HORARIO_MAP = {
    "L-M": ("Lunes", "M"), "L-T": ("Lunes", "T"),
    "M-M": ("Martes", "M"), "M-T": ("Martes", "T"),
    "X-M": ("Miércoles", "M"), "X-T": ("Miércoles", "T"),
    "J-M": ("Jueves", "M"), "J-T": ("Jueves", "T"),
    "V-M": ("Viernes", "M"), "V-T": ("Viernes", "T"),
    "S-M": ("Sábado", "M"), "S-T": ("Sábado", "T"),
    "D-M": ("Domingo", "M"), "D-T": ("Domingo", "T")
}

# --- FUNCIONES DE DETALLE (USANDO REQUESTS) ---
def get_doctor_details(doctor_id, sede_id, cmp_code):
    """Descarga CV y Horarios usando Requests (Más rápido que Selenium)"""
    
    # Headers para simular ser el navegador
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': LIST_URL
    }
    
    details = {
        "experiencia": "",
        "rne": "",
        "cmp_validado": cmp_code,
        "horarios": []
    }

    # 1. OBTENER CV
    try:
        url_cv = f"{BASE_IFRAME_URL}ver_cv_surco.php?codigo={doctor_id}&zona=curriculo&cmp={cmp_code}&b_sede={sede_id}"
        res_cv = requests.get(url_cv, headers=headers, verify=False, timeout=5)
        if res_cv.status_code == 200:
            soup_cv = BeautifulSoup(res_cv.content, 'html.parser')
            
            # Experiencia (id="curriculo2")
            curr_p = soup_cv.find('p', id='curriculo2')
            if curr_p:
                text = curr_p.get_text(" ", strip=True)
                details["experiencia"] = text[:1000] # Limitar longitud
            
            # RNE (id="rne")
            rne_span = soup_cv.find('span', id='rne')
            if rne_span:
                details["rne"] = rne_span.get_text(strip=True)

    except Exception as e:
        print(f"    [x] Error CV: {e}")

    # 2. OBTENER HORARIOS
    try:
        url_hora = f"{BASE_IFRAME_URL}ver_hora_surco.php?codigo={doctor_id}&zona=horario&b_sede={sede_id}"
        res_hora = requests.get(url_hora, headers=headers, verify=False, timeout=5)
        if res_hora.status_code == 200:
            # Buscar patrones JS: document.getElementById("M-M").innerHTML="11:00 - 12:30\n[506]";
            matches = re.findall(r'document\.getElementById\("([A-Z]-[A-Z])"\)\.innerHTML="(.*?)";', res_hora.text)
            
            for celda, val in matches:
                if not val.strip(): continue
                
                # Limpiar texto (quitar códigos de consultorio entre corchetes [506])
                clean_val = re.sub(r'\s*\[.*?\]', '', val).strip()
                
                # Extraer horas
                hora_match = re.search(r'(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})', clean_val)
                if hora_match:
                    dia_nombre, _ = HORARIO_MAP.get(celda, ("Desconocido", ""))
                    details["horarios"].append({
                        "dia": dia_nombre,
                        "inicio": hora_match.group(1),
                        "fin": hora_match.group(2)
                    })
                    
    except Exception as e:
        print(f"    [x] Error Horario: {e}")

    # Si no se encontraron horarios, devolver uno vacío por defecto
    if not details["horarios"]:
        details["horarios"].append({"dia": "CONSULTAR", "inicio": "", "fin": ""})

    return details


# --- INICIO DEL SCRAPING CON SELENIUM ---

# Configuración Selenium (Visible para depurar)
options = webdriver.ChromeOptions()
options.add_argument('--start-maximized')
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--ignore-certificate-errors') # Importante para Qualab

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

all_records = []

try:
    # Navegamos DIRECTAMENTE al iframe (más estable que entrar a sanpablo.com.pe y cambiar frame)
    print(f"Navegando al sistema de médicos: {LIST_URL}")
    driver.get(LIST_URL)
    
    # Esperar que cargue la tabla de doctores
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "card")))

    # Bucle de páginas (Del 1 al 15)
    for page in range(1, 26):
        print(f"\n--- Procesando Página {page} ---")
        
        # Si no es la página 1, navegamos explícitamente (más seguro que clics)
        if page > 1:
            next_url = f"{LIST_URL}?b_medico=&b_sede=1&b_especialidad=&pag={page}"
            driver.get(next_url)
            time.sleep(2) # Esperar carga

        # Extraer HTML de la página actual para procesarlo rápido con BeautifulSoup
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        
        cards = soup.find_all('div', class_='card')
        
        if not cards:
            print("No se encontraron tarjetas en esta página. Terminando.")
            break
            
        print(f"Encontrados {len(cards)} médicos.")

        for card in cards:
            try:
                body = card.find('div', class_='card-body')
                if not body: continue

                # 1. Nombre
                name_tag = body.find('h3')
                name = name_tag.get_text(strip=True).title() if name_tag else "Desconocido"
                
                # 2. CMP y Especialidad
                spans = body.find_all('span')
                cmp_text = ""
                specialty = "General"
                
                for s in spans:
                    txt = s.get_text(strip=True)
                    if "CMP" in txt:
                        cmp_text = txt
                    elif len(txt) > 3:
                        specialty = txt.title()
                
                # Limpiar CMP
                cmp_clean = re.search(r'(\d+)', cmp_text)
                cmp_val = cmp_clean.group(1) if cmp_clean else "00000"

                # 3. ID Interno (onclick)
                # onclick="ver_curriculo('14770090','f0','35423     ')"
                # Buscamos el botón que tenga ver_curriculo
                btn = card.find('button', onclick=re.compile(r'ver_curriculo'))
                doctor_id = ""
                
                if btn:
                    onclick_val = btn['onclick']
                    # Regex para sacar lo que está entre comillas simples
                    params = re.findall(r"'([^']*)'", onclick_val)
                    if len(params) > 0:
                        doctor_id = params[0]
                
                if not doctor_id:
                    print(f"  [!] Saltando {name} (Sin ID)")
                    continue

                # 4. Imagen
                img_tag = card.find_previous('img') # A veces está antes del body
                if not img_tag: img_tag = card.find('img')
                
                img_url = ""
                if img_tag:
                    src = img_tag.get('src', '')
                    if src:
                        if src.startswith('http'):
                            img_url = src
                        else:
                            img_url = f"https://www.qualab.com.pe/STAFF02/staff-oracle/{src}"

                print(f"  -> Extrayendo detalles: {name} (CMP: {cmp_val})")

                # 5. Obtener Detalles (CV y Horarios) via Requests
                details = get_doctor_details(doctor_id, "1", cmp_val)

                # 6. Generar Filas (Flattening de Horarios)
                for horario in details["horarios"]:
                    item = {
                        'clinica': 'Clínica San Pablo',
                        'nombre_completo': name,
                        'cmp': cmp_val,
                        'codigo_medico': doctor_id,
                        'activo': True,
                        'experiencia': details["experiencia"],
                        'url_imagen': img_url,
                        'url_cita': "https://mivida.sanpablo.com.pe/PortalPaciente/Inicio",
                        'especialidad_slug': specialty.lower().replace(" ", "-"),
                        'especialidad': specialty,
                        'description_card': f"Médico especialista en {specialty}",
                        'sede_slug': SEDE_INFO["slug"],
                        'sede_title': SEDE_INFO["title"],
                        'sede_adress': SEDE_INFO["address"],
                        'distrito': SEDE_INFO["distrito"],
                        'tipo_atencion_slug': 'presencial',
                        'tipo_atencion_title': 'Presencial',
                        'dia': horario["dia"],
                        'hora_inicio': horario["inicio"],
                        'hora_fin': horario["fin"],
                        'fecha_scraping': str(datetime.date.today())
                    }
                    all_records.append(item)

            except Exception as e:
                print(f"Error procesando tarjeta: {e}")
                continue

except Exception as e:
    print(f"Error Crítico en Selenium: {e}")

finally:
    print("Cerrando navegador...")
    driver.quit()

# --- GUARDADO ---
if all_records:
    df = pd.DataFrame(all_records)
    
    # Limpieza final de datos antes de guardar
    df['dia'] = df['dia'].fillna("CONSULTAR")
    df['hora_inicio'] = df['hora_inicio'].fillna("")
    df['hora_fin'] = df['hora_fin'].fillna("")
    
    output_json = 'medicos_sanpablo_final.json'
    output_csv = 'medicos_sanpablo_final.csv'
    
    df.to_json(output_json, orient='records', force_ascii=False, indent=4)
    df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    
    print(f"\n¡PROCESO COMPLETADO CON ÉXITO!")
    print(f"Se extrajeron {len(all_records)} registros (filas de horarios).")
    print(f"Guardado en: {output_json}")
else:
    print("\nNo se extrajeron datos. Revisa los selectores o la conexión.")