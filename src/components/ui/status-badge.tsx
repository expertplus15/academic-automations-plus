import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Critical/Urgent - Red
        critical: "border-transparent bg-red-500 text-white hover:bg-red-600",
        error: "border-transparent bg-red-500 text-white hover:bg-red-600",
        urgent: "border-transparent bg-red-500 text-white hover:bg-red-600",
        
        // Warning/Attention - Orange
        warning: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        attention: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        pending: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        
        // Success/Active - Green
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        active: "border-transparent bg-green-500 text-white hover:bg-green-600",
        confirmed: "border-transparent bg-green-500 text-white hover:bg-green-600",
        completed: "border-transparent bg-green-500 text-white hover:bg-green-600",
        
        // Information - Blue
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        scheduled: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        processing: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        
        // Neutral states
        inactive: "border-transparent bg-gray-500 text-white hover:bg-gray-600",
        default: "border-transparent bg-gray-500 text-white hover:bg-gray-600",
        
        // Outline variants
        "critical-outline": "text-red-600 border-red-200 bg-red-50 hover:bg-red-100",
        "warning-outline": "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100",
        "success-outline": "text-green-600 border-green-200 bg-green-50 hover:bg-green-100",
        "info-outline": "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode;
  count?: number;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, icon, count, children, ...props }, ref) => {
    return (
      <div
        className={cn(statusBadgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {count !== undefined && count > 0 && (
          <span className="ml-1 bg-white/20 rounded-full px-1.5 py-0.5 text-xs font-bold">
            {count}
          </span>
        )}
      </div>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }