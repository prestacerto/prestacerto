'use client';

export function EnhancedNavigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="font-bold text-xl">PrestaCerto</div>
          
          {/* Mega Menu */}
          <div className="hidden md:flex gap-8">
            <NavLink href="/services">Serviços</NavLink>
            <NavLink href="/freelancers">Profissionais</NavLink>
            <NavLink href="/plans">Planos</NavLink>
            <NavLink href="/about">Sobre</NavLink>
          </div>
          
          {/* CTA */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Entrar</button>
        </div>
      </div>
    </nav>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="flex gap-2 text-sm text-gray-600 mb-4">
      <a href="/" className="hover:text-blue-600">Início</a>
      {items.map((item, i) => (
        <div key={i}>
          <span className="mx-2">/</span>
          {item.href ? (
            <a href={item.href} className="hover:text-blue-600">{item.label}</a>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export function EnhancedFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Plataforma</h3>
            <div className="space-y-2">
              <a href="/services" className="block hover:text-blue-400">Serviços</a>
              <a href="/freelancers" className="block hover:text-blue-400">Freelancers</a>
              <a href="/how-it-works" className="block hover:text-blue-400">Como Funciona</a>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Empresa</h3>
            <div className="space-y-2">
              <a href="/about" className="block hover:text-blue-400">Sobre</a>
              <a href="/blog" className="block hover:text-blue-400">Blog</a>
              <a href="/careers" className="block hover:text-blue-400">Carreiras</a>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <div className="space-y-2">
              <a href="/privacy" className="block hover:text-blue-400">Privacidade</a>
              <a href="/terms" className="block hover:text-blue-400">Termos</a>
              <a href="/contact" className="block hover:text-blue-400">Contato</a>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Social</h3>
            <div className="space-y-2">
              <a href="#" className="block hover:text-blue-400">Twitter</a>
              <a href="#" className="block hover:text-blue-400">LinkedIn</a>
              <a href="#" className="block hover:text-blue-400">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 PrestaCerto. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="hover:text-blue-600 transition-colors font-medium">
      {children}
    </a>
  );
}
