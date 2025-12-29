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
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">{`Contagem: ${data.count}`}</p>
          <p className="text-gray-300">{`Porcentagem: ${data.value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => null; // Remove a legenda

  if (data.total === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-[1vh] h-full flex flex-col">
        <h3 className="font-semibold text-white mb-[1vh] flex-shrink-0 text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw]">{title}</h3>
        <div className="flex items-center justify-center flex-1 text-gray-500 text-[1vw] lg:text-[0.8vw] xl:text-[0.6vw]">
          Sem dados disponíveis
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-[1vh] h-full flex flex-col">
      <h3 className="font-semibold text-white mb-[1vh] flex-shrink-0 text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw]">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="25%"
              outerRadius="70%"
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
      
      <div className="grid grid-cols-3 gap-[0.5vw] text-center flex-shrink-0">
        <div className="bg-gray-800 p-[0.5vh] rounded">
          <div className="text-green-400 font-bold text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw]">{data.normal.count}</div>
          <div className="text-gray-400 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">Normal</div>
        </div>
        <div className="bg-gray-800 p-[0.5vh] rounded">
          <div className="text-yellow-400 font-bold text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw]">{data.warning.count}</div>
          <div className="text-gray-400 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">Atenção</div>
        </div>
        <div className="bg-gray-800 p-[0.5vh] rounded">
          <div className="text-red-400 font-bold text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw]">{data.critical.count}</div>
          <div className="text-gray-400 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">Crítico</div>
        </div>
      </div>
    </div>
  );
}