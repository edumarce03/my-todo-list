function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ¡Tailwind CSS v4 está funcionando!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Mi proyecto React con TypeScript y Tailwind CSS
        </p>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
            Próximos pasos
          </h2>
          <ul className="text-left text-gray-700 space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Configurar Tailwind CSS ✓
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Crear componentes de la todo list
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Implementar funcionalidades
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
