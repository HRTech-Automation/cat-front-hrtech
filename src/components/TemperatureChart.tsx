import { TemperatureReading } from '@/types/temperature';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TemperatureChartProps {
  data: TemperatureReading[];
  title: string;
  height?: number | string;
}

export default function TemperatureChart({ data, title, height = 300 }: TemperatureChartProps) {
  const chartData = data.map(reading => ({
    time: reading.timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    temperature: reading.temperature,
    status: reading.status,
    fullTime: reading.timestamp.toLocaleString('pt-BR')
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="font-medium text-white">{`Horário: ${data.fullTime}`}</p>
          <p className="text-purple-400">
            {`Temperatura: ${payload[0].value.toFixed(1)}°C`}
          </p>
          <p className={`text-sm ${
            data.status === 'normal' ? 'text-green-400' :
            data.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            Status: {data.status === 'normal' ? 'Normal' :
                    data.status === 'warning' ? 'Atenção' : 'Crítico'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-[0.3vh] h-full flex flex-col">
      <h3 className="font-semibold text-white mb-[0.2vh] flex-shrink-0 text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw]">{title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize="0.6vw"
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize="0.6vw"
              domain={[-18, 0]}
              tickFormatter={(value) => `${value}°C`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Linhas de referência para as zonas de temperatura */}
            <ReferenceLine y={-2} stroke="#ef4444" strokeDasharray="5 5" />
            <ReferenceLine y={-6} stroke="#f59e0b" strokeDasharray="5 5" />
            <ReferenceLine y={-15} stroke="#10b981" strokeDasharray="5 5" />
            
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 1, r: 2 }}
              activeDot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 2, fill: '#a78bfa' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-[0.4vw] text-gray-400 flex-shrink-0 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">
        <div className="flex items-center gap-[0.2vw]">
          <div className="w-[0.5vw] h-[0.1vh] bg-green-500"></div>
          <span>Ideal</span>
        </div>
        <div className="flex items-center gap-[0.2vw]">
          <div className="w-[0.5vw] h-[0.1vh] bg-yellow-500"></div>
          <span>Atenção</span>
        </div>
        <div className="flex items-center gap-[0.2vw]">
          <div className="w-[0.5vw] h-[0.1vh] bg-red-500"></div>
          <span>Crítico</span>
        </div>
      </div>
    </div>
  );
}