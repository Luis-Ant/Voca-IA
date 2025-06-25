import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import Progress from "../components/Progress.jsx";
import { motion, useAnimationControls } from "framer-motion";

export default function Questions() {
  const { answers, setAnswers, selectedRama, setSelectedRama } =
    useContext(AppContext);
  const navigate = useNavigate();

  // Estados principales para controlar el flujo de la aplicación
  const [currentPhase, setCurrentPhase] = useState("general"); // 'general', 'rama_specific', 'tie_breaking'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null); // La pregunta actual que se muestra
  const [answered, setAnswered] = useState(false); // Indica si la pregunta actual ya fue respondida para habilitar/deshabilitar el botón Siguiente

  // Nuevo estado para controlar cuándo se disparan las animaciones
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Nuevos estados para almacenar las preguntas obtenidas de la API y las listas dinámicas
  const [generalQuestionsData, setGeneralQuestionsData] = useState({});
  const [flattenedGeneralQuestions, setFlattenedGeneralQuestions] = useState(
    []
  );
  const [careerQuestionsData, setCareerQuestionsData] = useState({});
  const [displayedQuestionsList, setDisplayedQuestionsList] = useState([]);
  const [ramasEmpatadas, setRamasEmpatadas] = useState([]);

  // Estados para manejar carga y errores de la API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controles de animación
  const titleControls = useAnimationControls();
  const contentControls = useAnimationControls();
  const footerControls = useAnimationControls();

  // Variantes de animación (sin cambios)
  const titleElementVariants = {
    hidden: { opacity: 0, y: 25, x: -50, scale: 0.5, rotate: 5 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      y: "25vh",
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1,
      },
    },
    shiftUp: {
      y: "0vh",
      transition: { duration: 3, ease: [0.7, 0.1, 0, 0.5] },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: "25vh" },
    shiftUp: {
      y: "0vh",
      opacity: 1,
      transition: {
        duration: 3,
        ease: [0.7, 0.1, 0, 0.5],
        opacity: {
          delay: 1,
          duration: 3,
          ease: "easeInOut",
        },
      },
    },
  };

  const footerVariants = {
    hidden: { opacity: 0, y: "25vh" },
    shiftUp: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: [0.7, 0.1, 0, 0.5],
        opacity: {
          delay: 1.5,
          duration: 3,
        },
      },
    },
  };

  // --- Funciones Auxiliares para procesar datos de la API ---

  const flattenGeneralQuestions = useCallback((questionsObj) => {
    let flattened = [];
    Object.entries(questionsObj).forEach(([rama, questionsArray]) => {
      questionsArray.forEach((qText, index) => {
        flattened.push({
          id: `${rama}_${index}`,
          question: qText,
          rama: rama,
          type: "general",
        });
      });
    });
    return flattened;
  }, []);

  const flattenCareerQuestions = useCallback(
    (careerQuestionsByRamaObj) => {
      let flattened = [];
      if (
        !careerQuestionsByRamaObj ||
        typeof careerQuestionsByRamaObj !== "object"
      ) {
        console.warn(
          "Invalid careerQuestionsByRamaObj provided to flattenCareerQuestions",
          careerQuestionsByRamaObj
        );
        return [];
      }

      Object.entries(careerQuestionsByRamaObj).forEach(
        ([ramaOrCareerName, nestedQuestionsOrCareers]) => {
          if (Array.isArray(nestedQuestionsOrCareers)) {
            nestedQuestionsOrCareers.forEach((qText, index) => {
              flattened.push({
                id: `${ramaOrCareerName}_${index}`,
                question: qText,
                rama: selectedRama,
                carrera: ramaOrCareerName,
                type: "career",
              });
            });
          } else if (typeof nestedQuestionsOrCareers === "object") {
            Object.entries(nestedQuestionsOrCareers).forEach(
              ([carrera, questionsArray]) => {
                if (Array.isArray(questionsArray)) {
                  questionsArray.forEach((qText, index) => {
                    flattened.push({
                      id: `${carrera}_${index}`,
                      question: qText,
                      rama: ramaOrCareerName,
                      carrera: carrera,
                      type: "career",
                    });
                  });
                }
              }
            );
          }
        }
      );
      return flattened;
    },
    [selectedRama]
  );

  // --- Funciones de Llamada a la API ---

  const handleEvaluateRamas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const answersPayload = {};
      flattenedGeneralQuestions.forEach((q) => {
        if (answers[q.id] !== undefined) {
          answersPayload[q.id] = answers[q.id];
        }
      });

      console.log("Enviando a /api/evaluar_ramas:", answersPayload);

      const response = await fetch("http://127.0.0.1:5000/api/evaluar_ramas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answersPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Resultado de Evaluación de Ramas:", result);

      if (result.status === "rama_elegida") {
        setSelectedRama(result.rama_sugerida);
        setCareerQuestionsData(result.preguntas_carreras);
        const newDisplayedQuestions = flattenCareerQuestions(
          result.preguntas_carreras
        );
        setDisplayedQuestionsList(newDisplayedQuestions);
        setCurrentPhase("rama_specific");
        setCurrentQuestionIndex(0);
        setAnswered(false);
        setAnimationTrigger((prev) => prev + 1); // <--- DISPARA ANIMACIÓN
      } else if (result.status === "empate_ramas_desempate") {
        setRamasEmpatadas(result.ramas_sugeridas);
        setCareerQuestionsData(result.preguntas_para_desempate);
        const newDisplayedQuestions = flattenCareerQuestions(
          result.preguntas_para_desempate
        );
        setDisplayedQuestionsList(newDisplayedQuestions);
        setCurrentPhase("tie_breaking");
        setCurrentQuestionIndex(0);
        setAnswered(false);
        setAnimationTrigger((prev) => prev + 1); // <--- DISPARA ANIMACIÓN
      } else {
        setError("Respuesta inesperada del servidor al evaluar ramas.");
      }
    } catch (e) {
      setError(
        "Error al evaluar las ramas. Asegúrate de que el backend esté corriendo."
      );
      console.error("Error al evaluar ramas:", e);
    } finally {
      setIsLoading(false);
    }
  }, [
    answers,
    flattenedGeneralQuestions,
    flattenCareerQuestions,
    setSelectedRama,
  ]);

  const handleEvaluateCarrera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        respuestas: {},
      };

      displayedQuestionsList.forEach((q) => {
        if (q.type === "career" && answers[q.id] !== undefined) {
          payload.respuestas[q.id] = answers[q.id];
        }
      });

      if (currentPhase === "rama_specific") {
        payload.rama = selectedRama;
      } else if (currentPhase === "tie_breaking") {
        payload.ramas_desempate = ramasEmpatadas;
      }

      console.log("Enviando a /api/evaluar_carrera:", payload);

      const response = await fetch(
        "http://127.0.0.1:5000/api/evaluar_carrera",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Resultado de Evaluación de Carrera:", result);

      navigate("/results", { state: { result } });
    } catch (e) {
      setError(
        "Error al evaluar las carreras. Asegúrate de que el backend esté corriendo."
      );
      console.error("Error al evaluar carrera:", e);
    } finally {
      setIsLoading(false);
    }
  }, [
    answers,
    currentPhase,
    displayedQuestionsList,
    navigate,
    ramasEmpatadas,
    selectedRama,
  ]);

  // --- useEffect Hooks para control de flujo y UI ---

  // 1. Efecto para la carga inicial de preguntas generales desde la API
  useEffect(() => {
    const fetchInitialQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://127.0.0.1:5000/api/preguntas_generales"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGeneralQuestionsData(data);
        const flattened = flattenGeneralQuestions(data);
        setFlattenedGeneralQuestions(flattened);
        setDisplayedQuestionsList(flattened);
        setAnimationTrigger((prev) => prev + 1); // <--- DISPARA ANIMACIÓN EN CARGA INICIAL
      } catch (e) {
        setError("Error al cargar las preguntas iniciales.");
        console.error("Error fetching initial questions:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialQuestions();
  }, [flattenGeneralQuestions]);

  // 2. Efecto para actualizar la pregunta actual y el estado de 'answered'
  useEffect(() => {
    if (
      displayedQuestionsList.length > 0 &&
      currentQuestionIndex < displayedQuestionsList.length
    ) {
      const nextQuestion = displayedQuestionsList[currentQuestionIndex];
      setCurrentQuestion(nextQuestion);
      setAnswered(answers[nextQuestion?.id] !== undefined);
    } else if (
      displayedQuestionsList.length > 0 &&
      currentQuestionIndex >= displayedQuestionsList.length
    ) {
      setCurrentQuestion(null);
      setAnswered(false);
    }
  }, [currentQuestionIndex, displayedQuestionsList, answers, isLoading, error]);

  // 3. EFECTO CORREGIDO PARA CONTROLAR LAS ANIMACIONES POR FASE
  useEffect(() => {
    // Las animaciones se dispararán solo cuando 'animationTrigger' cambie
    // (es decir, en la carga inicial y al cambiar de fase)
    if (!isLoading && !error) {
      const sequence = async () => {
        // Reinicia las animaciones
        await titleControls.stop();
        await contentControls.stop();
        await footerControls.stop();

        titleControls.set("hidden");
        contentControls.set("hidden");
        footerControls.set("hidden");

        await new Promise((resolve) => setTimeout(resolve, 1));
        await titleControls.start("visible");
        await Promise.all([
          titleControls.start("shiftUp"), // Incluimos titleControls.start("shiftUp") aquí si quieres que el título también se mueva
          contentControls.start("shiftUp"),
          new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            footerControls.start("shiftUp");
          }),
        ]);
      };
      sequence();
    }
  }, [
    animationTrigger, // <--- Nueva dependencia: solo se ejecuta cuando este valor cambia
    isLoading,
    error,
    titleControls,
    contentControls,
    footerControls,
  ]);

  // --- Manejadores de Eventos de Usuario ---

  const handleAnswer = useCallback(
    async (answer) => {
      const questionId = currentQuestion.id;
      const isYes = answer ? "sí" : "no";

      setAnswers((prev) => ({
        ...prev,
        [questionId]: isYes,
      }));

      const isLastQuestionInList =
        currentQuestionIndex === displayedQuestionsList.length - 1;

      if (isLastQuestionInList) {
        setTimeout(() => {
          if (currentPhase === "general") {
            handleEvaluateRamas();
          } else if (
            currentPhase === "rama_specific" ||
            currentPhase === "tie_breaking"
          ) {
            handleEvaluateCarrera();
          }
        }, 500);
      } else {
        setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 200);
      }
    },
    [
      currentQuestion,
      currentQuestionIndex,
      displayedQuestionsList.length,
      currentPhase,
      handleEvaluateRamas,
      handleEvaluateCarrera,
      setAnswers,
    ]
  );

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      if (currentPhase !== "general") {
        setCurrentPhase("general");
        setDisplayedQuestionsList(flattenedGeneralQuestions);
        setCurrentQuestionIndex(flattenedGeneralQuestions.length - 1);
        setAnimationTrigger((prev) => prev + 1); // <--- DISPARA ANIMACIÓN AL REGRESAR A FASE GENERAL
      }
    }
  }, [currentQuestionIndex, currentPhase, flattenedGeneralQuestions]);

  const handleNext = useCallback(() => {
    if (
      !answered ||
      currentQuestionIndex === displayedQuestionsList.length - 1
    ) {
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  }, [answered, currentQuestionIndex, displayedQuestionsList.length]);

  // --- Renderizado Condicional de la UI ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center text-2xl">
        Cargando preguntas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-red-500 flex items-center justify-center text-2xl">
        Error: {error}
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center text-2xl">
        Finalizando fase...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl mx-auto my-15">
        {/* Título de la Fase */}
        <motion.h1
          className="flex items-center justify-center mb-4 md:mb-10"
          initial="hidden"
          animate={titleControls}
          variants={titleContainerVariants}
        >
          <motion.span
            className="text-center text-neutral-300 text-5xl md:text-6xl font-thin mb-2 flex items-center justify-center"
            variants={titleElementVariants}
          >
            {currentPhase === "general"
              ? "Fase 1"
              : currentPhase === "rama_specific"
              ? "Fase 2"
              : "Desempate"}
          </motion.span>
        </motion.h1>
        {/* Subtítulo de la Fase */}
        <motion.h2
          className="text-center text-xl md:text-2xl font-thin text-neutral-200 mx-15"
          initial="hidden"
          animate={contentControls}
          variants={contentVariants}
        >
          {currentPhase === "general"
            ? "Selecciona la opción que mejor te represente."
            : currentPhase === "rama_specific"
            ? "Responde estas preguntas para afinar tu perfil."
            : "Varias ramas mostraron interés similar. Responde estas preguntas para afinar tu perfil."}
        </motion.h2>
        {/* Contenido de la Pregunta y Opciones */}
        <motion.div
          className="w-full flex flex-col items-center text-center mt-0 md:mt-10 mb-5 md:mb-15"
          initial="hidden"
          animate={contentControls}
          variants={contentVariants}
        >
          <>
            <div className="flex items-center justify-center min-h-[220px] md:min-h-[180px] w-full">
              <p className="text-2xl font-thin text-gray-400 mb-10 mx-5 w-full">
                {currentQuestion.question}
              </p>
            </div>
            <div className="space-y-6 space-x-6 text-xl font-extrabold mx-20">
              <button
                onClick={() => handleAnswer(true)}
                className={`w-full max-w-2xl md:w-auto px-20 py-3 bg-gray-300 text-neutral-950 text-md font-normal rounded-full border-2 border-gray-300 transition-all duration-500 ease-in-out hover:border-gray-600 hover:bg-zinc-950 hover:text-neutral-300 ${
                  answers[currentQuestion.id] === "sí" // Solo para resaltar
                    ? "ring-3 ring-cyan-400"
                    : ""
                }`}
                // No disabled para permitir cambiar respuesta
              >
                Sí
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className={`w-full max-w-2xl md:w-auto px-20 py-3 bg-zinc-950 text-neutral-300 text-md font-normal rounded-full border-2 border-gray-600 transition-all duration-500 ease-in-out hover:border-gray-300 hover:bg-gray-300 hover:text-neutral-950 ${
                  answers[currentQuestion.id] === "no" // Solo para resaltar
                    ? "ring-3 ring-cyan-400"
                    : ""
                }`}
                // No disabled para permitir cambiar respuesta
              >
                No
              </button>
            </div>
          </>
        </motion.div>
        {/* Footer con Barra de Progreso y Navegación */}
        <motion.div
          className="w-full flex flex-col items-center justify-center px-6 pt-6 md:pt-20 pb-0 md:pb-4"
          initial="hidden"
          animate={footerControls}
          variants={footerVariants}
        >
          <Progress
            currentStep={currentQuestionIndex + 1}
            totalSteps={displayedQuestionsList.length}
          />
          {/* Controles de Navegación */}
          <div className="flex flex-row items-center justify-between w-full mt-6 mx-10 select-none">
            {/* Botón Anterior */}
            <div
              onClick={
                currentQuestionIndex === 0 && currentPhase === "general"
                  ? null
                  : handlePrev
              } // Deshabilita click si es la primera pregunta de la fase general
              className={`flex items-center gap-1 cursor-pointer transition-opacity duration-200 ${
                currentQuestionIndex === 0 && currentPhase === "general" // Deshabilitado solo al inicio absoluto del cuestionario
                  ? "opacity-40 text-gray-500 cursor-not-allowed"
                  : "hover:text-white text-gray-300"
              }`}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-thin">Anterior</span>
            </div>
            {/* Botón Siguiente */}
            <div
              onClick={handleNext}
              className={`flex items-center gap-1 cursor-pointer justify-end transition-opacity duration-200 ${
                !answered || // Deshabilitado si la pregunta actual no ha sido respondida
                currentQuestionIndex === displayedQuestionsList.length - 1 // Deshabilitado si es la última pregunta
                  ? "opacity-40 text-gray-500 cursor-not-allowed"
                  : "hover:text-white text-gray-300"
              }`}
              style={{ minWidth: 90 }}
            >
              <span className="font-thin">Siguiente</span>
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
