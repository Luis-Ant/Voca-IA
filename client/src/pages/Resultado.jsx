import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";

export default function QuizResults() {
  const location = useLocation();
  const result = location.state?.result;

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Manejo básico de si no hay resultado (ej. acceso directo a la URL)
  if (!result) {
    return (
      <div className="min-h-scree px-5 bg-neutral-950 text-red-500 flex items-center justify-center text-center text-2xl p-4">
        Error: No se encontraron resultados. Por favor, completa el formulario.
        <button
          className="mt-6 w-full max-w-2xl md:w-auto px-20 py-3 bg-gray-300 text-neutral-950 text-md font-normal rounded-full border-2 border-gray-300 transition-all duration-500 ease-in-out hover:border-gray-600 hover:bg-zinc-950 hover:text-neutral-300"
          onClick={() => (window.location.href = "/")} // Redirige a la página principal
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  useEffect(() => {
    const sequence = async () => {
      await titleControls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Espera 1.5 segundos antes de iniciar la animación del subtítulo
      await Promise.all([
        titleControls.start("shiftUp"),
        contentControls.start("shiftUp"),
        new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
          // Espera 2 segundos antes de iniciar la animación del footer
          footerControls.start("shiftUp");
        }),
      ]);
    };
    sequence();
  }, [titleControls, contentControls, footerControls]);

  // Desestructurar el objeto `result` del backend.
  // Recordatorio de las propiedades de `result` de Flask:
  // - status: 'resultado_final', 'empate_ramas_desempate', 'empate_carrera'
  // - rama_sugerida: Nombre de la rama
  // - carreras_sugeridas: Array de strings (carreras o ramas si es empate de ramas)
  const { status, rama_sugerida, carreras_sugeridas } = result;

  // Determinar el tipo de resultado para el diseño (single, multiple, empate)
  let resultTypeDesign;
  if (
    status === "resultado_final" &&
    carreras_sugeridas &&
    carreras_sugeridas.length === 1
  ) {
    resultTypeDesign = "single";
  } else if (
    status === "resultado_final" &&
    carreras_sugeridas &&
    carreras_sugeridas.length > 1
  ) {
    resultTypeDesign = "multiple"; // Esto si el resultado final puede dar múltiples carreras
  } else if (status === "empate_carrera") {
    resultTypeDesign = "empate"; // Empate de carreras
  } else if (status === "empate_ramas_desempate") {
    // Si es empate de ramas, lo mostraremos como "multiple" para la UI de carreras
    // pero con un mensaje diferente, y `carreras_sugeridas` contendrá las ramas.
    resultTypeDesign = "multiple_ramas_empatadas";
  } else {
    resultTypeDesign = "default"; // Para cualquier otro caso no previsto
  }

  // Props a pasar al componente basado en el diseño
  // Nota: `careers` ahora siempre será `carreras_sugeridas` de Flask
  // `areaName` será `rama_sugerida`
  const areaName = rama_sugerida || "tu área de interés"; // Fallback si rama_sugerida es nula
  const careersToDisplay = carreras_sugeridas || [];

  const getTitle = () => {
    switch (resultTypeDesign) {
      case "empate":
        return "Empate entre Carreras";
      case "single":
        return "Tu Carrera Ideal";
      case "multiple":
        return "Tus Mejores Opciones";
      case "multiple_ramas_empatadas":
        return "Empate entre Ramas"; // Título específico para empate de ramas
      default:
        return "Resultados del Quiz";
    }
  };

  const getSubtitle = () => {
    switch (resultTypeDesign) {
      case "empate":
        return "Explora estas opciones con entusiasmo.";
      case "single":
        return "¡Hemos encontrado tu match perfecto!";
      case "multiple":
        return "Estas carreras se alinean con tus intereses.";
      case "multiple_ramas_empatadas":
        return "Explora estas áreas con entusiasmo."; // Subtítulo para empate de ramas
      default:
        return "Descubre tu futuro profesional.";
    }
  };

  const getMainMessage = () => {
    if (resultTypeDesign === "empate") {
      return `Has mostrado el mismo interés por varias carreras en el área de ${areaName}. ¡Todas son excelentes opciones!`;
    } else if (resultTypeDesign === "multiple_ramas_empatadas") {
      return `Has mostrado el mismo interés por las siguientes ramas. ¡Explora cada una a fondo para encontrar tu camino!`;
    }
    return `Tu perfil se alinea perfectamente con ${
      resultTypeDesign === "single"
        ? "la carrera en el área de"
        : "carreras en el área de"
    } ${areaName}.`;
  };

  const onRestart = () => {
    window.location.href = "/"; // Reinicia la aplicación y vuelve al inicio
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl mx-auto my-15">
        {/* /* Título */}
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
            {getTitle()}
          </motion.span>
        </motion.h1>
        {/* Subtitulo */}
        <motion.h2
          className="text-center text-2xl md:text-3xl font-thin text-neutral-200 mx-15"
          initial="hidden"
          animate={contentControls}
          variants={contentVariants}
        >
          {getSubtitle()}
        </motion.h2>
        {/* Results content */}
        <motion.div
          className="w-full flex flex-col items-center text-center px-5 mt-0 mb-5 md:mb-15"
          initial="hidden"
          animate={contentControls}
          variants={contentVariants}
        >
          <p className="flex items-center justify-center min-h-[220px] md:min-h-[180px] w-full text-xl font-thin text-gray-400 mx-5">
            {getMainMessage()}
          </p>
          {/* Career options */}
          <div className="space-y-4 max-w-md mx-auto mb-5">
            {careersToDisplay.map(
              (
                item,
                index // 'item' será carrera o rama
              ) => (
                <div
                  key={index}
                  className="bg-gray-300 rounded-lg p-4 border-2 border-gray-300 transition-all duration-500 ease-in-out hover:border-gray-600 hover:bg-zinc-950 hover:text-neutral-300"
                >
                  <h3 className="text-xl font-thin text-neutral-950">{item}</h3>
                </div>
              )
            )}
          </div>
          {/* Statistics section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light mb-2">
                {careersToDisplay.length}
              </div>
              <div className="text-gray-400 text-sm">
                {resultTypeDesign === "multiple_ramas_empatadas"
                  ? "Ramas"
                  : "Carreras"}
                <br />
                Recomendadas
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light mb-2">75+</div>
              <div className="text-gray-400 text-sm">
                Carreras Analizadas
                <br />
                por IA
              </div>
            </div>
          </div>
        </motion.div>
        {/* Action button */}
        <motion.div
          className="w-full flex flex-col items-center justify-center px-6 pt-6 pb-0 md:pb-4"
          initial="hidden"
          animate={footerControls}
          variants={footerVariants}
        >
          <button
            onClick={onRestart}
            className="w-full max-w-2xl md:w-auto px-20 py-3 bg-gray-300 text-neutral-950 text-md font-normal rounded-full border-2 border-gray-300 transition-all duration-500 ease-in-out hover:border-gray-600 hover:bg-zinc-950 hover:text-neutral-300 mb-6"
          >
            Volver a Empezar
          </button>
          <p className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm md:text-base text-center">
            Explora más opciones o refina tus resultados.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
