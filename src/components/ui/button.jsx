import { cn } from '@/lib/utils';

export function Button({ className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-sm text-sm font-medium px-4 py-2 transition-colors disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
