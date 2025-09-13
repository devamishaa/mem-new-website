"use client";

import Footer from "@/app/components/footer/Footer";
import Header from "../digital/kit-digital/ordenadores/components/Header";


const AvisoLegal = () => {
  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto px-4 py-12 text-[#1A1A1A] mt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">AVISO LEGAL</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1.- Derecho de la información</h2>
        <p>
          Le informamos que este Sitio Web: <a href="https://genera.net" className="text-blue-600 underline">https://genera.net/</a> (en adelante, el “Sitio Web”) es titularidad de GENERA DIGITAL SERVICES SL, con C.I.F. B16494890, y domicilio en AVENIDA DE CABRERA, 36 - PLT BJ, LOC B1 08302, Barcelona, inscrita en el Registro Mercantil de Barcelona.
        </p>
        <p>
          El acceso y/o uso del Sitio Web le atribuye la condición de usuario, y acepta, desde dicho acceso y/o uso, el presente Aviso Legal.
        </p>
        <p>
          El Usuario puede ponerse en contacto con GENERA DIGITAL SERVICES SL a través de la siguiente dirección de correo electrónico: <a href="mailto:info@genera.net" className="text-blue-600 underline">info@genera.net</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2.- Uso del Sitio Web</h2>
        <p>
          El Usuario asume la responsabilidad del uso del Sitio Web. El Usuario se compromete a hacer un uso adecuado de los contenidos ofrecidos y a no emplearlos para fines ilícitos, como introducir virus, manipular datos de terceros, o reproducir contenidos sin autorización.
        </p>
        <p>
          GENERA DIGITAL SERVICES SL advierte que los contenidos tienen carácter informativo y pueden no estar actualizados. Además, puede suspender el acceso temporalmente por mantenimiento sin previo aviso.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3.- Propiedad Intelectual e Industrial</h2>
        <p>
          Todos los derechos sobre el contenido y diseño gráfico del Sitio Web son propiedad exclusiva de GENERA DIGITAL SERVICES SL. Se prohíbe su reproducción, distribución o modificación sin autorización expresa.
        </p>
        <p>
          El Usuario puede almacenar contenidos temporalmente sólo si es necesario para su visualización personal.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4.- Protección de datos</h2>
        <p>
          El uso del Sitio Web puede implicar el suministro de datos personales. Su tratamiento se rige por la Política de Privacidad disponible en: <a href="https://genera.net/politica-privacidad/" className="text-blue-600 underline">https://genera.net/politica-privacidad/</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5.- Responsabilidad y Garantías</h2>
        <p>
          GENERA DIGITAL SERVICES SL no se responsabiliza por fallos técnicos, errores en el contenido, virus o daños causados por terceros. Puede suspender temporalmente el Sitio Web por mantenimiento.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6.- Duración y modificación</h2>
        <p>
          El Aviso Legal tiene vigencia indefinida y podrá ser modificado sin previo aviso. El acceso o uso del Sitio Web implica la aceptación de estas condiciones.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7.- Hipervínculos</h2>
        <p>
          GENERA DIGITAL SERVICES SL no se hace responsable del contenido de los enlaces a sitios de terceros presentes en su Sitio Web.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">8.- Salvaguardia e interpretación</h2>
        <p>
          Si una disposición se declara inválida, el resto seguirá siendo válido. La no exigencia del cumplimiento de alguna condición no constituye una renuncia a la misma.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9.- Información General</h2>
        <p>
          GENERA DIGITAL SERVICES SL ejercerá acciones legales en caso de uso indebido del Sitio Web.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">10.- Notificaciones</h2>
        <p>
          GENERA DIGITAL SERVICES SL podrá realizar notificaciones a través del correo electrónico facilitado por el Usuario.
        </p>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default AvisoLegal;
