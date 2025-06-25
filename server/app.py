from flask import Flask, request, jsonify
from flask_cors import CORS # Importar CORS para permitir solicitudes desde tu frontend React

app = Flask(__name__)
CORS(app, origins="*")

# Preguntas generales por rama
preguntas_generales = {
    "Ingeniería y Ciencias Físico Matemáticas": [
        "¿Te interesa cómo funcionan las máquinas?",
        "¿Disfrutas resolver problemas matemáticos complejos?","¿Te gusta conocer las nuevas tecnologías?",
        "¿Te interesa conocer cómo se crean las nuevas tecnologías?",
        "¿Te gustan la física o las matemáticas?",
        "¿Te gusta realizar experimentos?"
    ],
    "Ciencias Médico Biológicas": [
        "¿Te interesa el funcionamiento del cuerpo humano?",
        "¿Te gustaría trabajar en un hospital o laboratorio clínico?",
        "¿Te preocupas por la salud y el bienestar de las personas?",
        "¿Te interesan los animales?"
    ],
    "Ciencias Sociales y Administrativas": [
        "¿Te interesa liderar equipos o proyectos?",
        "¿Consideras que tienes la capacidad de resolver problemas entre equipos de trabajo?",
        "¿Eres organizado con tareas y tiempos?",
        "¿Te gusta exponer en las clases?",
        "¿Te gusta comunicarte con las personas y trabajar en equipo?",
        "¿Disfrutas analizar la sociedad y su funcionamiento?"
    ]
}

# Carreras y preguntas específicas por rama
ramas = {
    "Ingeniería y Ciencias Físico Matemáticas": {
        "carreras": {
            "Ingeniería Automotriz": [
                "¿Te gustaría conocer el funcionamiento de los carros?",
                "¿Te interesa el diseño de motores y sistemas mecánicos?",
                "¿Te gustaría trabajar en una armadora de autos?"
            ],
            "Ingeniería Civil": [
                "¿Te interesa diseñar puentes, carreteras o edificios?",
                "¿Te gustaría trabajar en obras de construcción?",
                "¿Te interesa la física aplicada a estructuras?"
            ],
            "Ingeniería en Computación":[
                "¿Te interesa programar?",
                "¿Te interesa conocer el funcionamiento de las computadoras?"
            ],
            "Ingeniería Eléctrica": [
                "¿Te interesa cómo funciona la electricidad?",
                "¿Te gustaría trabajar con redes eléctricas?"
            ],
            "Ingeniería Electrónica": [
                "¿Te gustan los circuitos?",
                "¿Te interesa la robótica?"
            ],
            "Ingeniería Industrial": [
                "¿Te interesa optimizar procesos?",
                "¿Te gustaría trabajar en fábricas o industrias?"
            ],
            "Ingeniería Mecánica": [
                "¿Te interesa cómo funcionan las máquinas?",
                "¿Te gusta el diseño mecánico?"
            ],
            "Ingeniería Mecatrónica": [
                "¿Te interesa la robótica?",
                "¿Te gustan los sistemas automáticos?"
            ],
            "Ingeniería en Sistemas Computacionales": [
                "¿Te interesa el desarrollo de software?",
                "¿Te gustaría trabajar en ciberseguridad?"
            ],
            "Arquitectura": [
                "¿Te gusta el diseño de espacios?",
                "¿Te interesa el dibujo técnico?"
            ],
            "Actuaría": [
                "¿Te interesan los seguros y estadísticas?",
                "¿Te gustan los modelos matemáticos?"
            ],
            "Ingeniería en Alimentos": [
                "¿Te interesa la producción y conservación de alimentos?",
                "¿Te gustaría trabajar en la industria alimentaria?",
                "¿Te interesa la química de los alimentos?"
            ],
            "Ingeniería en Comunicaciones y Electrónica": [
                "¿Te interesa cómo se transmiten señales electrónicas?",
                "¿Te gustaría trabajar en telecomunicaciones?",
                "¿Te interesan los sistemas electrónicos modernos?"
            ],
            "Ingeniería en Control y Automatización": [
                "¿Te interesa automatizar procesos industriales?",
                "¿Te gustaría diseñar sistemas de control?",
                "¿Te interesan los sensores y actuadores?"
            ],
            "Ingeniería en Energía": [
                "¿Te interesa cómo se genera y distribuye la energía?",
                "¿Te gustaría trabajar con energías renovables?",
                "¿Te interesa la eficiencia energética?"
            ],
            "Ingeniería en Informática": [
                "¿Te gusta programar y resolver problemas con software?",
                "¿Te interesa el diseño de bases de datos?",
                "¿Te gustaría trabajar en desarrollo web o móvil?"
            ],
            "Ingeniería en Inteligencia Artificial": [
                "¿Te interesa el aprendizaje automático?",
                "¿Te gustaría crear sistemas que tomen decisiones?",
                "¿Te interesa la ciencia de datos y el análisis predictivo?"
            ],
            "Ingeniería en Metalurgia y Materiales": [
                "¿Te interesa estudiar y modificar materiales?",
                "¿Te gustaría trabajar con metales y aleaciones?",
                "¿Te interesan los procesos de fundición y tratamiento térmico?"
            ],
            "Ingeniería en Movilidad Urbana": [
                "¿Te interesa mejorar el transporte en las ciudades?",
                "¿Te gustaría diseñar soluciones de movilidad?",
                "¿Te interesan los sistemas de transporte público?"
            ],
            "Ingeniería en Negocios Energéticos Sustentables": [
                "¿Te interesa combinar energía y negocios?",
                "¿Te gustaría desarrollar proyectos sustentables?",
                "¿Te interesa el impacto ambiental de las energías?"
            ],
            "Ingeniería en Robótica Industrial": [
                "¿Te interesa diseñar robots para líneas de producción?",
                "¿Te gusta la automatización y control de máquinas?",
                "¿Te gustaría integrar electrónica, mecánica y software?"
            ],
            "Ingeniería en Sistemas Ambientales": [
                "¿Te preocupa el impacto ambiental de la industria?",
                "¿Te interesa el tratamiento de residuos y aguas?",
                "¿Te gustaría trabajar en sostenibilidad?"
            ],
            "Ingeniería en Sistemas Energéticos y Redes Inteligentes": [
                "¿Te interesa mejorar la eficiencia energética?",
                "¿Te gustaría trabajar con redes eléctricas inteligentes?",
                "¿Te interesan las energías renovables y su integración?"
            ],
            "Ingeniería en Transporte": [
                "¿Te interesa planear sistemas de transporte?",
                "¿Te gustaría mejorar la logística y movilidad?",
                "¿Te interesa la infraestructura vial?"
            ],
            "Ingeniería Farmacéutica": [
                "¿Te interesa la producción de medicamentos?",
                "¿Te gustaría trabajar en la industria farmacéutica?",
                "¿Te interesa la química y la biotecnología?"
            ],
            "Ingeniería Ferroviaria": [
                "¿Te interesa el transporte por trenes?",
                "¿Te gustaría diseñar vías y trenes?",
                "¿Te interesa la logística ferroviaria?"
            ],
            "Ingeniería Fotónica": [
                "¿Te interesan los sistemas que usan luz y láseres?",
                "¿Te gustaría trabajar con fibras ópticas?",
                "¿Te interesa la comunicación óptica?"
            ],
            "Ingeniería Geofísica": [
                "¿Te interesa estudiar la Tierra con tecnología?",
                "¿Te gustaría trabajar en exploración sísmica?",
                "¿Te interesan los fenómenos geológicos?"
            ],
            "Ingeniería Geológica": [
                "¿Te interesa el estudio de rocas y suelos?",
                "¿Te gustaría trabajar en minería o construcción?",
                "¿Te interesan los procesos de formación terrestre?"
            ],
            "Ingeniería Matemática": [
                "¿Te gusta aplicar las matemáticas a problemas reales?",
                "¿Te interesa la modelación matemática?",
                "¿Te gustaría trabajar en docencia o investigación científica?"
            ],
            "Ingeniería Mecatrónica": [
                "¿Te interesa combinar electrónica y mecánica?",
                "¿Te gustaría diseñar sistemas inteligentes?",
                "¿Te gusta la automatización de procesos?"
            ],
            "Ingeniería Metalúrgica": [
                "¿Te interesa trabajar con metales y materiales?",
                "¿Te gustaría estudiar la resistencia de materiales?",
                "¿Te interesa la industria siderúrgica?"
            ],
            "Ingeniería Petrolera": [
                "¿Te interesa la extracción de petróleo?",
                "¿Te gustaría trabajar en plataformas petroleras?",
                "¿Te interesa la geología y la ingeniería de yacimientos?"
            ],
            "Ingeniería Química Industrial": [
                "¿Te interesa la transformación de materias primas?",
                "¿Te gustaría trabajar en la industria química?",
                "¿Te interesan los procesos de producción?"
            ],
            "Ingeniería Química Petrolera": [
                "¿Te interesa el procesamiento de hidrocarburos?",
                "¿Te gustaría trabajar en refinerías?",
                "¿Te interesa la ingeniería de procesos químicos?"
            ],
            "Ingeniería Telemática": [
                "¿Te interesa la combinación de telecomunicaciones e informática?",
                "¿Te gustaría trabajar con redes de datos?",
                "¿Te interesan los servicios en la nube?"
            ],
            "Ingeniería Textil": [
                "¿Te interesa el diseño y producción de telas?",
                "¿Te gustaría trabajar en la industria de la moda?",
                "¿Te interesan los materiales textiles innovadores?"
            ],
            "Licenciatura en Ciencias de Datos": [
                "¿Te interesa analizar grandes cantidades de información?",
                "¿Te gustaría trabajar con estadísticas y programación?",
                "¿Te interesan los algoritmos de predicción?"
            ],
            "Licenciatura en Ciencias de la Informática": [
                "¿Te interesa la teoría computacional y algoritmos?",
                "¿Te gustaría trabajar en desarrollo de software?",
                "¿Te interesa la inteligencia artificial y la seguridad informática?"
            ],
            "Licenciatura en Física y Matemáticas": [
                "¿Te apasionan las ciencias exactas?",
                "¿Te gustaría investigar fenómenos físicos y matemáticos?",
                "¿Te interesa trabajar en docencia o investigación científica?"
            ],
            "Licenciatura en Matemática Algorítmica": [
                "¿Te interesan los algoritmos y su optimización?",
                "¿Te gusta resolver problemas complejos con lógica matemática?",
                "¿Te gustaría trabajar en criptografía o inteligencia artificial?"
            ]
        }
    },
    "Ciencias Médico Biológicas": {
        "carreras": {
            "Medicina": [
                "¿Te gustaría ayudar a sanar personas?",
                "¿Te interesa el cuerpo humano y sus enfermedades?",
                "¿Te ves trabajando en un hospital?"
            ],
            "Odontología": [
                "¿Te interesa la salud bucal?",
                "¿Te gustaría trabajar con dientes y encías?",
                "¿Te gustaría tener tu propio consultorio dental?"
            ],
            "Veterinaria": [
                "¿Te gustan los animales?",
                "¿Te gustaría cuidarlos o curarlos?",
                "¿Te interesa la biología y el comportamiento animal?"
            ]
        }
    },
    "Ciencias Sociales y Administrativas": {
        "carreras": {
            "Derecho": [
                "¿Te interesa la justicia y las leyes?",
                "¿Te gustaría defender a personas o causas?",
                "¿Te ves trabajando en juzgados o despachos jurídicos?"
            ],
            "Administración": [
                "¿Te interesa cómo funcionan las empresas?",
                "¿Te gustaría liderar un equipo de trabajo?",
                "¿Te interesa la gestión de recursos humanos o financieros?"
            ],
            "Psicología": [
                "¿Te interesa el comportamiento humano?",
                "¿Te gustaría ayudar a las personas a resolver sus problemas?",
                "¿Te interesa el estudio de la mente y las emociones?"
            ]
        }
    }
}

@app.route('/api/preguntas_generales', methods=['GET'])
def get_preguntas_generales():
    """
    Endpoint para obtener las preguntas generales de las ramas de estudio.
    """
    return jsonify(preguntas_generales)

@app.route('/api/evaluar_ramas', methods=['POST'])
def evaluar_ramas():
    """
    Endpoint para evaluar las respuestas de las preguntas generales
    y determinar la rama o ramas sugeridas.
    Espera un JSON del frontend con el formato:
    {
        "Ingeniería y Ciencias Físico Matemáticas_0": "sí",
        "Ciencias Médico Biológicas_1": "no",
        ...
    }
    """
    respuestas_frontend = request.get_json() # Obtener el body JSON
    if not respuestas_frontend:
        return jsonify({"error": "No se recibieron datos"}), 400

    puntajes = {rama: 0 for rama in preguntas_generales}

    for rama_key, preguntas_list in preguntas_generales.items():
        for i in range(len(preguntas_list)):
            question_id = f"{rama_key}_{i}"
            if respuestas_frontend.get(question_id) == "sí":
                puntajes[rama_key] += 1

    max_puntaje = max(puntajes.values())
    ramas_con_max_puntaje = [rama for rama, p in puntajes.items() if p == max_puntaje]

    if len(ramas_con_max_puntaje) > 1:
        # Si hay un empate, recopilamos las preguntas de carrera para TODAS las ramas empatadas
        preguntas_para_desempate = {}
        for rama_empatada in ramas_con_max_puntaje:
            if rama_empatada in ramas: # Aseguramos que la rama exista
                preguntas_para_desempate[rama_empatada] = ramas[rama_empatada]["carreras"]

        return jsonify({
            "status": "empate_ramas_desempate", # Nuevo estado para indicar un empate que requiere desempate con más preguntas
            "ramas_sugeridas": ramas_con_max_puntaje,
            "message": "Mostraste el mismo nivel de interés por varias áreas. Por favor, responde las siguientes preguntas para afinar la sugerencia.",
            "preguntas_para_desempate": preguntas_para_desempate # Incluimos las preguntas de todas las ramas empatadas
        })
    else:
        rama_elegida = ramas_con_max_puntaje[0]
        # Devolver las preguntas específicas de la rama elegida
        return jsonify({
            "status": "rama_elegida",
            "rama_sugerida": rama_elegida,
            "preguntas_carreras": ramas[rama_elegida]["carreras"]
        })

@app.route('/api/evaluar_carrera', methods=['POST'])
def evaluar_carrera():
    """
    Endpoint para evaluar las respuestas de las preguntas específicas de carrera
    y determinar la carrera o carreras sugeridas.
    Espera un JSON del frontend con el formato:
    {
        "rama": "Nombre de la Rama" (si es rama_specific),
        "ramas_desempate": ["Rama1", "Rama2"] (si es tie_breaking),
        "respuestas": {
            "Carrera1_0": "sí",
            "Carrera2_1": "no",
            ...
        }
    }
    """
    data = request.get_json() # Obtener el body JSON
    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400

    rama_contexto = data.get("rama") # Para fase 'rama_specific'
    respuestas_frontend = data.get("respuestas", {}) # Respuestas de las carreras
    ramas_desempate_contexto = data.get("ramas_desempate", []) # Para fase 'tie_breaking'

    # Determinar qué carreras evaluar basado en el contexto
    carreras_a_evaluar_data = {}
    if rama_contexto and rama_contexto in ramas: # Si viene de una rama específica
        carreras_a_evaluar_data = ramas[rama_contexto]["carreras"]
    elif ramas_desempate_contexto: # Si viene de un desempate de ramas
        for rama_actual in ramas_desempate_contexto:
            if rama_actual in ramas:
                carreras_a_evaluar_data.update(ramas[rama_actual]["carreras"])
    else:
        return jsonify({"error": "No se proporcionó contexto de rama o desempate válido"}), 400

    if not carreras_a_evaluar_data:
        return jsonify({"error": "No se encontraron carreras para evaluar en el contexto dado"}), 400

    puntajes_carrera_global = {} # Para almacenar puntajes de todas las carreras de todas las ramas involucradas

    for carrera_name, preguntas_carrera in carreras_a_evaluar_data.items():
        puntaje = 0
        for i in range(len(preguntas_carrera)):
            question_id = f"{carrera_name}_{i}" # Formato "Carrera_Indice"
            if respuestas_frontend.get(question_id) == "sí":
                puntaje += 1
        puntajes_carrera_global[carrera_name] = puntaje

    if not puntajes_carrera_global:
        # Esto puede ocurrir si no hay preguntas de carrera o ninguna respuesta "sí"
        return jsonify({"status": "no_carreras_evaluadas", "message": "No se pudieron evaluar carreras con los datos proporcionados."})

    max_puntaje = max(puntajes_carrera_global.values())
    mejores_carreras = [c for c, p in puntajes_carrera_global.items() if p == max_puntaje]

    if len(mejores_carreras) > 1:
        # Si aún hay un empate después de las preguntas específicas
        return jsonify({
            "status": "empate_carrera",
            "rama_sugerida": rama_contexto if rama_contexto else "Múltiples Ramas", # Puede ser la rama original o un indicador de múltiples
            "carreras_sugeridas": mejores_carreras,
            "message": f"Has mostrado el mismo interés por varias carreras. Te recomendamos investigar más sobre estas opciones para tomar una mejor decisión."
        })
    else:
        # Caso de carrera única sugerida
        carrera_ganadora = mejores_carreras[0]
        rama_final_sugerida = rama_contexto # Por defecto, la rama del contexto

        # Si el flujo fue un desempate de ramas, buscamos la rama de la carrera ganadora
        if ramas_desempate_contexto:
            for r_name in ramas_desempate_contexto:
                if carrera_ganadora in ramas[r_name]["carreras"]:
                    rama_final_sugerida = r_name
                    break

        return jsonify({
            "status": "resultado_final",
            "rama_sugerida": rama_final_sugerida,
            "carreras_sugeridas": mejores_carreras, # Aunque sea una, se devuelve como lista
            "message": "La carrera que más se ajusta a tus intereses es:"
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Asegúrate de que el puerto sea el 5000, o el que uses en el frontend