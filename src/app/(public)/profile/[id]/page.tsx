import { ResponseRateBadge } from '@/components/profile/ResponseRateBadge';

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  // TODO: Fetch user data from Supabase
  // const user = await getUser(params.id)
  // const responseRate = await getResponseRate(params.id)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fulano de Tal</h1>
            <p className="text-gray-600 dark:text-gray-400">Web Developer | React | Node.js</p>
          </div>
          <div className="text-right">
            <p className="text-2xl">⭐ 4.8</p>
            <p className="text-sm text-gray-500">12 projetos</p>
          </div>
        </div>

        {/* Response Rate Badge - VISÍVEL AQUI */}
        <div className="mb-6">
          <ResponseRateBadge rate={92} />
        </div>

        {/* Bio */}
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Desenvolvimento web com foco em performance e UX. 5+ anos de experiência.
        </p>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="font-bold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js'].map(skill => (
              <span key={skill} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
          Enviar Proposta
        </button>
      </div>
    </div>
  );
}
