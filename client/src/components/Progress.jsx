import { motion } from "framer-motion";

const Progress = ({ currentStep, totalSteps }) => {
  const progress = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full bg-neutral-700 rounded-full h-2.5 mb-6">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-neutral-300 h-2.5 rounded-full"
      />
    </div>
  );
};

export default Progress;
