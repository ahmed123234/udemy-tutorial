import { LucideIcon } from 'lucide-react'
// this package is already installed by shadcn
// cva used to create variants to the button
// it will be used to create different variant fo the button bage (change the color and the size as well)
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const backgroundVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100"
            },
                // iconVariant: {
                //     default: "text-sky-700",
                //     success: "bg-emerald-700"
                // },
            size: {
                default: "p-2",
                sm: "p-1"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            // iconVariant: "success"
        }
    }
)

const iconVariants = cva(
    "", 
    {
        variants: {
            variant: {
                default: "text-sky-700",
                success:"bg-emerald-700"
            },
            size: {
                default: "h-8 w-8",
                sm: "h-4 w-4"
            }
        },
        defaultVariants: {
            variant:"default",
            size: "default"
        }
    }
)


type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>
type IconVariantsProps = VariantProps<typeof iconVariants>

interface IconBageProps extends BackgroundVariantsProps, IconVariantsProps {
    icon: LucideIcon;
}

const IconBage = ({icon: Icon, variant, size}: IconBageProps) => {
  return (
    <div className={cn(backgroundVariants({variant, size}))}>
        <Icon className={cn(iconVariants({ variant, size }))}/>
    </div>
  )
}

export default IconBage