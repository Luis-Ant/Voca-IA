from flask import Flask, request, jsonify
from flask_cors import CORS # Importar CORS para permitir solicitudes desde tu frontend React

app = Flask(__name__)
CORS(app, origins=["https://voca-ia.onrender.com"])

# Preguntas generales por rama
preguntas_generales = {
    "Ingeniería y Ciencias Físico Matemáticas": [
        "¿Te interesa cómo funcionan las máquinas?",
        "¿Disfrutas resolver problemas matemáticos complejos?",
        "¿Te gusta conocer las nuevas tecnologías?",
        "¿Te interesa conocer cómo se crean las nuevas tecnologías?",
        "¿Te gustan la física o las matemáticas?",
        "¿Te gusta realizar experimentos?",
        "¿Te gustaría diseñar soluciones tecnológicas para problemas cotidianos?",
        "¿Te interesa la investigación científica y el desarrollo de nuevas teorías?",
        "¿Te motiva trabajar en proyectos de innovación tecnológica?"
    ],
    "Ciencias Médico Biológicas": [
        "¿Te interesa el funcionamiento del cuerpo humano?",
        "¿Te gustaría trabajar en un hospital o laboratorio clínico?",
        "¿Te preocupas por la salud y el bienestar de las personas?",
        "¿Te interesan los animales?",
        "¿Te gustaría investigar sobre nuevas enfermedades y tratamientos?",
        "¿Te interesa la genética y la biotecnología?",
        "¿Te gustaría participar en campañas de salud pública?"
    ],
    "Ciencias Sociales y Administrativas": [
        "¿Te interesa liderar equipos o proyectos?",
        "¿Consideras que tienes la capacidad de resolver problemas entre equipos de trabajo?",
        "¿Eres organizado con tareas y tiempos?",
        "¿Te gusta exponer en las clases?",
        "¿Te gusta comunicarte con las personas y trabajar en equipo?",
        "¿Disfrutas analizar la sociedad y su funcionamiento?",
        "¿Te interesa comprender el comportamiento de grupos sociales?",
        "¿Te gustaría emprender tu propio negocio?",
        "¿Te motiva influir en políticas públicas o sociales?"
    ]
}

# Carreras y preguntas específicas por rama
ramas = {
    "Ingeniería y Ciencias Físico Matemáticas": {
        "carreras": {
            "Ingeniería en Sistemas Computacionales": [
                "¿Te gusta resolver problemas usando la tecnología?",
                "¿Pasas mucho tiempo en la computadora y disfrutas aprender cosas nuevas sobre ella?",
                "¿Te interesa crear aplicaciones o páginas web?"
            ],
            "Ingeniería Industrial": [
                "¿Te gusta organizar y hacer que las cosas funcionen mejor?",
                "¿Cuando ves un problema, piensas en diferentes formas de solucionarlo?",
                "¿Te interesa saber cómo se hacen los productos que usas diariamente?"
            ],
            "Ingeniería Civil": [
                "¿Te llaman la atención los edificios altos y las construcciones grandes?",
                "¿Te gusta trabajar con las manos y crear cosas?",
                "¿Te interesa participar en proyectos que beneficien a muchas personas?"
            ],
            "Ingeniería Mecánica": [
                "¿Te gusta desarmar cosas para ver cómo funcionan?",
                "¿Te interesan los carros, motos o cualquier máquina?",
                "¿Eres bueno resolviendo problemas con objetos que se mueven?"
            ],
            "Ingeniería Eléctrica": [
                "¿Te has preguntado cómo llega la electricidad a tu casa?",
                "¿Te gusta experimentar con aparatos electrónicos?",
                "¿Te interesa entender cómo funcionan las cosas que se conectan a la luz?"
            ],
            "Ingeniería Electrónica": [
                "¿Te fascinan los celulares, videojuegos y gadgets tecnológicos?",
                "¿Te gusta armar o reparar aparatos electrónicos?",
                "¿Te interesa saber qué hay dentro de los dispositivos que usas?"
            ],
            "Ingeniería en Comunicaciones y Electrónica": [
                "¿Te llama la atención cómo funciona el internet y los celulares?",
                "¿Te gusta estar al día con las nuevas tecnologías?",
                "¿Te interesa cómo se transmiten los mensajes y videos por internet?"
            ],
            "Ingeniería Química Industrial": [
                "¿Te gustaban los experimentos en el laboratorio de química?",
                "¿Te interesa saber cómo se fabrican productos como medicinas o cosméticos?",
                "¿Te llama la atención transformar materiales para crear algo nuevo?"
            ],
            "Ingeniería Aeronáutica": [
                "¿Te emocionas cuando ves aviones volando?",
                "¿Te ha gustado armar modelos de aviones o cohetes?",
                "¿Sueñas con viajar al espacio o trabajar con tecnología espacial?"
            ],
            "Licenciatura en Física y Matemáticas": [
                "¿Las matemáticas son una de tus materias favoritas?",
                "¿Te gusta entender el 'por qué' de las cosas que pasan en la naturaleza?",
                "¿Disfrutas resolviendo problemas complicados paso a paso?"
            ]
        }
    },
    "Ciencias Médico Biológicas": {
        "carreras": {
            "Médico Cirujano y Partero": [
                "¿Te gusta ayudar a las personas cuando se sienten mal?",
                "¿Te interesa el cuerpo humano y cómo funciona?",
                "¿Te sientes cómodo hablando con personas que están pasando por momentos difíciles?"
            ],
            "Cirujano Dentista (Odontología)": [
                "¿Te gusta trabajar con cuidado y precisión en tareas pequeñas?",
                "¿Te interesa ayudar a las personas a tener una sonrisa bonita?",
                "¿Eres paciente y te gusta hacer trabajos detallados?"
            ],
            "Químico Bacteriólogo Parasitólogo": [
                "¿Te gustaba usar el microscopio en las clases de biología?",
                "¿Te interesa investigar y descubrir cosas que no se ven a simple vista?",
                "¿Te gusta hacer experimentos y analizar resultados?"
            ],
            "Licenciatura en Enfermería": [
                "¿Te gusta cuidar a las personas cuando están enfermas?",
                "¿Eres una persona empática que se preocupa por el bienestar de otros?",
                "¿Te sientes cómodo en hospitales o centros de salud?"
            ],
            "Ingeniería Biomédica": [
                "¿Te interesan tanto la tecnología como la medicina?",
                "¿Te gusta la idea de crear aparatos que ayuden a curar personas?",
                "¿Te llama la atención combinar ciencias exactas con ciencias de la salud?"
            ],
            "Licenciatura en Optometría": [
                "¿Te interesa ayudar a las personas a ver mejor?",
                "¿Eres detallista y te gusta hacer exámenes o revisiones cuidadosas?",
                "¿Te llama la atención trabajar con lentes y aparatos para medir la vista?"
            ],
            "Químico Farmacéutico Biólogo": [
                "¿Te interesa cómo se hacen las medicinas?",
                "¿Te gustaban las clases de química y biología?",
                "¿Te llama la atención trabajar en laboratorios?"
            ],
            "Licenciatura en Nutrición": [
                "¿Te interesa la relación entre la comida y la salud?",
                "¿Te gusta cocinar o saber sobre alimentos saludables?",
                "¿Te motiva ayudar a las personas a sentirse mejor a través de lo que comen?"
            ],
            "Ingeniería Biotecnológica": [
                "¿Te interesa usar la tecnología para mejorar la vida de las personas?",
                "¿Te llama la atención la biología y también la tecnología?",
                "¿Te gusta la idea de crear productos naturales usando ciencia?"
            ],
            "Licenciatura en Psicología": [
                "¿Te gusta escuchar a tus amigos cuando tienen problemas?",
                "¿Te interesa entender por qué las personas actúan como lo hacen?",
                "¿Eres bueno dando consejos y ayudando a otros a sentirse mejor?"
            ]
        }
    },
    "Ciencias Sociales y Administrativas": {
        "carreras": {
            "Contador Público": [
                "¿Eres bueno con los números y te gusta hacer cuentas?",
                "¿Te gusta tener todo organizado y en orden?",
                "¿Te interesa ayudar a las personas o empresas con su dinero?"
            ],
            "Licenciatura en Administración Industrial": [
                "¿Te gusta liderar grupos y organizar actividades?",
                "¿Eres bueno coordinando a tus compañeros para hacer proyectos?",
                "¿Te interesa hacer que las cosas funcionen mejor en tu escuela o casa?"
            ],
            "Licenciatura en Relaciones Comerciales": [
                "¿Eres bueno convenciendo a las personas o vendiendo cosas?",
                "¿Te gusta conocer gente nueva y hacer amigos fácilmente?",
                "¿Te interesa saber qué productos le gustan a las personas?"
            ],
            "Licenciatura en Negocios Internacionales": [
                "¿Te gusta conocer sobre otros países y sus culturas?",
                "¿Te interesa viajar y trabajar con personas de diferentes lugares?",
                "¿Te llama la atención cómo se compran y venden cosas entre países?"
            ],
            "Licenciatura en Ciencias de la Informática": [
                "¿Te gusta organizar información y hacer listas?",
                "¿Eres bueno usando computadoras y programas?",
                "¿Te interesa ayudar a las personas a encontrar información fácilmente?"
            ],
            "Licenciatura en Administración": [
                "¿Te gusta tomar decisiones y resolver problemas?",
                "¿Tus amigos te piden ayuda para organizar eventos o actividades?",
                "¿Te interesa tener tu propio negocio algún día?"
            ],
            "Licenciatura en Trabajo Social": [
                "¿Te gusta ayudar a personas que tienen problemas?",
                "¿Te interesa trabajar con niños, adultos mayores o familias?",
                "¿Te motiva hacer que tu comunidad sea un lugar mejor?"
            ],
            "Licenciatura en Turismo": [
                "¿Te gusta viajar y conocer lugares nuevos?",
                "¿Disfrutas organizando paseos o actividades divertidas?",
                "¿Te interesa mostrarle a otros los lugares bonitos que conoces?"
            ],
            "Licenciatura en Comercio Internacional": [
                "¿Te interesa cómo llegan los productos de otros países a México?",
                "¿Te gusta la idea de trabajar en aeropuertos o fronteras?",
                "¿Te llama la atención el intercambio de productos entre países?"
            ],
            "Licenciatura en Administración y Desarrollo Empresarial": [
                "¿Te gusta tener ideas nuevas para negocios?",
                "¿Te interesa ayudar a que las empresas pequeñas crezcan?",
                "¿Eres creativo y te gusta pensar en soluciones innovadoras?"
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