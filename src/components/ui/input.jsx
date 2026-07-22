import { cn } from '@/lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-sm border px-3 py-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-offset-0',
        className
      )}
      {...props}
    />
  );
}
