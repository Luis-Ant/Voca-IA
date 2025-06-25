import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import Home from "./pages/Home.jsx";
import Questions from "./pages/Questions.jsx";
import Results from "./pages/Resultado.jsx";

export const AppContext = createContext();

function App() {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRama, setSelectedRama] = useState(null);
  const [selectedCarrera, setSelectedCarrera] = useState(null);

  return (
    <AppContext.Provider
      value={{
        answers,
        setAnswers,
        currentStep,
        setCurrentStep,
        selectedRama,
        setSelectedRama,
        selectedCarrera,
        setSelectedCarrera,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
