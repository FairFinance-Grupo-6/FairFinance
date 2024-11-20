"use client"

import React, { useState, useEffect } from "react";
import FAQs from "@/components/FAQs/FAQs";

export default function Index() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showFaqs, setShowFaqs] = useState(false);
  const sections = [
    {
      title: "Fair Finance",
      description:
        "Simplifica la gestión de tus facturas. Registra, analiza y optimiza tu cartera financiera con facilidad.",
      button1Text: "Descubre ahora",
      button2Text: "Ver más",
      imageSrc: "/faircat.png",
      bgColor: "bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700",
    },
    {
      title: "Servicios",
      description:
        "Explora nuestros servicios diseñados para ofrecerte soluciones integrales, eficientes y permanentes.",
      button1Text: "Explorar",
      button2Text: "FAQs",
      imageSrc: "/faircat2.png",
      bgColor: "bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700",
    },
    {
      title: "Contacto",
      description:
        "Establece contacto con nosotros para explorar soluciones efectivas que impulsen el crecimiento.",
      button1Text: "Lol", 
      button2Text: "Enviar mensaje",
      imageSrc: "/faircat3.png",
      bgColor: "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prevSection) => (prevSection + 1) % sections.length);
    }, 5000); // Cambia de sección cada 5 segundos

    return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
  }, []);

  // Función para manejar el clic del botón "Regístrate ahora"
  const handleRegisterClick = () => {
    window.location.href = "/sign-in"; // Reemplaza con la ruta deseada
  };

  const handleFaqsClick = () => {
    setShowFaqs(true); // Muestra la sección de FAQs
  };

  return (
    <main className="flex-1 flex flex-col items-center bg-white">
      {/* Si showFaqs es verdadero, muestra el componente FAQs */}
      {showFaqs ? (
        <FAQs />
      ) : (
        // Secciones
        <section
          className={`w-full max-w-5xl flex flex-col md:flex-row items-center justify-between py-56 gap-8 ${sections[currentSection].bgColor} text-white rounded-lg shadow-md relative overflow-hidden`}
        >
          <div className="flex-1 flex flex-col items-start gap-4 px-6" style={{ marginTop: "-120px" }}>
            <h1 className="text-4xl font-bold">{sections[currentSection].title}</h1>
            <p className="text-lg">{sections[currentSection].description}</p>
            <div className="flex gap-4">
              {currentSection === 0 && (
                <button
                  className="bg-purple-600 hover:bg-purple-800 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out"
                  onClick={handleRegisterClick} // Asociar la acción
                >
                  {sections[currentSection].button1Text}
                </button>
              )}
              {currentSection === 1 && (
                <button
                className="border border-white hover:bg-white hover:text-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out"
                onClick={handleFaqsClick} // Al hacer clic en "FAQs", mostrar la sección
              >
                {sections[currentSection].button2Text}
              </button>
              )}
              {currentSection === 2 && (
                <a
                  href="mailto:fairfinance@financez.com?subject=Consulta sobre FairFinance"
                  className="border border-white hover:bg-white hover:text-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out"
                >
                  Enviar mensaje
                </a>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <img
              src={sections[currentSection].imageSrc}
              alt="Imagen de un gato"
              className="w-80 h-auto"
            />
          </div>
          <div className="absolute bottom-8 right-8 flex gap-2">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full bg-white cursor-pointer ${currentSection === index ? "opacity-80" : "opacity-50"}`}
                onClick={() => setCurrentSection(index)}
              />
            ))}
          </div>
        </section>
      )}      
    </main>
  );
}
