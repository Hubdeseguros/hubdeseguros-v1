
// Página principal mejorada para debug
const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">HubSeguros</h1>
        <p className="text-lg text-gray-700 mb-6">¡Bienvenido! Si ves este mensaje, la app está funcionando correctamente.</p>
        <p className="text-base text-gray-500">Puedes modificar esta página en&nbsp;
          <code className="bg-gray-200 px-2 py-1 rounded">src/pages/Index.tsx</code>
        </p>
        <div className="mt-8">
          <span className="text-xs text-gray-400">Versión actual del frontend. Revisa el menú o la consola para la siguiente navegación.</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
