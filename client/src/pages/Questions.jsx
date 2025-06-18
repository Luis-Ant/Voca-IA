import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { questions } from "../data/questions";
import Progress from "../components/Progress";
import { motion, useAnimationControls } from "framer-motion";

export default function Questions() {
  const {
    answers,
    setAnswers,
    currentStep,
    setCurrentStep,
    selectedRama,
    setSelectedRama,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState("fase1");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const titleControls = useAnimationControls();
  const subtitleControls = useAnimationControls();
  const contentControls = useAnimationControls();
  const footerControls = useAnimationControls();

  // Variantes para CADA ELEMENTO INDIVIDUAL del título
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

  // Variantes para el CONTENEDOR PRINCIPAL del título
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Retraso entre la aparición de cada elemento (0.2 segundos)
        delayChildren: 0.1, // Retraso antes de que el primer elemento empiece a aparecer
      },
    },
    shiftUp: {
      y: -200,
      transition: { duration: 3, ease: [0.7, 0.1, 0, 0.5] },
    },
  };

  // Variantes para el subtítulo
  const subtitleVariants = {
    hidden: { opacity: 0, y: 0 },
    shiftUp: {
      y: -200,
      opacity: 1,
      transition: {
        duration: 3,
        ease: [0.7, 0.1, 0, 0.5],
        opacity: {
          delay: 1,
          duration: 3,
        },
      },
    },
  };

  // Variantes para cada elemento de la lista
  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    shiftUp: {
      y: -200,
      opacity: 1,
      transition: {
        duration: 3,
        ease: [0.7, 0.1, 0, 0.5],
        opacity: {
          delay: 1.2,
          duration: 3,
        },
        staggerChildren: 0.1, // Opcional: Si los elementos hijos tienen sus propias animaciones de entrada, esto las escalonará.
      },
    },
  };

  // Variantes para los botones de opción
  const footerVariants = {
    hidden: { opacity: 0, y: 150 },
    shiftUp: {
      y: 250,
      opacity: 1,
      transition: {
        duration: 3,
        ease: [0.7, 0.1, 0, 0.5],
        opacity: {
          delay: 1.5,
          duration: 3,
        },
      },
    },
  };

  useEffect(() => {
    // Inicializar la primera pregunta
    if (currentPhase === "fase1") {
      console.log("phase", currentPhase);
      setCurrentQuestion(questions.fase1[currentQuestionIndex]);
      console.log("Question", currentQuestion);
    } else {
      const ramaQuestions = questions.fase2[selectedRama];
      if (ramaQuestions) {
        setCurrentQuestion(ramaQuestions[currentQuestionIndex]);
      }
    }
  }, [currentPhase, currentQuestionIndex, selectedRama]);

  useEffect(() => {
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      await titleControls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await Promise.all([
        titleControls.start("shiftUp"),
        subtitleControls.start("shiftUp"),
        contentControls.start("shiftUp"),
        new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
          footerControls.start("shiftUp");
        }),
      ]);
    };
    sequence();
  }, [titleControls, subtitleControls, contentControls, footerControls]);

  const handleAnswer = (answer) => {
    // Guardar la respuesta
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        answer,
        weight: currentQuestion.weight,
        type: currentPhase === "fase1" ? "rama" : "carrera",
      },
    }));

    // Verificar si es la última pregunta
    if (currentPhase === "fase1") {
      if (currentQuestionIndex < questions.fase1.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Terminamos la fase 1, vamos a la fase 2
        setCurrentPhase("fase2");
        setCurrentQuestionIndex(0);
      }
    } else {
      // Fase 2
      const ramaQuestions = questions.fase2[selectedRama];
      if (ramaQuestions && currentQuestionIndex < ramaQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Terminamos todas las preguntas, enviar resultados al backend
        handleSendResults();
      }
    }
  };

  const handleSendResults = async () => {
    try {
      // Aquí iría la lógica para enviar los resultados al backend
      console.log("Resultados:", answers);
      navigate("/resultados");
    } catch (error) {
      console.error("Error al enviar resultados:", error);
    }
  };

  if (!currentQuestion) {
    return <div>Cargando preguntas...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="w-full max-w-2xl text-center">
        {/* Title */}
        <motion.h1
          className="text-center text-neutral-300 text-4xl md:text-5xl font-thin mb-2"
          initial="hidden"
          animate={titleControls}
          variants={titleContainerVariants}
        >
          <motion.span className="" variants={titleElementVariants}>
            {currentPhase === "fase1" ? "Fase 1" : "Fase 2"}
          </motion.span>
        </motion.h1>
        {/* subtitle */}
        <motion.h2
          className="text-center text-neutral-300 text-2xl md:text-3xl font-thin mb-2"
          initial="hidden"
          animate={subtitleControls}
          variants={subtitleVariants}
        >
          {currentPhase === "fase1"
            ? "Determinación de Rama"
            : `Preguntas de ${selectedRama}`}
        </motion.h2>
        {/* Content */}
        <motion.div
          className="absolute w-full max-w-2xl px-6 py-12 text-neutral-300"
          initial="hidden"
          animate={contentControls}
          variants={contentVariants}
        >
          <p className="text-lg text-gray-700 mb-4">
            {currentQuestion.question}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => handleAnswer(true)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Sí
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        {/* <motion.div
          className="text-sm text-gray-500"
          initial="hidden"
          animate={footerControls}
          variants={footerVariants}
        >
          Pregunta {currentQuestionIndex + 1} de {currentPhase === 'fase1' ? questions.fase1.length : questions.fase2[selectedRama]?.length || 0}
          <Progress 
            currentStep={currentPhase === 'fase1' ? currentQuestionIndex : questions.fase1.length + currentQuestionIndex + 1}
            totalSteps={questions.fase1.length + (questions.fase2[selectedRama]?.length || 0)}
          />
        </motion.div> */}
      </div>
    </div>
  );
}
