import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Component = "button",
  ...otherProps
}) => {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl h-16 w-40 p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        background: `
          linear-gradient(90deg, transparent, rgba(255, 165, 0, 0.8), transparent),
          linear-gradient(90deg, transparent, rgba(255, 165, 0, 0.4), transparent)
        `,
        backgroundSize: "400% 100%",
        animation: `movingBorder ${duration}ms linear infinite`,
      }}
      {...otherProps}
    >
      <style jsx>{`
        @keyframes movingBorder {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      <div
        className={cn(
          "relative bg-slate-900/20 backdrop-blur-xl border-neutral-200 dark:border-slate-800 w-full h-full text-sm antialiased flex items-center justify-center",
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
};

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  delay = 9,
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width,1px)+1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        className
      )}
    >
      <div
        className="absolute aspect-square w-full animate-border-beam [animation-delay:var(--delay)] [background:linear-gradient(to_right,transparent,rgb(255,165,0),transparent)] [mask:linear-gradient(to_right,transparent,white_4px,transparent)]"
        style={{
          "--size": size,
          "--duration": duration + "s",
          "--delay": delay + "s",
        }}
      />
    </div>
  );
};
