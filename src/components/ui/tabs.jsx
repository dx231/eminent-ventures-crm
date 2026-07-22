import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, className, children }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div className={cn('flex rounded-sm bg-[#F4F4F5] p-1', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        'flex-1 text-sm font-medium py-1.5 rounded-sm transition-colors',
        active ? 'bg-white text-[#09090B] shadow-sm' : 'text-[#71717A]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div>{children}</div>;
}
