'use client';

import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">Página No Encontrada</h2>
      <p className="text-gray-400 mb-8">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors duration-300"
      >
        Volver a la Página de Inicio
      </Link>
    </div>
  );
};

export default NotFound;
