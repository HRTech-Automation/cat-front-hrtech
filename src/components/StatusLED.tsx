import { clsx } from 'clsx';

interface StatusLEDProps {
  status: 'normal' | 'warning' | 'critical';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusLED({ status, size = 'md' }: StatusLEDProps) {
  const sizeClasses = {
    sm: 'w-[1vw] h-[1vw] lg:w-[0.8vw] lg:h-[0.8vw] xl:w-[0.6vw] xl:h-[0.6vw]',
    md: 'w-[1.2vw] h-[1.2vw] lg:w-[1vw] lg:h-[1vw] xl:w-[0.8vw] xl:h-[0.8vw]',
    lg: 'w-[1.5vw] h-[1.5vw] lg:w-[1.2vw] lg:h-[1.2vw] xl:w-[1vw] xl:h-[1vw]'
  };

  const statusClasses = {
    normal: 'bg-green-500 shadow-green-500/50',
    warning: 'bg-yellow-500 shadow-yellow-500/50',
    critical: 'bg-red-500 shadow-red-500/50'
  };

  return (
    <div
      className={clsx(
        'rounded-full animate-pulse shadow-lg',
        sizeClasses[size],
        statusClasses[status]
      )}
      title={status === 'normal' ? 'Normal' : status === 'warning' ? 'Atenção' : 'Crítico'}
    />
  );
}