import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  interactive?: boolean;
  /** Borde de acento sólido color marca. Se mantiene `gradientBorder` como alias. */
  accentBorder?: boolean;
  gradientBorder?: boolean;
}

export function Card({ padded = true, interactive, accentBorder, gradientBorder, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-card)] border border-[var(--color-border)] rounded-[20px] shadow-[var(--shadow-card)]",
        padded && "p-4 sm:p-5",
        interactive && "artop-press cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]",
        (accentBorder || gradientBorder) && "border-[var(--color-brand)] border-2",
        className
      )}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display font-extrabold text-[18px] leading-tight tracking-tight text-[var(--color-text)]", className)} {...rest} />;
}

export function CardSub({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[15px] leading-relaxed text-[var(--color-text-2)] font-medium", className)} {...rest} />;
}
