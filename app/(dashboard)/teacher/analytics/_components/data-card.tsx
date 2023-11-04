import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
    value: number;
    label: string;
    // to decide if you shoulf format the value to dollars or not
    shouldFormat?: boolean;
}

const DataCard = ({ value, label, shouldFormat }: DataCardProps) => {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {label}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-xl font-bold">
                {shouldFormat? formatPrice(value): value}
            </div>
        </CardContent>
    </Card>
  )
}

export default DataCard