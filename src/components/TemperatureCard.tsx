import { Sensor } from '@/types/temperature';
import { formatTemperature } from '@/utils/temperatureUtils';
import StatusLED from './StatusLED';
import { Thermometer, MapPin, Clock } from 'lucide-react';

interface TemperatureCardProps {
  sensor: Sensor;
}

export default function TemperatureCard({ sensor }: TemperatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">{sensor.name}</h3>
        </div>
        <StatusLED status={sensor.status} size="lg" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{sensor.location}</span>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">
            {formatTemperature(sensor.currentTemperature)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Temperatura Atual
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Clock className="w-3 h-3" />
          <span>Atualizado: {sensor.lastUpdate.toLocaleTimeString('pt-BR')}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Status: <span className={`font-medium ${
              sensor.status === 'normal' ? 'text-green-600' :
              sensor.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {sensor.status === 'normal' ? 'Normal' :
               sensor.status === 'warning' ? 'Atenção' : 'Crítico'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}