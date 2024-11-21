import React, { useState } from "react";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    { question: "¿Cómo me registro?", answer: "Puedes registrarte utilizando el formulario en la página principal." },
    { question: "¿Olvidé mi contraseña, qué hago?", answer: "Haz clic en 'Olvidé mi contraseña' en la página de inicio de sesión para restablecerla." },
    { question: "¿Puedo modificar mi perfil?", answer: "No, no puedes editar tus datos personales, pero no te preocupes ponte en contacto con nosotros y lo haremos por ti" },
    { question: "¿Cómo contacto al soporte?", answer: "Puedes comunicarte con el soporte a través de la página de contacto en nuestro sitio." },
  ];

  const toggleFAQ = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Si la pregunta está abierta, la cierra
    } else {
      setActiveIndex(index); // Abre la pregunta seleccionada
    }
  };

  return (
    <section id="faq" className="p-8 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Preguntas Frecuentes</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-purple-200">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left py-4 px-6 text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none transition duration-300"
            >
              {faq.question}
            </button>
            {activeIndex === index && (
              <div className="bg-purple-50 p-4 rounded-lg mt-2 shadow-inner">
                <p className="text-purple-800">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
