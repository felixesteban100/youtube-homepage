import { VariantProps, cva } from "class-variance-authority"
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export const buttonStyles = cva(
    ["transition-colors"],
    {
        variants: {
            variant: {
                default: ["bg-background", "hover:bg-accent"],
                ghost: ["hover:bg-secondary"],
                dark: ["bg-primary", "hover:bg-primary", "text-primary-foreground"]
            },
            size: {
                default: ["rounded", "p-2"],
                icon: ["rounded-full", "w-10", "h-10", "flex", "items-center", "justify-center", "p-2.5"]
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">

function Button({ variant, size, className, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={twMerge(
                buttonStyles({ variant, size }), className
            )}
        />
    )
}

export default Button