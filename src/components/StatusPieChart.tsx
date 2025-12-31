'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusPieChartProps {
  data: {
    normal: { count: number; percentage: number };
    warning: { count: number; percentage: number };
    critical: { count: number; percentage: number };
    total: number;
  };
  title: string;
}

const COLORS = {
  normal: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444'
};

export default function StatusPieChart({ data, title }: StatusPieChartProps) {
  const chartData = [
    {
      name: 'Normal',
      value: data.normal.percentage,
      count: data.normal.count,
      color: COLORS.normal
    },
    {
      name: 'Atenção',
      value: data.warning.percentage,
      count: data.warning.count,
      color: COLORS.warning
    },
    {
      name: 'Crítico',
      value: data.critical.percentage,
      count: data.critical.count,
      color: COLORS.critical
    }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-300 p-3 rounded-lg shadow-lg">
          <p className="text-slate-900 font-medium">{data.name}</p>
          <p className="text-slate-700">{`Contagem: ${data.count}`}</p>
          <p className="text-slate-700">{`Porcentagem: ${data.value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => null; // Remove a legenda

  if (data.total === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-[0.6vh] h-full flex flex-col shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-[0.6vh] flex-shrink-0 text-[1.4vw] lg:text-[1.2vw] xl:text-[1vw]">{title}</h3>
        <div className="flex items-center justify-center flex-1 text-slate-500 text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw]">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-[0.3vh] h-full flex flex-col shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-[0.2vh] flex-shrink-0 text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw]">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius="25%"
              outerRadius="60%"
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-[0.2vw] text-center flex-shrink-0">
        <div className="bg-slate-100 p-[0.2vh] rounded border border-slate-200">
          <div className="text-emerald-600 font-bold text-[1.4vw] lg:text-[1.1vw] xl:text-[0.9vw]">{data.normal.count}</div>
          <div className="text-slate-600 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">Normal</div>
        </div>
        <div className="bg-slate-100 p-[0.2vh] rounded border border-slate-200">
          <div className="text-amber-600 font-bold text-[1.4vw] lg:text-[1.1vw] xl:text-[0.9vw]">{data.warning.count}</div>
          <div className="text-slate-600 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">Atenção</div>
        </div>
        <div className="bg-slate-100 p-[0.2vh] rounded border border-slate-200">
          <div className="text-red-600 font-bold text-[1.4vw] lg:text-[1.1vw] xl:text-[0.9vw]">{data.critical.count}</div>
          <div className="text-slate-600 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">Crítico</div>
        </div>
      </div>
    </div>
  );
}