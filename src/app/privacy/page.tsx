import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — PrestaCerto",
  description: "Como protegemos seus dados na PrestaCerto",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Política de Privacidade
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              1. Introdução
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              A PrestaCerto ("Plataforma") respeita sua privacidade e se compromete em proteger seus dados pessoais. Esta política descreve como coletamos, usamos e protegemos suas informações quando você usa nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. Dados que Coletamos
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              Coletamos informações que você fornece diretamente:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-2">
              <li>Nome completo, email e telefone</li>
              <li>Dados de perfil: foto, biografia, portfolio, habilidades</li>
              <li>Documentos de verificação (CPF, RG) — criptografados</li>
              <li>Informações de pagamento (banco, chave Pix)</li>
              <li>Histórico de projetos, propostas e avaliações</li>
              <li>Mensagens e comunicações dentro da plataforma</li>
              <li>Dados de uso: páginas visitadas, funcionalidades utilizadas, clicks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. Por Que Coletamos
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              Seus dados são usados para:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-2">
              <li>Criar e manter sua conta</li>
              <li>Facilitar conexões entre freelancers e clientes</li>
              <li>Processar pagamentos de forma segura</li>
              <li>Verificar identidade e prevenir fraudes</li>
              <li>Enviar notificações sobre oportunidades e projetos</li>
              <li>Melhorar a plataforma (analytics e feedback)</li>
              <li>Cumprir obrigações legais (LGPD, fiscalização)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. Compartilhamento de Dados
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              Seus dados <strong>não são vendidos</strong> para terceiros. Compartilhamos apenas com:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-2">
              <li>
                <strong>Outros usuários:</strong> Nome, foto, bio e skills aparecem em seu perfil público. Mensagens são compartilhadas apenas com quem você contrata.
              </li>
              <li>
                <strong>Processadores de pagamento:</strong> Mercado Pago recebe dados de transação necessários para processar pagamentos.
              </li>
              <li>
                <strong>Verificação de identidade:</strong> Documentos podem ser verificados por parceiros certificados.
              </li>
              <li>
                <strong>Autoridades legais:</strong> Apenas se exigido por lei ou decisão judicial.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Segurança
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Protegemos seus dados com:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-2">
              <li>Criptografia HTTPS (SSL/TLS) em toda a plataforma</li>
              <li>Senhas armazenadas com hash bcrypt (irreversível)</li>
              <li>Autenticação de dois fatores (2FA) opcional</li>
              <li>Acesso restrito aos dados (funcionários precisam de autorização)</li>
              <li>Backups regulares criptografados</li>
              <li>Monitoramento de segurança 24/7</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              6. Seus Direitos (LGPD)
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-2">
              <li>
                <strong>Acessar:</strong> Solicitar cópia de todos seus dados coletados
              </li>
              <li>
                <strong>Corrigir:</strong> Corrigir informações inexatas ou incompletas
              </li>
              <li>
                <strong>Deletar:</strong> Solicitar exclusão de seus dados (direito ao esquecimento)
              </li>
              <li>
                <strong>Revogar consentimento:</strong> Parar de receber comunicações de marketing
              </li>
              <li>
                <strong>Portabilidade:</strong> Exportar seus dados em formato estruturado
              </li>
              <li>
                <strong>Não discriminação:</strong> Não sofrer discriminação por exercer seus direitos
              </li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300 mt-4">
              Para exercer qualquer direito, entre em contato: <strong>privacy@prestacerto.com.br</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              7. Retenção de Dados
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              Mantemos seus dados por:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-2">
              <li>
                <strong>Durante ativo:</strong> Enquanto sua conta está ativa
              </li>
              <li>
                <strong>Histórico de transações:</strong> 7 anos (requisito fiscal/legal)
              </li>
              <li>
                <strong>Após deletar conta:</strong> Dados anonimizados após 30 dias
              </li>
              <li>
                <strong>Documentos de verificação:</strong> Deletados após 1 ano se não renovado
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              8. Cookies e Tracking
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              Usamos:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-2">
              <li>
                <strong>Cookies essenciais:</strong> Mantêm você logado (necessário)
              </li>
              <li>
                <strong>Google Analytics:</strong> Entender como você usa a plataforma (anônimo)
              </li>
              <li>
                <strong>Facebook Pixel:</strong> Medir conversões de anúncios (opcional)
              </li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300 mt-4">
              Você pode desabilitar cookies não-essenciais nas configurações da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              9. Contato
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Dúvidas sobre privacidade? Entre em contato:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mt-4">
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Email:</strong> privacy@prestacerto.com.br
              </p>
              <p className="text-slate-700 dark:text-slate-300 mt-2">
                <strong>Responsável:</strong> Encarregado de Dados (DPO)
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              10. Alterações nesta Política
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Podemos atualizar esta política periodicamente. Mudanças importantes serão comunicadas via email. Seu uso contínuo da plataforma significa aceitação das alterações.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
