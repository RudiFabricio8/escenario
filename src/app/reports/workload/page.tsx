import { getTeacherLoad } from '@/lib/data';
import { TeacherLoad } from '@/lib/definitions';
import Link from 'next/link';
import MetricCard from '@/components/MetricCard';

export default async function WorkloadPage(props: {
    searchParams: Promise<{ term?: string; page?: string }>;
}) {
    const searchParams = await props.searchParams;
    const term = searchParams.term || '';
    const currentPage = Number(searchParams.page) || 1;

    let data: TeacherLoad[] = [];
    let totalPages = 1;

    if (term) {
        const result = await getTeacherLoad(term, currentPage);
        data = result.data;
        totalPages = result.metadata.total_pages;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans text-gray-800">
            <div className="mb-6">
                <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">&larr; Volver al Dashboard</Link>
                <h1 className="text-2xl font-bold">Carga Docente</h1>
                <p className="text-gray-600">Grupos y alumnos totales por docente (HAVING).</p>
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
                    {/* KPI Simple con MetricCard */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard label="Docentes en Página" value={data.length} />
                    </div>

                    {/* Tabla */}
                    <div className="border rounded overflow-hidden shadow-sm mb-6">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3 border-b font-semibold">Docente</th>
                                    <th className="p-3 border-b font-semibold">Periodo</th>
                                    <th className="p-3 border-b font-semibold">Grupos</th>
                                    <th className="p-3 border-b font-semibold">Total Alumnos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No se encontraron docentes con carga en "{term}".
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="p-3 font-medium">{row.teacher}</td>
                                            <td className="p-3">{row.term}</td>
                                            <td className="p-3">{row.group_count}</td>
                                            <td className="p-3">{row.total_students}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded border">
                        <Link
                            href={`/reports/workload?term=${term}&page=${currentPage - 1}`}
                            className={`px-4 py-2 border rounded bg-white ${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                            aria-disabled={currentPage <= 1}
                        >
                            &larr; Anterior
                        </Link>
                        <span className="text-gray-600">
                            Página {currentPage} de {totalPages || 1}
                        </span>
                        <Link
                            href={`/reports/workload?term=${term}&page=${currentPage + 1}`}
                            className={`px-4 py-2 border rounded bg-white ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                            aria-disabled={currentPage >= totalPages}
                        >
                            Siguiente &rarr;
                        </Link>
                    </div>
                </>
            ) : (
                <div className="p-10 bg-gray-50 border border-dashed rounded text-center text-gray-500">
                    Ingresa un periodo para consultar la carga docente. Ej: "2024A".
                </div>
            )}
        </div>
    );
}
