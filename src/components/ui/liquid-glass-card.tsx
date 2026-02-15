"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const liquidGlassCardVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "glass-card",
        soft: "glass-card glass-card--soft",
        elevated: "glass-card glass-card--elevated",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LiquidGlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidGlassCardVariants> {
  /** Adds a very thin SVG distortion overlay on hover (references #card-glass from GlassDefs) */
  withDistortion?: boolean
}

const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ className, variant = "default", withDistortion = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(liquidGlassCardVariants({ variant }), className)}
        {...props}
      >
        {children}
        {withDistortion && (
          <div className="glass-card__distortion" aria-hidden="true" />
        )}
      </div>
    )
  }
)
LiquidGlassCard.displayName = "LiquidGlassCard"

export { LiquidGlassCard, liquidGlassCardVariants }
