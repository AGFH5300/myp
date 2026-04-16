import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cls } from '../lib/utils';

export function Button({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={cls('rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50', className)}
      {...props}
    >
      {children}
    </button>
  );
}
