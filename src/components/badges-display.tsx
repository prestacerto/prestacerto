import { BADGES, BadgeType } from "@/lib/badges";

interface BadgesDisplayProps {
  badges: BadgeType[];
  size?: "sm" | "md" | "lg";
}

export function BadgesDisplay({ badges, size = "md" } : BadgesDisplayProps) {
  if (!badges.length) return null;

  const sizeClasses = {
    sm: "gap-1.5",
    md: "gap-2",
    lg: "gap-3",
  };

  const iconSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`flex flex-wrap ${sizeClasses[size]}`}>
      {badges.map((badge) => {
        const badgeData = BADGES[badge];
        return (
          <div
            key={badge}
            title={badgeData.description}
            className={`
              inline-flex items-center gap-1.5 rounded-full
              bg-gradient-to-r ${badgeData.color}
              px-3 py-1.5 shadow-md hover:shadow-lg
              transition-all duration-200 cursor-help
            `}
          >
            <span className={iconSizes[size]}>{badgeData.icon}</span>
            <span className={`${textSizes[size]} font-semibold text-white`}>
              {badgeData.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
