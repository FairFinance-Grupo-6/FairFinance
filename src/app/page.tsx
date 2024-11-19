export default async function Index() {
  return (
    <>
      <main className="flex-1 flex flex-col items-center bg-white">
        {/* Hero Section */}
        <section className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between py-56 gap-8 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 text-white rounded-lg shadow-md relative overflow-hidden">
          {/* Hero Content */}
          <div className="flex-1 flex flex-col items-start gap-4 px-6" style={{ marginTop: "-120px" }}>
            <h1 className="text-4xl font-bold">Fair Finance</h1>
            <p className="text-lg">
              Simplifica la gestión de tus facturas. Registra, analiza y optimiza
              tu cartera financiera con facilidad.
            </p>
            <div className="flex gap-4">
                <button className="bg-purple-600 hover:bg-purple-800 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                  Regístrate ahora
                </button>
                <button className="border border-white hover:bg-white hover:text-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                  Ver más
                </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            {/* Imagen del gato */}
            <img
              src="/faircat.png"
              alt="Imagen de un gato"
              className="w-80 h-auto"
            />
          </div>
        </section>
      </main>
    </>
  );
}
