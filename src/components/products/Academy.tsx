'use client';

import { useState } from 'react';

const COURSES = [
  { id: 1, title: 'Como Precificar Corretamente', price: 97, students: 234 },
  { id: 2, title: 'Propostas que Vencem', price: 97, students: 189 },
  { id: 3, title: 'Gestão de Cliente Pro', price: 97, students: 156 },
  { id: 4, title: 'Escalando sua Agência', price: 97, students: 142 },
];

export function Academy() {
  const [enrolled, setEnrolled] = useState<number[]>([]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-3">🎓 CERTO Academy</h2>
        <p className="mb-6">Cursos para freelancers ganharem mais</p>

        <div className="bg-white/10 p-4 rounded-lg backdrop-blur mb-4">
          <p className="text-sm opacity-90">✨ Cursos on-demand de freelancing</p>
          <p className="text-sm opacity-90">✨ Certificado ao final de cada curso</p>
          <p className="text-sm opacity-90">✨ Comunidade exclusiva de alunos</p>
          <p className="text-sm opacity-90">✨ All-access por R$ 297/ano</p>
        </div>
      </div>

      <div className="space-y-3">
        {COURSES.map((course) => (
          <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course.students} alunos já inscritos</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">R$ {course.price}</p>
                <button
                  onClick={() => setEnrolled([...enrolled, course.id])}
                  disabled={enrolled.includes(course.id)}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {enrolled.includes(course.id) ? 'Inscrito ✓' : 'Inscrever'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <p className="font-bold mb-2">💡 All-Access Plan</p>
        <p className="text-sm mb-3">Acesso a TODOS os cursos + novo conteúdo</p>
        <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700">
          Assinar All-Access (R$ 297/ano)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">💰 R$ 97/curso</h3>
          <p className="text-sm text-gray-600">ou R$ 297/ano (all-access)</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">📈 Potencial</h3>
          <p className="text-sm text-gray-600">R$ 16.6k/mês (2k inscritos)</p>
        </div>
      </div>
    </div>
  );
}
