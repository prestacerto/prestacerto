"use client";

import { BookOpen, Award, Clock, Users, Star, Play } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "React Avançado: Do Básico à Produção",
    category: "Web Development",
    level: "Avançado",
    icon: "⚛️",
    duration: "8 semanas",
    students: 1240,
    rating: 4.9,
    price: 199,
    instructor: "Carlos Dev",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=300&h=200&fit=crop",
    lessons: 45,
    certified: true,
  },
  {
    id: 2,
    title: "UX/UI Design Prático com Figma",
    category: "Design",
    level: "Intermediário",
    icon: "🎨",
    duration: "6 semanas",
    students: 892,
    rating: 4.8,
    price: 149,
    instructor: "Marina Design",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
    lessons: 38,
    certified: true,
  },
  {
    id: 3,
    title: "SEO & Marketing Digital em 2026",
    category: "Marketing",
    level: "Iniciante",
    icon: "📈",
    duration: "4 semanas",
    students: 2150,
    rating: 4.7,
    price: 99,
    instructor: "Paulo Marketing",
    image:
      "https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=300&h=200&fit=crop",
    lessons: 28,
    certified: false,
  },
  {
    id: 4,
    title: "Full-Stack: Node.js + React + PostgreSQL",
    category: "Web Development",
    level: "Avançado",
    icon: "💻",
    duration: "10 semanas",
    students: 1654,
    rating: 4.9,
    price: 249,
    instructor: "Felipe Full-Stack",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop",
    lessons: 60,
    certified: true,
  },
  {
    id: 5,
    title: "Copywriting que Converte",
    category: "Copywriting",
    level: "Intermediário",
    icon: "✍️",
    duration: "5 semanas",
    students: 756,
    rating: 4.6,
    price: 129,
    instructor: "Adriana Copy",
    image:
      "https://images.unsplash.com/photo-1542435503-a174ded8b47e?w=300&h=200&fit=crop",
    lessons: 25,
    certified: false,
  },
  {
    id: 6,
    title: "Motion Graphics com After Effects",
    category: "Video",
    level: "Avançado",
    icon: "🎬",
    duration: "8 semanas",
    students: 543,
    rating: 4.8,
    price: 189,
    instructor: "Roberto Motion",
    image:
      "https://images.unsplash.com/photo-1598188036147-b8e6300ef035?w=300&h=200&fit=crop",
    lessons: 42,
    certified: true,
  },
];

export function SkillAcademy() {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          🎓 Skill Academy
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Cursos de alta qualidade para elevar suas habilidades e ganhar mais
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 text-center">
          <p className="text-2xl font-bold text-blue-600">28</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Cursos</p>
        </div>
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 text-center">
          <p className="text-2xl font-bold text-green-600">50k+</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Alunos</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 text-center">
          <p className="text-2xl font-bold text-purple-600">4.8</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Avaliação Média
          </p>
        </div>
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 text-center">
          <p className="text-2xl font-bold text-amber-600">+65%</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Aumento de Renda
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden group">
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="size-12 text-white fill-white" />
              </div>
              <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                {course.level}
              </span>
              <span className="absolute top-2 left-2 text-3xl">{course.icon}</span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                {course.title}
              </h3>

              {/* Meta */}
              <div className="space-y-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="size-3" />
                  {course.lessons} aulas
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-3" />
                  {course.students.toLocaleString()} alunos
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {course.rating}
                </span>
                <span className="text-xs text-slate-500">
                  ({course.students} reviews)
                </span>
              </div>

              {/* Instructor */}
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                👨‍🏫 {course.instructor}
              </p>

              {/* Certified Badge */}
              {course.certified && (
                <div className="mb-4 p-2 rounded bg-green-100 dark:bg-green-950 flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                  <Award className="size-3" />
                  Certificado profissional
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  R$ {course.price}
                </p>
                <button className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors">
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">📚 Por que PrestaCerto Academy?</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-3xl mb-2">🏆</p>
            <p className="font-bold mb-2">Curadores Especialistas</p>
            <p className="text-sm text-blue-100">
              Instrutores com 10+ anos de experiência em suas áreas
            </p>
          </div>
          <div>
            <p className="text-3xl mb-2">💼</p>
            <p className="font-bold mb-2">Certificados Reconhecidos</p>
            <p className="text-sm text-blue-100">
              Certificados que aumentam valor no mercado freelancer
            </p>
          </div>
          <div>
            <p className="text-3xl mb-2">📈</p>
            <p className="font-bold mb-2">ROI Comprovado</p>
            <p className="text-sm text-blue-100">
              Alunos aumentam renda média em +65% após conclusão
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center p-8 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          🚀 Comece a Aprender Agora
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          30% de desconto para novos membros + acesso a comunidade exclusiva
        </p>
        <div className="flex gap-3 justify-center">
          <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
            Explorar Cursos
          </button>
          <button className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            Ver Plano
          </button>
        </div>
      </div>
    </div>
  );
}
