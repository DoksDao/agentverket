import { forwardRef, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { children, className = "", style },
  ref
) {
  return (
    <section
      ref={ref}
      className={`min-w-0 rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.18)] sm:p-6 ${className}`.trim()}
      style={style}
    >
      {children}
    </section>
  );
});
