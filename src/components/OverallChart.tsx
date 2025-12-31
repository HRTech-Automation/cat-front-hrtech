'use client';

import { Sensor } from '@/types/temperature';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import StatusLED from './StatusLED';

interface OverallChartProps {
  sensors: Sensor[];
}

// Cores para cada sensor
const SENSOR_COLORS = [
  '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#ec4899', '#8b5cf6', '#f97316', '#84cc16', '#06b6d4'
];

export default function OverallChart({ sensors }: OverallChartProps) {
  // Gerar dados históricos para todos os sensores
  const generateAllSensorsData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // A cada 30 minutos
      
      const dataPoint: any = {
        time: timestamp.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        fullTime: timestamp.toLocaleString('pt-BR')
      };
      
      // Adicionar dados de cada sensor
      sensors.forEach((sensor, index) => {
        // Simular variação histórica baseada na temperatura atual
        const variation = (Math.random() - 0.5) * 2; // ±1°C de variação
        dataPoint[`sensor_${sensor.id}`] = Number((sensor.currentTemperature + variation).toFixed(1));
        dataPoint[`sensor_${sensor.id}_name`] = sensor.name;
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const chartData = generateAllSensorsData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-300 p-3 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-slate-900 mb-2">{`Horário: ${payload[0]?.payload?.fullTime}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.payload[`sensor_${entry.dataKey.replace('sensor_', '')}_name`]}: ${entry.value.toFixed(1)}°C`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex gap-[1vw]">
      {/* Área do Gráfico */}
      <div className="flex-1 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              fontSize="0.6vw"
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#64748b"
              fontSize="0.6vw"
              domain={[-18, 2]}
              tickFormatter={(value) => `${value}°C`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Linhas de referência para as zonas de temperatura */}
            <ReferenceLine y={-2} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} />
            <ReferenceLine y={-6} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={1} />
            <ReferenceLine y={-15} stroke="#10b981" strokeDasharray="5 5" strokeWidth={1} />
            
            {/* Uma linha para cada sensor */}
            {sensors.map((sensor, index) => (
              <Line 
                key={sensor.id}
                type="monotone" 
                dataKey={`sensor_${sensor.id}`}
                stroke={SENSOR_COLORS[index % SENSOR_COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 1 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legenda das zonas de temperatura */}
        <div className="mt-[0.3vh] flex gap-[0.8vw] text-slate-600 text-[0.7vw] lg:text-[0.6vw] xl:text-[0.5vw]">
          <div className="flex items-center gap-[0.2vw]">
            <div className="w-[0.6vw] h-[0.1vh] bg-emerald-500"></div>
            <span>Ideal (-15°C a -6°C)</span>
          </div>
          <div className="flex items-center gap-[0.2vw]">
            <div className="w-[0.6vw] h-[0.1vh] bg-amber-500"></div>
            <span>Atenção (-6°C a -2°C)</span>
          </div>
          <div className="flex items-center gap-[0.2vw]">
            <div className="w-[0.6vw] h-[0.1vh] bg-red-500"></div>
            <span>Crítico (&gt;-2°C)</span>
          </div>
        </div>
      </div>

      {/* Legenda dos Sensores - Canto Direito */}
      <div className="w-[15vw] bg-white border border-slate-200 rounded-lg h-full flex flex-col shadow-sm">
        <h4 className="text-slate-900 font-semibold text-[0.9vw] lg:text-[0.8vw] xl:text-[0.7vw] p-[0.5vh] border-b border-slate-200 flex-shrink-0">
          Sensores
        </h4>
        <div className="flex-1 overflow-y-auto p-[0.5vh] space-y-[0.3vh] chart-legend-scroll">
          {sensors.map((sensor, index) => (
            <div key={sensor.id} className="flex items-center gap-[0.4vw] p-[0.3vh] rounded hover:bg-slate-50 transition-colors">
              <div 
                className="w-[1vw] h-[0.2vh] rounded flex-shrink-0" 
                style={{ backgroundColor: SENSOR_COLORS[index % SENSOR_COLORS.length] }}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-700 text-[0.8vw] lg:text-[0.7vw] xl:text-[0.6vw] font-medium truncate">
                  {sensor.name}
                </div>
                <div className="text-slate-600 text-[0.7vw] lg:text-[0.6vw] xl:text-[0.5vw] truncate">
                  {sensor.location}
                </div>
              </div>
              <div className="flex items-center gap-[0.2vw] flex-shrink-0">
                <div className={`text-[0.8vw] lg:text-[0.7vw] xl:text-[0.6vw] font-bold ${
                  sensor.status === 'normal' ? 'text-emerald-600' :
                  sensor.status === 'warning' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {sensor.currentTemperature.toFixed(1)}°C
                </div>
                <StatusLED status={sensor.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}