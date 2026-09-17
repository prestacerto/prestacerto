import React, { ReactNode } from 'react';

/**
 * Reusable Components for Certo AI Products
 * TypeScript/React with Tailwind CSS and Accessibility
 * Used across all 27 products in the ecosystem
 */

// ============================================================================
// 1. ProductCard - Visual product card component
// ============================================================================

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  price?: number;
  badge?: ReactNode;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt = title,
  price,
  badge,
  onClick,
  className = '',
  isLoading = false,
}) => {
  return (
    <article
      className={`
        bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg
        transition-shadow duration-200 overflow-hidden cursor-pointer
        ${onClick ? 'hover:scale-105' : ''} ${className}
      `}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${title} product card`}
    >
      {/* Image Section */}
      {imageUrl && (
        <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {badge && (
            <div className="absolute top-2 right-2" aria-label="Product badge">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse" />
          </div>
        )}

        {/* Price Display */}
        {price !== undefined && !isLoading && (
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
        )}
      </div>
    </article>
  );
};

// ============================================================================
// 2. SubscriptionButton - Subscription/Purchase button
// ============================================================================

interface SubscriptionButtonProps {
  text?: string;
  plan?: string;
  price?: number | string;
  onClick?: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  text = 'Assinar Plano',
  plan,
  price,
  onClick,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200';

  const variantClasses = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
    secondary:
      'bg-slate-600 text-white hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600',
    outline:
      'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={
        ariaLabel ||
        `${text}${plan ? ` - ${plan}` : ''}${price ? ` - ${price}` : ''}`
      }
      aria-busy={isLoading}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
        {text}
        {plan && <span className="hidden sm:inline text-xs opacity-80">({plan})</span>}
      </div>
    </button>
  );
};

// ============================================================================
// 3. PricingDisplay - Formatted price display component
// ============================================================================

interface PricingDisplayProps {
  amount: number;
  currency?: 'BRL' | 'USD' | 'EUR';
  locale?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  billingPeriod?: 'monthly' | 'yearly' | 'one-time';
  className?: string;
  compact?: boolean;
}

export const PricingDisplay: React.FC<PricingDisplayProps> = ({
  amount,
  currency = 'BRL',
  locale = 'pt-BR',
  size = 'md',
  showLabel = false,
  label = 'Preço',
  billingPeriod,
  className = '',
  compact = false,
}) => {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'BRL' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  if (compact) {
    return (
      <span
        className={`${sizeClasses[size]} font-semibold text-emerald-600 dark:text-emerald-400 ${className}`}
        role="text"
        aria-label={`${label}: ${formatted}${billingPeriod ? ` por ${billingPeriod}` : ''}`}
      >
        {formatted}
      </span>
    );
  }

  return (
    <div
      className={`flex flex-col items-start gap-1 ${className}`}
      role="group"
      aria-labelledby="pricing-label"
    >
      {showLabel && (
        <label
          id="pricing-label"
          className="text-sm text-slate-600 dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <div className="flex items-baseline gap-2">
        <span
          className={`${sizeClasses[size]} font-bold text-emerald-600 dark:text-emerald-400`}
        >
          {formatted}
        </span>
        {billingPeriod && (
          <span className="text-xs text-slate-500 dark:text-slate-500">
            / {billingPeriod === 'monthly' ? 'mês' : billingPeriod === 'yearly' ? 'ano' : 'único'}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. AnalyticsChart - Analytics visualization component
// ============================================================================

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  isLoading?: boolean;
  className?: string;
  maxValue?: number;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  data,
  type = 'bar',
  height = 200,
  isLoading = false,
  className = '',
  maxValue,
}) => {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <section
      className={`bg-white dark:bg-slate-900 rounded-lg p-4 ${className}`}
      aria-label={`${title} analytics chart`}
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {title}
      </h3>

      {isLoading ? (
        <div
          className="w-full rounded bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse"
          style={{ height: `${height}px` }}
          aria-hidden="true"
        />
      ) : type === 'bar' ? (
        <div
          className="flex items-end gap-3 justify-between"
          style={{ height: `${height}px` }}
          role="img"
          aria-label={`Bar chart showing ${title}: ${data.map((d) => `${d.label}: ${d.value}`).join(', ')}`}
        >
          {data.map((item) => (
            <div
              key={item.label}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className={`w-full rounded-t ${item.color || 'bg-emerald-500 dark:bg-emerald-400'} transition-all`}
                style={{
                  height: `${(item.value / max) * height}px`,
                  minHeight: item.value > 0 ? '4px' : '0',
                }}
                role="presentation"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 text-center truncate">
                {item.label}
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="w-full flex items-center justify-center text-slate-500 dark:text-slate-400"
          style={{ height: `${height}px` }}
          role="img"
          aria-label={`${type} chart showing ${title}`}
        >
          <div className="text-center">
            <p className="text-sm">{type === 'line' ? 'Line' : 'Pie'} chart visualization</p>
            <p className="text-xs text-slate-400 mt-1">
              {data.map((d) => `${d.label}: ${d.value}`).join(' | ')}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

// ============================================================================
// 5. UserAccessCheck - User access verification component
// ============================================================================

interface UserAccessCheckProps {
  hasAccess: boolean;
  userId?: string;
  productId?: string;
  children?: ReactNode;
  fallback?: ReactNode;
  className?: string;
  onAccessDenied?: () => void;
}

export const UserAccessCheck: React.FC<UserAccessCheckProps> = ({
  hasAccess,
  userId,
  productId,
  children,
  fallback,
  className = '',
  onAccessDenied,
}) => {
  if (!hasAccess) {
    if (onAccessDenied) {
      onAccessDenied();
    }

    return (
      <div
        className={`
          bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700
          rounded-lg p-4 ${className}
        `}
        role="alert"
        aria-label="Access denied"
      >
        {fallback || (
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Acesso Restrito
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {userId
                ? `Usuário ${userId} não tem acesso`
                : 'Você não tem acesso a este conteúdo'}{' '}
              {productId && `ao produto ${productId}`}.
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
              Entre em contato com o suporte ou assine um plano para acessar.
            </p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

// ============================================================================
// 6. WebhookStatus - Webhook status indicator component
// ============================================================================

interface WebhookStatusProps {
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  webhookUrl?: string;
  lastCheck?: Date;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  verbose?: boolean;
}

export const WebhookStatus: React.FC<WebhookStatusProps> = ({
  status,
  webhookUrl,
  lastCheck,
  className = '',
  size = 'md',
  verbose = false,
}) => {
  const statusConfig = {
    connected: {
      color: 'bg-emerald-100 dark:bg-emerald-900/30',
      textColor: 'text-emerald-800 dark:text-emerald-200',
      dotColor: 'bg-emerald-500',
      label: 'Conectado',
    },
    disconnected: {
      color: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-800 dark:text-slate-200',
      dotColor: 'bg-slate-500',
      label: 'Desconectado',
    },
    error: {
      color: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-200',
      dotColor: 'bg-red-500',
      label: 'Erro',
    },
    pending: {
      color: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-200',
      dotColor: 'bg-blue-500 animate-pulse',
      label: 'Aguardando',
    },
  };

  const config = statusConfig[status];
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  };

  return (
    <div
      className={`${config.color} ${config.textColor} ${sizeClasses[size]} rounded-lg flex items-start gap-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Webhook status: ${config.label}`}
    >
      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${config.dotColor}`} />
      <div className="flex-1">
        <p className="font-semibold">{config.label}</p>
        {verbose && (
          <>
            {webhookUrl && (
              <p className="text-xs opacity-75 mt-1 break-all">{webhookUrl}</p>
            )}
            {lastCheck && (
              <p className="text-xs opacity-75 mt-1">
                Última verificação: {lastCheck.toLocaleString('pt-BR')}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 7. RevenueMeter - Revenue/MRR display meter component
// ============================================================================

interface RevenueMeterProps {
  current: number;
  target: number;
  currency?: string;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  trend?: number; // Percentage change
  animated?: boolean;
}

export const RevenueMeter: React.FC<RevenueMeterProps> = ({
  current,
  target,
  currency = 'R$',
  label = 'MRR',
  showPercentage = true,
  className = '',
  size = 'md',
  trend,
  animated = true,
}) => {
  const percentage = (current / target) * 100;
  const exceeded = percentage > 100;

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-lg ${sizeClasses[size]} ${className}`}
      role="region"
      aria-label={`${label} revenue meter`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className={`${textSizeClasses[size]} font-semibold text-slate-900 dark:text-white`}>
          {label}
        </h3>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold ${
              trend > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
            aria-label={`${trend > 0 ? 'Growth' : 'Decline'}: ${trend}%`}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <div className="mb-3">
        <p
          className={`${textSizeClasses[size]} font-bold ${
            exceeded
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {currency} {(current / 1000).toFixed(1)}k
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Meta: {currency} {(target / 1000).toFixed(1)}k
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            animated ? 'duration-500' : 'duration-0'
          } ${exceeded ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-blue-500 dark:bg-blue-400'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={Math.min(percentage, 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${Math.min(percentage, 100).toFixed(1)}% da meta`}
        />
      </div>

      {showPercentage && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
          {percentage.toFixed(1)}% da meta
        </p>
      )}
    </div>
  );
};

// ============================================================================
// 8. ProductBadge - Product status badge component
// ============================================================================

type BadgeStatus = 'live' | 'building' | 'planned' | 'beta' | 'deprecated';

interface ProductBadgeProps {
  status: BadgeStatus;
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({
  status,
  text,
  className = '',
  size = 'md',
  showIcon = true,
}) => {
  const statusConfig = {
    live: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-800 dark:text-emerald-200',
      label: 'Ao Vivo',
      icon: '●',
    },
    building: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-200',
      label: 'Em Desenvolvimento',
      icon: '◐',
    },
    planned: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-800 dark:text-slate-200',
      label: 'Planejado',
      icon: '◌',
    },
    beta: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-200',
      label: 'Beta',
      icon: '★',
    },
    deprecated: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-200',
      label: 'Descontinuado',
      icon: '✕',
    },
  };

  const config = statusConfig[status];
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full
        ${config.bg} ${config.text} ${sizeClasses[size]} ${className}
      `}
      role="status"
      aria-label={`Product status: ${text || config.label}`}
    >
      {showIcon && <span aria-hidden="true">{config.icon}</span>}
      {text || config.label}
    </span>
  );
};

// ============================================================================
// Export Summary
// ============================================================================

/**
 * All 8 Reusable Components:
 *
 * 1. ProductCard - Visual card for products with image, title, description
 * 2. SubscriptionButton - Call-to-action button for subscriptions
 * 3. PricingDisplay - Formatted currency display with labels
 * 4. AnalyticsChart - Bar/line/pie chart visualization
 * 5. UserAccessCheck - Conditional rendering based on user access
 * 6. WebhookStatus - Webhook connection status indicator
 * 7. RevenueMeter - Progress meter for MRR/revenue targets
 * 8. ProductBadge - Status badge (Live/Building/Planned/Beta/Deprecated)
 *
 * Features:
 * ✓ TypeScript types with full prop interfaces
 * ✓ Tailwind CSS styling (light and dark mode)
 * ✓ WCAG accessibility (ARIA labels, roles, semantic HTML)
 * ✓ Responsive design
 * ✓ Loading states where applicable
 * ✓ Prop drilling for customization
 * ✓ Dark mode support
 * ✓ Portuguese labels (pt-BR)
 */
