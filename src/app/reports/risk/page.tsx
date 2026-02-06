import { getStudentsAtRisk } from '@/lib/data';
import { StudentAtRisk } from '@/lib/definitions';
import Link from 'next/link';
import MetricCard from '@/components/MetricCard';

export default async function RiskPage(props: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const searchParams = await props.searchParams;
    const search = searchParams.q || '';
    const currentPage = Number(searchParams.page) || 1;

    // Cargar datos
    const { data, metadata } = await getStudentsAtRisk(search, currentPage);

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans text-gray-800">
            <div className="mb-6">
                <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">&larr; Volver al Dashboard</Link>
                <h1 className="text-2xl font-bold text-red-700">Alumnos en Riesgo</h1>
                <p className="text-gray-600">Alumnos con promedio &lt; 6.0 o asistencia &lt; 80%.</p>
            </div>

            {/* Buscador de Alumnos */}
            <form className="mb-8 p-4 bg-gray-50 rounded border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre o correo</label>
                <div className="flex gap-2">
                    <input
                        name="q"
                        defaultValue={search}
                        placeholder="Ej. Juan Perez"
                        className="border p-2 rounded w-full max-w-md"
                        autoFocus
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Buscar
                    </button>

                    {search && (
                        <Link href="/reports/risk" className="px-4 py-2 text-gray-600 hover:text-gray-900 border rounded bg-white">
                            Limpiar
                        </Link>
                    )}
                </div>
            </form>

            {/* KPIs Rápidos */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard label="Alumnos Detectados" value={metadata?.total_pages ? 'Ver tabla' : data.length} highlight={data.length > 0} />
            </div>

            {/* Tabla de Riesgo */}
            <div className="border rounded overflow-hidden shadow-sm mb-6">
                <table className="w-full text-left bg-white">
                    <thead className="bg-red-50 text-red-900">
                        <tr>
                            <th className="p-3 border-b font-semibold">Alumno</th>
                            <th className="p-3 border-b font-semibold">Correo</th>
                            <th className="p-3 border-b font-semibold">Promedio</th>
                            <th className="p-3 border-b font-semibold">Asistencia</th>
                            <th className="p-3 border-b font-semibold">Causa Principal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    ✅ No se encontraron alumnos en riesgo {search ? `con el término "${search}"` : ''}.
                                </td>
                            </tr>
                        ) : (
                            data.map((student, i) => {
                                const isGradeRisk = Number(student.avg_score) < 6;
                                const isAttendanceRisk = Number(student.attendance_rate) < 80;

                                return (
                                    <tr key={i} className="border-b last:border-0 hover:bg-red-50">
                                        <td className="p-3 font-medium">{student.name}</td>
                                        <td className="p-3 text-sm text-gray-600">{student.email}</td>
                                        <td className={`p-3 font-mono ${isGradeRisk ? 'text-red-600 font-bold' : ''}`}>
                                            {Number(student.avg_score).toFixed(2)}
                                        </td>
                                        <td className={`p-3 font-mono ${isAttendanceRisk ? 'text-red-600 font-bold' : ''}`}>
                                            {Number(student.attendance_rate).toFixed(1)}%
                                        </td>
                                        <td className="p-3 text-sm">
                                            {isGradeRisk && isAttendanceRisk ? '🚨 Académico y Asistencia' :
                                                isGradeRisk ? '📚 Bajo Rendimiento' : '📅 Inasistencias'}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded border">
                <Link
                    href={`/reports/risk?q=${search}&page=${currentPage - 1}`}
                    className={`px-4 py-2 border rounded bg-white ${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                    aria-disabled={currentPage <= 1}
                >
                    &larr; Anterior
                </Link>
                <span className="text-gray-600">
                    Página {currentPage} de {metadata.total_pages || 1}
                </span>
                <Link
                    href={`/reports/risk?q=${search}&page=${currentPage + 1}`}
                    className={`px-4 py-2 border rounded bg-white ${currentPage >= metadata.total_pages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                    aria-disabled={currentPage >= metadata.total_pages}
                >
                    Siguiente &rarr;
                </Link>
            </div>
        </div>
    );
}
