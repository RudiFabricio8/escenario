import { getCoursePerformance } from '@/lib/data';
import { CoursePerformance } from '@/lib/definitions';
import Link from 'next/link';
import MetricCard from '@/components/MetricCard';

export default async function PerformancePage(props: {
    searchParams: Promise<{ term?: string }>;
}) {
    const searchParams = await props.searchParams;
    const term = searchParams.term || '';

    let data: CoursePerformance[] = [];
    if (term) {
        data = await getCoursePerformance(term);
    }

    // KPIs simples
    const totalFailed = data.reduce((acc, curr) => acc + Number(curr.failed_count), 0);
    const globalAvg = data.length > 0
        ? (data.reduce((acc, curr) => acc + Number(curr.avg_grade), 0) / data.length).toFixed(2)
        : '-';

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans text-gray-800">
            <div className="mb-6">
                <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">&larr; Volver al Dashboard</Link>
                <h1 className="text-2xl font-bold">Rendimiento de Cursos</h1>
                <p className="text-gray-600">Análisis de calificaciones y reprobación por periodo.</p>
            </div>

            {/* Filtro Simple */}
            <form className="mb-8 p-4 bg-gray-50 rounded border border-gray-200 flex items-end gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periodo (Term)</label>
                    <input
                        name="term"
                        defaultValue={term}
                        placeholder="Ej. 2024A"
                        className="border p-2 rounded w-48"
                        required
                        autoFocus
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Buscar
                </button>
            </form>

            {term ? (
                <>
                    {/* Tarjetas KPI */}
                    <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
                        <MetricCard label="Promedio General" value={globalAvg} />
                        <MetricCard label="Total Reprobados" value={totalFailed} highlight={totalFailed > 0} />
                    </div>

                    {/* Tabla de Resultados */}
                    <div className="border rounded overflow-hidden shadow-sm">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3 border-b font-semibold">Curso</th>
                                    <th className="p-3 border-b font-semibold">Periodo</th>
                                    <th className="p-3 border-b font-semibold">Promedio</th>
                                    <th className="p-3 border-b font-semibold">Reprobados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No se encontraron resultados para el periodo "{term}".
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="p-3">{row.course}</td>
                                            <td className="p-3">{row.term}</td>
                                            <td className={`p-3 font-mono font-medium ${Number(row.avg_grade) < 6 ? 'text-red-500' : 'text-gray-800'}`}>
                                                {Number(row.avg_grade).toFixed(2)}
                                            </td>
                                            <td className="p-3 font-mono">{row.failed_count}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="p-10 bg-gray-50 border border-dashed rounded text-center text-gray-500">
                    Ingresa un periodo arriba para ver el reporte. Intenta con "2024A".
                </div>
            )}
        </div>
    );
}