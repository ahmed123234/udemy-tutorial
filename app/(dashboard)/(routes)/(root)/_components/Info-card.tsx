import IconBage from "@/components/IconBage"
import { LucideIcon } from "lucide-react"

interface InfoCardProps {
    icon: LucideIcon,
    numberOfItems: number,
    label: string ,
    varriant?: "default" | "success"
}
const InfoCard = ({ icon: Icon, numberOfItems, label, varriant }: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
        <IconBage  variant={varriant} icon={Icon}/>
        <div>
            <p className="font-medium">
                {label}
            </p>

            <p className=" text-gray-500 text-sm">
                {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
            </p>
        </div>
    </div>
  )
}

export default InfoCard