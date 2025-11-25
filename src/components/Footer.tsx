
export function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 text-white py-12"> {/* ← mt-auto com flex do App */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Palpiteiro V2</h3>
            <p className="text-gray-400">
              Estatística avançada para aumentar suas chances.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Ferramentas</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Gerador</a></li>
              <li><a href="/resultados" className="hover:text-white transition-colors">Resultados</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Sobre</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Palpiteiro V2. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
