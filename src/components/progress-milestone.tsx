import { CheckCircle, Circle, Lock } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  reward: number;
  target: number;
  current: number;
  completed: boolean;
}

interface ProgressMilestoneProps {
  milestones: Milestone[];
  title: string;
  level: "Iniciante" | "Intermediário" | "Avançado" | "Sênior";
}

export function ProgressMilestone({ milestones, title, level }: ProgressMilestoneProps) {
  const totalCompleted = milestones.filter((m) => m.completed).length;
  const percentage = Math.round((totalCompleted / milestones.length) * 100);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">Nível atual: <span className="font-bold">{level}</span></p>

        {/* Main Progress Bar */}
        <div className="relative">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>{totalCompleted} de {milestones.length}</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              {milestone.completed ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : milestone.current >= milestone.target ? (
                <Circle className="text-blue-500" size={24} />
              ) : (
                <Lock className="text-gray-400" size={24} />
              )}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {index + 1}. {milestone.title}
                  </h4>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">+R$ {milestone.reward}</p>
                  <p className="text-xs text-gray-500">
                    {milestone.current}/{milestone.target}
                  </p>
                </div>
              </div>

              {/* Progress for this milestone */}
              {!milestone.completed && (
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (milestone.current / milestone.target) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalCompleted === milestones.length && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
          <p className="font-bold text-green-900">🎉 Parabéns! Você atingiu {level}</p>
          <p className="text-sm text-green-800">Desbloqueou benefícios especiais!</p>
        </div>
      )}
    </div>
  );
}
