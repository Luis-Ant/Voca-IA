import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import EmmaProfile from "../assets/emma-profile.webp";

export default function Home() {
  const navigate = useNavigate();
  const titleControls = useAnimationControls();
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
      y: "25vh",
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Retraso entre la aparición de cada elemento (0.2 segundos)
        delayChildren: 0.1, // Retraso antes de que el primer elemento empiece a aparecer
      },
    },
    shiftUp: {
      y: "0vh",
      transition: { duration: 3, ease: [0.7, 0.1, 0, 0.5] },
    },
  };

  // Variantes para el subtítulo
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

  // Variantes para los botones de opción
  const footerVariants = {
    hidden: { opacity: 0, y: "25vh" },
    shiftUp: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 3,
        ease: [0.7, 0.1, 0, 0.5],
        opacity: {
          delay: 1.5,
          duration: 5,
        },
      },
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Agrupa subtítulo, contenido y footer en un solo bloque centrado
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl mx-auto my-15">
        {/* Título Principal */}
        <motion.div
          className="flex items-center justify-center mb-4"
          initial="hidden"
          animate={titleControls}
          variants={titleContainerVariants}
        >
          <motion.h1 className="text-center text-neutral-300 text-4xl md:text-5xl font-thin mb-2 flex items-center justify-center">
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
              Eva
            </motion.span>
          </motion.h1>
        </motion.div>
        {/* Contenido */}
        <motion.div
          className="w-full flex flex-col items-center"
          initial="hidden"
          animate={contentControls}
          variants={contentVariants}
        >
          {/* Subtítulo */}
          <div className="text-center text-3xl md:text-4xl font-thin text-neutral-200 mb-4 mx-15">
            Encuentra tu carrera ideal
          </div>
          {/* Contenido */}
          <div className="w-full flex flex-col items-center">
            <div className="mx-5 mb-6 mt-2 max-w-2xl">
              <div className="text-neutral-200 text-lg md:text-xl font-normal leading-relaxed mx-15 mb-6 text-center">
                ¡Descubre tu Potencial, Elige tu Futuro!
              </div>
              <div className="text-lg text-gray-400 font-light leading-relaxed text-center">
                Bienvenido al primer paso hacia tu camino profesional. Eva,
                nuestra IA experta, te guía a través de un quiz interactivo
                diseñado para adolescentes como tú. Identifica tus intereses y
                descubre las carreras que realmente te apasionan.
              </div>
            </div>
            <div className="mb-6 max-w-2xl w-full mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center p-4">
                  <span className="text-5xl md:text-6xl font-thin text-gray-200 mb-2">
                    3
                  </span>
                  <span className="text-gray-500 font-extralight text-sm md:text-base tracking-wider">
                    Diferentes Campos Profesionales
                  </span>
                </div>
                <div className="flex flex-col items-center p-4">
                  <span className="text-5xl md:text-6xl font-thin text-gray-200 mb-2">
                    75+
                  </span>
                  <span className="text-gray-500 font-extralight text-sm md:text-base tracking-wider">
                    Carreras Sugeridas por IA
                  </span>
                </div>
                <div className="flex flex-col items-center p-4">
                  <span className="text-5xl md:text-6xl font-thin text-gray-200 mb-2">
                    95%
                  </span>
                  <span className="text-gray-500 font-extralight text-sm md:text-base tracking-wider">
                    Satisfacción de la Comunidad
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <motion.footer
            className="w-full flex flex-col items-center justify-center gap-4 py-4"
            initial="hidden"
            animate={footerControls}
            variants={footerVariants}
          >
            <motion.button
              className="w-full max-w-xs md:w-auto px-8 py-4 bg-gray-300 text-neutral-950 text-md font-normal rounded-full border-2 border-gray-300 transition-all duration-500 ease-in-out hover:border-gray-600 hover:bg-zinc-950 hover:text-neutral-300"
              onClick={() => navigate("/questions")}
            >
              ¡Empieza Ahora!
            </motion.button>
            <motion.div className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm md:text-base text-center">
              Tu futuro profesional comienza aquí.
            </motion.div>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}
