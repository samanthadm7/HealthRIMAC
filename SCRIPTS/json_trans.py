import json
 
input_file = "medicos_sanpablo_final.json"        
output_file = "medicos_san_pablo.json" 
 
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f) 
 
with open(output_file, "w", encoding="utf-8") as f:
    for item in data:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")
 
print("✅ Archivo NDJSON generado:", output_file)