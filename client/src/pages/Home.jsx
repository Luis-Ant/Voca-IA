import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import EmmaProfile from "../assets/emma-profile.webp";

export default function Home() {
  const navigate = useNavigate();
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
      y: -150,
      transition: { duration: 3, ease: [0.7, 0.1, 0, 0.5] },
    },
  };

  // Variantes para el subtítulo
  const subtitleVariants = {
    hidden: { opacity: 0, y: 50 },
    shiftUp: {
      y: -50,
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
    hidden: { opacity: 0, y: 100 },
    shiftUp: {
      y: 0,
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
    hidden: { opacity: 0, y: -50 },
    shiftUp: {
      y: 0,
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
    const sequence = async () => {
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

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      {/* Contenedor principal centrado */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="w-full max-w-2xl mx-auto">
          {/* Sección del título y subtítulo */}
          <div className="w-full flex items-center justify-center">
            <motion.h1
              className="absolute h-screen top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-neutral-300 text-4xl md:text-5xl font-thin mb-4"
              initial="hidden"
              animate={titleControls}
              variants={titleContainerVariants}
            >
              <motion.span
                className="inline-block mr-2"
                variants={titleElementVariants}
              >
                Hola, soy
              </motion.span>
              <motion.img
                className="inline-block mx-2 rounded-full w-16 h-16 object-cover"
                variants={titleElementVariants}
                src={EmmaProfile}
                alt="Emma's profile"
              />
              <motion.span
                className="inline-block ml-2"
                variants={titleElementVariants}
              >
                Eva.
              </motion.span>
            </motion.h1>

            <motion.div
              className="text-center text-4xl md:text-5xl font-thin text-neutral-200"
              initial="hidden"
              animate={subtitleControls}
              variants={subtitleVariants}
            >
              Encuentra tu carrera ideal
            </motion.div>
          </div>

          {/* Contenido principal */}
          <motion.div
            className="w-full text-neutral-300"
            initial="hidden"
            animate={contentControls}
            variants={contentVariants}
          >
            {/* Sección de Bienvenida e Introducción */}
            <div className="mb-12">
              <div className="text-xl md:text-2xl font-normal mb-4 leading-tight text-center">
                ¡Descubre tu Potencial, Elige tu Futuro!
              </div>
              <div className="text-lg text-gray-400 font-light leading-relaxed text-center max-w-3xl mx-auto">
                Bienvenido al primer paso hacia tu camino profesional. Eva,
                nuestra IA experta, te guía a través de un quiz interactivo
                diseñado para adolescentes como tú. Identifica tus intereses y
                descubre las carreras que realmente te apasionan.
              </div>
            </div>

            {/* Sección de Datos Clave */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center p-4">
                  <span className="text-5xl md:text-6xl font-thin text-gray-300 mb-4">
                    3
                  </span>
                  <span className="text-gray-500 text-sm md:text-base tracking-wider">
                    Diferentes Campos Profesionales
                  </span>
                </div>
                <div className="flex flex-col items-center p-4">
                  <span className="text-5xl md:text-6xl font-thin text-gray-300 mb-4">
                    250+
                  </span>
                  <span className="text-gray-500 text-sm md:text-base tracking-wider">
                    Carreras Sugeridas por IA
                  </span>
                </div>
                <div className="flex flex-col items-center p-4">
                  <span className="text-5xl md:text-6xl font-thin text-gray-300 mb-4">
                    95%
                  </span>
                  <span className="text-gray-500 text-sm md:text-base tracking-wider">
                    Satisfacción de la Comunidad
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sección de botones y footer */}
          <motion.div
            className="w-full flex flex-col items-center justify-center gap-6"
            initial="hidden"
            animate={footerControls}
            variants={footerVariants}
          >
            <motion.button
              className="w-full md:w-auto px-8 py-4 bg-gray-300 text-neutral-950 text-md font-normal rounded-full border-2 border-gray-300 transition-all duration-500 ease-in-out hover:border-gray-600 hover:bg-zinc-950 hover:text-neutral-300"
              onClick={() => navigate("/questions")}
            >
              ¡Empieza Ahora!
            </motion.button>

            <motion.div className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm md:text-base">
              Tu futuro profesional comienza aquí.
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
