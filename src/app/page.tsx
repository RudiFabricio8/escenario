import ReportCard from '@/components/ReportCard';

export default function Dashboard() {
  const reports = [
    {
      name: 'Rendimiento de Cursos',
      path: '/reports/performance',
      desc: 'Promedios, reprobados y análisis por periodo.'
    },
    {
      name: 'Carga Docente',
      path: '/reports/workload',
      desc: 'Grupos y alumnos totales por profesor (HAVING).'
    },
    {
      name: 'Alumnos en Riesgo',
      path: '/reports/risk',
      desc: 'Promedio bajo o inasistencias (CTE + Search).'
    },
    {
      name: 'Ranking Académico',
      path: '/reports/rank',
      desc: 'Top estudiantes por programa (Window Functions).'
    },
    {
      name: 'Asistencia Grupal',
      path: '/reports/attendance',
      desc: 'Porcentaje de asistencia por grupo.'
    },
  ];

  return (
    <main className="min-h-screen p-8 bg-white font-sans text-gray-800">
      <header className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold mb-1">Coordinación Académica</h1>
        <p className="text-gray-500">Sistema de Reportes</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
        {reports.map((report) => (
          <ReportCard
            key={report.path}
            name={report.name}
            path={report.path}
            desc={report.desc}
          />
        ))}
      </div>
    </main>
  );
}