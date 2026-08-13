'use client';

interface Skill {
  skill_name: string;
  demand_change_percent: number;
  trend_direction: string;
  projects_posted_week: number;
}

interface SkillDemandCardProps {
  skills: Skill[];
}

export function SkillDemandCard({ skills }: SkillDemandCardProps) {
  if (!skills?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-6 shadow border border-orange-200 dark:border-orange-800">
      <h3 className="font-semibold mb-4">Skills em Alta</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {skills.slice(0, 8).map((skill, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 bg-white dark:bg-gray-700/50 rounded">
            <div>
              <p className="text-sm font-medium">{skill.skill_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {skill.projects_posted_week} projetos esta semana
              </p>
            </div>
            <div className={`text-sm font-semibold px-2 py-1 rounded ${
              skill.demand_change_percent > 0
                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
            }`}>
              {skill.demand_change_percent > 0 ? '↑' : '↓'} {Math.abs(skill.demand_change_percent || 0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
