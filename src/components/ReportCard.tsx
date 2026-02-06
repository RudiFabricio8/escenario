import Link from 'next/link';

interface ReportCardProps {
    name: string;
    path: string;
    desc: string;
}

export default function ReportCard({ name, path, desc }: ReportCardProps) {
    return (
        <Link
            href={path}
            className="block p-5 border border-gray-200 rounded bg-white hover:bg-gray-50 hover:border-blue-400 transition-colors"
        >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
                {name}
            </h2>
            <p className="text-sm text-gray-600">
                {desc}
            </p>
        </Link>
    );
}
