import { getAttendanceByGroup } from '@/lib/data';
import { AttendanceByGroup, AttendanceResponse } from '@/lib/definitions';
import Link from 'next/link';
import MetricCard from '@/components/MetricCard';
import { APP_CONFIG } from '@/lib/constants';

export default async function AttendancePage(props: {
    searchParams: Promise<{ term?: string }>;
}) {
    const searchParams = await props.searchParams;
    const term = searchParams.term || '';

    let result: AttendanceResponse | null = null;
    if (term) {
        result = await getAttendanceByGroup(term);
    }

    const data = result?.data || [];
    const kpis = result?.kpis || { lowAttendanceGroups: 0, bestGroup: null };

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans text-gray-800">
            <div className="mb-6">
                <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">&larr; Volver al Dashboard</Link>
                <h1 className="text-2xl font-bold">Asistencia Grupal</h1>
                <p className="text-gray-600">Porcentaje de asistencia promedio por grupo.</p>
            </div>

            {/* Filtro */}
            <form className="mb-8 p-4 bg-gray-50 rounded border border-gray-200 flex items-end gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                    <input
                        name="term"
                        defaultValue={term}
                        placeholder="Ej. 2024-A"
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
                    {/* KPIs */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                        <MetricCard
                            label={`Grupos < ${APP_CONFIG.THRESHOLDS.LOW_ATTENDANCE_GROUP}% Asistencia`}
                            value={kpis.lowAttendanceGroups}
                            highlight={kpis.lowAttendanceGroups > 0}
                        />
                        {kpis.bestGroup && (
                            <MetricCard
                                label="Mejor Asistencia"
                                value={`${Number(kpis.bestGroup.attendance_pct).toFixed(1)}% (${kpis.bestGroup.course})`}
                            />
                        )}
                    </div>

                    {/* Tabla con Barras */}
                    <div className="border rounded overflow-hidden shadow-sm mb-6">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="p-3 border-b font-semibold">Grupo</th>
                                    <th className="p-3 border-b font-semibold">Periodo</th>
                                    <th className="p-3 border-b font-semibold">Asistencia</th>
                                    <th className="p-3 border-b font-semibold w-1/3">Visualización</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No hay registros de asistencia para el periodo "{term}".
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row: AttendanceByGroup, i: number) => {
                                        const pct = Number(row.attendance_pct);
                                        const isLow = pct < 85;

                                        return (
                                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="p-3 font-medium">{row.course}</td>
                                                <td className="p-3">{row.term}</td>
                                                <td className={`p-3 font-mono font-bold ${isLow ? 'text-red-600' : 'text-green-700'}`}>
                                                    {pct.toFixed(1)}%
                                                </td>
                                                <td className="p-3 align-middle">
                                                    {/* Barra de Progreso */}
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                                                            style={{ width: `${pct}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
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
                    Consulta la asistencia promedio por grupo ingresando un periodo.
                </div>
            )}
        </div>
    );
}
