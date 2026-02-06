import { getRankStudents } from '@/lib/data';
import { RankStudent } from '@/lib/definitions';
import Link from 'next/link';

// Whitelist de programas permitidos
const PROGRAMS = ['ISC', 'IND', 'MEC', 'ADM'];

export default async function RankPage(props: {
    searchParams: Promise<{ term?: string; program?: string }>;
}) {
    const searchParams = await props.searchParams;
    const term = searchParams.term || '';
    const program = searchParams.program || '';

    let data: RankStudent[] = [];

    // Solo buscamos si ambos filtros están presentes
    if (term && program) {
        data = await getRankStudents(term, program);
    }

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans text-gray-800">
            <div className="mb-6">
                <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">&larr; Volver al Dashboard</Link>
                <h1 className="text-2xl font-bold">Ranking Académico</h1>
                <p className="text-gray-600">Top estudiantes por programa y periodo (Window Functions).</p>
            </div>

            {/* Filtros Dobles */}
            <form className="mb-8 p-4 bg-gray-50 rounded border border-gray-200 flex items-end gap-4 flex-wrap">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                    <input
                        name="term"
                        defaultValue={term}
                        placeholder="Ej. 2024A"
                        className="border p-2 rounded w-40"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                    <select
                        name="program"
                        defaultValue={program}
                        className="border p-2 rounded w-48 bg-white"
                        required
                    >
                        <option value="" disabled>Seleccionar...</option>
                        {PROGRAMS.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                    Consultar Ranking
                </button>
            </form>

            {term && program ? (
                <>
                    {/* Tabla de Ranking */}
                    <div className="border rounded overflow-hidden shadow-sm mb-6">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-purple-50 text-purple-900">
                                <tr>
                                    <th className="p-3 border-b font-semibold w-24">Posición</th>
                                    <th className="p-3 border-b font-semibold">Estudiante</th>
                                    <th className="p-3 border-b font-semibold">Programa</th>
                                    <th className="p-3 border-b font-semibold">Promedio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No hay datos para {program} en {term}.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, i) => {
                                        // Destacar el Top 3
                                        const isTop3 = Number(row.ranking) <= 3;
                                        return (
                                            <tr key={i} className={`border-b last:border-0 hover:bg-purple-50 ${isTop3 ? 'bg-purple-50/30' : ''}`}>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold
                            ${row.ranking == 1 ? 'bg-yellow-100 text-yellow-700' :
                                                            row.ranking == 2 ? 'bg-gray-200 text-gray-700' :
                                                                row.ranking == 3 ? 'bg-orange-100 text-orange-800' : 'text-gray-500'}`
                                                    }>
                                                        {row.ranking}
                                                    </span>
                                                </td>
                                                <td className={`p-3 ${isTop3 ? 'font-bold text-gray-900' : ''}`}>{row.name}</td>
                                                <td className="p-3 text-sm text-gray-600">{row.program}</td>
                                                <td className="p-3 font-mono font-medium">{Number(row.score).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="p-10 bg-gray-50 border border-dashed rounded text-center text-gray-500">
                    Selecciona periodo y programa para ver el cuadro de honor.
                </div>
            )}
        </div>
    );
}
