"use client"
import React, { useState, useEffect } from "react";

export default function Index() {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = [
    {
      title: "Fair Finance",
      description:
        "Simplifica la gestión de tus facturas. Registra, analiza y optimiza tu cartera financiera con facilidad.",
      button1Text: "Regístrate ahora",
      button2Text: "Ver más",
      imageSrc: "/faircat.png",
      bgColor: "bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700",
    },
    {
      title: "Servicios",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan orci eu orci laciniaxxxxxxx.",
      button1Text: "Explorar",
      button2Text: "Leer más",
      imageSrc: "/faircat.png",
      bgColor: "bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700",
    },
    {
      title: "Contacto",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent liberoooooooooo.",
      button1Text: "Enviar mensaje",
      button2Text: "Llamar",
      imageSrc: "/faircat.png",
      bgColor: "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prevSection) => (prevSection + 1) % sections.length);
    }, 5000); // Cambia de sección cada 5 segundos

    return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
  }, []);

  return (
    <>
      <main className="flex-1 flex flex-col items-center bg-white">
        {/* Secciones */}
        <section
          className={`w-full max-w-5xl flex flex-col md:flex-row items-center justify-between py-56 gap-8 ${sections[currentSection].bgColor} text-white rounded-lg shadow-md relative overflow-hidden`}
        >
          <div className="flex-1 flex flex-col items-start gap-4 px-6" style={{ marginTop: "-120px" }}>
            <h1 className="text-4xl font-bold">{sections[currentSection].title}</h1>
            <p className="text-lg">{sections[currentSection].description}</p>
            <div className="flex gap-4">
              <button className="bg-purple-600 hover:bg-purple-800 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                {sections[currentSection].button1Text}
              </button>
              <button className="border border-white hover:bg-white hover:text-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                {sections[currentSection].button2Text}
              </button>
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
              className={`w-3 h-3 rounded-full bg-white cursor-pointer ${
                currentSection === index ? "opacity-80" : "opacity-50"
              }`}
              onClick={() => setCurrentSection(index)}
            />
          ))}
        </div>
        </section>
      </main>
    </>
  );
}
