interface MetricCardProps {
    label: string;
    value: string | number;
    highlight?: boolean;
}

export default function MetricCard({ label, value, highlight = false }: MetricCardProps) {
    return (
        <div className="p-4 border rounded bg-white shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className={`text-2xl font-bold ${highlight ? 'text-red-600' : 'text-blue-700'}`}>
                {value}
            </div>
        </div>
    );
}
